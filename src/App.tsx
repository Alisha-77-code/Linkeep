import { useState } from 'react';
import { useSites } from './hooks/useSites';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { StudentPage } from './components/student/StudentPage';
import { AdminPage } from './components/admin/AdminPage';
import { PinAuthModal } from './components/admin/PinAuthModal';
import { Toast } from './components/common/Toast';

export function App() {
  const [viewMode, setViewMode] = useState<'student' | 'admin'>('student');
  const { toasts, addToast, removeToast } = useToast();
  const {
    isAdminAuthenticated,
    isPinModalOpen,
    openPinModal,
    closePinModal,
    loginWithPin,
    logout,
  } = useAuth();

  // Unified Site Hook
  const {
    filteredSites,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    refresh,
    addSite,
    updateSite,
    deleteSite,
    bulkDeleteSites,
  } = useSites({ isAdmin: viewMode === 'admin' });

  // Handle open admin button click from student page
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      openPinModal();
    }
  };

  // Handle PIN verification
  const handlePinSuccess = (pin: string): boolean => {
    const success = loginWithPin(pin);
    if (success) {
      setViewMode('admin');
      addToast('관리자로 로그인되었습니다.', 'success');
      return true;
    }
    return false;
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    setViewMode('student');
    addToast('로그아웃되었습니다.', 'info');
  };

  // Return to student page
  const handleGoToStudent = () => {
    setViewMode('student');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {viewMode === 'student' ? (
        <StudentPage
          sites={filteredSites}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onRefresh={refresh}
          onOpenAdmin={handleOpenAdmin}
          onShowToast={addToast}
        />
      ) : (
        <AdminPage
          sites={filteredSites}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onRefresh={refresh}
          onGoToStudent={handleGoToStudent}
          onLogout={handleLogout}
          onAddSite={addSite}
          onUpdateSite={updateSite}
          onDeleteSite={deleteSite}
          onBulkDeleteSites={bulkDeleteSites}
          onShowToast={addToast}
        />
      )}

      {/* Admin PIN Authentication Modal */}
      <PinAuthModal
        isOpen={isPinModalOpen}
        onClose={closePinModal}
        onSuccess={handlePinSuccess}
      />

      {/* Global Toast System */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
