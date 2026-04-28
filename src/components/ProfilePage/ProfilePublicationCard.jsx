import { Bookmark, ArrowUpRight, Share2 } from 'lucide-react'

const typeConfig = {
  'E-zine Kehati':      { action: 'Baca E-zine' },
  'Story Map':          { action: 'Lihat Peta' },
  'Etnografi Vignette': { action: 'Baca Vignette' },
  'Opinion Editorial':  { action: 'Baca Editorial' },
}

const fallback = { action: 'Baca Selengkapnya' }

export default function ProfilePublicationCard({ publication }) {
  const {
    type,
    title,
    author,
    community,
    year,
    excerpt,
    tags = [],
    isBookmarked = false,
  } = publication

  const config = typeConfig[type] ?? fallback

  return (
    <article className="bg-white border border-sand rounded-card p-5 flex flex-col gap-4 group
      hover:shadow-subtle transition-all duration-[240ms]">

      {/* Top row — type label + bookmark */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans text-[0.65rem] uppercase tracking-widest text-ash/70 font-medium">
          {type}
        </span>
        <button
          type="button"
          aria-label="Simpan"
          className="p-1 rounded text-ash/40 hover:text-forest transition-colors duration-[240ms] flex-shrink-0"
        >
          <Bookmark
            size={14}
            className={isBookmarked ? 'fill-forest text-forest' : ''}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-serif text-h3 font-semibold text-ink leading-snug line-clamp-2
        group-hover:text-forest transition-colors duration-[240ms] cursor-pointer">
        {title}
      </h3>

      {/* Meta */}
      <p className="font-sans text-caption text-ash -mt-1">
        {author}
        {community && <> · {community}</>}
        {' · '}
        <span className="font-tabular">{year}</span>
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-sans text-[0.65rem] px-2.5 py-1 rounded-full
              bg-sand/40 text-ash border border-sand font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Excerpt box */}
      <div className="rounded-lg p-3 flex-1">
        <p className="font-sans text-caption text-ash/80 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-sand">
        <button
          type="button"
          className="inline-flex items-center gap-1 font-sans text-sm font-medium
            text-forest hover:text-clay transition-colors duration-[240ms]"
        >
          {config.action}
          <ArrowUpRight size={14} />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bagikan"
            className="p-1.5 rounded text-ash/40 hover:text-forest transition-colors duration-[240ms]"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
