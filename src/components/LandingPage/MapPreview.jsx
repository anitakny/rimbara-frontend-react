import { MapPin, ChevronRight } from 'lucide-react'

const communities = [
  { name: 'Dayak Ngaju', province: 'Kalimantan Tengah', x: 55, y: 50, count: 12 },
  { name: 'Baduy Dalam', province: 'Banten', x: 35, y: 58, count: 8 },
  { name: 'Suku Toraja', province: 'Sulawesi Selatan', x: 68, y: 55, count: 10 },
  { name: 'Suku Sasak', province: 'Nusa Tenggara Barat', x: 63, y: 62, count: 6 },
  { name: 'Talang Mamak', province: 'Riau', x: 28, y: 47, count: 9 },
  { name: 'Suku Arfak', province: 'Papua Barat', x: 88, y: 50, count: 7 },
  { name: 'Dayak Meratus', province: 'Kalimantan Selatan', x: 60, y: 55, count: 5 },
  { name: 'Suku Mentawai', province: 'Sumatera Barat', x: 22, y: 52, count: 6 },
]

export default function MapPreview() {
  return (
    <section id="peta" className="py-24 lg:py-32 bg-forest overflow-hidden relative">
      {/* Background batik pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-content mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-clay/50" />
              <span className="font-sans text-caption uppercase tracking-widest text-bone/50 font-medium">
                Peta Interaktif
              </span>
            </div>
            <h2 className="font-serif text-h1 font-semibold text-bone leading-tight mb-4">
              Wilayah Adat{' '}
              <em className="font-accent italic text-sand">di Seluruh Nusantara</em>
            </h2>
            <p className="font-sans text-body text-bone/65 leading-relaxed">
              Delapan wilayah adat di enam provinsi terdokumentasi dalam platform
              live-archiving yang terus diperbarui oleh komunitas.
            </p>
          </div>
          <a
            href="/peta"
            className="inline-flex items-center gap-2 border border-bone/30 text-bone px-6 py-3
              rounded-lg font-sans font-medium text-sm tracking-wide flex-shrink-0
              transition-all duration-[240ms] hover:bg-bone/10 hover:border-bone/50"
          >
            Buka Peta Interaktif
            <ChevronRight size={14} />
          </a>
        </div>

        {/* Map visualization */}
        <div className="relative rounded-card overflow-hidden border border-white/8 shadow-elevated">
          {/* Map background — stylized Indonesia silhouette */}
          <div
            className="w-full h-80 lg:h-[420px] relative"
            style={{
              background: 'linear-gradient(180deg, #162A20 0%, #1F3B2D 40%, #2A4F3C 100%)',
            }}
          >
            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(245,239,227,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245,239,227,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Indonesia shape hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 400 200" className="w-4/5 fill-bone/20">
                <ellipse cx="80" cy="100" rx="55" ry="25" />
                <ellipse cx="165" cy="95" rx="60" ry="30" />
                <ellipse cx="230" cy="100" rx="40" ry="22" />
                <ellipse cx="270" cy="105" rx="25" ry="15" />
                <ellipse cx="300" cy="98" rx="30" ry="18" />
                <ellipse cx="355" cy="100" rx="35" ry="20" />
              </svg>
            </div>

            {/* Community pins */}
            {communities.map((c) => (
              <div
                key={c.name}
                className="absolute group cursor-pointer"
                style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -100%)' }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100
                  transition-all duration-[240ms] pointer-events-none z-10">
                  <div className="bg-ink/90 backdrop-blur-sm text-bone px-3 py-1.5 rounded-lg text-xs whitespace-nowrap
                    shadow-elevated">
                    <span className="font-serif font-semibold">{c.name}</span>
                    <br />
                    <span className="text-bone/60">{c.province} · {c.count} konten</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-ink/90 rotate-45 mx-auto -mt-0.75" />
                </div>

                {/* Pin */}
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-clay border-2 border-bone/40
                    shadow-elevated group-hover:scale-125 group-hover:bg-sand
                    transition-all duration-[240ms]" />
                  <div className="w-0.5 h-2 bg-clay/60" />
                  <div className="w-1 h-1 rounded-full bg-clay/40" />
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-ink/60 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-clay border border-bone/40" />
              <span className="font-sans text-caption text-bone/70">Wilayah Adat</span>
            </div>

            {/* Scale indicator */}
            <div className="absolute bottom-4 right-4 font-sans text-caption text-bone/40">
              OpenStreetMap · Leaflet.js
            </div>
          </div>
        </div>

        {/* Community list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {communities.map((c) => (
            <a
              key={c.name}
              href="/peta"
              className="flex items-center gap-2.5 p-3 rounded-lg border border-white/8
                hover:bg-white/5 transition-all duration-[240ms] group"
            >
              <MapPin size={13} className="text-clay flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-bone truncate">{c.name}</p>
                <p className="font-sans text-caption text-bone/45 truncate">{c.province}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
