import React from 'react';
import { FeedbackCategory, PriorityLevel, SentimentType, FeedbackStatus } from '../../types';
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  BookOpen,
  GraduationCap,
  Building,
  FileSpreadsheet,
  CalendarCheck,
  CreditCard,
  Home,
  ShieldCheck
} from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: PriorityLevel; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const baseClasses = isSm
    ? 'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded'
    : 'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md border';

  switch (priority) {
    case 'Critical':
      return (
        <span className={`${baseClasses} bg-feedback-criticalBg text-feedback-critical border-feedback-criticalBorder`}>
          <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`${baseClasses} bg-feedback-highBg text-feedback-high border-feedback-highBorder`}>
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`${baseClasses} bg-feedback-mediumBg text-feedback-medium border-feedback-mediumBorder`}>
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`${baseClasses} bg-feedback-lowBg text-feedback-low border-feedback-lowBorder`}>
          <span className="w-1.5 h-1.5 rounded-full bg-feedback-low inline-block" />
          Low
        </span>
      );
  }
};

export const SentimentBadge: React.FC<{ sentiment: SentimentType; score?: number }> = ({
  sentiment,
  score
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border';

  switch (sentiment) {
    case 'Positive':
      return (
        <span className={`${baseClasses} bg-feedback-positiveBg text-feedback-positive border-feedback-positiveBorder`}>
          <Smile className="w-3.5 h-3.5 text-feedback-positive" />
          Positive {score !== undefined && <span className="opacity-75">({score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)})</span>}
        </span>
      );
    case 'Negative':
      return (
        <span className={`${baseClasses} bg-feedback-negativeBg text-feedback-negative border-feedback-negativeBorder`}>
          <Frown className="w-3.5 h-3.5 text-feedback-negative" />
          Negative {score !== undefined && <span className="opacity-75">({score.toFixed(1)})</span>}
        </span>
      );
    case 'Neutral':
    default:
      return (
        <span className={`${baseClasses} bg-feedback-neutralBg text-feedback-neutral border-feedback-neutralBorder`}>
          <Meh className="w-3.5 h-3.5 text-feedback-neutral" />
          Neutral {score !== undefined && <span className="opacity-75">({score.toFixed(1)})</span>}
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: FeedbackCategory }> = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case 'Academic':
        return <BookOpen className="w-3 h-3 text-[#244A73]" />;
      case 'Faculty':
        return <GraduationCap className="w-3 h-3 text-indigo-600" />;
      case 'Infrastructure':
        return <Building className="w-3 h-3 text-slate-700" />;
      case 'Examination':
        return <FileSpreadsheet className="w-3 h-3 text-amber-700" />;
      case 'Attendance':
        return <CalendarCheck className="w-3 h-3 text-teal-700" />;
      case 'Fees':
        return <CreditCard className="w-3 h-3 text-emerald-700" />;
      case 'Hostel':
        return <Home className="w-3 h-3 text-orange-700" />;
      case 'Administration':
      default:
        return <ShieldCheck className="w-3 h-3 text-blue-700" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border border-[#E5E7EB] bg-white text-[#20242B]">
      {getIcon()}
      {category}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: FeedbackStatus }> = ({ status }) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-gray-200 bg-gray-50 text-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Submitted
        </span>
      );
    case 'Analyzed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-blue-200 bg-blue-50 text-blue-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Analyzed
        </span>
      );
    case 'Reviewed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-purple-200 bg-purple-50 text-purple-700">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Reviewed
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-amber-200 bg-amber-50 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Assigned
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-sky-200 bg-sky-50 text-sky-700">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Resolved
        </span>
      );
    default:
      return null;
  }
};
