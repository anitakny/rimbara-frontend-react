import { useState } from 'react'
import { ArrowLeft, Leaf, Send, KeyRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendCode = async () => {
    if (!email.trim()) return
    setSendingCode(true)
    // TODO: integrate with /api/auth/forgot-password/
    setTimeout(() => {
      setSendingCode(false)
      setCodeSent(true)
    }, 1500)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    // TODO: integrate with /api/auth/verify-reset-code/
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(160deg, #1A1814 0%, #1F3B2D 55%, #2A4F3C 100%)',
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
              Keamanan Akun
            </span>
          </div>
          <blockquote className="font-accent italic text-h2 text-bone leading-snug mb-5 max-w-xs">
            "Tenang — kami akan membantumu mendapatkan akses kembali."
          </blockquote>
          <div className="flex items-center gap-2 text-bone/40">
            <Leaf size={13} />
            <span className="font-sans text-caption uppercase tracking-widest">Pemulihan Akun</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-ash hover:text-forest text-sm font-sans
            transition-colors duration-[240ms] mb-12 w-fit"
        >
          <ArrowLeft size={14} /> Kembali ke Masuk
        </Link>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-h1 font-semibold text-ink mb-2">
              Lupa Kata Sandi?
            </h1>
            <p className="font-sans text-body text-ash leading-relaxed">
              Masukkan surel akunmu. Kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Email field + send button */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Surel
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@institusi.ac.id"
                  disabled={codeSent}
                  className={`flex-1 border rounded-lg px-4 py-3 font-sans text-sm text-ink
                    placeholder:text-ash/50 outline-none focus:ring-2
                    transition-all duration-[240ms] ${
                      codeSent
                        ? 'bg-sand/30 border-sand text-ash cursor-not-allowed focus:border-sand focus:ring-transparent'
                        : 'bg-bone border-sand focus:border-forest focus:ring-forest/15'
                    }`}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!email.trim() || sendingCode || codeSent}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-lg
                    font-sans text-sm font-medium transition-all duration-[240ms]
                    disabled:cursor-not-allowed ${
                      codeSent
                        ? 'bg-moss/15 text-moss border border-moss/25 cursor-default'
                        : 'bg-forest text-bone hover:bg-moss hover:shadow-warm active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-forest disabled:active:scale-100'
                    }`}
                >
                  {sendingCode ? (
                    <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  ) : codeSent ? (
                    'Terkirim'
                  ) : (
                    <>
                      <Send size={14} />
                      Kirim
                    </>
                  )}
                </button>
              </div>
              {codeSent && (
                <div className="flex items-start gap-2 mt-1">
                  <p className="font-sans text-caption text-moss">
                    Kode telah dikirim ke <strong>{email}</strong>.{' '}
                    <button
                      type="button"
                      onClick={() => { setCodeSent(false); setCode('') }}
                      className="text-forest underline underline-offset-4 hover:text-clay transition-colors duration-[240ms]"
                    >
                      Ganti surel
                    </button>
                  </p>
                </div>
              )}
            </div>

            {/* Verification code — revealed after send */}
            <div
              className={`flex flex-col gap-1.5 transition-all duration-[320ms] ${
                codeSent ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                Kode Verifikasi
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6 digit kode"
                maxLength={6}
                className="bg-bone border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                  transition-all duration-[240ms] font-tabular tracking-[0.3em] text-center"
              />
              <div className="flex items-center justify-between">
                <p className="font-sans text-caption text-ash/60">
                  Cek folder Spam jika tidak muncul.
                </p>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="font-sans text-caption text-forest hover:text-clay underline underline-offset-4
                    transition-colors duration-[240ms] disabled:opacity-50"
                >
                  {sendingCode ? 'Mengirim…' : 'Kirim ulang'}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={!codeSent || !code.trim() || loading}
              className="btn-primary flex items-center justify-center gap-2 mt-2
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-forest disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
                  Memverifikasi…
                </span>
              ) : 'Verifikasi & Lanjutkan'}
            </button>
          </div>

          {/* Divider */}
          <div className="section-divider my-8">
            <span className="font-sans text-caption text-ash/60 px-2" />
          </div>

          <p className="font-sans text-body text-ash text-center">
            Ingat kata sandimu?{' '}
            <Link
              to="/login"
              className="text-forest font-medium underline underline-offset-4
                hover:text-clay transition-colors duration-[240ms]"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
