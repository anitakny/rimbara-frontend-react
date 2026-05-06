import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Eye, FileText, MessageSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { contributorApi, session } from '../lib/api'

const BATIK = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`

const ROLE_LABEL = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
}

const ROLE_BADGE = {
  MAHASISWA:   { bg: 'bg-moss/10',   text: 'text-moss',   border: 'border-moss/20'   },
  AKADEMISI:   { bg: 'bg-sienna/10', text: 'text-sienna', border: 'border-sienna/20' },
  PEMUDA_ADAT: { bg: 'bg-clay/10',   text: 'text-clay',   border: 'border-clay/20'   },
  AKTIVIS:     { bg: 'bg-forest/10', text: 'text-forest', border: 'border-forest/20' },
}

const RANK_ACCENT = {
  1: { badge: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: 'bg-yellow-500/80', score: 'text-yellow-700' },
  2: { badge: 'bg-sand/60 border-sand text-ash',                dot: 'bg-ash/40',        score: 'text-ash'        },
  3: { badge: 'bg-clay/10 border-clay/20 text-clay',            dot: 'bg-clay/60',       score: 'text-clay'       },
}

const WEIGHTS = {
  AUTHOR_ARTICLE: 10, AUTHOR_VIEW: 1, AUTHOR_COMMENT: 3,
  CONTRIB_ARTICLE: 5, CONTRIB_COMMENT: 1,
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Avatar({ user, size = 'md' }) {
  const cls = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  if (user?.photo_url) {
    return <img src={user.photo_url} alt={user.full_name} className={`${cls} rounded-full object-cover flex-shrink-0`} />
  }
  return (
    <div className={`${cls} rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0`}>
      <span className="font-serif font-semibold text-forest leading-none">{getInitials(user?.full_name)}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Podium card — top 3
// ---------------------------------------------------------------------------
function PodiumCard({ entry, onClick }) {
  const accent = RANK_ACCENT[entry.rank] ?? RANK_ACCENT[3]
  const role   = ROLE_LABEL[entry.user?.role_category]
  const badge  = ROLE_BADGE[entry.user?.role_category]
  const bk     = entry.breakdown

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-card border border-sand shadow-subtle px-5 py-6 flex flex-col items-center text-center
        cursor-pointer hover:shadow-elevated transition-all duration-[240ms]
        ${entry.rank === 1 ? 'md:-mt-5 md:pt-8 md:pb-8 ring-1 ring-yellow-200' : ''}`}
    >
      <span className={`mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${accent.badge}`}>
        {entry.rank === 1 && <Trophy size={10} />}
        #{entry.rank}
      </span>

      <Avatar user={entry.user} size="lg" />

      <h3 className="font-serif text-h3 font-semibold text-ink leading-tight mt-3 mb-1 line-clamp-2">
        {entry.user?.full_name ?? '[Akun dihapus]'}
      </h3>

      {role && badge && (
        <span className={`tag text-[0.6rem] py-0.5 ${badge.bg} ${badge.text} border ${badge.border} mb-2`}>
          {role}
        </span>
      )}
      {entry.user?.institution && (
        <p className="font-sans text-[0.65rem] text-ash mb-3 line-clamp-1 max-w-full">{entry.user.institution}</p>
      )}

      <div className="mt-auto pt-3 border-t border-sand w-full">
        <span className={`font-serif text-h1 font-semibold font-tabular block ${accent.score}`}>
          {entry.total_score.toLocaleString('id-ID')}
        </span>
        <span className="font-sans text-[0.6rem] text-ash uppercase tracking-wider">poin</span>
      </div>

      <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
        <span className="flex items-center gap-0.5 font-sans text-[0.6rem] text-ash">
          <FileText size={9} />{bk.author_article_count + bk.contributor_article_count} artikel
        </span>
        {bk.author_total_views > 0 && (
          <span className="flex items-center gap-0.5 font-sans text-[0.6rem] text-ash">
            <Eye size={9} />{bk.author_total_views.toLocaleString('id-ID')}
          </span>
        )}
        {(bk.author_total_comments + bk.contributor_total_comments) > 0 && (
          <span className="flex items-center gap-0.5 font-sans text-[0.6rem] text-ash">
            <MessageSquare size={9} />{bk.author_total_comments + bk.contributor_total_comments}
          </span>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Rank row — 4th place and beyond
// ---------------------------------------------------------------------------
function RankRow({ entry, onClick }) {
  const role  = ROLE_LABEL[entry.user?.role_category]
  const badge = ROLE_BADGE[entry.user?.role_category]
  const bk    = entry.breakdown

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 py-4 border-b border-sand/60 last:border-0 rounded-lg
        hover:bg-sand/20 -mx-4 px-4 cursor-pointer transition-colors duration-[240ms]"
    >
      <div className="w-7 text-center flex-shrink-0">
        <span className="font-sans text-sm font-semibold text-ash/50 font-tabular">{entry.rank}</span>
      </div>

      <Avatar user={entry.user} size="sm" />

      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-ink leading-snug truncate">
          {entry.user?.full_name ?? '[Akun dihapus]'}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {role && badge && (
            <span className={`tag text-[0.55rem] py-0 ${badge.bg} ${badge.text} border ${badge.border}`}>
              {role}
            </span>
          )}
          {entry.user?.institution && (
            <span className="font-sans text-[0.6rem] text-ash/70 truncate">{entry.user.institution}</span>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <span className="flex items-center gap-1 font-sans text-[0.65rem] text-ash">
          <FileText size={10} />{bk.author_article_count + bk.contributor_article_count}
        </span>
        {bk.author_total_views > 0 && (
          <span className="flex items-center gap-1 font-sans text-[0.65rem] text-ash">
            <Eye size={10} />{bk.author_total_views.toLocaleString('id-ID')}
          </span>
        )}
        {(bk.author_total_comments + bk.contributor_total_comments) > 0 && (
          <span className="flex items-center gap-1 font-sans text-[0.65rem] text-ash">
            <MessageSquare size={10} />{bk.author_total_comments + bk.contributor_total_comments}
          </span>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <span className="font-serif text-h3 font-semibold text-forest font-tabular">
          {entry.total_score.toLocaleString('id-ID')}
        </span>
        <p className="font-sans text-[0.6rem] text-ash">poin</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function Skeleton() {
  return (
    <div className="animate-pulse">
      {/* Podium skeleton — desktop only */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 mb-8 items-end">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`bg-sand/30 rounded-card ${i === 1 ? 'h-72 -mt-5' : 'h-60'}`} />
        ))}
      </div>
      {/* Row skeleton — always visible */}
      <div className="bg-white rounded-card border border-sand px-4 py-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-sand/40 last:border-0">
            <div className="w-7 h-4 bg-sand rounded" />
            <div className="w-8 h-8 bg-sand rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-sand rounded w-36" />
              <div className="h-2 bg-sand/60 rounded w-24" />
            </div>
            <div className="h-5 bg-sand rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('monthly')
  const [monthly, setMonthly] = useState(null)
  const [allTime, setAllTime] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.getAccess()) {
      navigate('/login', { replace: true })
      return
    }
    Promise.all([
      contributorApi.leaderboard({ limit: 20 }),
      contributorApi.leaderboardAllTime({ limit: 20 }),
    ]).then(([mRes, aRes]) => {
      if (mRes.ok && mRes.data.results?.length > 0) setMonthly(mRes.data)
      if (aRes.ok && aRes.data.results?.length > 0) setAllTime(aRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleTab = (t) => setTab(t)

  const activeData = tab === 'monthly' ? monthly : allTime
  const results    = activeData?.results ?? []
  const top3       = results.filter(e => e.rank <= 3)
  const rest       = results.filter(e => e.rank > 3)

  const podiumOrder = [
    top3.find(e => e.rank === 2),
    top3.find(e => e.rank === 1),
    top3.find(e => e.rank === 3),
  ].filter(Boolean)

  const goToProfile = (entry) => {
    if (entry.user?.id) navigate(`/profile/${entry.user.id}`)
  }

  const periodLabel = activeData?.period_label ?? ''

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative min-h-[42vh] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/70 to-ink/90 z-10" />
            <div
              className="absolute inset-0 z-0"
              style={{ background: 'radial-gradient(ellipse at 30% 40%, #2A4F3C 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #4A6238 0%, transparent 50%), linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
            />
            <div className="absolute inset-0 z-20 opacity-[0.05]" style={{ backgroundImage: BATIK }} />
          </div>

          <div className="relative z-30 max-w-content mx-auto px-6 lg:px-12 pb-16 pt-28 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="h-px w-8 bg-clay/60" />
                <span className="font-sans text-caption uppercase tracking-widest text-bone/60 font-medium">
                  Papan Peringkat
                </span>
              </div>
              <h1 className="font-serif text-display font-semibold text-bone leading-[1.05] mb-4">
                Kontributor{' '}
                <em className="font-accent italic text-sand/90">Terbaik</em>
              </h1>
              <p className="font-sans text-body-lg text-bone/70 leading-relaxed">
                Skor dari artikel yang ditulis dan dikontribusikan — views dan komentar ikut dihitung.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bone to-transparent z-30" />
        </section>

        {/* ── Content ───────────────────────────────────────────────── */}
        <div className="max-w-content mx-auto px-6 lg:px-12 py-12 md:py-16">

          {/* Tabs + period */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="flex gap-1 p-1 bg-sand/30 rounded-lg border border-sand">
              {[
                { key: 'monthly', label: 'Bulan Ini' },
                { key: 'alltime', label: 'Sepanjang Waktu' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTab(key)}
                  className={`px-4 py-1.5 rounded-md font-sans text-sm font-medium transition-all duration-[240ms] ${
                    tab === key
                      ? 'bg-white text-forest shadow-subtle'
                      : 'text-ash hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {!loading && periodLabel && (
              <span className="font-sans text-caption text-ash">
                Periode: <strong className="font-medium text-ink">{periodLabel}</strong>
              </span>
            )}
          </div>

          {/* Scoring formula */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 p-4 bg-white rounded-card border border-sand shadow-subtle">
            <span className="font-sans text-caption text-ash font-medium">Formula skor:</span>
            <div className="flex items-center gap-2">
              <span className="tag text-[0.6rem] bg-forest/10 text-forest border-forest/20">Penulis</span>
              <span className="font-sans text-[0.7rem] text-ash">
                {WEIGHTS.AUTHOR_ARTICLE} pts/artikel · {WEIGHTS.AUTHOR_VIEW} pt/view · {WEIGHTS.AUTHOR_COMMENT} pts/komentar
              </span>
            </div>
            <div className="h-3 w-px bg-sand hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="tag text-[0.6rem] bg-moss/10 text-moss border-moss/20">Kontributor</span>
              <span className="font-sans text-[0.7rem] text-ash">
                {WEIGHTS.CONTRIB_ARTICLE} pts/artikel · {WEIGHTS.CONTRIB_COMMENT} pt/komentar
              </span>
            </div>
          </div>

          {/* Main content */}
          {loading ? (
            <Skeleton />
          ) : results.length === 0 ? (
            <div className="bg-white rounded-card border border-sand px-8 py-16 text-center">
              <Trophy size={36} className="text-ash/30 mx-auto mb-4" />
              <p className="font-serif text-h3 font-semibold text-ink mb-2">Belum ada data leaderboard</p>
              <p className="font-sans text-body text-ash">
                Leaderboard akan muncul setelah ada artikel yang diterbitkan.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: all results as ranked rows */}
              <div className="md:hidden bg-white rounded-card border border-sand shadow-subtle px-4 py-2">
                {results.map(entry => (
                  <RankRow key={entry.rank} entry={entry} onClick={() => goToProfile(entry)} />
                ))}
              </div>

              {/* Desktop: podium for top 3 + rows for 4+ */}
              <div className="hidden md:block">
                {podiumOrder.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-8 items-end">
                    {podiumOrder.map(entry => (
                      <PodiumCard key={entry.rank} entry={entry} onClick={() => goToProfile(entry)} />
                    ))}
                  </div>
                )}
                {rest.length > 0 && (
                  <div className="bg-white rounded-card border border-sand shadow-subtle px-6 py-2">
                    {rest.map(entry => (
                      <RankRow key={entry.rank} entry={entry} onClick={() => goToProfile(entry)} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
