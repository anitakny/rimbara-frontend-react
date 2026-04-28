import { BookOpen, MapPin, UserCircle, PenLine, Image, ShieldCheck } from 'lucide-react'

const features = [
  {
    id: 'FR-02',
    icon: BookOpen,
    color: 'forest',
    badge: 'Etalase Karya',
    title: 'Flipbook & Reader Interaktif',
    description:
      'Tampilan flipbook digital untuk e-zine kehati, etnografi multimedia, story maps, dan opinion editorial. Filter berdasarkan wilayah adat, tahun, dan jenis konten.',
    tags: ['E-zine Kehati', 'Story Maps', 'Etnografi', 'Opinion Editorial'],
  },
  {
    id: 'FR-03',
    icon: MapPin,
    color: 'clay',
    badge: 'Peta Interaktif',
    title: 'Ruang Hidup Masyarakat Adat',
    description:
      'Peta interaktif menampilkan 8 wilayah adat di 6 provinsi. Klik lokasi untuk melihat profil komunitas, cerita ruang hidup, galeri foto, video, dan data keanekaragaman hayati lokal.',
    tags: ['8 Wilayah Adat', '6 Provinsi', 'Live-Archiving'],
  },
  {
    id: 'FR-04',
    icon: UserCircle,
    color: 'moss',
    badge: 'Profil & Portofolio',
    title: 'Halaman Profil Kontributor',
    description:
      'Setiap pengguna memiliki halaman profil publik dengan foto, biodata, afiliasi institusi/komunitas, dan portofolio karya yang terintegrasi dengan konten yang dikontribusikan.',
    tags: ['Mahasiswa', 'Dosen', 'Pemuda Adat', 'Aktivis'],
  },
  {
    id: 'FR-05',
    icon: PenLine,
    color: 'sienna',
    badge: 'Kontribusi Konten',
    title: 'Tulis Artikel & Cerita',
    description:
      'Form upload artikel dan cerita dengan rich text editor, media pendukung, dan alur review terstruktur. Kontributor menerima notifikasi status dari Draft hingga Published.',
    tags: ['Draft → Review → Published', 'Rich Text', 'Multi-media'],
  },
  {
    id: 'FR-06',
    icon: Image,
    color: 'clay',
    badge: 'Manajemen Media',
    title: 'Upload Foto, Video & Audio',
    description:
      'Upload dan kelola berbagai format media dokumentasi — foto potret, video ritual, rekaman audio kehati — tersimpan aman di Supabase Storage dan terhubung ke konten komunitas.',
    tags: ['Foto', 'Video', 'Audio', 'Supabase Storage'],
  },
  {
    id: 'FR-08',
    icon: ShieldCheck,
    color: 'forest',
    badge: 'Panel Admin',
    title: 'Moderasi & Kurasi Konten',
    description:
      'Panel khusus moderator dan admin untuk meninjau, menyetujui, atau menolak konten. Kelola data komunitas, peta, dan akun pengguna dengan sistem RBAC yang aman.',
    tags: ['Role-based Access', 'Moderasi', 'Kurasi', 'RBAC'],
  },
]

const colorMap = {
  forest: { bg: 'bg-forest/8', icon: 'text-forest', border: 'border-forest/20' },
  clay: { bg: 'bg-clay/8', icon: 'text-clay', border: 'border-clay/20' },
  moss: { bg: 'bg-moss/8', icon: 'text-moss', border: 'border-moss/20' },
  sienna: { bg: 'bg-sienna/8', icon: 'text-sienna', border: 'border-sienna/20' },
}

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 lg:py-32 bg-sand/30">
      {/* Section background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231F3B2D' fill-opacity='1'%3E%3Cpath d='M20 20l-4-4 4-4 4 4-4 4zm0-8l-4-4 4-4 4 4-4 4zm0 16l-4-4 4-4 4 4-4 4zM12 20l-4-4 4-4 4 4-4 4zm16 0l-4-4 4-4 4 4-4 4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-content mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-reading mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-8 bg-clay/50" />
            <span className="tag">Fitur Platform</span>
            <div className="h-px w-8 bg-clay/50" />
          </div>
          <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-5">
            Semua yang Kamu Butuhkan{' '}
            <em className="font-accent italic text-clay">dalam Satu Tempat</em>
          </h2>
          <p className="font-sans text-body-lg text-ash leading-relaxed">
            Dari arsip digital hingga peta interaktif — RIMBAHARI menyediakan ruang
            kolaborasi yang inklusif bagi seluruh pelaku pengetahuan biokultural.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color]
            return (
              <article
                key={feature.id}
                className="card corner-accent p-6 flex flex-col gap-4 group"
              >
                {/* Icon + badge row */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={colors.icon} />
                  </div>
                  <span className={`tag text-[0.7rem] ${colors.border} border`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-h3 font-semibold text-ink">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-body text-ash leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-sand">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="tag text-[0.65rem] py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
