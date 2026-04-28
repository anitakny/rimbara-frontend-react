import { Building2, MapPin, CalendarDays, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProfilePublicationCard from '../components/ProfilePage/ProfilePublicationCard'

const mockProfile = {
  name: 'Sari Dewi Putri',
  initials: 'SD',
  role: 'Mahasiswa',
  institution: 'Universitas Gadjah Mada',
  joinedYear: '2025',
  bio: 'Mahasiswa Etnobotani UGM. Fokus pada dokumentasi keanekaragaman hayati wilayah adat Kalimantan. Bergabung dengan program RIMBAHARI sejak 2025 sebagai kontributor aktif.',
  karya: 7
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
  Mahasiswa:     { bg: 'bg-moss/15',   text: 'text-moss',   border: 'border-moss/25' },
  Dosen:         { bg: 'bg-sienna/15', text: 'text-sienna', border: 'border-sienna/25' },
  'Pemuda Adat': { bg: 'bg-clay/15',   text: 'text-clay',   border: 'border-clay/25' },
  Aktivis:       { bg: 'bg-forest/15', text: 'text-forest', border: 'border-forest/25' },
}

export default function ProfilePage() {
  const role = roleColors[mockProfile.role] ?? roleColors['Aktivis']

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12">

          {/* ── Profile Header ────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">

            {/* Left — identity card */}
            <div className="bg-white rounded-card border border-sand shadow-subtle p-6
              flex flex-col items-center text-center md:w-64 md:flex-shrink-0">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-forest flex items-center justify-center shadow-subtle mb-4">
                <span className="font-serif font-semibold text-2xl text-bone leading-none">
                  {mockProfile.initials}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-serif text-h2 font-semibold text-ink leading-tight mb-1">
                {mockProfile.name}
              </h1>

              {/* Role badge */}
              <span className={`tag text-[0.65rem] py-0.5 ${role.bg} ${role.text} border ${role.border}`}>
                {mockProfile.role}
              </span>

              {/* Divider + stat */}
              <div className="w-full border-t border-sand mt-5 pt-5">
                <span className="font-serif text-h1 font-semibold text-ink font-tabular leading-none block">
                  {mockProfile.karya}
                </span>
                <span className="font-sans text-caption text-ash uppercase tracking-widest mt-0.5 block">
                  Karya
                </span>
              </div>
            </div>

            {/* Right — about section */}
            <div className="flex-1 min-w-0 bg-white rounded-card border border-sand shadow-subtle p-6 md:p-8">
              <h2 className="font-serif text-h1 font-semibold text-ink mb-6">
                Tentang {mockProfile.name}
              </h2>

              {/* Info rows */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-ash flex-shrink-0" />
                  <span className="font-sans text-body text-ink">
                    {mockProfile.institution}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-ash flex-shrink-0" />
                  <span className="font-sans text-body text-ink">
                    Bergabung sejak {mockProfile.joinedYear}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-sand mb-6" />

              {/* Bio */}
              <p className="font-sans text-body text-ash leading-relaxed text-justify">
                {mockProfile.bio}
              </p>
            </div>

          </div>

          {/* ── Publications Section ──────────────────────────────── */}
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-h3 font-semibold text-ink">
                  Karya &amp; Publikasi
                </h2>
                <p className="font-sans text-caption text-ash mt-0.5">
                  Menampilkan {mockPublications.length} karya terbaru
                </p>
              </div>
              <a
                href="/kontributor"
                className="hidden md:inline-flex items-center gap-1 font-sans text-caption font-medium
                  text-forest hover:text-clay transition-colors duration-[240ms] underline underline-offset-4
                  flex-shrink-0 mt-0.5"
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
              className="md:hidden self-center inline-flex items-center gap-1 font-sans text-caption
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
