import React, { useState } from 'react';
import { Site } from '../../types/site';
import { normalizeUrl } from '../../lib/urlHelper';

interface StudentSiteCardProps {
  site: Site;
  onLockedClick: (siteName: string) => void;
}

export const StudentSiteCard: React.FC<StudentSiteCardProps> = ({
  site,
  onLockedClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const isLocked = site.status === 'locked';
  const targetUrl = normalizeUrl(site.url);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      onLockedClick(site.name);
      return;
    }

    if (!targetUrl) {
      e.preventDefault();
      alert('올바른 웹사이트 주소가 등록되지 않았습니다.');
    }
  };

  const hasValidImage = site.image_type === 'image' && site.image_url && !imageError;

  return (
    <a
      href={isLocked ? '#locked' : targetUrl}
      target={isLocked ? undefined : '_blank'}
      rel={isLocked ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      aria-label={`${site.name} 사이트로 이동${isLocked ? ' (잠김)' : ''}`}
      className={`group relative flex flex-col bg-white rounded-2xl p-2 sm:p-3 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all duration-200 cursor-pointer active:scale-95 select-none no-underline ${
        isLocked ? 'opacity-85 hover:opacity-100 bg-amber-50/40' : ''
      }`}
    >
      {/* 1:1 Square Media Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center mb-1.5 sm:mb-2.5 pointer-events-none">
        {isLocked ? (
          // Locked State: Display 🔒
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-100/70 text-amber-600 transition-transform group-hover:scale-105">
            <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-sm select-none" role="img" aria-label="잠김">
              🔒
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 mt-0.5 sm:mt-1 bg-amber-200/70 px-1.5 sm:px-2 py-0.5 rounded-full">
              잠김
            </span>
          </div>
        ) : hasValidImage ? (
          // Image State: 100% full fill, center crop
          <img
            src={site.image_url!}
            alt={site.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // Emoji State: Neat and clean centered emoji
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/90 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors">
            <span className="text-3xl sm:text-4xl md:text-5xl select-none transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" role="img" aria-label={site.name}>
              {site.emoji || '🌐'}
            </span>
          </div>
        )}
      </div>

      {/* Site Name Label */}
      <div className="w-full text-center px-0.5 sm:px-1 pointer-events-none">
        <span className="block text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors leading-tight">
          {site.name}
        </span>
      </div>
    </a>
  );
};
