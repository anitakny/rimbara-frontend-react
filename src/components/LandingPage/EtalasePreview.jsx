import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowUpRight } from 'lucide-react'
import { etalaseApi, session, pendingEtalase } from '../../lib/api'
import { CATEGORIES } from '../DisplayPage/DisplayShared'

const FILTERS = [{ id: '', label: 'Semua' }, ...CATEGORIES]

const GRADIENT = {
  EZINE_KEHATI:    'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)',
  EZINE_ETNOGRAFI: 'linear-gradient(160deg, #3A5A4A 0%, #4A7A5A 55%, #2A4A3A 100%)',
  LAPORAN:         'linear-gradient(160deg, #6B3A2E 0%, #B85C3E 55%, #5A2E22 100%)',
  LAINNYA:         'linear-gradient(160deg, #4A3A2A 0%, #6B5A3A 55%, #3A2A1A 100%)',
}

const BATIK = `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M15 15l-5-5 5-5 5 5-5 5zm0-10l-5-5 5-5 5 5-5 5zm0 20l-5-5 5-5 5 5-5 5zM5 15l-5-5 5-5 5 5-5 5zm20 0l-5-5 5-5 5 5-5 5z'/%3E%3C/g%3E%3C/svg%3E")`

function PublicationCard({ item, isLoggedIn, onClick }) {
  const catLabel = CATEGORIES.find(c => c.id === item.pub_type)?.label ?? item.pub_type
  const gradient = GRADIENT[item.pub_type] ?? GRADIENT['LAINNYA']

  return (
    <article
      onClick={onClick}
      className="card corner-accent group overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {item.cover_url ? (
          <img
            src={item.cover_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[400ms]"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: gradient }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: BATIK }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={40} className="text-bone/30" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="font-sans text-[0.65rem] uppercase tracking-widest text-bone/90 font-medium
            bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-[3px]">
            {catLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-serif text-[1.05rem] font-semibold text-ink leading-snug line-clamp-2
          group-hover:text-forest transition-colors duration-[240ms]">
          {item.title}
        </h3>

        <div className="flex flex-col gap-0.5">
          {item.community_name && (
            <p className="font-sans text-caption text-ash truncate">{item.community_name}</p>
          )}
          <div className="flex items-center gap-2 font-sans text-caption text-ash/70">
            {item.region && <span className="truncate">{item.region}</span>}
            {item.region && item.year && <span>·</span>}
            {item.year && <span className="font-tabular flex-shrink-0">{item.year}</span>}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <span className="font-sans text-caption text-forest font-medium">
            {isLoggedIn ? 'Baca Selengkapnya' : 'Masuk untuk Membaca'}
          </span>
          <ArrowUpRight
            size={14}
            className="text-forest/60 group-hover:text-clay flex-shrink-0
              transition-all duration-[240ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </article>
  )
}

function CardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 bg-sand/60" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-sand rounded w-4/5" />
        <div className="h-4 bg-sand rounded w-3/5" />
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-3 bg-sand/60 rounded w-2/3" />
          <div className="h-3 bg-sand/60 rounded w-1/2" />
        </div>
        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <div className="h-3 bg-sand rounded w-28" />
          <div className="h-3 w-3 bg-sand rounded" />
        </div>
      </div>
    </div>
  )
}

export default function EtalasePreview() {
  const navigate     = useNavigate()
  const isLoggedIn   = !!session.getAccess()
  const [activeFilter, setActiveFilter] = useState('')
  const [publications, setPublications] = useState([])
  const [loading, setLoading]           = useState(isLoggedIn)  // no loading state for guests

  useEffect(() => {
    if (!isLoggedIn) return  // etalase list requires auth — skip for guests
    setLoading(true)
    etalaseApi.list({ page_size: 4, pub_type: activeFilter })
      .then(({ ok, data }) => {
        if (ok) setPublications(Array.isArray(data) ? data : (data.results ?? []))
        else    setPublications([])
      })
      .catch(() => setPublications([]))
      .finally(() => setLoading(false))
  }, [activeFilter])

  const handleCardClick = (item) => {
    if (isLoggedIn) {
      navigate(`/display/${item.pub_type}?open=${item.id}`)
    } else {
      pendingEtalase.save(item.pub_type, item.id)
      navigate('/login')
    }
  }

  return (
    <section id="etalase" className="py-24 lg:py-32 bg-bone">
      <div className="max-w-content mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Etalase Karya</span>
            </div>
            <h2 className="font-serif text-h1 font-semibold text-ink leading-tight">
              Arsip Digital{' '}
              <em className="font-accent italic text-clay">Output RIMBAHARI</em>
            </h2>
          </div>
          <a
            href="/display"
            className="btn-secondary flex-shrink-0 inline-flex items-center gap-2"
          >
            Lihat Semua Karya
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`font-sans text-sm px-4 py-2 rounded-chip transition-all duration-[240ms] ${
                activeFilter === f.id
                  ? 'bg-forest text-bone'
                  : 'bg-sand text-ash hover:bg-forest/10 hover:text-forest'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Publications grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : !isLoggedIn ? (
            // Guest teaser — backend requires auth for etalase list
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card overflow-hidden relative select-none">
                  <div className="h-44 bg-gradient-to-br from-sand/60 to-sand/30" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-4 bg-sand/60 rounded w-4/5" />
                    <div className="h-4 bg-sand/60 rounded w-3/5" />
                    <div className="h-3 bg-sand/40 rounded w-1/2 mt-1" />
                  </div>
                  {i === 1 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center
                      bg-white/80 backdrop-blur-[2px] rounded-card">
                      <p className="font-serif text-sm font-semibold text-ink mb-3 text-center px-4">
                        Masuk untuk melihat koleksi lengkap
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
          ) : publications.length > 0 ? (
            publications.map((item) => (
              <PublicationCard
                key={item.id}
                item={item}
                isLoggedIn={isLoggedIn}
                onClick={() => handleCardClick(item)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="font-sans text-body text-ash">Belum ada publikasi tersedia.</p>
            </div>
          )}
        </div>

        {/* Ornamental divider */}
        <div className="section-divider mt-16">
          <div className="w-2 h-2 rotate-45 bg-clay/40" />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '50+', label: 'Karya Terdigitasi' },
            { n: '4',   label: 'Kategori Konten'   },
            { n: '8',   label: 'Wilayah Adat'       },
            { n: '2025', label: 'Tahun Program'     },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="font-serif text-h2 font-semibold text-forest font-tabular">{s.n}</span>
              <span className="font-sans text-caption uppercase tracking-widest text-ash">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
