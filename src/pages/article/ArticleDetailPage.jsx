import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, AlertCircle, CheckCircle2, XCircle, FileText, Download, Edit3, Eye, EyeOff, ExternalLink } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { articlesApi, session } from '../../lib/api'
import ArticleComment from '../../components/ArticlePage/ArticleComment'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const STATUS = {
  DRAFT:     { label: 'Draf',           chip: 'bg-sand text-ash border-sand',                 icon: FileText },
  IN_REVIEW: { label: 'Direview',       chip: 'bg-forest/10 text-forest border-forest/20',    icon: Clock },
  REVISION:  { label: 'Perlu Revisi',   chip: 'bg-clay/10 text-clay border-clay/20',          icon: AlertCircle },
  PUBLISHED: { label: 'Diterbitkan',    chip: 'bg-moss/10 text-moss border-moss/20',          icon: CheckCircle2 },
  REJECTED:  { label: 'Ditolak',        chip: 'bg-sienna/10 text-sienna border-sienna/20',    icon: XCircle },
}

const TYPE_LABEL = {
  ARTIKEL: 'Artikel', OPINION: 'Opini', VIGNETTE: 'Vignette', CERITA: 'Cerita',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 animate-pulse flex flex-col gap-6">
          <div className="h-6 w-24 bg-sand rounded mb-4" />
          <div className="h-10 bg-sand rounded w-3/4" />
          <div className="h-4 bg-sand/60 rounded w-1/4" />
          <div className="h-64 bg-sand/40 rounded-card mt-6" />
        </div>
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [showViewer, setShowViewer] = useState(false)
  const viewFiredRef          = useRef(false)   // guard against double-fire in React StrictMode

  useEffect(() => {
    if (!session.getAccess()) {
      navigate('/login', { replace: true })
      return
    }
    viewFiredRef.current = false   // reset on article change

    articlesApi.detail(id).then(({ ok, data, status }) => {
      if (ok) {
        setArticle(data)
        if (data.status === 'PUBLISHED' && !viewFiredRef.current) {
          viewFiredRef.current = true
          articlesApi.view(id).then(({ ok: vOk, data: vData }) => {
            if (vOk) setArticle(prev => prev ? { ...prev, views_count: vData.views_count } : prev)
          }).catch(() => {})
        }
      } else if (status === 404) {
        setError('Artikel tidak ditemukan.')
      } else {
        setError('Gagal memuat detail artikel.')
      }
      setLoading(false)
    }).catch(() => {
      setError('Terjadi kesalahan jaringan.')
      setLoading(false)
    })
  }, [id, navigate])

  if (loading) return <PageSkeleton />

  if (error || !article) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-content mx-auto px-6 py-20 text-center">
            <AlertCircle size={48} className="text-clay/50 mx-auto mb-4" />
            <h1 className="font-serif text-h2 font-semibold text-ink mb-2">Oops!</h1>
            <p className="font-sans text-body text-ash mb-6">{error || 'Artikel tidak tersedia.'}</p>
            <button onClick={() => navigate(-1)} className="btn-primary inline-flex">Kembali</button>
          </div>
        </main>
      </div>
    )
  }

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      window.open(url, '_blank')
    }
  }

  const user = session.getUser()
  const isReviewer = user?.role === 'ADMIN' || user?.role === 'REVIEWER' || user?.is_staff || user?.is_superuser

  const cfg = STATUS[article.status] ?? STATUS.DRAFT
  const StatusIcon = cfg.icon

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
          
          {/* ── Back Navigation ── */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ash hover:text-ink transition-colors mb-6 text-sm">
            <ArrowLeft size={16} /> Kembali
          </button>

          {/* ── Header Section ── */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`tag flex items-center gap-1.5 py-1 px-3 border ${cfg.chip}`}>
                <StatusIcon size={14} />
                {cfg.label}
              </span>
              {article.content_type && (
                <span className="font-sans text-[0.65rem] font-medium tracking-widest uppercase text-ash/80 bg-sand/30 px-3 py-1 rounded-full border border-sand/50">
                  {TYPE_LABEL[article.content_type] ?? article.content_type}
                </span>
              )}
            </div>

            <h1 className="font-serif text-h1 md:text-display font-semibold text-ink leading-tight mb-4">
              {article.title || 'Tanpa Judul'}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-sm text-ash border-t border-b border-sand py-4 mb-2">
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] uppercase tracking-widest text-ash/60 font-medium">Penulis Utama</span>
                <span className="text-ink font-medium">{article.author?.full_name || '—'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] uppercase tracking-widest text-ash/60 font-medium">Diperbarui</span>
                <span>{formatDate(article.updated_at || article.created_at)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6rem] uppercase tracking-widest text-ash/60 font-medium">Kontributor</span>
                <span>{article.contributor_count || 0} orang</span>
              </div>
            </div>
            
            {article.is_editable && (
              <div className="mt-4">
                <Link to={`/articles/${article.id}/edit`} className="inline-flex items-center gap-2 font-sans text-sm font-medium text-forest hover:text-clay transition-colors">
                  <Edit3 size={15} /> Edit Artikel
                </Link>
              </div>
            )}
          </header>

          {/* ── Reviewer Note ── */}
          {article.reviewer_note && (
            <div className={`mb-8 p-5 rounded-card border ${article.status === 'REJECTED' ? 'bg-sienna/5 border-sienna/20' : 'bg-clay/5 border-clay/20'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className={`mt-0.5 flex-shrink-0 ${article.status === 'REJECTED' ? 'text-sienna' : 'text-clay'}`} />
                <div>
                  <h3 className={`font-serif text-body font-semibold mb-1 ${article.status === 'REJECTED' ? 'text-sienna' : 'text-clay'}`}>
                    Catatan Editor
                  </h3>
                  <p className="font-sans text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">
                    {article.reviewer_note}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Abstract ── */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-clay/50" />
              <h2 className="font-serif text-h3 font-semibold text-ink">Abstrak</h2>
            </div>
            {article.abstract ? (
              <p className="font-sans text-body text-ink/90 leading-relaxed whitespace-pre-wrap bg-white rounded-card border border-sand p-6 shadow-subtle text-justify">
                {article.abstract}
              </p>
            ) : (
              <p className="font-sans text-body text-ash italic">Tidak ada abstrak.</p>
            )}
          </section>

          {/* ── Contributors List ── */}
          {article.contributors && article.contributors.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-6 bg-clay/50" />
                <h2 className="font-serif text-h3 font-semibold text-ink">Tim Penulis & Kontributor</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-sand rounded-lg p-4 flex items-center gap-3 shadow-subtle">
                   <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 text-forest font-serif font-semibold text-sm">
                     {article.author?.full_name?.charAt(0).toUpperCase() || 'A'}
                   </div>
                   <div className="min-w-0">
                     <p className="font-sans text-sm font-medium text-ink truncate">{article.author?.full_name}</p>
                     <p className="font-sans text-[0.65rem] text-forest/70 uppercase tracking-widest mt-0.5">Penulis Utama</p>
                   </div>
                </div>
                {article.contributors.map(c => (
                  <div key={c.id} className="bg-sand/20 border border-sand rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ash/10 flex items-center justify-center flex-shrink-0 text-ash font-serif font-semibold text-sm">
                      {c.user?.full_name?.charAt(0).toUpperCase() || 'K'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-ink truncate">{c.user?.full_name || 'Kontributor'}</p>
                      <p className="font-sans text-[0.65rem] text-ash uppercase tracking-widest mt-0.5">
                        {c.role_in_article || 'Kolaborator'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Document File ── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-clay/50" />
              <h2 className="font-serif text-h3 font-semibold text-ink">Dokumen</h2>
            </div>

            {!article.pdf_url && !article.original_file_url ? (
              <div className="bg-sand/20 border border-sand rounded-card p-6 flex flex-col items-center justify-center text-center">
                <FileText size={24} className="text-ash/40 mb-3" />
                <p className="font-sans text-sm font-medium text-ink mb-1">Dokumen sedang diproses</p>
                <p className="font-sans text-caption text-ash">Akan tersedia setelah artikel diterbitkan.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* PDF Viewer Toggle Area */}
                {(article.pdf_url || (article.original_file_url && article.original_file_type === 'PDF')) && (
                  <div className="flex flex-col overflow-hidden bg-white border border-sand rounded-card shadow-subtle">
                    {/* Header: Controls */}
                    <div className="px-5 py-4 border-b border-sand flex items-center justify-between bg-bone/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
                          <FileText size={16} className="text-forest" />
                        </div>
                        <div>
                          <p className="font-sans text-sm font-medium text-ink leading-none">Dokumen Artikel</p>
                          <p className="font-sans text-[0.6rem] text-ash uppercase tracking-widest mt-1">Versi PDF</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowViewer(!showViewer)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-all duration-[240ms]
                            ${showViewer 
                              ? 'bg-forest text-bone border border-forest' 
                              : 'bg-white text-forest border border-sand hover:border-forest/40'}`}
                        >
                          {showViewer ? <><EyeOff size={14} /> Tutup</> : <><Eye size={14} /> Baca Sekarang</>}
                        </button>
                        
                        <button
                          onClick={() => handleDownload(article.pdf_url || article.original_file_url, `${article.title || 'dokumen'}.pdf`)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sand/30 text-ash border border-sand hover:text-ink hover:border-forest/40 transition-all duration-[240ms] font-sans text-xs font-medium"
                        >
                          <Download size={14} /> Unduh
                        </button>
                      </div>
                    </div>

                    {/* Content: Iframe Viewer */}
                    {showViewer && (
                      <div className="relative aspect-[4/5] sm:aspect-[4/5.5] w-full bg-sand/10 animate-in fade-in slide-in-from-top-2 duration-500">
                        <iframe
                          src={`${article.pdf_url || article.original_file_url}#toolbar=0`}
                          className="w-full h-full border-none"
                          title="PDF Viewer"
                        />
                        <div className="absolute bottom-4 right-4">
                          <a 
                            href={article.pdf_url || article.original_file_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-ink/80 backdrop-blur-md text-bone rounded-full shadow-lg hover:bg-ink transition-all text-xs font-medium"
                          >
                            <ExternalLink size={14} /> Buka di Tab Baru
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Original file — only for draft/review stages and limited to reviewers/authors. Never shown once published. */}
                {article.original_file_url && article.status !== 'PUBLISHED' && (isReviewer || article.is_editable) && (
                  <button
                    onClick={() => handleDownload(article.original_file_url, `Original_${article.title || 'dokumen'}.${article.original_file_type?.toLowerCase() || 'docx'}`)}
                    className="flex items-center justify-between gap-4 bg-white border border-sand rounded-card px-5 py-3.5 hover:border-forest/40 hover:shadow-subtle transition-all duration-[240ms] group w-full text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-sand/60 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-ash" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-ink group-hover:text-forest transition-colors">
                          Unduh {article.original_file_type || 'File'} Asli
                        </p>
                        <p className="font-sans text-[0.65rem] text-ash uppercase tracking-widest mt-0.5">
                          {article.original_file_type || 'FILE'} · Dokumen internal (Hanya Reviewer/Penulis)
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-sand/50 flex items-center justify-center text-ash group-hover:bg-forest/10 group-hover:text-forest transition-colors flex-shrink-0">
                      <Download size={14} />
                    </div>
                  </button>
                )}
              </div>
            )}
          </section>

          {/* ── Comments (published articles only) — self-contained component ── */}
          {article.status === 'PUBLISHED' && (
            <ArticleComment articleId={id} />
          )}

        </div>
      </main>
    </div>
  )
}
