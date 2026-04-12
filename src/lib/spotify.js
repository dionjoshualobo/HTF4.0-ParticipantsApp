const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1'

let cachedToken = null
let tokenExpiresAt = 0

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Add VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET to .env')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Spotify token error ${res.status}${text ? ': ' + text : ''}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export async function searchTracks(query) {
  const token = await getToken()
  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&type=track`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Spotify search failed (${res.status}): ${body?.error?.message ?? JSON.stringify(body)}`)
  }
  const data = await res.json()

  return (data.tracks?.items ?? [])
    .filter(t => !t.explicit)
    .map(t => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map(a => a.name).join(', '),
      album: t.album.name,
      albumArt: t.album.images[0]?.url ?? null,
      durationMs: t.duration_ms,
      isExplicit: t.explicit,
      uri: t.uri,
    }))
}
