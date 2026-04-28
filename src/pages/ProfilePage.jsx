import { MapPin, ArrowUpRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProfilePublicationCard from '../components/ProfilePage/ProfilePublicationCard'

// Placeholder — replace with real data from /api/users/me/profile/
const mockProfile = {
  name: 'Sari Dewi Putri',
  initials: 'SD',
  role: 'Mahasiswa',
  institution: 'Universitas Gadjah Mada',
  location: 'Kalimantan Tengah',
  bio: 'Mahasiswa Etnobotani UGM. Fokus pada dokumentasi keanekaragaman hayati wilayah adat Kalimantan. Bergabung dengan program RIMBAHARI sejak 2025 sebagai kontributor aktif.',
  karya: 7,
}

// Placeholder — replace with /api/users/{id}/contributions/ (latest 3)
const mockPublications = [
  {
    type: 'Opinion Editorial',
    title: 'Kedaulatan Pengetahuan Adat dalam Kerangka Hukum Kehati Indonesia',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt:
      'Kajian kritis terhadap posisi pengetahuan ekologis masyarakat adat dalam regulasi keanekaragaman hayati Indonesia dan tantangan pengakuan hak epistemic komunitas lokal.',
    tags: ['Hukum Adat', 'Kehati', 'Kebijakan'],
    isBookmarked: false,
  },
  {
    type: 'Opinion Editorial',
    title: 'Etnobotani sebagai Jembatan antara Sains Modern dan Kearifan Lokal Dayak',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt:
      'Analisis peran etnobotani dalam mendokumentasikan dan memvalidasi pengetahuan pengobatan tradisional masyarakat Dayak Ngaju sebagai kontribusi nyata pada ilmu pengetahuan global.',
    tags: ['Etnobotani', 'Kearifan Lokal', 'Dayak'],
    isBookmarked: true,
  },
  {
    type: 'Opinion Editorial',
    title: 'Mengapa Pemetaan Partisipatif Harus Menjadi Standar dalam Riset Wilayah Adat',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt:
      'Argumen metodologis untuk menjadikan pemetaan berbasis komunitas sebagai prasyarat etis dalam setiap penelitian yang melibatkan wilayah adat dan sumber daya alam lokal.',
    tags: ['Metodologi', 'Pemetaan', 'Etika Riset'],
    isBookmarked: false,
  },
  {
    type: 'Opinion Editorial',
    title: 'Fungsi Ekologis Rotan dalam Sistem Agroforestri Dayak: Sebuah Tinjauan',
    author: 'Sari Dewi Putri',
    community: 'Komunitas Dayak Ngaju',
    year: '2025',
    excerpt:
      'Eksplorasi terhadap peran rotan sebagai spesies kunci dalam praktik agroforestri tradisional masyarakat Dayak dan relevansinya bagi keberlanjutan ekosistem hutan hujan tropis.',
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
        <div className="max-w-content mx-auto px-6 lg:px-12 py-12 flex flex-col gap-12">

          {/* ── Profile Header Card ──────────────────────────────── */}
          <div className="bg-white rounded-card border border-sand shadow-subtle p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-forest flex items-center justify-center flex-shrink-0 shadow-subtle">
                <span className="font-serif font-semibold text-xl text-bone leading-none">
                  {mockProfile.initials}
                </span>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="font-serif text-h2 font-semibold text-ink leading-tight">
                    {mockProfile.name}
                  </h1>
                  <span className={`tag text-[0.65rem] py-0.5 ${role.bg} ${role.text} border ${role.border}`}>
                    {mockProfile.role}
                  </span>
                </div>

                <p className="font-sans text-body text-ash mb-1">
                  {mockProfile.institution}
                </p>

                {mockProfile.location && (
                  <div className="flex items-center gap-1.5 text-ash/60">
                    <MapPin size={13} />
                    <span className="font-sans text-caption">{mockProfile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="font-sans text-body text-ash leading-relaxed mt-6">
              {mockProfile.bio}
            </p>

            {/* Karya stat */}
            <div className="flex items-baseline gap-2 mt-6 pt-5 border-t border-sand">
              <span className="font-serif text-h2 font-semibold text-forest font-tabular leading-none">
                {mockProfile.karya}
              </span>
              <span className="font-sans text-caption text-ash uppercase tracking-widest">
                Karya Dipublikasikan
              </span>
            </div>
          </div>

          {/* ── Publications Section ──────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Section header */}
            <div className="flex items-center justify-between">
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
                className="inline-flex items-center gap-1 font-sans text-caption font-medium
                  text-forest hover:text-clay transition-colors duration-[240ms] underline underline-offset-4"
              >
                Lihat semua
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-5">
              {mockPublications.map((pub) => (
                <ProfilePublicationCard key={pub.title} publication={pub} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
