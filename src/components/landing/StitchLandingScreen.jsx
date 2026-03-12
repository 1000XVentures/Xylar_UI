import React, { useState, useRef } from "react";
import "../../styles/stitch-landing.css";

// ─── Helpers (aligned with AnalyzerTab) ─────────────────────────────────────
function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const IconUpload = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 15q.825 0 1.413-.588T14 13V6.825l.9.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7l-2.6-2.6q-.15-.15-.325-.212T12.6 3.4q-.2 0-.375.063T12 3.675L9.4 6.275q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275l.9-.9V13q0 .825.588 1.413T12 15ZM6 20q-.825 0-1.413-.588T4 18v-2q0-.425.288-.713T5 15q.425 0 .713.288T6 16v2h12v-2q0-.425.288-.713T19 15q.425 0 .713.288T20 16v2q0 .825-.588 1.413T18 20H6Z" />
    </svg>
);

const FEATURES = [
    {
        icon: "pie_chart",
        title: "Asset Allocation",
        desc: "Deep dive into equity, debt, and cash ratios.",
    },
    {
        icon: "security",
        title: "Risk Profile",
        desc: "Understand your volatility and concentration risk.",
    },
    {
        icon: "trending_up",
        title: "Sector Analysis",
        desc: "See how much exposure you have to IT, Banking, etc.",
    },
    {
        icon: "payments",
        title: "Fee Optimization",
        desc: "Find hidden commissions and expense ratios.",
    },
    {
        icon: "account_balance",
        title: "Tax Efficiency",
        desc: "Identify opportunities for tax-loss harvesting.",
    },
    {
        icon: "auto_awesome",
        title: "AI Suggestions",
        desc: "Smart rebalancing tips based on your goals.",
    },
];

// Simple icon placeholder for feature icons (no Material Symbols font dependency)
function FeatureIcon({ name }) {
    const pathMap = {
        pie_chart:
            "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15v-4H7l5-6v4h3l-5 6z",
        security:
            "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
        trending_up:
            "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z",
        payments:
            "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
        account_balance:
            "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM4 22h16v-2H4v2zm0-16v2h16V6L12 2 4 6z",
        auto_awesome:
            "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
    };
    const d = pathMap[name] || pathMap.pie_chart;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ flexShrink: 0 }}
        >
            <path d={d} />
        </svg>
    );
}

export default function StitchLandingScreen({ state, updateState, goTo }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const canContinue = !!(state.fileName || state.pastedText?.length > 5);
    const primary = "#7c3bed";

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

    const clearFile = (e) => {
        e.stopPropagation();
        updateState({
            fileData: null,
            fileType: null,
            fileName: null,
            fileSize: null,
        });
    };

    const clearPastedText = () => {
        updateState({ pastedText: "" });
    };

    const handleContinue = () => {
        if (canContinue) goTo("ready");
    };

    return (
        <div
            className="stitch-landing"
            style={{
                minHeight: "100%",
                background: "var(--bg-main, #F6F4F1)",
                padding: "40px 24px 60px",
            }}
        >
            <div style={{ maxWidth: 1152, margin: "0 auto" }}>
                {/* Header */}
                <header style={{ maxWidth: 896, marginBottom: 48 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 16,
                            background: `${primary}1A`,
                            color: primary,
                            padding: "6px 12px",
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}
                    >
                        India Special Edition
                    </div>
                    <h1
                        className="syne-title"
                        style={{
                            fontFamily: "'Syne', 'Outfit', sans-serif",
                            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                            fontWeight: 700,
                            color: "var(--text-primary, #0f172a)",
                            lineHeight: 1.1,
                            letterSpacing: "-0.025em",
                            margin: 0,
                        }}
                    >
                        Upload your portfolio.
                        <br />
                        <span style={{ color: primary }}>
                            Get instant intelligence.
                        </span>
                    </h1>
                </header>

                {/* Grid: Upload left, Benefits right */}
                <div className="stitch-landing-grid">
                    {/* Left: Upload card */}
                    <div
                        style={{
                            background: "var(--bg-card, #fff)",
                            padding: 32,
                            borderRadius: 16,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid var(--border, #e2e8f0)",
                        }}
                    >
                        {/* Upload zone */}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragOver ? primary : `${primary}33`}`,
                                background: isDragOver
                                    ? `${primary}14`
                                    : state.fileName
                                      ? "#f0fdf4"
                                      : `${primary}0D`,
                                borderRadius: 16,
                                padding: "48px 24px",
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
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    background: state.fileName
                                        ? "#dcfce7"
                                        : "#fff",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                    color: state.fileName ? "#16a34a" : primary,
                                }}
                            >
                                {state.fileName ? (
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <IconUpload />
                                )}
                            </div>
                            <h3
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    marginBottom: 8,
                                }}
                            >
                                {state.fileName
                                    ? state.fileName
                                    : "Upload Zone"}
                            </h3>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "var(--text-muted, #64748b)",
                                    marginBottom: state.fileName ? 0 : 24,
                                    maxWidth: 280,
                                }}
                            >
                                {state.fileName
                                    ? state.fileSize
                                    : "Drop your CAS PDF, broker screenshot, or export file here"}
                            </p>
                            {!state.fileName && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    style={{
                                        background: primary,
                                        color: "white",
                                        padding: "12px 32px",
                                        borderRadius: 9999,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        border: "none",
                                        cursor: "pointer",
                                        boxShadow: `0 4px 14px ${primary}33`,
                                    }}
                                >
                                    Select Files
                                </button>
                            )}
                            {state.fileName && (
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    style={{
                                        marginTop: 12,
                                        background: "transparent",
                                        color: "#ef4444",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        border: "1px solid #fca5a5",
                                        padding: "6px 16px",
                                        borderRadius: 9999,
                                        cursor: "pointer",
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
                                style={{ display: "none" }}
                            />
                        </div>

                        {/* Or divider */}
                        <div
                            style={{
                                position: "relative",
                                padding: "24px 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: 1,
                                        background: "var(--border)",
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    position: "relative",
                                    background: "var(--bg-card)",
                                    padding: "0 16px",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                }}
                            >
                                or
                            </span>
                        </div>

                        {/* Paste area */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "var(--text-secondary)",
                                    marginBottom: 12,
                                    marginLeft: 4,
                                }}
                            >
                                Paste portfolio text
                            </label>
                            <textarea
                                value={state.pastedText || ""}
                                onChange={(e) =>
                                    updateState({
                                        pastedText: e.target.value,
                                    })
                                }
                                placeholder="Paste your holdings list or text from your statement..."
                                style={{
                                    width: "100%",
                                    height: 128,
                                    boxSizing: "border-box",
                                    borderRadius: 16,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-main)",
                                    padding: 16,
                                    fontSize: 14,
                                    fontFamily: "inherit",
                                    resize: "none",
                                    outline: "none",
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={clearPastedText}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: primary,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>

                        {/* Continue CTA */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={!canContinue}
                            style={{
                                width: "100%",
                                marginTop: 24,
                                height: 54,
                                background: canContinue
                                    ? `linear-gradient(135deg, ${primary}, #5B21B6)`
                                    : "rgba(0,0,0,0.06)",
                                color: canContinue
                                    ? "white"
                                    : "rgba(0,0,0,0.35)",
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: "'Syne','Outfit',sans-serif",
                                borderRadius: 9999,
                                border: "none",
                                cursor: canContinue
                                    ? "pointer"
                                    : "not-allowed",
                                boxShadow: canContinue
                                    ? `0 8px 24px -10px ${primary}66`
                                    : "none",
                            }}
                        >
                            Customize the analysis →
                        </button>
                    </div>

                    {/* Right: What you'll get */}
                    <div
                        style={{
                            background: "var(--bg-card)",
                            padding: 32,
                            borderRadius: 16,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <h2
                            className="syne-title"
                            style={{
                                fontFamily: "'Syne','Outfit',sans-serif",
                                fontSize: 24,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                marginBottom: 32,
                                marginTop: 0,
                            }}
                        >
                            What you'll get
                        </h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 24,
                            }}
                        >
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            flexShrink: 0,
                                            background: `${primary}1A`,
                                            borderRadius: 12,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: primary,
                                        }}
                                    >
                                        <FeatureIcon name={f.icon} />
                                    </div>
                                    <div>
                                        <h4
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 700,
                                                color: "var(--text-primary)",
                                                margin: "0 0 4px",
                                            }}
                                        >
                                            {f.title}
                                        </h4>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: "var(--text-muted)",
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Trust badge */}
                        <div
                            style={{
                                marginTop: 40,
                                padding: 16,
                                background: "var(--bg-main)",
                                borderRadius: 16,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                            }}
                        >
                            <span
                                style={{
                                    color: "var(--text-muted)",
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                Your data is end-to-end encrypted. We never
                                share your portfolio information with third
                                parties.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer
                    style={{
                        maxWidth: 1152,
                        marginTop: 64,
                        paddingTop: 32,
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 24,
                    }}
                >
                    <div style={{ display: "flex", gap: 24 }}>
                        <a
                            href="#"
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text-muted)",
                                textDecoration: "none",
                            }}
                        >
                            Documentation
                        </a>
                        <a
                            href="#"
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text-muted)",
                                textDecoration: "none",
                            }}
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text-muted)",
                                textDecoration: "none",
                            }}
                        >
                            Support
                        </a>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                            }}
                        >
                            Powered by Xylar AI 2.0
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
