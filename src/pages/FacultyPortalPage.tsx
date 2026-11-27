import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Send,
  History,
  Lock,
  Activity,
  Megaphone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Clock,
  Info
} from 'lucide-react';
import {
  User,
  FeedbackItem,
  FeedbackCategory,
  SubmissionType,
  FacultyFeedbackArea,
  DepartmentAnnouncement
} from '../types';
import { PriorityBadge, SentimentBadge, StatusBadge } from '../components/common/Badges';
import { analyzeFeedbackText } from '../services/nlpEngine';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

interface FacultyPortalPageProps {
  currentUser: User;
  onLogout: () => void;
}

const FACULTY_FEEDBACK_AREAS: FacultyFeedbackArea[] = [
  'Workload and Timetable Concerns',
  'Infrastructure and Laboratory Issues',
  'IT and Technical Support',
  'Examination Management',
  'Student Support Concerns',
  'Research and Development Support',
  'Administrative Process Concerns',
  'HR and Faculty Welfare',
  'Campus Safety Issues'
];

export const FacultyPortalPage: React.FC<FacultyPortalPageProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'my_feedback' | 'confidential' | 'tracking' | 'announcements'>('submit');

  // Form states
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackArea, setFeedbackArea] = useState<FacultyFeedbackArea>('Infrastructure and Laboratory Issues');
  const [department, setDepartment] = useState(currentUser.department || 'School of Computing');
  const [courseSubject, setCourseSubject] = useState('CS402 Advanced Database Systems');
  const [semester, setSemester] = useState('Fall 2026, Semester 5');
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | ''>('Infrastructure');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('Complaint');
  const [isConfidential, setIsConfidential] = useState(false);

  // Real-time NLP preview
  const [previewAnalysis, setPreviewAnalysis] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Data states
  const [facultyFeedback, setFacultyFeedback] = useState<FeedbackItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [announcements, setAnnouncements] = useState<DepartmentAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);

  // Faculty Presets
  const FACULTY_PRESETS = [
    {
      label: 'Lab Workstation Connectivity (Infrastructure)',
      text: 'In Advanced Database Lab 2, 14 out of 35 workstations fail to connect to the PostgreSQL local instance due to IP configuration errors. This severely hinders our practical exam preparation.',
      area: 'Infrastructure and Laboratory Issues' as FacultyFeedbackArea,
      category: 'Infrastructure' as FeedbackCategory,
      confidential: false
    },
    {
      label: 'Excessive Timetable Load (Workload - Confidential)',
      text: 'Confidential report: Excessive timetable scheduling with consecutive 4-hour lab slots and zero break intervals violates faculty welfare policy and impacts teaching effectiveness.',
      area: 'Workload and Timetable Concerns' as FacultyFeedbackArea,
      category: 'Administration' as FeedbackCategory,
      confidential: true
    },
    {
      label: 'Exam Room Malpractice & Seating (Examination)',
      text: 'The seating capacity in Hall 3 is overcrowded with only 12 inches between benches. Invigilators cannot navigate rows properly to ensure examination integrity.',
      area: 'Examination Management' as FacultyFeedbackArea,
      category: 'Examination' as FeedbackCategory,
      confidential: false
    },
    {
      label: 'R&D GPU Cluster Access (Research)',
      text: 'The research cluster compute nodes lack sufficient CUDA drivers for PyTorch 2.4. Graduate researchers are unable to train transformer models for conference deadlines.',
      area: 'Research and Development Support' as FacultyFeedbackArea,
      category: 'Infrastructure' as FeedbackCategory,
      confidential: false
    }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await ApiService.getFeedback();
      setFacultyFeedback(items);
      if (items.length > 0 && !selectedItem) {
        setSelectedItem(items[0]);
      }
    } catch (e) {
      const all = StorageService.getFeedback();
      const myItems = all.filter(f => f.submitterId === currentUser.id);
      setFacultyFeedback(myItems);
      if (myItems.length > 0 && !selectedItem) {
        setSelectedItem(myItems[0]);
      }
    } finally {
      setLoading(false);
    }

    try {
      const anns = await ApiService.getAnnouncements();
      setAnnouncements(anns);
    } catch (e) {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Real-time Edge NLP preview
  useEffect(() => {
    if (feedbackText.trim().length >= 15) {
      const result = analyzeFeedbackText(
        feedbackText,
        selectedCategory ? selectedCategory : undefined,
        { device: 'Local Edge NPU (Browser Runtime)' }
      );
      setPreviewAnalysis(result);
    } else {
      setPreviewAnalysis(null);
    }
  }, [feedbackText, selectedCategory]);

  const handleApplyPreset = (p: typeof FACULTY_PRESETS[0]) => {
    setFeedbackText(p.text);
    setFeedbackArea(p.area);
    setSelectedCategory(p.category);
    setIsConfidential(p.confidential);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setSubmitting(true);
    setSubmitSuccess(null);

    try {
      const newItem = StorageService.submitFeedback({
        text: feedbackText.trim(),
        department,
        selectedCategory: selectedCategory || undefined,
        submissionType,
        isAnonymous: false,
        submitterId: currentUser.id,
        submitterRole: 'faculty',
        courseSubject,
        semester,
        feedbackArea,
        isConfidential
      });

      setSubmitSuccess(
        `Faculty submission logged successfully! Ticket ID: ${newItem.id}. Analyzed category: '${newItem.analysis.category}' with ${newItem.analysis.priority} Priority.${
          isConfidential ? ' [Marked as Confidential: Restricted to Dean/Registrar]' : ''
        }`
      );
      setFeedbackText('');
      setPreviewAnalysis(null);

      await loadData();
      setSelectedItem(newItem);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const confidentialItems = facultyFeedback.filter(f => f.isConfidential);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#20242B]">
      {/* Top Banner / Faculty Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#244A73] text-white flex items-center justify-center font-bold shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#20242B]">Faculty Feedback & Governance Portal</h1>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {currentUser.designation || 'Faculty Member'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {currentUser.full_name} • ID: <span className="font-mono text-gray-700 font-semibold">{currentUser.institutional_id}</span> • {currentUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-300 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 border-t border-gray-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Submit Faculty Feedback
          </button>
          <button
            onClick={() => setActiveTab('my_feedback')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'my_feedback'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            My Submissions ({facultyFeedback.length})
          </button>
          <button
            onClick={() => setActiveTab('confidential')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'confidential'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Confidential Reports ({confidentialItems.length})
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'tracking'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Resolution Tracking
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'announcements'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Department Announcements ({announcements.length})
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ======================================================== */}
        {/* TAB 1: SUBMIT FACULTY FEEDBACK                           */}
        {/* ======================================================== */}
        {activeTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Confidentiality Callout Box */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Faculty Grievance & Operational Intake</h3>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      Faculty submissions allow reporting on curriculum pacing, laboratory infrastructure, administrative bottlenecks,
                      or sensitive workload concerns. Confidential items are routed exclusively to authorized executive administrators.
                    </p>
                  </div>
                </div>

                {/* Confidential Submission Toggle */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className={`w-4 h-4 ${isConfidential ? 'text-amber-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Confidential Submission Option</div>
                      <div className="text-[11px] text-gray-500">
                        {isConfidential
                          ? 'Restricted: Visible ONLY to authorized Academic Dean and Registrar Office.'
                          : 'Standard departmental visibility across assigned maintenance and academic teams.'}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={e => setIsConfidential(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>

              {/* Success Notification */}
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Submission Confirmed</div>
                    <div className="mt-0.5">{submitSuccess}</div>
                    <button
                      onClick={() => setActiveTab('my_feedback')}
                      className="mt-2 text-[#244A73] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View in My Submissions <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Main Faculty Form */}
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
                
                {/* Row 1: Feedback Area & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Faculty Feedback Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={feedbackArea}
                      onChange={e => setFeedbackArea(e.target.value as FacultyFeedbackArea)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white font-medium"
                    >
                      {FACULTY_FEEDBACK_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Academic Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                    >
                      <option value="School of Computing">School of Computing</option>
                      <option value="Department of Electrical Engineering">Department of Electrical Engineering</option>
                      <option value="Department of Physics">Department of Physics</option>
                      <option value="Department of Mathematics">Department of Mathematics</option>
                      <option value="School of Basic Sciences">School of Basic Sciences</option>
                      <option value="Controller of Examinations">Controller of Examinations</option>
                      <option value="Library & IT Infrastructure">Library & IT Infrastructure</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Course / Subject and Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Course & Subject / Code
                    </label>
                    <input
                      type="text"
                      value={courseSubject}
                      onChange={e => setCourseSubject(e.target.value)}
                      placeholder="e.g. CS402 Advanced Database Systems"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Semester & Academic Year
                    </label>
                    <input
                      type="text"
                      value={semester}
                      onChange={e => setSemester(e.target.value)}
                      placeholder="e.g. Fall 2026, Semester 5"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                    />
                  </div>
                </div>

                {/* Row 3: Pre-assigned NLP Category Hint & Intent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Category Routing Hint (8 SFIS Domains)
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value as FeedbackCategory)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                    >
                      <option value="Infrastructure">Infrastructure (Labs, Wi-Fi, Electrical)</option>
                      <option value="Academic">Academic (Curriculum, Pacing, Materials)</option>
                      <option value="Examination">Examination (Seating, Papers, Malpractice)</option>
                      <option value="Administration">Administration (Scheduling, Processes, HR)</option>
                      <option value="Faculty">Faculty (Peer/Support Concerns)</option>
                      <option value="Attendance">Attendance (Biometric, Leave Disputes)</option>
                      <option value="Fees">Fees (Funding, Budgeting, Grants)</option>
                      <option value="Hostel">Hostel (Student Residential Issues)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Report Classification
                    </label>
                    <select
                      value={submissionType}
                      onChange={e => setSubmissionType(e.target.value as SubmissionType)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                    >
                      <option value="Complaint">Operational Defect / Complaint</option>
                      <option value="Suggestion">Strategic Proposal / Suggestion</option>
                      <option value="General">Institutional Observation</option>
                      <option value="Appreciation">Administrative Commendation</option>
                    </select>
                  </div>
                </div>

                {/* Text Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Observation Details <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {feedbackText.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Provide specific operational details, equipment numbers, lab sections, or administrative timelines..."
                    className="w-full text-xs p-3 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none leading-relaxed"
                  />
                </div>

                {/* Faculty Preset Samples */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Representative Faculty Scenarios:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FACULTY_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="text-left p-2.5 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 text-[11px] transition-colors"
                      >
                        <div className="font-semibold text-[#244A73] truncate">{p.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{p.area}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !feedbackText.trim()}
                    className="w-full py-2.5 px-4 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Running Edge NLP Pipeline...' : isConfidential ? 'Submit Confidential Faculty Report' : 'Submit Faculty Feedback'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>

            {/* Right 1 Col: Edge NLP Preview */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Sparkles className="w-4 h-4 text-[#244A73]" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Shared Edge NLP Inference
                  </h3>
                </div>

                {previewAnalysis ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium">Domain Classification</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[#244A73]">{previewAnalysis.category}</span>
                        <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {(previewAnalysis.categoryConfidence * 100).toFixed(0)}% Conf
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-1">Sentiment</div>
                        <SentimentBadge sentiment={previewAnalysis.sentiment} />
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-1">Calculated Priority</div>
                        <PriorityBadge priority={previewAnalysis.priority} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium">Safety/Urgency Justification</div>
                      <p className="text-xs text-gray-700 mt-1 italic leading-relaxed">
                        "{previewAnalysis.priorityJustification}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium mb-1.5">Extracted Key Concepts</div>
                      <div className="flex flex-wrap gap-1.5">
                        {previewAnalysis.extractedKeywords.map((kw: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded font-mono"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium">Auto-Generated Summary</div>
                      <p className="text-xs text-gray-800 mt-1 bg-gray-50 p-2.5 rounded border border-gray-200">
                        {previewAnalysis.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Inference Execution Latency:</span>
                      <span className="font-mono font-bold text-emerald-700">{previewAnalysis.processingTimeMs} ms</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 text-center text-gray-400 py-8">
                    <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">Type at least 15 characters to preview on-device Edge NLP evaluation.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY SUBMITTED FEEDBACK                             */}
        {/* ======================================================== */}
        {activeTab === 'my_feedback' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">My Faculty Submissions</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Restricted view: displaying submissions authored by {currentUser.full_name} ({currentUser.institutional_id}).
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-xs text-[#244A73] font-semibold border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-gray-500">Loading submissions...</div>
            ) : facultyFeedback.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <History className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">No Submissions Recorded</h3>
                <p className="text-xs text-gray-500 mt-1">Submit your first departmental or workload observation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyFeedback.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveTab('tracking');
                    }}
                    className={`bg-white border rounded-lg p-5 shadow-sm hover:border-[#244A73] cursor-pointer transition-all ${
                      selectedItem?.id === item.id ? 'border-[#244A73] ring-1 ring-[#244A73]' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#244A73]">{item.id}</span>
                        {item.isConfidential && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5" /> Confidential
                          </span>
                        )}
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="text-[11px] font-semibold text-gray-500 mb-1">{item.feedbackArea || item.department}</div>
                    <p className="text-xs text-gray-800 line-clamp-3 mb-3 leading-relaxed">{item.text}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-[11px]">
                      <span className="font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {item.analysis.category}
                      </span>
                      <PriorityBadge priority={item.analysis.priority} />
                      <SentimentBadge sentiment={item.analysis.sentiment} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONFIDENTIAL REPORTS                             */}
        {/* ======================================================== */}
        {activeTab === 'confidential' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-xs text-amber-900 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Confidential Submissions Safehouse</h3>
                <p className="mt-1 leading-relaxed">
                  Confidential reports are protected through role-based database permissions. These submissions are permanently
                  excluded from public department metrics and are accessible only to authorized academic leadership (Dean / Registrar).
                </p>
              </div>
            </div>

            {confidentialItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <Lock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">No confidential reports filed under your account.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {confidentialItems.map(item => (
                  <div key={item.id} className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#244A73]">{item.id}</span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Confidential
                        </span>
                        <span className="text-xs text-gray-500 font-medium">• {item.feedbackArea}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 mt-2">
                      "{item.text}"
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Assigned: {item.assignedTeam}</span>
                      <span>Target SLA: {item.slaTargetHours} hours</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STATUS & ACTION TRACKER                           */}
        {/* ======================================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {selectedItem ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900">{selectedItem.id}</h2>
                      <StatusBadge status={selectedItem.status} />
                      <PriorityBadge priority={selectedItem.analysis.priority} />
                      {selectedItem.isConfidential && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Confidential
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted on {new Date(selectedItem.createdAt).toLocaleString()} • {selectedItem.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">Responsible Response Bureau</div>
                    <div className="text-xs font-bold text-[#244A73]">{selectedItem.assignedTeam}</div>
                  </div>
                </div>

                <div className="py-4 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Faculty Report</div>
                  <p className="text-xs text-gray-900 leading-relaxed bg-gray-50 p-3.5 rounded border border-gray-200">
                    "{selectedItem.text}"
                  </p>
                </div>

                {/* Progress */}
                <div className="py-6 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Resolution Progress</h3>
                  {(() => {
                    const steps = ['Submitted', 'Analyzed', 'Reviewed', 'In Progress', 'Resolved'];
                    const currentIdx = steps.indexOf(selectedItem.status);
                    return (
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {steps.map((st, i) => (
                          <div key={st} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                i <= currentIdx
                                  ? 'bg-[#244A73] text-white'
                                  : 'bg-gray-100 text-gray-400 border border-gray-300'
                              }`}
                            >
                              {i <= currentIdx ? '✓' : i + 1}
                            </div>
                            <div className={`text-[11px] mt-2 font-semibold ${i === currentIdx ? 'text-[#244A73]' : 'text-gray-600'}`}>
                              {st}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Timeline */}
                <div className="pt-4">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Audit Timeline</h3>
                  <div className="space-y-3">
                    {selectedItem.resolutionHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs bg-gray-50 p-3 rounded border border-gray-100">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{h.updatedBy}</span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              {new Date(h.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{h.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <Activity className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">Select a submission from the My Submissions tab to track status.</p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DEPARTMENTAL ANNOUNCEMENTS                        */}
        {/* ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900">Official Departmental Directives & Announcements</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official notices broadcast from the Academic Registrar, Controller of Examinations, and Facilities.
              </p>
            </div>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{ann.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ann.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : ann.priority === 'Important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ann.priority}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">{ann.content}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Department: <strong className="text-gray-700">{ann.department}</strong></span>
                    <span>Issued By: <strong className="text-gray-700">{ann.author}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
