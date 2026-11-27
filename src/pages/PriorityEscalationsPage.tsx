import React, { useState } from 'react';
import { FeedbackItem, PriorityLevel, FeedbackStatus } from '../types';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../components/common/Badges';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';

interface PriorityEscalationsPageProps {
  feedbackList: FeedbackItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  onUpdateStatus: (id: string, status: FeedbackStatus, note: string) => void;
}

export const PriorityEscalationsPage: React.FC<PriorityEscalationsPageProps> = ({
  feedbackList,
  onSelectFeedback,
  onUpdateStatus
}) => {
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<PriorityLevel | 'CLUSTERS'>('Critical');

  // Priority queues
  const criticalItems = feedbackList.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'Critical');
  const highItems = feedbackList.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'High');
  const mediumItems = feedbackList.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'Medium');
  const lowItems = feedbackList.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'Low');

  // Repeated issue clusters
  const clustersMap: Record<string, FeedbackItem[]> = {};
  feedbackList.forEach(item => {
    if (item.analysis.similarIssueCluster) {
      if (!clustersMap[item.analysis.similarIssueCluster]) {
        clustersMap[item.analysis.similarIssueCluster] = [];
      }
      clustersMap[item.analysis.similarIssueCluster].push(item);
    }
  });
  const issueClusters = Object.entries(clustersMap);

  const getActiveList = () => {
    switch (selectedPriorityTab) {
      case 'Critical':
        return criticalItems;
      case 'High':
        return highItems;
      case 'Medium':
        return mediumItems;
      case 'Low':
        return lowItems;
      default:
        return criticalItems;
    }
  };

  const activeItems = getActiveList();

  return (
    <div className="space-y-6">
      {/* SLA Policy Summary Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-[#20242B] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              SLA-Driven Priority & Escalation Matrix
            </h2>
            <p className="text-xs text-[#697386]">
              Configured university response targets. Critical issues trigger immediate safety alerts and supervisor escalation.
            </p>
          </div>
        </div>

        {/* 4 SLA Tier Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-red-50/60 border border-red-200 rounded-md">
            <div className="font-bold text-red-800 flex items-center justify-between">
              <span>Critical Tier</span>
              <span className="font-mono text-[11px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-bold">4h SLA</span>
            </div>
            <p className="text-[11px] text-red-700 mt-1">
              Safety hazards, food contamination, live wire sparks, active data leaks.
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-md">
            <div className="font-bold text-amber-800 flex items-center justify-between">
              <span>High Tier</span>
              <span className="font-mono text-[11px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">24h SLA</span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Exam timetable clashes, major hostel water cutoffs, payment gateway debits.
            </p>
          </div>

          <div className="p-3 bg-yellow-50/60 border border-yellow-200 rounded-md">
            <div className="font-bold text-yellow-800 flex items-center justify-between">
              <span>Medium Tier</span>
              <span className="font-mono text-[11px] bg-yellow-200 text-yellow-900 px-1.5 py-0.2 rounded font-bold">48h SLA</span>
            </div>
            <p className="text-[11px] text-yellow-700 mt-1">
              Wi-Fi speed drops, AC noise, office hour cancellations, routine maintenance.
            </p>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="font-bold text-gray-800 flex items-center justify-between">
              <span>Low Tier</span>
              <span className="font-mono text-[11px] bg-gray-200 text-gray-800 px-1.5 py-0.2 rounded font-bold">72h SLA</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Commendations, general elective inquiries, long-term campus proposals.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Level Tabs */}
      <div className="flex border-b border-[#E5E7EB] bg-white rounded-t-lg px-4 text-xs font-medium">
        <button
          onClick={() => setSelectedPriorityTab('Critical')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            selectedPriorityTab === 'Critical'
              ? 'border-red-600 text-red-700 font-bold'
              : 'border-transparent text-[#697386] hover:text-[#20242B]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          Critical Queue ({criticalItems.length})
        </button>

        <button
          onClick={() => setSelectedPriorityTab('High')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            selectedPriorityTab === 'High'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-[#697386] hover:text-[#20242B]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          High Queue ({highItems.length})
        </button>

        <button
          onClick={() => setSelectedPriorityTab('Medium')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            selectedPriorityTab === 'Medium'
              ? 'border-yellow-600 text-yellow-700 font-bold'
              : 'border-transparent text-[#697386] hover:text-[#20242B]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-yellow-600" />
          Medium Queue ({mediumItems.length})
        </button>

        <button
          onClick={() => setSelectedPriorityTab('Low')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            selectedPriorityTab === 'Low'
              ? 'border-gray-600 text-gray-800 font-bold'
              : 'border-transparent text-[#697386] hover:text-[#20242B]'
          }`}
        >
          Low Queue ({lowItems.length})
        </button>

        <button
          onClick={() => setSelectedPriorityTab('CLUSTERS')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 ${
            selectedPriorityTab === 'CLUSTERS'
              ? 'border-[#244A73] text-[#244A73] font-bold'
              : 'border-transparent text-[#697386] hover:text-[#20242B]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#244A73]" />
          Repeated Issue Clusters ({issueClusters.length})
        </button>
      </div>

      {/* Tab Content */}
      {selectedPriorityTab !== 'CLUSTERS' ? (
        <div className="bg-white border border-[#E5E7EB] rounded-b-lg p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#697386] border-b border-gray-100 pb-2">
            <span>
              Showing {activeItems.length} items in{' '}
              <span className="font-semibold text-[#20242B]">{selectedPriorityTab} Priority</span>
            </span>
            <span className="font-mono text-[11px]">
              SLA Standard Target: {selectedPriorityTab === 'Critical' ? '4 Hours' : selectedPriorityTab === 'High' ? '24 Hours' : selectedPriorityTab === 'Medium' ? '48 Hours' : '72 Hours'}
            </span>
          </div>

          <div className="space-y-3">
            {activeItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#697386]">
                No feedback items currently pending in this priority tier.
              </div>
            ) : (
              activeItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectFeedback(item)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    item.analysis.priority === 'Critical'
                      ? 'border-red-200 bg-red-50/20 hover:bg-red-50/40'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[#244A73]">{item.id}</span>
                      <PriorityBadge priority={item.humanReview?.correctedPriority || item.analysis.priority} />
                      <CategoryBadge category={item.humanReview?.correctedCategory || item.analysis.category} />
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#697386]">
                      <span className="font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-[#20242B]">SLA: {item.slaTargetHours}h</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#20242B] leading-relaxed mb-3">
                    {item.text}
                  </p>

                  <div className="p-2.5 bg-white border border-[#E5E7EB] rounded text-xs space-y-1 mb-3">
                    <div className="text-[11px] font-semibold text-[#244A73]">
                      Priority Justification & Trigger Reason:
                    </div>
                    <p className="text-gray-700 text-xs">
                      {item.analysis.priorityJustification}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs pt-2 border-t border-gray-100">
                    <div className="text-[#697386]">
                      Assigned Team: <span className="font-semibold text-[#20242B]">{item.assignedTeam}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {item.status !== 'In Progress' && item.status !== 'Resolved' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'In Progress', 'Expedited handling initiated.')}
                          className="px-2.5 py-1 text-xs font-medium bg-[#244A73] text-white rounded hover:bg-[#1B3756]"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'Resolved', 'Ticket verified and resolved.')}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Resolve Ticket
                        </button>
                      )}
                      <button
                        onClick={() => onSelectFeedback(item)}
                        className="px-2.5 py-1 text-xs font-medium border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Repeated Issue Clusters View */
        <div className="bg-white border border-[#E5E7EB] rounded-b-lg p-5 space-y-4 shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold text-[#20242B]">
              Automated Duplicate & Recurring Issue Clusters
            </h3>
            <p className="text-xs text-[#697386]">
              Submissions grouped by semantic text similarity and co-occurring entity keywords across student cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issueClusters.map(([clusterName, items]) => {
              const latest = items[0];
              return (
                <div
                  key={clusterName}
                  className="p-4 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#244A73] font-mono">
                      {clusterName}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {items.length} Reports
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CategoryBadge category={latest.analysis.category} />
                    <PriorityBadge priority={latest.analysis.priority} size="sm" />
                    <span className="text-[11px] text-[#697386]">Dept: {latest.department}</span>
                  </div>

                  <div className="text-xs text-[#20242B] line-clamp-2 bg-white p-2.5 rounded border border-gray-200">
                    "{latest.text}"
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                    <span className="text-[11px] text-[#697386]">
                      Latest: {new Date(latest.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onSelectFeedback(latest)}
                      className="text-[#244A73] hover:underline font-semibold flex items-center gap-1"
                    >
                      Inspect Cluster <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
