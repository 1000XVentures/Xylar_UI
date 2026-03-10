import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

// Format pills
const formatPills = [
    {
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
        iconBg: '#FEE2E2',
        label: 'CAS Statement PDF',
        sub: 'Most common',
    },
    {
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
        iconBg: '#EDE9FE',
        label: 'Portfolio Screenshot',
        sub: 'Any broker',
    },
    {
        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>,
        iconBg: '#DCFCE7',
        label: 'Pasted Holdings Text',
        sub: 'Just copy-paste',
    },
];

const fileRows = [
    { bg: '#FEE2E2', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, name: 'CAS_Statement_FY25.pdf', size: '2.4 MB' },
    { bg: '#EDE9FE', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>, name: 'Portfolio_Screenshot.png', size: '840 KB' },
    { bg: '#DCFCE7', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>, name: 'My Holdings.txt', size: '12 KB' },
];

export default function OnboardingScreen1() {
    const [pillsVisible, setPillsVisible] = useState([false, false, false]);
    const [badgeVisible, setBadgeVisible] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        formatPills.forEach((_, i) => {
            setTimeout(() => {
                setPillsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, 300 + i * 120);
        });
        setTimeout(() => setBadgeVisible(true), 800);
    }, []);

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
            {/* LEFT — Text */}
            <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '440px' }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7C3AED', marginBottom: '16px' }}>
                    Step 1 of 3
                </div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,3vw,38px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                    Upload your portfolio,<br />any way you have it.
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '400px', marginBottom: '32px' }}>
                    Got a CAS statement PDF? A broker screenshot? Pasted holdings from your app? Xylar reads it all — no special format required.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formatPills.map((pill, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            border: '1px solid var(--border)', borderRadius: '9999px',
                            padding: '10px 18px', background: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            width: 'fit-content',
                            opacity: pillsVisible[i] ? 1 : 0,
                            transform: pillsVisible[i] ? 'translateX(0)' : 'translateX(-12px)',
                            transition: 'opacity 0.35s ease, transform 0.35s ease',
                        }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: pill.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {pill.icon}
                            </div>
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{pill.label}</span>
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto', paddingLeft: '16px', whiteSpace: 'nowrap' }}>{pill.sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — Mockup Card (hidden on mobile) */}
            {!isMobile && <div style={{ flex: 1, maxWidth: '420px' }}>
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '28px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.10)', border: '1px solid var(--border)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* BG glow decoration */}
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

                    {/* Mini top bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                        {['#FF5F57', '#FFBD2E', '#28CA41'].map(c => <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />)}
                        <div style={{ marginLeft: 'auto', background: '#EDE9FE', borderRadius: '9999px', padding: '3px 10px', fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: '#7C3AED', fontWeight: 600 }}>Upload</div>
                    </div>

                    {/* Upload zone */}
                    <div style={{
                        border: '2px dashed #C4B5FD', background: '#F5F3FF', borderRadius: '12px',
                        height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>Drop your file here</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, PNG, JPG</div>
                    </div>

                    {/* File rows */}
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {fileRows.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: '#F6F4F1' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</span>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{f.size}</span>
                            </div>
                        ))}
                    </div>

                    {/* Checkmark badge */}
                    <div style={{
                        position: 'absolute', bottom: '20px', right: '20px',
                        background: '#A3E635', borderRadius: '9999px',
                        padding: '6px 14px',
                        fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, color: '#1A1A1A',
                        opacity: badgeVisible ? 1 : 0,
                        transform: badgeVisible ? 'scale(1)' : 'scale(0.5)',
                        transition: 'opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        ✓ Ready to analyze
                    </div>
                </div>
            </div>}
        </div>
    );
}
