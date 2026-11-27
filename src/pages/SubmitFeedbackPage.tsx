import React, { useState } from 'react';
import { FeedbackCategory, SubmissionType, FeedbackItem } from '../types';
import { PriorityBadge, SentimentBadge, CategoryBadge } from '../components/common/Badges';
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Cpu,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

interface SubmitFeedbackPageProps {
  departments: string[];
  onSubmitFeedback: (params: {
    text: string;
    department?: string;
    selectedCategory?: FeedbackCategory;
    submissionType: SubmissionType;
    isAnonymous: boolean;
    studentRefId?: string;
  }) => FeedbackItem;
  onViewItem: (item: FeedbackItem) => void;
}

export const SubmitFeedbackPage: React.FC<SubmitFeedbackPageProps> = ({
  departments,
  onSubmitFeedback,
  onViewItem
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | ''>('');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('Complaint');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [studentRefId, setStudentRefId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedItem, setLastSubmittedItem] = useState<FeedbackItem | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const charLimit = 1500;

  const categories: FeedbackCategory[] = [
    'Academic',
    'Faculty',
    'Infrastructure',
    'Examination',
    'Attendance',
    'Fees',
    'Hostel',
    'Administration'
  ];

  // Presets for quick evaluation
  const samplePresets = [
    {
      title: 'Hostel Water Emergency',
      type: 'Complaint' as SubmissionType,
      dept: 'Student Affairs & Housing',
      text: 'The hostel water supply in Block C has been shut off completely for 48 hours without prior notice or backup tankers. Students cannot maintain hygiene.'
    },
    {
      title: 'Safety Hazard (Electrical)',
      type: 'Complaint' as SubmissionType,
      dept: 'School of Engineering',
      text: 'CRITICAL SAFETY RISK: Exposed electric live cables are sparking near the entrance of Workshop B right next to puddles of rainwater. Urgent electrical team needed.'
    },
    {
      title: 'Exam Timetable Clash',
      type: 'Complaint' as SubmissionType,
      dept: 'Controller of Examinations',
      text: 'There is a severe schedule overlap in final exams: Operating Systems and Embedded Systems are both timetabled for November 22nd at 10:00 AM.'
    },
    {
      title: 'Faculty Appreciation',
      type: 'Appreciation' as SubmissionType,
      dept: 'Department of Mathematics',
      text: 'Dr. Srinivasan explained Linear Algebra complex eigenvalues so intuitively today. The interactive geometric visualizations in class made difficult theory easy to master.'
    },
    {
      title: 'Payment Gateway Glitch',
      type: 'Complaint' as SubmissionType,
      dept: 'Finance & Accounts',
      text: 'Online semester registration fee was debited from my bank account, but the finance portal still displays payment pending and threatens late fee debarment.'
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setFeedbackText(preset.text);
    setSubmissionType(preset.type);
    setDepartment(preset.dept);
    setSelectedCategory('');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setErrorMessage('Feedback text cannot be empty.');
      return;
    }
    if (feedbackText.trim().length < 10) {
      setErrorMessage('Please provide a slightly more descriptive feedback message (min 10 characters).');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Simulate instant local edge pipeline execution
    setTimeout(() => {
      const newItem = onSubmitFeedback({
        text: feedbackText.trim(),
        department: department || undefined,
        selectedCategory: selectedCategory ? selectedCategory : undefined,
        submissionType,
        isAnonymous,
        studentRefId: isAnonymous ? undefined : (studentRefId.trim() || undefined)
      });

      setLastSubmittedItem(newItem);
      setIsSubmitting(false);
      setFeedbackText('');
      setStudentRefId('');
    }, 280);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Privacy & Edge Processing Guarantee Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex items-start gap-3 shadow-xs">
        <div className="p-2 bg-[#EBF1F6] text-[#244A73] rounded-md shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h2 className="font-bold text-[#20242B] text-sm">Institutional Privacy & Local Edge Inference</h2>
          <p className="text-[#697386] leading-relaxed">
            Submissions are processed strictly within the institution's private edge nodes. No confidential student feedback
            is transmitted to external public cloud APIs. Anonymous submissions completely strip IP, hardware identifiers, and session tokens.
          </p>
        </div>
      </div>

      {/* Preset Demonstrators */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#697386] uppercase tracking-wider">
          <span>Demonstration Samples (One-Click Pre-fill)</span>
          <span className="text-[11px] text-[#244A73] font-normal">Click any preset to test Edge NLP classification</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1.5 text-xs bg-[#F7F8FA] hover:bg-[#EBF1F6] hover:text-[#244A73] border border-[#E5E7EB] rounded-md transition-colors font-medium flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#697386]" />
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Submission Type & Category Auto-Predict */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#20242B] uppercase tracking-wider mb-1.5">
                Feedback Type <span className="text-red-500">*</span>
              </label>
              <select
                value={submissionType}
                onChange={e => setSubmissionType(e.target.value as SubmissionType)}
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#20242B] focus:outline-none focus:border-[#244A73]"
              >
                <option value="Complaint">Formal Complaint</option>
                <option value="Suggestion">Constructive Suggestion</option>
                <option value="Appreciation">Faculty / Facility Commendation</option>
                <option value="General">General Inquiry / Observation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20242B] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Related Category</span>
                <span className="text-[11px] text-[#697386] font-normal normal-case">
                  (Auto-predict if left empty)
                </span>
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as FeedbackCategory | '')}
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#20242B] focus:outline-none focus:border-[#244A73]"
              >
                <option value="">[Auto-Predict by Edge NLP Engine]</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] uppercase tracking-wider mb-1.5">
              Target Department or School <span className="text-[11px] text-[#697386] font-normal normal-case">(Optional)</span>
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#20242B] focus:outline-none focus:border-[#244A73]"
            >
              <option value="">General University / Unspecified</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Main Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#20242B] uppercase tracking-wider">
                Detailed Feedback Description <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-mono ${feedbackText.length > charLimit ? 'text-red-600 font-bold' : 'text-[#697386]'}`}>
                {feedbackText.length} / {charLimit} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value.slice(0, charLimit))}
              placeholder="Describe your experience, issue, or proposal clearly. Mention relevant dates, classrooms, hostel blocks, or course codes..."
              className="w-full p-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#20242B] placeholder-[#697386] leading-relaxed focus:outline-none focus:border-[#244A73] focus:ring-1 focus:ring-[#244A73]"
            />
          </div>

          {/* Anonymous Toggle & Student ID */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#244A73] border-gray-300 focus:ring-[#244A73]"
              />
              <span className="text-xs font-medium text-[#20242B]">
                Submit anonymously (Identity completely concealed from faculty & staff)
              </span>
            </label>

            {!isAnonymous && (
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={studentRefId}
                  onChange={e => setStudentRefId(e.target.value)}
                  placeholder="Student ID (e.g. STU-2024-8192)"
                  className="w-full px-3 py-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:outline-none focus:border-[#244A73]"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Running Edge NLP Inference...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit & Analyze Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instant Submission Result Card */}
      {lastSubmittedItem && (
        <div className="bg-white border-2 border-emerald-500 rounded-lg p-5 space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-[#20242B]">Feedback Ingested & Analyzed Locally</h3>
                <span className="font-mono text-xs text-[#697386]">Tracking Ticket ID: {lastSubmittedItem.id}</span>
              </div>
            </div>
            <button
              onClick={() => onViewItem(lastSubmittedItem)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#244A73] hover:underline"
            >
              Open in Explorer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Analysis Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
              <div className="text-[10px] font-semibold text-[#697386] uppercase mb-1">Predicted Category</div>
              <CategoryBadge category={lastSubmittedItem.analysis.category} />
              <div className="text-[10px] font-mono text-[#697386] mt-1">
                {(lastSubmittedItem.analysis.categoryConfidence * 100).toFixed(0)}% confidence
              </div>
            </div>

            <div className="p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
              <div className="text-[10px] font-semibold text-[#697386] uppercase mb-1">Sentiment</div>
              <SentimentBadge sentiment={lastSubmittedItem.analysis.sentiment} score={lastSubmittedItem.analysis.sentimentScore} />
            </div>

            <div className="p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
              <div className="text-[10px] font-semibold text-[#697386] uppercase mb-1">Calculated Priority</div>
              <PriorityBadge priority={lastSubmittedItem.analysis.priority} />
            </div>

            <div className="p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
              <div className="text-[10px] font-semibold text-[#697386] uppercase mb-1">Inference Latency</div>
              <div className="font-mono font-bold text-emerald-700 text-sm">
                {lastSubmittedItem.analysis.processingTimeMs} ms
              </div>
              <div className="text-[10px] text-[#697386]">Local NPU Thread</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs space-y-1">
            <div className="font-semibold text-[#244A73]">Priority & Urgency Assessment</div>
            <p className="text-gray-700 leading-normal">{lastSubmittedItem.analysis.priorityJustification}</p>
          </div>
        </div>
      )}
    </div>
  );
};
