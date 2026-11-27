import { FeedbackCategory, ModelEvaluationStats } from '../types';

export const EVALUATION_DATA: ModelEvaluationStats = {
  modelVersion: 'SFIS-Edge-DistilBERT-v2.4-int8',
  evaluatedAt: '2026-10-12 18:30 UTC',
  datasetSize: 1250,
  overallAccuracy: 92.4,
  overallPrecision: 92.8,
  overallRecall: 92.1,
  overallF1: 92.4,
  avgLatencyMs: 16.4,
  sentimentAccuracy: 94.2,
  confusionMatrix: {
    labels: [
      'Academic',
      'Faculty',
      'Infrastructure',
      'Examination',
      'Attendance',
      'Fees',
      'Hostel',
      'Administration'
    ],
    // Matrix format: [True Category][Predicted Category]
    matrix: [
      [142, 6, 2, 4, 1, 0, 0, 3],   // True: Academic (total 158)
      [5, 149, 1, 2, 2, 0, 1, 2],   // True: Faculty (total 162)
      [1, 0, 161, 1, 0, 1, 3, 4],   // True: Infrastructure (total 171)
      [4, 1, 1, 148, 3, 2, 0, 3],   // True: Examination (total 162)
      [1, 2, 0, 3, 144, 0, 0, 4],   // True: Attendance (total 154)
      [0, 0, 1, 3, 1, 146, 0, 4],   // True: Fees (total 155)
      [0, 1, 4, 0, 0, 1, 145, 2],   // True: Hostel (total 153)
      [3, 2, 3, 2, 2, 1, 2, 120]    // True: Administration (total 135)
    ]
  },
  perCategoryMetrics: [
    { category: 'Academic', samples: 158, precision: 91.0, recall: 89.9, f1Score: 90.4, support: 158 },
    { category: 'Faculty', samples: 162, precision: 92.5, recall: 92.0, f1Score: 92.2, support: 162 },
    { category: 'Infrastructure', samples: 171, precision: 93.1, recall: 94.2, f1Score: 93.6, support: 171 },
    { category: 'Examination', samples: 162, precision: 90.8, recall: 91.4, f1Score: 91.1, support: 162 },
    { category: 'Attendance', samples: 154, precision: 94.1, recall: 93.5, f1Score: 93.8, support: 154 },
    { category: 'Fees', samples: 155, precision: 97.3, recall: 94.2, f1Score: 95.7, support: 155 },
    { category: 'Hostel', samples: 153, precision: 96.0, recall: 94.8, f1Score: 95.4, support: 153 },
    { category: 'Administration', samples: 135, precision: 84.5, recall: 88.9, f1Score: 86.6, support: 135 }
  ],
  misclassifiedExamples: [
    {
      id: 'EVAL-084',
      text: 'The professor marks attendance at the exact minute class begins and closes the door on anyone arriving 30 seconds late.',
      trueCategory: 'Faculty',
      predictedCategory: 'Attendance',
      confidence: 0.74,
      errorReason: 'High lexical weight on "marks attendance" and "arriving late" overpowered faculty behavioral context.'
    },
    {
      id: 'EVAL-129',
      text: 'Examination fees were deducted from bank but the admit card hall ticket generation portal says fee receipt not verified.',
      trueCategory: 'Fees',
      predictedCategory: 'Examination',
      confidence: 0.68,
      errorReason: 'Co-occurrence of "examination", "admit card", and "hall ticket" outweighed payment gateway receipt keywords.'
    },
    {
      id: 'EVAL-304',
      text: 'The hostel reading room air conditioner has been broken for two weeks causing extreme heat during late night exam study.',
      trueCategory: 'Hostel',
      predictedCategory: 'Infrastructure',
      confidence: 0.71,
      errorReason: 'Compound facility context: "air conditioner broken" is a strong infrastructure signal situated within hostel premises.'
    },
    {
      id: 'EVAL-512',
      text: 'Registrar counter clerk refused to stamp my attendance condonation certificate despite medical board endorsement.',
      trueCategory: 'Administration',
      predictedCategory: 'Attendance',
      confidence: 0.69,
      errorReason: 'Semantic overlap between administrative counter refusal and attendance condonation terminology.'
    }
  ]
};
