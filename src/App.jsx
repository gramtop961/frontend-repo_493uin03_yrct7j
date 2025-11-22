import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Desktop from './components/Desktop'
import SearchBar from './components/SearchBar'
import Results from './components/Results'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [token, setToken] = useState(null)
  const [me, setMe] = useState(null)
  const [loadingMe, setLoadingMe] = useState(false)

  // Legacy Waves search (kept as optional app accessible after login via a tab later if needed)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [results, setResults] = useState(null)
  const [meta, setMeta] = useState({ engine: 'Waves' })

  useEffect(() => {
    const t = localStorage.getItem('waves_token')
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return
      setLoadingMe(true)
      try {
        const res = await fetch(`${baseUrl}/api/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setMe(data)
        } else {
          setToken(null)
          localStorage.removeItem('waves_token')
        }
      } finally {
        setLoadingMe(false)
      }
    }
    fetchMe()
  }, [token])

  const handleAuthed = (t) => {
    setToken(t)
    localStorage.setItem('waves_token', t)
  }

  const onSearch = async (q) => {
    setLoadingSearch(true)
    setResults(null)
    try {
      const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
      setMeta({ engine: data.engine || 'Waves', proxy: data.proxy })
    } catch (err) {
      setResults([])
    } finally {
      setLoadingSearch(false)
    }
  }

  if (!token) {
    return <Auth onAuthed={handleAuthed} baseUrl={baseUrl} />
  }

  if (loadingMe || !me) {
    return <div className="min-h-screen grid place-items-center text-white bg-slate-900">Loading your desktop...</div>
  }

  return (
    <Desktop token={token} baseUrl={baseUrl} displayName={me.display_name || me.username} initialWallpaper={me.wallpaper} />
  )
}

export default App
