import { useEffect, useRef, useState } from 'react'
import { Upload, X, Plus, Search, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { articlesApi, session } from '../../lib/api'

// ---------------------------------------------------------------------------
// Mock user list — replace with /api/users/search/ when backend provides it
// ---------------------------------------------------------------------------
const MOCK_USERS = [
  { id: 'a1b2c3d4-0000-0000-0000-000000000001', full_name: 'Ahmad Fauzi',    institution: 'Universitas Indonesia' },
  { id: 'a1b2c3d4-0000-0000-0000-000000000002', full_name: 'Winda Lestari',  institution: 'Komunitas Dayak Ngaju' },
  { id: 'a1b2c3d4-0000-0000-0000-000000000003', full_name: 'Budi Santoso',   institution: 'IPB University' },
  { id: 'a1b2c3d4-0000-0000-0000-000000000004', full_name: 'Rina Handayani', institution: 'Universitas Gadjah Mada' },
  { id: 'a1b2c3d4-0000-0000-0000-000000000005', full_name: 'Yazid Maulana',  institution: 'Politeknik Negeri Jakarta' },
]

const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE_MB = 20

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// Extract title + abstract from raw text
function extractMeta(rawText) {
  const paragraphs = rawText
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 8)

  // Title: first paragraph that's reasonably short (< 250 chars)
  const titlePara = paragraphs.find((p) => p.length < 250) ?? paragraphs[0] ?? ''

  // Abstract: look for explicit "Abstract" / "Abstrak" keyword first
  const abstractKeyword = /^(abstract|abstrak)[:\s]/i
  const abstractIdx = paragraphs.findIndex((p) => abstractKeyword.test(p))

  let abstract = ''
  if (abstractIdx !== -1) {
    // If paragraph IS the "Abstract: ..." line, strip the keyword prefix
    const candidate = paragraphs[abstractIdx].replace(abstractKeyword, '').trim()
    abstract = candidate.length > 20
      ? candidate
      : (paragraphs[abstractIdx + 1] ?? '')
  } else {
    // Fallback: take the 2nd–4th paragraphs as abstract body
    abstract = paragraphs
      .slice(1, 5)
      .filter((p) => p !== titlePara)
      .join(' ')
      .slice(0, 800)
  }

  return {
    title: titlePara.slice(0, 255),
    abstract: abstract.trim(),
  }
}

// Parse PDF — dynamic import so pdfjs-dist is only loaded when needed
async function parsePDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  const workerUrl = await import('pdfjs-dist/build/pdf.worker?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''
  const pages = Math.min(pdf.numPages, 4)
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item) => item.str).join(' ') + '\n\n'
  }

  return extractMeta(fullText)
}

// Parse DOCX — dynamic import so mammoth is only loaded when needed
async function parseDOCX(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return extractMeta(result.value)
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
      <button
        type="button"
        onClick={() => onRemove(contributor.id)}
        className="text-ash/50 hover:text-clay transition-colors duration-[240ms] mt-0.5 flex-shrink-0"
        aria-label={`Hapus ${contributor.full_name}`}
      >
        <X size={13} />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// User search dropdown
// ---------------------------------------------------------------------------
function UserSearchDropdown({ excluded, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown]')) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const results = MOCK_USERS.filter(
    (u) =>
      !excluded.includes(u.id) &&
      (u.full_name.toLowerCase().includes(query.toLowerCase()) ||
        u.institution.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <div
      data-dropdown
      className="absolute z-50 top-full left-0 mt-2 w-72 bg-white rounded-card border border-sand shadow-elevated overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-sand">
        <Search size={13} className="text-ash flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau institusi…"
          className="flex-1 font-sans text-sm text-ink placeholder:text-ash/50 outline-none bg-transparent"
        />
      </div>
      <div className="max-h-52 overflow-y-auto">
        {results.length === 0 ? (
          <p className="font-sans text-caption text-ash text-center py-6">Tidak ada hasil.</p>
        ) : (
          results.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => { onSelect(u); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sand/40 transition-colors duration-[240ms] text-left"
            >
              <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                  {u.full_name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-ink leading-snug truncate">{u.full_name}</p>
                <p className="font-sans text-caption text-ash leading-snug truncate">{u.institution}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Parsing progress animation
// ---------------------------------------------------------------------------
const PARSE_STEPS = [
  'Membaca struktur dokumen…',
  'Mengekstrak teks dan metadata…',
  'Menyiapkan formulir…',
]

function ParsingOverlay({ filename }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500)
    const t2 = setTimeout(() => setStep(2), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-10">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-sand" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-t-forest border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText size={16} className="text-forest" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-sans text-sm font-medium text-ink mb-1">{PARSE_STEPS[step]}</p>
        <p className="font-sans text-caption text-ash truncate max-w-[240px]">{filename}</p>
      </div>
      {/* Progress bar */}
      <div className="w-48 h-1 bg-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-forest rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / PARSE_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ArticleUploadPage() {
  const navigate = useNavigate()

  const [file, setFile]         = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [parsing, setParsing]   = useState(false)   // true while "parsing" animation plays

  const [title, setTitle]       = useState('')
  const [abstract, setAbstract] = useState('')
  const [contributors, setContributors] = useState([])
  const [showSearch, setShowSearch]     = useState(false)

  const [submitting, setSubmitting]   = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!session.getAccess()) navigate('/login', { replace: true })
  }, [navigate])

  // ── File acceptance + simulated parse ────────────────────────────────
  const acceptFile = (f) => {
    if (!ALLOWED_MIME.includes(f.type)) {
      setFieldErrors((e) => ({ ...e, file: 'Hanya file PDF atau DOCX yang diterima.' }))
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFieldErrors((e) => ({ ...e, file: `Ukuran file maksimal ${MAX_SIZE_MB}MB.` }))
      return
    }

    setFile(f)
    setFieldErrors((e) => ({ ...e, file: undefined }))
    setParsing(true)

    // Parsing animation only — actual title/abstract extraction happens on the backend at submit
    setTimeout(() => setParsing(false), 1800)
  }

  const removeFile = () => {
    setFile(null)
    setParsing(false)
    setTitle('')
    setAbstract('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }

  // ── Contributors ──────────────────────────────────────────────────────
  const addContributor  = (user) => setContributors((c) => [...c, user])
  const dropContributor = (id)   => setContributors((c) => c.filter((u) => u.id !== id))

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || parsing) return

    setSubmitting(true)
    setFieldErrors({})
    setServerError('')

    const fd = new FormData()
    fd.append('content_type', 'ARTIKEL')
    fd.append('file', file)
    if (title.trim())    fd.append('title', title.trim())
    if (abstract.trim()) fd.append('abstract', abstract.trim())
    contributors.forEach((c) => fd.append('contributor_ids', c.id))

    const { ok, status, data } = await articlesApi.create(fd)

    if (ok) {
      navigate('/articles/my')
    } else if (status === 400 && data.errors) {
      setFieldErrors(data.errors)
    } else {
      setServerError(data.error || data.detail || 'Terjadi kesalahan. Coba lagi.')
    }

    setSubmitting(false)
  }

  const canSubmit = file && !parsing && !submitting

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 bg-clay/50" />
              <span className="tag">Artikel</span>
            </div>
            <h1 className="font-serif text-h1 font-semibold text-ink leading-tight">
              Tulis{' '}
              <em className="font-accent italic text-clay">Artikel Baru</em>
            </h1>
            <p className="font-sans text-body text-ash mt-2">
              Unggah dokumen PDF atau DOCX. Judul dan abstrak akan otomatis diambil dari file.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-3 bg-clay/8 border border-clay/20 rounded-lg px-4 py-3 mb-6">
              <AlertCircle size={16} className="text-clay flex-shrink-0 mt-0.5" />
              <p className="font-sans text-caption text-clay leading-relaxed">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── File upload ──────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-sand">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-px w-6 bg-clay/50" />
                  <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">Wajib</span>
                </div>
                <h2 className="font-serif text-h3 font-semibold text-ink">Dokumen</h2>
              </div>

              <div className="p-6">
                {parsing ? (
                  /* Parsing animation */
                  <ParsingOverlay filename={file?.name ?? ''} />
                ) : file ? (
                  /* File ready */
                  <div className="flex items-center gap-4 bg-forest/5 border border-forest/20 rounded-lg px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} className="text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-ink leading-snug truncate">{file.name}</p>
                      <p className="font-sans text-caption text-moss">
                        {formatSize(file.size)} · Dokumen berhasil dianalisis
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-ash/50 hover:text-clay transition-colors duration-[240ms] flex-shrink-0"
                      aria-label="Hapus file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-lg border-2 border-dashed cursor-pointer
                      transition-all duration-[240ms] ${
                        dragOver
                          ? 'border-forest bg-forest/5'
                          : 'border-sand hover:border-forest/40 hover:bg-sand/20'
                      }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-sand/60 flex items-center justify-center">
                      <Upload size={20} className={dragOver ? 'text-forest' : 'text-ash'} />
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-medium text-ink">
                        Seret file ke sini atau{' '}
                        <span className="text-forest underline underline-offset-2">pilih file</span>
                      </p>
                      <p className="font-sans text-caption text-ash mt-1">
                        PDF atau DOCX, maksimal {MAX_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) acceptFile(f) }}
                />

                {fieldErrors.file && (
                  <p className="font-sans text-caption text-clay mt-2">{fieldErrors.file}</p>
                )}
              </div>
            </div>

            {/* ── Metadata ─────────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-sand">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-clay/50" />
                    <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">
                      Opsional — otomatis dari file
                    </span>
                  </div>
                  <h2 className="font-serif text-h3 font-semibold text-ink">Metadata</h2>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Diambil otomatis dari dokumen…"
                      maxLength={255}
                      className={`bg-bone border rounded-lg px-4 py-3 font-sans text-sm text-ink
                        placeholder:text-ash/40 outline-none focus:ring-2 transition-all duration-[240ms] ${
                          fieldErrors.title
                            ? 'border-clay focus:border-clay focus:ring-clay/15'
                            : 'border-sand focus:border-forest focus:ring-forest/15'
                        }`}
                    />
                    {fieldErrors.title && (
                      <p className="font-sans text-caption text-clay">{fieldErrors.title[0]}</p>
                    )}
                  </div>

                  {/* Abstract */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-caption uppercase tracking-widest text-ash font-medium">
                      Abstrak
                    </label>
                    <textarea
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      placeholder="Diambil otomatis dari dokumen…"
                      rows={4}
                      className={`bg-bone border rounded-lg px-4 py-3 font-sans text-sm text-ink
                        placeholder:text-ash/40 outline-none focus:ring-2 transition-all duration-[240ms] resize-none ${
                          fieldErrors.abstract
                            ? 'border-clay focus:border-clay focus:ring-clay/15'
                            : 'border-sand focus:border-forest focus:ring-forest/15'
                        }`}
                    />
                    {fieldErrors.abstract && (
                      <p className="font-sans text-caption text-clay">{fieldErrors.abstract[0]}</p>
                    )}
                  </div>
                </div>
              </div>

            {/* ── Contributors ─────────────────────────────────── */}
            <div className="bg-white rounded-card border border-sand shadow-subtle overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-sand">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-clay/50" />
                    <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">Opsional</span>
                  </div>
                  <h2 className="font-serif text-h3 font-semibold text-ink">Kontributor</h2>
                  <p className="font-sans text-caption text-ash mt-0.5">
                    Tambahkan rekan yang ikut berkontribusi dalam artikel ini.
                  </p>
                </div>

                <div className="px-6 py-5">
                  <div className="flex flex-wrap items-start gap-2 relative">
                    {contributors.map((c) => (
                      <ContributorChip key={c.id} contributor={c} onRemove={dropContributor} />
                    ))}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSearch((v) => !v)}
                        className="w-10 h-10 rounded-lg border border-sand bg-bone flex items-center justify-center
                          text-ash hover:text-forest hover:border-forest/40 transition-all duration-[240ms]"
                        aria-label="Tambah kontributor"
                      >
                        <Plus size={16} />
                      </button>
                      {showSearch && (
                        <UserSearchDropdown
                          excluded={contributors.map((c) => c.id)}
                          onSelect={addContributor}
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
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="font-sans text-sm text-ash hover:text-ink transition-colors duration-[240ms]"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Mengunggah…
                  </>
                ) : parsing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Menganalisis…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Simpan sebagai Draf
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}
