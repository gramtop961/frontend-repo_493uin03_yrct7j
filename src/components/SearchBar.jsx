import { useState } from 'react'

export default function SearchBar({ onSearch, loading, engineName }) {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onSearch(value.trim())
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <div className="flex items-center gap-2 bg-slate-800/60 border border-blue-500/30 rounded-2xl p-2 focus-within:border-blue-400/60">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Search the web with ${engineName}`}
          className="flex-1 bg-transparent outline-none text-white placeholder-blue-200/60 px-4 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  )
}
