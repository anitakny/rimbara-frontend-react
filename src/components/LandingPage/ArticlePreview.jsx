import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import { articlesApi, session, pendingRedirect } from '../../lib/api'

const TYPE_STYLE = {
  Artikel:  { bg: 'bg-forest/10',  text: 'text-forest',  border: 'border-forest/20'  },
  Opini:    { bg: 'bg-clay/10',    text: 'text-clay',    border: 'border-clay/20'    },
  Vignette: { bg: 'bg-sienna/10',  text: 'text-sienna',  border: 'border-sienna/20'  },
  Cerita:   { bg: 'bg-moss/10',    text: 'text-moss',    border: 'border-moss/20'    },
}

function ArticleCard({ article, isLoggedIn, onClick }) {
  const style = TYPE_STYLE[article.content_type_label] ?? TYPE_STYLE['Artikel']

  return (
    <article
      onClick={onClick}
      className="card corner-accent group overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover
              group-hover:scale-[1.03] transition-transform duration-[400ms]"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText size={40} className="text-bone/20" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className={`tag text-[0.65rem] py-0.5 ${style.bg} ${style.text} border ${style.border}
            backdrop-blur-sm`}>
            {article.content_type_label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-serif text-[1.05rem] font-semibold text-ink leading-snug line-clamp-2
          group-hover:text-forest transition-colors duration-[240ms]">
          {article.title}
        </h3>

        <div className="flex flex-col gap-0.5">
          {article.author_name && (
            <p className="font-sans text-caption text-ash truncate">{article.author_name}</p>
          )}
          <div className="flex items-center gap-2 font-sans text-caption text-ash/70">
            {article.author_location && (
              <span className="truncate">{article.author_location}</span>
            )}
            {article.author_location && article.published_year && <span>·</span>}
            {article.published_year && (
              <span className="font-tabular flex-shrink-0">{article.published_year}</span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <span className="font-sans text-caption text-forest font-medium">
            {isLoggedIn ? 'Baca Artikel' : 'Masuk untuk Membaca'}
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

export default function ArticlePreview() {
  const navigate   = useNavigate()
  const isLoggedIn = !!session.getAccess()

  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    articlesApi.landing()
      .then(({ ok, data }) => {
        if (ok) setArticles(Array.isArray(data) ? data : [])
        else    setArticles([])
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  const handleCardClick = (article) => {
    if (isLoggedIn) {
      navigate(`/articles/${article.id}`)
    } else {
      pendingRedirect.save(`/articles/${article.id}`)
      navigate('/login')
    }
  }

  if (!loading && articles.length === 0) return null

  return (
    <section id="artikel" className="py-24 lg:py-32 bg-sand/20">
      <div className="max-w-content mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Linimasa Terbaru</span>
            </div>
            <h2 className="font-serif text-h1 font-semibold text-ink leading-tight">
              Pengetahuan yang{' '}
              <em className="font-accent italic text-clay">Hidup</em>
            </h2>
          </div>
          <button
            onClick={() => isLoggedIn ? navigate('/home') : navigate('/login')}
            className="btn-secondary flex-shrink-0 inline-flex items-center gap-2"
          >
            {isLoggedIn ? 'Lihat Semua Artikel' : 'Masuk untuk Membaca Semua'}
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isLoggedIn={isLoggedIn}
                  onClick={() => handleCardClick(article)}
                />
              ))
          }
        </div>

      </div>
    </section>
  )
}
