# 🎓 SFIS — PowerPoint Presentation Content
### Student Feedback Intelligence System
**Edge-Based NLP for Automated Feedback Analysis**

---

## SLIDE 1 — Title Slide

**Title:** Student Feedback Intelligence System (SFIS)

**Subtitle:** An Edge-Based NLP Platform for Automated Classification, Sentiment Analysis, and Priority Management of Student Feedback

**Presented by:** [Your Name / Team Name]

**Institution / Department:** [Your College / University Name]

**Date:** October 2026

> *Visual suggestion: Clean white background, navy logo bar at bottom, institution crest top-right*

---

## SLIDE 2 — Problem Statement

**Heading:** The Challenge with Traditional Feedback Systems

**Points:**
- Universities collect thousands of feedback entries per semester — manually reviewed and often ignored
- No systematic classification → critical complaints get buried under general suggestions
- Sentiment and urgency are assessed subjectively by individual staff
- Delayed responses erode student trust and institutional accountability
- No visibility into recurring patterns or category-level trends
- Data sits in spreadsheets — not actionable, not searchable, not prioritized

**Bottom call-out box:**
> *"An institution that cannot listen efficiently cannot improve systematically."*

---

## SLIDE 3 — Objectives

**Heading:** Project Objectives

| # | Objective |
|---|-----------|
| 1 | Automatically classify student feedback into 8 predefined categories |
| 2 | Perform sentiment analysis (Positive / Neutral / Negative) |
| 3 | Estimate issue priority independent of sentiment |
| 4 | Run inference at the edge — no cloud dependency, no data leakage |
| 5 | Provide a management dashboard for review, escalation, and resolution |
| 6 | Enable human-in-the-loop correction to support future model improvement |
| 7 | Deliver actionable analytics and exportable reports |

---

## SLIDE 4 — System Architecture Overview

**Heading:** High-Level Architecture

**Three-Layer Diagram (describe verbally or draw):**

```
[ Student Submission Layer ]
  ↓  Web Form / API
[ Edge NLP Processing Layer ]
  ↓  Category Classification → Sentiment Analysis → Priority Estimation
  ↓  Keyword Extraction → Summary Generation
[ Management & Analytics Layer ]
  ↓  Dashboard / Explorer / Escalation / Reports / Model Evaluation
```

**Key design principles:**
- **Edge-first:** All inference runs on-device — no external API calls
- **Modular:** NLP engine is a single swappable module
- **Human-in-the-loop:** AI recommendations are reviewable and correctable
- **Privacy-preserving:** Anonymous submissions strip student identity before storage

---

## SLIDE 5 — Technology Stack

**Heading:** Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend UI | React 18 + TypeScript |
| Styling | Tailwind CSS (corporate palette) |
| Charting | Recharts |
| Icons | Lucide React |
| NLP Engine | On-device rule-based scoring (ONNX-ready) |
| Storage | Browser LocalStorage (IndexedDB-upgradeable) |
| Build Tool | Vite |
| Server | Node.js zero-dependency HTTP server |

**Note panel:**
> The NLP engine is designed as a single replaceable module — a real ONNX or TensorFlow.js model can be plugged in without changing any other code.

---

## SLIDE 6 — Supported Feedback Categories

**Heading:** 8 Classification Categories

| Category | Example Issues |
|----------|---------------|
| 🎓 Academic | Curriculum gaps, teaching quality, syllabus issues |
| 👨‍🏫 Faculty | Teaching effectiveness, availability, communication |
| 🏛️ Infrastructure | Labs, classrooms, Wi-Fi, electrical, maintenance |
| 📝 Examination | Scheduling, paper quality, result delays, malpractice |
| 📋 Attendance | Portal errors, policy concerns, marking disputes |
| 💰 Fees | Payment issues, scholarship delays, refund requests |
| 🏠 Hostel | Maintenance, food quality, security, water supply |
| 🏢 Administration | Processes, staff responsiveness, documentation |

**Footer note:** Architecture supports additional categories without code restructuring.

---

## SLIDE 7 — NLP Engine — How It Works

**Heading:** Automated Analysis Pipeline

**Step-by-step flow (use numbered icons):**

1. **Text Normalization** — Lowercase, remove special characters, tokenize
2. **Language Detection** — Identify language (English-first, extensible)
3. **Category Scoring** — Keyword-weighted scoring across all 8 categories → argmax
4. **Sentiment Analysis** — Positive / Negative / Neutral classification with confidence
5. **Priority Estimation** — Safety signals, urgency keywords, time sensitivity (independent of sentiment)
6. **Keyword Extraction** — Identify top 3–5 content tokens
7. **Summary Generation** — Concise one-line summary of the issue
8. **Result Packaging** — Full `FeedbackAnalysis` object saved to storage

**Side callout:**
> Priority ≠ Sentiment. A negative comment about slow Wi-Fi → Medium priority. A report of a sparking electrical panel → Critical priority.

---

## SLIDE 8 — Priority Classification Logic

**Heading:** Safety-Aware Priority Estimation

**Four priority levels:**

| Priority | Trigger Criteria | Example |
|----------|-----------------|---------|
| 🔴 Critical | Safety risk, infrastructure failure, health hazard | Electrical sparking, food poisoning |
| 🟠 High | Unresolved multi-day issues, exam disruption, fee deadlines | Water outage 2+ days, result not uploaded |
| 🟡 Medium | Service degradation, repeated minor complaints | Slow Wi-Fi, unclean classrooms |
| 🟢 Low | Suggestions, general appreciation, minor observations | Request for new club, compliment to faculty |

**Key differentiator box:**
> Priority is computed independently from sentiment using urgency heuristics and safety indicators — not inferred from negative tone alone.

---

## SLIDE 9 — Application Walkthrough

**Heading:** Application — 10 Functional Sections

*(Use a 2×5 grid or screenshot placeholders)*

| Section | Purpose |
|---------|---------|
| **Overview Dashboard** | KPIs, charts, escalation queue, edge stream |
| **Submit Feedback** | Student form with real-time NLP preview |
| **Feedback Explorer** | Full table with filters, sort, search, export |
| **AI Analysis Workbench** | Inspect individual predictions interactively |
| **Priority & Escalations** | Grouped queues, cluster view, rapid resolve |
| **Analytics & Reports** | Report generator, category matrix, print |
| **Category Insights** | Per-discipline deep dive, sentiment, keywords |
| **Edge AI Monitor** | Device telemetry, latency benchmark, event log |
| **Model Evaluation** | Confusion matrix, per-class metrics, misclassifications |
| **Settings** | SLA config, escalation rules, category management |

---

## SLIDE 10 — Overview Dashboard (Screenshot Slide)

**Heading:** Overview Dashboard

**Describe / show screenshot with callouts:**
- **6 KPI Cards** — Total Feedback, Analyzed, Negative %, High Priority, Unresolved, Avg Resolution Time
- **Sentiment Donut Chart** — Positive / Neutral / Negative distribution
- **Volume Over Time** — Area chart showing feedback trends
- **Category Distribution** — Stacked bar chart per department
- **Escalation Queue** — Live critical and high-priority items
- **Edge Event Stream** — Real-time processing activity log

---

## SLIDE 11 — Feedback Submission & Instant Analysis

**Heading:** Student Feedback Submission

**Key features to highlight:**
- Clean, accessible form — no login required
- Anonymous submission option (identity stripped before storage)
- Optional department and category selection
- 5 preset sample feedback buttons for demonstration
- Character counter and input validation
- **Instant NLP result card** appears after submission showing:
  - Predicted category + confidence
  - Sentiment label
  - Priority level
  - Extracted keywords
  - Auto-generated summary
  - Recommended action

---

## SLIDE 12 — Feedback Explorer

**Heading:** Feedback Explorer — Data Management Interface

**Columns visible in table:**
Feedback ID | Preview | Category | Sentiment | Priority | Department | Date | Status | Actions

**Filter capabilities:**
- Category, Sentiment, Priority, Department, Date Range, Resolution Status, Assigned Team

**Detail Drawer (4 tabs):**
- AI Analysis — full prediction breakdown
- Human Review & Actions — confirm/correct AI, assign team, change status
- Internal Notes — staff communication log
- Lifecycle Audit — full history of changes

**Export:** One-click CSV download of filtered results

---

## SLIDE 13 — Human-in-the-Loop Review

**Heading:** Human Review Workflow

**Why it matters:**
- AI predictions are recommendations, not final verdicts
- Staff can confirm, correct category, adjust sentiment, override priority
- All corrections are logged with reviewer identity and timestamp
- Corrections feed back into model evaluation to measure drift
- Critical issues require mandatory human review before closure

**Workflow diagram:**
```
AI Prediction → Staff Reviews → Confirm OR Correct → Log Correction → Update Status
                                                         ↓
                                              Model Evaluation Dashboard
```

---

## SLIDE 14 — Analytics & Reports

**Heading:** Analytics and Reporting

**Report types available:**
- **Executive Summary** — overall health snapshot
- **Category Performance Report** — per-discipline breakdown
- **Sentiment Trend Report** — over selected date range
- **Priority & Resolution Report** — SLA compliance tracking
- **Feedback Volume Report** — submission pattern analysis

**Metrics displayed:**
- Total feedback, resolution rate, average resolution time
- Category-wise negative sentiment %
- Priority distribution table
- Month-over-month trend comparison

**Export options:** Print / Browser PDF

---

## SLIDE 15 — Edge AI Monitor

**Heading:** Edge AI Monitor — On-Device Inference Telemetry

**What it shows:**
- Device mode: CPU / WebGL / WASM
- Model version and last update timestamp
- Inference latency (avg / p95 / p99)
- Memory usage
- Total inferences completed
- Benchmark profiler — run latency test across N samples

**Why edge matters:**
| Cloud AI | Edge AI (SFIS) |
|----------|---------------|
| Data leaves institution | Data never leaves device |
| Requires internet | Works offline |
| Per-call API cost | Zero inference cost |
| Compliance risk | FERPA/DPDP compliant by design |

---

## SLIDE 16 — Model Evaluation

**Heading:** Model Evaluation Dashboard

**Metrics tracked:**
- Overall Accuracy
- Macro Precision, Recall, F1-Score
- Per-category precision and recall
- **8×8 Confusion Matrix** (interactive — click cell to see misclassified samples)
- Misclassification Inspector — shows full text of misclassified items
- Human correction agreement rate

**Purpose:**
Track model quality over time. When human corrections consistently override a predicted class, that signals a need for retraining or rule adjustment.

---

## SLIDE 17 — Sample Analysis Demonstration

**Heading:** Live Example

**Input Feedback:**
> *"The hostel water supply has been unavailable for two days, and the administration has not responded to our complaints."*

**SFIS Output:**

| Field | Value |
|-------|-------|
| Category | Hostel |
| Sentiment | Negative |
| Priority | High |
| Keywords | water supply, administration, unresolved, two days |
| Summary | Hostel water supply unavailable for 2 days; no administrative response received |
| Recommended Action | Escalate maintenance issue to Hostel Administration immediately |
| Processing Time | ~12 ms (edge, on-device) |

---

## SLIDE 18 — Key Differentiators

**Heading:** What Makes SFIS Different

| Feature | Generic Feedback Form | SFIS |
|---------|----------------------|------|
| Auto-classification | ❌ | ✅ 8 categories |
| Sentiment analysis | ❌ | ✅ with confidence |
| Priority estimation | ❌ | ✅ safety-aware |
| Edge inference | ❌ | ✅ no cloud dependency |
| Human review loop | ❌ | ✅ with audit trail |
| Escalation management | ❌ | ✅ SLA-aware |
| Model evaluation | ❌ | ✅ confusion matrix + drift |
| Privacy by design | ❌ | ✅ anonymous submissions |
| Exportable reports | ❌ | ✅ CSV + print |

---

## SLIDE 19 — Limitations & Future Work

**Heading:** Limitations & Roadmap

**Current Limitations:**
- NLP engine is keyword-rule-based (not a trained deep learning model)
- English-only (multilingual support planned)
- Storage uses browser LocalStorage (suitable for demo; needs backend for production)
- No real-time notification delivery (in-app alerts only)

**Future Enhancements:**
- Integrate ONNX-exported transformer model (DistilBERT / MiniLM)
- Backend API with PostgreSQL persistence
- Multi-language support (Hindi, regional languages)
- Email/SMS escalation notifications
- Role-based access control (Admin / Department Head / Staff)
- Federated learning for cross-institution model improvement
- Mobile application for students

---

## SLIDE 20 — Conclusion

**Heading:** Conclusion

**Summary points:**
- SFIS transforms unstructured student text into actionable institutional intelligence
- Fully edge-based — no cloud APIs, no data privacy risk
- 10 functional application sections, 30+ demo feedback records
- Covers the full lifecycle: submission → analysis → review → resolution → reporting
- Human-in-the-loop design ensures AI augments, not replaces, administrator judgment
- Modular architecture allows easy upgrade to production-grade ML models
- Directly applicable to universities, colleges, and educational enterprises

**Closing statement:**
> *"Efficient listening is the foundation of institutional improvement. SFIS makes that possible at scale."*

---

## SLIDE 21 — Thank You / Q&A

**Heading:** Thank You

**Content:**
- Project: Student Feedback Intelligence System (SFIS)
- Live Demo: http://localhost:5173/
- Tech Stack: React 18 · TypeScript · Tailwind CSS · Edge NLP · Recharts
- [Your Name / Team]
- [Email / Contact]
- [Institution Name]

**Q&A prompt:** *"We welcome questions about the NLP pipeline, architecture decisions, or UI design."*

---

## APPENDIX SLIDES (Optional / Backup)

### A1 — NLP Category Scoring (Technical Detail)
Each feedback text is scored against 8 keyword dictionaries. The category with the highest weighted match score is selected. Ties are broken by keyword frequency. Minimum threshold prevents low-confidence false positives.

### A2 — Priority Heuristics (Technical Detail)
Priority uses a two-pass system:
1. **Safety override pass** — if critical keywords present (sparking, injury, food poisoning) → Critical regardless of sentiment
2. **Urgency scoring pass** — time words (days, urgent, still), severity amplifiers (completely, totally, never), and unresolved complaint signals → High or Medium
3. **Default** → Low

### A3 — Data Flow Diagram
```
Student submits text
    ↓
storageService.submitFeedback()
    ↓
nlpEngine.analyzeFeedbackText()
    ↓
FeedbackAnalysis object returned
    ↓
Merged with FeedbackItem, saved to LocalStorage
    ↓
Explorer / Dashboard / Analytics read from storage
```

### A4 — File Structure
```
src/
  pages/         — 10 page components
  components/    — Sidebar, Header, Drawer, Badges
  services/      — nlpEngine.ts, storageService.ts
  data/          — mockFeedback.ts, evaluationData.ts
  types/         — index.ts (all TypeScript interfaces)
```
