import React, { useState, useMemo } from 'react';
import { FeedbackItem, FeedbackCategory, PriorityLevel, SentimentType } from '../types';
import {
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  TrendingDown,
  AlertTriangle,
  Building,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsReportsPageProps {
  feedbackList: FeedbackItem[];
  departments: string[];
  onExportCSV: () => void;
}

export const AnalyticsReportsPage: React.FC<AnalyticsReportsPageProps> = ({
  feedbackList,
  departments,
  onExportCSV
}) => {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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

  // Filtered dataset
  const filteredData = useMemo(() => {
    return feedbackList.filter(item => {
      if (selectedDept !== 'ALL' && item.department !== selectedDept) return false;
      const effectiveCategory = item.humanReview?.correctedCategory || item.analysis.category;
      if (selectedCategory !== 'ALL' && effectiveCategory !== selectedCategory) return false;

      if (selectedRange !== 'all') {
        const itemDate = new Date(item.createdAt).getTime();
        const now = Date.now();
        const days = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : 90;
        if (now - itemDate > days * 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      return true;
    });
  }, [feedbackList, selectedRange, selectedDept, selectedCategory]);

  // Aggregate metrics
  const total = filteredData.length;
  const positive = filteredData.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Positive').length;
  const neutral = filteredData.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Neutral').length;
  const negative = filteredData.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Negative').length;
  const critical = filteredData.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'Critical').length;
  const high = filteredData.filter(f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'High').length;
  const resolved = filteredData.filter(f => f.status === 'Resolved').length;
  const unresolved = total - resolved;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';

  // Per-category breakdown
  const categoryBreakdown = categories.map(cat => {
    const items = filteredData.filter(f => (f.humanReview?.correctedCategory || f.analysis.category) === cat);
    const neg = items.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Negative').length;
    const pos = items.filter(f => (f.humanReview?.correctedSentiment || f.analysis.sentiment) === 'Positive').length;
    const res = items.filter(f => f.status === 'Resolved').length;
    return {
      category: cat,
      Total: items.length,
      Negative: neg,
      Positive: pos,
      Resolved: res,
      ResolutionPercent: items.length > 0 ? Math.round((res / items.length) * 100) : 100
    };
  });

  // Sentiment chart data
  const sentimentPieData = [
    { name: 'Positive', value: positive, color: '#067647' },
    { name: 'Neutral', value: neutral, color: '#697386' },
    { name: 'Negative', value: negative, color: '#B42318' }
  ];

  // Resolution performance by department
  const deptPerformance = departments.map(d => {
    const items = filteredData.filter(f => f.department === d);
    const res = items.filter(f => f.status === 'Resolved').length;
    return {
      name: d.length > 20 ? `${d.slice(0, 18)}...` : d,
      Total: items.length,
      Resolved: res
    };
  }).filter(d => d.Total > 0).sort((a, b) => b.Total - a.Total);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Generator Controls */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Time range */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#697386]" />
            <select
              value={selectedRange}
              onChange={e => setSelectedRange(e.target.value as any)}
              className="bg-transparent border-none text-xs text-[#20242B] font-medium focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter (90 Days)</option>
              <option value="all">All Available Records</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded px-2.5 py-1.5">
            <Building className="w-3.5 h-3.5 text-[#697386]" />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-transparent border-none text-xs text-[#20242B] font-medium focus:outline-none max-w-[180px] truncate"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-[#697386]" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-[#20242B] font-medium focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Export & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-[#475467] hover:text-[#20242B] bg-[#F7F8FA] border border-[#E5E7EB] rounded-md transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Institutional Report
          </button>
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#244A73] hover:bg-[#1B3756] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Raw CSV
          </button>
        </div>
      </div>

      {/* Institutional Executive Summary Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono text-[#697386] uppercase tracking-wider">
              University Academic & Operational Audit Report
            </div>
            <h2 className="text-lg font-bold text-[#20242B]">
              Student Feedback Intelligence Summary
            </h2>
          </div>
          <div className="text-right text-xs text-[#697386]">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div className="font-mono text-[11px]">Audit Cohort: {total} Records</div>
          </div>
        </div>

        {/* 4 Summary Highlight Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded">
            <div className="text-[11px] text-[#697386]">Total Sampled Submissions</div>
            <div className="text-xl font-bold text-[#20242B] mt-1">{total}</div>
          </div>
          <div className="p-3 bg-red-50/50 border border-red-200 rounded">
            <div className="text-[11px] text-red-700">Critical / High Severity</div>
            <div className="text-xl font-bold text-red-700 mt-1">{critical + high}</div>
          </div>
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
            <div className="text-[11px] text-emerald-800">Resolution Clearance Rate</div>
            <div className="text-xl font-bold text-emerald-700 mt-1">{resolutionRate}%</div>
          </div>
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded">
            <div className="text-[11px] text-[#244A73]">Open Unresolved Action Items</div>
            <div className="text-xl font-bold text-[#244A73] mt-1">{unresolved}</div>
          </div>
        </div>

        {/* Executive Narrative */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-xs space-y-2 text-gray-800 leading-relaxed">
          <div className="font-bold text-[#20242B] text-xs uppercase tracking-wider">
            Executive Synthesis & Key Observations:
          </div>
          <p>
            During this observation cycle, <strong className="text-[#20242B]">{total} total student feedback records</strong> were collected
            and analyzed. Negative sentiment constitutes <strong className="text-red-700">{total > 0 ? ((negative / total) * 100).toFixed(1) : 0}%</strong> of submissions,
            predominantly centered in <strong className="text-[#20242B]">Hostel living conditions</strong> and <strong className="text-[#20242B]">Examination timetable scheduling</strong>.
          </p>
          <p>
            The institution has resolved <strong className="text-emerald-700">{resolved} tickets ({resolutionRate}%)</strong>.
            However, <strong className="text-red-700">{critical} critical safety issues</strong> (including electrical hazards and mess food health concerns)
            mandate immediate inspection by campus estate officers.
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Resolution & Negative Density */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="border-b border-[#E5E7EB] pb-2 mb-3">
            <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
              Category Total vs Negative Complaints
            </h3>
            <p className="text-[11px] text-[#697386]">Total volume compared to negative complaints across all categories</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#697386' }} />
                <YAxis tick={{ fontSize: 10, fill: '#697386' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Total" fill="#244A73" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Negative" fill="#B42318" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Departmental Workload & Resolution */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="border-b border-[#E5E7EB] pb-2 mb-3">
            <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
              Departmental Ticket Ingestion & Resolution
            </h3>
            <p className="text-[11px] text-[#697386]">Volume of received items vs successfully resolved items by department</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#697386' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#20242B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Total" fill="#697386" />
                <Bar dataKey="Resolved" fill="#067647" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Audit Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
            Detailed Category Performance Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50 text-[#697386] font-semibold text-[11px] uppercase">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Total Items</th>
                <th className="py-2.5 px-3 text-right">Positive</th>
                <th className="py-2.5 px-3 text-right">Negative</th>
                <th className="py-2.5 px-3 text-right">Resolved</th>
                <th className="py-2.5 px-3 text-right">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categoryBreakdown.map(row => (
                <tr key={row.category} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-semibold text-[#20242B]">{row.category}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{row.Total}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">{row.Positive}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-700">{row.Negative}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700">{row.Resolved}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    <span className={row.ResolutionPercent >= 70 ? 'text-emerald-700' : 'text-amber-700'}>
                      {row.ResolutionPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
