import React, { useState } from 'react';

export default function Landing({ onStateChange }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [selectedChips, setSelectedChips] = useState([]);
    const [inputText, setInputText] = useState('');
    const [hasFile, setHasFile] = useState(false);
    const [fileName, setFileName] = useState('');

    const chips = [
        "Diversification", "Risk focus", "Simple language",
        "Concise output", "Tax efficiency", "Long-term view"
    ];

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setFileName(file.name);
        setHasFile(true);
    };

    const removeFile = () => {
        setFileName('');
        setHasFile(false);
    };

    const toggleChip = (chip) => {
        setSelectedChips(prev =>
            prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
        );
    };

    const canContinue = hasFile || inputText.length > 5;

    return (
        <div className="state-container">
            <div className="landing-columns">
                {/* Left Column */}
                <div className="landing-left">
                    <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--accent)",
                        marginBottom: "14px",
                        fontWeight: "700"
                    }}>
                        AI Portfolio Analyzer
                    </div>

                    <h1 className="landing-headline" style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "46px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: "1.08",
                        letterSpacing: "-0.025em",
                        marginBottom: "18px"
                    }}>
                        Upload your portfolio.<br />
                        <span style={{ color: "#444" }}>Get instant intelligence.</span>
                    </h1>

                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "15px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.75",
                        maxWidth: "460px",
                        marginBottom: "36px"
                    }}>
                        Upload a PDF, paste a screenshot, or type your holdings.<br />
                        AI will surface the insights that matter — in under 60 seconds.
                    </p>

                    <div className="card-base">
                        {!hasFile ? (
                            <div
                                className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "10px" }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginTop: "10px" }}>
                                    Drag and drop your PDF or screenshot
                                </div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                                    PDF, PNG, JPG — up to 10MB
                                </div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--accent)", marginTop: "10px", textDecoration: "underline", cursor: "pointer" }}>
                                    or browse files
                                </div>
                                <input type="file" onChange={handleFileInput} accept=".pdf,.png,.jpg,.jpeg" />
                            </div>
                        ) : (
                            <div className="upload-ready">
                                <div className="check-anim" style={{
                                    width: "40px", height: "40px", background: "var(--lime)",
                                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{fileName}</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>File uploaded</div>
                                </div>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div onClick={removeFile} style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--accent)", fontWeight: 500, textDecoration: "underline", cursor: "pointer" }}>Replace</div>
                                </div>
                            </div>
                        )}

                        {!hasFile && (
                            <div style={{ margin: "20px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)" }}>or</div>
                                <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                            </div>
                        )}

                        {!hasFile && (
                            <div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                                    Paste portfolio text
                                </div>
                                <textarea
                                    className="textarea-input"
                                    placeholder="Paste your holdings, transaction history, or any portfolio data here..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                ></textarea>
                            </div>
                        )}

                        <div
                            onClick={() => setCustomizeOpen(!customizeOpen)}
                            style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                Customize analysis
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: customizeOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }}>
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>

                        <div className={`expanded-customize ${customizeOpen ? 'open' : ''}`}>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px" }}>
                                What should the analysis focus on?
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                                {chips.map(chip => (
                                    <div
                                        key={chip}
                                        className={`chip ${selectedChips.includes(chip) ? 'selected' : ''}`}
                                        onClick={() => toggleChip(chip)}
                                    >
                                        {chip}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                className="textarea-input"
                                style={{ minHeight: "72px" }}
                                placeholder="E.g. Focus on diversification risk and keep output concise..."
                            ></textarea>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                                Optional — analysis runs without this.
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ marginTop: "20px" }}
                            disabled={!canContinue}
                            onClick={() => onStateChange('analyzing')}
                        >
                            {hasFile ? "Analyze Portfolio →" : "Customize the analysis →"}
                        </button>

                        {hasFile && (
                            <div style={{ marginTop: "12px", display: "flex", gap: "6px", alignItems: "center" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)" }}>
                                    Analysis will cover: portfolio summary, diversification, risks, opportunities, and a recommendation.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="landing-right">
                    <div className="card-base" style={{ position: "sticky", top: "36px" }}>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px" }}>
                            Your analysis includes
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {/* Row 1 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Portfolio Summary</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>Total picture of your holdings</div>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Key Observations</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>Patterns in your investment behaviour</div>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v10l8.5 4.5"></path></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Diversification</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>Concentration risk and category balance</div>
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Risks & Red Flags</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>What to watch for immediately</div>
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Improvement Opportunities</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>Where to optimise for better outcomes</div>
                                </div>
                            </div>

                            {/* Row 6 */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 0" }}>
                                <div style={{ width: "36px", height: "36px", flexShrink: 0, background: "var(--accent-light)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Final Takeaway</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "2px" }}>One clear action to take next</div>
                                </div>
                            </div>

                        </div>

                        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--text-muted)" }}>
                                Your data is processed securely and never stored.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
