import React from 'react';
import {
  LayoutDashboard,
  Send,
  Database,
  BrainCircuit,
  AlertOctagon,
  BarChart3,
  Layers,
  Cpu,
  CheckCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export type NavPageId =
  | 'overview'
  | 'submit'
  | 'explorer'
  | 'analysis'
  | 'priority'
  | 'analytics'
  | 'categories'
  | 'edge-monitor'
  | 'model-eval'
  | 'user-mgmt'
  | 'audit-logs'
  | 'settings';

interface SidebarProps {
  currentPage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  criticalCount: number;
  unresolvedCount: number;
  pendingFacultyCount?: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  criticalCount,
  unresolvedCount,
  pendingFacultyCount = 0,
  collapsed,
  onToggleCollapse
}) => {
  const navItems = [
    { id: 'overview' as NavPageId, label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'submit' as NavPageId, label: 'Submit Feedback', icon: Send },
    { id: 'explorer' as NavPageId, label: 'Feedback Explorer', icon: Database, badge: unresolvedCount },
    { id: 'analysis' as NavPageId, label: 'AI Analysis', icon: BrainCircuit },
    { id: 'priority' as NavPageId, label: 'Priority & Escalations', icon: AlertOctagon, badge: criticalCount, badgeColor: 'bg-red-500' },
    { id: 'analytics' as NavPageId, label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'categories' as NavPageId, label: 'Category Insights', icon: Layers },
    { id: 'user-mgmt' as NavPageId, label: 'User Governance', icon: ShieldCheck, badge: pendingFacultyCount, badgeColor: 'bg-amber-500' },
    { id: 'edge-monitor' as NavPageId, label: 'Edge AI Monitor', icon: Cpu, isEdge: true },
    { id: 'model-eval' as NavPageId, label: 'Model Evaluation', icon: CheckCheck },
    { id: 'audit-logs' as NavPageId, label: 'Audit Trail', icon: ShieldCheck },
    { id: 'settings' as NavPageId, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-[#E5E7EB] flex flex-col transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand & System Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded bg-[#244A73] text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0">
            SF
          </div>
          {!collapsed && (
            <div className="leading-tight truncate">
              <div className="text-sm font-bold text-[#20242B] tracking-tight">SFIS Platform</div>
              <div className="text-[11px] text-[#697386] font-medium">Enterprise NLP Edge</div>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-[#697386] hover:text-[#20242B] p-1 rounded hover:bg-[#F7F8FA] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className={`px-2 pb-2 text-[10px] font-semibold text-[#697386] uppercase tracking-wider ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Main Navigation'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left relative ${
                isActive
                  ? 'bg-[#EBF1F6] text-[#244A73] font-semibold'
                  : 'text-[#475467] hover:text-[#20242B] hover:bg-[#F7F8FA]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#244A73]' : 'text-[#697386]'}`} />
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold text-white leading-tight ${
                    item.badgeColor || 'bg-[#244A73]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Edge AI Status Pill in Footer */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#F7F8FA]">
        {!collapsed ? (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="font-semibold text-[#20242B]">Edge Node 01</div>
                <div className="text-[10px] text-[#697386]">NPU Active • 16.4ms</div>
              </div>
            </div>
            <button
              onClick={() => onSelectPage('edge-monitor')}
              className="text-[#244A73] hover:underline text-[11px] font-medium"
            >
              View
            </button>
          </div>
        ) : (
          <div
            onClick={() => onSelectPage('edge-monitor')}
            className="flex justify-center cursor-pointer"
            title="Edge Node 01 Online"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
