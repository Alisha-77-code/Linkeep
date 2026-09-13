import React from 'react';
import { Plus, RotateCw, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onOpenAddModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onGoToStudent: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  onGoToStudent,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md py-4 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                LINKEEP 관리자
              </h1>
              <span className="text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                교사용 대시보드
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              수업 사이트를 등록, 수정, 삭제하고 공개/잠금 상태를 관리하세요.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* New Site Registration Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-sm shadow-blue-600/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 수업 사이트 등록</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all disabled:opacity-50"
            title="목록 새로고침"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden md:inline">새로고침</span>
          </button>

          {/* Back to Student View */}
          <button
            type="button"
            onClick={onGoToStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all"
            title="학생 화면으로 이동"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>학생 화면</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="관리자 로그아웃"
            aria-label="관리자 로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
