import { Leaf } from 'lucide-react'

const navGroups = [
  {
    heading: 'Platform',
    links: [
      { label: 'Tentang RIMBAHARI', href: '#tentang' },
      { label: 'Etalase Karya', href: '#etalase' },
      { label: 'Peta Interaktif', href: '#peta' },
      { label: 'Profil Kontributor', href: '#kontributor' },
    ],
  },
  {
    heading: 'Kontribusi',
    links: [
      { label: 'Daftar Akun', href: '/register' },
      { label: 'Tulis Artikel', href: '/dashboard/artikel' },
      { label: 'Upload Media', href: '/dashboard/media' },
      { label: 'Update Data Kehati', href: '/dashboard/kehati' },
    ],
  },
  {
    heading: 'Program',
    links: [
      { label: 'Tentang BRWA', href: '#' },
      { label: 'Berita & Update', href: '/berita' },
      { label: 'Kebijakan Konten', href: '#' },
      { label: 'Hubungi Kami', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-bone/75">
      {/* Main footer */}
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center flex-shrink-0">
                <span className="text-bone font-serif font-semibold text-sm">R</span>
              </div>
              <span className="font-serif font-semibold text-lg text-bone tracking-tight">
                RIMBAHARI
              </span>
            </div>
            <p className="font-sans text-sm text-bone/55 leading-relaxed mb-6 max-w-xs">
              <em>Research Initiative on Management of Biocultural Heritage and
              Resilience Innovation.</em> Living knowledge hub masyarakat adat Indonesia.
            </p>
            <div className="flex items-center gap-2 text-caption text-bone/40">
              <Leaf size={12} />
              <span className="uppercase tracking-widest">Nusantara Digital Archive</span>
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="font-sans text-caption uppercase tracking-widest text-bone/40 font-medium mb-5">
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm text-bone/60 hover:text-bone
                        transition-colors duration-[240ms] hover:underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Ornamental divider */}
      <div className="border-t border-white/5">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row
          items-center justify-between gap-4">
          <p className="font-sans text-caption text-bone/30">
            © 2025–2026 RIMBAHARI · BRWA Indonesia. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-sans text-caption text-bone/25">
            Dibuat dengan hormat untuk komunitas adat Nusantara.
          </p>
        </div>
      </div>
    </footer>
  )
}
