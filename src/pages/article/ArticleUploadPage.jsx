import { useEffect, useRef, useState } from 'react'
import { Upload, X, Plus, UserRound, FileText, AlertCircle, CheckCircle2, Loader2, Sparkles, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { articlesApi, profilesApi, session } from '../../lib/api'
import ArticleFailedToDraft from '../../components/ArticlePage/ArticleFailedToDraft'

const UUID_RE   = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE_MB = 20

function abbrevInstitution(name = '') {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 6)
  return words.filter((w) => w.length > 2).map((w) => w[0].toUpperCase()).join('')
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Contributor chip
// ---------------------------------------------------------------------------
function ContributorChip({ contributor, onRemove }) {
  return (
    <div className="flex items-start gap-2 bg-sand/60 border border-sand rounded-lg pl-3 pr-2 py-2">
      <div className="min-w-0">
        <p className="font-sans text-sm font-medium text-ink leading-snug truncate max-w-[100px]">
          {contributor.full_name.split(' ')[0]}
        </p>
        <p className="font-sans text-[0.6rem] text-ash leading-snug">
          {abbrevInstitution(contributor.institution)}
        </p>
      </div>
      <button type="button" onClick={() => onRemove(contributor.id)}
        className="text-ash/50 hover:text-clay transition-colors duration-[240ms] mt-0.5 flex-shrink-0">
        <X size={13} />
      </button>
    </div>
  )
}

const ROLE_LABEL = {
  MAHASISWA: 'Mahasiswa', AKADEMISI: 'Akademisi',
  PEMUDA_ADAT: 'Pemuda Adat', AKTIVIS: 'Aktivis',
}

// ---------------------------------------------------------------------------
// Contributor lookup — name search primary, UUID fallback
// ---------------------------------------------------------------------------
function UserSearchDropdown({ excluded, onSelect, onClose }) {
  const [mode, setMode]       = useState('name')   // 'name' | 'uuid'
  const inputRef              = useRef(null)
  const debounceRef           = useRef(null)

  // ── Name search state ─────────────────────────────────────────────────
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  // ── UUID fallback state ───────────────────────────────────────────────
  const [uuid, setUuid]       = useState('')
  const [uuidLoading, setUuidLoading] = useState(false)
  const [uuidError, setUuidError]     = useState('')

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e) => { if (!e.target.closest('[data-dropdown]')) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Debounced name search
  useEffect(() => {
    if (mode !== 'name') return
    clearTimeout(debounceRef.current)
    setSearchError('')
    if (query.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const { ok, data } = await articlesApi.searchContributors(query)
      if (ok) setResults((data ?? []).filter(r => !excluded.includes(r.user_id)))
      else setSearchError('Gagal mencari. Coba lagi.')
      setSearching(false)
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query, mode])

  const handleSelectResult = (r) => {
    onSelect({ id: r.user_id, full_name: r.full_name, photo_url: r.photo_url,
               role_category: r.role_category, institution: '' })
    onClose()
  }

  // UUID lookup
  const lookupUUID = async () => {
    let t = uuid.trim()
    if (t.length === 32 && !t.includes('-'))
      t = `${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`
    if (!UUID_RE.test(t)) { setUuidError('Format UUID tidak valid.'); return }
    if (excluded.includes(t)) { setUuidError('Sudah ditambahkan.'); return }
    setUuidLoading(true); setUuidError('')
    try {
      const { ok, status, data } = await profilesApi.public(t)
      if (ok) {
        onSelect({ id: data.user_id ?? t, full_name: data.full_name,
                   photo_url: data.photo_url, institution: data.institution })
        onClose()
      } else if (status === 404) setUuidError('Pengguna tidak ditemukan.')
      else setUuidError('Gagal memverifikasi.')
    } catch { setUuidError('Gangguan koneksi.') }
    finally { setUuidLoading(false) }
  }

  return (
    <div data-dropdown className="absolute z-50 top-full left-0 mt-2 w-80 bg-white rounded-card border border-sand shadow-elevated overflow-hidden">

      {mode === 'name' ? (
        <>
          {/* Name search input */}
          <div className="px-3 py-2.5 border-b border-sand">
            <p className="font-sans text-[0.6rem] uppercase tracking-widest text-ash mb-1.5">
              Cari nama kontributor
            </p>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik nama…"
                className="w-full pl-8 pr-3 py-1.5 font-sans text-sm text-ink placeholder:text-ash/40 outline-none bg-bone border border-sand rounded-lg focus:border-forest transition-colors duration-[200ms]"
              />
              {searching && <Loader2 size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash animate-spin" />}
            </div>
            {searchError && <p className="font-sans text-[0.65rem] text-clay mt-1.5">{searchError}</p>}
          </div>

          {/* Results */}
          <div className="max-h-52 overflow-y-auto">
            {results.length > 0 ? (
              results.map(r => (
                <button
                  key={r.user_id}
                  type="button"
                  onClick={() => handleSelectResult(r)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sand/40 transition-colors duration-[160ms] text-left"
                >
                  {r.photo_url ? (
                    <img src={r.photo_url} alt={r.full_name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                        {r.full_name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-ink leading-snug truncate">{r.full_name}</p>
                    {r.role_category && (
                      <p className="font-sans text-[0.6rem] text-ash leading-snug">
                        {ROLE_LABEL[r.role_category] ?? r.role_category}
                      </p>
                    )}
                  </div>
                  <UserRound size={13} className="text-ash/40 flex-shrink-0" />
                </button>
              ))
            ) : query.length >= 2 && !searching ? (
              <p className="font-sans text-caption text-ash text-center py-4 px-3">
                Tidak ada pengguna dengan nama <strong>"{query}"</strong>.
              </p>
            ) : query.length < 2 ? (
              <p className="font-sans text-caption text-ash text-center py-4">
                Ketik minimal 2 karakter untuk mencari.
              </p>
            ) : null}
          </div>

          {/* UUID fallback */}
          <div className="px-3 py-2.5 border-t border-sand">
            <button type="button" onClick={() => { setMode('uuid'); setQuery('') }}
              className="font-sans text-[0.65rem] text-ash hover:text-forest underline underline-offset-4 transition-colors duration-[200ms]">
              Masukkan User ID (UUID) manual →
            </button>
          </div>
        </>
      ) : (
        <>
          {/* UUID input */}
          <div className="px-3 py-2.5 border-b border-sand">
            <button type="button" onClick={() => { setMode('name'); setUuid(''); setUuidError('') }}
              className="flex items-center gap-1 font-sans text-[0.65rem] text-ash hover:text-forest transition-colors duration-[200ms] mb-2">
              ← Kembali ke pencarian nama
            </button>
            <p className="font-sans text-[0.6rem] uppercase tracking-widest text-ash mb-1.5">User ID (UUID)</p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={uuid}
                onChange={(e) => { setUuid(e.target.value); setUuidError('') }}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), lookupUUID())}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="flex-1 font-mono text-xs text-ink placeholder:text-ash/40 outline-none bg-bone border border-sand rounded-lg px-2.5 py-1.5 focus:border-forest transition-colors duration-[200ms]"
              />
              <button type="button" onClick={lookupUUID} disabled={uuidLoading || !uuid.trim()}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-forest text-white font-sans text-xs font-medium hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-[200ms] flex items-center gap-1.5">
                {uuidLoading ? <Loader2 size={12} className="animate-spin" /> : 'Cek'}
              </button>
            </div>
            {uuidError && <p className="font-sans text-[0.65rem] text-clay mt-1.5">{uuidError}</p>}
          </div>
        </>
      )}

    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ArticleUploadPage() {
  const navigate = useNavigate()

  // ── File ──────────────────────────────────────────────────────────────
  const [file, setFile]           = useState(null)
  const [dragOver, setDragOver]   = useState(false)
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef(null)

  // ── Parse (backend analysis) ──────────────────────────────────────────
  const [parsing, setParsing]       = useState(false)
  const [parsed, setParsed]         = useState(false)   // true after successful analysis
  const [parseError, setParseError] = useState('')
  const [draftId, setDraftId]       = useState(null)    // article ID from analysis step

  // ── Metadata fields ───────────────────────────────────────────────────
  const [title, setTitle]       = useState('')
  const [abstract, setAbstract] = useState('')

  // ── Contributors ──────────────────────────────────────────────────────
  const [contributors, setContributors] = useState([])
  const [showSearch, setShowSearch]     = useState(false)

  // ── Submit ────────────────────────────────────────────────────────────
  const [submitting, setSubmitting]   = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [failedDraftId, setFailedDraftId]     = useState(null)
  const [failedDraftError, setFailedDraftError] = useState('')
  const submitActionRef = useRef('review')

  useEffect(() => {
    if (!session.getAccess()) navigate('/login', { replace: true })
  }, [navigate])

  // ── File handling ─────────────────────────────────────────────────────
  const acceptFile = (f) => {
    if (!ALLOWED_MIME.includes(f.type)) { setFileError('Hanya file PDF atau DOCX yang diterima.'); return }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) { setFileError(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`); return }
    setFile(f); setFileError('')
    // Reset analysis state when a new file is chosen
    setParsed(false); setParseError('')
    setTitle(''); setAbstract('')
    if (draftId) { articlesApi.deleteArticle(draftId).catch(() => {}); setDraftId(null) }
  }

  const removeFile = () => {
    setFile(null); setFileError('')
    setParsed(false); setParseError('')
    setTitle(''); setAbstract('')
    if (draftId) { articlesApi.deleteArticle(draftId).catch(() => {}); setDraftId(null) }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) acceptFile(f) }

  // ── Parse: upload to backend, get parsed fields ───────────────────────
  const handleParse = async () => {
    if (!file || parsing) return
    setParsing(true); setParseError('')

    const fd = new FormData()
    fd.append('content_type', 'ARTIKEL')
    fd.append('file', file)
    contributors.forEach((c) => fd.append('contributor_ids', c.id))

    const { ok, data } = await articlesApi.create(fd)
    if (ok) {
      setDraftId(data.article.id)
      setTitle(data.article.title    ?? '')
      setAbstract(data.article.abstract ?? '')
      setParsed(true)
    } else {
      setParseError(data?.error ?? data?.detail ?? 'Gagal menganalisis dokumen.')
    }
    setParsing(false)
  }

  // ── Final submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || submitting) return
    setSubmitting(true); setFieldErrors({}); setServerError('')

    let articleId = draftId

    if (articleId) {
      // Draft already created by "Analisis" — just update metadata
      const patch = await articlesApi.updateMeta(articleId, {
        title:    title.trim()    || undefined,
        abstract: abstract.trim() || undefined,
      })
      if (!patch.ok) {
        if (patch.status === 400 && patch.data.errors) setFieldErrors(patch.data.errors)
        else setServerError(patch.data?.error ?? 'Gagal menyimpan metadata.')
        setSubmitting(false); return
      }
    } else {
      // No prior analysis — create article now (backend will parse)
      const fd = new FormData()
      fd.append('content_type', 'ARTIKEL')
      fd.append('file', file)
      if (title.trim())    fd.append('title',    title.trim())
      if (abstract.trim()) fd.append('abstract', abstract.trim())
      contributors.forEach((c) => fd.append('contributor_ids', c.id))

      const { ok, status, data } = await articlesApi.create(fd)
      if (!ok) {
        if (status === 400 && data.errors) setFieldErrors(data.errors)
        else setServerError(data?.error ?? data?.detail ?? 'Terjadi kesalahan. Coba lagi.')
        setSubmitting(false); return
      }
      articleId = data.article.id
    }

    if (submitActionRef.current === 'review') {
      const submitRes = await articlesApi.submit(articleId)
      if (!submitRes.ok) {
        setFailedDraftError(submitRes.data?.error || 'Gagal mengajukan. Tersimpan sebagai draf.')
        setFailedDraftId(articleId)
        setSubmitting(false); return
      }
    }

    navigate('/articles/my')
    setSubmitting(false)
  }

  const canSubmit = !!file && !submitting && !parsing

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Artikel</span>
            </div>
            <h1 className="font-serif text-h1 font-semibold text-ink leading-tight">
              Tulis <em className="font-accent italic text-clay">Artikel Baru</em>
            </h1>
            <p className="font-sans text-body text-ash mt-2">
              Unggah PDF atau DOCX, analisis otomatis, lalu periksa hasilnya sebelum mengajukan.
            </p>
          </div>

          {serverError && (
            <div className="flex items-start gap-3 bg-clay/8 border border-clay/20 rounded-lg px-4 py-3 mb-6">
              <AlertCircle size={16} className="text-clay flex-shrink-0 mt-0.5" />
              <p className="font-sans text-caption text-clay leading-relaxed">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── Dokumen ──────────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-sand">
                <div className="flex items-center gap-3 mb-1"><div className="h-px w-6 bg-clay/50" /></div>
                <h2 className="font-serif text-h3 font-semibold text-ink">Dokumen</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">

                {/* Drop zone or file info */}
                {file ? (
                  <div className={`flex items-center gap-4 border rounded-lg px-4 py-3 ${
                    parsed ? 'bg-forest/5 border-forest/20' : 'bg-sand/20 border-sand'
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      parsed ? 'bg-forest/10' : 'bg-sand/60'
                    }`}>
                      {parsed
                        ? <CheckCircle2 size={18} className="text-forest" />
                        : <FileText size={18} className="text-ash" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-ink leading-snug truncate">{file.name}</p>
                      <p className={`font-sans text-caption ${parsed ? 'text-moss' : 'text-ash'}`}>
                        {formatSize(file.size)}{parsed ? ' · Berhasil dianalisis' : ''}
                      </p>
                    </div>
                    <button type="button" onClick={removeFile}
                      className="text-ash/50 hover:text-clay transition-colors duration-[240ms] flex-shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-[240ms] ${
                      dragOver ? 'border-forest bg-forest/5' : 'border-sand hover:border-forest/40 hover:bg-sand/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-sand/60 flex items-center justify-center">
                      <Upload size={20} className={dragOver ? 'text-forest' : 'text-ash'} />
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-medium text-ink">
                        Seret file ke sini atau <span className="text-forest underline underline-offset-2">pilih file</span>
                      </p>
                      <p className="font-sans text-caption text-ash mt-1">PDF atau DOCX, maksimal {MAX_SIZE_MB}MB</p>
                    </div>
                  </div>
                )}

                <input ref={fileInputRef} type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) acceptFile(f) }} />

                {fileError && <p className="font-sans text-caption text-clay">{fileError}</p>}

                {/* Analisis button */}
                {file && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleParse}
                      disabled={parsing || parsed}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-sm font-medium border
                        transition-all duration-[240ms] disabled:cursor-not-allowed ${
                          parsed
                            ? 'bg-moss/10 text-moss border-moss/25 opacity-60'
                            : 'bg-forest/8 text-forest border-forest/25 hover:bg-forest hover:text-bone hover:border-forest disabled:opacity-50'
                        }`}
                    >
                      {parsing
                        ? <><Loader2 size={13} className="animate-spin" />Menganalisis…</>
                        : parsed
                        ? <>Sudah dianalisis</>
                        : <>Analisis Dokumen</>
                      }
                    </button>
                    {parsed && (
                      <button type="button" onClick={() => { setParsed(false); setTitle(''); setAbstract(''); if (draftId) { articlesApi.deleteArticle(draftId).catch(() => {}); setDraftId(null) } }}
                        className="font-sans text-xs text-ash hover:text-clay underline underline-offset-4 transition-colors duration-[240ms]">
                        Analisis ulang
                      </button>
                    )}
                    {!parsed && !parsing && (
                      <span className="font-sans text-caption text-ash/60">atau isi judul &amp; abstrak manual</span>
                    )}
                  </div>
                )}

                {parseError && (
                  <div className="flex items-start gap-2">
                    <AlertCircle size={13} className="text-clay flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-caption text-clay">{parseError}</p>
                  </div>
                )}

              </div>
            </div>

            {/* ── Metadata ──────────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-sand">
                <div className="flex items-center gap-3 mb-1"><div className="h-px w-6 bg-clay/50" /></div>
                <h2 className="font-serif text-h3 font-semibold text-ink">Metadata</h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">Judul</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder={parsed ? '' : 'Akan diisi otomatis setelah analisis, atau isi manual'}
                    maxLength={255}
                    className={`bg-bone border rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder:text-ash/30 outline-none focus:ring-2 transition-all duration-[240ms] ${
                      fieldErrors.title ? 'border-clay focus:border-clay focus:ring-clay/15' : 'border-sand focus:border-forest focus:ring-forest/15'
                    }`} />
                  {fieldErrors.title && <p className="font-sans text-caption text-clay">{fieldErrors.title[0]}</p>}
                </div>

                {/* Abstract */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">Abstrak</label>
                  <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)}
                    placeholder={parsed ? '' : 'Akan diisi otomatis setelah analisis, atau isi manual'}
                    rows={4} maxLength={3000}
                    className={`bg-bone border rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder:text-ash/30 outline-none focus:ring-2 transition-all duration-[240ms] resize-none ${
                      fieldErrors.abstract ? 'border-clay focus:border-clay focus:ring-clay/15' : 'border-sand focus:border-forest focus:ring-forest/15'
                    }`} />
                  {fieldErrors.abstract && <p className="font-sans text-caption text-clay">{fieldErrors.abstract[0]}</p>}
                </div>

                <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">
                  {parsed ? 'Diekstrak otomatis — periksa dan perbaiki jika perlu.' : 'Klik "Analisis Dokumen" untuk mengisi otomatis dari file.'}
                </span>
              </div>
            </div>

            {/* ── Kontributor ───────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle">
              <div className="px-6 pt-5 pb-4 border-b border-sand">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-px w-6 bg-clay/50" />
                  <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">Opsional</span>
                </div>
                <h2 className="font-serif text-h3 font-semibold text-ink">Kontributor</h2>
                <p className="font-sans text-caption text-ash mt-0.5">Tambahkan rekan yang ikut berkontribusi.</p>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-wrap items-start gap-2">
                  {contributors.map((c) => (
                    <ContributorChip key={c.id} contributor={c}
                      onRemove={(id) => setContributors(prev => prev.filter(u => u.id !== id))} />
                  ))}
                  <div className="relative">
                    <button type="button" onClick={() => setShowSearch(v => !v)}
                      className="w-10 h-10 rounded-lg border border-sand bg-bone flex items-center justify-center text-ash hover:text-forest hover:border-forest/40 transition-all duration-[240ms]">
                      <Plus size={16} />
                    </button>
                    {showSearch && (
                      <UserSearchDropdown
                        excluded={contributors.map(c => c.id)}
                        onSelect={(u) => setContributors(prev => [...prev, u])}
                        onClose={() => setShowSearch(false)}
                      />
                    )}
                  </div>
                </div>
                {fieldErrors.contributor_ids && (
                  <p className="font-sans text-caption text-clay mt-2">{fieldErrors.contributor_ids[0]}</p>
                )}
              </div>
            </div>

            {/* ── Submit ───────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <button type="submit" disabled={!canSubmit}
                onClick={() => { submitActionRef.current = 'review' }}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting && submitActionRef.current === 'review'
                  ? <><Loader2 size={14} className="animate-spin" />Mengajukan…</>
                  : <><CheckCircle2 size={14} />Ajukan untuk Ditinjau</>
                }
              </button>

              <button type="submit" disabled={!canSubmit}
                onClick={() => { submitActionRef.current = 'draft' }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-sand bg-white font-sans text-sm font-medium text-ink hover:border-forest/40 hover:text-forest transition-all duration-[240ms] disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting && submitActionRef.current === 'draft'
                  ? <><Loader2 size={14} className="animate-spin" />Menyimpan…</>
                  : <><FileText size={14} />Simpan sebagai Draf</>
                }
              </button>

              <button type="button" onClick={() => navigate(-1)}
                className="w-full py-2 font-sans text-sm text-ash hover:text-ink transition-colors duration-[240ms] text-center">
                Batal
              </button>
            </div>

          </form>
        </div>
      </main>

      <ArticleFailedToDraft isOpen={!!failedDraftId} errorMsg={failedDraftError} draftId={failedDraftId} />
    </div>
  )
}
