import React, { useState, useRef } from 'react';
import { analyzePortfolio } from '../../api';
import { downloadReport } from '../../download';

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

    const isTextLocked = !!state.fileName;
    const isFileLocked = state.pastedText.length > 0;

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
        <div className="state-container" style={{ maxWidth: 560, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 10 }}>AI Portfolio Analyzer</div>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6 }}>
                    Upload your portfolio.
                </h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
                    Instant portfolio review
                </p>
            </div>

            {/* Upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); if (!isFileLocked) setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => { if (!isFileLocked) fileInputRef.current?.click(); }}
                style={{
                    border: isDragOver ? '2px solid var(--accent)' : '2px dashed #C4B5FD',
                    background: isDragOver ? 'rgba(124,58,237,0.08)' : 'var(--accent-light)',
                    borderRadius: 'var(--r-lg)',
                    minHeight: 200,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: isFileLocked ? 'not-allowed' : 'pointer', padding: '40px 24px',
                    position: 'relative',
                    transform: isDragOver ? 'scale(1.01)' : 'none',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                    opacity: isFileLocked ? 0.5 : 1,
                }}
            >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>
                    {state.fileName ? state.fileName : 'Upload PDF or image'}
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)', marginTop: 6, paddingRight: state.fileName ? 24 : 0 }}>
                    {state.fileName ? state.fileSize : 'CAS statement, broker screenshot, or any portfolio file'}
                </div>

                {state.fileName && (
                    <button
                        onClick={clearFile}
                        style={{ marginTop: 20, background: 'var(--negative-bg, #FEF2F2)', color: 'var(--negative, #EF4444)', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, padding: '9px 22px', borderRadius: 'var(--r-full)', border: '1px solid var(--negative, #EF4444)', cursor: 'pointer' }}
                    >
                        Remove file
                    </button>
                )}

                {!state.fileName && !isFileLocked && (
                    <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        style={{ marginTop: 20, background: 'var(--accent)', color: 'white', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, padding: '9px 22px', borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer' }}
                    >
                        Browse files
                    </button>
                )}
                {isFileLocked && (
                    <div style={{ marginTop: 20, color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500 }}>
                        Locked (Clear text below to upload)
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    disabled={isFileLocked}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Paste text fallback */}
            <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or paste text instead</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ position: 'relative' }}>
                <textarea
                    ref={textareaRef}
                    value={state.pastedText}
                    onChange={(e) => {
                        if (!isTextLocked) {
                            updateState({ pastedText: e.target.value, fileData: null, fileType: null, fileName: null, fileSize: null });
                        }
                    }}
                    disabled={isTextLocked}
                    placeholder={isTextLocked ? "Locked (Remove file above to paste text)" : "Paste your holdings, transaction history, or any portfolio data here..."}
                    style={{
                        width: '100%', minHeight: 100, boxSizing: 'border-box',
                        border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                        padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontSize: 14,
                        color: 'var(--text-primary)', background: isTextLocked ? '#F3F4F6' : 'var(--bg-main)',
                        resize: 'vertical', lineHeight: 1.6, outline: 'none',
                        cursor: isTextLocked ? 'not-allowed' : 'text',
                        opacity: isTextLocked ? 0.6 : 1,
                    }}
                    onFocus={(e) => {
                        if (!isTextLocked) {
                            e.target.style.border = '1px solid var(--accent)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)';
                        }
                    }}
                    onBlur={(e) => {
                        if (!isTextLocked) {
                            e.target.style.border = '1px solid var(--border)';
                            e.target.style.boxShadow = 'none';
                        }
                    }}
                />

                {isTextLocked && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'not-allowed' }} />
                )}
            </div>

            {/* Continue button */}
            <button
                onClick={handleContinue}
                disabled={!canContinue}
                style={{
                    width: '100%', height: 52, marginTop: 24,
                    background: canContinue ? 'linear-gradient(135deg,#7C3AED,#5B21B6)' : 'var(--border)',
                    color: canContinue ? 'white' : 'var(--text-muted)',
                    fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700,
                    borderRadius: 'var(--r-full)', border: 'none',
                    cursor: canContinue ? 'pointer' : 'not-allowed',
                    opacity: canContinue ? 1 : 0.4,
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { if (canContinue) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
                Customize the analysis
            </button>
        </div >
    );
}

function ReadyScreen({ state, updateState, goTo, focusTextareaOnLanding }) {
    const fileInputRef = useRef(null);

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

            {/* Customize row — navigates to customize screen */}
            <div
                onClick={() => goTo('customize')}
                style={{ marginTop: 16, background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F6F4F1'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Customize analysis</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Optional — focus on specific areas</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>

            {/* Short note */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Analysis will cover: risks, allocation, diversification, and key insights.
                </p>
            </div>

            {/* Analyze button */}
            <button
                onClick={() => goTo('analyzing')}
                style={{ width: '100%', height: 52, marginTop: 24, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
                Analyze Portfolio
            </button>
        </div>
    );
}

function CustomizeScreen({ state, updateState, goTo }) {
    const [instructions, setInstructions] = useState(state.customInstructions || '');

    const chips = [
        { label: 'Risk focus', phrase: 'Focus on risks and red flags.' },
        { label: 'Concise output', phrase: 'Keep the output concise.' },
        { label: 'Diversification', phrase: 'Analyse diversification gaps.' },
        { label: 'Simple language', phrase: 'Use simple, non-technical language.' },
        { label: 'Tax efficiency', phrase: 'Include tax efficiency insights.' },
        { label: 'Long-term view', phrase: 'Focus on long-term positioning.' },
    ];

    const isChipSelected = (phrase) => instructions.includes(phrase);

    const toggleChip = (phrase) => {
        if (isChipSelected(phrase)) {
            setInstructions((prev) => prev.replace(phrase, '').replace(/\s{2,}/g, ' ').trim());
        } else {
            setInstructions((prev) => (prev ? `${prev.trim()} ${phrase}` : phrase));
        }
    };

    const handleAnalyze = () => {
        updateState({ customInstructions: instructions });
        goTo('analyzing');
    };

    return (
        <div className="state-container" style={{ maxWidth: 560, margin: '0 auto' }}>
            {/* Back nav */}
            <div
                onClick={() => goTo('ready')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 24, width: 'fit-content' }}
                onMouseEnter={(e) => e.currentTarget.querySelector('span').style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.querySelector('span').style.color = 'var(--text-secondary)'}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>Back</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Customize analysis</h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Optional — the AI runs a complete analysis by default.</p>
            </div>

            {/* Textarea */}
            <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={"Focus on diversification risk\nHighlight red flags\nKeep output concise"}
                style={{
                    width: '100%', minHeight: 120, boxSizing: 'border-box',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                    padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontSize: 14,
                    color: 'var(--text-primary)', background: 'white',
                    resize: 'vertical', lineHeight: 1.6, outline: 'none',
                }}
                onFocus={(e) => { e.target.style.border = '1px solid var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid var(--border)'; e.target.style.boxShadow = 'none'; }}
            />

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {chips.map((chip) => {
                    const selected = isChipSelected(chip.phrase);
                    return (
                        <button
                            key={chip.label}
                            onClick={() => toggleChip(chip.phrase)}
                            style={{
                                border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
                                borderRadius: 'var(--r-full)',
                                padding: '8px 16px',
                                background: selected ? 'var(--accent-light)' : 'white',
                                color: selected ? 'var(--accent)' : 'var(--text-secondary)',
                                fontFamily: "'Inter',sans-serif", fontSize: 13,
                                fontWeight: selected ? 600 : 500,
                                cursor: 'pointer', transition: 'all 0.1s ease',
                            }}
                        >
                            {chip.label}
                        </button>
                    );
                })}
            </div>

            {/* Reassurance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Default analysis also works without this.</span>
            </div>

            {/* Analyze Now button */}
            <button
                onClick={handleAnalyze}
                style={{ width: '100%', height: 52, marginTop: 28, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
                Analyze Now
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
        <div className="state-container" style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Analysis complete</h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Generated just now</p>
            </div>

            {/* 6 Section Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SECTIONS.map((s, i) => {
                    const isDark = s.key === 'final_takeaway';
                    const isRisk = s.key === 'risks_red_flags';
                    const isOpportunity = s.key === 'improvement_opportunities';

                    return (
                        <div
                            key={s.key}
                            style={{
                                background: isDark ? 'linear-gradient(145deg, #18181b, #09090b)' : 'linear-gradient(180deg, #ffffff, #fafafa)',
                                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                                borderRadius: 'var(--r-lg)', padding: 24,
                                boxShadow: isDark ? '0 10px 40px -10px rgba(124,58,237,0.2)' : '0 4px 24px -6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                                animation: `card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                                animationDelay: `${i * 80}ms`,
                                opacity: 0,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {isDark && (
                                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at top right, rgba(124,58,237,0.1), transparent 40%)', pointerEvents: 'none' }} />
                            )}
                            {/* Card header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, position: 'relative', zIndex: 1 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isDark ? 'rgba(124,58,237,0.25)' : 'linear-gradient(135deg, #F3E8FF, #E9D5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isDark ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(124,58,237,0.1)' }}>
                                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: isDark ? '#C4B5FD' : 'var(--accent)' }}>{s.num}</span>
                                </div>
                                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: isDark ? 700 : (i === 0 ? 800 : 700), color: isDark ? '#A3E635' : 'var(--text-primary)', letterSpacing: '-0.01em' }}>{s.title}</span>
                            </div>

                            {/* Card content */}
                            {isRisk ? (
                                <div style={{ background: 'var(--negative-bg,#FEF2F2)', borderLeft: '3px solid var(--negative,#EF4444)', padding: '10px 14px', borderRadius: '0 6px 6px 0' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--negative,#EF4444)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'var(--negative,#EF4444)', lineHeight: 1.5, margin: 0 }}>{data[s.key]}</p>
                                    </div>
                                </div>
                            ) : isOpportunity ? (
                                <div style={{ background: 'var(--lime-bg,#F7FEE7)', borderLeft: '3px solid var(--lime,#A3E635)', padding: '10px 14px', borderRadius: '0 6px 6px 0' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#65A30D', lineHeight: 1.5, margin: 0 }}>{data[s.key]}</p>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ position: 'relative', zIndex: 1, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 400, color: isDark ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                                    {data[s.key]}
                                </p>
                            )}

                            {isDark && (
                                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 16, marginBottom: 0 }}>Made by 1000xDev</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Buttons */}
            <div style={{ marginTop: 24 }}>
                <button
                    onClick={onDownload}
                    style={{ width: '100%', height: 52, background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download Report
                </button>
                <button
                    onClick={onReset}
                    style={{ width: '100%', height: 48, marginTop: 10, background: 'transparent', border: '1.5px solid var(--border-strong,#D1D5DB)', color: 'var(--text-secondary)', fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, borderRadius: 'var(--r-full)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong,#D1D5DB)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    Analyze Another Portfolio
                </button>
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
                <LandingScreen state={analyzer} updateState={updateState} goTo={goTo} />
            )}
            {analyzer.screen === 'ready' && (
                <ReadyScreen state={analyzer} updateState={updateState} goTo={goTo} />
            )}
            {analyzer.screen === 'customize' && (
                <CustomizeScreen state={analyzer} updateState={updateState} goTo={goTo} />
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
