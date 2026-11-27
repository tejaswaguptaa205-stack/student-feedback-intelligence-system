export type FeedbackCategory =
  | 'Academic'
  | 'Faculty'
  | 'Infrastructure'
  | 'Examination'
  | 'Attendance'
  | 'Fees'
  | 'Hostel'
  | 'Administration';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type SubmissionType = 'Complaint' | 'Suggestion' | 'Appreciation' | 'General';

export type FeedbackStatus =
  | 'Submitted'
  | 'Analyzed'
  | 'Reviewed'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export type UserRole = 'admin' | 'student' | 'faculty';
export type UserStatus = 'active' | 'pending' | 'disabled';
export type SubmitterRole = 'student' | 'faculty' | 'anonymous';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  full_name: string;
  name?: string;
  institutional_id?: string;
  institutionalId?: string;
  department?: string;
  course?: string;
  academic_year?: string;
  designation?: string;
  status: UserStatus;
  created_at?: string;
  updated_at?: string;
}

export type FacultyFeedbackArea =
  | 'Workload and Timetable Concerns'
  | 'Infrastructure and Laboratory Issues'
  | 'IT and Technical Support'
  | 'Examination Management'
  | 'Student Support Concerns'
  | 'Research and Development Support'
  | 'Administrative Process Concerns'
  | 'HR and Faculty Welfare'
  | 'Campus Safety Issues';

export interface InternalNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  note: string;
}

export interface StatusHistoryItem {
  timestamp: string;
  fromStatus: FeedbackStatus;
  toStatus: FeedbackStatus;
  updatedBy: string;
  note: string;
}

export interface FeedbackAnalysis {
  category: FeedbackCategory;
  categoryConfidence: number; // e.g. 0.94
  categoryScores?: Record<FeedbackCategory, number>;
  sentiment: SentimentType;
  sentimentConfidence: number; // e.g. 0.88
  sentimentScore: number; // -1.0 to 1.0
  priority: PriorityLevel;
  priorityJustification: string;
  extractedKeywords: string[];
  summary: string;
  recommendedAction: string;
  modelVersion: string;
  processingTimeMs: number;
  edgeDeviceUsed: string;
  isLocallyProcessed: boolean;
  detectedLanguage: string;
  similarIssueCluster?: string;
  similarReportCount?: number;
  explainabilityTokens?: Array<{ token: string; weight: number; categoryHint?: FeedbackCategory }>;
}

export interface HumanReview {
  isReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  isConfirmed?: boolean;
  correctedCategory?: FeedbackCategory;
  correctedSentiment?: SentimentType;
  correctedPriority?: PriorityLevel;
  correctionRationale?: string;
  notes?: string;
}

export interface FeedbackItem {
  id: string;
  submitterId?: string;
  submitterRole?: SubmitterRole;
  text: string;
  department: string;
  selectedCategory?: FeedbackCategory; // If user manually specified, otherwise undefined (auto)
  submissionType: SubmissionType;
  isAnonymous: boolean;
  studentRefId?: string;
  createdAt: string;
  updatedAt?: string;
  status: FeedbackStatus;
  assignedTeam: string;
  courseSubject?: string;
  semester?: string;
  feedbackArea?: string;
  isConfidential?: boolean;
  analysis: FeedbackAnalysis;
  humanReview?: HumanReview;
  internalNotes: InternalNote[];
  resolutionHistory: StatusHistoryItem[];
  slaTargetHours: number;
  isOverdue?: boolean;
}

export interface EdgeDeviceInfo {
  deviceId: string;
  name: string;
  modelName: string;
  modelVersion: string;
  engineMode: 'Local Edge (On-Device)' | 'Simulated Edge Gateway' | 'Cloud-Assisted Fallback';
  status: 'Online' | 'Offline' | 'Syncing' | 'Degraded';
  hardwareAccelerator: 'Edge NPU (Neural Processing Unit)' | 'Apple Neural Engine' | 'WebGPU/WASM' | 'CPU ThreadPool';
  localDatabaseStatus: 'Healthy (IndexedDB / SQLite Store)' | 'Compacting' | 'Reindexing';
  totalProcessedLocally: number;
  successfulInferences: number;
  failedInferences: number;
  avgInferenceLatencyMs: number;
  lastSuccessfulInferenceAt: string;
  localQueuePendingSync: number;
  memoryUsageMb: number;
  cpuLoadPercent: number;
  temperatureC: number;
  offlineSupportActive: boolean;
}

export interface CategoryMetric {
  category: FeedbackCategory;
  totalCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  unresolvedCount: number;
  avgResolutionHours: number;
  commonTopics: string[];
  trendVsLastPeriodPercent: number;
}

export interface ModelEvaluationStats {
  modelVersion: string;
  evaluatedAt: string;
  datasetSize: number;
  overallAccuracy: number;
  overallPrecision: number;
  overallRecall: number;
  overallF1: number;
  avgLatencyMs: number;
  sentimentAccuracy: number;
  confusionMatrix: {
    labels: FeedbackCategory[];
    matrix: number[][]; // [trueLabelIndex][predLabelIndex]
  };
  perCategoryMetrics: Array<{
    category: FeedbackCategory;
    samples: number;
    precision: number;
    recall: number;
    f1Score: number;
    support: number;
  }>;
  misclassifiedExamples: Array<{
    id: string;
    text: string;
    trueCategory: FeedbackCategory;
    predictedCategory: FeedbackCategory;
    confidence: number;
    errorReason: string;
  }>;
}

export interface EscalationConfig {
  criticalTargetHours: number;
  highTargetHours: number;
  mediumTargetHours: number;
  lowTargetHours: number;
  autoEscalateUnresolvedDays: number;
  clusterThresholdCount: number;
  inAppAlertsEnabled: boolean;
  departments: string[];
  assignedTeams: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  isRead: boolean;
  related_feedback_id?: string;
  created_at: string;
}

export interface DepartmentAnnouncement {
  id: string;
  title: string;
  content: string;
  department: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  author: string;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  user_id?: string;
  user_email?: string;
  role?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}
