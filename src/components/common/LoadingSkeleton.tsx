import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100 shadow-card animate-pulse"
        >
          <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3" />
          <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
        </div>
      ))}
    </div>
  );
};
