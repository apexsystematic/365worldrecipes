export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ 
      status: 'error', 
      message: 'GEMINI_API_KEY is NOT set. Go to Vercel → Settings → Environment Variables and add it, then redeploy.' 
    });
  }

  const results = {};
  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say "OK" and nothing else.' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );
      const data = await response.json();
      results[model] = response.ok ? '✅ working' : `❌ ${data.error?.message}`;
    } catch (err) {
      results[model] = `❌ ${err.message}`;
    }
  }

  return res.status(200).json({ 
    status: 'API key is set', 
    keyPrefix: apiKey.substring(0, 8) + '...',
    models: results 
  });
}
