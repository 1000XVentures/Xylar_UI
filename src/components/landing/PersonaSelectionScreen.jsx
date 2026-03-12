import React, { useState } from "react";
import "../../styles/persona-landing.css";

const PERSONAS = [
    {
        id: "buffett",
        name: "Warren Buffett",
        philosophy: "Buy great businesses. Hold forever.",
        focusItems: [
            { icon: "shield", title: "Business quality over price", detail: "Are these fundamentally great companies or are you paying too much for average ones?" },
            { icon: "schedule", title: "Long-term compounding potential", detail: "Which holdings have the earnings power to compound at 15%+ over the next decade?" },
            { icon: "priority_high", title: "Speculation vs investment", detail: "Flagging positions that are bets, not investments — where the upside is hope." }
        ]
    },
    {
        id: "munger",
        name: "Charlie Munger",
        philosophy: "Invert. Always invert.",
        focusItems: [
            { icon: "psychology", title: "Mental model violations", detail: "Identifying cognitive biases visible in your portfolio behaviour and decisions." },
            { icon: "center_focus_strong", title: "Concentration vs diversification", detail: "Do you have genuine high-conviction bets or just complexity masquerading as safety?" },
            { icon: "autorenew", title: "Inverted risk analysis", detail: "What would need to be true for this portfolio to catastrophically fail?" }
        ]
    },
    {
        id: "lynch",
        name: "Peter Lynch",
        philosophy: "Invest in what you understand.",
        focusItems: [
            { icon: "search", title: "Hidden gems and ten-bagger potential", detail: "Under-followed holdings with outsized growth potential the market is missing." },
            { icon: "bar_chart", title: "Diworsification check", detail: "Are you diversified or just diluted? Counting the funds that cancel each other." },
            { icon: "visibility", title: "Know what you own", detail: "Flagging any holdings you likely don't fully understand — a Lynch red flag." }
        ]
    },
    {
        id: "jhunjhunwala",
        name: "Rakesh Jhunjhunwala",
        philosophy: "Conviction and patience compound wealth.",
        focusItems: [
            { icon: "rocket_launch", title: "Earnings acceleration signals", detail: "Holdings where revenue is growing faster than the market currently prices in." },
            { icon: "public", title: "India macro positioning", detail: "How well does this portfolio capture the India consumption and growth story?" },
            { icon: "timer", title: "Patience premium", detail: "Identifying your highest-compounding holdings and whether you're holding long enough to realise the full return." }
        ]
    },
    {
        id: "risk",
        name: "Risk Manager",
        philosophy: "Protect the downside. Everything else follows.",
        focusItems: [
            { icon: "security", title: "Drawdown exposure", detail: "Estimated portfolio loss in a 2008-style scenario and where it concentrates." },
            { icon: "link", title: "Correlation and clustering", detail: "Holdings that will fall together in a crisis — the hidden concentration risk." },
            { icon: "account_balance_wallet", title: "Hidden cost liabilities", detail: "STCG, LTCG, and exit load exposure you haven't accounted for in your returns." }
        ]
    },
    {
        id: "tax",
        name: "Tax Optimizer",
        philosophy: "Every rupee saved in tax is a rupee compounded.",
        focusItems: [
            { icon: "calendar_today", title: "Harvest opportunities", detail: "Holdings eligible for tax loss harvesting to offset gains elsewhere in the portfolio." },
            { icon: "timer", title: "LTCG vs STCG threshold analysis", detail: "Which positions are days away from crossing the long-term threshold." },
            { icon: "show_chart", title: "Restructuring sequence", detail: "The optimal order to exit and re-enter positions to minimise total tax impact." }
        ]
    },
    {
        id: "index",
        name: "Index Challenger",
        philosophy: "Prove every active bet is worth the cost.",
        focusItems: [
            { icon: "compare_arrows", title: "Active vs passive scorecard", detail: "Are your active funds actually beating what a simple index fund would have done?" },
            { icon: "layers", title: "Closet indexing detection", detail: "Funds charging active fees while delivering index-like returns." },
            { icon: "monetization_on", title: "Fee drag on compounding", detail: "The real cost of active management over 10 and 20 year horizons." }
        ]
    },
    {
        id: "principles",
        name: "First Principles",
        philosophy: "Strip away assumptions. See what's actually there.",
        focusItems: [
            { icon: "blur_on", title: "True economic exposure", detail: "What macro and micro forces actually drive the value of these holdings?" },
            { icon: "refresh", title: "What you'd build from scratch", detail: "If starting fresh today with no legacy positions — would you buy any of this?" },
            { icon: "quiz", title: "Assumption audit", detail: "Every implicit assumption embedded in your current allocation — made explicit." }
        ]
    }
];

export default function PersonaSelectionScreen({ state, updateState, goTo }) {
    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [customNote, setCustomNote] = useState("");

    const selectedPersona = PERSONAS.find(p => p.id === selectedPersonaId);

    const handleAnalyze = () => {
        if (!selectedPersonaId) return;
        updateState({
            selectedPersona: selectedPersonaId,
            customNote: customNote
        });
        goTo("analyzing");
    };

    const handleSkip = () => {
        updateState({ selectedPersona: "default", customNote: "" });
        goTo("analyzing");
    };

    return (
        <div style={{ background: "#ffffff", minHeight: "100dvh", padding: "40px 24px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>

                {/* Back button */}
                <div style={{ marginBottom: 32 }}>
                    <button
                        onClick={() => goTo("landing")}
                        style={{
                            background: "none", border: "none", cursor: "pointer", padding: 0,
                            display: "flex", alignItems: "center", gap: 6,
                            color: "#94a3b8",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>Back</span>
                    </button>
                </div>

                {/* File Strip */}
                <div style={{
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: 999,
                    padding: "10px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 32,
                }}>
                    <div style={{
                        width: 20, height: 20, borderRadius: "50%", background: "#4ade80",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span className="material-symbols-outlined" style={{ color: "white", fontSize: 14 }}>check</span>
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                        {state.fileName || "Input Data"}
                    </span>
                    <span style={{ color: "#94a3b8" }}>·</span>
                    <button
                        onClick={() => goTo("landing")}
                        style={{
                            border: "none", background: "none", padding: 0, cursor: "pointer",
                            textDecoration: "underline", color: "#7c3aed",
                            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
                        }}
                    >
                        Change
                    </button>
                </div>

                <h1 style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                    fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.025em",
                    marginTop: 0,
                }}>
                    Choose your analyst.
                </h1>
                <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#64748b",
                    lineHeight: 1.7, maxWidth: 520, marginBottom: 32, marginTop: 0,
                }}>
                    Each analyst brings a different mental model to your portfolio. Tap one to see what they'll focus on.
                </p>

                {/* Persona Chips Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 32 }}>
                    {PERSONAS.map((p) => {
                        const isActive = selectedPersonaId === p.id;
                        const isDimmed = selectedPersonaId && !isActive;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPersonaId(p.id)}
                                style={{
                                    background: isActive ? "#7c3aed" : "white",
                                    border: isActive ? "1.5px solid #7c3aed" : "1px solid #e2e8f0",
                                    borderRadius: 999,
                                    padding: "10px 18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    boxShadow: isActive ? "0 4px 14px rgba(124,58,237,0.30)" : "0 1px 2px rgba(0,0,0,0.05)",
                                    transition: "all 0.2s ease",
                                    opacity: isDimmed ? 0.45 : 1,
                                    transform: isActive ? "scale(1.04)" : isDimmed ? "scale(0.97)" : "scale(1)",
                                }}
                            >
                                <div style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(124,58,237,0.1)",
                                    flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: isActive ? "white" : "#7c3aed", fontSize: 16 }}>person</span>
                                </div>
                                <span style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: isActive ? 700 : 600,
                                    color: isActive ? "white" : "#0f172a",
                                    whiteSpace: "nowrap",
                                }}>
                                    {p.name.split(" ").pop()}
                                </span>
                                {isActive && <span className="material-symbols-outlined" style={{ fontSize: 12, color: "white" }}>check</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Preview Card Area */}
                <div style={{ minHeight: 360 }}>
                    {!selectedPersonaId ? (
                        <div style={{
                            background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 20,
                            padding: "48px 28px", textAlign: "center",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#cbd5e1", display: "block", marginBottom: 12 }}>person_search</span>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#94a3b8", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
                                Tap a persona above to see their analysis approach.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            background: "white", border: "1px solid #e2e8f0", borderRadius: 20,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden",
                        }}>
                            {/* Purple accent bar */}
                            <div style={{ height: 4, width: "100%", background: "#7c3aed" }} />

                            {/* Card Header */}
                            <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%",
                                    background: "rgba(124,58,237,0.12)",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: "#7c3aed", fontSize: 28 }}>person</span>
                                </div>
                                <div>
                                    <h2 style={{
                                        fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700,
                                        color: "#0f172a", margin: 0,
                                    }}>
                                        {selectedPersona.name}
                                    </h2>
                                    <p style={{
                                        fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#64748b",
                                        fontStyle: "italic", marginTop: 4, marginBottom: 0,
                                    }}>
                                        "{selectedPersona.philosophy}"
                                    </p>
                                </div>
                            </div>

                            {/* Focus Items */}
                            <div style={{ padding: "0 28px" }}>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700,
                                    color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, marginTop: 0,
                                }}>
                                    WHAT THIS ANALYSIS WILL COVER
                                </p>
                                {selectedPersona.focusItems.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex", gap: 12, padding: "12px 0",
                                        borderBottom: idx < 2 ? "1px solid #f1f5f9" : "none",
                                    }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "rgba(124,58,237,0.08)",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#7c3aed" }}>{item.icon}</span>
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{item.title}</p>
                                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#64748b", lineHeight: 1.55, marginTop: 3, marginBottom: 0 }}>{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Custom Note */}
                            <div style={{ padding: "20px 28px 0" }}>
                                <label style={{
                                    display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12,
                                    fontWeight: 600, color: "#64748b", marginBottom: 8,
                                }}>
                                    Add anything specific (optional)
                                </label>
                                <textarea
                                    value={customNote}
                                    onChange={(e) => setCustomNote(e.target.value)}
                                    placeholder="E.g. Focus especially on my small cap exposure..."
                                    style={{
                                        width: "100%", minHeight: 72, border: "1px solid #e2e8f0", borderRadius: 12,
                                        padding: "12px 14px", fontFamily: "'Inter', sans-serif", fontSize: 13,
                                        color: "#0f172a", background: "#f8fafc", outline: "none", resize: "vertical",
                                        boxSizing: "border-box", transition: "border 0.15s, box-shadow 0.15s",
                                    }}
                                    onFocus={(e) => { e.target.style.border = "1px solid #7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.10)"; e.target.style.background = "#ffffff"; }}
                                    onBlur={(e) => { e.target.style.border = "1px solid #e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                                />
                            </div>

                            {/* CTA */}
                            <div style={{ padding: "20px 28px 28px" }}>
                                <button
                                    onClick={handleAnalyze}
                                    style={{
                                        width: "100%", height: 54, background: "#7c3aed", borderRadius: 999,
                                        border: "none", color: "white",
                                        fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700,
                                        cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.35)"; e.currentTarget.style.transform = "none"; }}
                                >
                                    Analyze as {selectedPersona.name.split(" ").pop()} →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skip Link */}
                <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 48 }}>
                    <button
                        onClick={handleSkip}
                        style={{
                            border: "none", background: "none", color: "#94a3b8",
                            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                            cursor: "pointer", textDecoration: "underline",
                        }}
                    >
                        Skip — run default analysis
                    </button>
                </div>

            </div>
        </div>
    );
}
