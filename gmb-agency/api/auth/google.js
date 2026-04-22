import { buildOAuthUrl } from '../../lib/google.js'

export default function handler(req, res) {
  const { client_id } = req.query

  if (!client_id) {
    return res.status(400).json({ error: 'client_id richiesto' })
  }

  const url = buildOAuthUrl(client_id)
  res.redirect(url)
}
