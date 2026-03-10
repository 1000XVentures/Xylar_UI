import React, { useState, useEffect } from 'react';

// ─── Xylar Logo Mark ──────────────────────────────────────────────────────────
function XylarMark({ size = 72 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="18" fill="#7C3AED" />
            <rect x="14" y="38" width="10" height="20" rx="3" fill="white" opacity="0.95" />
            <rect x="28" y="28" width="10" height="20" rx="3" fill="white" opacity="0.95" />
            <rect x="42" y="14" width="10" height="20" rx="3" fill="#A3E635" opacity="0.95" />
            <rect x="42" y="38" width="10" height="20" rx="3" fill="white" opacity="0.8" />
        </svg>
    );
}

// ─── Simplified Splash Screen (1.8s then auto-advance) ───────────────────────
export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState('entering'); // entering | visible | exiting

    useEffect(() => {
        // Logo entrance
        const t1 = setTimeout(() => setPhase('visible'), 50);
        // Start exit
        const t2 = setTimeout(() => setPhase('exiting'), 1450);
        // Complete
        const t3 = setTimeout(onComplete, 1800);
        return () => [t1, t2, t3].forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0D0D0D',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
            opacity: phase === 'exiting' ? 0 : 1,
            transform: phase === 'exiting' ? 'scale(1.04)' : 'scale(1)',
            transition: phase === 'exiting' ? 'opacity 0.35s ease-in, transform 0.35s ease-in' : '',
        }}>
            {/* Radial glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: '500px', height: '500px', pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            }} />
            {/* Grid texture */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* Logo */}
            <div style={{
                filter: 'drop-shadow(0 0 28px rgba(124,58,237,0.6))',
                transform: phase === 'entering' ? 'scale(0.7)' : 'scale(1)',
                opacity: phase === 'entering' ? 0 : 1,
                transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
                position: 'relative', zIndex: 2,
            }}>
                <XylarMark size={72} />
            </div>

            {/* Wordmark */}
            <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: '32px', fontWeight: 800, color: 'white',
                opacity: phase === 'entering' ? 0 : 1, transition: 'opacity 0.4s ease 0.3s',
                position: 'relative', zIndex: 2,
            }}>
                Xylar
            </div>

            {/* Subtext */}
            <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)',
                opacity: phase === 'entering' ? 0 : 1, transition: 'opacity 0.4s ease 0.5s',
                position: 'relative', zIndex: 2,
            }}>
                AI Portfolio Analyzer
            </div>
        </div>
    );
}
