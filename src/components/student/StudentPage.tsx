import React, { useState, useMemo } from 'react';
import { Site, SiteCategory } from '../../types/site';
import { StudentHeader } from './StudentHeader';
import { StudentSiteGrid } from './StudentSiteGrid';
import { Pagination } from '../common/Pagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

const ITEMS_PER_PAGE = 25; // 5x5 Grid

interface StudentPageProps {
  sites: Site[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: SiteCategory;
  onCategorySelect: (category: SiteCategory) => void;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  onShowToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const StudentPage: React.FC<StudentPageProps> = ({
  sites,
  isLoading,
  isRefreshing,
  error,
  search,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  onRefresh,
  onOpenAdmin,
  onShowToast,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page to 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Calculate category counts based on visible (public + locked) sites
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

    sites.forEach((site) => {
      if (counts[site.category] !== undefined) {
        counts[site.category]++;
      }
    });

    return counts;
  }, [sites]);

  // Total pages calculation
  const totalPages = Math.ceil(sites.length / ITEMS_PER_PAGE);

  // Paginated sites for current page (max 25)
  const paginatedSites = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sites.slice(start, start + ITEMS_PER_PAGE);
  }, [sites, currentPage]);

  const handleLockedClick = (siteName: string) => {
    onShowToast(`「${siteName}」은(는) 현재 잠긴 수업 사이트입니다.`, 'warning');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation & Filters */}
      <StudentHeader
        search={search}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        onOpenAdmin={onOpenAdmin}
        categoryCounts={categoryCounts}
      />

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={onRefresh}
              className="font-bold underline ml-3 hover:text-rose-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton count={15} />
        ) : sites.length === 0 ? (
          <EmptyState
            type={search ? 'search' : 'empty'}
            searchQuery={search}
            onReset={() => {
              onSearchChange('');
              onCategorySelect('전체');
            }}
          />
        ) : (
          <>
            <StudentSiteGrid
              sites={paginatedSites}
              onLockedClick={handleLockedClick}
            />

            {/* Pagination: Only shown when sites > 25 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-auto">
        <p>© LINKEEP - 우리 반 수업 사이트 모음</p>
      </footer>
    </div>
  );
};
