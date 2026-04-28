import { useState, useRef, useEffect } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Beranda', href: '/beranda' },
]

// Placeholder — replace with real user data from auth context
const mockUser = {
  name: 'John Doe',
  role: 'Mahasiswa',
  initials: 'JD',
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    // TODO: integrate with /api/auth/logout/ and clear JWT
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bone border-b border-sand shadow-subtle">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-3 items-center h-16">

          {/* Left — wordmark */}
          <Link to="/beranda" className="flex items-center gap-3 w-fit">
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

          {/* Right — user profile */}
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

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2
                  w-44 bg-bone rounded-card border border-sand shadow-elevated
                  overflow-hidden z-50">
                  <div className="py-1">
                    <Link
                      to="/profil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-ink
                        hover:bg-sand/50 transition-colors duration-[240ms]"
                    >
                      <User size={15} className="text-ash flex-shrink-0" />
                      Profil
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
  )
}
