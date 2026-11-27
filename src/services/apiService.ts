import {
  User,
  UserRole,
  UserStatus,
  FeedbackItem,
  NotificationItem,
  DepartmentAnnouncement,
  AuditLogItem
} from '../types';

const TOKEN_KEY = 'sfis_auth_token_v1';
const USER_KEY = 'sfis_auth_user_v1';

export class ApiService {
  private static baseUrl = '';

  static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to set token', e);
    }
  }

  static clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear token', e);
    }
  }

  static getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setStoredUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to store user', e);
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  }

  // --- Auth APIs ---
  static async login(params: { email: string; password: string; requestedRole?: UserRole }): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    this.setToken(res.token);
    this.setStoredUser(res.user);
    return res;
  }

  static async registerStudent(data: {
    email: string;
    password: string;
    full_name: string;
    institutional_id: string;
    department?: string;
    course?: string;
    academic_year?: string;
  }): Promise<{ message: string; token: string; user: User }> {
    const res = await this.request<{ message: string; token: string; user: User }>('/api/auth/register-student', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.token) {
      this.setToken(res.token);
      this.setStoredUser(res.user);
    }
    return res;
  }

  static async registerFaculty(data: {
    email: string;
    password: string;
    full_name: string;
    institutional_id: string;
    department?: string;
    designation?: string;
  }): Promise<{ message: string; pendingApproval: boolean }> {
    return this.request<{ message: string; pendingApproval: boolean }>('/api/auth/register-faculty', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async getMe(): Promise<{ user: User }> {
    const res = await this.request<{ user: User }>('/api/auth/me');
    this.setStoredUser(res.user);
    return res;
  }

  static async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      this.clearToken();
    }
  }

  // --- Feedback APIs ---
  static async getFeedback(filters: {
    sourceRole?: string;
    category?: string;
    priority?: string;
    status?: string;
    department?: string;
    isConfidential?: boolean;
  } = {}): Promise<FeedbackItem[]> {
    const query = new URLSearchParams();
    if (filters.sourceRole) query.append('sourceRole', filters.sourceRole);
    if (filters.category) query.append('category', filters.category);
    if (filters.priority) query.append('priority', filters.priority);
    if (filters.status) query.append('status', filters.status);
    if (filters.department) query.append('department', filters.department);
    if (filters.isConfidential !== undefined) query.append('isConfidential', String(filters.isConfidential));

    const res = await this.request<{ feedback: FeedbackItem[] }>(`/api/feedback?${query.toString()}`);
    return res.feedback;
  }

  static async submitFeedback(payload: any): Promise<{ id: string; message: string }> {
    return this.request<{ id: string; message: string }>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  static async reviewFeedback(id: string, reviewData: any): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/feedback/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  static async updateFeedbackStatus(id: string, statusData: { status?: string; assignedTeam?: string; note?: string }): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/feedback/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(statusData)
    });
  }

  static async addFeedbackNote(id: string, note: string): Promise<any> {
    return this.request(`/api/feedback/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
  }

  // --- Users APIs (Admin only) ---
  static async getUsers(role?: string, status?: string): Promise<{ users: User[]; counts: any }> {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (status) query.append('status', status);

    return this.request<{ users: User[]; counts: any }>(`/api/users?${query.toString()}`);
  }

  static async updateUserStatus(userId: string, status: UserStatus): Promise<{ user: User }> {
    return this.request<{ user: User }>(`/api/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Notifications APIs ---
  static async getNotifications(): Promise<NotificationItem[]> {
    const res = await this.request<{ notifications: NotificationItem[] }>('/api/notifications');
    return res.notifications;
  }

  static async markAllNotificationsRead(): Promise<void> {
    await this.request('/api/notifications/read-all', { method: 'POST' });
  }

  // --- Announcements APIs ---
  static async getAnnouncements(): Promise<DepartmentAnnouncement[]> {
    const res = await this.request<{ announcements: DepartmentAnnouncement[] }>('/api/announcements');
    return res.announcements;
  }

  static async createAnnouncement(data: { title: string; content: string; department?: string; priority?: string }): Promise<{ success: boolean; id: string }> {
    return this.request<{ success: boolean; id: string }>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // --- Audit Logs & Source Comparison APIs ---
  static async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await this.request<{ auditLogs: AuditLogItem[] }>('/api/audit-logs');
    return res.auditLogs;
  }

  static async getSourceComparison(): Promise<{ studentStats: any; facultyStats: any }> {
    return this.request<{ studentStats: any; facultyStats: any }>('/api/analytics/source-comparison');
  }
}
