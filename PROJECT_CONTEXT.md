# Student Feedback Intelligence System (SFIS) — Comprehensive Project Context & Architecture

---

## 1. Executive Summary

**SFIS (Student Feedback Intelligence System)** is an institutional governance and intelligence platform designed for higher education institutions. It bridges the critical operational gap between students, faculty, and academic administrators by analyzing feedback directly on-device using a lightweight, sub-15ms **Edge Natural Language Processing (NLP)** inference engine.

Unlike traditional survey forms or cloud-dependent LLM wrappers, SFIS guarantees:
- **100% On-Device Privacy:** Zero student feedback data is transmitted to third-party cloud APIs.
- **Tri-Role Separation:** Purpose-built, distinct portals for **Students**, **Faculty**, and **Administrators**.
- **Real-Time Automated Triage:** Automatic multi-class classification into 8 core institutional operational categories.
- **Two-Pass Urgency & SLA Calculation:** Sentiment-independent priority scoring with deterministic safety overrides and time-bound SLAs (e.g., 4-hour critical response).
- **Cryptographic Anonymity:** Provable student identity scrubbing (`NULL` database persistence) preventing deanonymization.

---

## 2. Problem Statement & Motivation

### The Challenges of Traditional Campus Feedback
1. **Manual Triage Bottlenecks:** Student complaints and suggestions sit in unread email inboxes or static spreadsheets for weeks before reaching the responsible department.
2. **Hidden Critical Emergencies:** Urgent safety hazards (e.g., electrical sparking in laboratories, campus ragging, mental distress) are buried beneath routine queries.
3. **Fear of Academic Retaliation:** Students frequently refrain from submitting honest evaluations of courses or instructors because traditional portals do not offer verifiable anonymity.
4. **Neglected Faculty Voice:** Existing institutional software focuses almost entirely on student-to-teacher evaluations, giving faculty no structured, confidential channel to report lab equipment failures, excessive teaching workloads, or administrative friction.
5. **Cloud Cost & Data Sovereignty:** Sending sensitive institutional text to proprietary cloud LLMs causes ongoing API cost escalations and violates student data privacy regulations.

---

## 3. System Architecture & Tech Stack

```
                                  ┌──────────────────────────────┐
                                  │      SFIS Auth Gateway       │
                                  │ (Session Bearer / SQLite DB) │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   ▼                             ▼                             ▼
       ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
       │     Student Portal    │     │     Faculty Portal    │     │  Admin Governance Hub │
       ├───────────────────────┤     ├───────────────────────┤     ├───────────────────────┤
       │ • Live NLP Analysis   │     │ • 9 Academic Areas    │     │ • User & Faculty Mgmt │
       │ • Anonymous Scrubbing │     │ • Course/Sem Selector │     │ • Faculty Approval    │
       │ • My Feedback Queue   │     │ • Confidential Mode   │     │ • Source Comparison   │
       │ • Real-time Tracker   │     │ • Dept Announcements  │     │ • Confidential Access │
       │ • In-App Notifications│     │ • Resolution Tracker  │     │ • Immutable Audit Log │
       └───────────┬───────────┘     └───────────┬───────────┘     └───────────┬───────────┘
                   │                             │                             │
                   └───────────────────────┬─────┴─────────────────────────────┘
                                           ▼
                       ┌───────────────────────────────────────┐
                       │   Shared Edge NLP Inference Engine    │
                       │   (TF-IDF, Heuristics, Safety, SLA)   │
                       └───────────────────────────────────────┘
                                           │
                                           ▼
                       ┌───────────────────────────────────────┐
                       │       Persistent SQLite Storage       │
                       │   (sfis.db via Node native sqlite)    │
                       └───────────────────────────────────────┘
```

### Complete Technology Stack:
* **Frontend Presentation:** React 18, TypeScript, Tailwind CSS (corporate institutional palette `#244A73`), Lucide Icons, Vite bundling.
* **Backend Application Server:** Node.js native HTTP server (`serve.mjs`), custom REST API router (`server/api.mjs`) with zero heavy framework bloat.
* **Database Layer:** Embedded SQLite (`sfis.db`) using native `node:sqlite` (`DatabaseSync`), requiring zero external native compilation tools or drivers.
* **Cryptographic Security:** Native `node:crypto` (`scryptSync` key derivation with 16-byte unique salts, `timingSafeEqual` constant-time verification, 64-character session tokens).
* **AI & NLP Engine:** Custom on-device Edge NLP pipeline (`src/services/nlpEngine.ts`) with sub-15ms local execution latency.

---

## 4. The Three Role Portals

### 4.1. Admin Governance Hub
* **Access Point:** Admin Login tab (`admin@sfis.edu` / `Admin@SFIS2026!`). Public self-registration is strictly blocked.
* **User & Faculty Governance:** Real-time directory of students and faculty; instant one-click approval of pending faculty registrations; account suspension/reactivation.
* **Feedback Explorer with Source Filters:** Filter records across all combinations of:
  * **Source Role:** Student, Faculty, Anonymous.
  * **Confidentiality:** Confidential Only vs. Standard.
  * **Category, Sentiment, Priority, Status, and Department.**
* **Security & Audit Logs:** Immutable security trail recording administrative actions, approvals, logins, and status updates with IP and timestamp metadata.
* **Operational SLA Management:** Automated SLA timers (4h Critical, 12h High, 48h Medium, 72h Low).
* **Human-in-the-Loop Review:** Allows administrators to verify or correct AI predictions; corrections are logged for model benchmarking.

### 4.2. Student Portal (`StudentPortalPage.tsx`)
* **Access Point:** User Login → Student (`student@sfis.edu` / `Student@123!`) or self-registration.
* **Real-Time Edge NLP Preview:** As the student types their feedback, an interactive card previews the predicted category, sentiment score, and calculated priority live.
* **Verified Anonymous Submission:** When toggled, the student's ID (`submitter_id` and `student_ref_id`) is permanently stripped to `NULL` before saving into `sfis.db`.
* **Personal Submission Queue ("My Feedback"):** Tracks the student's historical submissions with real-time status progression pills (`Submitted` → `Analyzed` → `Assigned` → `In Progress` → `Resolved`).
* **In-App Notification Center:** Alert bell rings when administrators take action or resolve an issue.

### 4.3. Faculty Portal (`FacultyPortalPage.tsx`)
* **Access Point:** User Login → Faculty (`faculty@sfis.edu` / `Faculty@123!`).
* **Administrative Approval Gate:** New faculty accounts start in `pending` status. Login attempts return `HTTP 403 Forbidden` until an administrator approves the account in the User Management portal.
* **9 Specialized Faculty Feedback Areas:**
  1. *Workload and Timetable Concerns*
  2. *Infrastructure and Laboratory Issues*
  3. *IT and Technical Support*
  4. *Examination Management*
  5. *Student Support Concerns*
  6. *Research and Development Support*
  7. *Administrative Process Concerns*
  8. *HR and Faculty Welfare*
  9. *Campus Safety Issues*
* **Academic Context:** Captures Course/Subject code and Semester (Sem 1 through Sem 8).
* **Confidential Reporting Mode:** High-sensitivity reports are accessible only to the Academic Registrar/Dean and hidden from general queries.
* **Departmental Announcements:** Official bulletin board for notices and administrative circulars.

---

## 5. Core Intelligence: 4-Stage Edge NLP Engine

Both student and faculty submissions flow through the exact same on-device **`analyzeFeedbackText`** pipeline (`src/services/nlpEngine.ts`):

```
Raw Input Text
      │
      ▼
[Stage 1: Tokenizer & Normalizer]
      │ Lowercase, contraction expansion, stopword removal, punctuation stripping
      ▼
[Stage 2: TF-IDF & Keyword Vectorizer]
      │ Term-frequency weighting across 8 institutional category vocabularies
      ▼
[Stage 3: Rule & Heuristic Evaluator]
      │ Domain emergency lexicons (fire, short circuit, ragging, harassment)
      ▼
[Stage 4: Two-Pass Priority Calculator]
      │ Pass 1: Baseline statistical priority (Sentiment + Ticket Type)
      │ Pass 2: Deterministic Safety Override (Emergency Flag → CRITICAL)
      ▼
Structured Analysis (Category, Sentiment, Priority, Keywords, SLA Target, Tokens)
```

### The 8 Institutional Categories:
1. **Academic:** Curriculum pacing, syllabus coverage, lecture quality.
2. **Faculty:** Teaching assistant availability, instructor accessibility.
3. **Infrastructure:** Lab PCs, air conditioning, projector, library desks.
4. **Examination:** Exam timetable clashing, hall ticket errors, seating.
5. **Attendance:** ERP portal sync issues, medical leave credits.
6. **Fees:** Payment gateway timeouts, scholarship disbursement delays.
7. **Hostel:** Mess food hygiene, water purifier, room maintenance.
8. **Administration:** Document verification, ID card processing, bus passes.

### Sentiment vs. Priority Separation:
In SFIS, **Priority is strictly decoupled from Sentiment**:
* A student may write an extremely angry message about cold food in the cafeteria (*Negative Sentiment, but Medium Priority*).
* A student may write a very polite message notifying that lab wires are sparking (*Positive/Neutral Sentiment, but CRITICAL Priority*).
* If Pass 2 detects safety keywords, it **overrides the priority to Critical**, setting an emergency **4-Hour SLA Target** regardless of sentiment score.

---

## 6. Database Schema (`sfis.db`)

Built with native Node.js `node:sqlite` (`DatabaseSync`):

* **`users`**:
  * `id` (TEXT PRIMARY KEY), `role` (admin | student | faculty), `email` (UNIQUE), `password_hash`, `full_name`, `institutional_id`, `department`, `course`, `academic_year`, `designation`, `status` (active | pending | disabled), `created_at`, `updated_at`.
* **`sessions`**:
  * `token` (TEXT PRIMARY KEY, 64-char hex), `user_id` (FOREIGN KEY -> users.id), `created_at`, `expires_at`.
* **`feedback`**:
  * `id` (TEXT PRIMARY KEY, e.g. `SFIS-2026-XXXX`), `submitter_id` (NULLABLE for anonymous), `submitter_role` (student | faculty | anonymous), `text`, `department`, `category`, `category_confidence`, `category_scores`, `sentiment`, `sentiment_confidence`, `sentiment_score`, `priority`, `priority_justification`, `extracted_keywords`, `summary`, `recommended_action`, `model_version`, `processing_time_ms`, `edge_device_used`, `is_locally_processed`, `detected_language`, `submission_type`, `is_anonymous` (0 or 1), `student_ref_id` (NULLABLE), `status` (Submitted | Analyzed | Reviewed | Assigned | In Progress | Resolved), `assigned_team`, `course_subject`, `semester`, `feedback_area`, `is_confidential` (0 or 1), `sla_target_hours`, `created_at`, `updated_at`.
* **`feedback_reviews`**:
  * Human-in-the-loop review table for storing administrator corrections and verifications.
* **`feedback_notes`**:
  * Internal staff and departmental resolution notes.
* **`feedback_history`**:
  * Complete lifecycle timestamp log of every ticket status transition.
* **`audit_logs`**:
  * Tamper-evident trail of user logins, role approvals, reviews, and status changes.
* **`notifications`**:
  * In-app user notifications for status updates and resolutions.
* **`departmental_announcements`**:
  * Institutional notices broadcasted to faculty and student portals.

---

## 7. Security & Privacy Architecture

1. **Password Encryption:** Passwords hashed with Node's native `scryptSync` using an isolated 16-byte cryptographic salt per user, generating a 64-byte derived key.
2. **Constant-Time Verification:** Compares hashes using `timingSafeEqual` to eliminate timing attack vectors.
3. **Session Management:** Secure random 64-character hex tokens with automatic 7-day expiration and cascade invalidation upon user deactivation.
4. **Verifiable Anonymity:** When `isAnonymous` is true:
   ```javascript
   const isAnon = Boolean(isAnonymous);
   const submitterId = isAnon ? null : (authUser?.id || null);
   const studentRef = isAnon ? null : (studentRefId || null);
   // Stored in SQLite as NULL
   ```
5. **Confidentiality Access Gates:** Non-admin users can query only their own feedback; confidential submissions require `role === 'admin'`.

---

## 8. Alignment with Academic Syllabus Concepts

| Syllabus Module | Theoretical Concept | Concrete Implementation in SFIS |
| :--- | :--- | :--- |
| **Unit I & II: NLP Fundamentals** | Tokenization, Stopwords, Normalization, TF-IDF | `nlpEngine.ts` regex token extractor, stopword cleaner, term frequency weights |
| **Unit III: Classification & Sentiment** | Intent Detection, Sentiment Polarity, Negation Handling | 8-Category Intent Classifier & Polarity Score (`-1.0` to `+1.0`) with valence flipping |
| **Unit IV: LLMs & Edge AI** | On-Device Model Deployment, Latency & Resource Constraints | Edge AI Local inference engine with telemetry (<15ms latency, NPU simulation) |
| **Unit IV: Evaluation Metrics** | Confusion Matrix, Precision, Recall, F1-Score | Built-in Model Evaluation Benchmark Dashboard (`ModelEvaluationPage.tsx`) |
| **Unit IV & V: Responsible & Ethical AI** | AI Safety, Privacy, Explainability, Bias Detection | Anonymous identity scrubbing, Token attribution XAI chips, Safety overrides |

---

## 9. Project Directory Layout

```
student feedback generator main/
├── dist/                          # Production build output generated by Vite
├── node_modules/                  # Installed dependencies
├── server/
│   ├── db.mjs                     # Native SQLite database schema, password hashing & seed data
│   └── api.mjs                    # REST API handlers for auth, RBAC, feedback CRUD & audit logs
├── src/
│   ├── components/
│   │   ├── auth/AuthModal.tsx     # Dual entry-point login/register dialog
│   │   ├── common/Badges.tsx      # Priority, Sentiment, Category & Status badges
│   │   ├── explorer/              # Detail drawer and feedback explorer components
│   │   └── layout/Header.tsx, Sidebar.tsx
│   ├── data/
│   │   ├── mockFeedback.ts        # Baseline benchmark feedback items
│   │   └── evaluationData.ts      # Model evaluation benchmarks (Confusion matrix, F1-scores)
│   ├── pages/
│   │   ├── StudentPortalPage.tsx  # Dedicated Student Portal (Live NLP preview, Anonymous submit)
│   │   ├── FacultyPortalPage.tsx  # Dedicated Faculty Portal (9 academic areas, Confidential mode)
│   │   ├── UserManagementPage.tsx # Admin governance (One-click faculty approvals, user status)
│   │   ├── AuditLogsPage.tsx      # Admin security audit trail viewer
│   │   ├── FeedbackExplorerPage.tsx # Source-filtered database explorer (Student vs Faculty)
│   │   ├── OverviewPage.tsx, AiAnalysisPage.tsx, PriorityEscalationsPage.tsx, AnalyticsReportsPage.tsx, ...
│   ├── services/
│   │   ├── apiService.ts          # Client API layer with Session Bearer persistence
│   │   ├── nlpEngine.ts           # 4-stage Edge NLP engine (Tokenize, TF-IDF, Heuristics, Priority)
│   │   └── storageService.ts      # Local cache & SQLite synchronization layer
│   ├── types/index.ts             # Shared TypeScript models and interfaces
│   ├── App.tsx                    # Top-level role routing and session validator
│   └── main.tsx                   # React DOM root entry
├── package.json                   # Dependencies (React, TypeScript, TailwindCSS, Lucide, Vite)
├── serve.mjs                      # Production HTTP server (serves /api/* and dist/ SPA assets)
├── tsconfig.json
└── vite.config.ts
```

---

## 10. Default Seed Credentials

| Role | Tab / Entry Point | Email | Password | Status | Intended Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | **Admin Login** | `admin@sfis.edu` | `Admin@SFIS2026!` | Active | Full dashboard access, User Management, Approvals, Audit Logs |
| **Student** | **User Login → Student** | `student@sfis.edu` | `Student@123!` | Active | Opens Student Portal; live NLP preview, anonymous toggle, tracking |
| **Faculty (Active)** | **User Login → Faculty** | `faculty@sfis.edu` | `Faculty@123!` | Active | Opens Faculty Portal; 9 feedback areas, confidential submissions |
| **Faculty (Pending)**| **User Login → Faculty** | `priya.nair@sfis.edu` | `Faculty@123!` | Pending | **Blocked (HTTP 403)** until Admin approves via User Management |

---

## 11. Quick Execution Guide

```powershell
# 1. Install dependencies
npm.cmd install

# 2. Build production assets
npm.cmd run build

# 3. Start the production server
node serve.mjs
```
* Access locally at: **`http://localhost:5173/`**
