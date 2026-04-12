/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { clearSpotifyTokens, doRefreshToken, getStoredAccessToken } from '../lib/spotifyAuth'

const SpotifyPlayerContext = createContext(null)

export function SpotifyPlayerProvider({ children }) {
  const [token,       setToken]       = useState(() => getStoredAccessToken())
  const [sdkReady,    setSdkReady]    = useState(() => !!window.Spotify)
  const [deviceId,    setDeviceId]    = useState(null)
  const [playerState, setPlayerState] = useState(null)
  const [connecting,  setConnecting]  = useState(false)
  const playerRef = useRef(null)

  // ── Load Spotify SDK script once ─────────────────────────────────────────
  useEffect(() => {
    if (window.Spotify) { setSdkReady(true); return }
    window.onSpotifyWebPlaybackSDKReady = () => setSdkReady(true)
    const s = document.createElement('script')
    s.src   = 'https://sdk.scdn.co/spotify-player.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  // ── Fresh token helper ────────────────────────────────────────────────────
  const getFreshToken = useCallback(async () => {
    let t = getStoredAccessToken()
    if (!t) t = await doRefreshToken()
    if (t) setToken(t)
    return t
  }, [])

  // ── Init player when SDK + token are ready ────────────────────────────────
  useEffect(() => {
    if (!sdkReady || !token || playerRef.current) return

    setConnecting(true)

    const p = new window.Spotify.Player({
      name:          'HTF4 Admin Player',
      getOAuthToken: cb => getFreshToken().then(t => t && cb(t)),
      volume:        0.8,
    })

    p.addListener('ready', ({ device_id }) => {
      setDeviceId(device_id)
      setConnecting(false)
    })
    p.addListener('not_ready',            () => setDeviceId(null))
    p.addListener('player_state_changed', s  => setPlayerState(s ?? null))
    p.addListener('authentication_error', () => {
      clearSpotifyTokens()
      setToken(null)
      setConnecting(false)
    })
    p.addListener('account_error', () => {
      // Spotify Premium required
      setConnecting(false)
    })

    p.connect()
    playerRef.current = p
  }, [sdkReady, token, getFreshToken])

  // ── Disconnect + clear ────────────────────────────────────────────────────
  function disconnect() {
    playerRef.current?.disconnect()
    playerRef.current = null
    clearSpotifyTokens()
    setToken(null)
    setDeviceId(null)
    setPlayerState(null)
    setConnecting(false)
  }

  // ── Playback API ──────────────────────────────────────────────────────────
  async function playTrack(trackId) {
    const t = await getFreshToken()
    if (!t || !deviceId) return
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
    })
  }

  const p = playerRef.current

  return (
    <SpotifyPlayerContext.Provider value={{
      token, setToken,
      isConnected: !!deviceId,
      connecting,
      playerState,
      currentTrack: playerState?.track_window?.current_track ?? null,
      isPaused:     playerState?.paused ?? true,
      duration:     playerState?.duration ?? 0,
      playTrack,
      togglePlay:   ()  => p?.togglePlay(),
      seek:         ms  => p?.seek(ms),
      setVolume:    vol => p?.setVolume(vol),
      previous:     ()  => p?.previousTrack(),
      next:         ()  => p?.nextTrack(),
      disconnect,
    }}>
      {children}
    </SpotifyPlayerContext.Provider>
  )
}

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext)
