import React from 'react';

// Mini sparkline helper
function Spark({ up = true, width = 80, height = 32 }) {
    const pts = up
        ? [30, 28, 25, 22, 24, 18, 15, 12, 14, 10]
        : [10, 12, 14, 18, 15, 20, 22, 24, 21, 26];
    const maxY = Math.max(...pts), minY = Math.min(...pts);
    const path = pts.map((v, i) => {
        const x = (i / (pts.length - 1)) * width;
        const y = height - ((v - minY) / (maxY - minY || 1)) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ');
    const color = up ? '#65A30D' : '#EF4444';
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const movers = [
    { name: 'HDFC Bank', tick: 'HDFCBANK', pct: '+2.4%', price: '₹1,642', up: true },
    { name: 'Infosys', tick: 'INFY', pct: '+1.8%', price: '₹1,782', up: true },
    { name: 'Bajaj Finance', tick: 'BAJFINANCE', pct: '-1.2%', price: '₹6,892', up: false },
    { name: 'ONGC', tick: 'ONGC', pct: '+3.1%', price: '₹236', up: true },
    { name: 'Wipro', tick: 'WIPRO', pct: '-0.6%', price: '₹452', up: false },
];

const sectors = [
    { name: 'IT / Tech', pct: '+1.4%', up: true },
    { name: 'Banking', pct: '+0.8%', up: true },
    { name: 'FMCG', pct: '-0.3%', up: false },
    { name: 'Healthcare', pct: '+2.1%', up: true },
    { name: 'Auto', pct: '+0.5%', up: true },
    { name: 'Energy', pct: '+1.9%', up: true },
    { name: 'Metals', pct: '-1.1%', up: false },
    { name: 'Realty', pct: '+0.4%', up: true },
];

const mfs = [
    { name: 'Mirae Asset Large Cap', ret1y: '+18.2%', cat: 'Large Cap', catColor: '#7C3AED', catBg: '#EDE9FE' },
    { name: 'SBI Small Cap Direct', ret1y: '+24.6%', cat: 'Small Cap', catColor: '#B45309', catBg: '#FEF3C7' },
    { name: 'PPFAS Flexicap', ret1y: '+21.3%', cat: 'Flexi Cap', catColor: '#166534', catBg: '#DCFCE7' },
    { name: 'HDFC Nifty 50 Index', ret1y: '+16.1%', cat: 'Index', catColor: '#475569', catBg: '#F1F5F9' },
];

// Nifty intraday sparkline
const niftyPts = [50, 52, 48, 45, 50, 56, 60, 58, 62, 65, 63, 68];
function NiftyChart() {
    const w = 400, h = 80;
    const maxY = Math.max(...niftyPts), minY = Math.min(...niftyPts);
    const pts = niftyPts.map((v, i) => {
        const x = (i / (niftyPts.length - 1)) * w;
        const y = h - ((v - minY) / (maxY - minY)) * (h - 8) - 4;
        return { x, y };
    });
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L${w} ${h} L0 ${h} Z`;
    const xLabels = ['9:30', '11', '1', '3', '3:30'];
    return (
        <div>
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', height: '80px' }} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="niftyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A3E635" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#A3E635" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#niftyGrad)" />
                <path d={linePath} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="4" fill="#7C3AED" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '0 4px' }}>
                {xLabels.map(l => <span key={l} style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: 'var(--text-muted)' }}>{l}</span>)}
            </div>
        </div>
    );
}

export default function MarketPulse() {
    const cs = { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 };
    return (
        <div className="state-container" style={{ padding: '36px 40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Market Pulse</h1>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Live signals, Indian market snapshot</p>
                </div>
                <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '9999px', padding: '8px 16px', fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)' }}>
                    Mar 10, 2026 · 10:30 PM IST
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>
                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Nifty Chart */}
                    <div className="card-base">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Nifty 50 Today</div>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>22,471<span style={{ fontSize: '20px' }}>.85</span></div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#65A30D', marginTop: '4px' }}>↑ 182.45 pts from yesterday</div>
                            </div>
                            <span style={{ background: '#F7FEE7', color: '#65A30D', fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, borderRadius: '9999px', padding: '6px 14px', border: '1px solid #BEF264' }}>+0.82%</span>
                        </div>
                        <NiftyChart />
                    </div>

                    {/* Top Movers */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Top Movers — NSE</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {movers.map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < movers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>{m.tick}</div>
                                    </div>
                                    <Spark up={m.up} width={60} height={28} />
                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: m.up ? '#65A30D' : '#EF4444' }}>{m.pct}</div>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>{m.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sector Heatmap */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Sector Performance (Today)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                            {sectors.map((s, i) => (
                                <div key={i} style={{
                                    padding: '14px', borderRadius: '12px',
                                    background: s.up ? '#F7FEE7' : '#FEF2F2',
                                    border: `1px solid ${s.up ? '#BEF264' : '#FECACA'}`,
                                }}>
                                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{s.name}</div>
                                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '18px', fontWeight: 800, color: s.up ? '#3F6212' : '#B91C1C' }}>{s.pct}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '76px' }}>
                    {/* Portfolio snapshot */}
                    <div style={{ background: 'linear-gradient(140deg, #7C3AED 0%, #4C1D95 100%)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(124,58,237,0.25)' }}>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Your Portfolio</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: 'white' }}>₹24.5L</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#A3E635', marginTop: '4px' }}>+₹1,842 today (+0.76%)</div>
                        <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', height: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '72%', background: '#A3E635', borderRadius: '10px' }} />
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Health Score: 72/100</div>
                    </div>

                    {/* Market Sentiment */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Market Sentiment</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F6F4F1', borderRadius: '9999px', padding: '4px', marginBottom: '10px' }}>
                            {['Bearish', 'Neutral', 'Bullish'].map((s, i) => (
                                <div key={s} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: '9999px', background: i === 2 ? '#7C3AED' : 'transparent', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: i === 2 ? 700 : 500, color: i === 2 ? 'white' : 'var(--text-muted)' }}>{s}</div>
                            ))}
                        </div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#7C3AED', fontWeight: 600, textAlign: 'center' }}>Moderately Bullish ↑</div>
                    </div>

                    {/* Trending MFs */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Trending MFs</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {mfs.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < mfs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <div>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '160px' }}>{m.name}</div>
                                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: 600, color: m.catColor, background: m.catBg, padding: '2px 8px', borderRadius: '9999px', marginTop: '4px', display: 'inline-block' }}>{m.cat}</span>
                                    </div>
                                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#65A30D' }}>{m.ret1y}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
