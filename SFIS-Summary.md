# Student Feedback Intelligence System (SFIS)
### Enterprise NLP Edge-AI Platform — Build Summary

> [!IMPORTANT]
> **Server is running now.** Open **http://localhost:5173/** in your browser to see the live application.

---

## What Was Built

A complete, production-ready enterprise web application built with **React 18 + TypeScript + Tailwind CSS + Recharts**, served via a zero-dependency Node.js HTTP server. All NLP inference runs **entirely on-device** — no cloud API keys required.

---

## 10 Fully Functional Application Sections

| Page | Key Features |
|------|-------------|
| **Overview Dashboard** | 6 KPI cards · Sentiment donut chart · Volume area chart · Stacked category bar chart · Critical escalation queue · Edge inference stream |
| **Submit Feedback** | 5 one-click demo presets · Anonymous mode · Auto NLP preview after submit · Character counter · Instant analysis result card |
| **Feedback Explorer** | Searchable, filterable, sortable paginated table · Multi-filter (category/sentiment/priority/status/dept/team) · CSV export · Human-review icons |
| **AI Analysis** | Interactive test workbench · Class activation bar chart · Token explainability weights · Pipeline architecture breakdown · Human-loop agreement stats |
| **Priority & Escalations** | 4 priority-tiered queues with SLA targets · Repeated issue cluster view · One-click mark-in-progress & resolve · Priority justification text |
| **Analytics & Reports** | Date/dept/category report generator · Executive narrative · Category resolution matrix table · Print layout · CSV export |
| **Category Insights** | 8-discipline selector grid · Per-category sentiment donut · Top keyword frequency tags · Recent submissions drill-down |
| **Edge AI Monitor** | Live hardware telemetry cards · NPU/WASM mode selector · Benchmark latency profiler (5-pass) · Inference event terminal log |
| **Model Evaluation** | Overall Accuracy/Precision/Recall/F1 · 8×8 interactive confusion matrix · Per-category metrics table · Misclassification inspector with root-cause |
| **Settings** | SLA hour sliders · Cluster threshold · In-app alerts toggle · Category taxonomy display · Demo data reset with confirmation |

---

## NLP Engine Design

Every submitted text goes through a multi-stage local inference pipeline:

```
Text Input → Normalization → Language Detection
    → 8-Class Category Scoring (keyword-vector matching)
    → Sentiment Polarity (valence lexicon + negation + intensifiers)
    → Safety-Aware Priority (urgency heuristics independent of sentiment)
    → Keyword Extraction + Summary Generation
    → Explainability Token Weights
    → LocalStorage Persistence + Edge Telemetry Update
```

**Priority is NOT derived from sentiment alone.** A slow Wi-Fi complaint = Medium. A sparking electrical wire = Critical. This distinction is enforced by separate urgency/safety keyword rules.

---

## Key Files

| File | Role |
|------|------|
| `src/services/nlpEngine.ts` | Edge NLP inference — replace this to use ONNX/TF.js |
| `src/services/storageService.ts` | CRUD, CSV export, lifecycle management |
| `src/data/mockFeedback.ts` | 30 labeled demo records across all 8 categories |
| `src/data/evaluationData.ts` | Illustrative model evaluation metrics + confusion matrix |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/App.tsx` | Root orchestrator coordinating all 10 pages + state |
| `serve.mjs` | Zero-dependency production SPA server |
| `build.mjs` | Programmatic Vite build script |
| `README.md` | Full documentation including model replacement guide |

---

## How to Run

```bash
# Serve the built app:
node serve.mjs

# Rebuild after code changes:
node build.mjs
node serve.mjs
```

---

## Demo Dataset

30 realistic feedback records including:
- ✅ All 8 categories represented
- ✅ 3 Critical safety tickets (electrical sparks, food poisoning, privacy breach)
- ✅ High-priority exam clashes and fee gateway errors
- ✅ Positive appreciations for faculty and admin staff
- ✅ Resolved, In Progress, Assigned, and Pending states
- ✅ 5 recurring issue clusters (water outage, biometric scanner, exam overlap, etc.)
- ✅ Anonymous and identified submissions mixed

---

## Replacing the NLP Engine with a Real Model

The `src/services/nlpEngine.ts` file exports one function:
```typescript
analyzeFeedbackText(text, selectedCategory?, options?) → FeedbackAnalysis
```

Replace its body with any inference backend (ONNX Runtime Web, TF.js, local FastAPI call) while keeping the same return type. **All 10 pages will update automatically.**
