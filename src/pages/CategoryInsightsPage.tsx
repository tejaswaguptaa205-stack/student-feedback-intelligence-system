import React, { useState } from 'react';
import { FeedbackItem, FeedbackCategory } from '../types';
import { PriorityBadge, SentimentBadge, StatusBadge } from '../components/common/Badges';
import {
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Tag,
  BookOpen,
  GraduationCap,
  Building,
  FileSpreadsheet,
  CalendarCheck,
  CreditCard,
  Home,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

interface CategoryInsightsPageProps {
  feedbackList: FeedbackItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  onFilterExplorerByCategory: (category: FeedbackCategory) => void;
}

export const CategoryInsightsPage: React.FC<CategoryInsightsPageProps> = ({
  feedbackList,
  onSelectFeedback,
  onFilterExplorerByCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('Hostel');

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

  const getCategoryIcon = (cat: FeedbackCategory) => {
    switch (cat) {
      case 'Academic': return <BookOpen className="w-4 h-4 text-[#244A73]" />;
      case 'Faculty': return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'Infrastructure': return <Building className="w-4 h-4 text-slate-700" />;
      case 'Examination': return <FileSpreadsheet className="w-4 h-4 text-amber-700" />;
      case 'Attendance': return <CalendarCheck className="w-4 h-4 text-teal-700" />;
      case 'Fees': return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case 'Hostel': return <Home className="w-4 h-4 text-orange-700" />;
      case 'Administration': return <ShieldCheck className="w-4 h-4 text-blue-700" />;
    }
  };

  // Filter items for selected category
  const categoryItems = feedbackList.filter(f => (f.humanReview?.correctedCategory || f.analysis.category) === selectedCategory);
  const total = categoryItems.length;
  const positive = categoryItems.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Positive').length;
  const neutral = categoryItems.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Neutral').length;
  const negative = categoryItems.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Negative').length;
  const urgentCount = categoryItems.filter(f => {
    const p = f.humanReview?.correctedPriority || f.analysis.priority;
    return p === 'Critical' || p === 'High';
  }).length;
  const unresolved = categoryItems.filter(f => f.status !== 'Resolved').length;

  const sentimentPieData = [
    { name: 'Positive', value: positive, color: '#067647' },
    { name: 'Neutral', value: neutral, color: '#697386' },
    { name: 'Negative', value: negative, color: '#B42318' }
  ];

  // Common keywords across this category
  const keywordCounts: Record<string, number> = {};
  categoryItems.forEach(item => {
    item.analysis.extractedKeywords.forEach(kw => {
      const lower = kw.toLowerCase();
      keywordCounts[lower] = (keywordCounts[lower] || 0) + 1;
    });
  });
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Category Selector Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-xs">
        <div className="text-xs font-semibold text-[#697386] uppercase tracking-wider mb-3">
          Select Operational Category (8 Standard Disciplines)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {categories.map(cat => {
            const count = feedbackList.filter(f => (f.humanReview?.correctedCategory || f.analysis.category) === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#244A73] bg-[#EBF1F6] ring-1 ring-[#244A73]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F7F8FA]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {getCategoryIcon(cat)}
                  <span className="font-mono text-xs font-bold text-[#20242B]">{count}</span>
                </div>
                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-[#244A73]' : 'text-[#20242B]'}`}>
                  {cat}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Diagnostic Dashboard */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
              {getCategoryIcon(selectedCategory)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#20242B]">{selectedCategory} Diagnostics</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {total} Records Logged
                </span>
              </div>
              <p className="text-xs text-[#697386]">
                Root-cause pattern identification and operational resolution metrics for {selectedCategory} issues.
              </p>
            </div>
          </div>

          <button
            onClick={() => onFilterExplorerByCategory(selectedCategory)}
            className="px-3 py-1.5 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          >
            Filter Explorer by {selectedCategory} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Diagnostic KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md">
            <div className="text-[11px] font-semibold text-[#697386] uppercase">Total Category Tickets</div>
            <div className="text-2xl font-bold text-[#20242B] mt-1">{total}</div>
            <div className="text-[11px] text-[#697386] mt-0.5">
              {((total / (feedbackList.length || 1)) * 100).toFixed(0)}% of all campus feedback
            </div>
          </div>

          <div className="p-3 bg-red-50/50 border border-red-200 rounded-md">
            <div className="text-[11px] font-semibold text-red-700 uppercase">Negative Sentiment</div>
            <div className="text-2xl font-bold text-red-700 mt-1">{negative}</div>
            <div className="text-[11px] text-red-600 mt-0.5">
              {total > 0 ? ((negative / total) * 100).toFixed(0) : 0}% complaint ratio
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-md">
            <div className="text-[11px] font-semibold text-amber-800 uppercase">Critical & High Issues</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{urgentCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              Requires expedited SLA
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-md">
            <div className="text-[11px] font-semibold text-[#244A73] uppercase">Unresolved Backlog</div>
            <div className="text-2xl font-bold text-[#244A73] mt-1">{unresolved}</div>
            <div className="text-[11px] text-[#244A73] mt-0.5">
              Open departmental tickets
            </div>
          </div>
        </div>

        {/* Visual Charts & Common Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Sentiment Donut */}
          <div className="p-4 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center">
            <div className="w-full text-xs font-bold text-[#20242B] uppercase mb-2">
              Sentiment Distribution in {selectedCategory}
            </div>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Frequent Issues & Topic Tags */}
          <div className="p-4 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#20242B] uppercase mb-2">
                Frequently Reported Topics & Keywords
              </div>
              <p className="text-xs text-[#697386] mb-3">
                Key phrases recurring in student descriptions for this category:
              </p>
              <div className="flex flex-wrap gap-2">
                {topKeywords.map(([kw, count]) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#20242B] font-medium flex items-center gap-1.5 shadow-2xs"
                  >
                    <Tag className="w-3 h-3 text-[#244A73]" />
                    <span>{kw}</span>
                    <span className="text-[10px] font-mono text-[#697386] bg-gray-100 px-1.5 rounded-full">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 text-xs text-[#697386]">
              Observed concentration: Issues often stem from operational delays and scheduled maintenance coordination.
            </div>
          </div>
        </div>

        {/* Recent Category Records Table */}
        <div className="pt-2">
          <div className="text-xs font-bold text-[#20242B] uppercase tracking-wider mb-2">
            Recent {selectedCategory} Submissions
          </div>
          <div className="divide-y divide-gray-100 border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
            {categoryItems.slice(0, 5).map(item => (
              <div
                key={item.id}
                onClick={() => onSelectFeedback(item)}
                className="p-3 hover:bg-[#F7F8FA] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[#244A73]">{item.id}</span>
                    <PriorityBadge priority={item.humanReview?.correctedPriority || item.analysis.priority} size="sm" />
                    <SentimentBadge sentiment={item.humanReview?.correctedSentiment || item.analysis.sentiment} />
                  </div>
                  <p className="text-gray-800 line-clamp-1">{item.text}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[#697386]">
                  <StatusBadge status={item.status} />
                  <span className="font-mono text-[11px]">{item.createdAt.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
