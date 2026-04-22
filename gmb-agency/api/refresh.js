import { getClient, updateClient } from '../lib/db.js'

export default async function handler(req, res) {
  const { client_id } = req.query

  if (!client_id) {
    return res.status(400).json({ error: 'client_id richiesto' })
  }

  try {
    const client = await getClient(client_id)

    if (!client.refresh_token) {
      return res.status(400).json({ error: 'Nessun refresh token disponibile' })
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: client.refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    const data = await tokenRes.json()

    if (data.error) {
      await updateClient(client_id, { token_status: 'expired' })
      return res.status(400).json({ error: data.error_description || data.error })
    }

    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

    await updateClient(client_id, {
      access_token: data.access_token,
      token_expiry: expiresAt,
      token_status: 'active',
    })

    res.json({ success: true, expires_at: expiresAt })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
