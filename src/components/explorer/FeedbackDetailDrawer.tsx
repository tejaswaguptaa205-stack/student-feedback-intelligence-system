import React, { useState } from 'react';
import {
  FeedbackItem,
  FeedbackCategory,
  SentimentType,
  PriorityLevel,
  FeedbackStatus
} from '../../types';
import {
  PriorityBadge,
  SentimentBadge,
  CategoryBadge,
  StatusBadge
} from '../common/Badges';
import {
  X,
  CheckCircle,
  Edit3,
  Clock,
  Cpu,
  UserCheck,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Layers
} from 'lucide-react';

interface FeedbackDetailDrawerProps {
  item: FeedbackItem | null;
  onClose: () => void;
  onConfirmReview: (id: string) => void;
  onApplyCorrections: (
    id: string,
    corrections: {
      category?: FeedbackCategory;
      sentiment?: SentimentType;
      priority?: PriorityLevel;
      notes?: string;
    }
  ) => void;
  onUpdateStatus: (id: string, status: FeedbackStatus, note: string) => void;
  onUpdateTeam: (id: string, team: string) => void;
  onAddNote: (id: string, noteText: string) => void;
  availableTeams: string[];
}

export const FeedbackDetailDrawer: React.FC<FeedbackDetailDrawerProps> = ({
  item,
  onClose,
  onConfirmReview,
  onApplyCorrections,
  onUpdateStatus,
  onUpdateTeam,
  onAddNote,
  availableTeams
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState<'analysis' | 'actions' | 'notes' | 'history'>('analysis');
  const [isEditingCorrection, setIsEditingCorrection] = useState(false);

  // Form states for human corrections
  const [correctedCategory, setCorrectedCategory] = useState<FeedbackCategory>(
    item.humanReview?.correctedCategory || item.analysis.category
  );
  const [correctedSentiment, setCorrectedSentiment] = useState<SentimentType>(
    item.humanReview?.correctedSentiment || item.analysis.sentiment
  );
  const [correctedPriority, setCorrectedPriority] = useState<PriorityLevel>(
    item.humanReview?.correctedPriority || item.analysis.priority
  );
  const [correctionNotes, setCorrectionNotes] = useState(
    item.humanReview?.correctionRationale || ''
  );

  // Note form state
  const [newNoteText, setNewNoteText] = useState('');
  const [statusChangeNote, setStatusChangeNote] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<FeedbackStatus>(item.status);
  const [selectedNewTeam, setSelectedNewTeam] = useState<string>(item.assignedTeam);

  const categoriesList: FeedbackCategory[] = [
    'Academic',
    'Faculty',
    'Infrastructure',
    'Examination',
    'Attendance',
    'Fees',
    'Hostel',
    'Administration'
  ];

  const sentimentsList: SentimentType[] = ['Positive', 'Neutral', 'Negative'];
  const prioritiesList: PriorityLevel[] = ['Critical', 'High', 'Medium', 'Low'];
  const statusesList: FeedbackStatus[] = [
    'Submitted',
    'Analyzed',
    'Reviewed',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  const handleSaveCorrection = () => {
    onApplyCorrections(item.id, {
      category: correctedCategory,
      sentiment: correctedSentiment,
      priority: correctedPriority,
      notes: correctionNotes
    });
    setIsEditingCorrection(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(item.id, newNoteText);
    setNewNoteText('');
  };

  const handleStatusChangeSubmit = () => {
    onUpdateStatus(item.id, selectedNewStatus, statusChangeNote || `Status moved to ${selectedNewStatus}`);
    setStatusChangeNote('');
  };

  const handleTeamChangeSubmit = () => {
    onUpdateTeam(item.id, selectedNewTeam);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-[#244A73] px-2 py-0.5 bg-white border border-[#E5E7EB] rounded">
              {item.id}
            </span>
            <StatusBadge status={item.status} />
            {item.humanReview?.isReviewed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <UserCheck className="w-3 h-3" />
                Human Reviewed
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#697386] hover:text-[#20242B] p-1.5 rounded-md hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E7EB] bg-white px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-[#244A73] text-[#244A73] font-semibold'
                : 'border-transparent text-[#697386] hover:text-[#20242B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI & NLP Analysis
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'border-[#244A73] text-[#244A73] font-semibold'
                : 'border-transparent text-[#697386] hover:text-[#20242B]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Human Review & Action
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-[#244A73] text-[#244A73] font-semibold'
                : 'border-transparent text-[#697386] hover:text-[#20242B]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Internal Notes ({item.internalNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#244A73] text-[#244A73] font-semibold'
                : 'border-transparent text-[#697386] hover:text-[#20242B]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Lifecycle Audit ({item.resolutionHistory.length})
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Original Feedback Section */}
          <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg p-4">
            <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-medium">
              <span>Full Student Feedback Submission</span>
              <span className="font-mono">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-[#20242B] leading-relaxed font-normal whitespace-pre-wrap">
              "{item.text}"
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-4 text-xs text-[#697386]">
              <div>
                <span className="font-semibold text-gray-700">Department:</span> {item.department}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Type:</span> {item.submissionType}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Submitter:</span>{' '}
                {item.isAnonymous ? 'Anonymous' : (item.studentRefId || 'Student Ref Verified')}
              </div>
            </div>
          </div>

          {/* TAB 1: AI & NLP Analysis */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {/* Classification Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-md">
                  <div className="text-[11px] font-semibold text-[#697386] uppercase mb-1">
                    Predicted Category
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={item.analysis.category} />
                  </div>
                  <div className="text-[11px] text-[#697386] mt-1 font-mono">
                    Conf: {(item.analysis.categoryConfidence * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E5E7EB] rounded-md">
                  <div className="text-[11px] font-semibold text-[#697386] uppercase mb-1">
                    Sentiment Analysis
                  </div>
                  <SentimentBadge sentiment={item.analysis.sentiment} score={item.analysis.sentimentScore} />
                  <div className="text-[11px] text-[#697386] mt-1 font-mono">
                    Conf: {(item.analysis.sentimentConfidence * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E5E7EB] rounded-md">
                  <div className="text-[11px] font-semibold text-[#697386] uppercase mb-1">
                    Assigned Priority
                  </div>
                  <PriorityBadge priority={item.analysis.priority} />
                  <div className="text-[11px] text-[#697386] mt-1">
                    SLA: {item.slaTargetHours}h target
                  </div>
                </div>
              </div>

              {/* Priority Justification & Severity Reasoning */}
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-1">
                <div className="text-xs font-semibold text-[#20242B] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#244A73]" />
                  Priority & Urgency Justification
                </div>
                <p className="text-xs text-gray-700 leading-normal">
                  {item.analysis.priorityJustification}
                </p>
              </div>

              {/* Auto Summary */}
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-1">
                <div className="text-xs font-semibold text-[#20242B]">
                  Concise Operational Summary
                </div>
                <p className="text-xs text-gray-700 leading-normal">
                  {item.analysis.summary}
                </p>
              </div>

              {/* Recommended Next Action */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-md space-y-1">
                <div className="text-xs font-semibold text-[#244A73]">
                  Recommended Administrative Action
                </div>
                <p className="text-xs text-gray-800 leading-normal">
                  {item.analysis.recommendedAction}
                </p>
              </div>

              {/* Extracted Keywords & Explainability Weights */}
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-2">
                <div className="text-xs font-semibold text-[#20242B]">
                  Extracted Keywords & Salient Tokens
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.analysis.extractedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-[#20242B] text-xs rounded border border-gray-200 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                {item.analysis.explainabilityTokens && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-[11px] text-[#697386] mb-1">
                      Token Attention Weights (Edge Feature Vector):
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                      {item.analysis.explainabilityTokens.map((t, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-blue-50 text-[#244A73] rounded border border-blue-100"
                        >
                          {t.token} ({t.weight})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Edge Inference Metadata */}
              <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs space-y-1 font-mono text-[#697386]">
                <div className="flex items-center justify-between">
                  <span>Model:</span>
                  <span className="text-[#20242B]">{item.analysis.modelVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Inference Device:</span>
                  <span className="text-[#20242B]">{item.analysis.edgeDeviceUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-700 font-bold">{item.analysis.processingTimeMs} ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Language:</span>
                  <span className="text-[#20242B]">{item.analysis.detectedLanguage}</span>
                </div>
                {item.analysis.similarIssueCluster && (
                  <div className="flex items-center justify-between text-amber-700 font-medium">
                    <span>Issue Cluster:</span>
                    <span>{item.analysis.similarIssueCluster} ({item.analysis.similarReportCount} reports)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Human Review & Action */}
          {activeTab === 'actions' && (
            <div className="space-y-5 text-xs">
              {/* Human-in-the-Loop Confirmation Bar */}
              <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#20242B]">Human Verification Status</h4>
                    <p className="text-[#697386] text-xs">
                      Verify AI model output or provide human corrections to refine retraining dataset.
                    </p>
                  </div>
                  {!item.humanReview?.isReviewed ? (
                    <button
                      onClick={() => onConfirmReview(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Confirm Predictions
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {item.humanReview.isConfirmed ? 'Predictions Confirmed' : 'Human Corrected'}
                    </span>
                  )}
                </div>

                {item.humanReview?.isReviewed && (
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200 space-y-1">
                    <div className="font-semibold text-gray-800">
                      Reviewed by: {item.humanReview.reviewedBy || 'Academic Administrator'}
                    </div>
                    <div className="text-[#697386]">
                      Date: {new Date(item.humanReview.reviewedAt || '').toLocaleString()}
                    </div>
                    {item.humanReview.correctionRationale && (
                      <div className="text-gray-700 pt-1 border-t border-gray-200">
                        <span className="font-medium">Correction Note:</span> {item.humanReview.correctionRationale}
                      </div>
                    )}
                  </div>
                )}

                {/* Edit Corrections Button / Form */}
                {!isEditingCorrection ? (
                  <button
                    onClick={() => setIsEditingCorrection(true)}
                    className="flex items-center gap-1.5 text-[#244A73] hover:underline font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {item.humanReview?.isReviewed ? 'Modify Human Corrections' : 'Override Category, Sentiment, or Priority'}
                  </button>
                ) : (
                  <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md space-y-3 mt-2">
                    <div className="font-semibold text-[#20242B]">Apply Human Corrections</div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[#697386] mb-1 font-medium">Category</label>
                        <select
                          value={correctedCategory}
                          onChange={e => setCorrectedCategory(e.target.value as FeedbackCategory)}
                          className="w-full px-2 py-1 bg-white border border-[#E5E7EB] rounded text-xs"
                        >
                          {categoriesList.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#697386] mb-1 font-medium">Sentiment</label>
                        <select
                          value={correctedSentiment}
                          onChange={e => setCorrectedSentiment(e.target.value as SentimentType)}
                          className="w-full px-2 py-1 bg-white border border-[#E5E7EB] rounded text-xs"
                        >
                          {sentimentsList.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#697386] mb-1 font-medium">Priority</label>
                        <select
                          value={correctedPriority}
                          onChange={e => setCorrectedPriority(e.target.value as PriorityLevel)}
                          className="w-full px-2 py-1 bg-white border border-[#E5E7EB] rounded text-xs"
                        >
                          {prioritiesList.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#697386] mb-1 font-medium">Reason for Human Correction</label>
                      <input
                        type="text"
                        value={correctionNotes}
                        onChange={e => setCorrectionNotes(e.target.value)}
                        placeholder="e.g. Contains secondary infrastructural element but primarily an exam fee issue"
                        className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingCorrection(false)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCorrection}
                        className="px-3 py-1 bg-[#244A73] hover:bg-[#1B3756] text-white rounded font-medium"
                      >
                        Save Corrections
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Management */}
              <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg space-y-3">
                <h4 className="font-bold text-sm text-[#20242B]">Update Lifecycle Status</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedNewStatus}
                    onChange={e => setSelectedNewStatus(e.target.value as FeedbackStatus)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs"
                  >
                    {statusesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusChangeSubmit}
                    className="px-3 py-1.5 bg-[#244A73] hover:bg-[#1B3756] text-white font-medium rounded transition-colors"
                  >
                    Update Status
                  </button>
                </div>
                <input
                  type="text"
                  value={statusChangeNote}
                  onChange={e => setStatusChangeNote(e.target.value)}
                  placeholder="Optional resolution or progress note..."
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs"
                />
              </div>

              {/* Team Assignment */}
              <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg space-y-3">
                <h4 className="font-bold text-sm text-[#20242B]">Assign Responsible Team</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedNewTeam}
                    onChange={e => setSelectedNewTeam(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs"
                  >
                    {availableTeams.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleTeamChangeSubmit}
                    className="px-3 py-1.5 border border-[#244A73] text-[#244A73] hover:bg-[#244A73] hover:text-white font-medium rounded transition-colors"
                  >
                    Reassign Team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Internal Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4 text-xs">
              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-2">
                <div className="font-semibold text-[#20242B]">Add Internal Staff Note</div>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Write internal administrative remarks (e.g. dispatched vendor ticket #8841)..."
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs focus:bg-white focus:outline-none focus:border-[#244A73]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#244A73] text-white rounded font-medium hover:bg-[#1B3756]"
                  >
                    <Send className="w-3 h-3" />
                    Post Note
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-2">
                {item.internalNotes.length === 0 ? (
                  <div className="text-center py-6 text-[#697386]">
                    No internal notes logged on this ticket yet.
                  </div>
                ) : (
                  item.internalNotes.map(n => (
                    <div key={n.id} className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-1">
                      <div className="flex items-center justify-between text-[#697386]">
                        <span className="font-semibold text-[#20242B]">{n.author} ({n.role})</span>
                        <span className="font-mono text-[11px]">{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800 leading-normal">{n.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Resolution History / Lifecycle Audit */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-[#20242B] mb-2">
                Feedback Lifecycle Audit Trail
              </div>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {item.resolutionHistory.map((h, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#244A73] ring-4 ring-white" />
                    <div className="p-3 bg-white border border-[#E5E7EB] rounded-md space-y-1">
                      <div className="flex items-center justify-between text-[#697386]">
                        <span className="font-medium text-[#20242B]">
                          {h.fromStatus} → <span className="text-[#244A73] font-semibold">{h.toStatus}</span>
                        </span>
                        <span className="font-mono text-[11px]">{new Date(h.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-[#697386]">
                        Updated by: <span className="font-medium text-gray-700">{h.updatedBy}</span>
                      </div>
                      <p className="text-gray-800 pt-1 text-xs">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between text-xs">
          <div className="text-[#697386] font-mono">
            Assigned: {item.assignedTeam}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#20242B] font-medium rounded-md transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
