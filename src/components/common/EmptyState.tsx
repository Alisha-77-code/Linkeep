import React from 'react';
import { SearchX, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'category' | 'empty';
  searchQuery?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  searchQuery,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        {type === 'search' ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <FolderOpen className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-700 mb-1">
        {type === 'search'
          ? `"${searchQuery}" 검색 결과가 없습니다`
          : '등록된 수업 사이트가 없습니다'}
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mb-6">
        {type === 'search'
          ? '검색어의 철자가 맞는지 확인하거나 다른 단어로 검색해 보세요.'
          : '카테고리를 변경하거나 관리자 페이지에서 새 수업 사이트를 등록해 보세요.'}
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors active:scale-95"
        >
          전체 사이트 보기
        </button>
      )}
    </div>
  );
};
