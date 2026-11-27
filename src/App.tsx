import React, { useState, useEffect, useCallback } from 'react';
import {
  FeedbackItem,
  FeedbackCategory,
  SentimentType,
  PriorityLevel,
  FeedbackStatus,
  EdgeDeviceInfo,
  EscalationConfig,
  User,
  UserRole
} from './types';
import { StorageService } from './services/storageService';
import { ApiService } from './services/apiService';
import { Sidebar, NavPageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FeedbackDetailDrawer } from './components/explorer/FeedbackDetailDrawer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { SubmitFeedbackPage } from './pages/SubmitFeedbackPage';
import { FeedbackExplorerPage } from './pages/FeedbackExplorerPage';
import { AiAnalysisPage } from './pages/AiAnalysisPage';
import { PriorityEscalationsPage } from './pages/PriorityEscalationsPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { CategoryInsightsPage } from './pages/CategoryInsightsPage';
import { EdgeMonitorPage } from './pages/EdgeMonitorPage';
import { ModelEvaluationPage } from './pages/ModelEvaluationPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { FacultyPortalPage } from './pages/FacultyPortalPage';
import { EVALUATION_DATA } from './data/evaluationData';

export const App: React.FC = () => {
  // Navigation & UI States
  const [currentPage, setCurrentPage] = useState<NavPageId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState<FeedbackItem | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(ApiService.getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Data States
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [edgeInfo, setEdgeInfo] = useState<EdgeDeviceInfo>(StorageService.getEdgeDevice());
  const [config, setConfig] = useState<EscalationConfig>(StorageService.getEscalationConfig());

  // Load Initial Data and verify active session on Mount
  useEffect(() => {
    const data = StorageService.getFeedback();
    setFeedbackList(data);
    setEdgeInfo(StorageService.getEdgeDevice());
    setConfig(StorageService.getEscalationConfig());

    // Validate active session with backend SQLite
    ApiService.getMe()
      .then(res => {
        if (res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        // Fall back to stored session if server is offline
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    // Refresh feedback in case new data arrived
    setFeedbackList(StorageService.getFeedback());
  };

  // Handlers for Data Updates
  const handleResetDemoData = () => {
    const defaultData = StorageService.resetToDemoData();
    setFeedbackList([...defaultData]);
    setEdgeInfo(StorageService.getEdgeDevice());
    setSelectedFeedbackItem(null);
  };

  const handleSubmitFeedback = (params: {
    text: string;
    department?: string;
    selectedCategory?: FeedbackCategory;
    submissionType: any;
    isAnonymous: boolean;
    studentRefId?: string;
  }) => {
    const newItem = StorageService.submitFeedback(params);
    const updated = StorageService.getFeedback();
    setFeedbackList([...updated]);
    setEdgeInfo(StorageService.getEdgeDevice());
    return newItem;
  };

  const handleConfirmReview = (id: string) => {
    const updated = StorageService.updateFeedbackReview(id, {
      confirmed: true,
      reviewerName: 'Admin Registrar (Academic Governance)'
    });
    if (updated) {
      setFeedbackList([...StorageService.getFeedback()]);
      setSelectedFeedbackItem(updated);
    }
  };

  const handleApplyCorrections = (
    id: string,
    corrections: {
      category?: FeedbackCategory;
      sentiment?: SentimentType;
      priority?: PriorityLevel;
      notes?: string;
    }
  ) => {
    const updated = StorageService.updateFeedbackReview(id, {
      confirmed: false,
      reviewerName: 'Admin Registrar (Academic Governance)',
      correctedCategory: corrections.category,
      correctedSentiment: corrections.sentiment,
      correctedPriority: corrections.priority,
      notes: corrections.notes
    });
    if (updated) {
      setFeedbackList([...StorageService.getFeedback()]);
      setSelectedFeedbackItem(updated);
    }
  };

  const handleUpdateStatus = (id: string, status: FeedbackStatus, note: string) => {
    const updated = StorageService.updateFeedbackStatus(
      id,
      status,
      'Admin Registrar',
      note
    );
    if (updated) {
      setFeedbackList([...StorageService.getFeedback()]);
      setSelectedFeedbackItem(updated);
    }
  };

  const handleUpdateTeam = (id: string, team: string) => {
    const updated = StorageService.updateAssignedTeam(id, team, 'Admin Registrar');
    if (updated) {
      setFeedbackList([...StorageService.getFeedback()]);
      setSelectedFeedbackItem(updated);
    }
  };

  const handleAddNote = (id: string, noteText: string) => {
    const updated = StorageService.addInternalNote(
      id,
      'S. Verma',
      'Operations Officer',
      noteText
    );
    if (updated) {
      setFeedbackList([...StorageService.getFeedback()]);
      setSelectedFeedbackItem(updated);
    }
  };

  const handleSaveConfig = (newConfig: EscalationConfig) => {
    StorageService.saveEscalationConfig(newConfig);
    setConfig(newConfig);
  };

  const handleUpdateEdgeInfo = (newInfo: EdgeDeviceInfo) => {
    StorageService.saveEdgeDevice(newInfo);
    setEdgeInfo(newInfo);
  };

  const handleExportCSV = () => {
    StorageService.exportToCSV(feedbackList);
  };

  const handleExportEvaluation = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(EVALUATION_DATA, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `SFIS_Model_Evaluation_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterExplorerByCategory = (cat: FeedbackCategory) => {
    setCurrentPage('explorer');
  };

  // Critical item count for sidebar / alerts
  const criticalItems = feedbackList.filter(
    f => (f.humanReview?.correctedPriority || f.analysis.priority) === 'Critical' && f.status !== 'Resolved'
  );
  const unresolvedCount = feedbackList.filter(f => f.status !== 'Resolved').length;

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F8FA] text-[#244A73]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#244A73] border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-semibold tracking-wide text-[#697386]">Loading SFIS Institutional Workspace...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  // Student Portal Route
  if (currentUser.role === 'student') {
    return (
      <StudentPortalPage
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Faculty Portal Route
  if (currentUser.role === 'faculty') {
    return (
      <FacultyPortalPage
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Admin Portal Route (Institutional Operations & Edge AI Dashboard)
  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden text-[#20242B] font-sans antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        criticalCount={criticalItems.length}
        unresolvedCount={unresolvedCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          searchTerm={globalSearchTerm}
          onSearchChange={setGlobalSearchTerm}
          onResetDemoData={handleResetDemoData}
          onSelectFeedback={setSelectedFeedbackItem}
          criticalItems={criticalItems}
          allFeedback={feedbackList}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F7F8FA]">
          {currentPage === 'overview' && (
            <OverviewPage
              feedbackList={feedbackList}
              onSelectFeedback={setSelectedFeedbackItem}
              onNavigate={pageId => setCurrentPage(pageId as NavPageId)}
            />
          )}

          {currentPage === 'submit' && (
            <SubmitFeedbackPage
              departments={config.departments}
              onSubmitFeedback={handleSubmitFeedback}
              onViewItem={item => {
                setSelectedFeedbackItem(item);
                setCurrentPage('explorer');
              }}
            />
          )}

          {currentPage === 'explorer' && (
            <FeedbackExplorerPage
              feedbackList={feedbackList}
              onSelectFeedback={setSelectedFeedbackItem}
              onExportCSV={handleExportCSV}
              departments={config.departments}
              assignedTeams={config.assignedTeams}
            />
          )}

          {currentPage === 'analysis' && (
            <AiAnalysisPage
              feedbackList={feedbackList}
              onSelectFeedback={setSelectedFeedbackItem}
            />
          )}

          {currentPage === 'priority' && (
            <PriorityEscalationsPage
              feedbackList={feedbackList}
              onSelectFeedback={setSelectedFeedbackItem}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsReportsPage
              feedbackList={feedbackList}
              departments={config.departments}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentPage === 'categories' && (
            <CategoryInsightsPage
              feedbackList={feedbackList}
              onSelectFeedback={setSelectedFeedbackItem}
              onFilterExplorerByCategory={handleFilterExplorerByCategory}
            />
          )}

          {currentPage === 'edge-monitor' && (
            <EdgeMonitorPage
              edgeInfo={edgeInfo}
              onUpdateEdgeInfo={handleUpdateEdgeInfo}
              recentFeedback={feedbackList}
            />
          )}

          {currentPage === 'model-eval' && (
            <ModelEvaluationPage
              onExportEvaluation={handleExportEvaluation}
            />
          )}

          {currentPage === 'user-mgmt' && (
            <UserManagementPage />
          )}

          {currentPage === 'audit-logs' && (
            <AuditLogsPage />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              config={config}
              onSaveConfig={handleSaveConfig}
              edgeInfo={edgeInfo}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Slide-out Feedback Detail Drawer */}
      {selectedFeedbackItem && (
        <FeedbackDetailDrawer
          item={selectedFeedbackItem}
          onClose={() => setSelectedFeedbackItem(null)}
          onConfirmReview={handleConfirmReview}
          onApplyCorrections={handleApplyCorrections}
          onUpdateStatus={handleUpdateStatus}
          onUpdateTeam={handleUpdateTeam}
          onAddNote={handleAddNote}
          availableTeams={config.assignedTeams}
        />
      )}
    </div>
  );
};

export default App;
