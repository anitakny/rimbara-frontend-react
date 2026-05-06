import { useEffect, useState } from 'react'
import { Leaf, CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authApi, profilesApi, session } from '../../lib/api'

const ROLES = [
  { value: 'MAHASISWA',   label: 'Mahasiswa',        desc: 'Peserta program akademik'     },
  { value: 'AKADEMISI',   label: 'Dosen / Akademisi', desc: 'Pengajar & peneliti'          },
  { value: 'PEMUDA_ADAT', label: 'Pemuda Adat',       desc: 'Anggota komunitas adat'       },
  { value: 'AKTIVIS',     label: 'Aktivis',           desc: 'Pegiat lingkungan & advokasi' },
]

export default function ActivatePage() {
  const navigate = useNavigate()
  const user     = session.getUser()

  useEffect(() => {
    if (!session.getAccess()) { navigate('/login',   { replace: true }); return }
    if (user?.is_profile_complete) { navigate('/profile', { replace: true }) }
  }, [])

  // 'otp' → email verification first; 'profile' → profile completion
  const [step, setStep] = useState(user?.is_email_verified ? 'profile' : 'otp')

  // ── OTP state ─────────────────────────────────────────────────
  const [otp, setOtp]               = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError]     = useState('')
  const [resending, setResending]   = useState(false)
  const [cooldown, setCooldown]     = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return
    setOtpLoading(true)
    setOtpError('')
    const { ok, data } = await authApi.verifyEmail(user?.email, otp)
    if (ok) {
      session.save(session.getAccess(), session.getRefresh(), { ...user, is_email_verified: true })
      setStep('profile')
    } else {
      setOtpError(data?.error ?? data?.detail ?? 'Kode tidak valid atau sudah kedaluwarsa.')
    }
    setOtpLoading(false)
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    setOtpError('')
    await authApi.resendOtp()
    setResending(false)
    setCooldown(60)
  }

  // ── Profile form state ────────────────────────────────────────
  const [form, setForm]           = useState({ role_category: '', institution: '', location: '' })
  const [loading, setLoading]     = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (fieldErrors[key]) setFieldErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role_category || !form.institution.trim()) return
    setLoading(true)
    setFieldErrors({})
    setServerError('')
    const { ok, status, data } = await profilesApi.complete(form.institution, form.role_category, form.location)
    if (ok) {
      const updatedUser = { ...user, is_profile_complete: true }
      session.save(session.getAccess(), session.getRefresh(), updatedUser)
      navigate('/profile', { replace: true })
    } else if (status === 400 && data.errors) {
      setFieldErrors(data.errors)
    } else {
      setServerError(data.error || 'Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bone flex">

      {/* ── Left panel ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, #1F3B2D 0%, #2A4F3C 45%, #5C7A4A 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
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
              {step === 'otp' ? 'Verifikasi Email' : 'Satu Langkah Lagi'}
            </span>
          </div>
          <blockquote className="font-accent italic text-h2 text-bone leading-snug mb-5 max-w-xs">
            {step === 'otp'
              ? '"Konfirmasi emailmu untuk mengamankan akses ke komunitas."'
              : '"Lengkapi profilmu dan jadilah bagian dari jaringan pengetahuan adat Indonesia."'
            }
          </blockquote>
          <div className="flex items-center gap-2 text-bone/40">
            <Leaf size={13} />
            <span className="font-sans text-caption uppercase tracking-widest">Aktivasi Akun</span>
          </div>
        </div>
      </div>

      {/* ── Right — form ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto lg:mx-0">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {/* Step 1 — Daftar (always done) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-moss flex items-center justify-center">
                <CheckCircle size={12} className="text-bone" />
              </div>
              <span className="font-sans text-caption text-moss hidden sm:block">Daftar</span>
            </div>
            <div className={`flex-1 h-px ${step === 'otp' ? 'bg-forest/40' : 'bg-moss/50'}`} />

            {/* Step 2 — Verifikasi Email */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step === 'otp' ? 'bg-forest' : 'bg-moss'
              }`}>
                {step === 'profile'
                  ? <CheckCircle size={12} className="text-bone" />
                  : <span className="font-sans text-[0.6rem] font-bold text-bone">2</span>
                }
              </div>
              <span className={`font-sans text-caption hidden sm:block ${
                step === 'otp' ? 'text-forest font-medium' : 'text-moss'
              }`}>Verifikasi Email</span>
            </div>
            <div className={`flex-1 h-px ${step === 'profile' ? 'bg-forest/40' : 'bg-sand'}`} />

            {/* Step 3 — Lengkapi Profil */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step === 'profile' ? 'bg-forest' : 'bg-sand'
              }`}>
                <span className="font-sans text-[0.6rem] font-bold text-bone">3</span>
              </div>
              <span className={`font-sans text-caption hidden sm:block ${
                step === 'profile' ? 'text-forest font-medium' : 'text-ash'
              }`}>Lengkapi Profil</span>
            </div>
            <div className="flex-1 h-px bg-sand" />

            {/* Step 4 — Mulai */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-sand flex items-center justify-center">
                <span className="font-sans text-[0.6rem] font-bold text-ash">4</span>
              </div>
              <span className="font-sans text-caption text-ash hidden sm:block">Mulai</span>
            </div>
          </div>

          {/* ── OTP STEP ─────────────────────────────────────── */}
          {step === 'otp' && (
            <>
              <div className="inline-flex items-center gap-2 bg-forest/10 text-forest border border-forest/20
                rounded-full px-3 py-1 font-sans text-caption uppercase tracking-widest font-medium mb-4">
                <Mail size={12} />
                Verifikasi Email
              </div>

              <h1 className="font-serif text-h1 font-semibold text-ink mb-2">Cek Emailmu</h1>
              <p className="font-sans text-body text-ash mb-6">
                Kode 6 digit telah dikirim ke{' '}
                <strong className="font-medium text-ink">{user?.email}</strong>.
                Masukkan kode tersebut di bawah ini.
              </p>

              {otpError && (
                <div className="flex items-start gap-3 bg-clay/8 border border-clay/20 rounded-lg px-4 py-3 mb-5">
                  <AlertCircle size={16} className="text-clay flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-caption text-clay leading-relaxed">{otpError}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                    Kode Verifikasi
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError('') }}
                    placeholder="_ _ _ _ _ _"
                    maxLength={6}
                    autoFocus
                    className="bg-bone border border-sand rounded-lg px-4 py-4 font-sans text-2xl text-ink
                      placeholder:text-ash/30 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                      transition-all duration-[240ms] font-tabular tracking-[0.45em] text-center"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-sans text-caption text-ash/60">Cek folder Spam jika tidak muncul.</p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0 || resending}
                      className="font-sans text-caption text-forest hover:text-clay underline underline-offset-4
                        transition-colors duration-[240ms] disabled:opacity-50 flex items-center gap-1"
                    >
                      {resending
                        ? <><Loader2 size={11} className="animate-spin" />Mengirim…</>
                        : cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang'
                      }
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6 || otpLoading}
                  className="btn-primary flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {otpLoading
                    ? <><Loader2 size={15} className="animate-spin" />Memverifikasi…</>
                    : 'Verifikasi Email'
                  }
                </button>
              </form>
            </>
          )}

          {/* ── PROFILE STEP ─────────────────────────────────── */}
          {step === 'profile' && (
            <>
              <div className="inline-flex items-center gap-2 bg-moss/10 text-moss border border-moss/20
                rounded-full px-3 py-1 font-sans text-caption uppercase tracking-widest font-medium mb-4">
                <CheckCircle size={12} />
                Akun Berhasil Dibuat
              </div>

              <h1 className="font-serif text-h1 font-semibold text-ink mb-1">Lengkapi Profilmu</h1>
              {user?.full_name && (
                <p className="font-sans text-body text-ash mb-6">
                  Halo, <span className="font-medium text-forest">{user.full_name}</span>! Satu langkah lagi sebelum bisa berkontribusi.
                </p>
              )}

              {serverError && (
                <div className="flex items-start gap-3 bg-clay/8 border border-clay/20 rounded-lg px-4 py-3 mb-5">
                  <AlertCircle size={16} className="text-clay flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-caption text-clay leading-relaxed">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                    Peran <span className="text-clay">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(r => (
                      <button key={r.value} type="button" onClick={() => update('role_category', r.value)}
                        className={`text-left px-4 py-3 rounded-lg border transition-all duration-[240ms] ${
                          form.role_category === r.value
                            ? 'border-forest bg-forest/8 text-forest'
                            : 'border-sand bg-bone text-ash hover:border-forest/30'
                        }`}>
                        <p className="font-sans text-sm font-medium leading-snug">{r.label}</p>
                        <p className="font-sans text-caption text-ash/70 leading-snug">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                  {fieldErrors.role_category && (
                    <p className="font-sans text-caption text-clay">{fieldErrors.role_category[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                    Institusi / Komunitas <span className="text-clay">*</span>
                  </label>
                  <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)}
                    placeholder="Nama universitas, komunitas, atau organisasi" required
                    className={`bg-bone border rounded-lg px-4 py-3 font-sans text-sm text-ink
                      placeholder:text-ash/50 outline-none focus:ring-2 transition-all duration-[240ms] ${
                        fieldErrors.institution
                          ? 'border-clay focus:border-clay focus:ring-clay/15'
                          : 'border-sand focus:border-forest focus:ring-forest/15'
                      }`} />
                  {fieldErrors.institution && (
                    <p className="font-sans text-caption text-clay">{fieldErrors.institution[0]}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                    Lokasi <span className="normal-case text-ash/50 ml-1">(opsional)</span>
                  </label>
                  <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                    placeholder="Kota, provinsi"
                    className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                      placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                      transition-all duration-[240ms]" />
                </div>

                <button type="submit"
                  disabled={!form.role_category || !form.institution.trim() || loading}
                  className="btn-primary mt-2 flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-forest disabled:active:scale-100">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />Menyimpan…</>
                    : 'Simpan & Mulai Berkontribusi'
                  }
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
