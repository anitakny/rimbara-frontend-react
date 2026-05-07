import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, MapPin, Users, FileText, Camera, Leaf, ArrowUpRight, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { profilesApi, articlesApi, session } from '../lib/api'
import ProfilePublicationCard from '../components/ProfilePage/ProfilePublicationCard'

const roleBadgeColors = {
  MAHASISWA:   { bg: 'bg-moss/12',    text: 'text-moss',    border: 'border-moss/30'    },
  AKADEMISI:   { bg: 'bg-sienna/12',  text: 'text-sienna',  border: 'border-sienna/25'  },
  PEMUDA_ADAT: { bg: 'bg-clay/12',    text: 'text-clay',    border: 'border-clay/25'    },
  AKTIVIS:     { bg: 'bg-forest/10',  text: 'text-forest',  border: 'border-forest/25'  },
}

const roleCategoryLabels = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi / Dosen',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
}

const BATIK = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`

const PUB_FILTERS = [
  { value: '',         label: 'Semua'    },
  { value: 'ARTIKEL',  label: 'Artikel'  },
  { value: 'OPINION',  label: 'Opini'    },
  { value: 'VIGNETTE', label: 'Vignette' },
  { value: 'CERITA',   label: 'Cerita'   },
]

const ARTICLE_TYPE_STYLE = {
  ARTIKEL:  { bg: 'bg-forest/10', text: 'text-forest', border: 'border-forest/20', label: 'Artikel'  },
  OPINION:  { bg: 'bg-clay/10',   text: 'text-clay',   border: 'border-clay/20',   label: 'Opini'    },
  VIGNETTE: { bg: 'bg-sienna/10', text: 'text-sienna', border: 'border-sienna/20', label: 'Vignette' },
  CERITA:   { bg: 'bg-moss/10',   text: 'text-moss',   border: 'border-moss/20',   label: 'Cerita'   },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProfileArticleItem({ article, onClick }) {
  const s = ARTICLE_TYPE_STYLE[article.content_type] ?? ARTICLE_TYPE_STYLE['ARTIKEL']
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden
        hover:shadow-elevated transition-shadow duration-[240ms] cursor-pointer group flex flex-col"
    >
      <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
        {article.thumbnail_url ? (
          <img src={article.thumbnail_url} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[400ms]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}>
            <FileText size={20} className="text-bone/20" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-4 bg-clay/40 flex-shrink-0" />
          <span className={`tag text-[0.6rem] py-0.5 ${s.bg} ${s.text} border ${s.border}`}>{s.label}</span>
        </div>
        <h3 className="font-serif text-h3 font-semibold text-ink leading-snug line-clamp-2
          group-hover:text-forest transition-colors duration-[240ms] mb-1">
          {article.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-sans text-caption text-ash">
            {new Date(article.published_at ?? article.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
          <ArrowUpRight size={14} className="text-ash/30 group-hover:text-forest
            transition-colors duration-[240ms] flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-16">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="rounded-card md:w-64 md:flex-shrink-0 bg-sand/40 animate-pulse aspect-[4/5] md:aspect-auto md:h-96" />
            <div className="flex-1 rounded-card bg-sand/40 animate-pulse h-64" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  const { userId } = useParams()
  const navigate   = useNavigate()
  const sessionUser = session.getUser()

  const [profile, setProfile]                 = useState(null)
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState('')
  const [articles, setArticles]               = useState([])
  const [articlesLoading, setArticlesLoading] = useState(false)

  // publications view state
  const [view, setView]               = useState('profile')
  const [activeFilter, setActiveFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(4)
  const sentinelRef = useRef(null)

  // ── Fetch profile ────────────────────────────────────────────
  useEffect(() => {
    const isMe = !userId || userId === sessionUser?.id
    if (isMe) {
      if (!session.getAccess()) { navigate('/login', { replace: true }); return }
      profilesApi.me().then(({ ok, status, data }) => {
        if (ok) setProfile(data)
        else if (status === 401 || status === 403) { session.clear(); navigate('/login', { replace: true }) }
        else setError('Profil tidak dapat dimuat.')
        setLoading(false)
      }).catch(() => { setError('Gagal memuat profil.'); setLoading(false) })
    } else {
      profilesApi.public(userId).then(({ ok, data }) => {
        if (ok) setProfile(data)
        else setError('Profil kontributor tidak ditemukan.')
        setLoading(false)
      }).catch(() => { setError('Terjadi kesalahan jaringan.'); setLoading(false) })
    }
  }, [userId, navigate, sessionUser?.id])

  // ── Fetch articles once profile loaded ───────────────────────
  useEffect(() => {
    if (!profile) return
    const isMe = !userId || userId === sessionUser?.id
    setArticlesLoading(true)
    const req = isMe ? articlesApi.myArticles() : articlesApi.feed()
    req.then(({ ok, data }) => {
      if (ok) {
        const all = Array.isArray(data) ? data : (data.results ?? [])
        setArticles(isMe ? all.filter(a => a.status === 'PUBLISHED') : all.filter(a => a.author?.id === userId))
      }
      setArticlesLoading(false)
    }).catch(() => setArticlesLoading(false))
  }, [profile?.id])

  // ── Infinite scroll sentinel ─────────────────────────────────
  useEffect(() => {
    if (view !== 'publications') return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => c + 4) },
      { rootMargin: '120px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [view, activeFilter])

  // ── Derived ──────────────────────────────────────────────────
  const filteredArticles = activeFilter
    ? articles.filter(a => a.content_type === activeFilter)
    : articles

  const handleFilter = (type) => { setActiveFilter(type); setVisibleCount(4) }

  const openPublications  = () => { window.scrollTo(0, 0); setView('publications'); setActiveFilter(''); setVisibleCount(4) }
  const closePublications = () => { window.scrollTo(0, 0); setView('profile'); setActiveFilter(''); setVisibleCount(4) }

  // ── Guards ───────────────────────────────────────────────────
  if (loading) return <ProfileSkeleton />

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-content mx-auto px-6 lg:px-12 py-16 text-center">
            <p className="font-serif text-h3 font-semibold text-ink mb-2">{error || 'Profil tidak ditemukan.'}</p>
            <button onClick={() => window.location.reload()}
              className="font-sans text-sm text-forest underline underline-offset-4 hover:text-clay transition-colors duration-[240ms]">
              Muat ulang
            </button>
          </div>
        </main>
      </div>
    )
  }

  const initials    = getInitials(profile.full_name)
  const joinedYear  = sessionUser?.date_joined ? new Date(sessionUser.date_joined).getFullYear() : null
  const badge       = roleBadgeColors[profile.role_category] ?? roleBadgeColors['AKTIVIS']

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">

        {/* ══ PUBLICATIONS FULL VIEW ════════════════════════════ */}
        {view === 'publications' ? (
          <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12">

            {/* Back */}
            <button
              onClick={closePublications}
              className="flex items-center gap-2 font-sans text-sm text-ash hover:text-forest
                transition-colors duration-[240ms] mb-10"
            >
              <ArrowLeft size={15} />
              Kembali
            </button>

            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Karya &amp; Publikasi</span>
              </div>
              <h1 className="font-serif text-h1 font-semibold text-ink leading-tight">
                Semua Karya{' '}
                <em className="font-accent italic text-clay">{profile.full_name}</em>
              </h1>
            </div>

            {/* Filter + count */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {PUB_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => handleFilter(f.value)}
                  className={`font-sans text-sm font-medium px-4 py-1.5 rounded-full border
                    transition-all duration-[240ms] ${
                      activeFilter === f.value
                        ? 'bg-forest text-bone border-forest'
                        : 'bg-white text-ash border-sand hover:border-forest/40 hover:text-ink'
                    }`}
                >
                  {f.label}
                </button>
              ))}
              <span className="ml-auto font-sans text-caption text-ash">
                {filteredArticles.length} artikel
              </span>
            </div>

            {/* Grid */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-card border border-sand px-8 py-12 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-sand/60 flex items-center justify-center mb-4">
                  <FileText size={18} className="text-ash/50" />
                </div>
                <p className="font-serif text-h3 font-semibold text-ink mb-1">Belum ada karya</p>
                <p className="font-sans text-body text-ash">
                  {activeFilter ? 'Tidak ada artikel dengan kategori ini.' : 'Artikel akan muncul setelah diterbitkan.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredArticles.slice(0, visibleCount).map(article => (
                    <ProfilePublicationCard
                      key={article.id}
                      article={article}
                      onClick={() => navigate(`/articles/${article.id}`)}
                    />
                  ))}
                </div>

                {/* Sentinel — triggers load-more on scroll */}
                {visibleCount < filteredArticles.length && (
                  <div ref={sentinelRef} className="h-10 mt-4" />
                )}

                {visibleCount >= filteredArticles.length && filteredArticles.length > 4 && (
                  <p className="text-center font-sans text-caption text-ash/40 mt-8">
                    Semua artikel sudah ditampilkan
                  </p>
                )}
              </>
            )}

          </div>

        ) : (

        /* ══ PROFILE MAIN VIEW ════════════════════════════════ */
          <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-16">

            {/* ── Profile Header ─────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">

              {/* Left — dark identity card */}
              <div
                className="relative overflow-hidden rounded-card md:w-64 md:flex-shrink-0 flex flex-col"
                style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
              >
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                  style={{ backgroundImage: BATIK }} />

                <div className="relative w-full aspect-[4/5] overflow-hidden flex-shrink-0">
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt={profile.full_name}
                      className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif font-semibold text-5xl text-bone/50 leading-none select-none">
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#162A20] to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center px-6 pt-5 pb-6">
                  <span className="font-serif text-display font-semibold text-bone font-tabular leading-none block">
                    {profile.total_contributions}
                  </span>
                  <span className="font-sans text-caption text-bone/50 uppercase tracking-widest mt-1 block">
                    Karya Dipublikasikan
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 w-full">
                    {[
                      { icon: FileText, value: profile.article_count,       label: 'Tulisan' },
                      { icon: Camera,   value: profile.photo_count,          label: 'Foto'    },
                      { icon: Leaf,     value: profile.species_data_count,   label: 'Spesies' },
                    ].map(({ icon: Icon, value, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <Icon size={13} className="text-bone/35" />
                        <span className="font-serif text-body font-semibold text-bone font-tabular leading-none">{value}</span>
                        <span className="font-sans text-[0.6rem] text-bone/40 uppercase tracking-wider leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — about panel */}
              <div className="flex-1 min-w-0 bg-white rounded-card border border-sand shadow-subtle p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-px w-8 bg-clay/50" />
                  <span className="tag">Profil Kontributor</span>
                  {profile.role_category && (
                    <span className={`tag text-[0.9rem] py-0.5 ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {roleCategoryLabels[profile.role_category]}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-6">
                  Tentang <em className="font-accent italic text-clay">{profile.full_name}</em>
                </h2>
                <div className="flex flex-col gap-3.5 mb-6 -mt-4">
                  <span className="font-sans text-xs text-ash/70">{profile.user_id ?? userId ?? sessionUser?.id}</span>
                  {profile.institution && (
                    <div className="flex items-center gap-3">
                      <Building2 size={17} className="text-ash flex-shrink-0" />
                      <span className="font-sans text-body text-ink">{profile.institution}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={17} className="text-ash flex-shrink-0" />
                      <span className="font-sans text-body text-ink">{profile.location}</span>
                    </div>
                  )}
                  {profile.primary_community && (
                    <div className="flex items-center gap-3">
                      <Users size={17} className="text-ash flex-shrink-0" />
                      <span className="font-sans text-body text-ink">
                        {profile.primary_community.name}
                        {profile.primary_community.region_name && (
                          <span className="text-ash"> · {profile.primary_community.region_name}</span>
                        )}
                      </span>
                    </div>
                  )}
                  {joinedYear && (
                    <div className="flex items-center gap-3">
                      <CalendarDays size={17} className="text-ash flex-shrink-0" />
                      <span className="font-sans text-body text-ink">
                        Bergabung sejak <strong className="font-medium text-forest">{joinedYear}</strong>
                      </span>
                    </div>
                  )}
                </div>
                {profile.bio && (
                  <blockquote className="border-l-2 border-clay pl-5 py-1">
                    <p className="font-accent italic text-h3 text-forest leading-relaxed text-justify">
                      "{profile.bio}"
                    </p>
                  </blockquote>
                )}
              </div>
            </div>

            {/* ── Experience ─────────────────────────────── */}
            {profile.experience && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8 bg-clay/50" />
                  <span className="tag">Perjalanan &amp; Dedikasi</span>
                </div>
                <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-8">
                  Rekam Jejak <em className="font-accent italic text-clay">Kontribusi</em>
                </h2>
                <div className="bg-white rounded-card border border-sand shadow-subtle p-6 md:p-8">
                  <p className="font-sans text-body text-ink leading-relaxed whitespace-pre-wrap">
                    {profile.experience}
                  </p>
                </div>
              </div>
            )}

            {/* ── Testimonial ────────────────────────────── */}
            {profile.testimonial && (
              <div className="relative overflow-hidden bg-white rounded-card border border-sand shadow-subtle px-8 md:px-14 py-10 md:py-12">
                <span aria-hidden="true"
                  className="absolute -top-4 left-6 font-serif leading-none text-clay/10 select-none pointer-events-none"
                  style={{ fontSize: '10rem' }}>&#8220;</span>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-7">
                    <div className="h-px w-8 bg-clay/50" />
                    <span className="tag">Refleksi</span>
                  </div>
                  <blockquote>
                    <div className="h-px w-full bg-sand mb-7" />
                    <p className="font-accent italic text-h2 text-forest leading-relaxed mb-7">
                      {profile.testimonial}
                    </p>
                    <div className="h-px w-full bg-sand mb-6" />
                    <footer className="flex items-center gap-3">
                      <div className="h-px w-8 bg-clay/50 flex-shrink-0" />
                      <cite className="font-sans text-caption text-ash not-italic tracking-wide">
                        {profile.full_name}
                        {profile.role_category && (
                          <><span className="mx-2 text-sand">·</span>{roleCategoryLabels[profile.role_category]}</>
                        )}
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            )}

            {/* ── Publications preview ───────────────────── */}
            <div className="bg-sand/20 rounded-card px-6 md:px-8 py-8 md:py-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Karya &amp; Publikasi</span>
              </div>
              <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-8">
                Hasil <em className="font-accent italic text-clay">Riset &amp; Tulisan</em>
              </h2>

              {articlesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-card border border-sand overflow-hidden animate-pulse">
                      <div className="aspect-[16/9] bg-sand" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-sand rounded w-1/4" />
                        <div className="h-4 bg-sand rounded w-3/4" />
                        <div className="h-4 bg-sand rounded w-1/2" />
                        <div className="h-3 bg-sand/60 rounded w-1/3 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="bg-white rounded-card border border-sand px-8 py-12 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-sand/60 flex items-center justify-center mb-4">
                    <FileText size={18} className="text-ash/50" />
                  </div>
                  <p className="font-serif text-h3 font-semibold text-ink mb-1">Belum ada karya</p>
                  <p className="font-sans text-body text-ash max-w-xs leading-relaxed">
                    Artikel dan publikasi akan muncul di sini setelah diterbitkan.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {articles.slice(0, 4).map(article => (
                      <ProfileArticleItem
                        key={article.id}
                        article={article}
                        onClick={() => navigate(`/articles/${article.id}`)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={openPublications}
                      className="inline-flex items-center gap-2 px-6 py-2.5 border border-sand bg-white rounded-lg
                        font-sans text-sm font-medium text-ink hover:text-forest hover:border-forest/40
                        transition-all duration-[240ms] shadow-subtle"
                    >
                      Lihat Semua Karya
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
