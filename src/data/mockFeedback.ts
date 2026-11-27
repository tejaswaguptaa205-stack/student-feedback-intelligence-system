import { FeedbackItem } from '../types';

export const INITIAL_FEEDBACK_DATA: FeedbackItem[] = [
  {
    id: "SFIS-2026-0001",
    text: "The hostel water supply has been completely unavailable for two days, and the warden has not responded to our complaints. Students are unable to bathe or use washrooms before classes.",
    department: "Student Affairs & Housing",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-8192",
    createdAt: "2026-10-14T08:15:00Z",
    status: "In Progress",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 12,
    isOverdue: false,
    analysis: {
      category: "Hostel",
      categoryConfidence: 0.96,
      sentiment: "Negative",
      sentimentConfidence: 0.94,
      sentimentScore: -0.88,
      priority: "High",
      priorityJustification: "Time-sensitive service disruption: 48-hour water supply outage affecting student hygiene and dormitories.",
      extractedKeywords: ["water supply", "hostel", "warden", "washrooms", "unresponsive"],
      summary: "Hostel water supply has been unavailable for two days without an administrative response.",
      recommendedAction: "Escalate the maintenance issue to the hostel administration and dispatch emergency water tankers.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 18,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Hostel-Block-C-Water-Crisis",
      similarReportCount: 7,
      explainabilityTokens: [
        { token: "hostel", weight: 0.95, categoryHint: "Hostel" },
        { token: "water supply", weight: 0.92, categoryHint: "Hostel" },
        { token: "unavailable", weight: 0.84 },
        { token: "warden", weight: 0.78, categoryHint: "Hostel" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Admin S. Verma (Registrar Office)",
      reviewedAt: "2026-10-14T09:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-1",
        author: "S. Verma",
        role: "Chief Operations Officer",
        timestamp: "2026-10-14T09:05:00Z",
        note: "Plumbing contractor notified. Water pump failure identified at Block C substation."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-14T08:15:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Automated Edge categorization completed." },
      { timestamp: "2026-10-14T09:00:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "S. Verma", note: "Priority High validated. SLA set to 12h." },
      { timestamp: "2026-10-14T09:30:00Z", fromStatus: "Reviewed", toStatus: "In Progress", updatedBy: "Estate Team", note: "Tankers dispatched while main pump valve replaced." }
    ]
  },
  {
    id: "SFIS-2026-0002",
    text: "URGENT SAFETY HAZARD: Sparking and smoke coming from the power distribution board near Physics Lab 304. Exposed wires hanging right above the main hallway bench.",
    department: "School of Basic Sciences",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-10-14T09:40:00Z",
    status: "Reviewed",
    assignedTeam: "Electrical Safety & Disaster Response",
    slaTargetHours: 2,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.98,
      sentiment: "Negative",
      sentimentConfidence: 0.96,
      sentimentScore: -0.95,
      priority: "Critical",
      priorityJustification: "Immediate safety hazard detected: [spark, smoke, exposed wires]. High risk of electrical shock or laboratory fire.",
      extractedKeywords: ["safety hazard", "sparking", "smoke", "power distribution", "exposed wires"],
      summary: "Sparking and smoke detected from electrical distribution board near Physics Lab 304.",
      recommendedAction: "Immediately dispatch emergency electrical crew, cut main breaker, and cordoned off the hallway.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Science-Block-Electrical-Fault",
      similarReportCount: 3,
      explainabilityTokens: [
        { token: "safety hazard", weight: 0.99 },
        { token: "sparking", weight: 0.97 },
        { token: "smoke", weight: 0.96 },
        { token: "physics lab", weight: 0.88, categoryHint: "Infrastructure" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Dr. K. Narayanan (Campus Dean)",
      reviewedAt: "2026-10-14T09:45:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-2",
        author: "Dr. Narayanan",
        role: "Campus Dean",
        timestamp: "2026-10-14T09:46:00Z",
        note: "Emergency safety protocol activated. Substation 2 breaker tripped manually."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-14T09:40:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Flagged Critical by Heuristic Safety Rule." },
      { timestamp: "2026-10-14T09:45:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "Dr. Narayanan", note: "Immediate notification dispatched to Campus Security & Electrical." }
    ]
  },
  {
    id: "SFIS-2026-0003",
    text: "The final semester examination schedule has an overlap. Database Management Systems (CS402) and Machine Learning (CS408) are both scheduled on November 18 at 09:30 AM for dual-specialization students.",
    department: "School of Computing",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2023-1104",
    createdAt: "2026-10-13T14:20:00Z",
    status: "In Progress",
    assignedTeam: "Controller of Examinations",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Examination",
      categoryConfidence: 0.97,
      sentiment: "Negative",
      sentimentConfidence: 0.86,
      sentimentScore: -0.62,
      priority: "High",
      priorityJustification: "Schedule conflict affecting student degree progression: examination timetable clash on identical slot.",
      extractedKeywords: ["examination schedule", "overlap", "timetable", "database systems", "machine learning"],
      summary: "Examination schedule clash detected between CS402 and CS408 on November 18 morning session.",
      recommendedAction: "Escalate to Controller of Examinations to reschedule CS408 to alternate afternoon or buffer slot.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 19,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "CS-Nov-Exam-Overlap",
      similarReportCount: 12,
      explainabilityTokens: [
        { token: "examination", weight: 0.98, categoryHint: "Examination" },
        { token: "timetable", weight: 0.94, categoryHint: "Examination" },
        { token: "overlap", weight: 0.91 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Exam Controller Staff",
      reviewedAt: "2026-10-13T16:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-3",
        author: "P. Mukherjee",
        role: "Deputy Registrar (Exams)",
        timestamp: "2026-10-13T16:15:00Z",
        note: "Cross-checked curriculum enrollment. 48 students impacted. Rescheduling CS408 to Nov 21."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-13T14:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Processed locally." },
      { timestamp: "2026-10-13T16:00:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "Deputy Registrar", note: "Timetable revision circular drafted." },
      { timestamp: "2026-10-13T17:30:00Z", fromStatus: "Reviewed", toStatus: "In Progress", updatedBy: "Academic Senate", note: "Pending Dean approval for notification publication." }
    ]
  },
  {
    id: "SFIS-2026-0004",
    text: "Dr. Arvind Gupta's lectures on Quantum Mechanics are exceptionally engaging and clear. The supplementary problem sets and weekly doubt resolution sessions have drastically helped our entire batch.",
    department: "Department of Physics",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2024-5521",
    createdAt: "2026-10-13T11:00:00Z",
    status: "Resolved",
    assignedTeam: "Faculty Affairs & Academic Audit",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Faculty",
      categoryConfidence: 0.95,
      sentiment: "Positive",
      sentimentConfidence: 0.98,
      sentimentScore: 0.92,
      priority: "Low",
      priorityJustification: "Positive institutional commendation regarding faculty instructional excellence. Routine review.",
      extractedKeywords: ["quantum mechanics", "lectures", "engaging", "doubt resolution", "clear"],
      summary: "Commendation for Dr. Arvind Gupta's clear lectures, supplementary materials, and doubt sessions.",
      recommendedAction: "Forward appreciation commendation to Faculty Dean for annual teaching excellence portfolio.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "lectures", weight: 0.92, categoryHint: "Faculty" },
        { token: "engaging", weight: 0.90 },
        { token: "clear", weight: 0.88 },
        { token: "doubt resolution", weight: 0.84, categoryHint: "Faculty" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "HOD Physics",
      reviewedAt: "2026-10-13T14:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-4",
        author: "HOD Physics",
        role: "Head of Department",
        timestamp: "2026-10-13T14:10:00Z",
        note: "Commendation copied to Dr. Gupta and logged in department merit records."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-13T11:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Analyzed." },
      { timestamp: "2026-10-13T14:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "HOD Physics", note: "Added to Faculty Merit Register." }
    ]
  },
  {
    id: "SFIS-2026-0005",
    text: "The student fee payment portal debited 45,000 INR from my account twice due to gateway timeout, but the portal still says 'Payment Pending'. Please refund the extra amount urgently before late fees apply.",
    department: "Finance & Accounts",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2023-9021",
    createdAt: "2026-10-12T16:45:00Z",
    status: "In Progress",
    assignedTeam: "Bursar & Treasury Desk",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Fees",
      categoryConfidence: 0.99,
      sentiment: "Negative",
      sentimentConfidence: 0.91,
      sentimentScore: -0.74,
      priority: "High",
      priorityJustification: "Financial dispute with double deduction and imminent late fee penalty deadline.",
      extractedKeywords: ["fee payment", "refund", "gateway timeout", "debited twice", "late fee"],
      summary: "Student debited twice (45,000 INR) due to payment gateway timeout; portal marks dues pending.",
      recommendedAction: "Cross-check merchant settlement ledger with HDFC bank gateway and initiate automated reversal.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 17,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Payment-Gateway-Double-Debits",
      similarReportCount: 9,
      explainabilityTokens: [
        { token: "fee payment", weight: 0.99, categoryHint: "Fees" },
        { token: "refund", weight: 0.95, categoryHint: "Fees" },
        { token: "debited twice", weight: 0.92 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Accounts Officer",
      reviewedAt: "2026-10-13T09:30:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-5",
        author: "R. Sharma",
        role: "Accounts Officer",
        timestamp: "2026-10-13T09:40:00Z",
        note: "Bank transaction ID retrieved. Reversal request TXN-99812 logged with payment gateway provider."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-12T16:45:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Locally analyzed." },
      { timestamp: "2026-10-13T09:30:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "Accounts Officer", note: "Merchant bank settlement query initiated." }
    ]
  },
  {
    id: "SFIS-2026-0006",
    text: "Biometric attendance machines at Academic Block B entrance fail to recognize fingerprints during morning rush hours, causing half the class to be marked absent despite arriving on time.",
    department: "Student Affairs & Registrar",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2025-4122",
    createdAt: "2026-10-12T10:10:00Z",
    status: "Assigned",
    assignedTeam: "Campus IT & Biometric Infrastructure",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Attendance",
      categoryConfidence: 0.97,
      sentiment: "Negative",
      sentimentConfidence: 0.88,
      sentimentScore: -0.68,
      priority: "Medium",
      priorityJustification: "Systematic sensor failure resulting in erroneous absent records for morning class cohorts.",
      extractedKeywords: ["biometric attendance", "fingerprints", "marked absent", "morning rush", "sensor"],
      summary: "Biometric machines at Block B failing during peak arrival, recording inaccurate student absences.",
      recommendedAction: "Recalibrate optical scanners at Block B and instruct faculty to accept RFID card taps as secondary fallback.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Biometric-Scanner-Faults",
      similarReportCount: 5,
      explainabilityTokens: [
        { token: "attendance", weight: 0.97, categoryHint: "Attendance" },
        { token: "biometric", weight: 0.95, categoryHint: "Attendance" },
        { token: "marked absent", weight: 0.91, categoryHint: "Attendance" }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-12T10:10:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System (Edge NLP)", note: "Analyzed on Edge Node." },
      { timestamp: "2026-10-12T11:00:00Z", fromStatus: "Analyzed", toStatus: "Assigned", updatedBy: "Registrar IT", note: "Assigned to Biometric Maintenance vendor." }
    ]
  },
  {
    id: "SFIS-2026-0007",
    text: "The new bonafide certificate self-service portal is fantastic! I was able to download my signed certificate in under two minutes for my passport renewal application without waiting in lines at Counter 4.",
    department: "Registrar Office",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2024-3329",
    createdAt: "2026-10-11T15:20:00Z",
    status: "Resolved",
    assignedTeam: "Student Records & Registry",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Administration",
      categoryConfidence: 0.94,
      sentiment: "Positive",
      sentimentConfidence: 0.95,
      sentimentScore: 0.88,
      priority: "Low",
      priorityJustification: "Positive user experience on digital administrative services. No intervention required.",
      extractedKeywords: ["bonafide certificate", "self-service portal", "download", "passport renewal", "fast"],
      summary: "Student commends the fast digital bonafide certificate portal which eliminated manual counter queues.",
      recommendedAction: "Archive commendation for digital governance annual review.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "bonafide certificate", weight: 0.94, categoryHint: "Administration" },
        { token: "portal", weight: 0.82 },
        { token: "fantastic", weight: 0.95 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Assistant Registrar",
      reviewedAt: "2026-10-12T10:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-11T15:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Processed." },
      { timestamp: "2026-10-12T10:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Assistant Registrar", note: "Feedback recorded in portal satisfaction index." }
    ]
  },
  {
    id: "SFIS-2026-0008",
    text: "The updated syllabus for Distributed Systems (CS601) does not include any practical cloud computing labs or containerization tools. We only study 15-year-old RPC theory without modern hands-on skills.",
    department: "School of Computing",
    submissionType: "Suggestion",
    isAnonymous: false,
    studentRefId: "STU-2023-7412",
    createdAt: "2026-10-11T12:05:00Z",
    status: "Reviewed",
    assignedTeam: "Curriculum Advisory Board",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Academic",
      categoryConfidence: 0.98,
      sentiment: "Neutral",
      sentimentConfidence: 0.82,
      sentimentScore: -0.22,
      priority: "Medium",
      priorityJustification: "Constructive curriculum modernization suggestion for senior computer science coursework.",
      extractedKeywords: ["syllabus", "distributed systems", "cloud computing", "containerization", "practical labs"],
      summary: "Suggestion to modernize Distributed Systems curriculum with practical cloud and container labs.",
      recommendedAction: "Submit feedback to Curriculum Advisory Board for next academic session elective revision.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 21,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "syllabus", weight: 0.98, categoryHint: "Academic" },
        { token: "curriculum", weight: 0.92, categoryHint: "Academic" },
        { token: "cloud computing", weight: 0.85 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Academic Dean",
      reviewedAt: "2026-10-12T14:30:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-6",
        author: "Academic Dean",
        role: "Dean of Academics",
        timestamp: "2026-10-12T14:35:00Z",
        note: "Forwarded to Board of Studies (BoS). Evaluating Kubernetes and AWS Academy modules for next semester."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-11T12:05:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-12T14:30:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "Academic Dean", note: "Slated for BoS meeting agenda." }
    ]
  },
  {
    id: "SFIS-2026-0009",
    text: "Mess food served in Boys Hostel Dining Hall 2 yesterday was undercooked and sour. Over 15 students reported severe stomach cramps and vomiting last night, requiring clinic visits.",
    department: "Campus Health & Food Services",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2025-0199",
    createdAt: "2026-10-10T07:30:00Z",
    status: "In Progress",
    assignedTeam: "Food Safety & Hygiene Inspection",
    slaTargetHours: 6,
    isOverdue: true,
    analysis: {
      category: "Hostel",
      categoryConfidence: 0.95,
      sentiment: "Negative",
      sentimentConfidence: 0.98,
      sentimentScore: -0.96,
      priority: "Critical",
      priorityJustification: "Severe food safety hazard detected: [food poisoning, vomiting, stomach cramps]. Multiple students hospitalized/examined.",
      extractedKeywords: ["mess food", "hostel", "undercooked", "vomiting", "stomach cramps", "food poisoning"],
      summary: "Undercooked hostel mess food resulted in acute stomach illness and clinic visits for 15+ students.",
      recommendedAction: "Execute mandatory food safety audit, halt current mess vendor operations, and test kitchen water/food samples.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Hostel-Mess-2-Food-Poisoning",
      similarReportCount: 14,
      explainabilityTokens: [
        { token: "mess food", weight: 0.98, categoryHint: "Hostel" },
        { token: "hostel", weight: 0.95, categoryHint: "Hostel" },
        { token: "vomiting", weight: 0.96 },
        { token: "stomach cramps", weight: 0.92 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Chief Medical Officer",
      reviewedAt: "2026-10-10T08:10:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-7",
        author: "Dr. P. Roy",
        role: "Chief Medical Officer",
        timestamp: "2026-10-10T08:15:00Z",
        note: "Health clinic treated 16 students for gastroenteritis. Food safety team sealed food batch samples."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-10T07:30:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Critical safety trigger." },
      { timestamp: "2026-10-10T08:10:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "CMO", note: "Show cause notice issued to catering contractor." }
    ]
  },
  {
    id: "SFIS-2026-0010",
    text: "Wi-Fi speeds in Central Library 2nd floor silent reading zone have dropped below 1 Mbps for the past week. Research papers and IEEE Xplore articles take minutes to load.",
    department: "Library & IT Infrastructure",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-10-10T14:15:00Z",
    status: "Assigned",
    assignedTeam: "Network Operations Center",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.97,
      sentiment: "Negative",
      sentimentConfidence: 0.85,
      sentimentScore: -0.65,
      priority: "Medium",
      priorityJustification: "Sub-optimal internet speed in academic study area affecting research portal downloads.",
      extractedKeywords: ["wifi", "internet", "central library", "slow speed", "research papers"],
      summary: "Central library 2nd floor Wi-Fi bandwidth degraded below 1 Mbps, hindering online research access.",
      recommendedAction: "Check Cisco Access Point AP-LIB-204 for channel congestion and client bandwidth throttling.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Library-Wifi-Bandwidth",
      similarReportCount: 8,
      explainabilityTokens: [
        { token: "wifi", weight: 0.98, categoryHint: "Infrastructure" },
        { token: "library", weight: 0.89, categoryHint: "Infrastructure" },
        { token: "slow", weight: 0.85 }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-10T14:15:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Processed." },
      { timestamp: "2026-10-10T15:00:00Z", fromStatus: "Analyzed", toStatus: "Assigned", updatedBy: "IT Helpdesk", note: "Assigned to Network Operations Center." }
    ]
  },
  {
    id: "SFIS-2026-0011",
    text: "Professor Mehta frequently cancels scheduled office hours without advance email notice. Students waiting outside his office cabin are turned away by his research assistant.",
    department: "School of Engineering",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-6019",
    createdAt: "2026-10-09T16:20:00Z",
    status: "Reviewed",
    assignedTeam: "Faculty Affairs & Academic Audit",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Faculty",
      categoryConfidence: 0.96,
      sentiment: "Negative",
      sentimentConfidence: 0.88,
      sentimentScore: -0.71,
      priority: "Medium",
      priorityJustification: "Repeated unnotified cancellation of mandatory faculty office hours affecting student academic advisory.",
      extractedKeywords: ["professor", "office hours", "cancelled", "email notice", "cabin"],
      summary: "Unannounced cancellations of faculty office consultation hours impacting student mentorship.",
      recommendedAction: "Advisory memo to faculty member regarding compliance with mandatory student consultation hours.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 17,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "professor", weight: 0.96, categoryHint: "Faculty" },
        { token: "office hours", weight: 0.90, categoryHint: "Faculty" },
        { token: "turned away", weight: 0.82 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Associate Dean",
      reviewedAt: "2026-10-10T10:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-09T16:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-10T10:00:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "Associate Dean", note: "Discussion scheduled with faculty member." }
    ]
  },
  {
    id: "SFIS-2026-0012",
    text: "The re-evaluation fee of 1,200 INR per paper is excessively high for students from economically disadvantaged backgrounds. Can the university provide a waiver or subsidized rate for merit students?",
    department: "Finance & Examination Office",
    submissionType: "Suggestion",
    isAnonymous: false,
    studentRefId: "STU-2025-2241",
    createdAt: "2026-10-09T09:15:00Z",
    status: "Analyzed",
    assignedTeam: "Bursar & Treasury Desk",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Fees",
      categoryConfidence: 0.94,
      sentiment: "Neutral",
      sentimentConfidence: 0.79,
      sentimentScore: -0.28,
      priority: "Low",
      priorityJustification: "Policy reform suggestion regarding re-evaluation fee structures and student welfare waivers.",
      extractedKeywords: ["re-evaluation fee", "fees", "subsidized rate", "waiver", "scholarship"],
      summary: "Suggestion to introduce subsidized re-evaluation fees or fee waivers for economically disadvantaged students.",
      recommendedAction: "Submit proposal to University Finance Committee for next annual fee structure review.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 19,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "fees", weight: 0.96, categoryHint: "Fees" },
        { token: "re-evaluation", weight: 0.88, categoryHint: "Examination" },
        { token: "waiver", weight: 0.84, categoryHint: "Fees" }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-09T09:15:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." }
    ]
  },
  {
    id: "SFIS-2026-0013",
    text: "Administrative staff at Transcript Counter 2 were extremely helpful and processed my official international transcript envelope in 20 minutes for my German visa deadline. Thank you for the swift service!",
    department: "Registrar Office",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2022-0941",
    createdAt: "2026-10-08T14:40:00Z",
    status: "Resolved",
    assignedTeam: "Student Records & Registry",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Administration",
      categoryConfidence: 0.96,
      sentiment: "Positive",
      sentimentConfidence: 0.97,
      sentimentScore: 0.94,
      priority: "Low",
      priorityJustification: "Positive feedback commending swift counter assistance and student satisfaction.",
      extractedKeywords: ["transcript", "administrative staff", "counter 2", "helpful", "swift service"],
      summary: "Praise for transcript counter staff for swift 20-minute document issuance for visa application.",
      recommendedAction: "Issue commendation certificate to Counter 2 administrative personnel.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "transcript", weight: 0.95, categoryHint: "Administration" },
        { token: "administrative staff", weight: 0.94, categoryHint: "Administration" },
        { token: "helpful", weight: 0.91 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Registrar",
      reviewedAt: "2026-10-08T16:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-08T14:40:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-08T16:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Registrar", note: "Commendation noted." }
    ]
  },
  {
    id: "SFIS-2026-0014",
    text: "Medical leave approved by university health center was not updated in the ERP portal attendance register for 14 days, resulting in student being marked as 'Debarred from End Sem' on the draft list.",
    department: "Student Affairs & Registrar",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-1188",
    createdAt: "2026-10-08T11:20:00Z",
    status: "In Progress",
    assignedTeam: "Campus IT & Biometric Infrastructure",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Attendance",
      categoryConfidence: 0.98,
      sentiment: "Negative",
      sentimentConfidence: 0.92,
      sentimentScore: -0.82,
      priority: "High",
      priorityJustification: "Critical academic penalty risk: erroneous debarment from final examinations due to ERP medical leave synchronization latency.",
      extractedKeywords: ["medical leave", "attendance", "erp portal", "debarred", "end sem"],
      summary: "Medical leave delay in ERP system caused student to be erroneously listed as debarred from exams.",
      recommendedAction: "Immediately update attendance records and issue corrected hall ticket authorization.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 18,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "ERP-Medical-Leave-Lag",
      similarReportCount: 6,
      explainabilityTokens: [
        { token: "attendance", weight: 0.98, categoryHint: "Attendance" },
        { token: "medical leave", weight: 0.96, categoryHint: "Attendance" },
        { token: "debarred", weight: 0.90 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Dean Student Welfare",
      reviewedAt: "2026-10-08T12:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-8",
        author: "Dean Student Welfare",
        role: "Dean",
        timestamp: "2026-10-08T12:15:00Z",
        note: "Medical certificate verified with Dr. Roy. Attendance restored from 68% to 79.5%."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-08T11:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-08T12:00:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "DSW Office", note: "Syncing ERP records." }
    ]
  },
  {
    id: "SFIS-2026-0015",
    text: "The air conditioning units in Lecture Hall LH-101 are making loud grinding noises, making it impossible to hear the lecturer from the middle rows back.",
    department: "Campus Maintenance",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-10-07T15:30:00Z",
    status: "Resolved",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.96,
      sentiment: "Negative",
      sentimentConfidence: 0.84,
      sentimentScore: -0.66,
      priority: "Medium",
      priorityJustification: "Acoustic disruption in central lecture hall impairing classroom auditory environment.",
      extractedKeywords: ["air conditioning", "ac", "lecture hall", "loud noise", "maintenance"],
      summary: "AC unit in LH-101 generating loud mechanical grinding noise that obstructs lecturer audibility.",
      recommendedAction: "Inspect HVAC blower motor and replace worn bearings in LH-101 unit.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Lecture-Hall-HVAC-Repairs",
      similarReportCount: 4,
      explainabilityTokens: [
        { token: "air conditioning", weight: 0.95, categoryHint: "Infrastructure" },
        { token: "lecture hall", weight: 0.88, categoryHint: "Infrastructure" },
        { token: "loud", weight: 0.82 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Facility Engineer",
      reviewedAt: "2026-10-07T17:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-9",
        author: "M. Khan",
        role: "HVAC Supervisor",
        timestamp: "2026-10-08T10:00:00Z",
        note: "Belt pulley replaced and filter serviced during evening maintenance window."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-07T15:30:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-07T17:00:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "Facility", note: "Work order WO-992 created." },
      { timestamp: "2026-10-08T10:30:00Z", fromStatus: "In Progress", toStatus: "Resolved", updatedBy: "HVAC Supervisor", note: "Noise level verified < 38dB." }
    ]
  },
  {
    id: "SFIS-2026-0016",
    text: "Question 4(b) in yesterday's Mid-Semester Discrete Mathematics test was completely outside the prescribed syllabus units 1 through 3. The question carried 15 marks.",
    department: "Department of Mathematics",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2025-7714",
    createdAt: "2026-10-07T09:00:00Z",
    status: "Reviewed",
    assignedTeam: "Controller of Examinations",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Examination",
      categoryConfidence: 0.98,
      sentiment: "Negative",
      sentimentConfidence: 0.89,
      sentimentScore: -0.76,
      priority: "High",
      priorityJustification: "Mid-term examination integrity issue: 15-mark question allegedly out of syllabus.",
      extractedKeywords: ["discrete mathematics", "out of syllabus", "question paper", "mid-semester", "marks"],
      summary: "15-mark question in Discrete Mathematics mid-term alleged to be out of the prescribed syllabus.",
      recommendedAction: "Review question paper with Course Coordinator and consider awarding compensatory credit if verified.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Discrete-Math-Out-of-Syllabus",
      similarReportCount: 19,
      explainabilityTokens: [
        { token: "examination", weight: 0.95, categoryHint: "Examination" },
        { token: "out of syllabus", weight: 0.98, categoryHint: "Examination" },
        { token: "mid-semester", weight: 0.92, categoryHint: "Examination" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Exam Moderation Committee",
      reviewedAt: "2026-10-07T12:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-10",
        author: "Math Moderation Chair",
        role: "Professor",
        timestamp: "2026-10-07T12:30:00Z",
        note: "Question 4b checked. It pertains to Unit 4 graph connectivity. Grace marks approved for all candidates."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-07T09:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-07T12:00:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "Exam Board", note: "Moderation committee upheld student feedback." }
    ]
  },
  {
    id: "SFIS-2026-0017",
    text: "Can the university install electric vehicle (EV) charging stations near the main entrance parking lot? More day-scholar students and faculty members are commuting on electric scooters now.",
    department: "Campus Planning & Sustainability",
    submissionType: "Suggestion",
    isAnonymous: false,
    studentRefId: "STU-2023-8820",
    createdAt: "2026-10-06T13:10:00Z",
    status: "Submitted",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 120,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.93,
      sentiment: "Positive",
      sentimentConfidence: 0.76,
      sentimentScore: 0.35,
      priority: "Low",
      priorityJustification: "Green campus sustainability suggestion for EV infrastructure. No immediate operational risk.",
      extractedKeywords: ["charging stations", "electric vehicle", "parking", "sustainability", "commute"],
      summary: "Suggestion to add EV charging stations at main entrance parking for day-scholars and staff.",
      recommendedAction: "Include in Campus Sustainability Green Energy proposal for the upcoming fiscal capital budget.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "parking", weight: 0.90, categoryHint: "Infrastructure" },
        { token: "charging stations", weight: 0.88, categoryHint: "Infrastructure" }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-06T13:10:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." }
    ]
  },
  {
    id: "SFIS-2026-0018",
    text: "Hostel night curfew policy is unfairly strict for female students (07:30 PM) compared to male students (10:00 PM). This prevents female students from accessing campus research labs and library workshops in the evening.",
    department: "Student Affairs & Housing",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-4412",
    createdAt: "2026-10-06T10:45:00Z",
    status: "In Progress",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Hostel",
      categoryConfidence: 0.97,
      sentiment: "Negative",
      sentimentConfidence: 0.89,
      sentimentScore: -0.73,
      priority: "Medium",
      priorityJustification: "Equity and access complaint regarding disparate residential curfew hours impacting academic lab access.",
      extractedKeywords: ["hostel", "curfew", "female students", "research labs", "library"],
      summary: "Concerns raised regarding gender-disparate hostel curfew restricting female students from night labs.",
      recommendedAction: "Hostel Advisory Council to convene student town hall to formulate standardized 10 PM lab pass policy.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 17,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Hostel-Curfew-Equity",
      similarReportCount: 11,
      explainabilityTokens: [
        { token: "hostel", weight: 0.98, categoryHint: "Hostel" },
        { token: "curfew", weight: 0.94, categoryHint: "Hostel" },
        { token: "research labs", weight: 0.82 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Chief Warden",
      reviewedAt: "2026-10-06T14:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-11",
        author: "Chief Warden",
        role: "Warden",
        timestamp: "2026-10-06T14:15:00Z",
        note: "Lab extension pass system proposed with biometric check-in at library and research centers."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-06T10:45:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-06T14:00:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "Chief Warden", note: "Referred to Student Council meeting." }
    ]
  },
  {
    id: "SFIS-2026-0019",
    text: "The financial aid scholarship renewal list published on the university website accidentally exposed student personal bank account numbers and father's annual income publicly without redacting.",
    department: "Finance & Accounts",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-10-05T18:20:00Z",
    status: "Resolved",
    assignedTeam: "Data Protection & Legal Affairs",
    slaTargetHours: 2,
    isOverdue: false,
    analysis: {
      category: "Fees",
      categoryConfidence: 0.92,
      sentiment: "Negative",
      sentimentConfidence: 0.95,
      sentimentScore: -0.91,
      priority: "Critical",
      priorityJustification: "Immediate Data Privacy & Security breach: Public exposure of student financial PII and bank details.",
      extractedKeywords: ["scholarship", "bank account numbers", "privacy breach", "personal data", "fees"],
      summary: "Published scholarship renewal list publicly leaked student bank account numbers and family income data.",
      recommendedAction: "Immediately take down the unredacted PDF, purge web server caches, and re-upload sanitized version.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "scholarship", weight: 0.94, categoryHint: "Fees" },
        { token: "bank account", weight: 0.92, categoryHint: "Fees" },
        { token: "privacy breach", weight: 0.98 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Chief Information Security Officer",
      reviewedAt: "2026-10-05T18:35:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-12",
        author: "CISO",
        role: "Data Privacy Officer",
        timestamp: "2026-10-05T18:40:00Z",
        note: "PDF removed within 15 minutes. Sanitized version uploaded with masked account numbers."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-05T18:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Critical safety trigger." },
      { timestamp: "2026-10-05T18:35:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "CISO", note: "Breach mitigated and access audited." }
    ]
  },
  {
    id: "SFIS-2026-0020",
    text: "The student council elections voting process was smooth and transparent this year. The digital ballot kiosks worked without any glitches or line delays.",
    department: "Student Affairs & Dean Office",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2024-9122",
    createdAt: "2026-10-05T11:00:00Z",
    status: "Resolved",
    assignedTeam: "Student Records & Registry",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Administration",
      categoryConfidence: 0.91,
      sentiment: "Positive",
      sentimentConfidence: 0.96,
      sentimentScore: 0.91,
      priority: "Low",
      priorityJustification: "Positive feedback on student governance digital voting election operations.",
      extractedKeywords: ["student council", "elections", "digital ballot", "transparent", "smooth"],
      summary: "Praise for smooth and transparent digital ballot operation during student council elections.",
      recommendedAction: "Document voting workflow as a university best practice for future student ballots.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "administration", weight: 0.88, categoryHint: "Administration" },
        { token: "smooth", weight: 0.91 },
        { token: "transparent", weight: 0.89 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Dean Student Welfare",
      reviewedAt: "2026-10-05T15:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-05T11:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-05T15:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "DSW", note: "Archived." }
    ]
  },
  {
    id: "SFIS-2026-0021",
    text: "Professor Sengupta in Signals and Systems provides no feedback on weekly lab assignments. He returns graded sheets with only a single mark and no corrections or remarks on where we made calculation errors.",
    department: "Department of Electrical Engineering",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2023-3940",
    createdAt: "2026-10-04T16:10:00Z",
    status: "Reviewed",
    assignedTeam: "Faculty Affairs & Academic Audit",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Faculty",
      categoryConfidence: 0.95,
      sentiment: "Negative",
      sentimentConfidence: 0.89,
      sentimentScore: -0.69,
      priority: "Medium",
      priorityJustification: "Pedagogical feedback deficit: lack of constructive grading annotations in engineering lab work.",
      extractedKeywords: ["professor", "signals and systems", "no feedback", "lab assignments", "graded sheets"],
      summary: "Students report lack of constructive grading comments on Signals and Systems lab assignments.",
      recommendedAction: "Faculty peer reviewer to advise instructor on utilizing rubrics with constructive correction remarks.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 17,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "professor", weight: 0.95, categoryHint: "Faculty" },
        { token: "lab assignments", weight: 0.88, categoryHint: "Academic" },
        { token: "no feedback", weight: 0.91 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "HOD Electrical",
      reviewedAt: "2026-10-05T09:30:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-13",
        author: "HOD Electrical",
        role: "Department Head",
        timestamp: "2026-10-05T09:40:00Z",
        note: "Shared standardized grading rubric template with Prof. Sengupta."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-04T16:10:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-05T09:30:00Z", fromStatus: "Analyzed", toStatus: "Reviewed", updatedBy: "HOD Electrical", note: "Rubric guidance provided." }
    ]
  },
  {
    id: "SFIS-2026-0022",
    text: "Can the university provide shuttle bus services connecting South Campus hostels with the North Academic Complex during peak morning hours (08:00 AM - 09:30 AM)? Walking 2.5 km in summer heat is exhausting.",
    department: "Transport & Logistics",
    submissionType: "Suggestion",
    isAnonymous: false,
    studentRefId: "STU-2025-5021",
    createdAt: "2026-10-04T08:30:00Z",
    status: "Assigned",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.94,
      sentiment: "Neutral",
      sentimentConfidence: 0.81,
      sentimentScore: -0.15,
      priority: "Medium",
      priorityJustification: "Campus transit convenience suggestion to alleviate student travel strain during morning peak heat.",
      extractedKeywords: ["shuttle bus", "transport", "hostels", "academic complex", "campus transit"],
      summary: "Suggestion to operate morning shuttle buses between South Campus hostels and Academic Complex.",
      recommendedAction: "Conduct student transit survey and route feasibility analysis with campus fleet contractor.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Campus-Shuttle-Transit",
      similarReportCount: 7,
      explainabilityTokens: [
        { token: "shuttle bus", weight: 0.94, categoryHint: "Infrastructure" },
        { token: "hostels", weight: 0.85, categoryHint: "Hostel" }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-04T08:30:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-04T10:00:00Z", fromStatus: "Analyzed", toStatus: "Assigned", updatedBy: "Transport Office", note: "Fleet routing study initiated." }
    ]
  },
  {
    id: "SFIS-2026-0023",
    text: "The student grievance redressal committee portal times out whenever students attach PDF evidence files greater than 1 MB. This prevents filing formal complaints against ragging or mistreatment.",
    department: "Campus IT & Student Welfare",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-10-03T17:00:00Z",
    status: "In Progress",
    assignedTeam: "Data Protection & Legal Affairs",
    slaTargetHours: 12,
    isOverdue: false,
    analysis: {
      category: "Administration",
      categoryConfidence: 0.95,
      sentiment: "Negative",
      sentimentConfidence: 0.93,
      sentimentScore: -0.84,
      priority: "High",
      priorityJustification: "Critical administrative channel barrier: portal bug preventing submission of anti-ragging evidence documents.",
      extractedKeywords: ["grievance portal", "pdf attachment", "timeout", "ragging", "complaint submission"],
      summary: "Grievance portal attachment size limitation prevents students from uploading formal evidence files.",
      recommendedAction: "Increase server payload upload limit to 15 MB and enable multipart chunked uploads immediately.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 18,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "administration", weight: 0.92, categoryHint: "Administration" },
        { token: "grievance portal", weight: 0.95, categoryHint: "Administration" },
        { token: "ragging", weight: 0.90 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Dean Student Affairs",
      reviewedAt: "2026-10-03T18:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-14",
        author: "DevOps Engineer",
        role: "IT Admin",
        timestamp: "2026-10-03T18:30:00Z",
        note: "Nginx client_max_body_size updated from 1M to 25M on grievance cluster."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-03T17:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-03T18:00:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "Dean Student Affairs", note: "Hotfix deployed to nginx ingress." }
    ]
  },
  {
    id: "SFIS-2026-0024",
    text: "Hostel D block washing machines are all out of order. Out of 8 machines, 7 have broken drums and 1 leaks water everywhere. Students have been waiting in line for hours.",
    department: "Student Affairs & Housing",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-5110",
    createdAt: "2026-10-03T11:20:00Z",
    status: "Assigned",
    assignedTeam: "Campus Maintenance & Hostel Bureau",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Hostel",
      categoryConfidence: 0.98,
      sentiment: "Negative",
      sentimentConfidence: 0.94,
      sentimentScore: -0.85,
      priority: "Medium",
      priorityJustification: "Severe laundry amenity breakdown in high-capacity student dormitory.",
      extractedKeywords: ["hostel", "washing machines", "broken", "laundry", "dormitory"],
      summary: "7 of 8 washing machines in Hostel D are broken with severe queues and water leaks.",
      recommendedAction: "Dispatch commercial laundry repair technician to repair drums and replace damaged inlet valves.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Hostel-D-Laundry-Breakdown",
      similarReportCount: 9,
      explainabilityTokens: [
        { token: "hostel", weight: 0.98, categoryHint: "Hostel" },
        { token: "washing machines", weight: 0.95, categoryHint: "Hostel" },
        { token: "broken", weight: 0.88 }
      ]
    },
    humanReview: {
      isReviewed: false
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-03T11:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-03T12:00:00Z", fromStatus: "Analyzed", toStatus: "Assigned", updatedBy: "Hostel Caretaker", note: "Service call placed with IFB commercial." }
    ]
  },
  {
    id: "SFIS-2026-0025",
    text: "The library inter-library loan service obtained rare manuscripts for my postgraduate dissertation within three working days from Delhi University library. Excellent support from the head librarian!",
    department: "Library & IT Infrastructure",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2022-7729",
    createdAt: "2026-10-02T14:10:00Z",
    status: "Resolved",
    assignedTeam: "Student Records & Registry",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Infrastructure",
      categoryConfidence: 0.92,
      sentiment: "Positive",
      sentimentConfidence: 0.98,
      sentimentScore: 0.95,
      priority: "Low",
      priorityJustification: "Positive recognition of library research assistance and inter-university document delivery.",
      extractedKeywords: ["library", "manuscripts", "dissertation", "librarian", "excellent support"],
      summary: "Praise for library inter-library loan speed delivering rare dissertation manuscripts in 3 days.",
      recommendedAction: "Record appreciation in Library Staff Performance Review.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "library", weight: 0.95, categoryHint: "Infrastructure" },
        { token: "excellent support", weight: 0.96 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Chief Librarian",
      reviewedAt: "2026-10-02T16:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-02T14:10:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-02T16:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Chief Librarian", note: "Recorded." }
    ]
  },
  {
    id: "SFIS-2026-0026",
    text: "Attendance portal calculated my attendance as 74.2% and blocked my examination admit card, but failed to include three official duty leaves approved by the sports directorate for inter-university athletics meet.",
    department: "Sports Directorate & Registrar",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2024-8831",
    createdAt: "2026-10-02T09:30:00Z",
    status: "Resolved",
    assignedTeam: "Controller of Examinations",
    slaTargetHours: 12,
    isOverdue: false,
    analysis: {
      category: "Attendance",
      categoryConfidence: 0.99,
      sentiment: "Negative",
      sentimentConfidence: 0.93,
      sentimentScore: -0.79,
      priority: "High",
      priorityJustification: "Unregistered official duty leaves threatening examination hall ticket eligibility.",
      extractedKeywords: ["attendance", "admit card", "duty leave", "blocked", "inter-university"],
      summary: "Sports duty leave missing in portal caused student attendance to dip to 74.2%, blocking admit card.",
      recommendedAction: "Audit sports duty leave approvals and recalculate attendance above 75% threshold.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "attendance", weight: 0.99, categoryHint: "Attendance" },
        { token: "duty leave", weight: 0.96, categoryHint: "Attendance" },
        { token: "admit card", weight: 0.91, categoryHint: "Examination" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Sports Officer",
      reviewedAt: "2026-10-02T11:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-15",
        author: "Sports Director",
        role: "Director",
        timestamp: "2026-10-02T11:15:00Z",
        note: "Verified participation in National University Games. Duty leave letter signed and ERP updated to 78.4%."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-02T09:30:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-02T11:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Exam Controller", note: "Admit card unlocked." }
    ]
  },
  {
    id: "SFIS-2026-0027",
    text: "The new Artificial Intelligence elective course AI450 has a world-class syllabus covering Large Language Models, Transformers, and Ethics. Hands-on PyTorch coding assignments are fantastic.",
    department: "School of Computing",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2023-1490",
    createdAt: "2026-10-01T15:00:00Z",
    status: "Resolved",
    assignedTeam: "Curriculum Advisory Board",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Academic",
      categoryConfidence: 0.98,
      sentiment: "Positive",
      sentimentConfidence: 0.97,
      sentimentScore: 0.93,
      priority: "Low",
      priorityJustification: "Positive appraisal for modern AI elective curriculum design and practical pedagogy.",
      extractedKeywords: ["artificial intelligence", "syllabus", "transformers", "elective", "course"],
      summary: "Appreciation for AI450 course syllabus, covering LLMs, transformers, and practical PyTorch labs.",
      recommendedAction: "Highlight course success in Academic Council curriculum review as a model template.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "syllabus", weight: 0.98, categoryHint: "Academic" },
        { token: "course", weight: 0.93, categoryHint: "Academic" },
        { token: "fantastic", weight: 0.91 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Dean Academics",
      reviewedAt: "2026-10-01T17:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-10-01T15:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-01T17:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Dean Academics", note: "Noted." }
    ]
  },
  {
    id: "SFIS-2026-0028",
    text: "Can the university administration clarify the refund policy for hostel caution deposit? Final-year students graduated two months ago and none of us have received deposit refunds into our bank accounts.",
    department: "Finance & Accounts",
    submissionType: "Complaint",
    isAnonymous: false,
    studentRefId: "STU-2022-3112",
    createdAt: "2026-10-01T10:20:00Z",
    status: "In Progress",
    assignedTeam: "Bursar & Treasury Desk",
    slaTargetHours: 48,
    isOverdue: false,
    analysis: {
      category: "Fees",
      categoryConfidence: 0.97,
      sentiment: "Negative",
      sentimentConfidence: 0.86,
      sentimentScore: -0.64,
      priority: "Medium",
      priorityJustification: "Systematic delay in caution deposit refunds to graduated alumni cohort.",
      extractedKeywords: ["refund policy", "caution deposit", "fees", "bank account", "hostel deposit"],
      summary: "Graduated alumni have not received hostel caution deposit refunds after two months.",
      recommendedAction: "Finance office to audit alumni clearance clearances and publish batch refund disbursement timeline.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 16,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      similarIssueCluster: "Alumni-Deposit-Refunds",
      similarReportCount: 16,
      explainabilityTokens: [
        { token: "refund", weight: 0.97, categoryHint: "Fees" },
        { token: "fees", weight: 0.94, categoryHint: "Fees" },
        { token: "deposit", weight: 0.91, categoryHint: "Fees" }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Bursar",
      reviewedAt: "2026-10-01T14:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-16",
        author: "Bursar",
        role: "Finance Head",
        timestamp: "2026-10-01T14:10:00Z",
        note: "Batch refund file submitted to SBI for NEFT transfer. Scheduled for processing on Friday."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-10-01T10:20:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-01T14:00:00Z", fromStatus: "Analyzed", toStatus: "In Progress", updatedBy: "Bursar", note: "NEFT batch queue created." }
    ]
  },
  {
    id: "SFIS-2026-0029",
    text: "During the mid-term test in Hall 402, three invigilators were speaking loudly with each other for over an hour, causing continuous distraction to all students trying to solve numerical problems.",
    department: "Controller of Examinations",
    submissionType: "Complaint",
    isAnonymous: true,
    createdAt: "2026-09-30T16:15:00Z",
    status: "Resolved",
    assignedTeam: "Controller of Examinations",
    slaTargetHours: 24,
    isOverdue: false,
    analysis: {
      category: "Examination",
      categoryConfidence: 0.96,
      sentiment: "Negative",
      sentimentConfidence: 0.88,
      sentimentScore: -0.72,
      priority: "Medium",
      priorityJustification: "Test environment disruption caused by invigilator noise during high-stakes examination.",
      extractedKeywords: ["mid-term test", "invigilators", "talking loudly", "distraction", "examination"],
      summary: "Invigilators talking loudly in exam hall 402 distracted students during mid-term numerical paper.",
      recommendedAction: "Issue protocol reminder to exam invigilation squads regarding strict exam hall silence.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 15,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "examination", weight: 0.96, categoryHint: "Examination" },
        { token: "invigilators", weight: 0.95, categoryHint: "Examination" },
        { token: "distraction", weight: 0.86 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Chief Exam Superintendent",
      reviewedAt: "2026-10-01T09:00:00Z",
      isConfirmed: true
    },
    internalNotes: [
      {
        id: "note-17",
        author: "Chief Superintendent",
        role: "Superintendent",
        timestamp: "2026-10-01T09:15:00Z",
        note: "Hall 402 invigilator team counseled. Written circular on test hall conduct reissued."
      }
    ],
    resolutionHistory: [
      { timestamp: "2026-09-30T16:15:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-10-01T09:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Superintendent", note: "Counseling completed." }
    ]
  },
  {
    id: "SFIS-2026-0030",
    text: "The student campus clinic doctor Dr. Anjali was compassionate and diagnosed my severe allergy promptly. She gave medication and checked on me twice while I rested in the clinic ward.",
    department: "Campus Health & Food Services",
    submissionType: "Appreciation",
    isAnonymous: false,
    studentRefId: "STU-2025-8839",
    createdAt: "2026-09-29T12:00:00Z",
    status: "Resolved",
    assignedTeam: "Student Records & Registry",
    slaTargetHours: 72,
    isOverdue: false,
    analysis: {
      category: "Administration",
      categoryConfidence: 0.86,
      sentiment: "Positive",
      sentimentConfidence: 0.98,
      sentimentScore: 0.96,
      priority: "Low",
      priorityJustification: "Warm appreciation for healthcare staff diligence and bedside manner.",
      extractedKeywords: ["campus clinic", "doctor", "prompt diagnosis", "compassionate", "medication"],
      summary: "Appreciation for campus doctor Dr. Anjali for prompt allergy diagnosis and attentive patient care.",
      recommendedAction: "Send formal commendation to Campus Health Directorate for medical staff recognition.",
      modelVersion: "SFIS-Edge-DistilBERT-v2.4-int8",
      processingTimeMs: 14,
      edgeDeviceUsed: "EdgeGateway-CampusNode-01 (NPU)",
      isLocallyProcessed: true,
      detectedLanguage: "English (en-US)",
      explainabilityTokens: [
        { token: "clinic", weight: 0.88, categoryHint: "Administration" },
        { token: "compassionate", weight: 0.95 },
        { token: "prompt", weight: 0.90 }
      ]
    },
    humanReview: {
      isReviewed: true,
      reviewedBy: "Health Directorate",
      reviewedAt: "2026-09-29T16:00:00Z",
      isConfirmed: true
    },
    internalNotes: [],
    resolutionHistory: [
      { timestamp: "2026-09-29T12:00:00Z", fromStatus: "Submitted", toStatus: "Analyzed", updatedBy: "System", note: "Analyzed." },
      { timestamp: "2026-09-29T16:00:00Z", fromStatus: "Analyzed", toStatus: "Resolved", updatedBy: "Health Directorate", note: "Logged in commendations." }
    ]
  }
];
