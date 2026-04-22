import { getClient, updateClient } from './db.js'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const BUFFER_MS = 5 * 60 * 1000 // 5 minutes

export async function getAccessToken(clientId) {
  const client = await getClient(clientId)

  if (!client.refresh_token) {
    throw new Error('Nessun refresh token salvato per questo cliente')
  }

  const expiry = client.token_expiry ? new Date(client.token_expiry) : new Date(0)
  const now = new Date()

  // Token still valid
  if (client.access_token && expiry.getTime() - now.getTime() > BUFFER_MS) {
    return client.access_token
  }

  // Refresh
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: client.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()

  if (data.error) {
    await updateClient(clientId, { token_status: 'expired' })
    throw new Error(`Refresh token fallito: ${data.error_description || data.error}`)
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

  await updateClient(clientId, {
    access_token: data.access_token,
    token_expiry: expiresAt,
    token_status: 'active',
  })

  return data.access_token
}

export function buildOAuthUrl(clientId) {
  const scope = [
    'https://www.googleapis.com/auth/business.manage',
    'email',
    'profile',
  ].join(' ')

  return (
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope,
      access_type: 'offline',
      prompt: 'consent',
      state: clientId,
    })
  )
}

export async function exchangeCodeForTokens(code) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error_description || data.error)
  return data
}
