import { exchangeCodeForTokens } from '../../lib/google.js'
import { updateClient } from '../../lib/db.js'

export default async function handler(req, res) {
  const { code, state: clientId, error, error_description } = req.query

  const appUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:5173'

  if (error) {
    const msg = encodeURIComponent(error_description || error)
    return res.redirect(`${appUrl}/?oauth_error=${msg}&client_id=${clientId}`)
  }

  if (!code || !clientId) {
    return res.redirect(`${appUrl}/?oauth_error=Parametri+mancanti`)
  }

  try {
    const tokens = await exchangeCodeForTokens(code)
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    await updateClient(clientId, {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      token_expiry: expiresAt,
      token_status: 'active',
    })

    res.redirect(`${appUrl}/?oauth_success=1&client_id=${encodeURIComponent(clientId)}`)
  } catch (err) {
    const msg = encodeURIComponent(err.message)
    res.redirect(`${appUrl}/?oauth_error=${msg}&client_id=${clientId}`)
  }
}
