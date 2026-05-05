import { useEffect, useRef, useState } from 'react'
import { Upload, X, Plus, UserRound, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { articlesApi, profilesApi, session } from '../../lib/api'
import ArticleFailedToDraft from '../../components/ArticlePage/ArticleFailedToDraft'

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import * as mammothNs from 'mammoth'

// Vite bundles the worker from node_modules — no CDN, no version mismatch
GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// mammoth may expose API on .default (ESM interop) or directly (CJS)
const mammoth = mammothNs.default ?? mammothNs

// UUID validation regex
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

// Extract title + abstract from raw text of Indonesian/English academic PDFs
function extractMeta(rawText) {
  const lines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  // ── Title ────────────────────────────────────────────────────────────────
  // Collect the opening lines of the document as the title.
  // Only skip clearly non-title noise — avoid over-filtering on Indonesian
  // Title Case words (e.g. "Studi Kasus") that look like author names.
  const titleLines = []
  for (const line of lines.slice(0, 25)) {
    // Skip pure noise: page numbers, lone digits/punctuation
    if (/^[\d\s\W]{1,6}$/.test(line)) continue
    // Stop at email or URL — reliably marks the author/affiliation block
    if (/@/.test(line)) break
    if (/https?:\/\//.test(line)) break
    titleLines.push(line)
    // Stop once we have enough text for a title (200 chars or 5 lines)
    if (titleLines.join(' ').length >= 200) break
    if (titleLines.length >= 5) break
  }
  const title = titleLines.join(' ').replace(/\s+/g, ' ').trim().slice(0, 255)

  // ── Abstract ───────────────────────────────────────────────────────────────
  const JOURNAL_HDR_RE = /vol\.|no\.|issn|doi|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|\|\s*\d+/i
  const STOP_RE        = /^(kata\s*kunci|keywords?|pendahuluan|introduction)\b/i
  const CAPS_HDR_RE    = /^[A-Z\s\-:]{4,40}$/

  let abstract = ''

  // Strategy 1: standalone "Abstrak" / "Abstract" heading line
  const abstractHeadingRE = /^(abstrak|abstract):?\s*$/i
  const headingIdx = lines.findIndex((l) => abstractHeadingRE.test(l))

  if (headingIdx !== -1) {
    const body = []
    for (let i = headingIdx + 1; i < lines.length && body.length < 10; i++) {
      const l = lines[i]
      if (STOP_RE.test(l))                        break
      if (CAPS_HDR_RE.test(l) && l.length < 50)  break
      if (JOURNAL_HDR_RE.test(l))                 continue
      if (l.length > 15) body.push(l)
    }
    abstract = body.join(' ').replace(/\s+/g, ' ').trim().slice(0, 800)
  }

  // Strategy 2: inline prefix — "Abstract. This paper..." / "Abstrak: ..."
  if (!abstract) {
    const inlineRE = /^(abstrak|abstract)[.:]\s*/i
    const inlineLine = lines.find((l) => inlineRE.test(l))
    if (inlineLine) {
      abstract = inlineLine.replace(inlineRE, '').trim().slice(0, 800)
    }
  }

  return { title, abstract }
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise

  let fullText = ''
  const pages = Math.min(pdf.numPages, 4)
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group items by y-coordinate to reconstruct real text lines.
    // PDF coordinates are bottom-up, so higher y = higher on the page.
    // transform[5] is the y-position; transform[4] is the x-position.
    const lineMap = new Map()
    for (const item of content.items) {
      if (!item.str?.trim()) continue
      // Round y to nearest 2pt so items on the same visual line cluster together
      const y = Math.round(item.transform[5] / 2) * 2
      if (!lineMap.has(y)) lineMap.set(y, [])
      lineMap.get(y).push({ x: item.transform[4], str: item.str })
    }

    // Sort lines top-to-bottom (descending y), then sort items left-to-right within each line
    const sortedLines = [...lineMap.entries()]
      .sort(([a], [b]) => b - a)
      .map(([, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map((it) => it.str)
          .join('')
          .trim()
      )
      .filter((l) => l.length > 0)

    fullText += sortedLines.join('\n') + '\n\n'
  }

  return extractMeta(fullText)
}

async function parseDOCX(file) {
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
// Contributor lookup — searches by User UUID via GET /api/profiles/{id}/
// ---------------------------------------------------------------------------
function UserSearchDropdown({ excluded, onSelect, onClose }) {
  const [uuid, setUuid]       = useState('')
  const [found, setFound]     = useState(null)   // profile object from API
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown]')) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const lookup = async () => {
    const trimmed = uuid.trim()
    if (!UUID_RE.test(trimmed)) {
      setError('Format UUID tidak valid.')
      setFound(null)
      return
    }
    if (excluded.includes(trimmed)) {
      setError('Pengguna ini sudah ditambahkan.')
      setFound(null)
      return
    }
    setError('')
    // Karena endpoint public profile backend tidak tersedia/mengalami error,
    // kita bypass lookup nama dan langsung izinkan UUID ditambahkan.
    // Validasi final apakah user benar-benar ada akan dilakukan oleh backend saat submit artikel.
    setFound({ 
      id: trimmed, 
      full_name: 'User Terverifikasi', 
      institution: `ID: ${trimmed.split('-')[0]}...` 
    })
  }

  const confirm = () => {
    if (found) { onSelect(found); onClose() }
  }

  return (
    <div
      data-dropdown
      className="absolute z-50 top-full left-0 mt-2 w-80 bg-white rounded-card border border-sand shadow-elevated overflow-hidden"
    >
      {/* UUID input row */}
      <div className="px-3 py-2.5 border-b border-sand">
        <p className="font-sans text-[0.6rem] uppercase tracking-widest text-ash mb-1.5">
          Masukkan User ID kontributor
        </p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={uuid}
            onChange={(e) => { setUuid(e.target.value); setError(''); setFound(null) }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), lookup())}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="flex-1 font-mono text-xs text-ink placeholder:text-ash/40 outline-none bg-bone
              border border-sand rounded-lg px-2.5 py-1.5 focus:border-forest transition-colors duration-[200ms]"
          />
          <button
            type="button"
            onClick={lookup}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-forest text-white font-sans text-xs font-medium
              hover:bg-forest/90 transition-all duration-[200ms]"
          >
            Cek
          </button>
        </div>
        {error && (
          <p className="font-sans text-[0.65rem] text-clay mt-1.5">{error}</p>
        )}
      </div>

      {/* Result preview */}
      {found && (
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-3 bg-forest/5 border border-forest/15 rounded-lg px-3 py-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
              <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                ID
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-medium text-ink leading-snug truncate">ID Valid</p>
              <p className="font-sans text-caption text-ash leading-snug truncate">Akan diverifikasi saat disubmit</p>
            </div>
            <UserRound size={14} className="text-forest flex-shrink-0" />
          </div>
          <button
            type="button"
            onClick={confirm}
            className="w-full py-2 rounded-lg bg-forest text-white font-sans text-sm font-medium
              hover:bg-forest/90 transition-colors duration-[200ms]"
          >
            Tambahkan
          </button>
        </div>
      )}

      {!found && !error && (
        <p className="font-sans text-caption text-ash text-center py-4">
          Tempel User ID lalu tekan Cek.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Parsing progress animation
// ---------------------------------------------------------------------------
const PARSE_STEPS = [
  'Membaca struktur dokumen…',
  'Mengekstrak judul dan abstrak…',
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
  const [parseError, setParseError]   = useState('')
  
  const [failedDraftId, setFailedDraftId] = useState(null)
  const [failedDraftError, setFailedDraftError] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!session.getAccess()) navigate('/login', { replace: true })
  }, [navigate])

  // ── File acceptance + real client-side parse ─────────────────────────
  const acceptFile = async (f) => {
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
    setParseError('')
    setParsing(true)
    setTitle('')
    setAbstract('')

    try {
      const isPDF = f.type === 'application/pdf'
      const { title: t, abstract: a } = isPDF ? await parsePDF(f) : await parseDOCX(f)
      setTitle(t)
      setAbstract(a)
    } catch (err) {
      setParseError(`Parsing error: ${err?.message ?? String(err)}`)
      console.error('Client-side parse error:', err)
    } finally {
      setParsing(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setParsing(false)
    setParseError('')
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
  // Tracks which button triggered the submit — 'draft' or 'review'
  const submitActionRef = useRef('draft')

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
      if (submitActionRef.current === 'review') {
        const submitRes = await articlesApi.submit(data.article.id)
        if (!submitRes.ok) {
          setFailedDraftError(submitRes.data?.error || submitRes.data?.detail || 'Gagal mengajukan artikel. Tersimpan sebagai draf.')
          setFailedDraftId(data.article.id)
          setSubmitting(false)
          return
        }
      }
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
                </div>
                <h2 className="font-serif text-h3 font-semibold text-ink">Dokumen</h2>
              </div>

              <div className="p-6">
                {parsing ? (
                  /* Parsing animation */
                  <ParsingOverlay filename={file?.name ?? ''} />
                ) : file ? (
                  /* File ready */
                  <div className={`flex items-center gap-4 border rounded-lg px-4 py-3 ${
                    parseError
                      ? 'bg-clay/5 border-clay/25'
                      : 'bg-forest/5 border-forest/20'
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      parseError ? 'bg-clay/10' : 'bg-forest/10'
                    }`}>
                      {parseError
                        ? <AlertCircle size={18} className="text-clay" />
                        : <CheckCircle2 size={18} className="text-forest" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-ink leading-snug truncate">{file.name}</p>
                      <p className={`font-sans text-caption ${
                        parseError ? 'text-clay' : 'text-moss'
                      }`}>
                        {parseError
                          ? 'Gagal menganalisis dokumen — judul & abstrak perlu diisi manual'
                          : `${formatSize(file.size)} · Dokumen berhasil dianalisis`
                        }
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
                      placeholder="..."
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
                      placeholder="..."
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
                  <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">Periksa kembali judul dan abstrak, jika tidak sesuai silahkan isi secara manual.</span>
                </div>
              </div>

            {/* ── Contributors ─────────────────────────────────── */}
            {/* overflow-visible so the search dropdown is not clipped by the card boundary */}
            <div className="bg-white rounded-card border border-sand shadow-subtle">
                <div className="px-6 pt-5 pb-4 border-b border-sand rounded-t-card">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-clay/50" />
                    <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ash/60">Opsional</span>
                  </div>
                  <h2 className="font-serif text-h3 font-semibold text-ink">Kontributor</h2>
                  <p className="font-sans text-caption text-ash mt-0.5">
                    Tambahkan rekan yang ikut berkontribusi dalam artikel ini.
                  </p>
                </div>

                <div className="px-6 py-5 rounded-b-card">
                  <div className="flex flex-wrap items-start gap-2">
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
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="font-sans text-sm text-ash hover:text-ink transition-colors duration-[240ms] flex-shrink-0"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                {/* Save as Draft */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  onClick={() => { submitActionRef.current = 'draft' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-sand bg-white
                    font-sans text-sm font-medium text-ink hover:border-forest/40 hover:text-forest
                    transition-all duration-[240ms] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting && submitActionRef.current === 'draft' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menyimpan…
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      Simpan sebagai Draf
                    </>
                  )}
                </button>

                {/* Submit for review */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  onClick={() => { submitActionRef.current = 'review' }}
                  className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting && submitActionRef.current === 'review' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Mengajukan…
                    </>
                  ) : parsing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menganalisis…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      Ajukan untuk Ditinjau
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>

      <ArticleFailedToDraft 
        isOpen={!!failedDraftId} 
        errorMsg={failedDraftError} 
        draftId={failedDraftId} 
      />
    </div>
  )
}
