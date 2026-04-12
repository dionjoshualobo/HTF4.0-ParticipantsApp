// Supabase Edge Function — Spotify search proxy
// Deploy: supabase functions deploy spotify-search
// Secrets (set via Supabase Dashboard → Edge Functions → Manage secrets, or CLI):
//   supabase secrets set SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=xxx

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken!

  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')

  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET secrets.')
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify token error ${res.status}: ${text}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken!
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { q } = await req.json().catch(() => ({}))
    if (!q?.trim()) return json({ error: 'Missing query parameter q' }, 400)

    const token = await getToken()
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=15`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!res.ok) throw new Error(`Spotify search failed: ${res.status}`)

    const data = await res.json()
    const tracks = (data.tracks?.items ?? [])
      .filter((t: any) => !t.explicit)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: t.artists.map((a: any) => a.name).join(', '),
        album: t.album.name,
        albumArt: t.album.images[0]?.url ?? null,
        durationMs: t.duration_ms,
        isExplicit: false,
        uri: t.uri,
      }))

    return json({ tracks })
  } catch (e) {
    console.error(e)
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}
