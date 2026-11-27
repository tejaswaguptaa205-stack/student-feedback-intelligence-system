import React, { useState, useMemo } from 'react';
import {
  FeedbackItem,
  FeedbackCategory,
  SentimentType,
  PriorityLevel,
  FeedbackStatus
} from '../types';
import {
  PriorityBadge,
  SentimentBadge,
  CategoryBadge,
  StatusBadge
} from '../components/common/Badges';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  UserCheck,
  Building,
  Calendar,
  AlertCircle,
  Lock
} from 'lucide-react';

interface FeedbackExplorerPageProps {
  feedbackList: FeedbackItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  onExportCSV: () => void;
  departments: string[];
  assignedTeams: string[];
}

export const FeedbackExplorerPage: React.FC<FeedbackExplorerPageProps> = ({
  feedbackList,
  onSelectFeedback,
  onExportCSV,
  departments,
  assignedTeams
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sentimentFilter, setSentimentFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [confidentialFilter, setConfidentialFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'priority-desc' | 'confidence-desc'>('date-desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setSentimentFilter('ALL');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
    setTeamFilter('ALL');
    setSourceFilter('ALL');
    setConfidentialFilter('ALL');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return feedbackList.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = item.text.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        const matchesKeyword = item.analysis.extractedKeywords.some(k => k.toLowerCase().includes(q));
        if (!matchesText && !matchesId && !matchesDept && !matchesKeyword) {
          return false;
        }
      }

      // Source Filter (Student vs Faculty vs Anonymous)
      if (sourceFilter !== 'ALL') {
        const itemRole = item.submitterRole || (item.isAnonymous ? 'anonymous' : 'student');
        if (itemRole !== sourceFilter) return false;
      }

      // Confidential Filter
      if (confidentialFilter === 'confidential' && !item.isConfidential) return false;
      if (confidentialFilter === 'standard' && item.isConfidential) return false;

      // 2. Category Filter (checks human-reviewed category first, then analysis category)
      const effectiveCategory = item.humanReview?.correctedCategory || item.analysis.category;
      if (categoryFilter !== 'ALL' && effectiveCategory !== categoryFilter) {
        return false;
      }

      // 3. Sentiment Filter
      const effectiveSentiment = item.humanReview?.correctedSentiment || item.analysis.sentiment;
      if (sentimentFilter !== 'ALL' && effectiveSentiment !== sentimentFilter) {
        return false;
      }

      // 4. Priority Filter
      const effectivePriority = item.humanReview?.correctedPriority || item.analysis.priority;
      if (priorityFilter !== 'ALL' && effectivePriority !== priorityFilter) {
        return false;
      }

      // 5. Status Filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // 6. Department Filter
      if (departmentFilter !== 'ALL' && item.department !== departmentFilter) {
        return false;
      }

      // 7. Team Filter
      if (teamFilter !== 'ALL' && item.assignedTeam !== teamFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority-desc') {
        const pOrder: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        const pA = pOrder[a.humanReview?.correctedPriority || a.analysis.priority];
        const pB = pOrder[b.humanReview?.correctedPriority || b.analysis.priority];
        return pB - pA;
      }
      if (sortBy === 'confidence-desc') {
        return b.analysis.categoryConfidence - a.analysis.categoryConfidence;
      }
      return 0;
    });
  }, [
    feedbackList,
    searchQuery,
    categoryFilter,
    sentimentFilter,
    priorityFilter,
    statusFilter,
    departmentFilter,
    teamFilter,
    sourceFilter,
    confidentialFilter,
    sortBy
  ]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#697386] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by keywords, text description, feedback ID, or department..."
              className="w-full pl-9 pr-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-[#20242B] placeholder-[#697386] focus:outline-none focus:border-[#244A73] focus:bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              title="Reset all active filters"
              className="px-3 py-2 text-xs font-medium text-[#475467] hover:text-[#20242B] bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] rounded-md transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
            <button
              onClick={onExportCSV}
              className="px-3 py-2 text-xs font-semibold text-white bg-[#244A73] hover:bg-[#1B3756] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Multi-Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2 border-t border-gray-100 text-xs">
          {/* Source Role Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Source</label>
            <select
              value={sourceFilter}
              onChange={e => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Sources</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="anonymous">Anonymous</option>
            </select>
          </div>

          {/* Confidentiality Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Confidential</label>
            <select
              value={confidentialFilter}
              onChange={e => {
                setConfidentialFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Levels</option>
              <option value="confidential">Confidential Only</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sentiment */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Sentiment</label>
            <select
              value={sentimentFilter}
              onChange={e => {
                setSentimentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={e => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Analyzed">Analyzed</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={e => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] truncate focus:border-[#244A73]"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-semibold text-[#697386] uppercase mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#20242B] focus:border-[#244A73]"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority-desc">Highest Priority</option>
              <option value="confidence-desc">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Summary Bar */}
      <div className="flex items-center justify-between text-xs text-[#697386] px-1 font-medium">
        <span>
          Showing <span className="text-[#20242B] font-bold">{filteredItems.length}</span> records
          {filteredItems.length !== feedbackList.length && ` (filtered from ${feedbackList.length} total)`}
        </span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-0.5 bg-white border border-[#E5E7EB] rounded text-xs"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#697386] font-semibold text-[11px] uppercase tracking-wider select-none">
                <th className="py-3 px-3 w-28">Feedback ID</th>
                <th className="py-3 px-3 w-28">Source</th>
                <th className="py-3 px-3">Description & Preview</th>
                <th className="py-3 px-3 w-32">Category</th>
                <th className="py-3 px-3 w-24">Sentiment</th>
                <th className="py-3 px-3 w-24">Priority</th>
                <th className="py-3 px-3 w-36">Department</th>
                <th className="py-3 px-3 w-24">Date</th>
                <th className="py-3 px-3 w-28">Status</th>
                <th className="py-3 px-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#697386]">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    No feedback records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => {
                  const effectiveCategory = item.humanReview?.correctedCategory || item.analysis.category;
                  const effectiveSentiment = item.humanReview?.correctedSentiment || item.analysis.sentiment;
                  const effectivePriority = item.humanReview?.correctedPriority || item.analysis.priority;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectFeedback(item)}
                      className="hover:bg-[#F7F8FA] transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3 px-3 font-mono font-medium text-[#244A73] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {item.id}
                          {item.humanReview?.isReviewed && (
                            <span title="Human Verified" className="text-emerald-600">
                              <UserCheck className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Source Role & Confidentiality */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            item.submitterRole === 'faculty'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : item.isAnonymous
                              ? 'bg-gray-100 text-gray-600 border border-gray-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.submitterRole === 'faculty' ? 'Faculty' : item.isAnonymous ? 'Anonymous' : 'Student'}
                          </span>
                          {item.isConfidential && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title="Confidential faculty submission">
                              <Lock className="w-2.5 h-2.5" /> Confidential
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Text Preview */}
                      <td className="py-3 px-3 max-w-md">
                        <div className="text-[#20242B] line-clamp-2 leading-relaxed">
                          {item.text}
                        </div>
                        {item.analysis.similarIssueCluster && (
                          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                            Cluster: {item.analysis.similarIssueCluster} ({item.analysis.similarReportCount} reports)
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <CategoryBadge category={effectiveCategory} />
                      </td>

                      {/* Sentiment */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <SentimentBadge sentiment={effectiveSentiment} />
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <PriorityBadge priority={effectivePriority} size="sm" />
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3 text-[#697386] truncate max-w-[140px]">
                        {item.department}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-[#697386] font-mono text-[11px] whitespace-nowrap">
                        {item.createdAt.slice(0, 10)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectFeedback(item)}
                          className="p-1 rounded text-[#697386] hover:text-[#244A73] hover:bg-gray-100"
                          title="Open Detail View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between text-xs text-[#697386]">
          <div>
            Page <span className="font-semibold text-[#20242B]">{currentPage}</span> of{' '}
            <span className="font-semibold text-[#20242B]">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-[#E5E7EB] bg-white text-[#20242B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} of {totalItems}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-[#E5E7EB] bg-white text-[#20242B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
