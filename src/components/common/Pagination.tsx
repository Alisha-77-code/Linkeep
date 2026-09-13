import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Requirement: If totalPages <= 1, don't show pagination UI
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1.5 my-8" aria-label="페이지 이동">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">이전</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        aria-label="다음 페이지"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
