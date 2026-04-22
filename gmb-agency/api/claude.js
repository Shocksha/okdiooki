export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, system, max_tokens = 1024 } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'prompt richiesto' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens,
        system: system || 'Sei un esperto di marketing digitale per PMI italiane. Scrivi sempre in italiano, in modo professionale ma accessibile.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `Anthropic API error ${response.status}`)
    }

    res.json({ text: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
