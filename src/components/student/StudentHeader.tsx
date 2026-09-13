import React from 'react';
import { RotateCw, ShieldCheck } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { CategoryFilter } from '../common/CategoryFilter';
import { SiteCategory } from '../../types/site';

interface StudentHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: SiteCategory;
  onCategorySelect: (category: SiteCategory) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAdmin: () => void;
  categoryCounts?: Record<SiteCategory, number>;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  onRefresh,
  isRefreshing,
  onOpenAdmin,
  categoryCounts,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-4 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        {/* Top brand row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                  LINKEEP
                </h1>
                <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  우리 반 수업 포털
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                수업에 필요한 사이트를 클릭 한 번으로 간편하게 찾아보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-60"
              title="사이트 목록 새로고침"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? '불러오는 중...' : '새로고침'}
              </span>
            </button>

            {/* Admin Page Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 active:scale-95 transition-all shadow-sm"
              title="선생님 관리자 페이지"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>관리자</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="찾고 싶은 수업 사이트 이름을 검색하세요..."
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
      </div>
    </header>
  );
};
