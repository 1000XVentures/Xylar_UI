import React from 'react';
import logo from '../../assets/logo.png';
import '../../styles/about.css';

const CALENDLY_URL = 'https://calendly.com/xylar/intro';

function IconCircle({ bg, color = 'white', size = 44, children }) {
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', flexShrink: 0 }}>
            {children}
        </div>
    );
}

const beliefs = [
    {
        bg: 'white', border: '1px solid #E8E4DF', titleColor: '#0F0F0F', bodyColor: '#6B7280',
        iconBg: '#EDE9FE',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="6" /><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /><polygon points="12 15 17 21 7 21 12 15" /></svg>,
        title: 'Evidence over opinion.',
        body: "Every insight Xylar surfaces has math behind it. Not a hunch. Not a star rating. The actual numbers from your actual portfolio.",
    },
    {
        bg: '#111', border: '1px solid #222', titleColor: 'white', bodyColor: 'rgba(255,255,255,0.6)',
        iconBg: 'rgba(255,255,255,0.08)',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
        title: 'Diagnose before prescribe.',
        body: "Before we tell you what to do, we show you exactly what is happening. You decide. We inform.",
    },
    {
        bg: '#7C3AED', border: 'none', titleColor: 'white', bodyColor: 'rgba(255,255,255,0.75)',
        iconBg: 'rgba(255,255,255,0.15)',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7 7 0 0 1 13 0" /><polyline points="16 3 18 5 22 1" /></svg>,
        title: 'Built for the sophisticated investor.',
        body: "UHNIs, HNIs, and their advisors deserve tools that match their intelligence. Not simplified. Just honest.",
    },
];

export default function AboutTab({ onSwitchToAnalyzer }) {
    const label11 = { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7C3AED' };

    return (
        <div className="tab-panel state-container" style={{ padding: '40px', maxWidth: '960px' }}>

            {/* ── HERO ── */}
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
                {/* Orbiting icon cluster */}
                <div className="icon-cluster">
                    {/* Center orb */}
                    <div className="cluster-center">
                        <img src={logo} alt="Xylar Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                    </div>
                    {/* Top orbit */}
                    <div className="orbit-icon orbit-top orbit-icon-a">
                        <IconCircle bg="#FEF3C7" size={44}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><circle cx="12" cy="12" r="4" /></svg>
                        </IconCircle>
                    </div>
                    {/* Left orbit */}
                    <div className="orbit-icon orbit-left orbit-icon-b">
                        <IconCircle bg="#F7FEE7" size={44}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#65A30D" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="6 4 12 9 18 4" /></svg>
                        </IconCircle>
                    </div>
                    {/* Right orbit */}
                    <div className="orbit-icon orbit-right orbit-icon-c">
                        <IconCircle bg="#EDE9FE" size={44}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                        </IconCircle>
                    </div>
                    {/* Bottom orbit */}
                    <div className="orbit-icon orbit-bottom orbit-icon-d">
                        <IconCircle bg="#F1F5F9" size={44}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                        </IconCircle>
                    </div>
                </div>

                <h1 className="about-headline" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '42px', fontWeight: 800, color: '#0F0F0F', lineHeight: 1.1, letterSpacing: '-0.025em', marginTop: '32px', marginBottom: '16px' }}>
                    Intelligence for the<br />Indian investor.
                </h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '16px', color: '#6B7280', lineHeight: 1.75 }}>
                    Xylar is building the layer of intelligence that sits above your portfolio — not to replace your advisor, but to make every conversation with them 10x more informed.
                </p>
            </div>

            {/* ── BELIEFS ── */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ ...label11 }}>Our Beliefs</div>
            </div>
            <div className="beliefs-row" style={{ display: 'flex', gap: '20px', marginBottom: '64px' }}>
                {beliefs.map((b, i) => (
                    <div key={i} className="belief-card" style={{ background: b.bg, border: b.border }}>
                        <IconCircle bg={b.iconBg} size={48}>
                            {b.icon}
                        </IconCircle>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '18px', fontWeight: 700, color: b.titleColor, marginTop: '20px', marginBottom: '10px' }}>{b.title}</div>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: b.bodyColor, lineHeight: 1.7 }}>{b.body}</p>
                    </div>
                ))}
            </div>

            {/* ── WHO WE ARE ── */}
            <div className="who-we-are-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '64px' }}>
                <div>
                    <div style={{ ...label11, marginBottom: '12px' }}>The Team</div>
                    <h2 className="who-we-are-headline" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '32px', fontWeight: 800, color: '#0F0F0F', lineHeight: 1.1, marginBottom: '20px' }}>
                        Built by people who<br />understand both worlds.
                    </h2>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', color: '#6B7280', lineHeight: 1.8, marginBottom: '32px' }}>
                        Xylar was founded at the intersection of fintech and product design. We've spent years inside wealth management firms watching intelligent clients make uninformed decisions — because the tools available weren't good enough.
                        <br /><br />
                        We decided to build what didn't exist.
                    </p>
                    <div className="team-stats-row" style={{ display: 'flex', gap: '32px' }}>
                        {[{ num: '₹500 Cr+', label: 'Portfolios analyzed in research' }, { num: '10+', label: 'Years of combined fintech experience' }].map(s => (
                            <div key={s.num}>
                                <div className="team-stat-number" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '36px', fontWeight: 800, color: '#7C3AED', lineHeight: 1 }}>{s.num}</div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#A0A8B0', marginTop: '6px', maxWidth: '120px', lineHeight: 1.4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team card */}
                <div className="team-card" style={{ border: '1px solid #E8E4DF', borderRadius: '20px', padding: '32px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
                    <div className="avatar-group" style={{ marginBottom: '20px' }}>
                        {[
                            { bg: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', init: 'AK' },
                            { bg: '#A3E635', color: '#111', init: 'SR' },
                            { bg: '#111', color: 'white', init: 'PM' },
                        ].map((a, i) => (
                            <div key={i} className="avatar-item" style={{ background: a.bg, color: a.color }}>{a.init}</div>
                        ))}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#A0A8B0', marginBottom: '6px' }}>Mumbai · Feb 2026</div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', color: '#6B7280', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '10px' }}>
                        "We built Xylar because we were frustrated. Frustrated watching smart people make poor portfolio decisions — not from lack of intelligence, but lack of information."
                    </p>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#A0A8B0' }}>— Xylar Founding Team</div>
                </div>
            </div>

            {/* ── BOTTOM CTA ── */}
            <div className="about-cta-card" style={{ position: 'relative', borderRadius: '20px', padding: '40px 48px', overflow: 'hidden' }}>
                <div className="cta-circle-1" />
                <div className="cta-circle-2" />
                <div className="about-cta-inner" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
                    <div style={{ maxWidth: '500px' }}>
                        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '26px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>Ready to see what Xylar can do?</h3>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
                            Start with the free portfolio analyzer, or book a call to learn about what's coming.
                        </p>
                    </div>
                    <div className="about-cta-buttons" style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <button onClick={onSwitchToAnalyzer} style={{ height: '48px', padding: '0 24px', color: '#111', fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, borderRadius: '9999px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(163,230,53,0.3)' }}>
                            Analyze my portfolio →
                        </button>
                        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ height: '48px', lineHeight: '46px', padding: '0 24px', color: 'white', fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600, borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.4)', textDecoration: 'none', display: 'inline-block' }}>
                            Book a call
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
