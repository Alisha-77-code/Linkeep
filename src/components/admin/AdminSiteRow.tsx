import React from 'react';
import { Site } from '../../types/site';
import { CATEGORY_COLORS } from '../../constants/categories';
import { ExternalLink, Edit2, Trash2, FileText } from 'lucide-react';

interface AdminSiteRowProps {
  site: Site;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onQuickStatusChange: (site: Site, newStatus: Site['status']) => void;
}

export const AdminSiteRow: React.FC<AdminSiteRowProps> = ({
  site,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onQuickStatusChange,
}) => {
  const catColor = CATEGORY_COLORS[site.category] || CATEGORY_COLORS['기타'];

  return (
    <tr
      className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${
        isSelected ? 'bg-blue-50/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 pl-4 pr-2 w-10 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(site.id)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* Thumbnail */}
      <td className="py-3.5 px-3 w-16">
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          {site.image_type === 'image' && site.image_url ? (
            <img
              src={site.image_url}
              alt={site.name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <span className="text-xl select-none" role="img" aria-label={site.name}>
              {site.emoji || '🌐'}
            </span>
          )}
        </div>
      </td>

      {/* Site Name & URL */}
      <td className="py-3.5 px-3">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm">{site.name}</span>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5 max-w-xs sm:max-w-md truncate"
            title={site.url}
          >
            <span className="truncate">{site.url}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span
          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
        >
          {site.category}
        </span>
      </td>

      {/* Status & Quick Toggle */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <div className="relative inline-block">
          <select
            value={site.status}
            onChange={(e) => onQuickStatusChange(site, e.target.value as Site['status'])}
            className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none focus:ring-2 cursor-pointer transition-all ${
              site.status === 'public'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 focus:ring-emerald-400'
                : site.status === 'locked'
                ? 'bg-amber-50 text-amber-700 border-amber-300 focus:ring-amber-400'
                : 'bg-slate-200 text-slate-700 border-slate-300 focus:ring-slate-400'
            }`}
          >
            <option value="public">공개</option>
            <option value="locked">잠금 🔒</option>
            <option value="hidden">숨김 👁️‍🗨️</option>
          </select>
        </div>
      </td>

      {/* Teacher Memo (Admin only) */}
      <td className="py-3.5 px-3">
        {site.memo ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 max-w-xs truncate" title={site.memo}>
            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{site.memo}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">-</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(site)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="수정"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(site)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
