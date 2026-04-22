import { getClient, createPost, updatePost } from '../lib/db.js'
import { publishPost } from '../lib/gmb.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { client_id, post_type, summary, media_url, cta_type, cta_url, destination } = req.body

  if (!client_id || !summary) {
    return res.status(400).json({ error: 'client_id e summary sono obbligatori' })
  }

  try {
    const client = await getClient(client_id)

    // Save post record
    const post = await createPost({
      client_id,
      post_type: post_type || 'update',
      summary,
      status: 'pending',
    })

    const results = { gmb: null, site: null }
    let finalStatus = 'published'
    let errorMsg = null

    // Publish to GMB
    if (destination !== 'site_only') {
      if (client.token_status !== 'active') {
        finalStatus = 'failed'
        errorMsg = 'Token GMB non attivo. Ricollega il profilo Google.'
      } else {
        try {
          const gmbResult = await publishPost(client_id, { summary, post_type, media_url, cta_type, cta_url })
          results.gmb = gmbResult.name
        } catch (gmbErr) {
          finalStatus = 'failed'
          errorMsg = gmbErr.message
        }
      }
    }

    await updatePost(post.id, {
      status: finalStatus,
      gmb_post_id: results.gmb,
      error_msg: errorMsg,
    })

    if (finalStatus === 'failed') {
      return res.status(422).json({ error: errorMsg, post: { ...post, status: finalStatus } })
    }

    res.json({ success: true, post: { ...post, status: finalStatus, gmb_post_id: results.gmb } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
