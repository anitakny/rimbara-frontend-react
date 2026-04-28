import { Building2, CalendarDays, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProfilePublicationCard from '../components/ProfilePage/ProfilePublicationCard'

const mockProfile = {
  name: 'Sari Dewi Putri',
  initials: 'SD',
  role: 'Mahasiswa',
  institution: 'Universitas Gadjah Mada',
  joinedYear: '2025',
  bio: 'Mahasiswa Etnobotani UGM. Fokus pada dokumentasi keanekaragaman hayati wilayah adat Kalimantan. Bergabung dengan program RIMBAHARI sejak 2025 sebagai kontributor aktif dalam mendokumentasikan kearifan lokal masyarakat Dayak Ngaju.',
  karya: 7,
}

const mockPublications = [
  {
    type: 'Opinion Editorial',
    title: 'Kedaulatan Pengetahuan Adat dalam Kerangka Hukum Kehati Indonesia',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt: 'Kajian kritis terhadap posisi pengetahuan ekologis masyarakat adat dalam regulasi keanekaragaman hayati Indonesia dan tantangan pengakuan hak epistemic komunitas lokal.',
    tags: ['Hukum Adat', 'Kehati', 'Kebijakan'],
    isBookmarked: false,
  },
  {
    type: 'Opinion Editorial',
    title: 'Etnobotani sebagai Jembatan antara Sains Modern dan Kearifan Lokal Dayak',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt: 'Analisis peran etnobotani dalam mendokumentasikan dan memvalidasi pengetahuan pengobatan tradisional masyarakat Dayak Ngaju sebagai kontribusi nyata pada ilmu pengetahuan global.',
    tags: ['Etnobotani', 'Kearifan Lokal', 'Dayak'],
    isBookmarked: true,
  },
  {
    type: 'Opinion Editorial',
    title: 'Mengapa Pemetaan Partisipatif Harus Menjadi Standar dalam Riset Wilayah Adat',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt: 'Argumen metodologis untuk menjadikan pemetaan berbasis komunitas sebagai prasyarat etis dalam setiap penelitian yang melibatkan wilayah adat dan sumber daya alam lokal.',
    tags: ['Metodologi', 'Pemetaan', 'Etika Riset'],
    isBookmarked: false,
  },
  {
    type: 'Opinion Editorial',
    title: 'Fungsi Ekologis Rotan dalam Sistem Agroforestri Dayak: Sebuah Tinjauan',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt: 'Eksplorasi terhadap peran rotan sebagai spesies kunci dalam praktik agroforestri tradisional masyarakat Dayak dan relevansinya bagi keberlanjutan ekosistem hutan hujan tropis.',
    tags: ['Agroforestri', 'Ekologi', 'Rotan'],
    isBookmarked: false,
  },
]

const roleColors = {
  Mahasiswa:     { bg: 'bg-moss/50',   text: 'text-white',   border: 'border-moss/50' },
  Dosen:         { bg: 'bg-sienna/20', text: 'text-sienna', border: 'border-sienna/30' },
  'Pemuda Adat': { bg: 'bg-clay/20',   text: 'text-clay',   border: 'border-clay/30' },
  Aktivis:       { bg: 'bg-forest/20', text: 'text-forest', border: 'border-forest/30' },
}

const BATIK = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`

export default function ProfilePage() {
  const role = roleColors[mockProfile.role] ?? roleColors['Aktivis']
  const firstName = mockProfile.name.split(' ')[0]

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-16">

          {/* ── Profile Header ───────────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">

            {/* Left — dark identity card */}
            <div
              className="relative overflow-hidden rounded-card md:w-64 md:flex-shrink-0
                flex flex-col items-center text-center p-8"
              style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
            >
              {/* Batik texture */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: BATIK }}
              />

              {/* Avatar */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-bone/10 border-2 border-bone/30
                flex items-center justify-center shadow-elevated mb-4">
                <span className="font-serif font-semibold text-2xl text-bone leading-none">
                  {mockProfile.initials}
                </span>
              </div>

              {/* Name */}
              <h1 className="relative z-10 font-serif text-h2 font-semibold text-bone leading-tight mb-2">
                {mockProfile.name}
              </h1>

              {/* Role badge */}
              <span className={`relative z-10 tag text-[0.65rem] py-0.5 ${role.bg} ${role.text} border ${role.border}`}>
                {mockProfile.role}
              </span>

              {/* Divider + stat */}
              <div className="relative z-10 w-full border-t border-white/15 mt-6 pt-6">
                <span className="font-serif text-display font-semibold text-bone font-tabular leading-none block">
                  {mockProfile.karya}
                </span>
                <span className="font-sans text-caption text-bone/50 uppercase tracking-widest mt-1 block">
                  Karya Dipublikasikan
                </span>
              </div>
            </div>

            {/* Right — about panel */}
            <div className="flex-1 min-w-0 bg-white rounded-card border border-sand shadow-subtle p-6 md:p-8">

              {/* Section pre-label */}
              <div className="flex items-center gap-4 mb-5">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Profil Kontributor</span>
              </div>

              {/* Heading with italic em accent */}
              <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-6">
                Tentang{' '}
                <em className="font-accent italic text-clay">{firstName}</em>
              </h2>

              {/* Info rows */}
              <div className="flex flex-col gap-3.5 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 size={17} className="text-ash flex-shrink-0" />
                  <span className="font-sans text-body text-ink">{mockProfile.institution}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={17} className="text-ash flex-shrink-0" />
                  <span className="font-sans text-body text-ink">
                    Bergabung sejak{' '}
                    <strong className="font-medium text-forest">{mockProfile.joinedYear}</strong>
                  </span>
                </div>
              </div>

              {/* Pull quote / bio */}
              <blockquote className="border-l-2 border-clay pl-5 py-1">
                <p className="font-accent italic text-h3 text-forest leading-relaxed">
                  "{mockProfile.bio}"
                </p>
              </blockquote>
            </div>

          </div>

          {/* ── Publications Section ─────────────────────────────── */}
          <div className="bg-sand/20 rounded-card px-6 md:px-8 py-8 md:py-10">

            {/* Section pre-label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Karya &amp; Publikasi</span>
            </div>

            {/* Section header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="font-serif text-h1 font-semibold text-ink leading-tight">
                Hasil{' '}
                <em className="font-accent italic text-clay">Riset &amp; Tulisan</em>
              </h2>
              <a
                href="/kontributor"
                className="hidden md:inline-flex items-center gap-1 font-sans text-caption font-medium
                  text-forest hover:text-clay transition-colors duration-[240ms] underline underline-offset-4
                  flex-shrink-0 mt-2"
              >
                Lihat semua
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Cards — 1 col mobile, 2×2 desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {mockPublications.map((pub) => (
                <ProfilePublicationCard key={pub.title} publication={pub} />
              ))}
            </div>

            {/* Mobile: below cards */}
            <a
              href="/kontributor"
              className="md:hidden mt-5 self-center inline-flex items-center gap-1 font-sans text-caption
                font-medium text-forest hover:text-clay transition-colors duration-[240ms]
                underline underline-offset-4"
            >
              Lihat semua karya
              <ArrowUpRight size={13} />
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}
