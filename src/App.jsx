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
                    <img src={logo} alt="Xylar Logo" style={{ height: 28, objectFit: 'contain' }} />
                </div>

                {/* Tab content */}
                {activeTab === 'analyzer' && <AnalyzerTab key="analyzer" />}
            </main>
        </div>
    );
}
