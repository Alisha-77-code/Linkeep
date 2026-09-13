import React, { useMemo } from 'react';
import { Site } from '../../types/site';
import { AdminSiteRow } from './AdminSiteRow';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

const ADMIN_ITEMS_PER_PAGE = 10; // Requirement: exactly 10 per page in admin list

interface AdminSiteListProps {
  sites: Site[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectCurrentPage: (ids: string[]) => void;
  onDeselectCurrentPage: (ids: string[]) => void;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onBulkDelete: () => void;
  onQuickStatusChange: (site: Site, newStatus: Site['status']) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
}

export const AdminSiteList: React.FC<AdminSiteListProps> = ({
  sites,
  selectedIds,
  onToggleSelect,
  onSelectCurrentPage,
  onDeselectCurrentPage,
  onEdit,
  onDelete,
  onBulkDelete,
  onQuickStatusChange,
  currentPage,
  onPageChange,
  searchQuery,
}) => {
  const totalPages = Math.ceil(sites.length / ADMIN_ITEMS_PER_PAGE);

  // Paginated items for the current page (max 10)
  const paginatedSites = useMemo(() => {
    const start = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE;
    return sites.slice(start, start + ADMIN_ITEMS_PER_PAGE);
  }, [sites, currentPage]);

  const currentPageIds = useMemo(() => paginatedSites.map((s) => s.id), [paginatedSites]);

  // Check if all items on the current page are selected
  const isCurrentPageAllSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));

  // Count of selected items on current page
  const currentPageSelectedCount = currentPageIds.filter((id) => selectedIds.has(id)).length;

  if (sites.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <EmptyState
          type={searchQuery ? 'search' : 'empty'}
          searchQuery={searchQuery}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Batch Actions Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/70 text-xs">
        <div className="flex items-center gap-2">
          {/* Select / Deselect All on Current Page */}
          <button
            type="button"
            onClick={() => {
              if (isCurrentPageAllSelected) {
                onDeselectCurrentPage(currentPageIds);
              } else {
                onSelectCurrentPage(currentPageIds);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs"
          >
            {isCurrentPageAllSelected ? (
              <>
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>현재 페이지 선택 해제</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-slate-400" />
                <span>현재 페이지 모두 선택</span>
              </>
            )}
          </button>

          {currentPageSelectedCount > 0 && (
            <span className="text-slate-500 font-medium">
              (현재 페이지 {currentPageSelectedCount}/{currentPageIds.length}개 선택됨)
            </span>
          )}
        </div>

        {/* Selected count & Bulk Delete button */}
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>선택 삭제 ({selectedIds.size}개)</span>
            </button>
          )}
          <span className="text-slate-400 font-medium">
            전체 {sites.length}개 사이트 중 {paginatedSites.length}개 표시
          </span>
        </div>
      </div>

      {/* Table Container (Responsive overflow) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 pl-4 pr-2 w-10 text-center">선택</th>
              <th className="py-3 px-3 w-16">이미지</th>
              <th className="py-3 px-3">사이트 정보</th>
              <th className="py-3 px-3">카테고리</th>
              <th className="py-3 px-3">공개 상태</th>
              <th className="py-3 px-3">관리자 메모</th>
              <th className="py-3 pl-3 pr-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedSites.map((site) => (
              <AdminSiteRow
                key={site.id}
                site={site}
                isSelected={selectedIds.has(site.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onQuickStatusChange={onQuickStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer: Max 10 items per page */}
      <div className="px-4 py-2 border-t border-slate-100">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
