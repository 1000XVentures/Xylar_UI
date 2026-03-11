// ─── BACKEND INTEGRATION POINT ───────────────────
// Replace ANTHROPIC_API_KEY with environment variable
// In production this call should go through your backend
// to avoid exposing the API key in the browser
// ──────────────────────────────────────────────────

const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE';

export async function analyzePortfolio({
    fileData,       // base64 string or null
    fileType,       // 'pdf' | 'image' | null
    pastedText,     // string or null
    customInstructions  // string or null
}) {

    const systemPrompt = `You are Xylar's portfolio intelligence engine. 
You analyse mutual fund and investment portfolios submitted by Indian 
investors and produce structured, honest, evidence-based insights.

Your analysis must be specific to what you actually see in the data.
Be honest about limitations. Write for a sophisticated investor.
Use no sales language, urgency tactics, or return guarantees.

Return ONLY a JSON object with exactly these keys, no markdown, 
no preamble:
{
  "portfolio_summary": "string",
  "key_observations": "string",
  "diversification_concentration": "string", 
  "risks_red_flags": "string",
  "improvement_opportunities": "string",
  "final_takeaway": "string",
  "health_score": number or null,
  "key_signals": [
    { "text": "string", "type": "positive|negative|neutral" }
  ]
}

health_score: 0-100 based on diversification, risk, and opportunity.
Null if insufficient data.
key_signals: 3-5 most important signals.
Each section: 2-4 sentences minimum. Use specifics where visible.`;

    // Build message content
    const content = [];

    if (fileData && fileType === 'pdf') {
        content.push({
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: fileData }
        });
    }

    if (fileData && fileType === 'image') {
        content.push({
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: fileData }
        });
    }

    if (pastedText) {
        content.push({ type: 'text', text: pastedText });
    }

    const userText = customInstructions
        ? `Additional instructions: ${customInstructions}\n\nAnalyse this portfolio and return the JSON.`
        : 'Analyse this portfolio and return the JSON.';

    content.push({ type: 'text', text: userText });

    if (ANTHROPIC_API_KEY === 'YOUR_API_KEY_HERE') {
        // Return a realistic mock response for demonstration
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    portfolio_summary: "Your portfolio shows a solid foundation, primarily concentrated in large-cap domestic equity with a modest allocation to debt. We observed consistent investment patterns indicating a disciplined approach.",
                    key_observations: "You have maintained regular SIPs over the past 3 years. The equity portion is heavily skewed towards financial services and technology sectors, which have driven recent performance. Debt allocation is primarily in short-duration liquid funds.",
                    diversification_concentration: "Approximately 65% of your equity exposure is concentrated in just two sectors (Finance and Tech). You are currently under-allocated to international equity and mid/small-cap segments compared to a standard balanced portfolio.",
                    risks_red_flags: "The high concentration in two cyclical sectors exposes the portfolio to sector-specific downturns. Additionally, 15% of your holdings have overlapping underlying stocks across different fund houses, leading to unintended concentration risk.",
                    improvement_opportunities: "Consider rebalancing by introducing a flexi-cap or multi-asset fund to broaden sector exposure. Expanding your international equity allocation from 2% to 10% could provide better geographic diversification and hedge against domestic volatility.",
                    final_takeaway: "You have built a strong, disciplined core portfolio. To improve resilience and long-term risk-adjusted returns, focus on reducing sector concentration and modestly increasing international and debt allocations to better balance the portfolio.",
                    health_score: 74,
                    key_signals: [
                        { text: "Strong SIP discipline observed", type: "positive" },
                        { text: "High concentration in Finance & Tech", type: "negative" },
                        { text: "Fund overlap causing unintended risk", type: "negative" },
                        { text: "Good core large-cap foundation", type: "positive" },
                    ]
                });
            }, 3000);
        });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: 'user', content }]
        })
    });

    if (!response.ok) {
        throw new Error('Analysis service is currently unavailable. Please try again later.');
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');

    try {
        return JSON.parse(text);
    } catch {
        throw new Error('Failed to process the analysis report. Please try again.');
    }
}
