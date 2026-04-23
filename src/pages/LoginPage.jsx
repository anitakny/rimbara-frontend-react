import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate with /api/auth/login/
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(160deg, #1F3B2D 0%, #2d5a3e 50%, #1A1814 100%)',
        }}
      >
        {/* Batik overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-bone/10 flex items-center justify-center">
            <span className="text-bone font-serif font-semibold text-base">R</span>
          </div>
          <span className="font-serif font-semibold text-xl text-bone tracking-tight">RIMBAHARI</span>
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-clay/50" />
            <span className="font-sans text-caption uppercase tracking-widest text-bone/50">
              Living Knowledge Hub
            </span>
          </div>
          <blockquote className="font-accent italic text-h2 text-bone leading-snug mb-6 max-w-sm">
            "Dari hutan, untuk semua — merawat warisan, menghidupkan pengetahuan."
          </blockquote>
          <div className="flex items-center gap-2 text-bone/40">
            <Leaf size={13} />
            <span className="font-sans text-caption uppercase tracking-widest">
              Pengetahuan Biokultural Nusantara
            </span>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-ash hover:text-forest text-sm font-sans
            transition-colors duration-[240ms] mb-12 w-fit"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-h1 font-semibold text-ink mb-2">
              Selamat Datang
            </h1>
            <p className="font-sans text-body text-ash">
              Masuk ke akun RIMBAHARI-mu untuk mulai berkontribusi.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Surel
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@institusi.ac.id"
                required
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none
                  focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                  Kata Sandi
                </label>
                <a
                  href="#"
                  className="font-sans text-caption text-forest hover:text-clay
                    transition-colors duration-[240ms] underline underline-offset-4"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-bone border border-sand rounded-lg px-4 py-3 pr-12 font-sans text-sm text-ink
                    placeholder:text-ash/50 outline-none
                    focus:border-forest focus:ring-2 focus:ring-forest/15
                    transition-all duration-[240ms]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ash hover:text-forest
                    transition-colors duration-[240ms]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  Memproses…
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="section-divider my-8">
            <span className="font-sans text-caption text-ash/60 px-2">atau</span>
          </div>

          {/* Register link */}
          <p className="font-sans text-body text-ash text-center">
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="text-forest font-medium underline underline-offset-4
                hover:text-clay transition-colors duration-[240ms]"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
