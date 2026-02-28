export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.' });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  // Try models in order until one works
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 8000,
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (model !== models[models.length - 1]) continue;
        return res.status(response.status).json({
          error: `Gemini API error: ${data.error?.message || response.statusText}`,
          details: data.error
        });
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) {
        return res.status(500).json({ error: 'Gemini returned an empty response. Try again.' });
      }

      return res.status(200).json({ text, model });

    } catch (err) {
      if (model !== models[models.length - 1]) continue;
      return res.status(500).json({ error: `Network error: ${err.message}` });
    }
  }
}
