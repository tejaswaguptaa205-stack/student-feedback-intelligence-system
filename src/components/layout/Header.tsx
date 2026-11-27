import React, { useState } from 'react';
import {
  Search,
  Bell,
  RotateCcw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  X
} from 'lucide-react';
import { NavPageId } from './Sidebar';
import { FeedbackItem, User as CurrentUserType, UserRole } from '../../types';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  currentPage: NavPageId;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  onResetDemoData: () => void;
  onSelectFeedback: (item: FeedbackItem) => void;
  criticalItems: FeedbackItem[];
  allFeedback: FeedbackItem[];
  currentUser?: CurrentUserType | null;
  onLogout?: () => void;
  onSwitchPortal?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  searchTerm,
  onSearchChange,
  onResetDemoData,
  onSelectFeedback,
  criticalItems,
  allFeedback,
  currentUser,
  onLogout,
  onSwitchPortal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const getPageInfo = (page: NavPageId) => {
    switch (page) {
      case 'overview':
        return { title: 'Overview Dashboard', subtitle: 'Executive metrics, sentiment trends, and real-time operational feeds' };
      case 'submit':
        return { title: 'Submit Student Feedback', subtitle: 'Omnichannel student submission portal with real-time Edge NLP classification' };
      case 'explorer':
        return { title: 'Feedback Explorer', subtitle: 'Searchable database of student inquiries, complaints, and administrative tickets' };
      case 'analysis':
        return { title: 'AI Analysis & Explainability', subtitle: 'Deep-dive into multi-class intent categorization, sentiment scores, and priority models' };
      case 'priority':
        return { title: 'Priority & Escalation Management', subtitle: 'Critical safety alerts, SLA countdowns, and service-level routing queues' };
      case 'analytics':
        return { title: 'Analytics & Reporting', subtitle: 'Institutional performance indicators, department comparisons, and CSV/PDF export' };
      case 'categories':
        return { title: 'Category Insights', subtitle: 'In-depth diagnostics across all 8 core institutional operational categories' };
      case 'edge-monitor':
        return { title: 'Edge AI Monitor', subtitle: 'Hardware telemetry, on-device inference latency, NPU status, and offline sync logs' };
      case 'model-eval':
        return { title: 'Model Evaluation & Benchmarks', subtitle: 'Confusion matrix, precision, recall, F1 metrics, and misclassification inspector' };
      case 'user-mgmt':
        return { title: 'User & Faculty Management', subtitle: 'Manage student and faculty accounts, approve pending registrations, and set status' };
      case 'audit-logs':
        return { title: 'Security & Audit Logs', subtitle: 'Institutional audit log recording administrative operations, approvals, and security events' };
      case 'settings':
        return { title: 'System Settings', subtitle: 'Service level agreements, category schemas, departments, and demo controls' };
      default:
        return { title: 'Feedback Intelligence Platform', subtitle: 'University Operations' };
    }
  };

  const pageInfo = getPageInfo(currentPage);

  // Filter search results
  const matchingResults = searchTerm.trim().length > 1
    ? allFeedback.filter(f =>
        f.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.analysis.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div className="flex-1 min-w-0 pr-4">
        <h1 className="text-base font-bold text-[#20242B] truncate tracking-tight">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-[#697386] truncate">
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Global Search & Action Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#697386] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search feedback, ID, category..."
              className="w-full pl-9 pr-8 py-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs text-[#20242B] placeholder-[#697386] focus:outline-none focus:border-[#244A73] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 text-[#697386] hover:text-[#20242B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchTerm.trim().length > 1 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-[#E5E7EB] rounded-md shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#697386] border-b border-[#E5E7EB]">
                Matching Results ({matchingResults.length})
              </div>
              {matchingResults.length === 0 ? (
                <div className="px-3 py-3 text-center text-[#697386]">
                  No matching feedback found
                </div>
              ) : (
                matchingResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectFeedback(item);
                      setShowSearchDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-[#F7F8FA] cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between font-medium text-[#20242B]">
                      <span className="font-mono text-[#244A73]">{item.id}</span>
                      <span className="text-[11px] text-[#697386]">{item.analysis.category}</span>
                    </div>
                    <p className="text-gray-600 truncate mt-0.5">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Edge AI Health Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-xs">
          <Cpu className="w-3.5 h-3.5 text-[#244A73]" />
          <span className="text-[#697386]">Edge Mode:</span>
          <span className="font-medium text-[#20242B] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ONNX NPU Local
          </span>
        </div>

        {/* Demo Data Reset Button */}
        <button
          onClick={onResetDemoData}
          title="Reset dataset to default 30 benchmark records"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#475467] hover:text-[#20242B] hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#697386]" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-[#475467] hover:text-[#20242B] hover:bg-[#F7F8FA] rounded-md relative border border-[#E5E7EB]"
            title="In-App Notifications"
          >
            <Bell className="w-4 h-4 text-[#697386]" />
            {criticalItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {criticalItems.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-[#E5E7EB] flex items-center justify-between">
                <span className="font-semibold text-[#20242B]">Operational Alerts</span>
                <span className="text-[11px] text-red-600 font-medium">
                  {criticalItems.length} Critical Items
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {criticalItems.length === 0 ? (
                  <div className="py-4 text-center text-[#697386]">
                    No urgent safety or critical SLA tickets
                  </div>
                ) : (
                  criticalItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectFeedback(item);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 hover:bg-[#FEF3F2] cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-red-700 font-semibold">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.id}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider">{item.analysis.category}</span>
                      </div>
                      <p className="text-[#20242B] line-clamp-2 mt-1">{item.text}</p>
                      <div className="text-[10px] text-[#697386] mt-1">
                        SLA Target: {item.slaTargetHours} hours
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EBF1F6] text-[#244A73] flex items-center justify-center font-bold text-xs border border-[#244A73]/20">
            {currentUser?.full_name ? currentUser.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'AR'}
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <div className="text-xs font-semibold text-[#20242B] flex items-center gap-1.5">
              <span>{currentUser?.full_name || currentUser?.name || 'Administrator'}</span>
              <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                currentUser?.role === 'admin'
                  ? 'bg-rose-100 text-rose-800'
                  : currentUser?.role === 'faculty'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {currentUser?.role || 'Admin'}
              </span>
            </div>
            <div className="text-[10px] text-[#697386]">
              {(currentUser?.institutional_id || currentUser?.institutionalId) ? `${currentUser.institutional_id || currentUser.institutionalId} · ` : ''}{currentUser?.department || 'Governance Office'}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out of SFIS"
              className="p-1.5 ml-1 text-[#697386] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
