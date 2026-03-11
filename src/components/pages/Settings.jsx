import React, { useState } from 'react';
import logo from '../../assets/logo.png';

function SettingRow({ title, sub, children }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>
            </div>
            <div style={{ flexShrink: 0, marginLeft: '24px' }}>{children}</div>
        </div>
    );
}

function ToggleSwitch({ on = true }) {
    const [isOn, setIsOn] = useState(on);
    return (
        <div onClick={() => setIsOn(!isOn)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: isOn ? '#7C3AED' : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: isOn ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
        </div>
    );
}

function PillSelect({ options, active }) {
    const [selected, setSelected] = useState(active);
    return (
        <div style={{ display: 'flex', background: '#F0EDE8', borderRadius: '9999px', padding: '3px', gap: '2px' }}>
            {options.map(o => (
                <div key={o} onClick={() => setSelected(o)} style={{ padding: '5px 14px', borderRadius: '9999px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: selected === o ? '#7C3AED' : 'transparent', color: selected === o ? 'white' : 'var(--text-muted)', transition: 'all 0.15s' }}>{o}</div>
            ))}
        </div>
    );
}

export default function Settings({ onResetOnboarding }) {
    return (
        <div className="state-container" style={{ padding: '36px 40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Settings</h1>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Customize your Xylar experience</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
                {/* LEFT — Setting Groups */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Analysis Preferences */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>Analysis Preferences</div>
                        <SettingRow title="Default Analysis Focus" sub="What the AI emphasizes by default">
                            <PillSelect options={['Growth', 'Balanced', 'Safety']} active="Balanced" />
                        </SettingRow>
                        <SettingRow title="Output Language" sub="Language for AI recommendations">
                            <PillSelect options={['English', 'Hindi']} active="English" />
                        </SettingRow>
                        <SettingRow title="Report Format" sub="Download format for analysis reports">
                            <PillSelect options={['PDF', 'PPT']} active="PDF" />
                        </SettingRow>
                        <SettingRow title="Show Nifty Benchmark" sub="Compare portfolio vs Nifty 50 in charts">
                            <ToggleSwitch on={true} />
                        </SettingRow>
                    </div>

                    {/* Display Preferences */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>Display Preferences</div>
                        <SettingRow title="Theme" sub="App appearance">
                            <PillSelect options={['Light', 'Dark', 'System']} active="Light" />
                        </SettingRow>
                        <SettingRow title="Currency Display" sub="How values are shown">
                            <PillSelect options={['₹ Lakh', '₹ Crore', '₹ Full']} active="₹ Lakh" />
                        </SettingRow>
                        <SettingRow title="Animation Speed" sub="UI transition speed">
                            <PillSelect options={['Slow', 'Normal', 'None']} active="Normal" />
                        </SettingRow>
                    </div>

                    {/* Data & Privacy */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>Data & Privacy</div>
                        <SettingRow title="Data Processing" sub="How your portfolio data is used">
                            <span style={{ background: '#F7FEE7', color: '#3F6212', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '9999px', border: '1px solid #BEF264', whiteSpace: 'nowrap' }}>Session only — not stored</span>
                        </SettingRow>
                        <SettingRow title="Clear Session Data" sub="Remove all temporary data from this session">
                            <button style={{ height: '34px', padding: '0 16px', borderRadius: '9999px', border: '1.5px solid #EF4444', background: 'transparent', color: '#EF4444', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                        </SettingRow>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
                            <div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Reset Onboarding</div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Show the welcome tour again next visit</div>
                            </div>
                            <button onClick={onResetOnboarding} style={{ height: '34px', padding: '0 16px', borderRadius: '9999px', border: '1.5px solid #7C3AED', background: 'transparent', color: '#7C3AED', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginLeft: '24px' }}>Reset</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Info cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '76px' }}>
                    {/* About */}
                    <div className="card-base">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={logo} alt="Xylar Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Xylar</span>
                            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', background: '#F0EDE8', padding: '2px 8px', borderRadius: '9999px', marginLeft: 'auto' }}>v1.0.0-beta</span>
                        </div>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.65 }}>AI Portfolio Analyzer for Indian investors. Upload any portfolio format and receive deep, actionable intelligence.</p>
                    </div>

                    {/* Powered by */}
                    <div className="card-base">
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px' }}>Made by</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#F6F4F1', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2L14.7 9.3L22 12L14.7 14.7L12 22L9.3 14.7L2 12L9.3 9.3L12 2Z" /></svg>
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>1000xDev</div>
                                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '11px', color: 'var(--text-muted)' }}>Product Studio</div>
                            </div>
                        </div>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.65, marginTop: '10px' }}>Xylar is designed and built by 1000xDev — a product studio building AI-first fintech tools.</p>
                    </div>

                    {/* Disclaimer */}
                    <div className="card-base" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Not Financial Advice</div>
                        </div>
                        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#92400E', lineHeight: 1.65 }}>Xylar provides AI-generated portfolio insights for informational purposes only. This is not SEBI-registered financial advice.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
