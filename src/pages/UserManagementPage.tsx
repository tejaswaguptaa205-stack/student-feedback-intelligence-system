import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Building2,
  RefreshCw,
  Mail,
  IdCard,
  Lock
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';
import { ApiService } from '../services/apiService';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState<{
    total: number;
    students: number;
    faculty: number;
    admins: number;
    pendingApproval: number;
    disabled: number;
  }>({
    total: 0,
    students: 0,
    faculty: 0,
    admins: 0,
    pendingApproval: 0,
    disabled: 0
  });

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getUsers(roleFilter, statusFilter);
      setUsers(data.users);
      if (data.counts) {
        setCounts({
          total: Number(data.counts.total || 0),
          students: Number(data.counts.students || 0),
          faculty: Number(data.counts.faculty || 0),
          admins: Number(data.counts.admins || 0),
          pendingApproval: Number(data.counts.pendingApproval || 0),
          disabled: Number(data.counts.disabled || 0)
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleStatusChange = async (userId: string, newStatus: UserStatus, userName: string) => {
    try {
      await ApiService.updateUserStatus(userId, newStatus);
      setActionSuccess(`Account status for ${userName} updated to '${newStatus}'.`);
      setTimeout(() => setActionSuccess(null), 4000);
      fetchUsers();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.institutional_id?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#20242B] tracking-tight">Student & Faculty User Governance</h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Admin oversight: manage institutional roles, verify pending faculty credentials, and control access permissions.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5E7EB] hover:bg-gray-50 rounded text-gray-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#244A73]" /> Refresh Users
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-bold text-[#244A73] mt-1">{counts.total}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Persistent in SQLite</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Students</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{counts.students}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Enrolled Student IDs</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Active Faculty</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{counts.faculty}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Verified Instructors</div>
        </div>

        <div className={`p-4 rounded-lg border shadow-sm ${
          counts.pendingApproval > 0
            ? 'bg-amber-50 border-amber-200'
            : 'bg-white border-[#E5E7EB]'
        }`}>
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{counts.pendingApproval}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Awaiting Faculty Verification</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Administrators</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{counts.admins}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Controlled Seed Only</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Disabled</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{counts.disabled}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Suspended Access</div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="font-semibold">Role:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students Only</option>
              <option value="faculty">Faculty Only</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full text-xs pl-9 pr-3 py-1.5 border border-gray-300 rounded outline-none focus:border-[#244A73]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] text-[#697386] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Institutional ID</th>
                <th className="py-3 px-4">Department & Program</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">Loading user database from SQLite...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">No users found matching current filters.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{u.full_name}</div>
                      <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {u.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {u.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          <Shield className="w-3 h-3 text-blue-700" /> Admin
                        </span>
                      )}
                      {u.role === 'student' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          <GraduationCap className="w-3 h-3 text-emerald-700" /> Student
                        </span>
                      )}
                      {u.role === 'faculty' && (
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          <Briefcase className="w-3 h-3 text-indigo-700" /> Faculty
                        </span>
                      )}
                    </td>

                    {/* Institutional ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-gray-700">
                      {u.institutional_id || '—'}
                    </td>

                    {/* Department & Program */}
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium">{u.department || 'General'}</div>
                      <div className="text-[11px] text-gray-500">
                        {u.role === 'student'
                          ? `${u.course || ''} (${u.academic_year || ''})`
                          : u.designation || 'Faculty Member'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {u.status === 'active' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {u.status === 'disabled' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                          <UserX className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {u.role === 'admin' ? (
                        <span className="text-[11px] text-gray-400 italic">Protected System Account</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(u.id, 'active', u.full_name)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm flex items-center gap-1 transition-colors"
                            >
                              <UserCheck className="w-3 h-3" /> Approve Faculty
                            </button>
                          )}

                          {u.status === 'active' && (
                            <button
                              onClick={() => handleStatusChange(u.id, 'disabled', u.full_name)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                            >
                              Deactivate
                            </button>
                          )}

                          {u.status === 'disabled' && (
                            <button
                              onClick={() => handleStatusChange(u.id, 'active', u.full_name)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded transition-colors"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      )}
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
