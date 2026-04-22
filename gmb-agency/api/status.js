import { getClient } from '../lib/db.js'

export default async function handler(req, res) {
  const { client_id } = req.query

  if (!client_id) {
    return res.status(400).json({ error: 'client_id richiesto' })
  }

  try {
    const client = await getClient(client_id)
    res.json({
      token_status: client.token_status || 'missing',
      token_expiry: client.token_expiry,
      has_token: !!client.refresh_token,
      account_id: client.account_id,
      location_id: client.location_id,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
