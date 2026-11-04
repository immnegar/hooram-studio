import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2, Film, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  acceptType?: 'image' | 'video' | 'all';
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  acceptType = 'all',
  helperText = 'تصویر (JPG, PNG, WebP) یا ویدیو (MP4) تا سقف ۱۰۰ مگابایت'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    if (acceptType === 'image') return 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';
    if (acceptType === 'video') return 'video/mp4,video/webm,video/quicktime';
    return 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime';
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setError(null);
    setIsUploading(true);

    try {
      const res = await api.uploadMedia(file);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری فایل');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isVideo = (url?: string) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-300">
        {label}
      </label>

      {/* Upload Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-800 hover:border-slate-700 bg-studio-950/60'
        } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-xs text-slate-300 font-medium">در حال آپلود و ذخیره فایل بر روی سرور...</span>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center justify-center gap-3">
            {isVideo(value) ? (
              <div className="relative rounded-xl overflow-hidden max-h-36 border border-slate-700 bg-black">
                <video src={value} className="max-h-36 object-contain" controls />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden max-h-36 border border-slate-700 bg-studio-900">
                <img src={value} alt="Preview" className="max-h-36 object-contain" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                فایل با موفقیت آپلود شد
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 p-1 bg-rose-500/10 rounded-lg flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                حذف / تغییر
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-1">
              {acceptType === 'video' ? <Film className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
            </div>
            <p className="text-xs text-slate-300 font-medium">
              فایل را اینجا بکشید یا <span className="text-indigo-400 underline">انتخاب کنید</span>
            </p>
            <span className="text-[10px] text-slate-500">{helperText}</span>
          </div>
        )}
      </div>

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          dir="ltr"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="یا آدرس اینترنتی (URL) فایل را مستقیماً وارد کنید..."
          className="w-full bg-studio-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-left"
        />
      </div>

      {error && (
        <div className="text-xs text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

