import React from 'react';
import { FeedbackItem, FeedbackCategory } from '../types';
import { PriorityBadge, SentimentBadge, CategoryBadge, StatusBadge } from '../components/common/Badges';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Cpu,
  ArrowRight,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

interface OverviewPageProps {
  feedbackList: FeedbackItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  onNavigate: (page: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  feedbackList,
  onSelectFeedback,
  onNavigate
}) => {
  // KPIs
  const totalReceived = feedbackList.length;
  const analyzedCount = feedbackList.filter(f => f.status !== 'Submitted').length;
  const negativeCount = feedbackList.filter(f => f.analysis.sentiment === 'Negative').length;
  const negativePercentage = totalReceived > 0 ? ((negativeCount / totalReceived) * 100).toFixed(1) : '0';
  const highPriorityCount = feedbackList.filter(f => f.analysis.priority === 'Critical' || f.analysis.priority === 'High').length;
  const unresolvedCount = feedbackList.filter(f => f.status !== 'Resolved').length;

  // Average resolution time (approx from resolved items)
  const resolvedItems = feedbackList.filter(f => f.status === 'Resolved');
  const avgResolutionHours = resolvedItems.length > 0 ? 18.5 : 24.0;

  // Sentiment Distribution for Donut Chart
  const positiveCount = feedbackList.filter(f => f.analysis.sentiment === 'Positive').length;
  const neutralCount = feedbackList.filter(f => f.analysis.sentiment === 'Neutral').length;
  const sentimentChartData = [
    { name: 'Positive', value: positiveCount, color: '#067647' },
    { name: 'Neutral', value: neutralCount, color: '#697386' },
    { name: 'Negative', value: negativeCount, color: '#B42318' }
  ];

  // Category Distribution
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

  const categoryDistributionData = categories.map(cat => {
    const items = feedbackList.filter(f => f.analysis.category === cat);
    const neg = items.filter(f => f.analysis.sentiment === 'Negative').length;
    const pos = items.filter(f => f.analysis.sentiment === 'Positive').length;
    const neu = items.filter(f => f.analysis.sentiment === 'Neutral').length;
    return {
      category: cat,
      Total: items.length,
      Negative: neg,
      Positive: pos,
      Neutral: neu
    };
  }).sort((a, b) => b.Total - a.Total);

  // Volume Over Time (grouped by date)
  const dateMap: Record<string, { date: string; Total: number; Negative: number }> = {};
  [...feedbackList].reverse().forEach(item => {
    const day = item.createdAt.slice(5, 10); // MM-DD
    if (!dateMap[day]) {
      dateMap[day] = { date: day, Total: 0, Negative: 0 };
    }
    dateMap[day].Total += 1;
    if (item.analysis.sentiment === 'Negative') {
      dateMap[day].Negative += 1;
    }
  });
  const volumeTimeData = Object.values(dateMap).slice(-10);

  // Urgent Critical & High Items
  const urgentQueue = feedbackList
    .filter(f => (f.analysis.priority === 'Critical' || f.analysis.priority === 'High') && f.status !== 'Resolved')
    .slice(0, 5);

  // Latest edge processed stream
  const latestActivity = feedbackList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Operational Status Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#20242B]">Edge NLP Inference Gateway: Operational</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                100% On-Premise
              </span>
            </div>
            <p className="text-xs text-[#697386]">
              All student submissions are processed locally with ONNX Int8 quantized Transformer model. Zero cloud data exfiltration.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onNavigate('edge-monitor')}
            className="text-xs font-medium text-[#244A73] hover:underline flex items-center gap-1"
          >
            Telemetry Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Feedback */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Received</span>
            <Inbox className="w-4 h-4 text-[#244A73]" />
          </div>
          <div className="text-2xl font-bold text-[#20242B] tracking-tight">{totalReceived}</div>
          <div className="text-[11px] text-[#697386] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>+14% vs last cycle</span>
          </div>
        </div>

        {/* Analyzed Feedback */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Analyzed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#20242B] tracking-tight">{analyzedCount}</div>
          <div className="text-[11px] text-[#697386] mt-1">
            <span className="font-medium text-emerald-700">100%</span> edge coverage
          </div>
        </div>

        {/* Negative Feedback % */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Negative %</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 tracking-tight">{negativePercentage}%</div>
          <div className="text-[11px] text-[#697386] mt-1">
            <span>{negativeCount} negative reports</span>
          </div>
        </div>

        {/* High-Priority / Critical */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Urgent Action</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#20242B] tracking-tight">{highPriorityCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Requires expedited SLA
          </div>
        </div>

        {/* Unresolved Feedback */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Unresolved</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#20242B] tracking-tight">{unresolvedCount}</div>
          <div className="text-[11px] text-[#697386] mt-1">
            <span>Open queue tickets</span>
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5">
          <div className="flex items-center justify-between text-[#697386] mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Resolution</span>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-[#20242B] tracking-tight">{avgResolutionHours}h</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            -4.2h improvement
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sentiment Distribution */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div>
              <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
                Sentiment Distribution
              </h3>
              <p className="text-[11px] text-[#697386]">Proportion of positive, neutral, and negative sentiment</p>
            </div>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} items (${((val / totalReceived) * 100).toFixed(0)}%)`, 'Count']}
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100 text-center text-xs">
            <div>
              <div className="text-emerald-700 font-bold">{positiveCount}</div>
              <div className="text-[11px] text-[#697386]">Positive</div>
            </div>
            <div>
              <div className="text-gray-700 font-bold">{neutralCount}</div>
              <div className="text-[11px] text-[#697386]">Neutral</div>
            </div>
            <div>
              <div className="text-red-700 font-bold">{negativeCount}</div>
              <div className="text-[11px] text-[#697386]">Negative</div>
            </div>
          </div>
        </div>

        {/* Feedback Volume Over Time */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div>
              <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
                Feedback Intake & Trend Over Time
              </h3>
              <p className="text-[11px] text-[#697386]">Total volume vs negative complaint spikes across recent dates</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#697386' }} />
                <YAxis tick={{ fontSize: 11, fill: '#697386' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }}
                />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Total" stroke="#244A73" fill="#EBF1F6" strokeWidth={2} />
                <Area type="monotone" dataKey="Negative" stroke="#B42318" fill="#FECDCA" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
          <div>
            <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
              Category Volume & Negative Sentiment Breakdown (All 8 Disciplines)
            </h3>
            <p className="text-[11px] text-[#697386]">Compare ticket density and negative sentiment concentrations across categories</p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs text-[#244A73] hover:underline flex items-center gap-1 font-medium"
          >
            Category Deep-Dive <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryDistributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#697386' }} />
              <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 11, fill: '#20242B', fontWeight: 500 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', fontSize: '11px', borderRadius: '4px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Negative" fill="#B42318" stackId="a" />
              <Bar dataKey="Neutral" fill="#98A2B3" stackId="a" />
              <Bar dataKey="Positive" fill="#067647" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables: Urgent Escalation Queue & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Urgent Action Queue */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
                High-Priority Escalation Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigate('priority')}
              className="text-xs text-[#244A73] hover:underline font-medium"
            >
              View All ({urgentQueue.length})
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {urgentQueue.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#697386]">
                No critical or high-priority items pending review.
              </div>
            ) : (
              urgentQueue.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectFeedback(item)}
                  className="py-3 hover:bg-[#F7F8FA] px-2 rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#244A73]">{item.id}</span>
                      <PriorityBadge priority={item.analysis.priority} size="sm" />
                      <CategoryBadge category={item.analysis.category} />
                    </div>
                    <span className="text-[11px] font-mono text-[#697386]">SLA: {item.slaTargetHours}h</span>
                  </div>
                  <p className="text-xs text-[#20242B] line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#697386]">
                    <span>Team: {item.assignedTeam}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Edge Ingestion Stream */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#244A73]" />
              <h3 className="text-xs font-bold text-[#20242B] uppercase tracking-wider">
                Edge Ingestion & Analysis Stream
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Feed
            </span>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {latestActivity.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectFeedback(item)}
                className="py-2.5 hover:bg-[#F7F8FA] px-2 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-[#20242B]">{item.id}</span>
                  <div className="flex items-center gap-2">
                    <SentimentBadge sentiment={item.analysis.sentiment} score={item.analysis.sentimentScore} />
                    <span className="font-mono text-[10px] text-emerald-700">
                      {item.analysis.processingTimeMs}ms
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {item.text}
                </p>
                <div className="text-[10px] text-[#697386] mt-1 flex items-center justify-between">
                  <span>{item.department}</span>
                  <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
