import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, Clipboard } from 'lucide-react';
import { uploadSiteImage } from '../../services/storageService';

interface ImageUploaderProps {
  currentImageUrl: string | null;
  currentEmoji: string;
  onImageChange: (imageUrl: string | null, imageType: 'image' | 'emoji') => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  currentEmoji,
  onImageChange,
  onShowToast,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  // Handle Clipboard Paste (Ctrl + V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            await processAndUploadImage(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processAndUploadImage = async (file: File | Blob) => {
    setIsUploading(true);
    try {
      // Local instant preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const uploadedUrl = await uploadSiteImage(file);
      setPreviewUrl(uploadedUrl);
      onImageChange(uploadedUrl, 'image');
      onShowToast?.('대표 이미지가 적용되었습니다.', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      onShowToast?.('이미지 업로드에 실패했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndUploadImage(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processAndUploadImage(file);
    }
  };

  const handleRevertToEmoji = () => {
    setPreviewUrl(null);
    onImageChange(null, 'emoji');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onShowToast?.('기본 이모지로 변경되었습니다.', 'info');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          대표 이미지 / 이모지
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRevertToEmoji}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>기본 이모지로 변경</span>
          </button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {/* Preview Square Container */}
        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 relative flex items-center justify-center shadow-inner group">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-2 text-center text-blue-600">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-[10px] font-bold">업로드 중</span>
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="대표 이미지 미리보기"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-indigo-50/50 text-slate-700">
              <span className="text-4xl select-none" role="img" aria-label="기본 이모지">
                {currentEmoji || '🌐'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-1">
                기본 이모지
              </span>
            </div>
          )}
        </div>

        {/* Upload Drop Zone / Paste Helper */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
              : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-300'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <UploadCloud className="w-6 h-6 text-blue-500 mb-1" />
          <p className="text-xs font-bold text-slate-700">
            클릭하여 이미지 업로드 또는 드래그
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span>화면 캡처 후 <kbd className="px-1 py-0.5 bg-slate-200 text-slate-700 rounded font-mono text-[10px]">Ctrl+V</kbd> 붙여넣기 가능</span>
          </div>
        </div>
      </div>
    </div>
  );
};
