import React from 'react';

export default function ErrorState({ onRetry, onSwitchToText }) {
    return (
        <div className="state-container" style={{
            minHeight: "calc(100vh - 112px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
        }}>

            <div className="error-orb">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>

            <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginTop: "28px",
                marginBottom: "10px"
            }}>
                We couldn't process that file.
            </h2>

            <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "var(--text-muted)",
                maxWidth: "380px",
                textAlign: "center",
                lineHeight: 1.7
            }}>
                The file may be too small, blurry, or unsupported.<br />
                Try a clearer PDF or paste the text directly.
            </p>

            <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "12px", width: "300px" }}>
                <button
                    onClick={onRetry}
                    style={{
                        background: "linear-gradient(135deg, var(--accent) 0%, #5B21B6 100%)",
                        height: "52px", borderRadius: "var(--r-full)", color: "white",
                        fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, border: "none",
                        cursor: "pointer"
                    }}
                >
                    Upload again
                </button>
                <button
                    onClick={onSwitchToText}
                    style={{
                        background: "transparent", border: "1.5px solid var(--accent)",
                        height: "52px", borderRadius: "var(--r-full)", color: "var(--accent)",
                        fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700,
                        cursor: "pointer"
                    }}
                >
                    Paste text instead
                </button>
            </div>

        </div>
    );
}
