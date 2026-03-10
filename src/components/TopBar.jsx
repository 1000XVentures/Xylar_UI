import React from 'react';

export default function TopBar() {
    return (
        <>
            <div className="top-bar">
                <div className="breadcrumb">
                    Xylar <span className="breadcrumb-sep">/</span> AI Portfolio Analyzer
                </div>
                <div className="powered-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)">
                        <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
                    </svg>
                    Made by 1000xDev
                </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="mobile-top-bar">
                <div style={{ width: "32px", height: "32px", background: "var(--accent)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
                    </svg>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-sidebar)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
            </div>
        </>
    );
}
