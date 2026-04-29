import { useEffect, useState } from 'react'
import { Camera, CheckCircle } from 'lucide-react'
import { profilesApi, session } from '../../lib/api'

const BIO_MAX = 500

// Values must match Profile.RoleCategory choices on the backend
const roles = [
  { value: 'MAHASISWA',   label: 'Mahasiswa',        desc: 'Peserta program akademik' },
  { value: 'AKADEMISI',   label: 'Dosen / Akademisi', desc: 'Pengajar & peneliti' },
  { value: 'PEMUDA_ADAT', label: 'Pemuda Adat',       desc: 'Anggota komunitas adat' },
  { value: 'AKTIVIS',     label: 'Aktivis',           desc: 'Pegiat lingkungan & advokasi' },
]

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function FormRow({ label, hint, error, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-8 py-5 md:py-6 border-b border-sand last:border-0">
      <div className="md:pt-0.5">
        <p className="font-sans text-sm font-medium text-ink">{label}</p>
        {hint && <p className="font-sans text-caption text-ash/70 mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div>
        {children}
        {error && <p className="font-sans text-caption text-clay mt-1">{error}</p>}
      </div>
    </div>
  )
}

export default function ProfileEditPage() {
  const sessionUser = session.getUser()

  const [form, setForm] = useState({ institution: '', role_category: '', bio: '' })
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    profilesApi.me().then(({ ok, data }) => {
      if (ok) {
        setProfileData(data)
        setForm({
          institution:   data.institution   || '',
          role_category: data.role_category || '',
          bio:           data.bio           || '',
        })
      }
      setLoading(false)
    })
  }, [])

  const update = (key, val) => {
    setSaved(false)
    setFieldErrors((e) => ({ ...e, [key]: undefined }))
    setForm((f) => ({ ...f, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setFieldErrors({})
    setServerError('')

    const { ok, status, data } = await profilesApi.update({
      institution:   form.institution,
      role_category: form.role_category,
      bio:           form.bio,
    })

    if (ok) {
      setProfileData(data.profile)
      setSaved(true)
    } else if (status === 400 && data.errors) {
      setFieldErrors(data.errors)
    } else {
      setServerError(data.error || 'Terjadi kesalahan. Coba lagi.')
    }

    setSaving(false)
  }

  const charsLeft = BIO_MAX - form.bio.length
  const initials = getInitials(profileData?.full_name ?? sessionUser?.full_name)
  const fullName = profileData?.full_name ?? sessionUser?.full_name ?? ''
  const email = sessionUser?.email ?? ''

  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
      {/* Panel header */}
      <div className="px-4 md:px-8 py-5 md:py-6 border-b border-sand">
        <h2 className="font-serif text-h3 font-semibold text-ink">Informasi Personal</h2>
        <p className="font-sans text-caption text-ash mt-0.5">
          Perbarui foto dan informasi profilmu yang akan tampil secara publik.
        </p>
      </div>

      {loading ? (
        <div className="px-4 md:px-8 py-12 flex justify-center">
          <span className="w-6 h-6 border-2 border-sand border-t-forest rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-4 md:px-8 py-2">

          {/* Photo */}
          <FormRow label="Foto Profil" hint="Akan ditampilkan di halaman profilmu.">
            <div className="flex items-center gap-5">
              {profileData?.photo_url ? (
                <img
                  src={profileData.photo_url}
                  alt={fullName}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                  <span className="font-serif font-semibold text-base text-bone leading-none">
                    {initials}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {profileData?.photo_url && (
                  <>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-clay
                        hover:text-sienna transition-colors duration-[240ms]"
                    >
                      Hapus
                    </button>
                    <span className="text-sand">|</span>
                  </>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-forest
                    hover:text-moss transition-colors duration-[240ms]"
                >
                  <Camera size={14} />
                  {profileData?.photo_url ? 'Ganti' : 'Unggah Foto'}
                </button>
              </div>
            </div>
          </FormRow>

          {/* Name — read-only, lives on the User model */}
          <FormRow label="Nama Lengkap" hint="Untuk mengubah nama, hubungi tim RIMBAHARI.">
            <input
              type="text"
              value={fullName}
              readOnly
              className="w-full bg-sand/20 border border-sand rounded-lg px-4 py-2.5 font-sans text-sm text-ash
                outline-none cursor-not-allowed"
            />
          </FormRow>

          {/* Email — read-only */}
          <FormRow label="Surel" hint="Perubahan surel membutuhkan verifikasi ulang.">
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-sand/20 border border-sand rounded-lg px-4 py-2.5 font-sans text-sm text-ash
                outline-none cursor-not-allowed"
            />
          </FormRow>

          {/* Institution */}
          <FormRow
            label="Institusi / Komunitas"
            hint="Universitas, komunitas adat, atau organisasi."
            error={fieldErrors.institution?.[0]}
          >
            <input
              type="text"
              value={form.institution}
              onChange={(e) => update('institution', e.target.value)}
              className={`w-full bg-white border rounded-lg px-4 py-2.5 font-sans text-sm text-ink
                placeholder:text-ash/50 outline-none focus:ring-2 transition-all duration-[240ms] ${
                  fieldErrors.institution
                    ? 'border-clay focus:border-clay focus:ring-clay/15'
                    : 'border-sand focus:border-forest focus:ring-forest/15'
                }`}
            />
          </FormRow>

          {/* Role */}
          <FormRow
            label="Peran"
            hint="Kategori kontribusimu dalam platform."
            error={fieldErrors.role_category?.[0]}
          >
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => update('role_category', r.value)}
                  className={`text-left px-4 py-3 rounded-lg border transition-all duration-[240ms]
                    ${form.role_category === r.value
                      ? 'border-forest bg-forest/8 text-forest'
                      : 'border-sand bg-white text-ash hover:border-forest/30'
                    }`}
                >
                  <p className="font-sans text-sm font-medium leading-snug">{r.label}</p>
                  <p className="font-sans text-caption text-ash/70 leading-snug">{r.desc}</p>
                </button>
              ))}
            </div>
          </FormRow>

          {/* Bio */}
          <FormRow
            label="Bio"
            hint="Tulis perkenalan singkat tentang dirimu."
            error={fieldErrors.bio?.[0]}
          >
            <div className="flex flex-col gap-1.5">
              <textarea
                value={form.bio}
                onChange={(e) => update('bio', e.target.value.slice(0, BIO_MAX))}
                rows={4}
                className={`w-full bg-white border rounded-lg px-4 py-3 font-sans text-sm text-ink
                  placeholder:text-ash/50 outline-none focus:ring-2 transition-all duration-[240ms] resize-none ${
                    fieldErrors.bio
                      ? 'border-clay focus:border-clay focus:ring-clay/15'
                      : 'border-sand focus:border-forest focus:ring-forest/15'
                  }`}
                placeholder="Ceritakan sedikit tentang dirimu dan fokus kontribusimu..."
              />
              <p className={`font-sans text-caption text-right ${charsLeft < 50 ? 'text-clay' : 'text-ash/50'}`}>
                {charsLeft} karakter tersisa
              </p>
            </div>
          </FormRow>

        </div>
      )}

      {/* Footer — save */}
      <div className="px-4 md:px-8 py-4 md:py-5 border-t border-sand bg-sand/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          {saved && (
            <>
              <CheckCircle size={14} className="text-moss flex-shrink-0" />
              <p className="font-sans text-caption text-moss">Perubahan berhasil disimpan.</p>
            </>
          )}
          {serverError && (
            <p className="font-sans text-caption text-clay">{serverError}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
              Menyimpan…
            </>
          ) : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}
