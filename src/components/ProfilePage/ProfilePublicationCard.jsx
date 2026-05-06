import { ArrowUpRight, Eye, MessageCircle } from 'lucide-react'

const TYPE_STYLE = {
  ARTIKEL:  { bg: 'bg-forest/10', text: 'text-forest', border: 'border-forest/20', label: 'Artikel'  },
  OPINION:  { bg: 'bg-clay/10',   text: 'text-clay',   border: 'border-clay/20',   label: 'Opini'    },
  VIGNETTE: { bg: 'bg-sienna/10', text: 'text-sienna', border: 'border-sienna/20', label: 'Vignette' },
  CERITA:   { bg: 'bg-moss/10',   text: 'text-moss',   border: 'border-moss/20',   label: 'Cerita'   },
}

export default function ProfilePublicationCard({ article, onClick }) {
  const s = TYPE_STYLE[article.content_type] ?? TYPE_STYLE['ARTIKEL']

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden
        hover:shadow-elevated transition-shadow duration-[240ms] cursor-pointer group flex flex-col"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[400ms]"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-4 bg-clay/40 flex-shrink-0" />
          <span className={`tag text-[0.6rem] py-0.5 ${s.bg} ${s.text} border ${s.border}`}>{s.label}</span>
        </div>

        <h3 className="font-serif text-h3 font-semibold text-ink leading-snug line-clamp-2
          group-hover:text-forest transition-colors duration-[240ms] mb-2">
          {article.title}
        </h3>

        {article.abstract && (
          <p className="font-accent italic text-caption text-ash/80 leading-relaxed line-clamp-2 mb-3">
            {article.abstract}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-sans text-caption text-ash">
              <Eye size={11} className="flex-shrink-0" />
              {(article.views_count ?? 0).toLocaleString('id-ID')}
            </span>
            <span className="flex items-center gap-1 font-sans text-caption text-ash">
              <MessageCircle size={11} className="flex-shrink-0" />
              {article.comments_count ?? 0}
            </span>
          </div>
          <button className="inline-flex items-center gap-0.5 font-sans text-xs font-medium
            text-forest group-hover:text-clay transition-colors duration-[240ms] flex-shrink-0">
            Baca
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </article>
  )
}
