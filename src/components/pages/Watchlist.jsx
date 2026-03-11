import React from 'react';

function MiniSpark({ up = true }) {
    const pts = up ? [22, 18, 20, 15, 12, 10] : [10, 14, 12, 18, 16, 22];
    const w = 80, h = 32, maxY = Math.max(...pts), minY = Math.min(...pts);
    const path = pts.map((v, i) => {
        const x = (i / (pts.length - 1)) * w;
        const y = h - ((v - minY) / (maxY - minY || 1)) * (h - 4) - 2;
        return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <path d={path} fill="none" stroke={up ? '#65A30D' : '#EF4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const stocks = [
    { name: 'HDFC Bank', tick: 'HDFCBANK', price: '₹1,642', chg: '+2.4%', up: true, hi52: '₹1,880', lo52: '₹1,363' },
    { name: 'Infosys', tick: 'INFY', price: '₹1,782', chg: '+1.1%', up: true, hi52: '₹1,970', lo52: '₹1,320' },
    { name: 'Bajaj Finance', tick: 'BAJFINANCE', price: '₹6,892', chg: '-1.2%', up: false, hi52: '₹8,192', lo52: '₹6,187' },
    { name: 'TCS', tick: 'TCS', price: '₹3,541', chg: '+0.8%', up: true, hi52: '₹4,256', lo52: '₹3,056' },
    { name: 'ONGC', tick: 'ONGC', price: '₹236', chg: '+3.1%', up: true, hi52: '₹284', lo52: '₹178' },
    { name: 'Wipro', tick: 'WIPRO', price: '₹452', chg: '-0.6%', up: false, hi52: '₹578', lo52: '₹392' },
];

const mfs = [
    { name: 'Mirae Asset Large Cap Fund', cat: 'Large Cap', catColor: '#7C3AED', catBg: '#EDE9FE', ret1y: '+18.2%', ret3y: '+22.4%', ret5y: '+16.1%' },
    { name: 'SBI Small Cap Fund Direct', cat: 'Small Cap', catColor: '#B45309', catBg: '#FEF3C7', ret1y: '+24.6%', ret3y: '+28.1%', ret5y: '+21.3%' },
    { name: 'PPFAS Flexicap Fund', cat: 'Flexi Cap', catColor: '#166534', catBg: '#DCFCE7', ret1y: '+21.3%', ret3y: '+19.8%', ret5y: '+18.2%' },
    { name: 'HDFC Nifty 50 Index Fund', cat: 'Index', catColor: '#475569', catBg: '#F1F5F9', ret1y: '+16.1%', ret3y: '+14.8%', ret5y: '+13.2%' },
];

export default function Watchlist() {
    return (
        <div className="state-container" style={{ padding: '36px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Watchlist</h1>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Stocks and funds you're tracking</p>
                </div>
                <button style={{ height: '44px', padding: '0 20px', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', borderRadius: '9999px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(124,58,237,.28)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add to Watchlist
                </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>Stocks</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '12px' }}>
                    {stocks.map((s, i) => (
                        <div key={i} className="card-base" style={{ padding: '18px 20px', transition: 'transform 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>{s.tick}</div>
                                </div>
                                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 700, color: s.up ? '#65A30D' : '#EF4444', background: s.up ? '#F7FEE7' : '#FEF2F2', padding: '3px 8px', borderRadius: '9999px' }}>{s.chg}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.price}</div>
                                <MiniSpark up={s.up} />
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                                {[`52W H: ${s.hi52}`, `52W L: ${s.lo52}`].map(chip => (
                                    <span key={chip} style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: 'var(--text-muted)', background: '#F0EDE8', padding: '2px 8px', borderRadius: '9999px' }}>{chip}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>Mutual Funds</div>
                <div className="card-base" style={{ padding: '0 24px' }}>
                    {mfs.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i < mfs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: 600, color: m.catColor, background: m.catBg, padding: '2px 8px', borderRadius: '9999px', marginTop: '4px', display: 'inline-block' }}>{m.cat}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', textAlign: 'center' }}>
                                {[{ label: '1Y', val: m.ret1y }, { label: '3Y', val: m.ret3y }, { label: '5Y', val: m.ret5y }].map(r => (
                                    <div key={r.label}>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>{r.label}</div>
                                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#65A30D' }}>{r.val}</div>
                                    </div>
                                ))}
                            </div>
                            <button style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer' }}>View →</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
