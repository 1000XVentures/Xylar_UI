import React from 'react';
import logo from '../assets/logo.png';
import '../styles/sidebar.css';

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo" onClick={() => onTabChange('analyzer')}>
                <img src={logo} alt="Xylar Logo" />
            </div>

            <div className="sidebar-divider" />

            {/* Bottom — avatar */}
            <div className="sidebar-bottom" style={{ marginTop: 'auto' }}>
                <div className="sidebar-avatar">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            </div>
        </aside>
    );
}
