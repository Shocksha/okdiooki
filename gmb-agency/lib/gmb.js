import { getAccessToken } from './google.js'
import { getClient } from './db.js'

const GMB_BASE = 'https://mybusiness.googleapis.com/v4'

export async function publishPost(clientId, postData) {
  const [accessToken, client] = await Promise.all([
    getAccessToken(clientId),
    getClient(clientId),
  ])

  if (!client.account_id || !client.location_id) {
    throw new Error('Account ID o Location ID mancanti per questo cliente')
  }

  const body = {
    languageCode: 'it',
    summary: postData.summary,
    topicType: postData.post_type === 'offer' ? 'OFFER' : 'STANDARD',
  }

  if (postData.media_url) {
    body.media = [{ mediaFormat: 'PHOTO', sourceUrl: postData.media_url }]
  }

  if (postData.cta_type && postData.cta_url) {
    body.callToAction = {
      actionType: postData.cta_type.toUpperCase().replace('-', '_'),
      url: postData.cta_url,
    }
  }

  if (postData.post_type === 'event') {
    body.topicType = 'EVENT'
    body.event = {
      title: postData.event_title || 'Evento',
      schedule: {
        startDate: postData.start_date || {},
        endDate: postData.end_date || {},
      },
    }
  }

  const url = `${GMB_BASE}/accounts/${client.account_id}/locations/${client.location_id}/localPosts`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || `GMB API error ${response.status}`)
  }

  return result
}

export async function getLocationInsights(clientId) {
  const [accessToken, client] = await Promise.all([
    getAccessToken(clientId),
    getClient(clientId),
  ])

  if (!client.account_id || !client.location_id) {
    throw new Error('Account ID o Location ID mancanti')
  }

  const endTime = new Date().toISOString()
  const startTime = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()

  const url = `${GMB_BASE}/accounts/${client.account_id}/locations:reportInsights`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationNames: [`accounts/${client.account_id}/locations/${client.location_id}`],
      basicRequest: {
        metricRequests: [
          { metric: 'QUERIES_DIRECT' },
          { metric: 'QUERIES_INDIRECT' },
          { metric: 'VIEWS_MAPS' },
          { metric: 'VIEWS_SEARCH' },
          { metric: 'ACTIONS_PHONE' },
          { metric: 'ACTIONS_WEBSITE' },
        ],
        timeRange: { startTime, endTime },
      },
    }),
  })

  const result = await response.json()
  if (!response.ok) throw new Error(result.error?.message || 'GMB Insights error')
  return result
}
