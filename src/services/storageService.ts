import {
  FeedbackItem,
  FeedbackCategory,
  SentimentType,
  PriorityLevel,
  SubmissionType,
  FeedbackStatus,
  EdgeDeviceInfo,
  EscalationConfig
} from '../types';
import { INITIAL_FEEDBACK_DATA } from '../data/mockFeedback';
import { analyzeFeedbackText } from './nlpEngine';

const STORAGE_KEY_FEEDBACK = 'sfis_feedback_records_v1';
const STORAGE_KEY_EDGE = 'sfis_edge_device_info_v1';
const STORAGE_KEY_CONFIG = 'sfis_escalation_config_v1';

export const DEFAULT_ESCALATION_CONFIG: EscalationConfig = {
  criticalTargetHours: 4,
  highTargetHours: 24,
  mediumTargetHours: 48,
  lowTargetHours: 72,
  autoEscalateUnresolvedDays: 3,
  clusterThresholdCount: 3,
  inAppAlertsEnabled: true,
  departments: [
    'School of Computing',
    'Department of Electrical Engineering',
    'Department of Physics',
    'Department of Mathematics',
    'School of Basic Sciences',
    'School of Engineering',
    'Student Affairs & Housing',
    'Campus Health & Food Services',
    'Finance & Accounts',
    'Registrar Office',
    'Controller of Examinations',
    'Library & IT Infrastructure',
    'Campus Maintenance',
    'Sports Directorate & Registrar',
    'Campus Planning & Sustainability'
  ],
  assignedTeams: [
    'Electrical Safety & Disaster Response',
    'Controller of Examinations',
    'Faculty Affairs & Academic Audit',
    'Campus Maintenance & Hostel Bureau',
    'Bursar & Treasury Desk',
    'Campus IT & Biometric Infrastructure',
    'Student Records & Registry',
    'Food Safety & Hygiene Inspection',
    'Network Operations Center',
    'Curriculum Advisory Board',
    'Data Protection & Legal Affairs'
  ]
};

export const DEFAULT_EDGE_DEVICE: EdgeDeviceInfo = {
  deviceId: 'EDGE-CAMPUS-GW-01',
  name: 'Central Academic Node 01',
  modelName: 'SFIS-Edge-DistilBERT-v2.4-int8',
  modelVersion: '2.4.1 (ONNX Int8 Quantized)',
  engineMode: 'Local Edge (On-Device)',
  status: 'Online',
  hardwareAccelerator: 'Edge NPU (Neural Processing Unit)',
  localDatabaseStatus: 'Healthy (IndexedDB / SQLite Store)',
  totalProcessedLocally: 428,
  successfulInferences: 428,
  failedInferences: 0,
  avgInferenceLatencyMs: 16.8,
  lastSuccessfulInferenceAt: new Date().toISOString(),
  localQueuePendingSync: 0,
  memoryUsageMb: 142.5,
  cpuLoadPercent: 12.4,
  temperatureC: 39.2,
  offlineSupportActive: true
};

export class StorageService {
  static getFeedback(): FeedbackItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('StorageService: failed to read localStorage, using default data', e);
    }
    // Seed initial data
    this.saveFeedback(INITIAL_FEEDBACK_DATA);
    return INITIAL_FEEDBACK_DATA;
  }

  static saveFeedback(items: FeedbackItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(items));
    } catch (e) {
      console.error('StorageService: failed to write to localStorage', e);
    }
  }

  static resetToDemoData(): FeedbackItem[] {
    this.saveFeedback(INITIAL_FEEDBACK_DATA);
    const edge = this.getEdgeDevice();
    edge.totalProcessedLocally = INITIAL_FEEDBACK_DATA.length;
    edge.lastSuccessfulInferenceAt = new Date().toISOString();
    this.saveEdgeDevice(edge);
    return INITIAL_FEEDBACK_DATA;
  }

  static getEdgeDevice(): EdgeDeviceInfo {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EDGE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('StorageService: failed to read edge info', e);
    }
    return DEFAULT_EDGE_DEVICE;
  }

  static saveEdgeDevice(info: EdgeDeviceInfo): void {
    try {
      localStorage.setItem(STORAGE_KEY_EDGE, JSON.stringify(info));
    } catch (e) {
      console.error('StorageService: failed to write edge info', e);
    }
  }

  static getEscalationConfig(): EscalationConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('StorageService: failed to read config', e);
    }
    return DEFAULT_ESCALATION_CONFIG;
  }

  static saveEscalationConfig(config: EscalationConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('StorageService: failed to write config', e);
    }
  }

  static submitFeedback(params: {
    text: string;
    department?: string;
    selectedCategory?: FeedbackCategory;
    submissionType: SubmissionType;
    isAnonymous: boolean;
    studentRefId?: string;
    submitterId?: string;
    submitterRole?: 'student' | 'faculty' | 'anonymous';
    courseSubject?: string;
    semester?: string;
    feedbackArea?: string;
    isConfidential?: boolean;
  }): FeedbackItem {
    const all = this.getFeedback();
    const config = this.getEscalationConfig();
    const edge = this.getEdgeDevice();

    // 1. Run local Edge NLP inference
    const analysis = analyzeFeedbackText(params.text, params.selectedCategory, {
      modelVersion: edge.modelVersion,
      device: `${edge.name} (${edge.hardwareAccelerator})`
    });

    // 2. Identify potential duplicate / cluster match
    const lower = params.text.toLowerCase();
    let similarCluster: string | undefined;
    let clusterCount = 1;

    all.forEach(item => {
      if (item.analysis.category === analysis.category) {
        // check keyword overlap
        const shared = item.analysis.extractedKeywords.filter(k => lower.includes(k.toLowerCase()));
        if (shared.length >= 2) {
          similarCluster = item.analysis.similarIssueCluster || `Cluster-${analysis.category}-${shared[0].replace(/\s+/g, '-')}`;
          clusterCount++;
        }
      }
    });

    if (clusterCount > 1) {
      analysis.similarIssueCluster = similarCluster;
      analysis.similarReportCount = clusterCount;
    }

    // 3. Assign SLA target hours based on predicted priority
    let slaTargetHours = config.lowTargetHours;
    if (analysis.priority === 'Critical') slaTargetHours = config.criticalTargetHours;
    else if (analysis.priority === 'High') slaTargetHours = config.highTargetHours;
    else if (analysis.priority === 'Medium') slaTargetHours = config.mediumTargetHours;

    // 4. Default team mapping by category
    const defaultTeamMap: Record<FeedbackCategory, string> = {
      Academic: 'Curriculum Advisory Board',
      Faculty: 'Faculty Affairs & Academic Audit',
      Infrastructure: 'Campus Maintenance & Hostel Bureau',
      Examination: 'Controller of Examinations',
      Attendance: 'Campus IT & Biometric Infrastructure',
      Fees: 'Bursar & Treasury Desk',
      Hostel: 'Campus Maintenance & Hostel Bureau',
      Administration: 'Student Records & Registry'
    };

    const nextIdNumber = all.length + 1;
    const paddedId = String(nextIdNumber).padStart(4, '0');
    const newId = `SFIS-2026-${paddedId}`;
    const nowIso = new Date().toISOString();

    const isAnon = Boolean(params.isAnonymous);

    const newItem: FeedbackItem = {
      id: newId,
      submitterId: isAnon ? undefined : params.submitterId,
      submitterRole: isAnon ? 'anonymous' : (params.submitterRole || 'student'),
      text: params.text,
      department: params.department || 'General University Services',
      selectedCategory: params.selectedCategory,
      submissionType: params.submissionType,
      isAnonymous: isAnon,
      studentRefId: isAnon ? undefined : params.studentRefId,
      courseSubject: params.courseSubject,
      semester: params.semester,
      feedbackArea: params.feedbackArea,
      isConfidential: isAnon ? false : Boolean(params.isConfidential),
      createdAt: nowIso,
      status: 'Analyzed',
      assignedTeam: defaultTeamMap[analysis.category] || 'Student Records & Registry',
      analysis,
      humanReview: {
        isReviewed: false,
        isConfirmed: false
      },
      internalNotes: [],
      resolutionHistory: [
        {
          timestamp: nowIso,
          fromStatus: 'Submitted',
          toStatus: 'Analyzed',
          updatedBy: 'Edge NLP Engine',
          note: `Classified as ${analysis.category} (${(analysis.categoryConfidence * 100).toFixed(0)}% conf). Priority: ${analysis.priority}. Latency: ${analysis.processingTimeMs}ms.`
        }
      ],
      slaTargetHours,
      isOverdue: false
    };

    // Prepend new item
    const updated = [newItem, ...all];
    this.saveFeedback(updated);

    // Sync to SQLite backend asynchronously if online
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('sfis_auth_token_v1') ? { 'Authorization': `Bearer ${localStorage.getItem('sfis_auth_token_v1')}` } : {})
      },
      body: JSON.stringify({
        text: newItem.text,
        department: newItem.department,
        selectedCategory: newItem.selectedCategory,
        submissionType: newItem.submissionType,
        isAnonymous: newItem.isAnonymous,
        studentRefId: newItem.studentRefId,
        courseSubject: newItem.courseSubject,
        semester: newItem.semester,
        feedbackArea: newItem.feedbackArea,
        isConfidential: newItem.isConfidential,
        analysis: newItem.analysis
      })
    }).catch(err => {
      console.warn('Backend sync deferred, saved to local cache:', err.message);
    });

    // Update edge telemetry
    edge.totalProcessedLocally += 1;
    edge.successfulInferences += 1;
    edge.lastSuccessfulInferenceAt = nowIso;
    edge.avgInferenceLatencyMs = Number(((edge.avgInferenceLatencyMs * 0.95) + (analysis.processingTimeMs * 0.05)).toFixed(1));
    this.saveEdgeDevice(edge);

    return newItem;
  }

  static updateFeedbackReview(
    feedbackId: string,
    corrections: {
      confirmed?: boolean;
      correctedCategory?: FeedbackCategory;
      correctedSentiment?: SentimentType;
      correctedPriority?: PriorityLevel;
      reviewerName: string;
      notes?: string;
    }
  ): FeedbackItem | null {
    const all = this.getFeedback();
    const index = all.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    const item = { ...all[index] };
    const nowIso = new Date().toISOString();

    item.humanReview = {
      isReviewed: true,
      isConfirmed: corrections.confirmed ?? false,
      reviewedBy: corrections.reviewerName,
      reviewedAt: nowIso,
      correctedCategory: corrections.correctedCategory,
      correctedSentiment: corrections.correctedSentiment,
      correctedPriority: corrections.correctedPriority,
      correctionRationale: corrections.notes
    };

    if (item.status === 'Analyzed') {
      item.status = 'Reviewed';
      item.resolutionHistory.push({
        timestamp: nowIso,
        fromStatus: 'Analyzed',
        toStatus: 'Reviewed',
        updatedBy: corrections.reviewerName,
        note: corrections.confirmed
          ? 'AI predictions confirmed by human administrator.'
          : `Human correction applied: Cat=[${corrections.correctedCategory || item.analysis.category}], Sent=[${corrections.correctedSentiment || item.analysis.sentiment}], Prio=[${corrections.correctedPriority || item.analysis.priority}].`
      });
    }

    all[index] = item;
    this.saveFeedback(all);
    return item;
  }

  static updateFeedbackStatus(
    feedbackId: string,
    newStatus: FeedbackStatus,
    updatedBy: string,
    note: string
  ): FeedbackItem | null {
    const all = this.getFeedback();
    const index = all.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    const item = { ...all[index] };
    const oldStatus = item.status;
    item.status = newStatus;
    item.resolutionHistory.push({
      timestamp: new Date().toISOString(),
      fromStatus: oldStatus,
      toStatus: newStatus,
      updatedBy,
      note: note || `Status updated from ${oldStatus} to ${newStatus}.`
    });

    all[index] = item;
    this.saveFeedback(all);
    return item;
  }

  static updateAssignedTeam(
    feedbackId: string,
    newTeam: string,
    updatedBy: string
  ): FeedbackItem | null {
    const all = this.getFeedback();
    const index = all.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    const item = { ...all[index] };
    item.assignedTeam = newTeam;
    if (item.status === 'Reviewed' || item.status === 'Analyzed') {
      item.status = 'Assigned';
    }
    item.resolutionHistory.push({
      timestamp: new Date().toISOString(),
      fromStatus: item.status,
      toStatus: item.status,
      updatedBy,
      note: `Reassigned team to: ${newTeam}.`
    });

    all[index] = item;
    this.saveFeedback(all);
    return item;
  }

  static addInternalNote(
    feedbackId: string,
    author: string,
    role: string,
    noteText: string
  ): FeedbackItem | null {
    const all = this.getFeedback();
    const index = all.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    const item = { ...all[index] };
    item.internalNotes.push({
      id: `note-${Date.now()}`,
      author,
      role,
      timestamp: new Date().toISOString(),
      note: noteText
    });

    all[index] = item;
    this.saveFeedback(all);
    return item;
  }

  static exportToCSV(items?: FeedbackItem[]): void {
    const dataToExport = items || this.getFeedback();
    const headers = [
      'Feedback ID',
      'Date Submitted',
      'Status',
      'Original Category',
      'Final Category',
      'Sentiment',
      'Priority',
      'Department',
      'Assigned Team',
      'Is Anonymous',
      'Student Ref ID',
      'Summary',
      'Keywords',
      'Full Text'
    ];

    const rows = dataToExport.map(f => {
      const finalCat = f.humanReview?.correctedCategory || f.analysis.category;
      const finalSent = f.humanReview?.correctedSentiment || f.analysis.sentiment;
      const finalPrio = f.humanReview?.correctedPriority || f.analysis.priority;
      return [
        f.id,
        f.createdAt,
        f.status,
        f.analysis.category,
        finalCat,
        finalSent,
        finalPrio,
        `"${(f.department || '').replace(/"/g, '""')}"`,
        `"${(f.assignedTeam || '').replace(/"/g, '""')}"`,
        f.isAnonymous ? 'Yes' : 'No',
        f.studentRefId || 'N/A',
        `"${(f.analysis.summary || '').replace(/"/g, '""')}"`,
        `"${(f.analysis.extractedKeywords || []).join('; ')}"`,
        `"${f.text.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SFIS_Feedback_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
