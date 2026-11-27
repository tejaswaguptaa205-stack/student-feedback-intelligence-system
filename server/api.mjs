import crypto from 'node:crypto';
import { db, generateId, hashPassword, verifyPassword } from './db.mjs';

// Helper to parse JSON request body
export async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

// JSON response helper
export function sendJson(res, statusCode, data) {
  if (res.headersSent) return true;
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
  return true;
}

// Extract authenticated session from Authorization header
export function getAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  if (!token) return null;

  const session = db.prepare(`
    SELECT s.*, u.id as user_id, u.role, u.email, u.full_name, u.institutional_id,
           u.department, u.course, u.academic_year, u.designation, u.status
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token);

  if (!session) return null;
  if (session.status !== 'active') return null;

  return {
    id: session.user_id,
    role: session.role,
    email: session.email,
    full_name: session.full_name,
    institutional_id: session.institutional_id,
    department: session.department,
    course: session.course,
    academic_year: session.academic_year,
    designation: session.designation,
    status: session.status,
    sessionToken: token
  };
}

// Record an audit log entry
export function recordAuditLog(userId, userEmail, role, action, targetType, targetId, details, req) {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1') : '127.0.0.1';
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_email, role, action, target_type, target_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      generateId('aud'),
      userId || null,
      userEmail || null,
      role || null,
      action,
      targetType || null,
      targetId || null,
      typeof details === 'object' ? JSON.stringify(details) : details,
      ip
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

// Add notification
export function createNotification(userId, title, message, type = 'info', relatedFeedbackId = null) {
  try {
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, related_feedback_id, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, datetime('now'))
    `).run(generateId('notif'), userId, title, message, type, relatedFeedbackId);
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
}

// Main API Dispatcher
export async function handleApiRequest(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    });
    res.end();
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
  const pathname = url.pathname;
  const method = req.method;

  try {
    // -------------------------------------------------------------
    // AUTHENTICATION ROUTES
    // -------------------------------------------------------------

    // 1. POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password, requestedRole } = body;

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Institutional email and password are required.' });
      }

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid credentials. User does not exist.' });
      }

      const isValid = verifyPassword(password, user.salt, user.password_hash);
      if (!isValid) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      // Check role constraints if specified
      if (requestedRole && requestedRole !== user.role) {
        return sendJson(res, 403, {
          error: `Account role mismatch: this account is registered as '${user.role}', not '${requestedRole}'. Please use the appropriate login portal.`
        });
      }

      // Check account activation states
      if (user.status === 'disabled') {
        return sendJson(res, 403, {
          error: 'Your account has been deactivated. Please contact the university administrator.'
        });
      }
      if (user.status === 'pending') {
        return sendJson(res, 403, {
          error: 'Your faculty account is pending administrative approval. An administrator must verify your credentials before access is granted.'
        });
      }

      // Create session
      const token = crypto.randomBytes(32).toString('hex');
      const sessionId = generateId('sess');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      db.prepare(`
        INSERT INTO sessions (id, token, user_id, role, created_at, expires_at)
        VALUES (?, ?, ?, ?, datetime('now'), ?)
      `).run(sessionId, token, user.id, user.role, expiresAt);

      recordAuditLog(user.id, user.email, user.role, 'LOGIN', 'user', user.id, 'User successfully authenticated.', req);

      return sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          full_name: user.full_name,
          institutional_id: user.institutional_id,
          department: user.department,
          course: user.course,
          academic_year: user.academic_year,
          designation: user.designation,
          status: user.status
        }
      });
    }

    // 2. POST /api/auth/register-student
    if (pathname === '/api/auth/register-student' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password, full_name, institutional_id, department, course, academic_year } = body;

      if (!email || !password || !full_name || !institutional_id) {
        return sendJson(res, 400, { error: 'Full name, institutional email, student ID, and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanId = institutional_id.trim();

      // Duplicate email check
      const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
      if (existingEmail) {
        return sendJson(res, 409, { error: 'A user account with this institutional email already exists.' });
      }

      // Duplicate institutional ID check
      const existingId = db.prepare('SELECT id FROM users WHERE institutional_id = ?').get(cleanId);
      if (existingId) {
        return sendJson(res, 409, { error: 'A student account with this Student ID already exists.' });
      }

      const { salt, hash } = hashPassword(password);
      const newUserId = generateId('usr_stu');
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, course, academic_year, status, created_at, updated_at)
        VALUES (?, 'student', ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `).run(
        newUserId, cleanEmail, hash, salt, full_name.trim(), cleanId,
        department || 'General', course || 'Undergraduate', academic_year || 'Year 1',
        now, now
      );

      recordAuditLog(newUserId, cleanEmail, 'student', 'REGISTER_STUDENT', 'user', newUserId, 'New student registered and activated.', req);

      createNotification(
        newUserId,
        'Welcome to SFIS Student Portal',
        `Welcome ${full_name}! Your student feedback account is ready. You can submit complaints, track resolution times, and review AI classification in real time.`,
        'success'
      );

      // Auto-login session creation
      const token = crypto.randomBytes(32).toString('hex');
      const sessionId = generateId('sess');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO sessions (id, token, user_id, role, created_at, expires_at)
        VALUES (?, ?, ?, 'student', datetime('now'), ?)
      `).run(sessionId, token, newUserId, expiresAt);

      return sendJson(res, 201, {
        message: 'Student account registered successfully.',
        token,
        user: {
          id: newUserId,
          role: 'student',
          email: cleanEmail,
          full_name: full_name.trim(),
          institutional_id: cleanId,
          department: department || 'General',
          course: course || 'Undergraduate',
          academic_year: academic_year || 'Year 1',
          status: 'active'
        }
      });
    }

    // 3. POST /api/auth/register-faculty
    if (pathname === '/api/auth/register-faculty' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password, full_name, institutional_id, department, designation } = body;

      if (!email || !password || !full_name || !institutional_id) {
        return sendJson(res, 400, { error: 'Full name, institutional email, employee ID, and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanId = institutional_id.trim();

      const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
      if (existingEmail) {
        return sendJson(res, 409, { error: 'A user account with this institutional email already exists.' });
      }

      const existingId = db.prepare('SELECT id FROM users WHERE institutional_id = ?').get(cleanId);
      if (existingId) {
        return sendJson(res, 409, { error: 'A faculty account with this Employee ID already exists.' });
      }

      const { salt, hash } = hashPassword(password);
      const newUserId = generateId('usr_fac');
      const now = new Date().toISOString();

      // Faculty accounts start in 'pending' status until verified by administrator
      db.prepare(`
        INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, designation, status, created_at, updated_at)
        VALUES (?, 'faculty', ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
      `).run(
        newUserId, cleanEmail, hash, salt, full_name.trim(), cleanId,
        department || 'General', designation || 'Assistant Professor',
        now, now
      );

      recordAuditLog(newUserId, cleanEmail, 'faculty', 'REGISTER_FACULTY', 'user', newUserId, 'Faculty registered, awaiting admin approval.', req);

      return sendJson(res, 201, {
        message: 'Faculty registration submitted successfully. Your account is currently pending administrative verification before activation.',
        pendingApproval: true
      });
    }

    // 4. GET /api/auth/me
    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = getAuthenticatedUser(req);
      if (!user) {
        return sendJson(res, 401, { error: 'Unauthorized or session expired.' });
      }
      return sendJson(res, 200, { user });
    }

    // 5. POST /api/auth/logout
    if (pathname === '/api/auth/logout' && method === 'POST') {
      const user = getAuthenticatedUser(req);
      if (user && user.sessionToken) {
        db.prepare('DELETE FROM sessions WHERE token = ?').run(user.sessionToken);
        recordAuditLog(user.id, user.email, user.role, 'LOGOUT', 'session', null, 'User logged out.', req);
      }
      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // USER MANAGEMENT ROUTES (ADMIN ONLY)
    // -------------------------------------------------------------

    // 6. GET /api/users
    if (pathname === '/api/users' && method === 'GET') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const roleFilter = url.searchParams.get('role');
      const statusFilter = url.searchParams.get('status');

      let query = `
        SELECT id, role, email, full_name, institutional_id, department,
               course, academic_year, designation, status, created_at, updated_at
        FROM users WHERE 1=1
      `;
      const params = [];

      if (roleFilter && roleFilter !== 'all') {
        query += ' AND role = ?';
        params.push(roleFilter);
      }
      if (statusFilter && statusFilter !== 'all') {
        query += ' AND status = ?';
        params.push(statusFilter);
      }

      query += ' ORDER BY created_at DESC';
      const users = db.prepare(query).all(...params);

      // Summary counts
      const counts = db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
          SUM(CASE WHEN role = 'faculty' THEN 1 ELSE 0 END) as faculty,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingApproval,
          SUM(CASE WHEN status = 'disabled' THEN 1 ELSE 0 END) as disabled
        FROM users
      `).get();

      return sendJson(res, 200, { users, counts });
    }

    // 7. PATCH /api/users/:id/status or /api/users/:id/approve
    const userStatusMatch = pathname.match(/^\/api\/users\/([^/]+)\/(status|approve)$/);
    if (userStatusMatch && method === 'PATCH') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const targetUserId = userStatusMatch[1];
      const isApproveAction = userStatusMatch[2] === 'approve';
      const body = await parseJsonBody(req);
      const status = isApproveAction ? 'active' : body.status;

      if (!['active', 'disabled', 'pending'].includes(status)) {
        return sendJson(res, 400, { error: "Invalid status. Must be 'active', 'disabled', or 'pending'." });
      }

      const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(targetUserId);
      if (!targetUser) {
        return sendJson(res, 404, { error: 'User not found.' });
      }

      db.prepare(`UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, targetUserId);

      // If status changed to disabled, invalidate their active sessions immediately
      if (status === 'disabled') {
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(targetUserId);
      }

      // Notify the user
      if (status === 'active' && targetUser.status === 'pending') {
        createNotification(
          targetUserId,
          'Faculty Account Approved',
          'Your institutional faculty account has been approved by the Administrator. You now have full access to the Faculty Feedback Portal.',
          'success'
        );
      } else if (status === 'disabled') {
        createNotification(
          targetUserId,
          'Account Deactivated',
          'Your account access has been suspended by the academic administrator.',
          'critical'
        );
      }

      recordAuditLog(
        authUser.id, authUser.email, 'admin', 'USER_STATUS_CHANGE', 'user', targetUserId,
        `Admin changed status of ${targetUser.email} (${targetUser.role}) from ${targetUser.status} to ${status}.`,
        req
      );

      const updated = db.prepare(`
        SELECT id, role, email, full_name, institutional_id, department,
               course, academic_year, designation, status, created_at, updated_at
        FROM users WHERE id = ?
      `).get(targetUserId);

      return sendJson(res, 200, { user: updated });
    }

    // -------------------------------------------------------------
    // FEEDBACK ROUTES (ROLE-PROTECTED)
    // -------------------------------------------------------------

    // 8. GET /api/feedback
    if (pathname === '/api/feedback' && method === 'GET') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: 'Unauthorized. Please sign in.' });
      }

      const sourceRole = url.searchParams.get('sourceRole');
      const category = url.searchParams.get('category');
      const priority = url.searchParams.get('priority');
      const status = url.searchParams.get('status');
      const department = url.searchParams.get('department');
      const isConfidential = url.searchParams.get('isConfidential');

      let query = `SELECT * FROM feedback WHERE 1=1`;
      const params = [];

      // Role-based scoping
      if (authUser.role === 'student') {
        // Students can only see their own feedback
        query += ` AND submitter_id = ?`;
        params.push(authUser.id);
      } else if (authUser.role === 'faculty') {
        // Faculty can only see their own feedback
        query += ` AND submitter_id = ?`;
        params.push(authUser.id);
      } else if (authUser.role === 'admin') {
        // Admin can view all, but respect filters
        if (sourceRole && sourceRole !== 'all') {
          query += ` AND submitter_role = ?`;
          params.push(sourceRole);
        }
        if (isConfidential === 'true') {
          query += ` AND is_confidential = 1`;
        }
      }

      if (category && category !== 'all') {
        query += ` AND category = ?`;
        params.push(category);
      }
      if (priority && priority !== 'all') {
        query += ` AND priority = ?`;
        params.push(priority);
      }
      if (status && status !== 'all') {
        query += ` AND status = ?`;
        params.push(status);
      }
      if (department && department !== 'all') {
        query += ` AND department = ?`;
        params.push(department);
      }

      query += ` ORDER BY created_at DESC`;
      const rows = db.prepare(query).all(...params);

      // Hydrate with notes, reviews, and history
      const feedbackItems = rows.map(r => {
        const review = db.prepare('SELECT * FROM feedback_reviews WHERE feedback_id = ?').get(r.id);
        const notes = db.prepare('SELECT * FROM feedback_notes WHERE feedback_id = ? ORDER BY timestamp ASC').all(r.id);
        const history = db.prepare('SELECT * FROM feedback_history WHERE feedback_id = ? ORDER BY timestamp ASC').all(r.id);

        let categoryScores = undefined;
        try { categoryScores = r.category_scores ? JSON.parse(r.category_scores) : undefined; } catch (e) {}

        let extractedKeywords = [];
        try { extractedKeywords = r.extracted_keywords ? JSON.parse(r.extracted_keywords) : []; } catch (e) {}

        let explainabilityTokens = undefined;
        try { explainabilityTokens = r.explainability_tokens ? JSON.parse(r.explainability_tokens) : undefined; } catch (e) {}

        return {
          id: r.id,
          submitterId: r.submitter_id,
          submitterRole: r.submitter_role,
          text: r.text,
          department: r.department,
          selectedCategory: r.selected_category,
          submissionType: r.submission_type,
          isAnonymous: Boolean(r.is_anonymous),
          studentRefId: r.is_anonymous ? undefined : (r.student_ref_id || undefined),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          status: r.status,
          assignedTeam: r.assigned_team,
          courseSubject: r.course_subject,
          semester: r.semester,
          feedbackArea: r.feedback_area,
          isConfidential: Boolean(r.is_confidential),
          slaTargetHours: r.sla_target_hours,
          analysis: {
            category: r.category,
            categoryConfidence: r.category_confidence,
            categoryScores,
            sentiment: r.sentiment,
            sentimentConfidence: r.sentiment_confidence,
            sentimentScore: r.sentiment_score,
            priority: r.priority,
            priorityJustification: r.priority_justification,
            extractedKeywords,
            summary: r.summary,
            recommendedAction: r.recommended_action,
            modelVersion: r.model_version,
            processingTimeMs: r.processing_time_ms,
            edgeDeviceUsed: r.edge_device_used,
            isLocallyProcessed: Boolean(r.is_locally_processed),
            detectedLanguage: r.detected_language,
            similarIssueCluster: r.similar_issue_cluster,
            similarReportCount: r.similar_report_count,
            explainabilityTokens
          },
          humanReview: review ? {
            isReviewed: true,
            reviewedBy: review.reviewed_by,
            reviewedAt: review.reviewed_at,
            isConfirmed: Boolean(review.is_confirmed),
            correctedCategory: review.corrected_category,
            correctedSentiment: review.corrected_sentiment,
            correctedPriority: review.corrected_priority,
            correctionRationale: review.correction_rationale,
            notes: review.notes
          } : undefined,
          internalNotes: notes.map(n => ({
            id: n.id,
            author: n.author,
            role: n.role,
            timestamp: n.timestamp,
            note: n.note
          })),
          resolutionHistory: history.map(h => ({
            timestamp: h.timestamp,
            fromStatus: h.from_status,
            toStatus: h.to_status,
            updatedBy: h.updated_by,
            note: h.note
          }))
        };
      });

      return sendJson(res, 200, { feedback: feedbackItems });
    }

    // 9. POST /api/feedback (Submit Feedback from Student or Faculty)
    if (pathname === '/api/feedback' && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      const body = await parseJsonBody(req);
      const {
        text, department, selectedCategory, submissionType,
        isAnonymous, studentRefId, courseSubject, semester,
        feedbackArea, isConfidential, analysis
      } = body;

      if (!text || !text.trim()) {
        return sendJson(res, 400, { error: 'Feedback text is required.' });
      }

      // Anonymous enforcement: zero persistence of submitter identity
      const isAnon = Boolean(isAnonymous);
      const submitterId = isAnon ? null : (authUser ? authUser.id : null);
      const submitterRole = isAnon ? 'anonymous' : (authUser ? authUser.role : 'student');
      const cleanRefId = isAnon ? null : (studentRefId || (authUser?.institutional_id) || null);

      // Faculty confidentiality: only faculty can submit confidential feedback
      const confidentialFlag = authUser?.role === 'faculty' && Boolean(isConfidential) ? 1 : 0;

      // Extract NLP fields (must have analysis object computed by Edge NLP)
      const ana = analysis || {
        category: selectedCategory || 'General',
        categoryConfidence: 0.90,
        sentiment: 'Neutral',
        sentimentConfidence: 0.85,
        sentimentScore: 0.0,
        priority: 'Medium',
        priorityJustification: 'Standard institutional submission processed on-device.',
        extractedKeywords: ['feedback'],
        summary: text.slice(0, 100),
        recommendedAction: 'Route to respective department coordinator for review.',
        modelVersion: 'SFIS-Edge-DistilBERT-v2.4-int8',
        processingTimeMs: 14,
        edgeDeviceUsed: 'EdgeGateway-CampusNode-01 (NPU)',
        isLocallyProcessed: true,
        detectedLanguage: 'English (en-US)'
      };

      const newId = `SFIS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const now = new Date().toISOString();

      // SLA Target Hours calculation based on priority
      let slaHours = 48;
      if (ana.priority === 'Critical') slaHours = 4;
      else if (ana.priority === 'High') slaHours = 12;
      else if (ana.priority === 'Low') slaHours = 72;

      db.prepare(`
        INSERT INTO feedback (
          id, submitter_id, submitter_role, text, department, selected_category,
          category, category_confidence, category_scores, sentiment, sentiment_confidence,
          sentiment_score, priority, priority_justification, extracted_keywords, summary,
          recommended_action, model_version, processing_time_ms, edge_device_used,
          is_locally_processed, detected_language, submission_type, is_anonymous,
          student_ref_id, status, assigned_team, course_subject, semester, feedback_area,
          is_confidential, sla_target_hours, similar_issue_cluster, similar_report_count,
          explainability_tokens, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, 'Submitted', 'Unassigned', ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?
        )
      `).run(
        newId, submitterId, submitterRole, text.trim(), department || 'General',
        selectedCategory || null, ana.category, ana.categoryConfidence,
        ana.categoryScores ? JSON.stringify(ana.categoryScores) : null,
        ana.sentiment, ana.sentimentConfidence, ana.sentimentScore, ana.priority,
        ana.priorityJustification, JSON.stringify(ana.extractedKeywords || []),
        ana.summary, ana.recommendedAction, ana.modelVersion, ana.processingTimeMs,
        ana.edgeDeviceUsed, ana.isLocallyProcessed ? 1 : 0, ana.detectedLanguage,
        submissionType || 'General', isAnon ? 1 : 0, cleanRefId,
        courseSubject || null, semester || null, feedbackArea || null,
        confidentialFlag, slaHours, ana.similarIssueCluster || null,
        ana.similarReportCount || 0,
        ana.explainabilityTokens ? JSON.stringify(ana.explainabilityTokens) : null,
        now, now
      );

      // Record initial history
      db.prepare(`
        INSERT INTO feedback_history (id, feedback_id, from_status, to_status, updated_by, note, timestamp)
        VALUES (?, ?, 'Submitted', 'Submitted', 'Edge NLP Ingestion Engine', 'Submission received and on-device analysis completed.', ?)
      `).run(generateId('hist'), newId, now);

      // Audit log
      recordAuditLog(
        submitterId, isAnon ? 'anonymous' : authUser?.email, submitterRole,
        'FEEDBACK_SUBMIT', 'feedback', newId,
        { category: ana.category, priority: ana.priority, isConfidential: confidentialFlag, isAnonymous: isAnon },
        req
      );

      // Notification for student/faculty if not anonymous
      if (!isAnon && submitterId) {
        createNotification(
          submitterId,
          'Feedback Submitted Successfully',
          `Your feedback (${newId}) has been analyzed as ${ana.category} (${ana.priority} Priority). It is now in the triage queue.`,
          ana.priority === 'Critical' ? 'critical' : 'info',
          newId
        );
      }

      return sendJson(res, 201, {
        id: newId,
        message: 'Feedback submitted and analyzed successfully by Edge NLP engine.'
      });
    }

    // 10. POST /api/feedback/:id/review (Admin Human-in-the-Loop review)
    const reviewMatch = pathname.match(/^\/api\/feedback\/([^/]+)\/review$/);
    if (reviewMatch && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const feedbackId = reviewMatch[1];
      const body = await parseJsonBody(req);
      const {
        isConfirmed, correctedCategory, correctedSentiment,
        correctedPriority, rationale, notes
      } = body;

      const item = db.prepare('SELECT * FROM feedback WHERE id = ?').get(feedbackId);
      if (!item) {
        return sendJson(res, 404, { error: 'Feedback item not found.' });
      }

      const now = new Date().toISOString();
      const revId = generateId('rev');

      // Check if review already exists
      const existingRev = db.prepare('SELECT id FROM feedback_reviews WHERE feedback_id = ?').get(feedbackId);
      if (existingRev) {
        db.prepare(`
          UPDATE feedback_reviews SET
            reviewed_by = ?, reviewed_at = ?, is_confirmed = ?,
            corrected_category = ?, corrected_sentiment = ?, corrected_priority = ?,
            correction_rationale = ?, notes = ?
          WHERE feedback_id = ?
        `).run(
          authUser.full_name, now, isConfirmed ? 1 : 0,
          correctedCategory || null, correctedSentiment || null, correctedPriority || null,
          rationale || null, notes || null, feedbackId
        );
      } else {
        db.prepare(`
          INSERT INTO feedback_reviews (
            id, feedback_id, reviewed_by, reviewed_at, is_confirmed,
            corrected_category, corrected_sentiment, corrected_priority,
            correction_rationale, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          revId, feedbackId, authUser.full_name, now, isConfirmed ? 1 : 0,
          correctedCategory || null, correctedSentiment || null, correctedPriority || null,
          rationale || null, notes || null
        );
      }

      // Update feedback status to 'Reviewed' if currently 'Submitted' or 'Analyzed'
      const newStatus = item.status === 'Submitted' ? 'Reviewed' : item.status;
      db.prepare(`UPDATE feedback SET status = ?, updated_at = ? WHERE id = ?`).run(newStatus, now, feedbackId);

      // Record history
      db.prepare(`
        INSERT INTO feedback_history (id, feedback_id, from_status, to_status, updated_by, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('hist'), feedbackId, item.status, newStatus, authUser.full_name,
        isConfirmed ? 'AI analysis confirmed by reviewer.' : `Corrections applied: ${correctedCategory || ''} ${correctedPriority || ''}`,
        now
      );

      // If user is registered, notify them
      if (item.submitter_id) {
        createNotification(
          item.submitter_id,
          `Feedback ${feedbackId} Reviewed`,
          `Your feedback has been officially reviewed by ${authUser.full_name}.`,
          'info',
          feedbackId
        );
      }

      recordAuditLog(authUser.id, authUser.email, 'admin', 'FEEDBACK_REVIEW', 'feedback', feedbackId, { isConfirmed, correctedCategory, correctedPriority }, req);

      return sendJson(res, 200, { success: true, message: 'Review recorded successfully.' });
    }

    // 11. POST /api/feedback/:id/status (Admin updates status or team)
    const statusMatch = pathname.match(/^\/api\/feedback\/([^/]+)\/status$/);
    if (statusMatch && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const feedbackId = statusMatch[1];
      const body = await parseJsonBody(req);
      const { status, assignedTeam, note } = body;

      const item = db.prepare('SELECT * FROM feedback WHERE id = ?').get(feedbackId);
      if (!item) {
        return sendJson(res, 404, { error: 'Feedback item not found.' });
      }

      const now = new Date().toISOString();
      const updatedStatus = status || item.status;
      const updatedTeam = assignedTeam || item.assigned_team;

      db.prepare(`
        UPDATE feedback SET status = ?, assigned_team = ?, updated_at = ?
        WHERE id = ?
      `).run(updatedStatus, updatedTeam, now, feedbackId);

      // Record history
      db.prepare(`
        INSERT INTO feedback_history (id, feedback_id, from_status, to_status, updated_by, note, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('hist'), feedbackId, item.status, updatedStatus, authUser.full_name,
        note || `Status updated to ${updatedStatus}. Team: ${updatedTeam}`,
        now
      );

      // Add note if provided
      if (note && note.trim()) {
        db.prepare(`
          INSERT INTO feedback_notes (id, feedback_id, author, role, timestamp, note)
          VALUES (?, ?, ?, 'Admin', ?, ?)
        `).run(generateId('note'), feedbackId, authUser.full_name, now, note.trim());
      }

      // Notify submitter if known
      if (item.submitter_id) {
        createNotification(
          item.submitter_id,
          `Status Update: ${feedbackId}`,
          `Your feedback status is now '${updatedStatus}' assigned to ${updatedTeam}.`,
          updatedStatus === 'Resolved' ? 'success' : 'info',
          feedbackId
        );
      }

      recordAuditLog(authUser.id, authUser.email, 'admin', 'STATUS_CHANGE', 'feedback', feedbackId, { from: item.status, to: updatedStatus, team: updatedTeam }, req);

      return sendJson(res, 200, { success: true });
    }

    // 12. POST /api/feedback/:id/notes (Admin adds internal note)
    const noteMatch = pathname.match(/^\/api\/feedback\/([^/]+)\/notes$/);
    if (noteMatch && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const feedbackId = noteMatch[1];
      const body = await parseJsonBody(req);
      const { note } = body;

      if (!note || !note.trim()) {
        return sendJson(res, 400, { error: 'Note text is required.' });
      }

      const now = new Date().toISOString();
      const noteId = generateId('note');

      db.prepare(`
        INSERT INTO feedback_notes (id, feedback_id, author, role, timestamp, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(noteId, feedbackId, authUser.full_name, authUser.role, now, note.trim());

      return sendJson(res, 201, {
        note: { id: noteId, author: authUser.full_name, role: authUser.role, timestamp: now, note: note.trim() }
      });
    }

    // -------------------------------------------------------------
    // NOTIFICATIONS ROUTES
    // -------------------------------------------------------------

    // 13. GET /api/notifications
    if (pathname === '/api/notifications' && method === 'GET') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: 'Unauthorized.' });
      }

      const notifs = db.prepare(`
        SELECT id, title, message, type, is_read, related_feedback_id, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `).all(authUser.id);

      return sendJson(res, 200, {
        notifications: notifs.map(n => ({
          ...n,
          isRead: Boolean(n.is_read)
        }))
      });
    }

    // 14. POST /api/notifications/read-all
    if (pathname === '/api/notifications/read-all' && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return sendJson(res, 401, { error: 'Unauthorized.' });
      }

      db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(authUser.id);
      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // ANNOUNCEMENTS ROUTES (FACULTY & STUDENT PORTALS)
    // -------------------------------------------------------------

    // 15. GET /api/announcements
    if (pathname === '/api/announcements' && method === 'GET') {
      const announcements = db.prepare(`
        SELECT id, title, content, department, priority, author, created_at
        FROM departmental_announcements
        ORDER BY created_at DESC
        LIMIT 20
      `).all();

      return sendJson(res, 200, { announcements });
    }

    // 16. POST /api/announcements (Admin only)
    if (pathname === '/api/announcements' && method === 'POST') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const body = await parseJsonBody(req);
      const { title, content, department, priority } = body;

      if (!title || !content) {
        return sendJson(res, 400, { error: 'Title and content are required.' });
      }

      const annId = generateId('ann');
      db.prepare(`
        INSERT INTO departmental_announcements (id, title, content, department, priority, author, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(annId, title.trim(), content.trim(), department || 'All', priority || 'Normal', authUser.full_name);

      recordAuditLog(authUser.id, authUser.email, 'admin', 'CREATE_ANNOUNCEMENT', 'announcement', annId, { title, department }, req);

      return sendJson(res, 201, { success: true, id: annId });
    }

    // -------------------------------------------------------------
    // AUDIT LOGS & SOURCE COMPARISON ANALYTICS (ADMIN ONLY)
    // -------------------------------------------------------------

    // 17. GET /api/audit-logs
    if (pathname === '/api/audit-logs' && method === 'GET') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      const logs = db.prepare(`
        SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100
      `).all();

      return sendJson(res, 200, { auditLogs: logs });
    }

    // 18. GET /api/analytics/source-comparison
    if (pathname === '/api/analytics/source-comparison' && method === 'GET') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser || authUser.role !== 'admin') {
        return sendJson(res, 403, { error: 'Forbidden: Admin access required.' });
      }

      // Comparison metrics between Student and Faculty submissions
      const studentStats = db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN sentiment = 'Positive' THEN 1 ELSE 0 END) as positive,
          SUM(CASE WHEN sentiment = 'Neutral' THEN 1 ELSE 0 END) as neutral,
          SUM(CASE WHEN sentiment = 'Negative' THEN 1 ELSE 0 END) as negative,
          SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) as critical,
          SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high,
          SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
        FROM feedback WHERE submitter_role = 'student'
      `).get();

      const facultyStats = db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN sentiment = 'Positive' THEN 1 ELSE 0 END) as positive,
          SUM(CASE WHEN sentiment = 'Neutral' THEN 1 ELSE 0 END) as neutral,
          SUM(CASE WHEN sentiment = 'Negative' THEN 1 ELSE 0 END) as negative,
          SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) as critical,
          SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high,
          SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
          SUM(CASE WHEN is_confidential = 1 THEN 1 ELSE 0 END) as confidential
        FROM feedback WHERE submitter_role = 'faculty'
      `).get();

      return sendJson(res, 200, { studentStats, facultyStats });
    }

    // Not a matched API route
    return sendJson(res, 404, { error: `API route not found: ${method} ${pathname}` });
  } catch (err) {
    console.error(`API Error on ${method} ${pathname}:`, err);
    sendJson(res, 500, { error: 'Internal Server Error', details: err.message });
    return true;
  }
}
