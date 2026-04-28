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

          {/* Two-column layout */}
          <div className="flex items-start gap-8">

            {/* Left — sidebar nav */}
            <aside className="w-56 flex-shrink-0 sticky top-24">
              <nav className="flex flex-col gap-1">
                {sections.map((s) => {
                  const isActive = active === s.key
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActive(s.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left
                        transition-all duration-[240ms] ${
                          isActive
                            ? 'bg-white border border-sand shadow-subtle text-ink font-medium'
                            : 'text-ash hover:text-ink hover:bg-white/60'
                        }`}
                    >
                      <span className="font-sans text-sm">{s.label}</span>
                      {isActive && <ChevronRight size={14} className="text-ash flex-shrink-0" />}
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Right — content panel */}
            <div className="flex-1 min-w-0">
              {ActiveComponent && <ActiveComponent />}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
