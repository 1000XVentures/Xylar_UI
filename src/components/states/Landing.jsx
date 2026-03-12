import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';

const personas = [
  {
    id: 'buffett',
    name: 'Warren Buffett',
    title: 'Value Investor',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-500/20',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500',
    philosophy: 'Buy great businesses. Hold forever.',
    insights: [
      {
        type: 'VALUE SIGNAL',
        color: 'text-amber-500',
        borderColor: 'border-amber-500',
        text: 'Your concentration in consumer staples suggests a search for durable competitive advantages. I like the moat around HUL, but check the entry price...'
      },
      {
        type: 'CONCENTRATION RISK',
        color: 'text-red-500',
        borderColor: 'border-red-500',
        text: '42% of your capital is tied to high-beta tech. In Omaha, we call this leaning too far into the wind without a sturdy umbrella.'
      }
    ]
  },
  {
    id: 'lynch',
    name: 'Peter Lynch',
    title: 'Growth Specialist',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-500/20',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    philosophy: 'Invest in what you understand.',
    insights: [
      {
        type: 'OBSERVATION',
        color: 'text-blue-500',
        borderColor: 'border-blue-500',
        text: 'You hold 11 funds but the underlying stock overlap is 68%. This is diworsification — the illusion of diversification without the benefit.'
      },
      {
        type: 'OPPORTUNITY',
        color: 'text-green-600',
        borderColor: 'border-green-600',
        text: 'Two funds in your portfolio are classic ten-bagger candidates — under-followed, profitable, and in unglamorous categories.'
      }
    ]
  },
  {
    id: 'risk',
    name: 'Risk Manager',
    title: 'Portfolio Protector',
    color: 'bg-slate-700',
    lightColor: 'bg-slate-700/20',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-700',
    philosophy: 'Protect the downside. Everything else follows.',
    insights: [
      {
        type: 'DRAWDOWN RISK',
        color: 'text-red-500',
        borderColor: 'border-red-500',
        text: 'Maximum drawdown exposure estimated at 34% in a 2008-style scenario. Three holdings are highly correlated — they will fall together.'
      },
      {
        type: 'OPPORTUNITY',
        color: 'text-green-600',
        borderColor: 'border-green-600',
        text: 'Adding one uncorrelated asset class could reduce portfolio volatility by an estimated 18% without sacrificing meaningful return.'
      }
    ]
  }
];

export default function Landing({ onStateChange }) {
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState(['', '', '']);
  const [activeInsightIdx, setActiveInsightIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [portfolioText, setPortfolioText] = useState("");

  const activePersona = personas[activePersonaIdx];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePersonaIdx((prev) => (prev + 1) % personas.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayedText(['', '', '']);
    setActiveInsightIdx(0);
    setIsTyping(true);
  }, [activePersonaIdx]);

  useEffect(() => {
    if (!isTyping || activeInsightIdx >= activePersona.insights.length) {
      if (activeInsightIdx >= activePersona.insights.length) {
        setIsTyping(false);
      }
      return;
    }

    const currentFullText = activePersona.insights[activeInsightIdx].text;
    const currentDisplayed = displayedText[activeInsightIdx];

    if (currentDisplayed.length < currentFullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => {
          const newTexts = [...prev];
          newTexts[activeInsightIdx] = currentFullText.slice(0, currentDisplayed.length + 1);
          return newTexts;
        });
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setActiveInsightIdx(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, activeInsightIdx, isTyping, activePersona]);


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleContinue = () => {
    if (file || portfolioText.trim()) {
      onStateChange('ready');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row bg-[#F6F4F1] dark:bg-[#171121] font-display text-slate-900 dark:text-slate-100 overflow-x-hidden antialiased">

      {/* LEFT COLUMN: The Simulation */}
      <section className="w-full md:w-[55%] p-6 md:p-12 flex flex-col gap-8 relative z-10 bg-[#F6F4F1] dark:bg-[#171121]">

        <div className="flex items-center gap-1 mb-4 select-none">
          <span className="font-display font-extrabold text-2xl tracking-tighter text-slate-900 dark:text-white">XYLAR</span>
          <span className="font-display font-extrabold text-2xl tracking-tighter text-[#7C3AED]">AI</span>
        </div>

        {/* Persona Switcher */}
        <div className="flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-left duration-700">
          <div className="flex -space-x-3">
            {personas.map((persona, idx) => (
              <div
                key={persona.id}
                onClick={() => setActivePersonaIdx(idx)}
                className={`relative group cursor-pointer transition-all duration-300 z-[${10 - idx}] ${activePersonaIdx === idx ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105 hover:z-20'}`}
              >
                <div className={`size-16 rounded-full border-4 p-0.5 bg-white dark:bg-slate-800 overflow-hidden shadow-lg transition-all duration-500 ${activePersonaIdx === idx ? 'border-[#7c3bed]' : 'border-white dark:border-slate-800 shadow-sm'}`}>
                  <div className={`w-full h-full rounded-full ${persona.lightColor} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${persona.textColor} text-3xl font-light`}>person</span>
                  </div>
                </div>
                {activePersonaIdx === idx && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#7c3bed] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap animate-in fade-in zoom-in duration-300">
                    {persona.id.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[120px] leading-tight">Switch persona to change lens</p>
        </div>

        {/* Headline */}
        <div className="min-h-[120px] flex items-center">
          <h1 className="text-4xl md:text-5xl font-heading leading-[1.1] tracking-tight max-w-xl transition-all duration-500">
            Analysing your portfolio as <span className="text-[#7c3bed] underline decoration-[#7c3bed]/30 underline-offset-8 decoration-2">{activePersona.name}</span> would.
          </h1>
        </div>

        {/* Simulation Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-[#7c3bed]/5 border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[360px] flex flex-col relative transition-all duration-500 hover:shadow-[#7c3bed]/10">

          {/* Panel Header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse-soft"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Simulation</span>
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-6 md:p-8 space-y-6 flex-1">
            {activePersona.insights.map((insight, idx) => (
              <div
                key={`${activePersona.id}-${idx}`}
                className={`border-l-4 ${insight.borderColor} pl-5 py-1 transition-all duration-500 ease-out ${idx <= activeInsightIdx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              >
                <span className={`text-[10px] font-bold ${insight.color} uppercase tracking-widest mb-1.5 block`}>
                  {insight.type}
                </span>

                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic min-h-[1.5em] relative">
                  {displayedText[idx]}
                  {idx === activeInsightIdx && isTyping && (
                    <span className="inline-block w-1.5 h-5 bg-[#7c3bed]/40 ml-1 translate-y-1 animate-pulse"></span>
                  )}
                </p>
              </div>
            ))}

            {/* Input Line Caret */}
            {!isTyping && activeInsightIdx >= activePersona.insights.length && (
              <div className="flex items-center gap-2 pt-2 animate-in fade-in duration-500">
                <span className="text-[#7c3bed] font-bold text-lg">›</span>
                <div className="h-6 w-0.5 bg-[#7c3bed] animate-pulse-soft"></div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="mt-auto pt-8 border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden fade-x-edges">
          <div className="flex gap-12 items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap animate-scroll">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span>ISO 27001 Certified Security</span>
                <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>AI-Powered by Xylar 4.0</span>
                <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>Trusted by 50k+ Indian Investors</span>
                <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>Bank-Grade Encryption</span>
                <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </section>

      {/* RIGHT COLUMN: The Upload Action */}
      <aside className="w-full md:w-[45%] bg-white dark:bg-[#110c18] border-l border-slate-50 dark:border-slate-800/50 md:sticky md:top-0 md:h-screen p-8 md:p-16 flex flex-col justify-center overflow-y-auto">

        <div className="max-w-[440px] mx-auto w-full animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-2xl md:text-[28px] font-heading leading-tight mb-8 mt-8 tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Your portfolio. Their lens.
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl shadow-[#7c3bed]/5 p-8 space-y-8">
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${isDragging
                ? 'border-[#7c3bed] bg-[#7c3bed]/[0.05] scale-[1.02]'
                : 'border-[#7c3bed]/20 bg-[#7c3bed]/[0.02] hover:bg-[#7c3bed]/[0.04] hover:border-[#7c3bed]/40'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.csv,.xlsx,.xls,image/*"
              />

              <div className={`size-14 bg-[#7c3bed]/10 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${isDragging || file ? 'scale-110' : 'group-hover:scale-110'}`}>
                {file ? (
                  <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-[#7c3bed] text-3xl">upload_file</span>
                )}
              </div>

              <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">
                {file ? file.name : 'Upload Portfolio'}
              </h3>
              <p className="text-sm text-slate-500">
                {file ? 'Click to change file' : 'PDF, Excel or CSV from your broker'}
              </p>
            </div>

            <div className="relative py-8 flex items-center justify-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            {/* Manual Paste Area */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Paste portfolio text</label>
              <textarea
                value={portfolioText}
                onChange={(e) => setPortfolioText(e.target.value)}
                className="w-full h-32 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F6F4F1] dark:bg-slate-800/50 p-4 text-sm focus:ring-1 focus:ring-[#7c3bed] focus:border-[#7c3bed] resize-none placeholder-slate-400 outline-none transition-all"
                placeholder="Paste your holdings list or text from your statement..."
              ></textarea>
              {portfolioText.length > 0 && (
                <button
                  onClick={() => setPortfolioText("")}
                  className="self-end text-[10px] font-bold text-[#7c3bed] uppercase tracking-tighter hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleContinue}
                disabled={!file && !portfolioText.trim()}
                className={`w-full h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${file || portfolioText.trim()
                  ? 'bg-[#7c3bed] text-white hover:bg-[#6D28D9] hover:shadow-[#7c3bed]/30 hover:scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Continue Analysis
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </button>

              <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                No login required for preview
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="h-12 md:hidden"></div>
      </aside>

      {/* Global Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#110c18]/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-around items-center md:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-[#7c3bed]">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold uppercase">Persona</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">upload</span>
          <span className="text-[10px] font-bold uppercase">Upload</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase">Tools</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .fade-x-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .font-heading {
          font-family: 'Syne', sans-serif;
        }
        .font-display {
          font-family: 'Inter', sans-serif;
        }
      `}} />
    </div>
  );
}
