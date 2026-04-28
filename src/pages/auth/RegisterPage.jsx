import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const allFilled =
    form.name.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword

  const passwordsMatch = form.confirmPassword === '' || form.password === form.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allFilled || !passwordsMatch) return
    setLoading(true)
    // TODO: integrate with /api/auth/register/
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
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
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-clay/50" />
            <span className="font-sans text-caption uppercase tracking-widest text-bone/50">
              Komunitas Kontributor
            </span>
          </div>
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-ash hover:text-forest text-sm font-sans
            transition-colors duration-[240ms] mb-10 w-fit"
        >
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
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ash hover:text-forest
                    transition-colors duration-[240ms]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Ulang Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Ulangi kata sandi" required
                  className={`w-full bg-bone border rounded-lg px-4 py-3 pr-12 font-sans text-sm text-ink
                    placeholder:text-ash/50 outline-none focus:ring-2
                    transition-all duration-[240ms] ${
                      !passwordsMatch
                        ? 'border-clay focus:border-clay focus:ring-clay/15'
                        : 'border-sand focus:border-forest focus:ring-forest/15'
                    }`}
                />
                <button
                  type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ash hover:text-forest
                    transition-colors duration-[240ms]"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="font-sans text-caption text-clay">Kata sandi tidak cocok.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!allFilled || !passwordsMatch || loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-forest disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  Mendaftarkan…
                </span>
              ) : 'Buat Akun'}
            </button>
          </form>

          {/* Divider */}
          <div className="section-divider my-6">
            <span className="font-sans text-caption text-ash/60 px-2">atau</span>
          </div>

          {/* Google register */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-bone border border-sand
              rounded-lg px-4 py-3 font-sans text-sm font-medium text-ink
              hover:bg-sand/50 hover:border-ash/40
              transition-all duration-[240ms] active:scale-[0.98]"
          >
            <GoogleIcon />
            Daftar dengan Google
          </button>

          <p className="font-sans text-body text-ash text-center mt-6">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-forest font-medium underline underline-offset-4 hover:text-clay transition-colors duration-[240ms]"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
