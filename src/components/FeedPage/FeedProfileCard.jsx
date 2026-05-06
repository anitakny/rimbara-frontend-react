import { Link } from 'react-router-dom'
import { ArrowUpRight, Settings, FolderOpen, ShieldCheck } from 'lucide-react'
import { session } from '../../lib/api'

const ADMIN_URL = `${import.meta.env.VITE_API_URL}/4Dm1n_d4Shb04Rd/`

const roleLabels = {
  MAHASISWA:   'Mahasiswa',
  AKADEMISI:   'Akademisi / Dosen',
  PEMUDA_ADAT: 'Pemuda Adat',
  AKTIVIS:     'Aktivis',
  MODERATOR:   'Moderator',
  ADMIN:       'Admin',
  REVIEWER:    'Reviewer',
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function FeedProfileCard() {
  const user = session.getUser()
  const initials = getInitials(user?.full_name)
  const isAdmin = user?.role === 'ADMIN' || user?.is_staff || user?.is_superuser

  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">

      <div className="px-5 pb-5">
        {/* Avatar overlapping header */}
        <div className="my-6">
          <div className="w-16 h-16 rounded-full bg-forest border-2 border-white
            flex items-center justify-center shadow-warm">
            <span className="font-serif font-semibold text-sm text-bone leading-none">
              {initials}
            </span>
          </div>
        </div>

        {/* Pre-label */}
        <div className="flex items-center gap-3 mb-1.5">
          <div className="h-px w-5 bg-clay/50" />
          <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">
            Kontributor
          </span>
        </div>

        {/* Name */}
        <p className="font-serif text-h3 font-semibold text-ink leading-snug">
          {user?.full_name ?? '—'}
        </p>

        {/* Role */}
        {user?.role && (
          <p className="font-sans text-caption text-ash leading-snug mt-0.5 mb-4">
            {roleLabels[user.role] ?? user.role}
          </p>
        )}

        {/* Divider + links */}
        <div className="border-t border-sand pt-3 flex flex-col gap-0.5">
          <Link
            to="/profile"
            className="flex items-center justify-between py-1.5 px-2 rounded-lg font-sans text-sm
              text-ink hover:bg-sand/40 hover:text-forest transition-all duration-[240ms] group"
          >
            Lihat Profil
            <ArrowUpRight size={13} className="text-ash/50 group-hover:text-forest transition-colors duration-[240ms]" />
          </Link>
          <Link
            to="/articles/my"
            className="flex items-center justify-between py-1.5 px-2 rounded-lg font-sans text-sm
              text-ink hover:bg-sand/40 hover:text-forest transition-all duration-[240ms] group"
          >
            Artikel Saya
            <FolderOpen size={13} className="text-ash/50 group-hover:text-forest transition-colors duration-[240ms]" />
          </Link>
        </div>
        <div className="border-t border-sand pt-3 flex flex-col gap-0.5">
          <Link
            to="/settings"
            className="flex items-center justify-between py-1.5 px-2 rounded-lg font-sans text-sm
              text-ink hover:bg-sand/40 hover:text-forest transition-all duration-[240ms] group"
          >
            Pengaturan
            <Settings size={13} className="text-ash/50 group-hover:text-forest transition-colors duration-[240ms]" />
          </Link>
          {isAdmin && (
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-1.5 px-2 rounded-lg font-sans text-sm
                text-ash hover:bg-sand/40 transition-all duration-[240ms] group"
            >
              Dashboard Admin
              <ShieldCheck size={13} className="text-ash/50 group-hover:text-ash transition-colors duration-[240ms]" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
