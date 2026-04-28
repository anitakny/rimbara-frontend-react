import { useState } from 'react'
import { Bold, Italic, Link, Camera } from 'lucide-react'

const BIO_MAX = 300

const roles = [
  { value: 'mahasiswa',    label: 'Mahasiswa',       desc: 'Peserta program akademik' },
  { value: 'dosen',        label: 'Dosen / Akademisi', desc: 'Pengajar & peneliti' },
  { value: 'pemuda_adat',  label: 'Pemuda Adat',     desc: 'Anggota komunitas adat' },
  { value: 'aktivis',      label: 'Aktivis',          desc: 'Pegiat lingkungan & advokasi' },
]

// Placeholder — pre-filled from /api/users/me/profile/
const initialForm = {
  initials:    'SD',
  name:        'Sari Dewi Putri',
  email:       'sari.d@ugm.ac.id',
  institution: 'Universitas Gadjah Mada',
  role:        'mahasiswa',
  bio:         'Mahasiswa Etnobotani UGM. Fokus pada dokumentasi keanekaragaman hayati wilayah adat Kalimantan. Bergabung dengan program RIMBAHARI sejak 2025 sebagai kontributor aktif.',
}

function FormRow({ label, hint, children }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-8 py-6 border-b border-sand last:border-0">
      <div className="pt-0.5">
        <p className="font-sans text-sm font-medium text-ink">{label}</p>
        {hint && <p className="font-sans text-caption text-ash/70 mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function ProfileEditPage() {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key, val) => {
    setSaved(false)
    setForm((f) => ({ ...f, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: PUT /api/users/me/profile/
    setTimeout(() => { setSaving(false); setSaved(true) }, 1200)
  }

  const charsLeft = BIO_MAX - form.bio.length

  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
      {/* Panel header */}
      <div className="px-8 py-6 border-b border-sand">
        <h2 className="font-serif text-h3 font-semibold text-ink">Informasi Personal</h2>
        <p className="font-sans text-caption text-ash mt-0.5">
          Perbarui foto dan informasi profilmu yang akan tampil secara publik.
        </p>
      </div>

      <div className="px-8 py-2">
        {/* Photo */}
        <FormRow label="Foto Profil" hint="Akan ditampilkan di halaman profilmu.">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
              <span className="font-serif font-semibold text-base text-bone leading-none">
                {form.initials}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-clay
                  hover:text-sienna transition-colors duration-[240ms]"
              >
                Hapus
              </button>
              <span className="text-sand">|</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-forest
                  hover:text-moss transition-colors duration-[240ms]"
              >
                <Camera size={14} />
                Perbarui
              </button>
            </div>
          </div>
        </FormRow>

        {/* Name */}
        <FormRow label="Nama Lengkap">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full bg-white border border-sand rounded-lg px-4 py-2.5 font-sans text-sm text-ink
              placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
              transition-all duration-[240ms]"
          />
        </FormRow>

        {/* Email */}
        <FormRow label="Surel" hint="Perubahan surel membutuhkan verifikasi ulang.">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full bg-sand/20 border border-sand rounded-lg px-4 py-2.5 font-sans text-sm text-ash
              outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
              transition-all duration-[240ms] cursor-not-allowed"
            readOnly
          />
        </FormRow>

        {/* Institution */}
        <FormRow label="Institusi / Komunitas" hint="Universitas, komunitas adat, atau organisasi.">
          <input
            type="text"
            value={form.institution}
            onChange={(e) => update('institution', e.target.value)}
            className="w-full bg-white border border-sand rounded-lg px-4 py-2.5 font-sans text-sm text-ink
              placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
              transition-all duration-[240ms]"
          />
        </FormRow>

        {/* Role */}
        <FormRow label="Peran" hint="Kategori kontribusimu dalam platform.">
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => update('role', r.value)}
                className={`text-left px-4 py-3 rounded-lg border transition-all duration-[240ms]
                  ${form.role === r.value
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
        <FormRow label="Bio" hint="Tulis perkenalan singkat tentang dirimu.">
          <div className="flex flex-col gap-1.5">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 border border-sand border-b-0 rounded-t-lg bg-sand/20">
              {[Bold, Italic, Link].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-1.5 rounded text-ash hover:text-ink hover:bg-sand transition-colors duration-[240ms]"
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
            <textarea
              value={form.bio}
              onChange={(e) => update('bio', e.target.value.slice(0, BIO_MAX))}
              rows={4}
              className="w-full bg-white border border-sand rounded-b-lg px-4 py-3 font-sans text-sm text-ink
                placeholder:text-ash/50 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
                transition-all duration-[240ms] resize-none"
              placeholder="Ceritakan sedikit tentang dirimu dan fokus kontribusimu..."
            />
            <p className={`font-sans text-caption text-right ${charsLeft < 20 ? 'text-clay' : 'text-ash/50'}`}>
              {charsLeft} karakter tersisa
            </p>
          </div>
        </FormRow>
      </div>

      {/* Footer — save */}
      <div className="px-8 py-5 border-t border-sand bg-sand/10 flex items-center justify-between">
        {saved && (
          <p className="font-sans text-caption text-moss">Perubahan berhasil disimpan.</p>
        )}
        <div className="ml-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
    </div>
  )
}
