import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const features = [
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>, title: 'Portfolio Health Score', sub: '0–100 score based on 6 dimensions' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>, title: 'Diversification Analysis', sub: 'Category balance and concentration risk' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>, title: 'Risk & Red Flag Detection', sub: 'What needs immediate attention' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>, title: 'Improvement Opportunities', sub: 'Where to optimise for better outcomes' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>, title: 'Key Observations', sub: 'Behavioural patterns in your investing' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, title: 'Final Recommendation', sub: 'One clear action to take next' },
];

const signals = [
    { dot: '#A3E635', label: 'Equity diversified', bg: '#F7FEE7', border: '#BEF264' },
    { dot: '#EF4444', label: 'High concentration', bg: '#FEF2F2', border: '#FCA5A5' },
    { dot: '#F59E0B', label: 'Overlap detected', bg: '#FFFBEB', border: '#FCD34D' },
    { dot: '#A3E635', label: 'SIP consistency', bg: '#F7FEE7', border: '#BEF264' },
];

const bars = [
    { label: 'Large Cap', pct: 100, color: '#7C3AED', value: '38%' },
    { label: 'Mid Cap', pct: 72, color: '#9333EA', value: '28%' },
    { label: 'Small Cap', pct: 47, color: '#C4B5FD', value: '18%' },
    { label: 'Others', pct: 28, color: '#E5E7EB', value: '16%' },
];

export default function OnboardingScreen2() {
    const [featuresVisible, setFeaturesVisible] = useState([]);
    const [barsAnimated, setBarsAnimated] = useState(false);
    const [ringProgress, setRingProgress] = useState(0);
    const isMobile = useIsMobile();

    useEffect(() => {
        setTimeout(() => setBarsAnimated(true), 200);
        setTimeout(() => setRingProgress(74), 400);
        features.forEach((_, i) => {
            setTimeout(() => {
                setFeaturesVisible(prev => [...prev, i]);
            }, 200 + i * 80);
        });
    }, []);

    // Health ring (74%)
    const r = 26, circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - ringProgress / 100);

    return (
        <div style={{
            maxWidth: isMobile ? '100%' : '960px',
            margin: '0 auto',
            padding: isMobile ? '24px 16px' : '0 40px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '32px' : '80px',
        }}>

            {/* LEFT — Mockup Card (hidden on mobile) */}
            {!isMobile && <div style={{ flex: 1, maxWidth: '420px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.10)', border: '1px solid var(--border)' }}>

                    {/* Score row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '4px' }}>Portfolio Health</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{Math.round(ringProgress)}</span>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '16px', color: 'var(--text-muted)' }}>/100</span>
                            </div>
                        </div>
                        {/* SVG Ring */}
                        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="32" cy="32" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
                            <circle cx="32" cy="32" r={r} fill="none" stroke="#7C3AED" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={circ}
                                strokeDashoffset={dashOffset}
                                style={{ transition: 'stroke-dashoffset 1s ease 0.4s' }} />
                        </svg>
                    </div>

                    {/* Signal chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {signals.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '9999px', background: s.bg, border: `1px solid ${s.border}` }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }} />
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bar chart */}
                    <div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>Category Allocation</div>
                        <div style={{ display: 'flex', gap: '8px', height: '64px', alignItems: 'flex-end' }}>
                            {bars.map((b, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '100%', background: b.color, borderRadius: '4px 4px 0 0', height: barsAnimated ? `${b.pct}%` : '0%', transition: `height 0.5s ease ${i * 0.08}s` }} />
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>{b.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner */}
                    <div style={{ marginTop: '16px', background: '#EDE9FE', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#7C3AED"><path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" /></svg>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, color: '#7C3AED' }}>3 improvement opportunities found</span>
                    </div>
                </div>
            </div>}

            {/* RIGHT — Text */}
            <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '440px' }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7C3AED', marginBottom: '16px' }}>Step 2 of 3</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,3vw,38px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                    Deep analysis.<br />Not just a summary.
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '28px' }}>
                    Xylar doesn't just read your portfolio — it analyses diversification gaps, flags risks, identifies missed opportunities, and scores your overall portfolio health.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            opacity: featuresVisible.includes(i) ? 1 : 0,
                            transform: featuresVisible.includes(i) ? 'translateX(0)' : 'translateX(12px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                        }}>
                            <div style={{ width: '36px', height: '36px', flexShrink: 0, background: '#EDE9FE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                            <div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
