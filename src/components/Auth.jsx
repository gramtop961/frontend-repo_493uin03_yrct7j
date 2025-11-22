import { useState } from 'react'

export default function Auth({ onAuthed, baseUrl }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signup') {
        const res = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password: password, display_name: displayName || username.trim() })
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.detail || 'Could not create account')
        }
      }
      const res2 = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      })
      if (!res2.ok) {
        const d = await res2.json().catch(() => ({}))
        throw new Error(d.detail || 'Login failed')
      }
      const data = await res2.json()
      onAuthed(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-purple-500/30">
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">🪟</div>
            <div className="text-2xl font-semibold">Waves OS</div>
          </div>
          <div className="mb-6 text-white/80">
            {mode === 'signin' ? 'Sign in to your desktop' : 'Create your Waves account'}
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Username</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 outline-none focus:border-white/40" />
            </div>
            {mode==='signup' && (
              <div>
                <label className="block text-sm text-white/70 mb-1">Display name</label>
                <input value={displayName} onChange={e=>setDisplayName(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 outline-none focus:border-white/40" />
              </div>
            )}
            <div>
              <label className="block text-sm text-white/70 mb-1">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 outline-none focus:border-white/40" />
            </div>
            {error && <div className="text-red-300 text-sm">{error}</div>}
            <button disabled={loading} className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-60 rounded-xl py-2 font-semibold">
              {loading ? 'Please wait...' : (mode==='signin' ? 'Sign in' : 'Create account')}
            </button>
          </form>
          <div className="mt-4 text-sm text-white/70 text-center">
            {mode==='signin' ? (
              <span>Don\'t have an account? <button onClick={()=>setMode('signup')} className="text-white">Create one</button></span>
            ) : (
              <span>Already have an account? <button onClick={()=>setMode('signin')} className="text-white">Sign in</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
