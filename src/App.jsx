import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Results from './components/Results'

function App() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [meta, setMeta] = useState({ engine: 'Waves' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSearch = async (q) => {
    setLoading(true)
    setResults(null)
    try {
      const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
      setMeta({ engine: data.engine || 'Waves', proxy: data.proxy })
    } catch (err) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-3xl font-black text-blue-300 shadow-[0_0_35px_rgba(59,130,246,0.35)]">
                W
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Waves</h1>
            <p className="text-blue-200">Private web search through proxy 93.127.130.22</p>
          </div>

          <SearchBar onSearch={onSearch} loading={loading} engineName={meta.engine} />

          {!loading && results && (
            <div className="mt-4 text-blue-300/70 text-sm">
              {results.length} results • Proxy: <code className="bg-slate-800/60 px-1 rounded">{meta?.proxy?.http || '93.127.130.22 (default)'}</code>
            </div>
          )}

          {loading && (
            <div className="mt-8 text-blue-200/80">Searching via Waves proxy...</div>
          )}

          <Results results={results || []} />
        </div>
      </div>
    </div>
  )
}

export default App
