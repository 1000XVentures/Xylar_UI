import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AnalyzerTab from './components/tabs/AnalyzerTab';
import TrendsTab from './components/tabs/TrendsTab';
import AboutTab from './components/tabs/AboutTab';

import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/components.css';
import './styles/states.css';
import './styles/animations.css';
import './styles/trends.css';
import './styles/about.css';
import './styles/responsive.css';

const MOBILE_TABS = [
    {
        id: 'analyzer', label: 'Analyze',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>,
    },
    {
        id: 'trends', label: 'Trends',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="18 4 22 8 18 12" /></svg>,
    },
    {
        id: 'about', label: 'About',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" /></svg>,
    },
];

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                                <rect x="2" y="11" width="4" height="8" rx="1.5" fill="white" opacity="0.85" />
                                <rect x="8" y="7" width="4" height="9" rx="1.5" fill="white" opacity="0.9" />
                                <rect x="14" y="2" width="4" height="8" rx="1.5" fill="#A3E635" />
                                <rect x="14" y="12" width="4" height="7" rx="1.5" fill="white" opacity="0.75" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: 'white' }}>Xylar</span>
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === 'analyzer' && <AnalyzerTab key="analyzer" />}
                {activeTab === 'trends' && <TrendsTab key="trends" />}
                {activeTab === 'about' && <AboutTab key="about" onSwitchToAnalyzer={() => setActiveTab('analyzer')} />}

                {/* Mobile fixed bottom nav */}
                <nav className="mobile-bottom-nav-tabs">
                    {MOBILE_TABS.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className={`mobile-nav-tab${isActive ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {isActive && <span className="mobile-nav-dot" />}
                                {tab.icon}
                                <span className="mobile-nav-label">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}
