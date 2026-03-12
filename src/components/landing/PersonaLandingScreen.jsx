import React, { useState, useRef } from "react";
import logo from "../../assets/logo.png";
import "../../styles/persona-landing.css";

const PRIMARY = "#7c3bed";
const BUFFETT_AMBER = "#f59e0b";
const LYNCH_BLUE = "#3b82f6";
const DALIO_SLATE = "#64748b";

const PERSONAS = [
    { id: "buffett", name: "Warren Buffett", color: BUFFETT_AMBER, label: "BUFFETT" },
    { id: "lynch", name: "Peter Lynch", color: LYNCH_BLUE, label: "LYNCH" },
    { id: "dalio", name: "Ray Dalio", color: DALIO_SLATE, label: "DALIO" },
];

const PERSONA_INSIGHTS = {
    buffett: [
        { type: "VALUE SIGNAL", color: "#eab308", text: '"Your concentration in consumer staples suggests a search for durable competitive advantages. I like the moat around HUL, but check the entry price..."' },
        { type: "CONCENTRATION RISK", color: "#ef4444", text: '"42% of your capital is tied to high-beta tech. In Omaha, we call this leaning too far into the wind without a sturdy umbrella."' },
    ],
    lynch: [
        { type: "OBSERVATION", color: "#eab308", text: '"You hold 11 funds but the underlying stock overlap is 68%. Lynch would call this diworsification — the illusion of diversification without the benefit."' },
        { type: "VALUE SIGNAL", color: LYNCH_BLUE, text: '"Mid cap allocation at 28% aligns with Lynch\'s sweet spot. These are businesses large enough to be stable, small enough to still grow."' },
    ],
    dalio: [
        { type: "RISK", color: "#ef4444", text: '"Your portfolio correlation to the Nifty 50 is 0.89. In a drawdown, everything moves together. Consider adding uncorrelated assets."' },
        { type: "OBSERVATION", color: DALIO_SLATE, text: '"Diversification across 8 funds doesn\'t mean 8 different risk factors. Strip away the labels and count the real bets."' },
    ],
};

function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function PersonaLandingScreen({ state, updateState, goTo }) {
    const [activePersonaId, setActivePersonaId] = useState("buffett");
    const [isDragOver, setIsDragOver] = useState(false);
    const [portfolioText, setPortfolioText] = useState("");
    const fileInputRef = useRef(null);

    const insights = PERSONA_INSIGHTS[activePersonaId] || PERSONA_INSIGHTS.buffett;
    const activePersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];

    const handleFile = async (file) => {
        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        if (!isPdf && !isImage) return;
        const base64 = await readFileAsBase64(file);
        updateState({
            fileData: base64,
            fileType: isPdf ? "pdf" : "image",
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            pastedText: "",
        });
    };

    const handleFileInput = (e) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const canContinue = !!state.fileName || portfolioText.trim().length > 0;

    const handleContinue = () => {
        if (canContinue) goTo("ready");
    };

    return (
        <div
            className="persona-landing-root"
            style={{
                background: "#ffffff",
                minHeight: "100%",
                display: "flex", // Ensure it's flex for the split columns
            }}
        >
            {/* Left: Simulation — strict 55% */}
            <section
                style={{
                    flex: "0 0 55%",
                    maxWidth: "55%",
                    padding: "32px 48px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    background: "#F6F4F1", // Correct Stitch color
                    minWidth: 0,
                }}
            >
                <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 8
                }}>
                    XYLAR
                    <span style={{ color: PRIMARY }}>AI</span>
                </div>

                {/* Persona switcher — active = purple bg + white icon, inactive = gray outline */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {PERSONAS.map((p) => {
                            const isActive = activePersonaId === p.id;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setActivePersonaId(p.id)}
                                    style={{
                                        marginLeft: p.id === "buffett" ? 0 : -8,
                                        padding: 2,
                                        border: isActive ? `3px solid ${PRIMARY}` : "2px solid #e2e8f0",
                                        borderRadius: "50%",
                                        background: "white",
                                        boxShadow: isActive ? "0 4px 12px rgba(124,58,237,0.25)" : "0 1px 2px rgba(0,0,0,0.05)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            background: isActive ? PRIMARY : "#f8fafc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: isActive ? "white" : "#94a3b8",
                                        }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", maxWidth: 160, margin: 0 }}>
                        Switch persona to change lens
                    </p>
                </div>

                <div className="persona-blur-wrap">
                    <h1
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.025em",
                            color: "#0f172a",
                            maxWidth: 520,
                            margin: 0,
                        }}
                    >
                        Analysing your portfolio as{" "}
                        <span style={{ color: PRIMARY, textDecoration: "underline", textUnderlineOffset: 6, textDecorationColor: "rgba(124,58,237,0.3)" }}>
                            {activePersona.name}
                        </span>{" "}
                        would.
                    </h1>

                    {/* Simulation panel — white card, LIVE SIMULATION top right */}
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: 16,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                            border: "1px solid #e2e8f0",
                            overflow: "hidden",
                            marginTop: 28,
                        }}
                    >
                        <div
                            style={{
                                padding: "12px 20px",
                                borderBottom: "1px solid #f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ display: "flex", gap: 5 }}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#cbd5e1" }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b", letterSpacing: "0.12em" }}>
                                LIVE SIMULATION
                            </span>
                        </div>
                        <div style={{ padding: "20px 24px 24px" }}>
                            {insights.map((ins, i) => (
                                <div
                                    key={i}
                                    style={{
                                        borderLeft: `4px solid ${ins.color}`,
                                        paddingLeft: 16,
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                        marginBottom: i < insights.length - 1 ? 16 : 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: ins.color,
                                            letterSpacing: "0.1em",
                                            display: "block",
                                            marginBottom: 4,
                                        }}
                                    >
                                        {ins.type}
                                    </span>
                                    <p style={{ fontSize: 15, lineHeight: 1.55, color: "#334155", margin: 0, fontStyle: "italic" }}>
                                        {ins.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer marquee — even spacing, seamless loop */}
                <div
                    style={{
                        marginTop: "auto",
                        paddingTop: 24,
                        borderTop: "1px solid #f1f5f9",
                        flexShrink: 0,
                        overflow: "hidden",
                    }}
                >
                    <div className="marquee">
                        <div className="marquee-content" style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>ISO 27001 Certified Security</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>AI-Powered by Xylar 4.0</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Trusted by 50k+ Indian Investors</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Bank-Grade Encryption</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            {/* Repeat for seamless -50% loop */}
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>ISO 27001 Certified Security</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>AI-Powered by Xylar 4.0</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Trusted by 50k+ Indian Investors</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Bank-Grade Encryption</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Right: Upload — strict 45% */}
            <aside
                className="persona-landing-aside"
                style={{
                    flex: "0 0 45%",
                    maxWidth: "45%",
                    background: "#ffffff",
                    borderLeft: "1px solid #f1f5f9",
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minWidth: 0,
                    height: "100vh",
                    position: "sticky",
                    top: 0
                }}
            >
                <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
                    <h2
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            color: "#0f172a",
                            marginBottom: 28,
                            marginTop: 32,
                            whiteSpace: "nowrap"
                        }}
                    >
                        Your portfolio. Their lens.
                    </h2>

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: 24,
                            border: "1px solid #f1f5f9",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
                            padding: 36,
                        }}
                    >
                        {/* Upload zone — purple square icon (arrow + document) */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragOver ? PRIMARY : "rgba(124,58,237,0.2)"}`,
                                background: state.fileName ? "#f0fdf4" : "rgba(124,58,237,0.04)",
                                borderRadius: 14,
                                padding: 36,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <div
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 12,
                                    background: PRIMARY,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 14,
                                    color: "white",
                                }}
                            >
                                {state.fileName ? (
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 10 12 15 7 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                        <path d="M14 3h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                )}
                            </div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                                {state.fileName ? state.fileName : "Upload Portfolio"}
                            </h3>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                                {state.fileName ? state.fileSize : "PDF, Excel or CSV from your broker"}
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
                                onChange={handleFileInput}
                                style={{ display: "none" }}
                            />
                        </div>

                        {/* Divider */}
                        <div style={{ position: "relative", margin: "32px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "100%", height: "1px", background: "#f1f5f9" }}></div>
                        </div>

                        {/* Manual Paste Area */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginLeft: 4 }}>Paste portfolio text</label>
                            <textarea
                                value={portfolioText}
                                onChange={(e) => setPortfolioText(e.target.value)}
                                placeholder="Paste your holdings list or text from your statement..."
                                style={{
                                    width: "100%",
                                    height: 120,
                                    borderRadius: 14,
                                    border: "1px solid #e2e8f0",
                                    background: "#F6F4F1",
                                    padding: 16,
                                    fontSize: 14,
                                    fontFamily: "inherit",
                                    resize: "none",
                                    outline: "none",
                                    transition: "border-color 0.2s ease",
                                    color: "#334155"
                                }}
                            />
                            {portfolioText.length > 0 && (
                                <button
                                    onClick={() => setPortfolioText("")}
                                    style={{ alignSelf: "flex-end", background: "none", border: "none", color: PRIMARY, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "2px 4px", textTransform: "uppercase" }}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={!canContinue}
                                style={{
                                    width: "100%",
                                    background: canContinue ? PRIMARY : "#f1f5f9",
                                    color: canContinue ? "white" : "#94a3b8",
                                    padding: "14px 24px",
                                    borderRadius: 9999,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: canContinue ? "pointer" : "not-allowed",
                                    boxShadow: canContinue ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                Continue
                                <span style={{ fontSize: 15 }}>→</span>
                            </button>
                            <p style={{ textAlign: "center", fontSize: 9, color: "#94a3b8", marginTop: 12, letterSpacing: "0.1em", fontWeight: 700 }}>
                                NO LOGIN REQUIRED FOR PREVIEW
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
