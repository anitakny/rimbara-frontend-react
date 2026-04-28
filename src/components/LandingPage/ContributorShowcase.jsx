import { ArrowUpRight } from 'lucide-react'

const roleColors = {
  Mahasiswa: { bg: 'bg-moss/15', text: 'text-moss', border: 'border-moss/25' },
  Dosen: { bg: 'bg-sienna/15', text: 'text-sienna', border: 'border-sienna/25' },
  'Pemuda Adat': { bg: 'bg-clay/15', text: 'text-clay', border: 'border-clay/25' },
  Aktivis: { bg: 'bg-forest/15', text: 'text-forest', border: 'border-forest/25' },
}

const contributors = [
  {
    name: 'Sari Dewi Putri',
    role: 'Mahasiswa',
    institution: 'Universitas Gadjah Mada',
    focus: 'Etnobotani Kalimantan',
    initials: 'SD',
    contributions: 7,
  },
  {
    name: 'Dr. Ahmad Fauzi',
    role: 'Dosen',
    institution: 'IPB University',
    focus: 'Ekologi Hutan Tropis',
    initials: 'AF',
    contributions: 12,
  },
  {
    name: 'Yusuf Mandau',
    role: 'Pemuda Adat',
    institution: 'Komunitas Dayak Ngaju',
    focus: 'Kearifan Lokal Kehati',
    initials: 'YM',
    contributions: 9,
  },
  {
    name: 'Ratna Sari',
    role: 'Aktivis',
    institution: 'BRWA Indonesia',
    focus: 'Advokasi Wilayah Adat',
    initials: 'RS',
    contributions: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa',
    institution: 'Universitas Hasanuddin',
    focus: 'Etnografi Sulawesi',
    initials: 'BS',
    contributions: 6,
  },
  {
    name: 'Maya Lestari',
    role: 'Pemuda Adat',
    institution: 'Komunitas Baduy',
    focus: 'Tradisi Pertanian Lokal',
    initials: 'ML',
    contributions: 8,
  },
]

function ContributorCard({ contributor }) {
  const colors = roleColors[contributor.role]
  return (
    <article className="card corner-accent p-5 flex flex-col gap-4 group">
      <div className="flex items-start gap-4">
        {/* Avatar placeholder */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
            font-serif font-semibold text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
        >
          {contributor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[1rem] font-semibold text-ink leading-tight truncate
            group-hover:text-forest transition-colors duration-[240ms]">
            {contributor.name}
          </h3>
          <p className="font-sans text-caption text-ash truncate">{contributor.institution}</p>
        </div>
        <ArrowUpRight
          size={14}
          className="text-ash/40 flex-shrink-0 group-hover:text-clay
            group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[240ms]"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={`tag text-[0.65rem] ${colors.bg} ${colors.text} border ${colors.border}`}>
          {contributor.role}
        </span>
        <span className="font-tabular font-sans text-caption text-ash">
          {contributor.contributions} karya
        </span>
      </div>

      <p className="font-sans text-caption text-ash/70 border-t border-sand pt-3">
        Fokus: <em className="font-accent italic text-ash">{contributor.focus}</em>
      </p>
    </article>
  )
}

export default function ContributorShowcase() {
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
          <a
            href="/kontributor"
            className="btn-secondary flex-shrink-0 inline-flex items-center gap-2"
          >
            Lihat Semua Profil
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(roleColors).map(([role, colors]) => (
            <span
              key={role}
              className={`font-sans text-caption uppercase tracking-widest px-3 py-1.5
                rounded-chip border font-medium ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {role}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contributors.map((c) => (
            <ContributorCard key={c.name} contributor={c} />
          ))}
        </div>

        {/* Total count */}
        <div className="mt-10 text-center">
          <p className="font-sans text-body text-ash">
            Bergabung bersama{' '}
            <strong className="font-semibold text-forest font-tabular">63+</strong>{' '}
            kontributor aktif dari seluruh Indonesia
          </p>
        </div>
      </div>
    </section>
  )
}
