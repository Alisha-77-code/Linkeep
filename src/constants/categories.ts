import { SiteCategory } from '../types/site';

export const CATEGORIES: SiteCategory[] = [
  '전체',
  '오늘의 수업',
  '국어',
  '수학',
  '사회',
  '과학',
  '기타',
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  '전체': {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    activeBg: 'bg-slate-800 text-white border-slate-800',
  },
  '오늘의 수업': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    activeBg: 'bg-amber-500 text-white border-amber-500 shadow-amber-200 shadow-md',
  },
  '국어': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    activeBg: 'bg-rose-500 text-white border-rose-500 shadow-rose-200 shadow-md',
  },
  '수학': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    activeBg: 'bg-blue-600 text-white border-blue-600 shadow-blue-200 shadow-md',
  },
  '사회': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    activeBg: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200 shadow-md',
  },
  '과학': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-300',
    activeBg: 'bg-purple-600 text-white border-purple-600 shadow-purple-200 shadow-md',
  },
  '기타': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    activeBg: 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 shadow-md',
  },
};
