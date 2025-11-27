
import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  t: any;
  theme: 'dark' | 'light';
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isProcessing, t, theme }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t.alertType);
      return;
    }
    onFileSelect(file);
  };

  return (
    <div
      className={`group relative w-full h-60 rounded-[16px] border-2 border-dashed transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer overflow-hidden backdrop-blur-md
        ${isDragging 
          ? 'border-indigo-500/70 bg-indigo-500/10 scale-[1.02] shadow-[0_0_30px_rgba(79,70,229,0.2)]' 
          : (theme === 'dark' 
              ? 'border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-white/[0.04]' 
              : 'border-slate-200 bg-slate-50/50 hover:border-indigo-500/40 hover:bg-white')
        }
        ${!isDragging && 'hover:scale-[1.01] hover:shadow-xl'}
        ${isProcessing ? 'pointer-events-none opacity-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept="image/*"
      />
      
      {/* Animated Grid Background (Subtle) */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${theme === 'dark' ? '#8080800a' : '#00000005'}_1px,transparent_1px),linear-gradient(to_bottom,${theme === 'dark' ? '#8080800a' : '#00000005'}_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`}></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
        <div className={`
          relative mb-4 p-3.5 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDragging 
              ? 'bg-indigo-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.5)] scale-110 rotate-3' 
              : (theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 group-hover:text-indigo-400 group-hover:bg-white/10' 
                  : 'bg-white shadow-sm border border-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:shadow-md')
          }
          ${!isDragging && 'group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]'}
        `}>
          {isDragging ? (
            <UploadCloud className="w-8 h-8 animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8" />
          )}
        </div>

        <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 drop-shadow-sm ${isDragging ? 'text-indigo-500' : (theme === 'dark' ? 'text-white' : 'text-slate-800')}`}>
          {isDragging ? t.uploadRelease : t.uploadClick}
        </h3>
        
        <p className={`text-xs mb-4 max-w-xs leading-relaxed transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-500 group-hover:text-slate-600'}`}>
          {t.uploadSupport}
        </p>

        <div className={`flex items-center space-x-2 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ${
          theme === 'dark' 
            ? 'text-indigo-300/90 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20' 
            : 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100'
        }`}>
          <span>{t.hdOutput}</span>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
