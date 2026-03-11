import React, { useState } from 'react';

const REPORTS = [
    { date: 'Mar 10, 2026', score: 72, holdings: 23, value: '₹24.5L', duration: '14 sec', scoreBg: '#F7FEE7', scoreColor: '#3F6212' },
    { date: 'Feb 15, 2026', score: 68, holdings: 21, value: '₹22.1L', duration: '12 sec', scoreBg: '#FFFBEB', scoreColor: '#92400E' },
    { date: 'Jan 3, 2026', score: 74, holdings: 19, value: '₹20.8L', duration: '16 sec', scoreBg: '#F7FEE7', scoreColor: '#3F6212' },
    { date: 'Dec 1, 2025', score: 81, holdings: 18, value: '₹19.2L', duration: '11 sec', scoreBg: '#DCFCE7', scoreColor: '#166534' },
    { date: 'Oct 20, 2025', score: 65, holdings: 16, value: '₹17.5L', duration: '13 sec', scoreBg: '#FEF2F2', scoreColor: '#B91C1C' },
];

const FILTERS = ['All', 'This Month', 'Last Quarter', '2025'];

export default function Reports({ onRunNew }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [search, setSearch] = useState('');

    return (
        <div className="state-container" style={{ padding: '36px 40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>My Reports</h1>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Your past portfolio analyses</p>
                </div>
                <button
                    onClick={onRunNew}
                    style={{ height: '44px', padding: '0 24px', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', borderRadius: '9999px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,.28)' }}
                >
                    Run New Analysis →
                </button>
            </div>

            {/* Search + Filters */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        placeholder="Search reports..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', height: '38px', paddingLeft: '36px', paddingRight: '12px', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-primary)', background: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            style={{
                                height: '36px', padding: '0 16px', borderRadius: '9999px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                background: activeFilter === f ? '#7C3AED' : 'white',
                                color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                                border: activeFilter === f ? 'none' : '1px solid var(--border)',
                                transition: 'all 0.15s',
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Report cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {REPORTS.map((r, i) => (
                    <div
                        key={i}
                        className="card-base"
                        style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                    >
                        {/* Icon */}
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600 }}>Portfolio Analysis</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{r.date} · {r.duration} analysis</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {[`${r.holdings} holdings`, `${r.score}/100`, r.value].map(chip => (
                                    <span key={chip} style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '3px 10px', borderRadius: '9999px', border: '1px solid var(--border)' }}>{chip}</span>
                                ))}
                            </div>
                        </div>

                        {/* Score badge */}
                        <div style={{ textAlign: 'center', minWidth: '64px' }}>
                            <div style={{ background: r.scoreBg, borderRadius: '12px', padding: '10px 14px' }}>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', fontWeight: 800, color: r.scoreColor, lineHeight: 1 }}>{r.score}</div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: r.scoreColor, opacity: 0.7 }}>/100</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                            <button style={{ height: '34px', padding: '0 16px', borderRadius: '9999px', border: '1.5px solid #7C3AED', background: 'transparent', color: '#7C3AED', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            <div style={{ marginTop: '16px', border: '1.5px dashed var(--border)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-muted)' }}>No more reports · Analyse your portfolio regularly for better tracking</div>
            </div>
        </div>
    );
}
