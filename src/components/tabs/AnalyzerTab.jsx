import React, { useState, useRef } from 'react';
import { analyzePortfolio } from '../../api';
import { downloadReport } from '../../download';
import PersonaLandingScreen from '../landing/PersonaLandingScreen';

// ─────────────────────────────────────────────────────────────────────────────
// AnalyzerTab — manages all 6 states of the analyzer flow
// landing → ready → customize → analyzing → results | error
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATE = {
    screen: 'landing',
    fileData: null,       // base64 string
    fileType: null,       // 'pdf' | 'image' | null
    fileName: null,
    fileSize: null,
    pastedText: '',
    customInstructions: '',
    analysisResult: null,
    error: null,
};

function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // strip the data URL prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── STATE SCREENS ────────────────────────────────────────────────────────────

function LandingScreen({ state, updateState, goTo }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const isTextLocked = false;
    const isFileLocked = false;

    const canContinue = !!(state.fileName || state.pastedText.length > 5);

    const handleFile = async (file) => {
        if (isFileLocked) return;
        const isPdf = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');
        if (!isPdf && !isImage) return;
        const base64 = await readFileAsBase64(file);
        updateState({
            fileData: base64,
            fileType: isPdf ? 'pdf' : 'image',
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            pastedText: '',
        });
    };

    const handleFileInput = (e) => {
        if (isFileLocked) return;
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
        // Reset input value so the same file can be uploaded again if needed
        e.target.value = null;
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (isFileLocked) return;
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleContinue = () => {
        if (canContinue) goTo('ready');
    };

    const clearFile = (e) => {
        e.stopPropagation();
        updateState({
            fileData: null,
            fileType: null,
            fileName: null,
            fileSize: null
        });
    };

    return (
        <div style={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: 'var(--bg-main)',
        }}>
            <div style={{ width: '100%', maxWidth: 560 }}>

                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 'clamp(28px, 5vw, 42px)',
                        fontWeight: 800,
                        background: 'linear-gradient(180deg, var(--text-primary) 0%, #4B5563 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.1,
                        letterSpacing: '-0.025em',
                        marginBottom: 14,
                    }}>
                        Get instant AI insight<br />on your portfolio
                    </h1>
                    <p style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: 15,
                        color: '#6B7280',
                        lineHeight: 1.7,
                        margin: 0,
                    }}>
                        Upload a PDF, paste a screenshot, or type your holdings.<br />
                        Deep analysis in under 60 seconds.
                    </p>
                </div>

                {/* Upload zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: isDragOver ? '2px solid var(--accent)' : state.fileName ? '2px solid #A3E635' : '2px dashed #C4B5FD',
                        background: isDragOver ? 'rgba(124,58,237,0.06)' : state.fileName ? '#F0FDF4' : 'white',
                        borderRadius: 'var(--r-xl)',
                        padding: '36px 28px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        boxShadow: isDragOver ? '0 0 0 4px rgba(124,58,237,0.10)' : state.fileName ? '0 10px 30px -5px rgba(163,230,53,0.2)' : '0 20px 50px -12px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Icon */}
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: state.fileName ? '#DCFCE7' : 'var(--accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 16,
                        transition: 'all 0.2s ease',
                    }}>
                        {state.fileName ? (
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                        )}
                    </div>

                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: state.fileName ? '#15803D' : 'var(--text-primary)', marginBottom: 4 }}>
                        {state.fileName ? state.fileName : 'Drag & drop your file here'}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>
                        {state.fileName ? state.fileSize : 'PDF, PNG, JPG — CAS statement or broker screenshot'}
                    </div>

                    {!state.fileName && (
                        <div style={{
                            marginTop: 18,
                            background: 'var(--accent)', color: 'white',
                            fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600,
                            padding: '9px 22px', borderRadius: 'var(--r-full)',
                            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                        }}>
                            Browse files
                        </div>
                    )}

                    {state.fileName && (
                        <button
                            onClick={clearFile}
                            style={{
                                marginTop: 14, background: 'transparent', color: '#EF4444',
                                fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
                                padding: '6px 16px', borderRadius: 'var(--r-full)',
                                border: '1px solid #FCA5A5', cursor: 'pointer',
                            }}
                        >
                            Remove file
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>or add context below</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={state.pastedText}
                    onChange={(e) => updateState({ pastedText: e.target.value })}
                    placeholder="Paste your holdings, transaction history, or any portfolio notes here..."
                    style={{
                        width: '100%', minHeight: 110, boxSizing: 'border-box',
                        border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)',
                        padding: '16px 18px', fontFamily: "'Inter',sans-serif", fontSize: 14,
                        color: 'var(--text-primary)', background: 'white',
                        resize: 'vertical', lineHeight: 1.65, outline: 'none',
                        transition: 'border 0.15s, box-shadow 0.15s',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                    onFocus={(e) => { e.target.style.border = '1.5px solid var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
                    onBlur={(e) => { e.target.style.border = '1.5px solid var(--border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
                />

                {/* CTA */}
                <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    style={{
                        width: '100%', height: 54, marginTop: 18,
                        background: canContinue ? 'linear-gradient(135deg,#7C3AED,#5B21B6)' : 'rgba(0,0,0,0.05)',
                        color: canContinue ? 'white' : 'rgba(0,0,0,0.3)',
                        fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700,
                        borderRadius: 'var(--r-full)', border: canContinue ? 'none' : '1px solid rgba(0,0,0,0.05)',
                        cursor: canContinue ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s ease',
                        letterSpacing: '-0.01em',
                        boxShadow: canContinue ? '0 8px 24px -10px rgba(124,58,237,0.4)' : 'none',
                    }}
                    onMouseEnter={(e) => { if (canContinue) { e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = canContinue ? '0 8px 24px -10px rgba(124,58,237,0.4)' : 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                    Customize the analysis →
                </button>

                {/* Trust line */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>
                        Session only — your data is never stored
                    </span>
                </div>

            </div>
        </div>
    );
}

function ReadyScreen({ state, updateState, goTo }) {
    const fileInputRef = useRef(null);
    const [instructions, setInstructions] = useState(state.customInstructions || '');

    const PERSONAS = [
        { label: 'Warren Buffett', emoji: '💰', phrase: 'Analyse this portfolio through the lens of Warren Buffett — focus on business quality, moat, long-term compounding, and whether holdings would pass a value investing screen.' },
        { label: 'Charlie Munger', emoji: '🧠', phrase: 'Apply Charlie Munger\'s mental models — look for concentration of high-conviction bets, identify cognitive biases visible in the portfolio behaviour, and flag businesses with durable competitive advantages.' },
        { label: 'Rakesh Jhunjhunwala', emoji: '📈', phrase: 'Analyse like Rakesh Jhunjhunwala — identify high-conviction mid and small cap opportunities, assess the growth trajectory of holdings, and flag where patience could compound returns significantly.' },
        { label: 'Peter Lynch', emoji: '🔍', phrase: 'Use Peter Lynch\'s approach — look for hidden gems, assess whether the portfolio is over-diversified into mediocrity, and identify any ten-bagger potential among the holdings.' },
        { label: 'Risk Manager', emoji: '🛡', phrase: 'Analyse this portfolio as a professional risk manager — focus entirely on downside exposure, concentration risk, correlation between holdings, and tail risk scenarios.' },
        { label: 'Tax Optimizer', emoji: '⚖', phrase: 'Analyse this portfolio from a tax efficiency standpoint — identify STCG vs LTCG exposure, flag holdings that could be harvested for tax loss, and suggest a restructuring sequence that minimises the tax impact.' },
        { label: 'Index Challenger', emoji: '📊', phrase: 'Compare this portfolio against a simple index fund strategy — assess whether the active bets are actually adding alpha, identify closet indexing, and make the case for or against active management here.' },
        { label: 'First Principles', emoji: '✦', phrase: 'Strip away all labels and categories. Analyse this portfolio from first principles — what is the actual underlying economic exposure, what are the real risks, and what would you build if starting from scratch today?' },
    ];

    const isChipSelected = (phrase) => instructions.includes(phrase);

    const toggleChip = (phrase) => {
        if (isChipSelected(phrase)) {
            setInstructions((prev) => prev.replace(phrase, '').replace(/\s{2,}/g, ' ').trim());
        } else {
            setInstructions((prev) => (prev ? `${prev.trim()} ${phrase}` : phrase));
        }
    };

    const handleReplaceFile = async (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const isPdf = file.type === 'application/pdf';
            const isImage = file.type.startsWith('image/');
            if (!isPdf && !isImage) return;
            const base64 = await readFileAsBase64(file);
            updateState({
                fileData: base64,
                fileType: isPdf ? 'pdf' : 'image',
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                pastedText: '',
            });
        }
    };

    const handleAnalyze = () => {
        updateState({ customInstructions: instructions });
        goTo('analyzing');
    };

    const displayName = state.fileName || 'Pasted text';
    const displaySub = state.fileName ? state.fileSize : `${state.pastedText.length} characters`;

    return (
        <div className="state-container" style={{ maxWidth: 560, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Portfolio added</h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Ready to analyze</p>
            </div>

            {/* File card */}
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Check circle */}
                <div style={{ width: 44, height: 44, background: 'var(--lime,#A3E635)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                {/* File info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{displaySub}</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                    {state.fileName && (
                        <>
                            <label style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center' }}>
                                Replace
                                <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleReplaceFile} style={{ display: 'none' }} />
                            </label>
                        </>
                    )}
                    <div
                        onClick={() => { updateState({ ...INITIAL_STATE }); goTo('landing'); }}
                        style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center' }}
                    >
                        Remove
                    </div>
                </div>
            </div>

            {/* Inline Customize Section */}
            <div style={{ marginTop: 24, marginBottom: 12, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                How should we analyse it? <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>(optional)</span>
            </div>

            <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Or describe how you want it analysed..."
                style={{
                    width: '100%', minHeight: 120, boxSizing: 'border-box',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                    padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontSize: 14,
                    color: 'var(--text-primary)', background: 'white',
                    resize: 'vertical', lineHeight: 1.6, outline: 'none',
                    marginBottom: 16
                }}
                onFocus={(e) => { e.target.style.border = '1px solid var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid var(--border)'; e.target.style.boxShadow = 'none'; }}
            />

            <div style={{ background: '#F8F9FA', padding: 16, borderRadius: 'var(--r-lg)', marginTop: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {PERSONAS.map((p) => {
                        const selected = isChipSelected(p.phrase);
                        return (
                            <button
                                key={p.label}
                                onClick={() => toggleChip(p.phrase)}
                                className={`persona-chip ${selected ? 'selected' : ''}`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Analyze button */}
            <button
                onClick={handleAnalyze}
                style={{
                    width: '100%', height: 52, marginTop: 24,
                    background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                    color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700,
                    borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 8px 24px -10px rgba(124,58,237,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px -10px rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'none'; }}
            >
                Analyze Portfolio
            </button>
        </div>
    );
}

function AnalyzingScreen({ state, onComplete, onError }) {
    const [progress, setProgress] = React.useState(0);
    const [statusIdx, setStatusIdx] = React.useState(0);
    const [statusVisible, setStatusVisible] = React.useState(true);
    const hasFired = React.useRef(false);

    const STATUS_MSGS = [
        'Extracting and scoring holdings...',
        'Identifying patterns and signals...',
        'Assessing diversification...',
        'Checking for risks and red flags...',
        'Generating your report...',
    ];

    React.useEffect(() => {
        // Animate progress bar 0 → 88% over 10s
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const pct = Math.min(88, ((ts - start) / 10000) * 88);
            setProgress(pct);
            if (pct < 88) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);

        // Cycle status text every 2.5s
        const statusInterval = setInterval(() => {
            setStatusVisible(false);
            setTimeout(() => {
                setStatusIdx((i) => (i + 1) % STATUS_MSGS.length);
                setStatusVisible(true);
            }, 350);
        }, 2500);

        // Fire API call
        if (!hasFired.current) {
            hasFired.current = true;
            analyzePortfolio({
                fileData: state.fileData,
                fileType: state.fileType,
                pastedText: state.pastedText,
                customInstructions: state.customInstructions,
            }).then((result) => {
                setProgress(100);
                setTimeout(() => onComplete(result), 300);
            }).catch((err) => {
                onError(err.message || 'Analysis failed.');
            });
        }

        return () => clearInterval(statusInterval);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '0 24px', textAlign: 'center' }}>
            {/* Pulsing orb */}
            <div style={{ width: 80, height: 80, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-ring 2s ease-in-out infinite' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
                </svg>
            </div>

            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 28, marginBottom: 8 }}>
                Analyzing portfolio...
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
                Extracting content and generating insights
            </p>

            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: 360, marginTop: 32, height: 4, background: 'var(--border)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 'var(--r-full)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
            </div>

            {/* Status text */}
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)', marginTop: 14, opacity: statusVisible ? 1 : 0, transition: 'opacity 0.35s ease', minHeight: 20 }}>
                {STATUS_MSGS[statusIdx]}
            </p>

            {/* Reassurance */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Your data is processed securely and never stored.</span>
            </div>
        </div>
    );
}

function ResultsScreen({ analysis, onReset, onDownload }) {
    const SECTIONS = [
        { key: 'portfolio_summary', num: '01', title: 'Portfolio Summary' },
        { key: 'key_observations', num: '02', title: 'Key Observations' },
        { key: 'diversification_concentration', num: '03', title: 'Diversification & Concentration' },
        { key: 'risks_red_flags', num: '04', title: 'Risks & Red Flags' },
        { key: 'improvement_opportunities', num: '05', title: 'Improvement Opportunities' },
        { key: 'final_takeaway', num: '06', title: 'Final Takeaway' },
    ];

    const data = analysis || {
        portfolio_summary: 'Your portfolio shows a concentration in large-cap equity with limited debt exposure.',
        key_observations: 'Consistent SIP pattern observed across 3 years with strong equity preference.',
        diversification_concentration: '63% equity concentrated in two sectors — technology and financial services.',
        risks_red_flags: 'High exposure to interest-rate sensitive sectors may impact near-term returns.',
        improvement_opportunities: 'Rebalancing 15% into flexi-cap funds could improve risk-adjusted returns.',
        final_takeaway: 'Diversify into international equity and increase debt allocation by 10% for better balance.',
        health_score: 72,
    };

    return (
        <div className="state-container" style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 60 }}>
            {/* 1. Hero / Health Score Card (Lavender/Purple Gradient) */}
            <div style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                borderRadius: 'var(--r-xl)',
                padding: '32px',
                color: 'white',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px -12px rgba(124,58,237,0.3)',
                animation: 'card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)', pointerEvents: 'none' }} />

                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 8, letterSpacing: '0.01em' }}>Portfolio Health Score</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 56, fontWeight: 800 }}>{data.health_score || 85}</span>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, opacity: 0.6 }}>/100</span>
                    <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 'var(--r-full)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700 }}>+5.2%</span>
                    </div>
                </div>

                <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${data.health_score || 85}%`, height: '100%', background: 'white', borderRadius: 'var(--r-full)' }} />
                </div>
            </div>

            {/* 2. Key Market Signals */}
            <div style={{
                background: 'white', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--r-lg)',
                padding: '24px', marginBottom: 24, boxShadow: 'var(--shadow-sm)'
            }}>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18 }}>Key Market Signals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s infinite' }} />
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Market Outlook</span>
                        </div>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700, color: '#059669' }}>Bullish</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Volatility Index</span>
                        </div>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700, color: '#D97706' }}>Medium</span>
                    </div>
                </div>
            </div>

            {/* 3. Section Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* A. Portfolio Summary (Themed) */}
                <div style={{ background: 'white', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Portfolio Summary</h3>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', background: 'var(--accent-light)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>LIVE ANALYSIS</span>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{data.portfolio_summary}</p>
                </div>

                {/* B. Key Observations */}
                <div style={{ background: 'white', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Key Observations</h3>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{data.key_observations}</p>
                    </div>
                </div>

                {/* C. Diversification & Concentration */}
                <div style={{ background: 'white', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Diversification & Concentration</h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{data.diversification_concentration}</p>
                </div>

                {/* D. Risks & Red Flags (Rose Theme) */}
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 'var(--r-lg)', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#BE123C' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, margin: 0 }}>Critical Risks</h3>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#BE123C', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{data.risks_red_flags}</p>
                </div>

                {/* E. Improvement Opportunities (Lime Theme) */}
                <div style={{ background: '#F7FEE7', border: '1px solid #D9F99D', borderRadius: 'var(--r-lg)', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#4D7C0F' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, margin: 0 }}>Improvement Ops</h3>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#4D7C0F', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{data.improvement_opportunities}</p>
                </div>

                {/* F. Final Takeaway (Premium Dark) */}
                <div style={{
                    background: '#111827', borderRadius: 'var(--r-lg)', padding: '28px', color: 'white',
                    boxShadow: '0 10px 30px -10px rgba(17,24,39,0.5)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, margin: 0 }}>Final Takeaway</h3>
                            <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 1 }}>AI Synthesis Engine</p>
                        </div>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>{data.final_takeaway}</p>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 20, marginBottom: 0 }}>Verified by Xylar Intelligence · 1.0.4</p>
                </div>

            </div>

            {/* 4. Xylar CTA Banner */}
            <div style={{
                marginTop: 32,
                background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
                border: '1px solid rgba(124,58,237,0.30)',
                borderRadius: 'var(--r-xl)',
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
            }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 180, height: 180, background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A3E635', boxShadow: '0 0 6px rgba(163,230,53,0.7)' }} />
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A3E635' }}>Explore Xylar Workspace</span>
                    </div>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800, color: '#FAFAFA', lineHeight: 1.25, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
                        Ready for custom<br />wealth strategies?
                    </h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>
                        Join the next generation of asset management.
                    </p>
                </div>
                <a
                    href="https://www.xylar.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                        color: 'white',
                        fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
                        padding: '12px 22px',
                        borderRadius: 'var(--r-full)',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                        transition: 'all 0.15s ease',
                        position: 'relative', zIndex: 1,
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'none'; }}
                >
                    Visit Xylar.ai
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            </div>

            {/* 5. Main Action Buttons */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                    onClick={onDownload}
                    style={{
                        width: '100%', height: 56, background: 'var(--accent)', color: 'white',
                        fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700,
                        borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 8px 32px -8px rgba(124,58,237,0.5)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(124,58,237,0.6)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px -8px rgba(124,58,237,0.5)'; }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download Detailed Report
                </button>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={onReset}
                        style={{
                            flex: 1, height: 48, background: 'white', border: '1.5px solid var(--border-strong)',
                            color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: 14,
                            fontWeight: 600, borderRadius: 'var(--r-full)', cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                    >
                        Analyze Another
                    </button>
                    <button
                        style={{
                            width: 48, height: 48, background: 'white', border: '1.5px solid var(--border-strong)',
                            borderRadius: 'var(--r-full)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'var(--text-secondary)'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function ErrorScreen({ error, onReset }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '0 24px', maxWidth: 400, margin: '0 auto' }}>
            {/* Error icon */}
            <div style={{ width: 80, height: 80, background: 'var(--negative-bg,#FEF2F2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.25s ease forwards' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--negative,#EF4444)" strokeWidth="2" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>

            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginTop: 24, marginBottom: 0 }}>
                We couldn't process that file.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7, marginTop: 10, marginBottom: 36 }}>
                {error || 'Use a clearer file or paste text directly.'}
            </p>

            <button
                onClick={() => onReset('landing')}
                style={{ width: '100%', height: 52, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
                Upload Again
            </button>
            <button
                onClick={() => onReset('landing', true)}
                style={{ width: '100%', height: 48, marginTop: 10, background: 'transparent', border: '1.5px solid var(--border-strong,#D1D5DB)', color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, borderRadius: 'var(--r-full)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong,#D1D5DB)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
                Paste Text Instead
            </button>
        </div>
    );
}

// ─── TAB WRAPPER ──────────────────────────────────────────────────────────────

export default function AnalyzerTab() {
    const [analyzer, setAnalyzer] = useState({ ...INITIAL_STATE });

    const updateState = (patch) => setAnalyzer((prev) => ({ ...prev, ...patch }));
    const goTo = (screen) => setAnalyzer((prev) => ({ ...prev, screen }));
    const reset = (focusTextarea = false) => {
        setAnalyzer({ ...INITIAL_STATE });
        // focusTextarea flag handled by landing via autoFocus prop
    };

    const handleComplete = (result) => {
        setAnalyzer((prev) => ({ ...prev, analysisResult: result, screen: 'results' }));
    };
    const handleError = (msg) => {
        setAnalyzer((prev) => ({ ...prev, error: msg, screen: 'error' }));
    };
    const handleDownload = () => {
        downloadReport(analyzer.analysisResult || {
            portfolio_summary: 'Demo summary',
            key_observations: 'Demo observations',
            diversification_concentration: 'Demo diversification',
            risks_red_flags: 'Demo risks',
            improvement_opportunities: 'Demo opportunities',
            final_takeaway: 'Demo takeaway',
            health_score: 72,
        }, 'pdf');
    };
    const handleErrorReset = (screen, focusTextarea) => {
        setAnalyzer({ ...INITIAL_STATE, _focusTextarea: focusTextarea || false });
    };

    return (
        <div className="tab-panel" style={{ flex: 1, overflow: 'auto' }}>
            {analyzer.screen === 'landing' && (
                <PersonaLandingScreen state={analyzer} updateState={updateState} goTo={goTo} />
            )}
            {analyzer.screen === 'ready' && (
                <ReadyScreen state={analyzer} updateState={updateState} goTo={goTo} />
            )}
            {analyzer.screen === 'analyzing' && (
                <AnalyzingScreen state={analyzer} onComplete={handleComplete} onError={handleError} />
            )}
            {analyzer.screen === 'results' && (
                <ResultsScreen analysis={analyzer.analysisResult} onReset={reset} onDownload={handleDownload} />
            )}
            {analyzer.screen === 'error' && (
                <ErrorScreen error={analyzer.error} onReset={handleErrorReset} />
            )}
        </div>
    );
}
