import React from 'react';
import { SiteCategory } from '../../types/site';
import { CATEGORIES, CATEGORY_COLORS } from '../../constants/categories';

interface CategoryFilterProps {
  selectedCategory: SiteCategory;
  onSelectCategory: (category: SiteCategory) => void;
  counts?: Record<SiteCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS['기타'];
        const count = counts ? counts[cat] : undefined;

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold border transition-all duration-200 active:scale-95 select-none ${
              isSelected
                ? color.activeBg
                : `${color.bg} ${color.text} ${color.border} hover:opacity-90`
            }`}
          >
            <span>{cat}</span>
            {count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-white/70 text-slate-700'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
