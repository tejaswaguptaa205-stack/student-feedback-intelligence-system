import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve('sfis.db');
export const db = new DatabaseSync(DB_PATH);

// Helper for UUID / Unique ID generation
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

// Password hashing & timing-safe verification
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  try {
    const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(checkHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch (err) {
    return false;
  }
}

// Database schema initialization
export function initializeDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK(role IN ('admin', 'student', 'faculty')),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      full_name TEXT NOT NULL,
      institutional_id TEXT UNIQUE,
      department TEXT,
      course TEXT,
      academic_year TEXT,
      designation TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending', 'disabled')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      submitter_id TEXT,
      submitter_role TEXT NOT NULL DEFAULT 'student' CHECK(submitter_role IN ('student', 'faculty', 'anonymous')),
      text TEXT NOT NULL,
      department TEXT NOT NULL,
      selected_category TEXT,
      category TEXT NOT NULL,
      category_confidence REAL NOT NULL,
      category_scores TEXT,
      sentiment TEXT NOT NULL,
      sentiment_confidence REAL NOT NULL,
      sentiment_score REAL NOT NULL,
      priority TEXT NOT NULL,
      priority_justification TEXT NOT NULL,
      extracted_keywords TEXT NOT NULL,
      summary TEXT NOT NULL,
      recommended_action TEXT NOT NULL,
      model_version TEXT NOT NULL,
      processing_time_ms REAL NOT NULL,
      edge_device_used TEXT NOT NULL,
      is_locally_processed INTEGER NOT NULL DEFAULT 1,
      detected_language TEXT NOT NULL DEFAULT 'en',
      submission_type TEXT NOT NULL DEFAULT 'General',
      is_anonymous INTEGER NOT NULL DEFAULT 0,
      student_ref_id TEXT,
      status TEXT NOT NULL DEFAULT 'Submitted',
      assigned_team TEXT NOT NULL DEFAULT 'Unassigned',
      course_subject TEXT,
      semester TEXT,
      feedback_area TEXT,
      is_confidential INTEGER NOT NULL DEFAULT 0,
      sla_target_hours INTEGER NOT NULL DEFAULT 48,
      similar_issue_cluster TEXT,
      similar_report_count INTEGER DEFAULT 0,
      explainability_tokens TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feedback_reviews (
      id TEXT PRIMARY KEY,
      feedback_id TEXT UNIQUE NOT NULL,
      reviewed_by TEXT NOT NULL,
      reviewed_at TEXT NOT NULL,
      is_confirmed INTEGER NOT NULL DEFAULT 1,
      corrected_category TEXT,
      corrected_sentiment TEXT,
      corrected_priority TEXT,
      correction_rationale TEXT,
      notes TEXT,
      FOREIGN KEY(feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback_notes (
      id TEXT PRIMARY KEY,
      feedback_id TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      note TEXT NOT NULL,
      FOREIGN KEY(feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback_history (
      id TEXT PRIMARY KEY,
      feedback_id TEXT NOT NULL,
      from_status TEXT NOT NULL,
      to_status TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      note TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      role TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'critical')),
      is_read INTEGER NOT NULL DEFAULT 0,
      related_feedback_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS departmental_announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      department TEXT NOT NULL DEFAULT 'All',
      priority TEXT NOT NULL DEFAULT 'Normal' CHECK(priority IN ('Normal', 'Important', 'Urgent')),
      author TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_feedback_role ON feedback(submitter_role);
    CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
    CREATE INDEX IF NOT EXISTS idx_feedback_priority ON feedback(priority);
    CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
    CREATE INDEX IF NOT EXISTS idx_feedback_submitter ON feedback(submitter_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_confidential ON feedback(is_confidential);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
  `);

  seedInitialData();
}

// Seed default users, sample feedback, announcements
function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial SFIS users (Admin, Student, Faculty)...');

    const now = new Date().toISOString();

    // 1. Initial Admin (Controlled seed process, cannot be registered publicly)
    const adminPass = hashPassword('Admin@SFIS2026!');
    const adminId = 'usr_admin_default';
    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      adminId,
      'admin',
      'admin@sfis.edu',
      adminPass.hash,
      adminPass.salt,
      'Academic Registrar (Admin)',
      'ADM-001',
      'Registrar Office',
      now,
      now
    );

    // 2. Sample Student
    const studentPass = hashPassword('Student@123!');
    const studentId = 'usr_student_aarav';
    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, course, academic_year, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      studentId,
      'student',
      'student@sfis.edu',
      studentPass.hash,
      studentPass.salt,
      'Aarav Sharma',
      'STU-2024-8192',
      'School of Computing',
      'B.Tech Computer Science',
      'Year 3 (2024-2028)',
      now,
      now
    );

    // 3. Sample Faculty (Active)
    const facultyPass = hashPassword('Faculty@123!');
    const facultyId = 'usr_faculty_ramesh';
    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, designation, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      facultyId,
      'faculty',
      'faculty@sfis.edu',
      facultyPass.hash,
      facultyPass.salt,
      'Dr. Ramesh Kulkarni',
      'EMP-FAC-401',
      'School of Computing',
      'Associate Professor',
      now,
      now
    );

    // 4. Sample Faculty (Pending Approval)
    const pendingFacultyPass = hashPassword('Faculty@123!');
    const pendingFacultyId = 'usr_faculty_priya';
    db.prepare(`
      INSERT INTO users (id, role, email, password_hash, salt, full_name, institutional_id, department, designation, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(
      pendingFacultyId,
      'faculty',
      'priya.nair@sfis.edu',
      pendingFacultyPass.hash,
      pendingFacultyPass.salt,
      'Dr. Priya Nair',
      'EMP-FAC-415',
      'Department of Electrical Engineering',
      'Assistant Professor',
      now,
      now
    );

    // Initial audit log
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_email, role, action, target_type, target_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      generateId('aud'),
      adminId,
      'admin@sfis.edu',
      'admin',
      'SYSTEM_INIT',
      'system',
      'database',
      'Initial administrative seed and user configuration created.',
      '127.0.0.1',
      now
    );

    // Notifications for student & faculty
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(
      generateId('notif'),
      studentId,
      'Welcome to Student Feedback Portal',
      'Your student portal account is active. Submit feedback, track resolution status, and receive real-time notifications.',
      'success',
      now
    );

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(
      generateId('notif'),
      facultyId,
      'Faculty Feedback Portal Active',
      'Welcome Dr. Kulkarni. You can now submit departmental feedback, workload observations, or confidential concerns.',
      'info',
      now
    );
  }

  // Seed Announcements
  const announcementCount = db.prepare('SELECT COUNT(*) as count FROM departmental_announcements').get().count;
  if (announcementCount === 0) {
    const now = new Date().toISOString();
    const insertAnnounce = db.prepare(`
      INSERT INTO departmental_announcements (id, title, content, department, priority, author, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertAnnounce.run(
      generateId('ann'),
      'Fall 2026 Mid-Semester Feedback Review Protocol',
      'Faculty members are requested to review laboratory infrastructure concerns prior to the mid-term assessment cycle.',
      'School of Computing',
      'Important',
      'Dean of Academic Affairs',
      now
    );

    insertAnnounce.run(
      generateId('ann'),
      'Campus Server Maintenance Scheduled This Weekend',
      'Central IT will undergo scheduled maintenance this Sunday between 02:00 AM and 06:00 AM. Edge nodes will remain functional.',
      'All',
      'Normal',
      'Central IT Directorate',
      now
    );
  }

  // Seed Initial Feedback from mockFeedback if table is empty
  const feedbackCount = db.prepare('SELECT COUNT(*) as count FROM feedback').get().count;
  if (feedbackCount === 0) {
    console.log('Seeding initial feedback records into SQLite...');
    try {
      // Import mock feedback data
      const mockFilePath = path.resolve('src/data/mockFeedback.ts');
      if (fs.existsSync(mockFilePath)) {
        seedMockFeedbackFromFile();
      }
    } catch (err) {
      console.warn('Could not seed mock feedback from file:', err.message);
    }
  }
}

// Function to import the 30 mock items into SQLite
function seedMockFeedbackFromFile() {
  const insertFeedback = db.prepare(`
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
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertReview = db.prepare(`
    INSERT INTO feedback_reviews (
      id, feedback_id, reviewed_by, reviewed_at, is_confirmed,
      corrected_category, corrected_sentiment, corrected_priority,
      correction_rationale, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertNote = db.prepare(`
    INSERT INTO feedback_notes (id, feedback_id, author, role, timestamp, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertHist = db.prepare(`
    INSERT INTO feedback_history (id, feedback_id, from_status, to_status, updated_by, note, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // We can seed our rich items directly
  const SEED_ITEMS = [
    {
      id: "SFIS-2026-0001",
      submitter_id: "usr_student_aarav",
      submitter_role: "student",
      text: "The hostel water supply has been completely unavailable for two days, and the warden has not responded to our complaints. Students are unable to bathe or use washrooms before classes.",
      department: "Student Affairs & Housing",
      selected_category: "Hostel",
      category: "Hostel",
      category_confidence: 0.96,
      category_scores: JSON.stringify({ Hostel: 0.96, Infrastructure: 0.45, Administration: 0.22 }),
      sentiment: "Negative",
      sentiment_confidence: 0.94,
      sentiment_score: -0.88,
      priority: "High",
      priority_justification: "Time-sensitive service disruption: 48-hour water supply outage affecting student hygiene and dormitories.",
      extracted_keywords: JSON.stringify(["water supply", "hostel", "warden", "washrooms", "unresponsive"]),
      summary: "Hostel water supply has been unavailable for two days without an administrative response.",
      recommended_action: "Escalate the maintenance issue to the hostel administration and dispatch emergency water tankers.",
      model_version: "SFIS-Edge-DistilBERT-v2.4-int8",
      processing_time_ms: 18,
      edge_device_used: "EdgeGateway-CampusNode-01 (NPU)",
      is_locally_processed: 1,
      detected_language: "English (en-US)",
      submission_type: "Complaint",
      is_anonymous: 0,
      student_ref_id: "STU-2024-8192",
      status: "In Progress",
      assigned_team: "Campus Maintenance & Hostel Bureau",
      course_subject: null,
      semester: "Fall 2026",
      feedback_area: null,
      is_confidential: 0,
      sla_target_hours: 12,
      similar_issue_cluster: "Hostel-Block-C-Water-Crisis",
      similar_report_count: 7,
      explainability_tokens: JSON.stringify([
        { token: "hostel", weight: 0.95, categoryHint: "Hostel" },
        { token: "water supply", weight: 0.92, categoryHint: "Hostel" },
        { token: "unavailable", weight: 0.84 },
        { token: "warden", weight: 0.78, categoryHint: "Hostel" }
      ]),
      created_at: "2026-10-14T08:15:00Z",
      updated_at: "2026-10-14T10:00:00Z"
    },
    {
      id: "SFIS-2026-0002",
      submitter_id: null,
      submitter_role: "anonymous",
      text: "There are visible electrical sparks and a burning smell coming from the main circuit board in Computer Lab 3 near the server rack. It seems dangerous for anyone sitting in that row.",
      department: "Library & IT Infrastructure",
      selected_category: "Infrastructure",
      category: "Infrastructure",
      category_confidence: 0.98,
      category_scores: JSON.stringify({ Infrastructure: 0.98, Administration: 0.12 }),
      sentiment: "Negative",
      sentiment_confidence: 0.96,
      sentiment_score: -0.92,
      priority: "Critical",
      priority_justification: "Physical safety hazard: active electrical sparking and burning odor reported in active student lab environment.",
      extracted_keywords: JSON.stringify(["electrical sparks", "burning smell", "circuit board", "Computer Lab 3", "dangerous"]),
      summary: "Electrical sparking and burning smell from circuit board in Computer Lab 3.",
      recommended_action: "Dispatch electrical emergency response team immediately; shut down Lab 3 main circuit breaker.",
      model_version: "SFIS-Edge-DistilBERT-v2.4-int8",
      processing_time_ms: 14,
      edge_device_used: "EdgeGateway-CampusNode-01 (NPU)",
      is_locally_processed: 1,
      detected_language: "English (en-US)",
      submission_type: "Complaint",
      is_anonymous: 1,
      student_ref_id: null,
      status: "In Progress",
      assigned_team: "Electrical Safety & Disaster Response",
      course_subject: null,
      semester: "Fall 2026",
      feedback_area: null,
      is_confidential: 0,
      sla_target_hours: 4,
      similar_issue_cluster: null,
      similar_report_count: 0,
      explainability_tokens: JSON.stringify([
        { token: "electrical sparks", weight: 0.99, categoryHint: "Infrastructure" },
        { token: "burning smell", weight: 0.95 },
        { token: "dangerous", weight: 0.91 }
      ]),
      created_at: "2026-10-14T10:20:00Z",
      updated_at: "2026-10-14T10:25:00Z"
    },
    {
      id: "SFIS-2026-0003",
      submitter_id: "usr_student_aarav",
      submitter_role: "student",
      text: "Professor Sharma explained the complex dynamic programming and divide-and-conquer concepts with great clarity today. The interactive code demonstrations really helped us understand recursion tree analysis.",
      department: "School of Computing",
      selected_category: "Faculty",
      category: "Faculty",
      category_confidence: 0.95,
      category_scores: JSON.stringify({ Faculty: 0.95, Academic: 0.62 }),
      sentiment: "Positive",
      sentiment_confidence: 0.97,
      sentiment_score: 0.92,
      priority: "Low",
      priority_justification: "Pedagogical commendation with positive learning sentiment; no actionable defect reported.",
      extracted_keywords: JSON.stringify(["dynamic programming", "great clarity", "code demonstrations", "recursion tree", "understanding"]),
      summary: "Commendation for Professor Sharma's clear explanation of dynamic programming.",
      recommended_action: "Forward positive pedagogical feedback to Department Head for academic appreciation.",
      model_version: "SFIS-Edge-DistilBERT-v2.4-int8",
      processing_time_ms: 12,
      edge_device_used: "EdgeGateway-CampusNode-01 (NPU)",
      is_locally_processed: 1,
      detected_language: "English (en-US)",
      submission_type: "Appreciation",
      is_anonymous: 0,
      student_ref_id: "STU-2024-8192",
      status: "Resolved",
      assigned_team: "Faculty Affairs & Academic Audit",
      course_subject: "CS301 Data Structures & Algorithms",
      semester: "Semester 5",
      feedback_area: null,
      is_confidential: 0,
      sla_target_hours: 72,
      similar_issue_cluster: null,
      similar_report_count: 0,
      explainability_tokens: JSON.stringify([
        { token: "Professor", weight: 0.94, categoryHint: "Faculty" },
        { token: "great clarity", weight: 0.91 },
        { token: "interactive code", weight: 0.85 }
      ]),
      created_at: "2026-10-14T11:45:00Z",
      updated_at: "2026-10-14T14:00:00Z"
    },
    // Seed Faculty Submissions: Regular & Confidential
    {
      id: "SFIS-2026-0004",
      submitter_id: "usr_faculty_ramesh",
      submitter_role: "faculty",
      text: "In Advanced Database Lab 2, 14 out of 35 workstations fail to connect to the PostgreSQL local instance due to IP configuration errors. This severely hinders our practical exam preparation.",
      department: "School of Computing",
      selected_category: "Infrastructure",
      category: "Infrastructure",
      category_confidence: 0.94,
      category_scores: JSON.stringify({ Infrastructure: 0.94, Examination: 0.42 }),
      sentiment: "Negative",
      sentiment_confidence: 0.89,
      sentiment_score: -0.74,
      priority: "High",
      priority_justification: "Laboratory hardware connectivity failure affecting 40% of workstations scheduled for practical assessments.",
      extracted_keywords: JSON.stringify(["Database Lab", "PostgreSQL", "workstations", "IP configuration", "practical exam"]),
      summary: "14 workstations in Database Lab 2 unable to reach database server ahead of exams.",
      recommended_action: "IT systems administrator to re-configure subnet DHCP and verify PostgreSQL firewall rules.",
      model_version: "SFIS-Edge-DistilBERT-v2.4-int8",
      processing_time_ms: 15,
      edge_device_used: "EdgeGateway-CampusNode-01 (NPU)",
      is_locally_processed: 1,
      detected_language: "English (en-US)",
      submission_type: "Complaint",
      is_anonymous: 0,
      student_ref_id: null,
      status: "Assigned",
      assigned_team: "Campus IT & Biometric Infrastructure",
      course_subject: "CS402 Advanced Database Systems",
      semester: "Fall 2026",
      feedback_area: "Infrastructure and Laboratory Issues",
      is_confidential: 0,
      sla_target_hours: 24,
      similar_issue_cluster: "Lab-2-Network-Failures",
      similar_report_count: 3,
      explainability_tokens: JSON.stringify([
        { token: "workstations", weight: 0.92, categoryHint: "Infrastructure" },
        { token: "Lab", weight: 0.90, categoryHint: "Infrastructure" },
        { token: "IP configuration", weight: 0.86 }
      ]),
      created_at: "2026-10-15T09:30:00Z",
      updated_at: "2026-10-15T11:15:00Z"
    },
    {
      id: "SFIS-2026-0005",
      submitter_id: "usr_faculty_ramesh",
      submitter_role: "faculty",
      text: "Confidential report: Excessive timetable scheduling with consecutive 4-hour lab slots and zero break intervals violates faculty welfare policy and impacts teaching effectiveness.",
      department: "School of Computing",
      selected_category: "Administration",
      category: "Administration",
      category_confidence: 0.88,
      category_scores: JSON.stringify({ Administration: 0.88, Faculty: 0.55 }),
      sentiment: "Negative",
      sentiment_confidence: 0.85,
      sentiment_score: -0.68,
      priority: "Medium",
      priority_justification: "Faculty timetable overload and continuous block scheduling violating departmental norms.",
      extracted_keywords: JSON.stringify(["timetable scheduling", "4-hour lab", "faculty welfare", "teaching effectiveness"]),
      summary: "Faculty workload and continuous 4-hour lab timetable concern.",
      recommended_action: "Academic dean and timetable committee to re-allocate lab sessions across alternate days.",
      model_version: "SFIS-Edge-DistilBERT-v2.4-int8",
      processing_time_ms: 16,
      edge_device_used: "EdgeGateway-CampusNode-01 (NPU)",
      is_locally_processed: 1,
      detected_language: "English (en-US)",
      submission_type: "Complaint",
      is_anonymous: 0,
      student_ref_id: null,
      status: "Reviewed",
      assigned_team: "Faculty Affairs & Academic Audit",
      course_subject: "All Core Labs",
      semester: "Semester 5",
      feedback_area: "Workload and Timetable Concerns",
      is_confidential: 1,
      sla_target_hours: 48,
      similar_issue_cluster: null,
      similar_report_count: 0,
      explainability_tokens: JSON.stringify([
        { token: "timetable scheduling", weight: 0.91, categoryHint: "Administration" },
        { token: "faculty welfare", weight: 0.88 }
      ]),
      created_at: "2026-10-16T14:10:00Z",
      updated_at: "2026-10-16T16:00:00Z"
    }
  ];

  for (const item of SEED_ITEMS) {
    insertFeedback.run(
      item.id, item.submitter_id, item.submitter_role, item.text, item.department,
      item.selected_category, item.category, item.category_confidence, item.category_scores,
      item.sentiment, item.sentiment_confidence, item.sentiment_score, item.priority,
      item.priority_justification, item.extracted_keywords, item.summary,
      item.recommended_action, item.model_version, item.processing_time_ms,
      item.edge_device_used, item.is_locally_processed, item.detected_language,
      item.submission_type, item.is_anonymous, item.student_ref_id, item.status,
      item.assigned_team, item.course_subject, item.semester, item.feedback_area,
      item.is_confidential, item.sla_target_hours, item.similar_issue_cluster,
      item.similar_report_count, item.explainability_tokens, item.created_at, item.updated_at
    );

    insertHist.run(
      generateId('hist'),
      item.id,
      'Submitted',
      item.status,
      'System Auto-Triage',
      'Initial intake and NLP edge classification completed.',
      item.created_at
    );
  }

  insertReview.run(
    generateId('rev'),
    "SFIS-2026-0001",
    "Admin S. Verma (Registrar Office)",
    "2026-10-14T09:00:00Z",
    1,
    null,
    null,
    null,
    "Confirmed category and priority. Maintenance team alerted.",
    "Emergency water tankers arranged."
  );

  insertNote.run(
    generateId('note'),
    "SFIS-2026-0001",
    "S. Verma",
    "Admin Registrar",
    "2026-10-14T09:15:00Z",
    "Hostel Block C pipeline repair in progress. Water tankers dispatched."
  );
}
