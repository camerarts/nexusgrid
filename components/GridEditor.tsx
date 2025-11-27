import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Move, Download, CheckSquare, Upload, RefreshCw, Minus, Plus, Maximize, FileText, ZoomIn, X } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';

interface GridEditorProps {
  file: File;
  onCancel: () => void;
  t: any;
  theme: 'dark' | 'light';
}

type ExportFormat = 'png' | 'jpg' | 'webp';

const GridEditor: React.FC<GridEditorProps> = ({ file, onCancel, t, theme }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  // Grid Settings
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(6);
  
  // Transform Settings
  const [scaleGlobal, setScaleGlobal] = useState(1); // Overall scale (Zoom)
  const [scaleX, setScaleX] = useState(1); // Aspect Modifiers
  const [scaleY, setScaleY] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Export Settings
  const [customPrefix, setCustomPrefix] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Store the crop rectangle dimensions relative to canvas
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setImageUrl(url);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Recalculate crop rect (grid frame) when container resizing or image loaded
  // Maximized to 95% of container
  useEffect(() => {
    const updateCropRect = () => {
        if (!containerRef.current || !imageSize.width) return;
        const { width: contW, height: contH } = containerRef.current.getBoundingClientRect();
        
        const imgAspect = imageSize.width / imageSize.height;
        const contAspect = contW / contH;
        
        let w, h;
        // Use 0.95 factor to maximize usage of the preview window
        if (imgAspect > contAspect) {
            w = contW * 0.95;
            h = w / imgAspect;
        } else {
            h = contH * 0.95;
            w = h * imgAspect;
        }
        
        setCropRect({
            x: (contW - w) / 2,
            y: (contH - h) / 2,
            width: w,
            height: h
        });
    };
    
    updateCropRect();
    window.addEventListener('resize', updateCropRect);
    return () => window.removeEventListener('resize', updateCropRect);
  }, [imageSize]);

  // --- Drawing Logic ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageUrl || cropRect.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: contW, height: contH } = container.getBoundingClientRect();
    canvas.width = contW;
    canvas.height = contH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = imageUrl;
    
    // 1. Draw Background (The Image)
    const cx = cropRect.x + cropRect.width / 2 + position.x;
    const cy = cropRect.y + cropRect.height / 2 + position.y;
    
    const drawW = cropRect.width * scaleGlobal * scaleX;
    const drawH = cropRect.height * scaleGlobal * scaleY;
    
    ctx.save();
    ctx.drawImage(img, cx - drawW/2, cy - drawH/2, drawW, drawH);
    
    // 2. Draw Dimmed Overlay (Outside Grid)
    ctx.fillStyle = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
    ctx.fill('evenodd');
    
    // 3. Draw Grid Lines (Fixed)
    ctx.restore();
    ctx.strokeStyle = '#ef4444'; // Red dashed
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    
    const cellW = cropRect.width / cols;
    for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(cropRect.x + i * cellW, cropRect.y);
        ctx.lineTo(cropRect.x + i * cellW, cropRect.y + cropRect.height);
        ctx.stroke();
    }
    
    const cellH = cropRect.height / rows;
    for (let i = 1; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(cropRect.x, cropRect.y + i * cellH);
        ctx.lineTo(cropRect.x + cropRect.width, cropRect.y + i * cellH);
        ctx.stroke();
    }
    
    // Border
    ctx.setLineDash([]);
    ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);

  }, [imageUrl, cropRect, rows, cols, scaleGlobal, scaleX, scaleY, position, theme]);

  useEffect(() => {
    requestAnimationFrame(draw);
  }, [draw]);


  // --- Interaction ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(scaleGlobal + delta, 0.1), 5);
      setScaleGlobal(newScale);
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    await new Promise((resolve) => { img.onload = resolve; });

    const zip = new JSZip();
    const folder = zip.folder("grid_slices");
    
    // Construct filename using original name + user inputs
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const fileNameBase = `${customPrefix}${originalName}${customSuffix}`;

    const drawW = cropRect.width * scaleGlobal * scaleX;
    const drawH = cropRect.height * scaleGlobal * scaleY;
    
    const ratioX = img.width / drawW;
    const ratioY = img.height / drawH;
    
    const srcX = ((drawW - cropRect.width) / 2 - position.x) * ratioX;
    const srcY = ((drawH - cropRect.height) / 2 - position.y) * ratioY;
    const srcW = cropRect.width * ratioX;
    const srcH = cropRect.height * ratioY;
    
    // Slices
    const pieceW = srcW / cols;
    const pieceH = srcH / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceW; 
            canvas.height = pieceH;
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            ctx.drawImage(
                img, 
                srcX + c * pieceW, srcY + r * pieceH, // sx, sy
                pieceW, pieceH, // sw, sh
                0, 0, // dx, dy
                canvas.width, canvas.height // dw, dh
            );

            const blob = await new Promise<Blob | null>(resolve => 
                canvas.toBlob(resolve, exportFormat === 'jpg' ? 'image/jpeg' : `image/${exportFormat}`, 0.95)
            );
            
            if (blob) {
                const idx = r * cols + c + 1;
                // Use the constructed base name
                folder?.file(`${fileNameBase}_${idx}.${exportFormat}`, blob);
            }
        }
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${fileNameBase}_grid.zip`);
  };

  // Helper Components
  const NumberInput = ({ value, onChange, min = 1, max = 20 }: any) => (
    <div className={`flex items-center rounded-lg px-1 border border-transparent focus-within:border-indigo-500 transition-colors ${
        theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
    }`}>
        <button onClick={() => onChange(Math.max(min, value - 1))} className={`p-1 hover:text-indigo-500 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}><Minus className="w-3 h-3" /></button>
        <span className={`flex-1 text-center font-mono text-xs w-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className={`p-1 hover:text-indigo-500 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}><Plus className="w-3 h-3" /></button>
    </div>
  );

  const ScaleControl = ({ label, value, onChange, min=0.1, max=5 }: any) => (
    <div className="flex flex-col gap-1">
        <div className={`flex justify-between text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
            <span>{label}</span>
            <span>{Math.round(value * 100)}%</span>
        </div>
        <div className={`flex items-center gap-1 p-0.5 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
            <button onClick={() => onChange(Math.max(min, Number((value - 0.01).toFixed(2))))} className="p-1 hover:text-indigo-500"><Minus className="w-3 h-3" /></button>
            <input 
                type="range" min={min} max={max} step="0.01" value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-indigo-500 bg-gray-300 dark:bg-white/10"
            />
            <button onClick={() => onChange(Math.min(max, Number((value + 0.01).toFixed(2))))} className="p-1 hover:text-indigo-500"><Plus className="w-3 h-3" /></button>
        </div>
    </div>
  );

  // Preview filename construction
  const originalName = file.name.replace(/\.[^/.]+$/, "");
  const previewFileName = `${customPrefix}${originalName}${customSuffix}_1.${exportFormat}`;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pb-4 pt-20 lg:px-6 lg:pb-6 lg:pt-24 animate-fade-in overflow-hidden ${
        theme === 'dark' ? 'bg-[#0f172a]/95' : 'bg-[#f1f5f9]/95'
    }`}>
        
        <div className="w-full max-w-7xl h-full max-h-[90vh] flex flex-col lg:flex-row gap-4">
            
            {/* Left: Preview Area (MAXIMIZED) */}
            <div className={`flex-1 flex flex-col rounded-2xl shadow-xl overflow-hidden border ${
                theme === 'dark' ? 'bg-[#1A1F2E] border-white/10' : 'bg-white border-slate-200'
            }`}>
                {/* Toolbar */}
                <div className={`h-12 border-b px-4 flex items-center justify-between shrink-0 ${
                    theme === 'dark' ? 'border-white/5' : 'border-slate-100'
                }`}>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onCancel}
                            className={`p-1.5 rounded-md transition-colors ${
                                theme === 'dark' 
                                    ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                            }`}
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.geTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setScaleGlobal(1); setScaleX(1); setScaleY(1); setPosition({x:0,y:0}); }} className={`flex items-center gap-1 text-xs font-medium hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <RefreshCw className="w-3.5 h-3.5" /> {t.geReset}
                        </button>
                        <div className={`h-3 w-px mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                        <button onClick={onCancel} className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                            <Upload className="w-3.5 h-3.5" /> {t.geReupload}
                        </button>
                    </div>
                </div>

                {/* Canvas Container */}
                <div 
                    ref={containerRef}
                    className={`flex-1 relative overflow-hidden cursor-move flex items-center justify-center ${
                        theme === 'dark' ? 'bg-black/20' : 'bg-slate-50'
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {/* Grid Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <canvas ref={canvasRef} className="block" />
                </div>
                
                <div className={`h-6 border-t flex items-center justify-between px-3 text-[10px] font-mono ${
                    theme === 'dark' ? 'bg-[#1A1F2E] border-white/5 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
                }`}>
                    <span>{t.geDragHint}</span>
                    <span>Grid: {Math.round(cropRect.width)} x {Math.round(cropRect.height)}</span>
                </div>
            </div>

            {/* Right: Settings Sidebar (DISTRIBUTED) */}
            <div 
              className="w-full lg:w-72 flex flex-col shrink-0 overflow-y-auto pb-2 custom-scrollbar h-full justify-between"
              style={{ scrollbarWidth: 'none' }} // Firefox: Hide scrollbar
            >
                <style>{`
                  .custom-scrollbar::-webkit-scrollbar { display: none; } /* Chrome/Safari: Hide scrollbar */
                `}</style>

                {/* Section 1: Grid Layout (TOP) */}
                <div className={`rounded-xl p-3 shadow-sm border mb-2 ${
                    theme === 'dark' ? 'bg-[#1A1F2E] border-white/10' : 'bg-white border-slate-200'
                }`}>
                    <div className={`flex items-center gap-2 mb-3 font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>{t.geLayoutTitle}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 font-medium">{t.geCols}</span>
                            <NumberInput value={cols} onChange={setCols} max={10} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 font-medium">{t.geRows}</span>
                            <NumberInput value={rows} onChange={setRows} max={10} />
                        </div>
                    </div>
                    
                    <div className={`flex justify-between items-center pt-2 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                        <span className="text-[10px] text-slate-500">{t.geTotalSlices}</span>
                        <span className="text-lg font-bold text-indigo-500">{rows * cols}</span>
                    </div>
                </div>

                {/* Section 2: Adjust (MIDDLE) */}
                <div className={`rounded-xl p-3 shadow-sm border mb-2 ${
                    theme === 'dark' ? 'bg-[#1A1F2E] border-white/10' : 'bg-white border-slate-200'
                }`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center gap-2 font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            <Maximize className="w-3.5 h-3.5" />
                            <span>{t.geAdjustTitle}</span>
                        </div>
                        <button onClick={() => {setScaleGlobal(1); setScaleX(1); setScaleY(1); setPosition({x:0,y:0})}} className="text-[10px] text-indigo-500 hover:underline">{t.geResetAdjust}</button>
                    </div>

                    <div className="space-y-2">
                        <ScaleControl label={t.geScaleOverall} value={scaleGlobal} onChange={setScaleGlobal} min={0.1} max={5} />
                        <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}></div>
                        <ScaleControl label={t.geScaleX} value={scaleX} onChange={setScaleX} min={0.5} max={2} />
                        <ScaleControl label={t.geScaleY} value={scaleY} onChange={setScaleY} min={0.5} max={2} />
                    </div>
                </div>

                {/* Section 3: Export + Download (BOTTOM) */}
                <div className="flex flex-col gap-2">
                    <div className={`rounded-xl p-3 shadow-sm border ${
                        theme === 'dark' ? 'bg-[#1A1F2E] border-white/10' : 'bg-white border-slate-200'
                    }`}>
                        <div className={`flex items-center gap-2 mb-3 font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t.geExportTitle}</span>
                        </div>
                        
                        <div className="space-y-2">
                            {/* Prefix & Suffix Row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-slate-500 font-medium truncate" title={t.gePrefixLabel}>{t.gePrefixLabel}</label>
                                    <input 
                                        type="text" 
                                        placeholder={t.gePrefixPlaceholder}
                                        value={customPrefix}
                                        onChange={(e) => setCustomPrefix(e.target.value)}
                                        className={`w-full px-2 py-1.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all ${
                                            theme === 'dark' 
                                                ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-600' 
                                                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'
                                        }`}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-slate-500 font-medium truncate" title={t.geSuffixLabel}>{t.geSuffixLabel}</label>
                                    <input 
                                        type="text" 
                                        placeholder={t.geSuffixPlaceholder}
                                        value={customSuffix}
                                        onChange={(e) => setCustomSuffix(e.target.value)}
                                        className={`w-full px-2 py-1.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all ${
                                            theme === 'dark' 
                                                ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-600' 
                                                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Format */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-slate-500 font-medium">{t.geFormatLabel}</label>
                                <div className={`flex p-0.5 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                    {(['png', 'jpg', 'webp'] as ExportFormat[]).map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setExportFormat(fmt)}
                                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                                                exportFormat === fmt
                                                    ? (theme === 'dark' ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm')
                                                    : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                                            }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className={`p-2 rounded-lg text-[10px] border ${
                                theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'
                            }`}>
                                <span className="text-slate-500 block mb-0.5">{t.gePreviewLabel}:</span>
                                <span className={`font-mono break-all ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                    {previewFileName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Download Action */}
                    <button 
                        onClick={handleDownload}
                        className="w-full py-3 rounded-xl bg-[#18181b] hover:bg-black text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span>{t.geDownloadZip} ({rows * cols})</span>
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default GridEditor;
