import { useState } from 'react'
import { Leaf, CheckCircle } from 'lucide-react'

const roles = [
  { value: 'mahasiswa', label: 'Mahasiswa', desc: 'Peserta program akademik' },
  { value: 'dosen', label: 'Dosen / Akademisi', desc: 'Pengajar & peneliti' },
  { value: 'pemuda_adat', label: 'Pemuda Adat', desc: 'Anggota komunitas adat' },
  { value: 'aktivis', label: 'Aktivis', desc: 'Pegiat lingkungan & advokasi' },
]

export default function ActivatePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    institution: '',
  })
  const [loading, setLoading] = useState(false)

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const allFilled =
    form.name.trim() &&
    form.email.trim() &&
    form.role &&
    form.institution.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allFilled) return
    setLoading(true)
    // TODO: integrate with /api/users/me/profile/
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 45%, #5C7A4A 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-bone/10 flex items-center justify-center">
            <span className="text-bone font-serif font-semibold text-base">R</span>
          </div>
          <span className="font-serif font-semibold text-xl text-bone tracking-tight">RIMBAHARI</span>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-moss/60" />
            <span className="font-sans text-caption uppercase tracking-widest text-bone/50">
              Satu Langkah Lagi
            </span>
          </div>
          <blockquote className="font-accent italic text-h2 text-bone leading-snug mb-5 max-w-xs">
            "Lengkapi profilmu dan jadilah bagian dari jaringan pengetahuan adat Indonesia."
          </blockquote>
          <div className="flex items-center gap-2 text-bone/40">
            <Leaf size={13} />
            <span className="font-sans text-caption uppercase tracking-widest">Aktivasi Akun</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto lg:mx-0">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-moss/10 text-moss border border-moss/20
            rounded-chip px-3 py-1 font-sans text-caption uppercase tracking-widest font-medium mb-4">
            <CheckCircle size={12} />
            Akun Berhasil Dibuat
          </div>

          <h1 className="font-serif text-h1 font-semibold text-ink mb-2">
            Lengkapi Profilmu
          </h1>
          <p className="font-sans text-body text-ash mb-6">
            Informasi ini akan tampil di halaman profil publik dan membantu komunitas mengenalmu.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-moss flex items-center justify-center">
                <CheckCircle size={12} className="text-bone" />
              </div>
              <span className="font-sans text-caption text-ash">Daftar</span>
            </div>
            <div className="flex-1 h-px bg-forest/30" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                <span className="font-sans text-[0.6rem] font-bold text-bone">2</span>
              </div>
              <span className="font-sans text-caption text-forest font-medium">Lengkapi Profil</span>
            </div>
            <div className="flex-1 h-px bg-sand" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-sand flex items-center justify-center">
                <span className="font-sans text-[0.6rem] font-bold text-ash">3</span>
              </div>
              <span className="font-sans text-caption text-ash">Mulai</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Nama Lengkap
              </label>
              <input
                type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                placeholder="Nama lengkap Anda" required
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Surel
              </label>
              <input
                type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                placeholder="nama@institusi.ac.id" required
                className="bg-sand/30 border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
              <p className="font-sans text-caption text-ash/60">
                Gunakan surel yang sama dengan saat pendaftaran.
              </p>
            </div>

            {/* Role selector */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Peran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => update('role', r.value)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all duration-[240ms]
                      ${form.role === r.value
                        ? 'border-forest bg-forest/8 text-forest'
                        : 'border-sand bg-bone text-ash hover:border-forest/30'
                      }`}
                  >
                    <p className="font-sans text-sm font-medium leading-snug">{r.label}</p>
                    <p className="font-sans text-caption text-ash/70 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Institution */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Institusi / Komunitas
              </label>
              <input
                type="text" value={form.institution} onChange={(e) => update('institution', e.target.value)}
                placeholder="Nama universitas, komunitas, atau organisasi" required
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
            </div>

            <button
              type="submit"
              disabled={!allFilled || loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-forest disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  Menyimpan…
                </span>
              ) : 'Simpan & Mulai Berkontribusi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
