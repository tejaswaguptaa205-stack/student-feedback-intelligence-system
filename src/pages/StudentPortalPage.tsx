import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Send,
  History,
  Activity,
  Bell,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  BookOpen,
  IdCard,
  User as UserIcon,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { User, FeedbackItem, FeedbackCategory, SubmissionType, NotificationItem } from '../types';
import { PriorityBadge, SentimentBadge, StatusBadge } from '../components/common/Badges';
import { analyzeFeedbackText } from '../services/nlpEngine';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

interface StudentPortalPageProps {
  currentUser: User;
  onLogout: () => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'tracking' | 'notifications'>('submit');

  // Submission form state
  const [feedbackText, setFeedbackText] = useState('');
  const [department, setDepartment] = useState(currentUser.department || 'School of Computing');
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | ''>('');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('Complaint');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [courseSubject, setCourseSubject] = useState(currentUser.course || '');
  const [semester, setSemester] = useState('Fall 2026');

  // Real-time NLP preview
  const [previewAnalysis, setPreviewAnalysis] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Data states
  const [studentFeedback, setStudentFeedback] = useState<FeedbackItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Demo presets
  const STUDENT_PRESETS = [
    {
      label: 'Hostel Water Supply (High Urgency)',
      text: 'The hostel water supply in Block C has been shut off for two days without notice. We are unable to prepare for exams or use basic washrooms.'
    },
    {
      label: 'Lab Workstation Failure (Infrastructure)',
      text: 'In Computer Lab 2, several terminals cannot connect to the local compiler. The monitor flickers constantly during laboratory sessions.'
    },
    {
      label: 'Commendation for Faculty (Positive)',
      text: 'Professor Sharma explained advanced dynamic programming algorithms with outstanding clarity and practical code walkthroughs today.'
    },
    {
      label: 'Attendance Portal Discrepancy (Attendance)',
      text: 'The biometric attendance scanner in Lecture Hall 4 marked my attendance absent despite being present for the full two hours.'
    }
  ];

  // Load student's feedback and notifications
  const loadData = async () => {
    setLoadingFeedback(true);
    try {
      // 1. Fetch from backend API
      const items = await ApiService.getFeedback();
      setStudentFeedback(items);
      if (items.length > 0 && !selectedItem) {
        setSelectedItem(items[0]);
      }
    } catch (e) {
      // Fallback to local storage filtered by student ID or ref ID
      const all = StorageService.getFeedback();
      const myItems = all.filter(f =>
        f.submitterId === currentUser.id ||
        (f.studentRefId && f.studentRefId === currentUser.institutional_id)
      );
      setStudentFeedback(myItems);
      if (myItems.length > 0 && !selectedItem) {
        setSelectedItem(myItems[0]);
      }
    } finally {
      setLoadingFeedback(false);
    }

    try {
      const notifs = await ApiService.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      // Fallback
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Real-time NLP inference preview as student types
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

  const handleApplyPreset = (text: string) => {
    setFeedbackText(text);
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
        isAnonymous,
        studentRefId: isAnonymous ? undefined : currentUser.institutional_id,
        submitterId: isAnonymous ? undefined : currentUser.id,
        submitterRole: isAnonymous ? 'anonymous' : 'student',
        courseSubject,
        semester
      });

      setSubmitSuccess(`Feedback submitted successfully! Ticket ID: ${newItem.id}. Edge NLP categorized this as '${newItem.analysis.category}' with ${newItem.analysis.priority} Priority.`);
      setFeedbackText('');
      setPreviewAnalysis(null);

      // Refresh list
      await loadData();
      setSelectedItem(newItem);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await ApiService.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#20242B]">
      {/* Top Banner / Student Profile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#244A73] text-white flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#20242B]">Student Feedback Portal</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Authenticated Student
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {currentUser.full_name} • ID: <span className="font-mono text-gray-700 font-semibold">{currentUser.institutional_id}</span> • {currentUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logout */}
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
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            My Feedback & History ({studentFeedback.length})
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
            Resolution Status Tracker
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-[#244A73] text-[#244A73] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: SUBMIT FEEDBACK                                   */}
        {/* ======================================================== */}
        {activeTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Privacy Notice Box */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-50 text-[#244A73] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Privacy-First Edge NLP Intake</h3>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      All submissions are evaluated on-device through our Edge NLP pipeline. Your grievance is automatically categorized
                      and assigned a response SLA without exposing sensitive student text to third-party public cloud APIs.
                    </p>
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <EyeOff className={`w-4 h-4 ${isAnonymous ? 'text-amber-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Anonymous Submission Mode</div>
                      <div className="text-[11px] text-gray-500">
                        {isAnonymous
                          ? 'Your name and Student ID will NOT be stored with this record.'
                          : `Identified submission linked to ${currentUser.institutional_id}`}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#244A73]"></div>
                  </label>
                </div>
              </div>

              {/* Success message */}
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Submission Complete</div>
                    <div className="mt-0.5">{submitSuccess}</div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="mt-2 text-[#244A73] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View in My Feedback <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target Department <span className="text-red-500">*</span>
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
                      <option value="Student Affairs & Housing">Student Affairs & Housing (Hostel)</option>
                      <option value="Finance & Accounts">Finance & Accounts (Fees)</option>
                      <option value="Controller of Examinations">Controller of Examinations</option>
                      <option value="Library & IT Infrastructure">Library & IT Infrastructure</option>
                      <option value="Campus Maintenance">Campus Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Submission Intent / Type
                    </label>
                    <select
                      value={submissionType}
                      onChange={e => setSubmissionType(e.target.value as SubmissionType)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                    >
                      <option value="Complaint">Complaint (Issue/Defect)</option>
                      <option value="Suggestion">Constructive Suggestion</option>
                      <option value="Appreciation">Faculty / Service Appreciation</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Course / Subject (Optional)
                    </label>
                    <input
                      type="text"
                      value={courseSubject}
                      onChange={e => setCourseSubject(e.target.value)}
                      placeholder="e.g. CS301 Data Structures"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Academic Semester
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

                {/* Feedback Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Feedback Description <span className="text-red-500">*</span>
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
                    placeholder="Describe your observation, issue, or feedback clearly. Include specific details like lab numbers, dates, or subject names..."
                    className="w-full text-xs p-3 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none leading-relaxed"
                  />
                </div>

                {/* Demo Presets Bar */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Demo Sample Presets:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STUDENT_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p.text)}
                        className="text-left p-2 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 text-[11px] transition-colors truncate"
                      >
                        <span className="font-semibold text-[#244A73]">{p.label}</span>
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
                    {submitting ? 'Processing via Edge NLP...' : 'Submit Feedback for Triage'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right 1 Col: Live Edge NLP Analysis Preview */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Sparkles className="w-4 h-4 text-[#244A73]" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Edge NLP Live Preview
                  </h3>
                </div>

                {previewAnalysis ? (
                  <div className="mt-4 space-y-4">
                    {/* Category & Confidence */}
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium">Predicted Category</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[#244A73]">{previewAnalysis.category}</span>
                        <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {(previewAnalysis.categoryConfidence * 100).toFixed(0)}% Conf
                        </span>
                      </div>
                    </div>

                    {/* Sentiment & Priority Badges */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-1">Sentiment</div>
                        <SentimentBadge sentiment={previewAnalysis.sentiment} />
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-500 font-medium mb-1">Assigned Priority</div>
                        <PriorityBadge priority={previewAnalysis.priority} />
                      </div>
                    </div>

                    {/* Priority Rationale */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium">Priority Justification</div>
                      <p className="text-xs text-gray-700 mt-1 italic leading-relaxed">
                        "{previewAnalysis.priorityJustification}"
                      </p>
                    </div>

                    {/* Extracted Keywords */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium mb-1.5">Extracted Key Tokens</div>
                      <div className="flex flex-wrap gap-1.5">
                        {previewAnalysis.extractedKeywords.map((kw: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] bg-blue-50 text-[#244A73] border border-blue-200 px-2 py-0.5 rounded font-mono"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-[11px] text-gray-500 font-medium">Auto-Generated Summary</div>
                      <p className="text-xs text-gray-800 mt-1 bg-gray-50 p-2.5 rounded border border-gray-200">
                        {previewAnalysis.summary}
                      </p>
                    </div>

                    {/* Latency badge */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>On-Device Inference Speed:</span>
                      <span className="font-mono font-bold text-emerald-700">{previewAnalysis.processingTimeMs} ms</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 text-center text-gray-400 py-8">
                    <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">Type at least 15 characters to view instant Edge NLP analysis preview.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY FEEDBACK & HISTORY                             */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">My Submitted Feedback Records</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing all feedback items submitted under ID {currentUser.institutional_id}.
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-xs text-[#244A73] font-semibold border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh List
              </button>
            </div>

            {loadingFeedback ? (
              <div className="text-center py-12 text-xs text-gray-500">Loading your feedback records...</div>
            ) : studentFeedback.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <History className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">No Feedback Submitted Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  You have not submitted any identifiable feedback yet. Click on 'Submit Feedback' to file your first observation.
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="mt-4 px-4 py-2 bg-[#244A73] text-white text-xs font-semibold rounded hover:bg-[#1B3756]"
                >
                  Submit New Feedback
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentFeedback.map(item => (
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
                      <span className="font-mono text-xs font-bold text-[#244A73]">{item.id}</span>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="text-xs text-gray-800 line-clamp-3 mb-3 leading-relaxed">
                      {item.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-[11px]">
                      <span className="font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {item.analysis.category}
                      </span>
                      <PriorityBadge priority={item.analysis.priority} />
                      <SentimentBadge sentiment={item.analysis.sentiment} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="text-[#244A73] font-semibold flex items-center gap-1">
                        Track Status <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: RESOLUTION STATUS TRACKER                         */}
        {/* ======================================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {selectedItem ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900">{selectedItem.id}</h2>
                      <StatusBadge status={selectedItem.status} />
                      <PriorityBadge priority={selectedItem.analysis.priority} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted on {new Date(selectedItem.createdAt).toLocaleString()} • Target: {selectedItem.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">Assigned Response Team</div>
                    <div className="text-xs font-bold text-[#244A73]">{selectedItem.assignedTeam}</div>
                  </div>
                </div>

                {/* Full Text */}
                <div className="py-4 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Grievance Text</div>
                  <p className="text-xs text-gray-900 leading-relaxed bg-gray-50 p-3.5 rounded border border-gray-200">
                    "{selectedItem.text}"
                  </p>
                </div>

                {/* Lifecycle Progress Stepper */}
                <div className="py-6 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Resolution Lifecycle</h3>
                  
                  {(() => {
                    const steps = ['Submitted', 'Analyzed', 'Reviewed', 'In Progress', 'Resolved'];
                    const currentIdx = steps.indexOf(selectedItem.status);
                    return (
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {steps.map((st, i) => {
                          const isDone = i <= currentIdx;
                          const isCurrent = i === currentIdx;
                          return (
                            <div key={st} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  isDone
                                    ? 'bg-[#244A73] text-white'
                                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                                }`}
                              >
                                {isDone ? '✓' : i + 1}
                              </div>
                              <div className={`text-[11px] mt-2 font-semibold ${isCurrent ? 'text-[#244A73]' : 'text-gray-600'}`}>
                                {st}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Audit & Resolution History */}
                <div className="pt-4">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Timeline & Action Log</h3>
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
                <p className="text-xs">Select a feedback item from the History tab to track its live status.</p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: NOTIFICATIONS & ANNOUNCEMENTS                     */}
        {/* ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Notifications & Status Updates</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time alerts regarding your submitted feedback items and institutional actions.
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#244A73] font-semibold hover:underline"
                >
                  Mark All as Read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
                      n.isRead
                        ? 'bg-white border-gray-200 text-gray-700'
                        : 'bg-blue-50/50 border-blue-200 text-blue-950 font-medium'
                    }`}
                  >
                    <Info className={`w-4 h-4 mt-0.5 shrink-0 ${n.isRead ? 'text-gray-400' : 'text-[#244A73]'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{n.title}</span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
