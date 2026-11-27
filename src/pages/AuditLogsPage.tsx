import React, { useState, useEffect } from 'react';
import { Shield, Clock, RefreshCw, Filter, Search, User, FileText, CheckCircle2 } from 'lucide-react';
import { AuditLogItem } from '../types';
import { ApiService } from '../services/apiService';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      l.user_email?.toLowerCase().includes(q) ||
      l.action?.toLowerCase().includes(q) ||
      l.details?.toLowerCase().includes(q) ||
      l.ip_address?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#20242B] tracking-tight">Institutional Audit Trail & Governance Log</h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Cryptographic audit logging of logins, role updates, faculty approvals, and SLA status changes.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5E7EB] hover:bg-gray-50 rounded text-gray-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#244A73]" /> Refresh Logs
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-semibold">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium outline-none"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="REGISTER_STUDENT">REGISTER_STUDENT</option>
            <option value="REGISTER_FACULTY">REGISTER_FACULTY</option>
            <option value="USER_STATUS_CHANGE">USER_STATUS_CHANGE</option>
            <option value="FEEDBACK_SUBMIT">FEEDBACK_SUBMIT</option>
            <option value="FEEDBACK_REVIEW">FEEDBACK_REVIEW</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search details, emails, or IP..."
            className="w-full text-xs pl-9 pr-3 py-1.5 border border-gray-300 rounded outline-none focus:border-[#244A73]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] text-[#697386] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">Loading audit records from SQLite...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">No audit entries found.</td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[11px] bg-gray-100 text-[#244A73] px-2 py-0.5 rounded">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {l.user_email || 'Anonymous / System'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 capitalize">
                      {l.role || 'System'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {l.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-md truncate">
                      {l.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
