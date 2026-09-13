import React, { useState, useMemo } from 'react';
import { Site, SiteCategory, SiteInput } from '../../types/site';
import { AdminHeader } from './AdminHeader';
import { AdminSiteList } from './AdminSiteList';
import { SiteFormModal } from './SiteFormModal';
import { SearchBar } from '../common/SearchBar';
import { CategoryFilter } from '../common/CategoryFilter';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AdminPageProps {
  sites: Site[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: SiteCategory;
  onCategorySelect: (category: SiteCategory) => void;
  onRefresh: () => void;
  onGoToStudent: () => void;
  onLogout: () => void;
  onAddSite: (site: SiteInput) => Promise<Site>;
  onUpdateSite: (id: string, site: Partial<SiteInput>) => Promise<Site>;
  onDeleteSite: (id: string, imageUrl?: string | null) => Promise<void>;
  onBulkDeleteSites: (items: { id: string; imageUrl?: string | null }[]) => Promise<void>;
  onShowToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  sites,
  isLoading: _,
  isRefreshing,
  error,
  search,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  onRefresh,
  onGoToStudent,
  onLogout,
  onAddSite,
  onUpdateSite,
  onDeleteSite,
  onBulkDeleteSites,
  onShowToast,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  // Single Delete Confirmation State
  const [deletingSite, setDeletingSite] = useState<Site | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState<boolean>(false);

  // Bulk Delete Confirmation State
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState<boolean>(false);

  // Reset page to 1 when search or category filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<SiteCategory, number> = {
      '전체': sites.length,
      '오늘의 수업': 0,
      '국어': 0,
      '수학': 0,
      '사회': 0,
      '과학': 0,
      '기타': 0,
    };
    sites.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [sites]);

  // Toggle selection for a single row
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Rule 33: "모두 선택"은 전체 데이터가 아닌 현재 페이지의 항목만 선택!
  const handleSelectCurrentPage = (ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  // Rule 34: "선택 해제"는 현재 페이지의 항목만 해제!
  const handleDeselectCurrentPage = (ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  // Open Form for Add
  const handleOpenAddModal = () => {
    setEditingSite(null);
    setIsFormModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditModal = (site: Site) => {
    setEditingSite(site);
    setIsFormModalOpen(true);
  };

  // Submit Form (Add or Edit)
  const handleFormSubmit = async (siteData: SiteInput) => {
    if (editingSite) {
      await onUpdateSite(editingSite.id, siteData);
      onShowToast('사이트가 수정되었습니다.', 'success');
    } else {
      await onAddSite(siteData);
      onShowToast('새 수업 사이트가 등록되었습니다.', 'success');
    }
  };

  // Quick Status Change (from dropdown)
  const handleQuickStatusChange = async (site: Site, newStatus: Site['status']) => {
    try {
      await onUpdateSite(site.id, { status: newStatus });
      const statusLabel = newStatus === 'public' ? '공개' : newStatus === 'locked' ? '잠금' : '숨김';
      onShowToast(`「${site.name}」 상태가 [${statusLabel}]으로 변경되었습니다.`, 'success');
    } catch (err: any) {
      onShowToast(err?.message || '상태 변경에 실패했습니다.', 'error');
    }
  };

  // Confirm Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!deletingSite) return;
    setIsDeletingSingle(true);
    try {
      await onDeleteSite(deletingSite.id, deletingSite.image_url);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingSite.id);
        return next;
      });

      const remainingCount = Math.max(0, sites.length - 1);
      const maxPages = Math.max(1, Math.ceil(remainingCount / 10));
      if (currentPage > maxPages) {
        setCurrentPage(maxPages);
      }

      onShowToast('사이트가 삭제되었습니다.', 'success');
      setDeletingSite(null);
    } catch (err: any) {
      onShowToast(err?.message || '삭제에 실패했습니다.', 'error');
    } finally {
      setIsDeletingSingle(false);
    }
  };

  // Confirm Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeletingBulk(true);
    try {
      const itemsToDelete = sites
        .filter((s) => selectedIds.has(s.id))
        .map((s) => ({ id: s.id, imageUrl: s.image_url }));

      await onBulkDeleteSites(itemsToDelete);
      setSelectedIds(new Set());
      setIsBulkDeleteModalOpen(false);

      const remainingCount = Math.max(0, sites.length - itemsToDelete.length);
      const maxPages = Math.max(1, Math.ceil(remainingCount / 10));
      if (currentPage > maxPages) {
        setCurrentPage(maxPages);
      }

      onShowToast('선택한 사이트가 삭제되었습니다.', 'success');
    } catch (err: any) {
      onShowToast(err?.message || '일괄 삭제에 실패했습니다.', 'error');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9]">
      {/* Top Header */}
      <AdminHeader
        onOpenAddModal={handleOpenAddModal}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        onGoToStudent={onGoToStudent}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={onRefresh}
              className="font-bold underline ml-3 hover:text-rose-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="관리할 사이트 이름을 검색하세요..."
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={onCategorySelect}
              counts={categoryCounts}
            />
          </div>
        </div>

        {/* Site Management List / Table */}
        <AdminSiteList
          sites={sites}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectCurrentPage={handleSelectCurrentPage}
          onDeselectCurrentPage={handleDeselectCurrentPage}
          onEdit={handleOpenEditModal}
          onDelete={(site) => setDeletingSite(site)}
          onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
          onQuickStatusChange={handleQuickStatusChange}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          searchQuery={search}
        />
      </main>

      {/* Site Registration / Edit Modal */}
      <SiteFormModal
        isOpen={isFormModalOpen}
        initialSite={editingSite}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSite(null);
        }}
        onSubmit={handleFormSubmit}
        onShowToast={onShowToast}
      />

      {/* Single Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingSite)}
        title="사이트 삭제 확인"
        message={`「${deletingSite?.name}」 사이트를 정말 삭제하시겠습니까?\n삭제된 정보는 복구할 수 없습니다.`}
        confirmText="삭제하기"
        cancelText="취소"
        isDanger={true}
        isLoading={isDeletingSingle}
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setDeletingSite(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        title="선택 사이트 일괄 삭제"
        message={`선택한 ${selectedIds.size}개의 사이트를 정말 삭제하시겠습니까?\n삭제된 사이트들은 목록에서 영구히 제거됩니다.`}
        confirmText="선택한 사이트 모두 삭제"
        cancelText="취소"
        isDanger={true}
        isLoading={isDeletingBulk}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-slate-200 mt-auto">
        <p>LINKEEP 관리자 시스템 | 교사용 수업 사이트 통합 제어</p>
      </footer>
    </div>
  );
};
