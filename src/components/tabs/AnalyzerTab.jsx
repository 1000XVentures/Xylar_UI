import React, { useState } from 'react';
import SplashScreen from '../SplashScreen';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import OnboardingScreen1 from '../onboarding/OnboardingScreen1';
import OnboardingScreen2 from '../onboarding/OnboardingScreen2';
import OnboardingScreen3 from '../onboarding/OnboardingScreen3';
import Landing from '../states/Landing';
import Analyzing from '../states/Analyzing';
import Results from '../states/Results';
import ErrorState from '../states/Error';
import { downloadReport } from '../../download';

const ONBOARDING_SCREENS = [OnboardingScreen1, OnboardingScreen2, OnboardingScreen3];

// Analyzer sub-states
// splash → onboarding → landing → analyzing → results | error
function getInitialState() {
    const onboarded = sessionStorage.getItem('xylar_onboarded') === 'true';
    return onboarded ? 'landing' : 'splash';
}

export default function AnalyzerTab() {
    const [state, setState] = useState(getInitialState);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalysisComplete = () => setState('results');
    const handleStateChange = (s) => setState(s);

    const handleDownload = () => {
        const demo = {
            portfolio_summary: 'Your portfolio shows a strong preference for large-cap equity.',
            key_observations: 'Consistent SIP pattern observed across 3 years.',
            diversification_concentration: '63% equity concentrated in two sectors.',
            risks_red_flags: 'High exposure to interest-rate sensitive sectors.',
            improvement_opportunities: 'Rebalancing 15% into flexi-cap could improve risk-adjusted returns.',
            final_takeaway: 'Diversify into international equity and increase debt allocation by 10%.',
            health_score: 72,
        };
        downloadReport(analysisResult || demo, 'pdf');
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {state === 'splash' && (
                <SplashScreen onComplete={() => setState('onboarding')} />
            )}
            {state === 'onboarding' && (
                <OnboardingFlow
                    screens={ONBOARDING_SCREENS}
                    onComplete={() => setState('landing')}
                />
            )}
            {/* Main content area */}
            {!['splash', 'onboarding'].includes(state) && (
                <div className="tab-panel" style={{ flex: 1, overflow: 'auto' }}>
                    {state === 'landing' && <Landing onStateChange={handleStateChange} />}
                    {state === 'analyzing' && <Analyzing onProgressComplete={handleAnalysisComplete} />}
                    {state === 'results' && <Results analysis={analysisResult} onReset={() => setState('landing')} onDownload={handleDownload} />}
                    {state === 'error' && <ErrorState onRetry={() => setState('landing')} onSwitchToText={() => setState('landing')} />}
                </div>
            )}
        </div>
    );
}
