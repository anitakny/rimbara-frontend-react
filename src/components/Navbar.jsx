import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Beranda', href: '/home' },
]

// Placeholder — replace with real user data from auth context
const mockUser = {
  name: 'Sari Dewi Putri',
  role: 'Mahasiswa',
  initials: 'SD',
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = () => {
    setDropdownOpen(false)
    setMenuOpen(false)
    // TODO: integrate with /api/auth/logout/ and clear JWT
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-sand shadow-subtle">
        <div className="max-w-content mx-auto px-6 lg:px-12">

          {/* ── Mobile header ───────────────────────────────────── */}
          <div className="flex md:hidden items-center justify-between h-16">
            <Link to="/home" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center flex-shrink-0">
                <span className="text-bone font-serif font-semibold text-sm leading-none">R</span>
              </div>
              <span className="font-serif font-semibold text-lg tracking-tight text-ink">
                RIMBAHARI
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg text-ash hover:bg-sand/60 transition-colors duration-[240ms]"
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* ── Desktop header ──────────────────────────────────── */}
          <div className="hidden md:grid grid-cols-3 items-center h-16">

            {/* Left — wordmark */}
            <Link to="/home" className="flex items-center gap-3 w-fit">
              <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center flex-shrink-0">
                <span className="text-bone font-serif font-semibold text-sm leading-none">R</span>
              </div>
              <span className="font-serif font-semibold text-lg tracking-tight text-ink">
                RIMBAHARI
              </span>
            </Link>

            {/* Middle — nav links */}
            <nav className="flex items-center justify-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`font-sans text-sm font-medium px-4 py-2 rounded-lg transition-all duration-[240ms] ${
                      isActive
                        ? 'bg-forest/8 text-forest'
                        : 'text-ash hover:text-forest hover:bg-forest/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right — user avatar + dropdown */}
            <div className="flex items-center justify-end">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-lg
                    hover:bg-sand/60 transition-all duration-[240ms]"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                    <span className="font-serif font-semibold text-xs text-bone leading-none">
                      {mockUser.initials}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-ash flex-shrink-0 transition-transform duration-[240ms] ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2
                    w-44 bg-white rounded-card border border-sand shadow-elevated
                    overflow-hidden z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-ink
                          hover:bg-sand/50 transition-colors duration-[240ms]"
                      >
                        Profil
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-ink
                          hover:bg-sand/50 transition-colors duration-[240ms]"
                      >
                        Pengaturan
                      </Link>
                      <div className="h-px bg-sand mx-4 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-clay
                          hover:bg-clay/5 transition-colors duration-[240ms]"
                      >
                        <LogOut size={15} className="text-clay flex-shrink-0" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile sidebar ────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-[320ms] ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />

        {/* Sidebar panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white flex flex-col
            transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Row 1 — title + close */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
            <Link to="/home" onClick={closeMenu} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center flex-shrink-0">
                <span className="text-bone font-serif font-semibold text-sm leading-none">R</span>
              </div>
              <span className="font-serif font-semibold text-lg tracking-tight text-ink">
                RIMBAHARI
              </span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg text-ash hover:bg-sand/60 transition-colors duration-[240ms]"
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Row 2 — nav links */}
          <div className="px-4 py-4 border-b border-sand flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className={`font-sans text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-[240ms] ${
                    isActive
                      ? 'bg-forest/8 text-forest'
                      : 'text-ash hover:text-ink hover:bg-sand/40'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Row 3 — account actions */}
          <div className="px-4 py-4 flex flex-col gap-1">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-sans text-sm text-ink
                hover:bg-sand/40 transition-colors duration-[240ms]"
            >
              Profil
            </Link>
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-sans text-sm text-ink
                hover:bg-sand/40 transition-colors duration-[240ms]"
            >
              Pengaturan
            </Link>
            <div className="h-px bg-sand my-1 mx-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-sans text-sm text-clay
                hover:bg-clay/5 transition-colors duration-[240ms] w-full text-left"
            >
              <LogOut size={16} className="text-clay flex-shrink-0" />
              Keluar
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
