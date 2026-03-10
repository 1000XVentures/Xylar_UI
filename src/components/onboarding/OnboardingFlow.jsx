import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── Xylar Logo Mark (from SplashScreen) ─────────────────────────────────────
function XylarMark({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#7C3AED" />
            <rect x="7" y="17" width="4" height="8" rx="1.5" fill="white" opacity="0.95" />
            <rect x="13" y="12" width="4" height="9" rx="1.5" fill="white" opacity="0.95" />
            <rect x="19" y="6" width="4" height="9" rx="1.5" fill="#A3E635" opacity="0.95" />
            <rect x="19" y="17" width="4" height="8" rx="1.5" fill="white" opacity="0.8" />
        </svg>
    );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────
function ProgressDots({ current, total = 3 }) {
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{
                    height: '8px',
                    width: i === current ? '24px' : '8px',
                    borderRadius: i === current ? '4px' : '50%',
                    background: i === current ? '#7C3AED' : 'var(--border)',
                    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), border-radius 0.3s cubic-bezier(0.4,0,0.2,1)',
                }} />
            ))}
        </div>
    );
}

// ─── Onboarding Flow Wrapper ──────────────────────────────────────────────────
export default function OnboardingFlow({ screens, onComplete }) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [transitionState, setTransitionState] = useState('idle');
    const [displayScreen, setDisplayScreen] = useState(0);
    const isMobile = useIsMobile();

    const handleSkip = () => {
        sessionStorage.setItem('xylar_onboarded', 'true');
        onComplete();
    };

    const handleNext = () => {
        if (currentScreen < screens.length - 1) {
            // Slide transition
            setTransitionState('exiting');
            setTimeout(() => {
                setDisplayScreen(currentScreen + 1);
                setCurrentScreen(currentScreen + 1);
                setTransitionState('entering');
                setTimeout(() => setTransitionState('idle'), 300);
            }, 280);
        } else {
            sessionStorage.setItem('xylar_onboarded', 'true');
            onComplete();
        }
    };

    const isLast = currentScreen === screens.length - 1;
    const ScreenComponent = screens[displayScreen];

    const contentStyle = {
        opacity: transitionState === 'exiting' ? 0 : 1,
        transform: transitionState === 'exiting'
            ? 'translateX(-24px)'
            : transitionState === 'entering'
                ? 'translateX(24px)'
                : 'translateX(0)',
        transition: transitionState === 'exiting'
            ? 'opacity 0.25s ease-in, transform 0.25s ease-in'
            : 'opacity 0.3s ease-out, transform 0.3s ease-out',
    };

    // Force entering → idle after mount
    useEffect(() => {
        if (transitionState === 'entering') {
            const t = setTimeout(() => setTransitionState('idle'), 50);
            return () => clearTimeout(t);
        }
    }, [transitionState]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* ── Top Bar ── */}
            <div style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '0 16px' : '0 40px',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
                position: 'relative',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <XylarMark size={32} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Xylar
                    </span>
                </div>

                {/* Centered dots */}
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <ProgressDots current={currentScreen} total={screens.length} />
                </div>

                {/* Skip */}
                <button
                    onClick={handleSkip}
                    style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500,
                        color: 'var(--text-muted)', background: 'none', border: 'none',
                        cursor: 'pointer', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                    Skip
                </button>
            </div>

            {/* ── Content Area ── */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', ...contentStyle }}>
                    <ScreenComponent />
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div style={{
                height: isMobile ? '72px' : '88px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '0 16px' : '0 40px',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                flexShrink: 0,
            }}>
                <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500,
                    color: 'var(--text-muted)', letterSpacing: '0.06em',
                }}>
                    {String(currentScreen + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}
                </span>

                <button
                    onClick={handleNext}
                    style={{
                        height: '48px',
                        padding: '0 32px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                        color: 'white',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(124,58,237,0.28)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.28)'; }}
                >
                    {isLast ? 'Get Started →' : 'Next →'}
                </button>
            </div>
        </div>
    );
}
