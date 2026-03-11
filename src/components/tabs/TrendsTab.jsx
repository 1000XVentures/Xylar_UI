import React, { useEffect, useRef, useState } from 'react';
import '../../styles/trends.css';

const CALENDLY_URL = 'https://calendly.com/xylar/intro';

const categoryPerformance = [
    { name: 'Small Cap', return: 31.2, barPct: 85 },
    { name: 'Mid Cap', return: 26.8, barPct: 70 },
    { name: 'Flexi Cap', return: 21.4, barPct: 55 },
    { name: 'Large Cap', return: 16.9, barPct: 40 },
    { name: 'Hybrid', return: 11.2, barPct: 25 },
];

const sipInflows = [
    { month: 'Apr', value: 20534 }, { month: 'May', value: 21698 }, { month: 'Jun', value: 21262 },
    { month: 'Jul', value: 23331 }, { month: 'Aug', value: 20251 }, { month: 'Sep', value: 24508 },
    { month: 'Oct', value: 25012 }, { month: 'Nov', value: 25319 }, { month: 'Dec', value: 26459 },
    { month: 'Jan', value: 26400 }, { month: 'Feb', value: 25182 }, { month: 'Mar', value: 26400 },
];

const donutSegments = [
    { label: 'Large Cap', pct: 8, color: '#7C3AED' },
    { label: 'Mid Cap', pct: 12, color: '#A78BFA' },
    { label: 'Flexi', pct: 15, color: '#C4B5FD' },
    { label: 'Others', pct: 65, color: '#E5E7EB' },
];

const featureTeasers = [
    { icon: '📈', label: 'XIRR Analysis' },
    { icon: '⏪', label: 'Decision Replay' },
    { icon: '🛡', label: 'Risk Attribution' },
    { icon: '⧉', label: 'Overlap Detection' },
    { icon: '💸', label: 'Tax Optimisation' },
    { icon: '🔔', label: 'Drift Alerts' },
];

// SVG Donut
function DonutChart() {
    const r = 48, cx = 60, cy = 60, strokeW = 12;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return (
        <svg width="120" height="120" viewBox="0 0 120 120">
            {donutSegments.map((seg, i) => {
                const dash = (seg.pct / 100) * circ;
                const el = (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                        stroke={seg.color} strokeWidth={strokeW}
                        strokeDasharray={`${dash} ${circ - dash}`}
                        strokeDashoffset={-offset}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
                    />
                );
                offset += dash;
                return el;
            })}
            <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="14" fontWeight="800" fill="#0F0F0F">4,200</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill="#A0A8B0">schemes</text>
        </svg>
    );
}

// SVG Sparkline for SIP
function SIPSparkline() {
    const w = 260, h = 80;
    const values = sipInflows.map(d => d.value);
    const minV = Math.min(...values), maxV = Math.max(...values);
    const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - minV) / (maxV - minV)) * (h - 10) - 5;
        return { x, y };
    });
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L${w} ${h} L0 ${h} Z`;
    const lastPt = pts[pts.length - 1];
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} preserveAspectRatio="none">
            <defs>
                <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#sipGrad)" />
            <path d={linePath} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lastPt.x} cy={lastPt.y} r="5" fill="#A3E635" stroke="white" strokeWidth="2" />
        </svg>
    );
}

// Health score ring
function HealthRing({ score = 74 }) {
    const r = 52, circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
        <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle cx="65" cy="65" r={r} fill="none" stroke="#7C3AED" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px', transition: 'stroke-dasharray 1s ease 0.3s' }} />
            <text x="65" y="60" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="28" fontWeight="800" fill="white">{score}</text>
            <text x="65" y="78" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fill="rgba(255,255,255,0.4)">/100</text>
        </svg>
    );
}

export default function TrendsTab() {
    const [barsAnimated, setBarsAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setBarsAnimated(true), 100);
        return () => clearTimeout(t);
    }, []);

    const card = { background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4DF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
    const label11 = { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' };

    return (
        <div className="tab-panel state-container" style={{ padding: '40px', maxWidth: '1100px' }}>

            {/* ── HEADER ── */}
            <div className="trends-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginBottom: '40px' }}>
                <div style={{ flex: 1, maxWidth: '480px' }}>
                    <div style={{ ...label11, color: '#7C3AED', marginBottom: '12px' }}>Market Intelligence</div>
                    <h1 className="trends-headline" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '40px', fontWeight: 800, color: '#0F0F0F', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: '16px' }}>
                        Mutual Fund<br />Trends
                    </h1>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '15px', color: '#6B7280', lineHeight: 1.7, marginBottom: '20px' }}>
                        What the data is showing about Indian MF markets right now — scheme performance, category flows, and where smart money is moving.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EDE9FE', borderRadius: '9999px', padding: '6px 14px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, color: '#7C3AED' }}>Updated: March 2026</span>
                    </div>
                </div>

                {/* Floating stat cards */}
                <div className="trends-stat-cluster" style={{ position: 'relative', width: '280px', height: '200px', flexShrink: 0 }}>
                    <div className="stat-card-float" style={{ position: 'absolute', top: 0, left: '20px', background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E8E4DF', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 3 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: '#0F0F0F' }}>₹54.5T</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#A0A8B0', marginTop: '2px' }}>Total MF AUM</div>
                        <div style={{ background: '#F7FEE7', color: '#3F6212', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, borderRadius: '9999px', padding: '3px 10px', marginTop: '8px', display: 'inline-block' }}>+18.4% YoY</div>
                    </div>
                    <div className="stat-card-float" style={{ position: 'absolute', top: '48px', left: 0, background: '#111', borderRadius: '16px', padding: '18px 22px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 2 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '24px', fontWeight: 800, color: 'white' }}>11.2 Cr</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>Active SIP accounts</div>
                    </div>
                    <div className="stat-card-float" style={{ position: 'absolute', bottom: 0, right: '10px', background: '#7C3AED', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 4px 14px rgba(124,58,237,0.35)', zIndex: 1 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', fontWeight: 800, color: 'white' }}>4,200+</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Schemes available</div>
                    </div>
                </div>
            </div>

            {/* ── TREND CARDS ── */}
            <div className="trends-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>

                {/* Card 1 — Category bars */}
                <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#0F0F0F' }}>Top Performing Categories</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categoryPerformance.map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 500, color: '#0F0F0F' }}>{c.name}</span>
                                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 700, color: '#3F6212' }}>+{c.return}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#F0EDE8', borderRadius: '9999px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: '9999px',
                                        background: 'linear-gradient(90deg, #7C3AED, #5B21B6)',
                                        width: barsAnimated ? `${c.barPct}%` : '0%',
                                        transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms`,
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 2 — SIP sparkline */}
                <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#0F0F0F' }}>Monthly SIP Inflows</div>
                    </div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', fontWeight: 800, color: '#0F0F0F', marginBottom: '4px' }}>₹26,400 Cr</div>
                    <div style={{ display: 'inline-block', background: '#F7FEE7', color: '#3F6212', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, borderRadius: '9999px', padding: '2px 10px', marginBottom: '12px' }}>+12% vs last month</div>
                    <SIPSparkline />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        {['Apr', 'Jul', 'Oct', 'Jan', 'Mar'].map(m => <span key={m} style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#A0A8B0' }}>{m}</span>)}
                    </div>
                </div>

                {/* Card 3 — Donut */}
                <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#0F0F0F' }}>Scheme Proliferation</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><DonutChart /></div>
                    <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 14px' }}>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#92400E', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                            More schemes than ever — but outcomes remain concentrated in the top 15% of funds.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── INSIGHT STRIP ── */}
            <div className="insight-strip" style={{ background: '#111', borderRadius: '16px', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', marginBottom: '40px' }}>
                <div className="insight-strip-left" style={{ maxWidth: '500px' }}>
                    <div style={{ ...label11, color: '#A3E635', marginBottom: '12px' }}>What this means for you</div>
                    <div className="insight-strip-text" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
                        Most investors hold 6–8 funds but gain the diversification benefit of only 2–3.
                    </div>
                </div>
                <div className="insight-strip-score" style={{ textAlign: 'center', flexShrink: 0 }}>
                    <HealthRing score={74} />
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Average portfolio health score</div>
                </div>
            </div>

            {/* ── WHAT'S COMING ── */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ ...label11, color: '#7C3AED', marginBottom: '12px' }}>What's Coming</div>
                <h2 className="whats-coming-headline" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '32px', fontWeight: 800, color: '#0F0F0F', lineHeight: 1.1, marginBottom: '12px' }}>
                    Xylar is building the full<br />portfolio intelligence platform.
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '15px', color: '#6B7280', lineHeight: 1.75, maxWidth: '560px', marginBottom: '28px' }}>
                    Continuous monitoring. Historical decision replay. XIRR vs benchmark. Personalised recommendations. Built for investors who want to manage wealth like an institution — not guess.
                </p>
                <div className="feature-chips-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
                    {featureTeasers.map(f => (
                        <div key={f.label} className="feature-chip">
                            <span style={{ fontSize: '14px' }}>{f.icon}</span>
                            {f.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BOOKING CTA ── */}
            <div className="cta-booking-card" style={{ position: 'relative', background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)', borderRadius: '20px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', overflow: 'hidden' }}>
                <div className="cta-circle-1" />
                <div className="cta-circle-2" />
                <div style={{ maxWidth: '520px', position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '26px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>Be the first to experience Xylar</h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
                        We're onboarding a select group of investors and advisors for our private launch. Book a 20-minute call to see what Xylar can do for your portfolio.
                    </p>
                </div>
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block', height: '52px', lineHeight: '52px', padding: '0 32px',
                        background: '#A3E635', color: '#111', fontFamily: "'Outfit',sans-serif", fontSize: '15px', fontWeight: 700,
                        borderRadius: '9999px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(163,230,53,0.35)',
                    }}>
                        Book a Meeting →
                    </a>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>20 min · No commitment · Calendly</div>
                </div>
            </div>
        </div>
    );
}
