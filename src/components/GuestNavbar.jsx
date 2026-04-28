import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Etalase', href: '#etalase' },
  { label: 'Peta', href: '#peta' },
  { label: 'Kontributor', href: '#kontributor' },
]

export default function GuestNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        scrolled
          ? 'bg-bone/95 backdrop-blur-sm shadow-subtle border-b border-sand'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Wordmark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center flex-shrink-0">
              <span className="text-bone font-serif font-semibold text-sm leading-none">R</span>
            </div>
            <span
              className={`font-serif font-semibold text-lg tracking-tight transition-colors duration-[240ms] ${
                scrolled ? 'text-ink' : 'text-bone'
              }`}
            >
              RIMBAHARI
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-sans text-sm font-medium transition-all duration-[240ms]
                  hover:underline underline-offset-4 ${
                    scrolled ? 'text-ash hover:text-forest' : 'text-bone/80 hover:text-bone'
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className={`font-sans text-sm font-medium px-5 py-2.5 rounded-lg border transition-all duration-[240ms] ${
                scrolled
                  ? 'border-forest text-forest hover:bg-forest hover:text-bone'
                  : 'border-bone/60 text-bone hover:bg-bone/10'
              }`}
            >
              Masuk
            </a>
            <a
              href="/register"
              className="font-sans text-sm font-medium px-5 py-2.5 rounded-lg bg-clay text-bone
                hover:bg-sienna transition-all duration-[240ms] shadow-subtle"
            >
              Daftar
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-[240ms] ${
              scrolled ? 'text-ink hover:bg-sand' : 'text-bone hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-bone/98 backdrop-blur-sm border-b border-sand`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium text-ash hover:text-forest py-1 transition-colors duration-[240ms]"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-sand">
            <a href="/login" className="btn-secondary text-center">
              Masuk
            </a>
            <a href="/register" className="btn-primary text-center">
              Daftar
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
