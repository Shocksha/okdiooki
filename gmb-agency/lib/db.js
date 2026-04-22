import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─── CLIENTS ────────────────────────────────────────────────────────────────

export async function getClients() {
  const { data, error } = await supabase
    .from('gmb_clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getClient(clientId) {
  const { data, error } = await supabase
    .from('gmb_clients')
    .select('*')
    .eq('client_id', clientId)
    .single()
  if (error) throw error
  return data
}

export async function createClient(client) {
  const { data, error } = await supabase
    .from('gmb_clients')
    .insert({ ...client, created_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateClient(clientId, updates) {
  const { data, error } = await supabase
    .from('gmb_clients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('client_id', clientId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteClient(clientId) {
  const { error } = await supabase
    .from('gmb_clients')
    .delete()
    .eq('client_id', clientId)
  if (error) throw error
}

// ─── POSTS ───────────────────────────────────────────────────────────────────

export async function getPosts(clientId = null, status = null) {
  let query = supabase
    .from('gmb_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (clientId) query = query.eq('client_id', clientId)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createPost(post) {
  const { data, error } = await supabase
    .from('gmb_posts')
    .insert({ ...post, created_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePost(id, updates) {
  const { data, error } = await supabase
    .from('gmb_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('gmb_posts').delete().eq('id', id)
  if (error) throw error
}

// ─── SITES ───────────────────────────────────────────────────────────────────

export async function getSites(clientId = null) {
  let query = supabase.from('gmb_sites').select('*')
  if (clientId) query = query.eq('client_id', clientId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function upsertSite(site) {
  const { data, error } = await supabase
    .from('gmb_sites')
    .upsert({ ...site, created_at: new Date().toISOString() }, { onConflict: 'client_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSite(clientId) {
  const { error } = await supabase
    .from('gmb_sites')
    .delete()
    .eq('client_id', clientId)
  if (error) throw error
}
