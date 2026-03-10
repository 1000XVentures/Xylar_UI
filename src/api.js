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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: 'user', content }]
        })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');

    try {
        return JSON.parse(text);
    } catch {
        throw new Error('Failed to parse AI response');
    }
}
