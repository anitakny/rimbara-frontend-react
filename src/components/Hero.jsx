import { ArrowDown, BookOpen } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image layer */}
      <div className="absolute inset-0">
        {/* Gradient overlay — warm duotone: Deep Forest → Bone Cream */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/70 to-ink/80 z-10" />
        {/* Placeholder forest/community imagery */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, #2A4F3C 0%, transparent 60%),
              radial-gradient(ellipse at 70% 60%, #4A6238 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, #1F3B2D 0%, transparent 70%),
              linear-gradient(160deg, #1F3B2D 0%, #2d5a3e 35%, #3d6b4a 65%, #1A1814 100%)
            `,
          }}
        />
        {/* Subtle batik overlay */}
        <div
          className="absolute inset-0 z-20 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-content mx-auto px-6 lg:px-12 pb-16 lg:pb-24 pt-32">
        <div className="max-w-3xl">
          {/* Pre-label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-clay/60" />
            <span className="font-sans text-caption uppercase tracking-widest text-bone/70 font-medium">
              Platform Pengetahuan Biokultural
            </span>
          </div>

          {/* Display heading */}
          <h1 className="font-serif text-display font-semibold text-bone leading-[1.05] tracking-tight mb-6 text-balance">
            Merawat Warisan,{' '}
            <em className="font-accent italic text-sand/90">Menghidupkan</em>{' '}
            Pengetahuan Adat
          </h1>

          {/* Sub-heading */}
          <p className="font-sans text-body-lg text-bone/75 max-w-2xl mb-10 leading-relaxed">
            RIMBAHARI adalah <em className="font-accent italic text-sand">living knowledge hub</em> untuk
            mendokumentasikan, mengarsipkan, dan menyebarluaskan pengetahuan biokultural
            masyarakat adat Indonesia — dari hutan, untuk semua.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mb-12">
            {[
              { value: '8', label: 'Wilayah Adat' },
              { value: '6', label: 'Provinsi' },
              { value: '63+', label: 'Kontributor' },
              { value: '50+', label: 'Karya Digital' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-serif text-h2 font-semibold text-bone font-tabular">
                  {stat.value}
                </span>
                <span className="font-sans text-caption uppercase tracking-widest text-bone/55">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#etalase"
              className="inline-flex items-center gap-2 bg-clay text-bone px-7 py-3.5 rounded-lg
                font-sans font-medium text-sm tracking-wide
                transition-all duration-[240ms] hover:bg-sienna hover:shadow-warm active:scale-[0.98]"
            >
              <BookOpen size={16} />
              Jelajahi Etalase
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center gap-2 bg-transparent border border-bone/40 text-bone
                px-7 py-3.5 rounded-lg font-sans font-medium text-sm tracking-wide
                transition-all duration-[240ms] hover:bg-bone/10 hover:border-bone/70 active:scale-[0.98]"
            >
              Tentang Program
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone/40">
          <span className="font-sans text-caption uppercase tracking-widest text-xs">Gulir</span>
          <ArrowDown size={14} className="animate-bounce" />
        </div>
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bone to-transparent z-30" />
    </section>
  )
}
