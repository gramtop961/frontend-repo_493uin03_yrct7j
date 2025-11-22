export default function Results({ results }) {
  if (!results) return null
  if (results.length === 0) {
    return (
      <div className="mt-8 text-blue-200/80">No results found.</div>
    )
  }
  return (
    <div className="mt-8 space-y-6">
      {results.map((r, idx) => (
        <div key={idx} className="group p-4 rounded-xl bg-slate-800/40 border border-blue-500/20 hover:border-blue-400/40 transition">
          <a href={r.url} target="_blank" rel="noreferrer" className="text-xl font-semibold text-blue-300 group-hover:text-blue-200">
            {r.title}
          </a>
          {r.url && (
            <div className="text-xs text-blue-300/60 mt-1 break-all">{r.url}</div>
          )}
          {r.snippet && (
            <p className="text-blue-200/80 mt-2">{r.snippet}</p>
          )}
        </div>
      ))}
    </div>
  )
}
