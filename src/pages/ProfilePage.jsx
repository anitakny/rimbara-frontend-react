import { useEffect, useState } from 'react'
import { Building2, CalendarDays, MapPin, Users, FileText, Camera, Leaf, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProfilePublicationCard from '../components/ProfilePage/ProfilePublicationCard'
import Footer from '../components/Footer'
import { profilesApi, session } from '../lib/api'

// Publications stay as mock until the articles API is built
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

// Badge colors for use on white/light background (right panel)
const roleBadgeColors = {
  MAHASISWA:   { bg: 'bg-moss/12',    text: 'text-moss',    border: 'border-moss/30' },
  AKADEMISI:   { bg: 'bg-sienna/12',  text: 'text-sienna',  border: 'border-sienna/25' },
  PEMUDA_ADAT: { bg: 'bg-clay/12',    text: 'text-clay',    border: 'border-clay/25' },
  AKTIVIS:     { bg: 'bg-forest/10',  text: 'text-forest',  border: 'border-forest/25' },
}

const roleCategoryLabels = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi / Dosen',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
}

const BATIK = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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
  const navigate = useNavigate()
  const sessionUser = session.getUser()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.getAccess()) {
      navigate('/login', { replace: true })
      return
    }
    profilesApi.me().then(({ ok, data }) => {
      if (ok) {
        setProfile(data)
      } else if (data?.detail === 'Given token not valid for any token type') {
        session.clear()
        navigate('/login', { replace: true })
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <ProfileSkeleton />
  if (!profile) return null

  const initials = getInitials(profile.full_name)
  const joinedYear = sessionUser?.date_joined
    ? new Date(sessionUser.date_joined).getFullYear()
    : null
  const badge = roleBadgeColors[profile.role_category] ?? roleBadgeColors['AKTIVIS']

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-16">

          {/* ── Profile Header ───────────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">

            {/* Left — dark identity card */}
            <div
              className="relative overflow-hidden rounded-card md:w-64 md:flex-shrink-0 flex flex-col"
              style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 55%, #162A20 100%)' }}
            >
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                style={{ backgroundImage: BATIK }}
              />

              {/* Photo — 4:5 ratio */}
              <div className="relative w-full aspect-[4/5] overflow-hidden flex-shrink-0">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif font-semibold text-5xl text-bone/50 leading-none select-none">
                      {initials}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#162A20] to-transparent" />
              </div>

              {/* Stats below photo */}
              <div className="relative z-10 flex flex-col items-center text-center px-6 pt-5 pb-6">
                <span className="font-serif text-display font-semibold text-bone font-tabular leading-none block">
                  {profile.total_contributions}
                </span>
                <span className="font-sans text-caption text-bone/50 uppercase tracking-widest mt-1 block">
                  Karya Dipublikasikan
                </span>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 w-full">
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText size={13} className="text-bone/35" />
                    <span className="font-serif text-body font-semibold text-bone font-tabular leading-none">
                      {profile.article_count}
                    </span>
                    <span className="font-sans text-[0.6rem] text-bone/40 uppercase tracking-wider leading-tight">
                      Tulisan
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Camera size={13} className="text-bone/35" />
                    <span className="font-serif text-body font-semibold text-bone font-tabular leading-none">
                      {profile.photo_count}
                    </span>
                    <span className="font-sans text-[0.6rem] text-bone/40 uppercase tracking-wider leading-tight">
                      Foto
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Leaf size={13} className="text-bone/35" />
                    <span className="font-serif text-body font-semibold text-bone font-tabular leading-none">
                      {profile.species_data_count}
                    </span>
                    <span className="font-sans text-[0.6rem] text-bone/40 uppercase tracking-wider leading-tight">
                      Spesies
                    </span>
                  </div>
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
                Tentang{' '}
                <em className="font-accent italic text-clay">{profile.full_name}</em>
              </h2>

              <div className="flex flex-col gap-3.5 mb-6">
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
                      Bergabung sejak{' '}
                      <strong className="font-medium text-forest">{joinedYear}</strong>
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

          {/* ── Experience Section ────────────────────────────────── */}
          {profile.experience && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Perjalanan &amp; Dedikasi</span>
              </div>

              <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-8">
                Rekam Jejak{' '}
                <em className="font-accent italic text-clay">Kontribusi</em>
              </h2>

              <div className="bg-white rounded-card border border-sand shadow-subtle p-6 md:p-8">
                <p className="font-sans text-body text-ink leading-relaxed whitespace-pre-wrap">
                  {profile.experience}
                </p>
              </div>
            </div>
          )}

          {/* ── Testimonial Section ──────────────────────────────── */}
          {profile.testimonial && (
            <div className="relative overflow-hidden bg-white rounded-card border border-sand shadow-subtle px-8 md:px-14 py-10 md:py-12">
              <span
                aria-hidden="true"
                className="absolute -top-4 left-6 font-serif leading-none text-clay/10 select-none pointer-events-none"
                style={{ fontSize: '10rem' }}
              >
                &#8220;
              </span>

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
                        <>
                          <span className="mx-2 text-sand">·</span>
                          {roleCategoryLabels[profile.role_category]}
                        </>
                      )}
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          )}

          {/* ── Publications Section ─────────────────────────────── */}
          <div className="bg-sand/20 rounded-card px-6 md:px-8 py-8 md:py-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Karya &amp; Publikasi</span>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {mockPublications.map((pub) => (
                <ProfilePublicationCard key={pub.title} publication={pub} />
              ))}
            </div>

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

      <Footer />
    </div>
  )
}
