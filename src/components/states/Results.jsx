import React, { useState, useEffect } from 'react';

// ─── Chart Components ─────────────────────────────────────────────────────────

function DonutChart({ data }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const cx = 18, cy = 18, r = 15.9155;
    const circ = 2 * Math.PI * r; // ~100

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {/* Donut */}
            <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0EDE8" strokeWidth="3" />
                    {data.map((item, i) => {
                        const pct = (item.value / total) * 100;
                        const dash = `${pct} ${100 - pct}`;
                        const offset = -cumulative;
                        cumulative += pct;
                        return (
                            <path
                                key={i}
                                d={`M${cx} 2.0845 a ${r} ${r} 0 0 1 0 31.831 a ${r} ${r} 0 0 1 0 -31.831`}
                                fill="none"
                                stroke={item.color}
                                strokeDasharray={dash}
                                strokeDashoffset={offset}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>100%</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: 'var(--text-muted)' }}>Allocated</span>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
                {data.map((item, i) => (
                    <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-main)', borderRadius: 'var(--r-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}%</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>{item.rupees}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectorBars({ sectors }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { setTimeout(() => setAnimated(true), 200); }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sectors.map((s, i) => (
                <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>{s.value}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#EEEAE6', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            background: `linear-gradient(90deg, rgba(124,58,237,0.5) 0%, #7C3AED 100%)`,
                            borderRadius: '10px',
                            width: animated ? `${s.value}%` : '0%',
                            transition: `width ${0.6 + i * 0.1}s cubic-bezier(0.4,0,0.2,1)`
                        }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function HealthCircle({ score }) {
    const pct = score || 0;
    const r = 15.9155;
    return (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#EEE" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="var(--lime)" strokeDasharray={`${pct}, 100`} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{pct}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>/ 100</span>
            </div>
        </div>
    );
}

function Sparkline() {
    // Static representative data for 12 months
    const portfolioPoints = [40, 38, 45, 42, 50, 55, 52, 60, 68, 65, 75, 80];
    const niftyPoints = [40, 42, 44, 41, 48, 51, 50, 55, 58, 60, 62, 68];
    const w = 320, h = 80;
    const maxY = 85, minY = 30;

    const toPath = (pts) => pts.map((v, i) => {
        const x = (i / (pts.length - 1)) * w;
        const y = h - ((v - minY) / (maxY - minY)) * h;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const toArea = (pts) => {
        const linePath = toPath(pts);
        const lastX = w, lastY = h, firstY = h;
        return `${linePath} L ${lastX} ${h} L 0 ${h} Z`;
    };

    return (
        <div>
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', height: '80px' }}>
                {/* Area fills */}
                <path d={toArea(niftyPoints)} fill="rgba(148,163,184,0.08)" />
                <path d={toArea(portfolioPoints)} fill="rgba(124,58,237,0.08)" />
                {/* Lines */}
                <path d={toPath(niftyPoints)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
                <path d={toPath(portfolioPoints)} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
                {/* End dots */}
                <circle cx={w} cy={h - ((portfolioPoints[portfolioPoints.length - 1] - minY) / (maxY - minY)) * h} r="4" fill="#7C3AED" />
                <circle cx={w} cy={h - ((niftyPoints[niftyPoints.length - 1] - minY) / (maxY - minY)) * h} r="3" fill="#94a3b8" />
            </svg>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '3px', background: '#7C3AED', borderRadius: '2px' }}></div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>Your Portfolio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '2px', background: '#94a3b8', borderRadius: '2px', backgroundImage: 'repeating-linear-gradient(90deg,#94a3b8 0,#94a3b8 4px,transparent 4px,transparent 8px)' }}></div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>Nifty 50</span>
                </div>
            </div>
        </div>
    );
}

// ─── Main Results Component ────────────────────────────────────────────────────

const ALLOCATION_DATA = [
    { label: 'Equity', value: 58, color: '#7C3AED', rupees: '₹14.2L' },
    { label: 'Mutual Funds', value: 22, color: '#A3E635', rupees: '₹5.4L' },
    { label: 'Debt', value: 12, color: '#F59E0B', rupees: '₹2.9L' },
    { label: 'Gold', value: 8, color: '#94a3b8', rupees: '₹2.0L' },
];

const SECTOR_DATA = [
    { label: 'Information Technology', value: 35 },
    { label: 'Banking & Financial Services', value: 28 },
    { label: 'FMCG', value: 15 },
    { label: 'Healthcare', value: 12 },
    { label: 'Automotive', value: 10 },
];

export default function Results({ analysis, onReset, onDownload }) {
    const data = analysis || {
        portfolio_summary: "Your portfolio shows a strong preference for large-cap equity, primarily concentrated in the technology and financial sectors. Total estimated value is ₹24.5L across 23 distinct holdings.",
        key_observations: "You have a consistent investment pattern over the last 3 years, with recent allocations skewing towards high-growth mutual funds, increasing your overall beta significantly.",
        diversification_concentration: "Significant concentration risk exists — 63% of equity exposure sits in just two sectors (IT and Banking). Debt allocation at 12% is below the recommended 20% for your risk profile.",
        risks_red_flags: "High exposure to interest-rate sensitive sectors. Two funds carry expense ratios above 1.5% versus category average. Cash reserves appear thin for meaningful market downturns.",
        improvement_opportunities: "Rebalancing 15% of large-cap equity into flexi-cap or mid-cap funds could improve risk-adjusted returns. Shifting to direct mutual fund plans will reduce annual drag by ~0.8%.",
        final_takeaway: "Your portfolio is fundamentally strong but lacks resilience. To reach optimal health, diversify into international equity and increase debt allocation to cushion domestic volatility.",
        health_score: 72,
        key_signals: [
            { text: "Diversification", type: "positive", label: "Strong" },
            { text: "Volatility Risk", type: "warning", label: "Medium" },
            { text: "Liquidity", type: "negative", label: "Low" },
        ]
    };

    const signalColors = { positive: '#A3E635', warning: '#F59E0B', negative: '#EF4444' };

    return (
        <div className="state-container results-root">
            {/* ── Header ── */}
            <div className="results-header">
                <div>
                    <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Analysis Complete
                    </h1>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · 14 seconds
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={onDownload} className="btn-download">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download Report
                    </button>
                    <button onClick={onReset} className="btn-secondary-outline">Analyze another →</button>
                </div>
            </div>

            {/* ── Two Column Layout ── */}
            <div className="results-grid">

                {/* ─ LEFT COLUMN ─ */}
                <div className="results-left-col">

                    {/* Stat Chips */}
                    <div className="stat-chips-row">
                        {[
                            { label: 'Holdings', value: '23' },
                            { label: 'Asset Types', value: '4' },
                            { label: 'Est. Value', value: '₹24.5L' },
                            { label: '1Y Return', value: '+14.2%', positive: true },
                        ].map((s, i) => (
                            <div key={i} className="stat-chip">
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>{s.label}</div>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: s.positive ? '#A3E635' : 'var(--text-primary)' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Asset Allocation */}
                    <div className="card-base card-animate card-stagger-1">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Asset Allocation</div>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-light)', padding: '4px 10px', borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Data</span>
                        </div>
                        <DonutChart data={ALLOCATION_DATA} />
                    </div>

                    {/* Sector Exposure */}
                    <div className="card-base card-animate card-stagger-2">
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>Sector Exposure</div>
                        <SectorBars sectors={SECTOR_DATA} />
                    </div>

                    {/* Key Observations */}
                    <div className="card-base card-animate card-stagger-3">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Key Observations</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[data.key_observations, data.diversification_concentration].map((obs, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'var(--bg-main)', borderRadius: 'var(--r-md)' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{obs}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risks & Red Flags */}
                    <div className="card-base card-animate card-stagger-4" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Risks & Red Flags</div>
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#B91C1C', lineHeight: 1.75, background: 'white', borderRadius: 'var(--r-md)', padding: '14px', border: '1px solid #FCA5A5' }}>
                            {data.risks_red_flags}
                        </div>
                    </div>

                    {/* Improvement Opportunities */}
                    <div className="card-base card-animate card-stagger-5" style={{ background: '#F7FEE7', borderColor: '#BEF264' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Improvement Opportunities</div>
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#3F6212', lineHeight: 1.75, background: 'white', borderRadius: 'var(--r-md)', padding: '14px', border: '1px solid #BEF264' }}>
                            {data.improvement_opportunities}
                        </div>
                    </div>

                    {/* Final Takeaway */}
                    <div className="card-base card-animate card-stagger-6" style={{ background: '#111', border: 'none', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'rgba(124,58,237,0.25)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', position: 'relative', zIndex: 2 }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" /></svg>
                            </div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--lime)' }}>Final Takeaway</div>
                        </div>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 600, color: 'white', lineHeight: 1.7, position: 'relative', zIndex: 2 }}>{data.final_takeaway}</p>
                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Xylar Intelligence Engine</div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" /></svg>
                        </div>
                    </div>

                </div>

                {/* ─ RIGHT COLUMN ─ */}
                <div className="results-right-col">

                    {/* Health Score */}
                    <div className="score-card-v2">
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', position: 'relative', zIndex: 2 }}>Portfolio Health</div>
                        <HealthCircle score={data.health_score} />
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: '16px', textAlign: 'center', position: 'relative', zIndex: 2 }}>Good, but needs tweaking</p>
                    </div>

                    {/* Key Signals */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Key Signals</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {data.key_signals && data.key_signals.map((signal, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < data.key_signals.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: signalColors[signal.type] || '#aaa', boxShadow: `0 0 6px ${signalColors[signal.type]}66`, flexShrink: 0 }}></div>
                                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{signal.text}</span>
                                    </div>
                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: signalColors[signal.type] || 'var(--text-muted)' }}>{signal.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 1Y Performance Chart */}
                    <div className="card-base">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>1Y Performance</div>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 700, color: 'var(--lime)', background: 'var(--positive-light)', padding: '4px 10px', borderRadius: 'var(--r-full)' }}>+14.2%</span>
                        </div>
                        <Sparkline />
                    </div>

                    {/* Quick Actions */}
                    <div className="card-base" style={{ background: 'var(--bg-main)' }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Next Steps</div>
                        <button onClick={onDownload} style={{
                            width: '100%', height: '46px', background: 'var(--accent)', color: 'white',
                            fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none',
                            borderRadius: 'var(--r-lg)', cursor: 'pointer', marginBottom: '10px',
                            transition: 'opacity 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download Full Report
                        </button>
                        <button onClick={onReset} style={{
                            width: '100%', height: '40px', background: 'transparent', color: 'var(--accent)',
                            fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600,
                            border: '1.5px solid var(--accent)', borderRadius: 'var(--r-lg)', cursor: 'pointer'
                        }}>
                            Analyze another portfolio →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
