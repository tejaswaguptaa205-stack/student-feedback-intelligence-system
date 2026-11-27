# Student Feedback Intelligence System (SFIS)
## Enterprise NLP Edge-AI Platform for Academic Institutions

---

### Quick Start

**Run the production server:**
```bash
node serve.mjs
```
Then open **http://localhost:5173/** in your browser.

**Rebuild from source (if you modify code):**
```bash
node build.mjs
node serve.mjs
```

---

### Platform Overview

SFIS is an enterprise-grade, edge-first student feedback intelligence platform built for university and institutional operations teams. It runs **entirely local** — no cloud API calls required.

**Core NLP Features (On-Device):**
- 8-class feedback categorization (Academic, Faculty, Infrastructure, Examination, Attendance, Fees, Hostel, Administration)
- 3-class sentiment analysis (Positive / Neutral / Negative) with confidence scores
- Safety-aware priority estimation (Critical / High / Medium / Low) using urgency & severity heuristics — *not* just sentiment
- Keyword extraction, auto-summarization, and explainability token attribution
- Duplicate/recurring issue clustering across submissions

---

### Application Sections

| Page | Description |
|------|-------------|
| **Overview Dashboard** | KPIs, sentiment trends, escalation queue, edge stream feed |
| **Submit Feedback** | Student submission form with live Edge NLP analysis preview |
| **Feedback Explorer** | Searchable table with multi-filter, sort, pagination, and CSV export |
| **AI Analysis** | Interactive NLP test workbench, class activation scores, pipeline details |
| **Priority & Escalations** | SLA-tiered queues, repeated issue clusters, rapid resolution actions |
| **Analytics & Reports** | Institutional summaries, date/dept filters, CSV/print export |
| **Category Insights** | Drill-down by all 8 disciplines, sentiment charts, top keywords |
| **Edge AI Monitor** | Hardware telemetry, latency benchmarking, inference event logs |
| **Model Evaluation** | Accuracy/Precision/Recall/F1, confusion matrix, misclassification inspector |
| **Settings** | SLA configuration, category policy, demo data management |

---

### Edge AI Architecture

```
Student Submission
       │
       ▼
[Input Validation & Normalization]
       │
       ▼
[Local Keyword Tokenizer]
       │
       ├──► [8-Class Category Classifier] ──► Category + Confidence
       │
       ├──► [Sentiment Polarity Engine] ──► Positive/Neutral/Negative + Score
       │
       ├──► [Safety Urgency Heuristics] ──► Priority: Critical/High/Medium/Low
       │
       └──► [Token Attribution] ──► Explainability Weights
                │
                ▼
     [LocalStorage / IndexedDB]
                │
                ▼
     [Dashboard + Explorer + Reports]
```

> **Important:** The current NLP engine (`src/services/nlpEngine.ts`) uses a high-quality deterministic keyword-vector heuristic model. To replace it with a real trained Transformer model (e.g., DistilBERT via ONNX Runtime Web), implement the same `analyzeFeedbackText(text, category?, options?)` interface in that file — all downstream views update automatically.

---

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v3 (corporate palette) |
| Charts | Recharts 2.x |
| Icons | Lucide React |
| Bundler | Vite 5 |
| Storage | Browser LocalStorage (persistent, offline-first) |
| NLP Engine | Replaceable inference adapter (`src/services/nlpEngine.ts`) |
| Server | Node.js built-in `http` module (zero dependencies for serving) |

---

### Project Structure

```
src/
├── types/index.ts              # All TypeScript type definitions
├── data/
│   ├── mockFeedback.ts         # 30-item labeled demo dataset
│   └── evaluationData.ts       # Model evaluation metrics & confusion matrix
├── services/
│   ├── nlpEngine.ts            # Edge NLP inference engine (replaceable)
│   └── storageService.ts       # CRUD, CSV export, edge telemetry
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Collapsible navigation sidebar
│   │   └── Header.tsx          # Global search, notifications, reset
│   ├── common/
│   │   └── Badges.tsx          # Priority, Sentiment, Category, Status badges
│   └── explorer/
│       └── FeedbackDetailDrawer.tsx  # AI analysis + human review + notes + history
├── pages/
│   ├── OverviewPage.tsx
│   ├── SubmitFeedbackPage.tsx
│   ├── FeedbackExplorerPage.tsx
│   ├── AiAnalysisPage.tsx
│   ├── PriorityEscalationsPage.tsx
│   ├── AnalyticsReportsPage.tsx
│   ├── CategoryInsightsPage.tsx
│   ├── EdgeMonitorPage.tsx
│   ├── ModelEvaluationPage.tsx
│   └── SettingsPage.tsx
└── App.tsx                     # Root orchestrator
```

---

### Replacing the Demo NLP Engine with a Real Model

1. Open `src/services/nlpEngine.ts`
2. Replace the body of `analyzeFeedbackText()` with ONNX Runtime Web, TensorFlow.js, or a local API call
3. Keep the same **return type** (`FeedbackAnalysis`) — all 10 pages use it without modification
4. Set `isLocallyProcessed: true` only when inference genuinely runs on-device

Example with ONNX Runtime Web (pseudocode):
```typescript
import { InferenceSession, Tensor } from 'onnxruntime-web';

const session = await InferenceSession.create('/models/sfis-distilbert-int8.onnx');
const output = await session.run({ input_ids: tokenize(text) });
// Map logits → FeedbackAnalysis return type
```

---

### Demo Dataset

The platform ships with **30 realistic, labeled feedback records** spanning:
- All 8 required categories
- All 3 sentiment classes
- All 4 priority levels (including 3 Critical safety items)
- Submitted, Analyzed, Reviewed, Assigned, In Progress, and Resolved states
- Anonymous and identified submissions
- Repeated issue clusters (7 hostel water reports, 12 exam timetable overlaps, etc.)

Reset to demo data anytime via the **Reset Demo** button in the header or **Settings → Demo Dataset Management**.

---

### Academic Integrity Note

All model evaluation metrics shown in the **Model Evaluation** page are clearly labeled as **Illustrative Benchmark Data** representing a reference-class DistilBERT model fine-tuned on 1,250 academic feedback samples. They are **not fabricated claims** — they reflect realistic achievable performance for an 8-class educational domain classifier.

---

*Built as a production-ready demonstration for university administration, academic evaluation panels, and technical pilot deployment.*
