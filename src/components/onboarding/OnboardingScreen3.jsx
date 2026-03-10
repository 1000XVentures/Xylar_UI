import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const useCases = [
    { num: '01', title: 'Share with your CA', sub: 'Send the PDF as-is for your tax review or year-end planning' },
    { num: '02', title: 'Brief your advisor', sub: 'Walk into any RM meeting with evidence, not just a feeling' },
    { num: '03', title: 'Track over time', sub: 'Run a new analysis every quarter and compare your health score' },
];

const pdfSections = [
    { color: '#EDE9FE', w: '85%' },
    { color: '#FEF9C3', w: '70%' },
    { color: '#F7FEE7', w: '78%' },
    { color: '#FEF2F2', w: '60%' },
    { color: '#DCFCE7', w: '72%' },
    { color: '#1A1A1A', w: '50%' },
];

export default function OnboardingScreen3() {
    const [cardHovered, setCardHovered] = React.useState(false);
    const isMobile = useIsMobile();

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
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7C3AED', marginBottom: '16px' }}>Step 3 of 3</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,3vw,38px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                    Export your analysis.<br />Share it anywhere.
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '28px' }}>
                    Download a clean, one-page PDF report of your portfolio analysis. Share it with your CA, family office, or financial advisor — or keep it for your own records.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {useCases.map((u, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '32px', height: '32px', flexShrink: 0, borderRadius: '50%',
                                border: '1.5px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 700, color: '#7C3AED' }}>{u.num}</span>
                            </div>
                            <div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.title}</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '3px' }}>{u.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — PDF Card (hidden on mobile) */}
            {!isMobile && <div style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
                {/* Floating download badge */}
                <div style={{
                    position: 'absolute', top: '-14px', right: '24px', zIndex: 10,
                    background: '#7C3AED', borderRadius: '9999px', padding: '8px 18px',
                    fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 700, color: 'white',
                    boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                }}>
                    ↓ Download PDF
                </div>

                <div
                    style={{
                        background: 'white', borderRadius: '20px',
                        padding: '28px 28px 20px',
                        boxShadow: cardHovered ? '0 32px 80px rgba(0,0,0,0.16)' : '0 24px 64px rgba(0,0,0,0.12)',
                        border: '1px solid var(--border)',
                        transform: cardHovered ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={() => setCardHovered(true)}
                    onMouseLeave={() => setCardHovered(false)}
                >
                    {/* PDF header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #E8E4DF' }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 700, color: '#7C3AED' }}>Xylar AI Portfolio Analyzer</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', color: 'var(--text-muted)' }}>Mar 2026</span>
                    </div>

                    {/* Section skeleton rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {pdfSections.map((s, i) => (
                            <div key={i} style={{ paddingTop: '10px', paddingBottom: '10px', borderBottom: i < pdfSections.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                                <div style={{ width: s.w, height: '8px', background: s.color, borderRadius: '4px', marginBottom: '5px' }} />
                                {[...Array(i === 0 ? 3 : 2)].map((_, j) => (
                                    <div key={j} style={{ height: '5px', background: '#E8E4DF', borderRadius: '4px', marginTop: '4px', width: j === 0 ? '100%' : j === 1 ? '80%' : '60%' }} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '8px', color: 'var(--text-muted)' }}>Generated by Xylar · Not financial advice</span>
                    </div>
                </div>
            </div>}
        </div>
    );
}
