import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import { contributorApi, session, pendingRedirect } from '../../lib/api'

const ROLE_LABEL = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
}

const ROLE_COLORS = {
  MAHASISWA:   { bg: 'bg-moss/15',    text: 'text-moss',    border: 'border-moss/25'    },
  AKADEMISI:   { bg: 'bg-sienna/15',  text: 'text-sienna',  border: 'border-sienna/25'  },
  PEMUDA_ADAT: { bg: 'bg-clay/15',    text: 'text-clay',    border: 'border-clay/25'    },
  AKTIVIS:     { bg: 'bg-forest/15',  text: 'text-forest',  border: 'border-forest/25'  },
}

const RANK_ACCENT = {
  1: { dot: 'bg-yellow-500/80', num: 'text-yellow-600' },
  2: { dot: 'bg-ash/40',        num: 'text-ash'         },
  3: { dot: 'bg-clay/60',       num: 'text-clay'        },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ContributorCard({ entry, isLoggedIn, onClick }) {
  const { user, rank, breakdown } = entry
  const roleKey  = user?.role_category
  const colors   = ROLE_COLORS[roleKey] ?? ROLE_COLORS['MAHASISWA']
  const accent   = RANK_ACCENT[rank]
  const initials = getInitials(user?.full_name)
  const articleCount = (breakdown?.author_article_count ?? 0) + (breakdown?.contributor_article_count ?? 0)

  return (
    <article
      onClick={onClick}
      className="card corner-accent p-5 flex flex-col gap-4 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Rank + avatar */}
        <div className="relative flex-shrink-0">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
              font-serif font-semibold text-sm ${colors.bg} ${colors.text} border ${colors.border}`}>
              {initials}
            </div>
          )}
          {accent && (
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white
              flex items-center justify-center ${accent.dot}`}>
              <span className="font-sans text-[0.45rem] font-bold text-white leading-none">{rank}</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1rem] font-semibold text-ink leading-tight truncate
            group-hover:text-forest transition-colors duration-[240ms]">
            {user?.full_name ?? '[Akun dihapus]'}
          </h3>
          {user?.institution && (
            <p className="font-sans text-caption text-ash truncate">{user.institution}</p>
          )}
        </div>

        <ArrowUpRight
          size={14}
          className="text-ash/40 flex-shrink-0 group-hover:text-clay
            group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[240ms]"
        />
      </div>

      <div className="flex items-center justify-between">
        {roleKey && (
          <span className={`tag text-[0.65rem] ${colors.bg} ${colors.text} border ${colors.border}`}>
            {ROLE_LABEL[roleKey] ?? roleKey}
          </span>
        )}
        {articleCount > 0 && (
          <span className="flex items-center gap-1 font-sans text-caption text-ash ml-auto">
            <FileText size={11} className="flex-shrink-0" />
            {articleCount} karya
          </span>
        )}
      </div>

      <p className="font-sans text-caption text-ash/60 border-t border-sand pt-3">
        {isLoggedIn ? 'Lihat profil lengkap' : 'Masuk untuk melihat profil'}
      </p>
    </article>
  )
}

function CardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-sand flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-sand rounded w-3/4" />
          <div className="h-3 bg-sand/60 rounded w-1/2" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 bg-sand rounded-full w-20" />
        <div className="h-3 bg-sand/60 rounded w-14" />
      </div>
      <div className="h-3 bg-sand/60 rounded w-32 mt-1" />
    </div>
  )
}

export default function ContributorShowcase() {
  const navigate   = useNavigate()
  const isLoggedIn = !!session.getAccess()

  const [contributors, setContributors] = useState([])
  const [loading, setLoading]           = useState(true)
  const [sourceLabel, setSourceLabel]   = useState('')

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }  // leaderboard requires auth — skip for guests

    ;(async () => {
      try {
        const { ok: mOk, data: mData } = await contributorApi.leaderboard({ limit: 6 })
        const monthly = mOk ? (mData.results ?? []) : []

        if (monthly.length > 0) {
          setContributors(monthly)
          setSourceLabel(mData.period_label ?? 'Bulan Ini')
        } else {
          // New month — no monthly data yet, fall back to all-time
          const { ok: aOk, data: aData } = await contributorApi.leaderboardAllTime({ limit: 6 })
          if (aOk && aData.results?.length > 0) {
            setContributors(aData.results)
            setSourceLabel('Sepanjang Waktu')
          }
        }
      } catch { /* network error — show empty state */ }
      setLoading(false)
    })()
  }, [])

  const handleCardClick = (entry) => {
    if (!entry.user?.id) return
    if (isLoggedIn) {
      navigate(`/profile/${entry.user.id}`)
    } else {
      pendingRedirect.save(`/profile/${entry.user.id}`)
      navigate('/login')
    }
  }

  return (
    <section id="kontributor" className="py-24 lg:py-32 bg-sand/20">
      <div className="max-w-content mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Komunitas Kontributor</span>
            </div>
            <h2 className="font-serif text-h1 font-semibold text-ink leading-tight max-w-md">
              Wajah di Balik{' '}
              <em className="font-accent italic text-clay">Pengetahuan Ini</em>
            </h2>
          </div>
          {!loading && sourceLabel && (
            <span className="font-sans text-caption text-ash/70 md:pb-1 flex-shrink-0">
              Peringkat: <strong className="text-ink font-medium">{sourceLabel}</strong>
            </span>
          )}
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(ROLE_COLORS).map(([key, colors]) => (
            <span
              key={key}
              className={`font-sans text-caption uppercase tracking-widest px-3 py-1.5
                rounded-chip border font-medium ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {ROLE_LABEL[key]}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : !isLoggedIn ? (
            // Guest teaser — leaderboard requires auth
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-5 flex flex-col gap-4 relative select-none">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-sand/60 flex-shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3.5 bg-sand/60 rounded w-3/4" />
                      <div className="h-3 bg-sand/40 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-sand/60 rounded-full w-20" />
                    <div className="h-3 bg-sand/40 rounded w-14" />
                  </div>
                  <div className="h-3 bg-sand/40 rounded w-32" />
                  {i === 2 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center
                      bg-white/80 backdrop-blur-[2px] rounded-card">
                      <p className="font-serif text-sm font-semibold text-ink mb-3 text-center px-4">
                        Masuk untuk melihat kontributor
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="btn-primary text-sm px-5 py-2"
                      >
                        Masuk Sekarang
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : contributors.length > 0 ? (
            contributors.map((entry) => (
              <ContributorCard
                key={entry.rank}
                entry={entry}
                isLoggedIn={isLoggedIn}
                onClick={() => handleCardClick(entry)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="font-sans text-body text-ash">Belum ada data kontributor.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        {!loading && contributors.length > 0 && (
          <div className="mt-10 text-center">
            <p className="font-sans text-body text-ash">
              Bergabung dan jadilah bagian dari komunitas pengetahuan adat Indonesia.{' '}
              {!isLoggedIn && (
                <button
                  onClick={() => navigate('/register')}
                  className="font-semibold text-forest hover:text-clay transition-colors duration-[240ms]"
                >
                  Daftar sekarang →
                </button>
              )}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
