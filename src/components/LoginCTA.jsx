import { LogIn, PenLine, ArrowUpRight } from 'lucide-react'

export default function LoginCTA() {
  return (
    <section className="py-24 lg:py-32 bg-bone relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231F3B2D' fill-opacity='1'%3E%3Cpath d='M40 40l-10-10 10-10 10 10-10 10zm0-20l-10-10 10-10 10 10-10 10zm0 40l-10-10 10-10 10 10-10 10zM20 40l-10-10 10-10 10 10-10 10zm40 0l-10-10 10-10 10 10-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-clay/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-moss/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-content mx-auto px-6 lg:px-12">
        <div className="max-w-reading mx-auto text-center">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-sand" />
            <div className="w-2 h-2 rotate-45 bg-clay/50" />
            <div className="h-px w-12 bg-sand" />
          </div>

          <h2 className="font-serif text-h1 font-semibold text-ink leading-tight mb-5">
            Siap Berkontribusi untuk{' '}
            <em className="font-accent italic text-clay">Warisan Biokultural?</em>
          </h2>

          <p className="font-sans text-body-lg text-ash leading-relaxed mb-10 max-w-prose mx-auto">
            Bergabunglah sebagai kontributor, unggah karya, dan jadilah bagian dari
            gerakan dokumentasi pengetahuan adat Indonesia yang hidup dan terus berkembang.
          </p>

          {/* Role highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {[
              { label: 'Mahasiswa', desc: 'Portfolio & karya lintas disiplin' },
              { label: 'Dosen', desc: 'Publikasi riset & referensi data' },
              { label: 'Pemuda Adat', desc: 'Cerita & data wilayahmu' },
              { label: 'Aktivis', desc: 'Penguatan narasi perlindungan' },
            ].map((role) => (
              <div
                key={role.label}
                className="card p-4 text-left border-sand hover:border-forest/20 transition-colors duration-[240ms]"
              >
                <p className="font-serif text-sm font-semibold text-ink mb-1">{role.label}</p>
                <p className="font-sans text-caption text-ash leading-snug">{role.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-2 bg-forest text-bone px-8 py-4 rounded-lg
                font-sans font-medium text-sm tracking-wide w-full sm:w-auto justify-center
                transition-all duration-[240ms] hover:bg-moss hover:shadow-warm active:scale-[0.98]"
            >
              <PenLine size={16} />
              Daftar Sebagai Kontributor
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 border border-forest/50 text-forest px-8 py-4 rounded-lg
                font-sans font-medium text-sm tracking-wide w-full sm:w-auto justify-center
                transition-all duration-[240ms] hover:bg-forest hover:text-bone hover:border-forest active:scale-[0.98]"
            >
              <LogIn size={16} />
              Masuk ke Akun
            </a>
          </div>

          <p className="font-sans text-caption text-ash/60 mt-6">
            Sudah bergabung?{' '}
            <a href="/login" className="text-forest underline underline-offset-4 hover:text-clay transition-colors duration-[240ms]">
              Masuk di sini
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
