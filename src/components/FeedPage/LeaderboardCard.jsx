import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Trophy } from 'lucide-react'
import { contributorApi } from '../../lib/api'

const ROLE_LABEL = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
}

const RANK_ACCENT = {
  1: { dot: 'bg-yellow-500/80', num: 'text-yellow-700' },
  2: { dot: 'bg-ash/40',        num: 'text-ash'         },
  3: { dot: 'bg-clay/60',       num: 'text-clay'        },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function CardSkeleton() {
  return (
    <div className="animate-pulse px-5 py-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-sand/50 last:border-0">
          <div className="w-4 h-4 bg-sand rounded" />
          <div className="w-7 h-7 bg-sand rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-sand rounded w-24" />
            <div className="h-2 bg-sand/60 rounded w-16" />
          </div>
          <div className="h-3 bg-sand rounded w-8" />
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardCard() {
  const navigate = useNavigate()
  const [results, setResults]         = useState([])
  const [periodLabel, setPeriodLabel] = useState('')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { ok, data } = await contributorApi.leaderboard({ limit: 5 })
        if (ok && data.results?.length > 0) {
          setResults(data.results)
          setPeriodLabel(data.period_label ?? '')
        }
      } catch { /* network error — show empty state */ }
      setLoading(false)
    })()
  }, [])

  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-sand">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-6 bg-clay/50" />
          <Trophy size={12} className="text-clay flex-shrink-0" />
        </div>
        <div className="flex items-end justify-between gap-2">
          <h3 className="font-serif text-h3 font-semibold text-ink leading-tight">
            Kontributor{' '}
            <em className="font-accent italic text-clay">Terbaik</em>
          </h3>
          {periodLabel && (
            <span className="font-sans text-[0.6rem] text-ash/60 flex-shrink-0 pb-0.5">{periodLabel}</span>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <CardSkeleton />
      ) : results.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="font-sans text-caption text-ash">Belum ada data kontributor.</p>
        </div>
      ) : (
        <div className="px-5 py-1">
          {results.map((entry) => {
            const accent = RANK_ACCENT[entry.rank]
            return (
              <div
                key={entry.rank}
                onClick={() => entry.user?.id && navigate(`/profile/${entry.user.id}`)}
                className="flex items-center gap-3 py-3 border-b border-sand/50 last:border-0
                  hover:bg-sand/20 -mx-5 px-5 cursor-pointer transition-colors duration-[240ms]"
              >
                {/* Rank dot */}
                <div className="flex flex-col items-center gap-0.5 w-4 flex-shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${accent?.dot ?? 'bg-sand'}`} />
                  <span className={`font-sans text-[0.6rem] font-semibold ${accent?.num ?? 'text-ash/50'}`}>
                    {entry.rank}
                  </span>
                </div>

                {/* Avatar */}
                {entry.user?.photo_url ? (
                  <img
                    src={entry.user.photo_url}
                    alt={entry.user.full_name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                      {getInitials(entry.user?.full_name)}
                    </span>
                  </div>
                )}

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-ink leading-snug truncate">
                    {entry.user?.full_name ?? '[Akun dihapus]'}
                  </p>
                  <p className="font-sans text-[0.6rem] text-ash leading-snug">
                    {ROLE_LABEL[entry.user?.role_category] ?? ''}
                  </p>
                </div>

                {/* Score */}
                <span className="font-serif text-sm font-semibold text-forest flex-shrink-0 font-tabular">
                  {(entry.total_score ?? 0).toLocaleString('id-ID')}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-sand">
        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full flex items-center justify-center gap-1.5 font-sans text-xs
            text-ash hover:text-forest transition-colors duration-[240ms] group"
        >
          Lihat semua kontributor
          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-[240ms]" />
        </button>
      </div>
    </div>
  )
}
