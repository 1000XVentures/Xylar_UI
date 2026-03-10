import React, { useState, useEffect } from 'react';

export default function Analyzing({ onProgressComplete }) {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "Reading your portfolio data...",
        "Identifying patterns and signals...",
        "Assessing diversification...",
        "Checking for risks and red flags...",
        "Generating your personalised report..."
    ];

    useEffect(() => {
        // Artificial progress to 88% over 10 seconds
        const duration = 10000;
        const intervalTime = 50;
        const maxProgress = 88;
        const steps = duration / intervalTime;
        const increment = maxProgress / steps;

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= maxProgress) {
                    clearInterval(progressTimer);
                    return maxProgress;
                }
                return prev + increment;
            });
        }, intervalTime);

        // Message cycle every 2.5s
        const messageTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2500);

        return () => {
            clearInterval(progressTimer);
            clearInterval(messageTimer);
        };
    }, []);

    return (
        <div className="state-container" style={{
            minHeight: "calc(100vh - 112px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
        }}>

            <div className="analyze-orb">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
                </svg>
            </div>

            <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "30px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginTop: "28px",
                marginBottom: "10px"
            }}>
                Analyzing your portfolio...
            </h2>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "var(--text-muted)"
            }}>
                Extracting content and generating insights.
            </div>

            <div className="progress-track" style={{ marginTop: "36px" }}>
                <div className="progress-fill" style={{ width: `${progress}%`, transition: "width 0.1s linear" }}></div>
            </div>

            <div className="status-cycle" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "16px",
                height: "20px"
            }}>
                {messages[messageIndex]}
            </div>

            <div style={{ marginTop: "48px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-muted)" }}>
                    Your data is analyzed securely and never stored.
                </div>
            </div>

            {/* Dev button to bypass wait */}
            <button
                onClick={() => onProgressComplete({})}
                style={{ marginTop: "40px", fontSize: "10px", color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
                [Dev: Skip Timer]
            </button>

        </div>
    );
}
