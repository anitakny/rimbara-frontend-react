import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProfileEditPage from '../components/SettingsPage/ProfileEditPage'

const sections = [
  { key: 'personal', label: 'Informasi Personal', component: ProfileEditPage },
]

export default function SettingsPage() {
  const [active, setActive] = useState('personal')

  const ActiveComponent = sections.find((s) => s.key === active)?.component ?? null

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-12">

          {/* Page header */}
          <div className="mb-10">
            <h1 className="font-serif text-h1 font-semibold text-ink">
              Akun &amp; Pengaturan
            </h1>
            <p className="font-sans text-body text-ash mt-1">
              Kelola profil pribadi, preferensi keamanan, dan pengaturan platform.
            </p>
          </div>

          {/* Layout — stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">

            {/* Nav — horizontal scroll on mobile, vertical sidebar on desktop */}
            <aside className="w-full md:w-56 md:flex-shrink-0 md:sticky md:top-24">
              <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
                {sections.map((s) => {
                  const isActive = active === s.key
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActive(s.key)}
                      className={`flex-shrink-0 flex items-center justify-between px-4 py-2.5 md:py-3
                        rounded-lg text-left transition-all duration-[240ms] ${
                          isActive
                            ? 'bg-white border border-sand shadow-subtle text-ink font-medium'
                            : 'text-ash hover:text-ink hover:bg-white/60'
                        }`}
                    >
                      <span className="font-sans text-sm whitespace-nowrap">{s.label}</span>
                      {isActive && <ChevronRight size={14} className="text-ash flex-shrink-0 hidden md:block ml-4" />}
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Content panel */}
            <div className="flex-1 min-w-0">
              {ActiveComponent && <ActiveComponent />}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
