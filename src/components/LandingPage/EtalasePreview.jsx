import { BookOpen, ArrowUpRight } from 'lucide-react'

const publications = [
  {
    type: 'E-zine Kehati',
    title: 'Keanekaragaman Hayati Hutan Adat Kalimantan Tengah',
    community: 'Komunitas Adat Dayak Ngaju',
    region: 'Kalimantan Tengah',
    year: '2025',
    colorAccent: 'bg-moss',
    pages: '48 hlm',
  },
  {
    type: 'Story Map',
    title: 'Ruang Hidup dan Peta Pengetahuan Lokal Suku Baduy',
    community: 'Masyarakat Baduy Dalam',
    region: 'Banten',
    year: '2025',
    colorAccent: 'bg-clay',
    pages: '32 hlm',
  },
  {
    type: 'Etnografi Vignette',
    title: 'Ritual Tanam dan Sistem Kalender Pertanian Komunitas Adat Toraja',
    community: 'Komunitas Adat Toraja',
    region: 'Sulawesi Selatan',
    year: '2025',
    colorAccent: 'bg-sienna',
    pages: '24 hlm',
  },
  {
    type: 'Opinion Editorial',
    title: 'Kedaulatan Data dan Hak Epistemic Masyarakat Adat di Era Digital',
    community: 'Tim Riset RIMBAHARI',
    region: 'Nasional',
    year: '2025',
    colorAccent: 'bg-forest',
    pages: '16 hlm',
  },
]

function PublicationCard({ pub }) {
  return (
    <article className="card corner-accent group overflow-hidden flex flex-col">
      {/* Cover placeholder */}
      <div className={`relative h-44 ${pub.colorAccent} overflow-hidden flex-shrink-0`}>
        {/* Batik texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M15 15l-5-5 5-5 5 5-5 5zm0-10l-5-5 5-5 5 5-5 5zm0 20l-5-5 5-5 5 5-5 5zM5 15l-5-5 5-5 5 5-5 5zm20 0l-5-5 5-5 5 5-5 5z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen size={40} className="text-bone/30" />
        </div>
        {/* Type badge overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="font-sans text-[0.65rem] uppercase tracking-widest text-bone/80 font-medium
            bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-[3px]">
            {pub.type}
          </span>
        </div>
        {/* Pages */}
        <div className="absolute top-3 right-3">
          <span className="font-sans text-caption text-bone/60">{pub.pages}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-serif text-[1.05rem] font-semibold text-ink leading-snug line-clamp-2
          group-hover:text-forest transition-colors duration-[240ms]">
          {pub.title}
        </h3>

        <div className="flex flex-col gap-1">
          <p className="font-sans text-caption text-ash">{pub.community}</p>
          <div className="flex items-center gap-2 text-caption text-ash/70">
            <span>{pub.region}</span>
            <span>·</span>
            <span className="font-tabular">{pub.year}</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-sand flex items-center justify-between">
          <span className="font-sans text-caption text-forest font-medium">Baca Selengkapnya</span>
          <ArrowUpRight size={14} className="text-forest/60 group-hover:text-clay
            transition-all duration-[240ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  )
}

export default function EtalasePreview() {
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
            href="/etalase"
            className="btn-secondary flex-shrink-0 inline-flex items-center gap-2"
          >
            Lihat Semua Karya
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Semua', 'E-zine Kehati', 'Story Maps', 'Etnografi', 'Opinion Editorial'].map(
            (cat, i) => (
              <button
                key={cat}
                className={`font-sans text-sm px-4 py-2 rounded-chip transition-all duration-[240ms] ${
                  i === 0
                    ? 'bg-forest text-bone'
                    : 'bg-sand text-ash hover:bg-forest/10 hover:text-forest'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Publications grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {publications.map((pub) => (
            <PublicationCard key={pub.title} pub={pub} />
          ))}
        </div>

        {/* Ornamental divider */}
        <div className="section-divider mt-16">
          <div className="w-2 h-2 rotate-45 bg-clay/40" />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '50+', label: 'Karya Terdigitasi' },
            { n: '4', label: 'Kategori Konten' },
            { n: '8', label: 'Wilayah Adat' },
            { n: '2025', label: 'Tahun Program' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="font-serif text-h2 font-semibold text-forest font-tabular">
                {s.n}
              </span>
              <span className="font-sans text-caption uppercase tracking-widest text-ash">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
