import React, { useState } from 'react';
import {
  Shield,
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  User as UserIcon,
  IdCard,
  Building2,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
  defaultRole?: UserRole;
  allowClose?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onSuccess,
  defaultRole = 'student',
  allowClose = false,
  onClose
}) => {
  // Entry point: 'user' (Student/Faculty) vs 'admin'
  const [entryPoint, setEntryPoint] = useState<'user' | 'admin'>(defaultRole === 'admin' ? 'admin' : 'user');
  const [userRole, setUserRole] = useState<'student' | 'faculty'>(defaultRole === 'faculty' ? 'faculty' : 'student');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institutionalId, setInstitutionalId] = useState('');
  const [department, setDepartment] = useState('School of Computing');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [academicYear, setAcademicYear] = useState('Year 3 (2024-2028)');
  const [designation, setDesignation] = useState('Assistant Professor');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleQuickFill = (role: 'admin' | 'student' | 'faculty' | 'pending_faculty') => {
    setError(null);
    setSuccessMessage(null);
    setAuthMode('signin');
    if (role === 'admin') {
      setEntryPoint('admin');
      setEmail('admin@sfis.edu');
      setPassword('Admin@SFIS2026!');
    } else if (role === 'student') {
      setEntryPoint('user');
      setUserRole('student');
      setEmail('student@sfis.edu');
      setPassword('Student@123!');
    } else if (role === 'faculty') {
      setEntryPoint('user');
      setUserRole('faculty');
      setEmail('faculty@sfis.edu');
      setPassword('Faculty@123!');
    } else if (role === 'pending_faculty') {
      setEntryPoint('user');
      setUserRole('faculty');
      setEmail('priya.nair@sfis.edu');
      setPassword('Faculty@123!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (entryPoint === 'admin') {
        // Admin Sign-in
        const res = await ApiService.login({
          email,
          password,
          requestedRole: 'admin'
        });
        onSuccess(res.user);
      } else {
        // User Entry Point (Student or Faculty)
        if (authMode === 'signin') {
          const res = await ApiService.login({
            email,
            password,
            requestedRole: userRole
          });
          onSuccess(res.user);
        } else {
          // Register Mode
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match. Please verify your password confirmation.');
          }

          if (userRole === 'student') {
            const res = await ApiService.registerStudent({
              email,
              password,
              full_name: fullName,
              institutional_id: institutionalId,
              department,
              course,
              academic_year: academicYear
            });
            setSuccessMessage(res.message);
            setTimeout(() => {
              onSuccess(res.user);
            }, 1000);
          } else {
            // Faculty Registration (Pending state)
            const res = await ApiService.registerFaculty({
              email,
              password,
              full_name: fullName,
              institutional_id: institutionalId,
              department,
              designation
            });
            setSuccessMessage(res.message);
            setAuthMode('signin');
            setPassword('');
            setConfirmPassword('');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="bg-[#244A73] text-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Institutional Authentication</h2>
                <p className="text-xs text-blue-100">Student Feedback Intelligence System (SFIS)</p>
              </div>
            </div>
            {allowClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white text-sm font-medium px-2 py-1 rounded"
              >
                ✕
              </button>
            )}
          </div>

          {/* Primary Entry Point Tabs: User vs Admin */}
          <div className="flex gap-2 mt-5 p-1 bg-black/20 rounded-md">
            <button
              type="button"
              onClick={() => {
                setEntryPoint('user');
                resetForm();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors ${
                entryPoint === 'user'
                  ? 'bg-white text-[#244A73] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              User Portal (Student & Faculty)
            </button>
            <button
              type="button"
              onClick={() => {
                setEntryPoint('admin');
                resetForm();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors ${
                entryPoint === 'admin'
                  ? 'bg-white text-[#244A73] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* USER ENTRY POINT CONTROLS */}
          {entryPoint === 'user' && (
            <div className="mb-6 space-y-4">
              {/* Role Selector: Student vs Faculty */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Select Role:</div>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('student');
                      resetForm();
                    }}
                    className={`px-4 py-1.5 text-xs font-medium rounded-l-md border ${
                      userRole === 'student'
                        ? 'bg-[#244A73] text-white border-[#244A73]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('faculty');
                      resetForm();
                    }}
                    className={`px-4 py-1.5 text-xs font-medium rounded-r-md border-t border-b border-r ${
                      userRole === 'faculty'
                        ? 'bg-[#244A73] text-white border-[#244A73]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    👨‍🏫 Faculty Member
                  </button>
                </div>
              </div>

              {/* Sign in vs Register Toggle */}
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">
                  {authMode === 'signin'
                    ? `Access your ${userRole} account`
                    : `Register as a new institutional ${userRole}`}
                </span>
                <div className="flex gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      resetForm();
                    }}
                    className={`px-3 py-1 rounded font-medium ${
                      authMode === 'signin' ? 'bg-white shadow text-[#244A73]' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      resetForm();
                    }}
                    className={`px-3 py-1 rounded font-medium ${
                      authMode === 'register' ? 'bg-white shadow text-[#244A73]' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN ENTRY POINT BANNER */}
          {entryPoint === 'admin' && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Restricted Administrative Gateway:</span> Access is strictly limited
                to authorized academic registrars and institutional administrators. Public registration is permanently disabled.
              </div>
            </div>
          )}

          {/* Notifications / Errors */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication Error:</span> {error}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Notice:</span> {successMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration specific fields */}
            {entryPoint === 'user' && authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder={userRole === 'student' ? 'e.g. Aarav Sharma' : 'e.g. Dr. Ramesh Kulkarni'}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {userRole === 'student' ? 'Student ID' : 'Employee ID'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={institutionalId}
                        onChange={e => setInstitutionalId(e.target.value)}
                        placeholder={userRole === 'student' ? 'STU-2024-XXXX' : 'EMP-FAC-XXXX'}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Academic Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                      >
                        <option value="School of Computing">School of Computing</option>
                        <option value="Department of Electrical Engineering">Department of Electrical Engineering</option>
                        <option value="Department of Physics">Department of Physics</option>
                        <option value="Department of Mathematics">Department of Mathematics</option>
                        <option value="School of Basic Sciences">School of Basic Sciences</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                      </select>
                    </div>
                  </div>
                </div>

                {userRole === 'student' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Course / Degree</label>
                      <div className="relative">
                        <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={course}
                          onChange={e => setCourse(e.target.value)}
                          placeholder="e.g. B.Tech Computer Science"
                          className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={academicYear}
                          onChange={e => setAcademicYear(e.target.value)}
                          placeholder="e.g. Year 3 (2024-2028)"
                          className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Designation</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                      <select
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none bg-white"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Adjunct Lecturer">Adjunct Lecturer</option>
                        <option value="Lab Instructor">Lab Instructor</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Faculty registrations require verification by an administrator prior to access.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Institutional Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={
                    entryPoint === 'admin'
                      ? 'admin@sfis.edu'
                      : userRole === 'student'
                      ? 'student@sfis.edu'
                      : 'faculty@sfis.edu'
                  }
                  className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={authMode === 'signin' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                  />
                </div>
              </div>

              {authMode === 'register' && entryPoint === 'user' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#244A73] focus:border-[#244A73] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>Verifying Institutional Credentials...</>
              ) : (
                <>
                  {entryPoint === 'admin'
                    ? 'Authenticate as Administrator'
                    : authMode === 'signin'
                    ? `Sign In to ${userRole === 'student' ? 'Student' : 'Faculty'} Portal`
                    : `Complete ${userRole === 'student' ? 'Student' : 'Faculty'} Registration`}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Bar */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Demo Access Credentials
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-[#244A73]">Admin</div>
                <div className="text-[10px] text-gray-500 truncate">admin@sfis.edu</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-emerald-700">Student</div>
                <div className="text-[10px] text-gray-500 truncate">student@sfis.edu</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('faculty')}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-indigo-700">Faculty (Active)</div>
                <div className="text-[10px] text-gray-500 truncate">faculty@sfis.edu</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('pending_faculty')}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-amber-700">Faculty (Pending)</div>
                <div className="text-[10px] text-gray-500 truncate">priya.nair@sfis.edu</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
