import React, { useState } from 'react';
import logo from './assets/logo.png';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AnalyzerTab from './components/tabs/AnalyzerTab';

import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/components.css';
import './styles/states.css';
import './styles/animations.css';
import './styles/responsive.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('analyzer');

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="main-content" style={{ overflow: 'auto' }}>
                {/* Desktop top bar */}
                <TopBar />

                {/* Mobile fixed top bar */}
                <div className="mobile-topbar-fixed">
                    <img src={logo} alt="Xylar Logo" style={{ height: 26, objectFit: 'contain' }} />
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '999px',
                        padding: '5px 12px',
                    }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#7C3AED">
                            <path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" />
                        </svg>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em' }}>
                            AI Portfolio Analyzer
                        </span>
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === 'analyzer' && <AnalyzerTab key="analyzer" />}
            </main>
        </div>
    );
}
