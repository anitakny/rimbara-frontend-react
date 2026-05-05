import { ArrowUpRight, Trophy } from 'lucide-react'

const mockLeaderboard = [
  { rank: 1, name: 'Winda Lestari',   role: 'Pemuda Adat', contributions: 24 },
  { rank: 2, name: 'Ahmad Fauzi',     role: 'Akademisi',   contributions: 18 },
  { rank: 3, name: 'Sari Dewi Putri', role: 'Mahasiswa',   contributions: 15 },
  { rank: 4, name: 'Budi Santoso',    role: 'Aktivis',     contributions: 12 },
  { rank: 5, name: 'Rina Handayani',  role: 'Mahasiswa',   contributions: 9  },
]

const rankAccent = {
  1: { dot: 'bg-yellow-500/80', num: 'text-yellow-700' },
  2: { dot: 'bg-ash/40',        num: 'text-ash' },
  3: { dot: 'bg-clay/60',       num: 'text-clay' },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function LeaderboardCard() {
  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-sand">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-6 bg-clay/50" />
          <Trophy size={12} className="text-clay flex-shrink-0" />
        </div>
        <h3 className="font-serif text-h3 font-semibold text-ink leading-tight">
          Kontributor{' '}
          <em className="font-accent italic text-clay">Terbaik</em>
        </h3>
      </div>

      {/* List */}
      <div className="px-5 py-1">
        {mockLeaderboard.map((entry) => {
          const accent = rankAccent[entry.rank]
          return (
            <div
              key={entry.rank}
              className="flex items-center gap-3 py-3 border-b border-sand/50 last:border-0"
            >
              {/* Rank dot */}
              <div className="flex flex-col items-center gap-0.5 w-4 flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${accent?.dot ?? 'bg-sand'}`} />
                <span className={`font-sans text-[0.6rem] font-semibold ${accent?.num ?? 'text-ash/50'}`}>
                  {entry.rank}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                  {getInitials(entry.name)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-xs font-medium text-ink leading-snug truncate">
                  {entry.name}
                </p>
                <p className="font-sans text-[0.6rem] text-ash leading-snug">
                  {entry.role}
                </p>
              </div>

              {/* Count */}
              <span className="font-serif text-sm font-semibold text-forest flex-shrink-0 font-tabular">
                {entry.contributions}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-sand">
        <button className="w-full flex items-center justify-center gap-1.5 font-sans text-caption
          text-ash hover:text-forest transition-colors duration-[240ms] group text-xs">
          Lihat semua kontributor
          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-[240ms]" />
        </button>
      </div>
    </div>
  )
}
