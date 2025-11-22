import { useEffect, useMemo, useState } from 'react'
import { Bot, Settings, Wallpaper } from 'lucide-react'

function Taskbar({ onOpenFluxxys, onOpenSettings, displayName }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur border-t border-white/10 flex items-center gap-2 px-3">
      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">🪟</div>
      <div className="flex-1"></div>
      <button onClick={onOpenFluxxys} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm">
        <Bot size={16}/> Fluxxys AI
      </button>
      <button onClick={onOpenSettings} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm">
        <Settings size={16}/> Settings
      </button>
      <div className="ml-2 text-white/70 text-sm">{displayName}</div>
    </div>
  )
}

function AppIcon({ title, emoji, onOpen }) {
  return (
    <button onClick={onOpen} className="w-24 h-24 flex flex-col items-center justify-center gap-2 text-white/90 hover:text-white">
      <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
        {emoji}
      </div>
      <div className="text-xs">{title}</div>
    </button>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[95vw] bg-slate-900 text-white rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

function Fluxxys({ baseUrl, token }) {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const ask = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setAnswer(null)
    const res = await fetch(`${baseUrl}/api/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setAnswer(data)
    setLoading(false)
  }
  return (
    <div>
      <form onSubmit={ask} className="flex items-center gap-2">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none" placeholder="Ask me anything..." />
        <button className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500">Ask</button>
      </form>
      {loading && <div className="mt-3 text-white/70">Thinking...</div>}
      {answer && (
        <div className="mt-4 space-y-1">
          <div className="text-white/90">{answer.answer}</div>
          {answer.source && <a href={answer.source} target="_blank" rel="noreferrer" className="text-sky-300 text-sm">{answer.title || answer.source}</a>}
        </div>
      )}
    </div>
  )
}

function SettingsPanel({ baseUrl, token, wallpaper, setWallpaper }) {
  const presets = useMemo(()=>[
    { key: 'w11-bloom', label: 'Windows 11 Bloom', url: 'https://images.unsplash.com/photo-1520975922215-c0cbf1a2c4af?q=80&w=1920&auto=format&fit=crop' },
    { key: 'purple-flow', label: 'Purple Flow', url: 'https://images.unsplash.com/photo-1520975922215-c0cbf1a2c4af?q=80&w=1920&auto=format&fit=crop' },
    { key: 'blue-nebula', label: 'Blue Nebula', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop' },
  ], [])

  const save = async (val) => {
    await fetch(`${baseUrl}/api/settings/wallpaper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ wallpaper: val })
    })
    setWallpaper(val)
  }

  return (
    <div className="space-y-3">
      <div className="text-white/80 mb-2">Choose your wallpaper</div>
      <div className="grid grid-cols-3 gap-3">
        {presets.map(p => (
          <button key={p.key} onClick={()=>save(p.url)} className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20">
            <img src={p.url} alt={p.label} className="w-full h-28 object-cover" />
            <div className="px-2 py-1 text-xs text-white/80">{p.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Desktop({ token, displayName, initialWallpaper, baseUrl }) {
  const [showFlux, setShowFlux] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [wallpaper, setWallpaper] = useState(initialWallpaper)

  const bgStyle = wallpaper ? { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}

  return (
    <div className="min-h-screen relative" style={bgStyle}>
      {!wallpaper && (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/40 via-indigo-600/40 to-purple-600/40" />
      )}
      <div className="relative min-h-screen p-6 grid grid-cols-6 gap-6 content-start">
        <AppIcon title="Fluxxys AI" emoji={<Bot size={22} />} onOpen={()=>setShowFlux(true)} />
        <AppIcon title="Settings" emoji={<Settings size={22} />} onOpen={()=>setShowSettings(true)} />
      </div>

      <Taskbar onOpenFluxxys={()=>setShowFlux(true)} onOpenSettings={()=>setShowSettings(true)} displayName={displayName} />

      {showFlux && (
        <Modal title="Fluxxys AI" onClose={()=>setShowFlux(false)}>
          <Fluxxys baseUrl={baseUrl} token={token} />
        </Modal>
      )}

      {showSettings && (
        <Modal title="Settings" onClose={()=>setShowSettings(false)}>
          <SettingsPanel baseUrl={baseUrl} token={token} wallpaper={wallpaper} setWallpaper={setWallpaper} />
        </Modal>
      )}
    </div>
  )
}
