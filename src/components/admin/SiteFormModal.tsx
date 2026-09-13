import React, { useState, useEffect } from 'react';
import { Site, SiteCategory, SiteInput, SiteStatus } from '../../types/site';
import { CATEGORIES } from '../../constants/categories';
import { suggestEmoji, POPULAR_EMOJIS } from '../../lib/emojiHelper';
import { isValidUrl, normalizeUrl } from '../../lib/urlHelper';
import { ImageUploader } from './ImageUploader';
import { X, Check, Globe, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';

interface SiteFormModalProps {
  isOpen: boolean;
  initialSite?: Site | null;
  onClose: () => void;
  onSubmit: (siteData: SiteInput) => Promise<void>;
  onShowToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

const AVAILABLE_CATEGORIES = CATEGORIES.filter((c) => c !== '전체') as Exclude<SiteCategory, '전체'>[];

export const SiteFormModal: React.FC<SiteFormModalProps> = ({
  isOpen,
  initialSite,
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const isEdit = Boolean(initialSite);

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Exclude<SiteCategory, '전체'>>('오늘의 수업');
  const [status, setStatus] = useState<SiteStatus>('public');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'image' | 'emoji'>('emoji');
  const [emoji, setEmoji] = useState('🌐');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Reset or populate fields when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialSite) {
        setName(initialSite.name);
        setUrl(initialSite.url);
        setCategory(initialSite.category);
        setStatus(initialSite.status);
        setImageUrl(initialSite.image_url);
        setImageType(initialSite.image_type);
        setEmoji(initialSite.emoji || '🌐');
        setMemo(initialSite.memo || '');
      } else {
        setName('');
        setUrl('');
        setCategory('오늘의 수업');
        setStatus('public');
        setImageUrl(null);
        setImageType('emoji');
        setEmoji('⭐');
        setMemo('');
      }
      setUrlError('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialSite]);

  // Handle site name change & auto emoji suggestion for new sites
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && imageType === 'emoji') {
      const suggested = suggestEmoji(val, url, category);
      setEmoji(suggested);
    }
  };

  // Handle category change & auto emoji suggestion
  const handleCategoryChange = (cat: Exclude<SiteCategory, '전체'>) => {
    setCategory(cat);
    if (!isEdit && imageType === 'emoji') {
      const suggested = suggestEmoji(name, url, cat);
      setEmoji(suggested);
    }
  };

  const handleUrlBlur = () => {
    if (url.trim()) {
      const normalized = normalizeUrl(url);
      setUrl(normalized);
      if (!isValidUrl(normalized)) {
        setUrlError('올바른 웹사이트 주소 형식(예: https://example.com)을 입력해주세요.');
      } else {
        setUrlError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedUrl = normalizeUrl(url);
    if (!name.trim()) {
      onShowToast('사이트 이름을 입력해주세요.', 'error');
      return;
    }
    if (!normalizedUrl || !isValidUrl(normalizedUrl)) {
      setUrlError('올바른 웹사이트 주소를 입력해주세요.');
      onShowToast('올바른 웹사이트 주소를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const siteData: SiteInput = {
        name: name.trim(),
        url: normalizedUrl,
        category,
        status,
        image_url: imageUrl,
        image_type: imageType,
        emoji: emoji || '🌐',
        memo: memo.trim(),
        sort_order: initialSite?.sort_order ?? 0,
      };

      await onSubmit(siteData);
      onClose();
    } catch (err: any) {
      console.error(err);
      onShowToast(err?.message || '저장에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(name.trim() && url.trim() && category && !urlError);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 scale-100 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {isEdit ? '✏️' : '➕'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {isEdit ? '수업 사이트 수정' : '새 수업 사이트 등록'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Site Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              사이트 이름 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="예: 디지털교과서, 똑똑! 수학탐험대"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Site URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              사이트 주소 (URL) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError('');
                }}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  urlError
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {urlError && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{urlError}</p>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              카테고리 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              공개 상태
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('public')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  status === 'public'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>공개</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('locked')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  status === 'locked'
                    ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>잠금</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('hidden')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  status === 'hidden'
                    ? 'bg-slate-200 text-slate-800 border-slate-400 ring-2 ring-slate-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                <span>숨김</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {status === 'public' && '• 학생 화면에 정상 표시되며 클릭 시 접속됩니다.'}
              {status === 'locked' && '• 학생 화면에 자물쇠(🔒)로 표시되며 클릭해도 열리지 않습니다.'}
              {status === 'hidden' && '• 학생 화면에서 완전히 보이지 않습니다 (관리자만 확인 가능).'}
            </p>
          </div>

          {/* Representative Image Uploader (File + Ctrl+V) */}
          <ImageUploader
            currentImageUrl={imageUrl}
            currentEmoji={emoji}
            onImageChange={(url, type) => {
              setImageUrl(url);
              setImageType(type);
            }}
            onShowToast={onShowToast}
          />

          {/* Custom Emoji Picker (if no image) */}
          {imageType === 'emoji' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>기본 이모지 선택</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  현재: <b className="text-base text-slate-800">{emoji}</b>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-24 overflow-y-auto">
                {POPULAR_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                      emoji === em
                        ? 'bg-blue-600 text-white scale-110 shadow-sm'
                        : 'hover:bg-white hover:shadow-xs active:scale-95'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Private Memo (Admin only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              교사용 관리 메모 (학생에게 노출되지 않음)
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 3단원 수업용, 태블릿 권장, 로그인 필요"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEdit ? '수정 완료' : '사이트 등록'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
