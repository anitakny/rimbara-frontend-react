import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

const roles = [
  { value: 'mahasiswa', label: 'Mahasiswa', desc: 'Peserta program akademik' },
  { value: 'dosen', label: 'Dosen / Akademisi', desc: 'Pengajar & peneliti' },
  { value: 'pemuda_adat', label: 'Pemuda Adat', desc: 'Anggota komunitas adat' },
  { value: 'aktivis', label: 'Aktivis', desc: 'Pegiat lingkungan & advokasi' },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '', institution: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate with /api/auth/register/
    setTimeout(() => setLoading(false), 1500)
  }

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(160deg, #8B4A2B 0%, #B85C3E 50%, #1F3B2D 100%)',
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
          <blockquote className="font-accent italic text-h2 text-bone leading-snug mb-5 max-w-xs">
            "Bergabunglah — suaramu adalah bagian dari warisan yang hidup."
          </blockquote>
          <div className="flex items-center gap-2 text-bone/40">
            <Leaf size={13} />
            <span className="font-sans text-caption uppercase tracking-widest">Komunitas Kontributor</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <Link to="/"
          className="inline-flex items-center gap-2 text-ash hover:text-forest text-sm font-sans
            transition-colors duration-[240ms] mb-10 w-fit">
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="font-serif text-h1 font-semibold text-ink mb-2">Buat Akun</h1>
            <p className="font-sans text-body text-ash">
              Daftar dan mulai berkontribusi untuk pengetahuan biokultural Indonesia.
            </p>
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
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
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
                    <p className="font-sans text-sm font-medium">{r.label}</p>
                    <p className="font-sans text-caption text-ash/70">{r.desc}</p>
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
                placeholder="Nama universitas, komunitas, atau organisasi"
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={(e) => update('password', e.target.value)}
                  placeholder="Minimal 8 karakter" required minLength={8}
                  className="w-full bg-bone border border-sand rounded-lg px-4 py-3 pr-12 font-sans text-sm text-ink
                    placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                    transition-all duration-[240ms]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ash hover:text-forest
                    transition-colors duration-[240ms]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  Mendaftarkan…
                </span>
              ) : 'Buat Akun'}
            </button>
          </form>

          <p className="font-sans text-body text-ash text-center mt-6">
            Sudah punya akun?{' '}
            <Link to="/login"
              className="text-forest font-medium underline underline-offset-4 hover:text-clay transition-colors duration-[240ms]">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
