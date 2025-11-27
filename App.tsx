
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import GridEditor from './components/GridEditor';
import { Loader2, Zap, Lock, Maximize2, UploadCloud, Grid3X3, MousePointer2 } from 'lucide-react';
import { translations, Language } from './utils/translations';

// Unique namespace for this specific project instance
const COUNTER_NAMESPACE = 'instacrops-project-fyt';
const COUNTER_KEY = 'conversions';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- Theme State ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // --- Internationalization State ---
  const [lang, setLang] = useState<Language>('zh-CN');
  const [hasSelectedLang, setHasSelectedLang] = useState(false);
  
  const handleSetLang = (l: Language) => {
    setLang(l);
    setHasSelectedLang(true);
  };

  const t = translations[lang];

  useEffect(() => {
    document.title = t.title;
  }, [lang, t.title]);

  const [totalConverted, setTotalConverted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('instacrops_total_converted');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    const fetchGlobalCount = async () => {
      try {
        const response = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/`);
        if (response.ok) {
          const data = await response.json();
          if (data.count > totalConverted) {
            setTotalConverted(data.count);
            localStorage.setItem('instacrops_total_converted', data.count.toString());
          }
        }
      } catch (error) {
        console.warn("Failed to fetch global stats, using local cache:", error);
      }
    };

    fetchGlobalCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tempFile, setTempFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setIsProcessing(true);
    setTimeout(() => {
        setTempFile(file);
        setShowEditor(true);
        setIsProcessing(false);
    }, 800);
  }, []);

  const handleHeroFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setTempFile(null);
  }

  return (
    <div className={`h-screen selection:bg-indigo-500/30 flex flex-col font-sans overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <Header lang={lang} setLang={handleSetLang} t={t} hasSelectedLang={hasSelectedLang} theme={theme} setTheme={setTheme} />

      <main className="flex-1 container mx-auto px-4 lg:px-6 flex flex-col justify-center relative z-10 h-full max-h-[calc(100vh-4rem)]">
        
        {/* Background Blobs */}
        <div className={`absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-60'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-60'
        }`} style={{animationDelay: '1.5s'}}></div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full max-h-[800px] m-auto w-full">
            
            {/* Left Column: Hero Content */}
            <div className="space-y-6 lg:space-y-8 relative z-20 flex flex-col justify-center">
              {/* Hero Text */}
              <div className="space-y-4">
                <h1 className={`text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-in-up drop-shadow-xl text-center lg:text-left ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {t.heroTitleStart} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    {t.heroTitleEnd}
                  </span>
                </h1>
                
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight animate-fade-in-up delay-100 text-center lg:text-left">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    {t.heroSubtitle}
                  </span>
                </h2>
                
                <h3 className={`text-lg font-medium tracking-tight animate-fade-in-up delay-100 flex items-center justify-center lg:justify-start gap-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  <div className={`p-1 rounded-full border backdrop-blur-sm ${
                    theme === 'dark' 
                      ? 'bg-yellow-500/10 border-yellow-500/20' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                  </div>
                  <span className={`text-center lg:text-left text-sm ${theme === 'dark' ? 'text-indigo-100' : 'text-slate-700'}`}>
                    {t.freeService}
                  </span>
                </h3>
                
                <p className={`text-base leading-relaxed max-w-lg animate-fade-in-up delay-100 text-center lg:text-left mx-auto lg:mx-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  {t.heroDesc}
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="w-full max-w-md pt-2 animate-fade-in-up delay-200 mx-auto lg:mx-0">
                <div className="flex items-start justify-between lg:justify-start lg:gap-8">
                  <div className="w-20 flex flex-col items-center gap-2 relative z-10 shrink-0">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105 ${
                      theme === 'dark' ? 'bg-[#0f172a] border-white/10 shadow-indigo-500/10' : 'bg-white border-slate-200 shadow-slate-200'
                    }`}>
                        <UploadCloud className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className={`text-[9px] font-bold tracking-wider uppercase text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{t.step1}</span>
                  </div>
                  <div className="w-20 flex flex-col items-center gap-2 relative z-10 shrink-0">
                     <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105 ${
                        theme === 'dark' ? 'bg-[#0f172a] border-white/10 shadow-pink-500/10' : 'bg-white border-slate-200 shadow-slate-200'
                     }`}>
                        <Grid3X3 className="w-5 h-5 text-pink-500" />
                     </div>
                     <span className={`text-[9px] font-bold tracking-wider uppercase text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{t.step2}</span>
                  </div>
                  <div className="w-20 flex flex-col items-center gap-2 relative z-10 shrink-0">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105 ${
                      theme === 'dark' ? 'bg-[#0f172a] border-white/10 shadow-indigo-500/10' : 'bg-white border-slate-200 shadow-slate-200'
                    }`}>
                        <MousePointer2 className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className={`text-[9px] font-bold tracking-wider uppercase text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{t.step3}</span>
                  </div>
                </div>
              </div>

              {/* Main CTA Button */}
              <div className="pt-4 animate-fade-in-up delay-200 flex justify-center lg:justify-start">
                  <button 
                      onClick={() => heroInputRef.current?.click()}
                      className="group relative flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-indigo-600/80 to-pink-600/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="flex flex-col items-start text-left relative z-10">
                           <span className="text-xl font-bold text-white drop-shadow-md">{t.ctaMain}</span>
                           <span className="text-xs text-indigo-100/90 font-medium">{t.ctaSub}</span>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm relative z-10">
                           <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                  </button>
                  <input 
                      type="file" 
                      ref={heroInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleHeroFileInput}
                  />
              </div>

              {/* Feature Tags List - Compact */}
              <div className="grid grid-cols-3 gap-2 pt-4 animate-fade-in-up delay-300">
                {[
                    { icon: Maximize2, title: t.featRatio, desc: t.featRatioDesc, color: 'text-indigo-500' },
                    { icon: Zap, title: t.featCompress, desc: t.featCompressDesc, color: 'text-yellow-500' },
                    { icon: Lock, title: t.featPrivacy, desc: t.featPrivacyDesc, color: 'text-pink-500' }
                ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center md:items-start gap-1 group p-2 rounded-lg transition-all duration-300 hover:scale-105 border border-transparent text-center md:text-left ${
                      theme === 'dark' ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}>
                        <div className="flex flex-col md:flex-row items-center gap-1.5">
                            <div className={`${item.color} group-hover:scale-110 transition-transform duration-300 p-1.5 rounded-md ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                <item.icon className="w-3 h-3" />
                            </div>
                            <h4 className={`text-[10px] font-bold transition-colors leading-tight ${theme === 'dark' ? 'text-gray-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{item.title}</h4>
                        </div>
                        <p className={`text-[9px] leading-tight opacity-80 group-hover:opacity-100 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                ))}
              </div>
            </div>

             {/* OPTICAL FLOW ARROW (Desktop Only) */}
            <div className="hidden lg:block absolute left-[45%] top-1/2 -translate-y-1/2 w-[250px] h-[200px] pointer-events-none z-10 opacity-80">
                 <svg width="100%" height="100%" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <defs>
                      <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                        <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                      </linearGradient>
                       <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                       </filter>
                       <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                         <path d="M2,2 L10,6 L2,10" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                       </marker>
                    </defs>
                    <path d="M 0,120 C 100,120 150,40 280,40" stroke="url(#flowGradient)" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-flow" strokeDasharray="120 300" filter="url(#glow)" markerEnd="url(#arrowhead)" />
                    <path d="M 0,120 C 120,120 180,120 280,120" stroke="url(#flowGradient)" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-flow" style={{animationDelay: '0.5s'}} strokeDasharray="120 300" filter="url(#glow)" markerEnd="url(#arrowhead)" />
                    <path d="M 0,120 C 100,120 150,200 280,200" stroke="url(#flowGradient)" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-flow" style={{animationDelay: '1s'}} strokeDasharray="120 300" filter="url(#glow)" markerEnd="url(#arrowhead)" />
                 </svg>
            </div>

            {/* Right Column: Interactive Card */}
            <div className="relative z-20 animate-fade-in-up delay-200 flex flex-col justify-center">
              
              {/* Card Container - Liquid Glass */}
              <div className={`backdrop-blur-2xl border rounded-[24px] p-1.5 shadow-2xl ring-1 relative group transition-transform duration-700 ease-out hover:scale-[1.01] ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 ring-white/5' 
                  : 'bg-white/60 border-slate-200 ring-slate-900/5 shadow-slate-200/50'
              }`}>
                
                {/* Main Upload Area */}
                <div className={`backdrop-blur-md rounded-[20px] p-4 md:p-6 border shadow-inner relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#0B0F19]/50 border-white/5' : 'bg-slate-50/80 border-slate-100'
                }`}>

                  <UploadArea 
                    onFileSelect={handleFileSelect} 
                    isProcessing={isProcessing} 
                    t={t}
                    theme={theme}
                  />

                  {/* Processing State Overlay */}
                  {isProcessing && (
                    <div className={`absolute inset-0 z-50 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center text-center p-8 border ${
                      theme === 'dark' 
                        ? 'bg-[#0B0F19]/80 border-white/10' 
                        : 'bg-white/90 border-slate-100'
                    }`}>
                      <div className="relative w-16 h-16 mb-4">
                         <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                         <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 animate-pulse ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.processingTitle}</h3>
                      <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'}`}>
                        {t.processingDesc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Info inside Card */}
                <div className={`px-6 py-3 flex items-center justify-between border-t ${
                  theme === 'dark' ? 'border-white/5' : 'border-slate-200/60'
                }`}>
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-pulse"></div>
                     <span className={`text-[10px] font-mono uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>System Online</span>
                  </div>
                  <div className={`text-[10px] font-mono tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>v3.0.0 GRID</div>
                </div>

              </div>

              {/* Counter - Inline & Colorful */}
              <div className="mt-6 flex flex-row items-baseline justify-center gap-2 animate-fade-in">
                 <span className={`text-lg font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{t.completed}</span>
                 <span key={totalConverted} className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] px-1">
                    {totalConverted}
                 </span>
                 <span className={`text-lg font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{t.converted}</span>
              </div>
            </div>

        </div>
        
        {/* Grid Editor Modal */}
        {showEditor && tempFile && (
           <GridEditor 
             file={tempFile} 
             onCancel={handleEditorCancel}
             t={t}
             theme={theme}
           />
        )}

      </main>

      <footer className={`py-4 text-center text-xs relative z-10 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
        <p className="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default App;
