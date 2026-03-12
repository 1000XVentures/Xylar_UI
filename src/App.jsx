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
            <main className="main-content" style={{ overflow: 'auto' }}>
                {/* Tab content */}
                {activeTab === 'analyzer' && <AnalyzerTab key="analyzer" />}
            </main>
        </div>
    );
}
