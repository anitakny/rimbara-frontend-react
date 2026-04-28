import { Leaf, Users, Globe } from 'lucide-react'

const pillars = [
  {
    icon: Leaf,
    title: 'Dokumentasi & Preservasi',
    description:
      'Mengarsipkan seluruh output RIMBAHARI dalam format digital yang terstandar — dari e-zine kehati hingga story maps etnografi.',
  },
  {
    icon: Users,
    title: 'Partisipasi Komunitas',
    description:
      'Memberdayakan masyarakat adat sebagai kontributor aktif dan pemegang kedaulatan atas narasi pengetahuan mereka sendiri.',
  },
  {
    icon: Globe,
    title: 'Jejaring Pengetahuan',
    description:
      'Memperkuat jaringan pembelajaran antar wilayah adat di 6 provinsi dan membuka akses referensi akademik biokultural.',
  },
]

export default function AboutSection() {
  return (
    <section id="tentang" className="py-24 lg:py-32 bg-bone">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8 bg-clay/50" />
          <span className="tag">Tentang RIMBAHARI</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — editorial text */}
          <div>
            <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-6">
              Satu Platform,{' '}
              <em className="font-accent italic text-clay">Banyak Suara</em>{' '}
              Komunitas Adat
            </h2>

            <p className="font-sans text-body-lg text-ash leading-relaxed mb-5">
              RIMBAHARI — <em>Research Initiative on Management of Biocultural Heritage and
              Resilience Innovation</em> — adalah platform digital kolaboratif yang lahir
              dari kebutuhan nyata: pengetahuan komunitas adat Indonesia yang kaya namun
              tersebar dan sulit diakses publik.
            </p>

            <p className="font-sans text-body text-ash leading-relaxed mb-8">
              Platform ini menjadi <strong className="text-forest font-medium">hub utama</strong> untuk
              mengarsipkan dan menampilkan seluruh output program RIMBAHARI — mulai dari
              e-zine keanekaragaman hayati, story maps, etnografi vignette, hingga
              portofolio peserta — yang dapat diakses oleh semua kalangan.
            </p>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-clay pl-5 py-1 mb-8">
              <p className="font-accent italic text-h3 text-forest leading-relaxed">
                "Komunitas adat bukan objek penelitian — mereka adalah penjaga
                pengetahuan yang harus memiliki kedaulatan atas narasinya."
              </p>
            </blockquote>

            <a href="/login" className="btn-primary inline-flex">
              Bergabung Sekarang
            </a>
          </div>

          {/* Right — pillars */}
          <div className="flex flex-col gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="card corner-accent p-6 flex gap-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-forest/8 flex items-center justify-center">
                    <Icon size={20} className="text-forest" />
                  </div>
                  <div>
                    <h3 className="font-serif text-h3 font-semibold text-ink mb-2">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-body text-ash leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
