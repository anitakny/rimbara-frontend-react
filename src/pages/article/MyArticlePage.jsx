import { useEffect, useState } from 'react'
import {
  PenLine, FileText, Clock, AlertCircle,
  CheckCircle2, XCircle, ArrowUpRight, Plus,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { articlesApi, session } from '../../lib/api'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS = {
  DRAFT:     { label: 'Draf',           chip: 'bg-sand text-ash border-sand',                 icon: FileText,     hint: 'Belum dikirim',            action: 'Edit',          priority: 3 },
  IN_REVIEW: { label: 'Direview',       chip: 'bg-forest/10 text-forest border-forest/20',    icon: Clock,        hint: 'Menunggu keputusan editor', action: 'Lihat Detail',  priority: 2 },
  REVISION:  { label: 'Perlu Revisi',   chip: 'bg-clay/10 text-clay border-clay/20',          icon: AlertCircle,  hint: 'Revisi diminta editor',     action: 'Lihat Catatan', priority: 0 },
  PUBLISHED: { label: 'Diterbitkan',    chip: 'bg-moss/10 text-moss border-moss/20',          icon: CheckCircle2, hint: 'Tersedia untuk publik',     action: 'Lihat Artikel', priority: 4 },
  REJECTED:  { label: 'Ditolak',        chip: 'bg-sienna/10 text-sienna border-sienna/20',    icon: XCircle,      hint: 'Tidak dapat diterbitkan',   action: 'Lihat Catatan', priority: 1 },
}

const TYPE_LABEL = {
  ARTIKEL: 'Artikel', OPINION: 'Opinion', VIGNETTE: 'Vignette', CERITA: 'Cerita',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)      return 'Baru saja'
  if (diff < 3600)    return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400)   return `${Math.floor(diff / 3600)} jam lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ count, label, hint, chip, icon: Icon }) {
  return (
    <div className="bg-white rounded-card border border-sand shadow-subtle p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-sand/50 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-ash" />
        </div>
        <span className={`tag text-[0.6rem] py-0.5 border ${chip}`}>{label}</span>
      </div>
      <div>
        <span className="font-serif text-display font-semibold text-ink font-tabular leading-none block">
          {count}
        </span>
        <span className="font-sans text-caption text-ash mt-1 block">{hint}</span>
      </div>
    </div>
  )
}

function ArticleRow({ article }) {
  const cfg = STATUS[article.status] ?? STATUS.DRAFT
  const Icon = cfg.icon

  return (
    <div className="flex items-start gap-4 px-5 py-4 hover:bg-sand/20 transition-colors duration-[240ms] group">
      {/* Status icon */}
      <div className="w-8 h-8 rounded-full bg-sand/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-ash" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Status chip + type */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`tag text-[0.6rem] py-0.5 border ${cfg.chip}`}>{cfg.label}</span>
          {article.content_type && (
            <span className="font-sans text-[0.6rem] text-ash/60 uppercase tracking-wide">
              {TYPE_LABEL[article.content_type] ?? article.content_type}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-h3 font-semibold text-ink leading-snug line-clamp-1
          group-hover:text-forest transition-colors duration-[240ms]">
          {article.title}
        </h3>

        {/* Reviewer note or abstract */}
        {(article.reviewer_note || article.abstract) && (
          <p className="font-accent italic text-caption text-ash/70 leading-relaxed line-clamp-2 mt-1">
            "{article.reviewer_note || article.abstract}"
          </p>
        )}
      </div>

      {/* Right — date + action */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="font-sans text-[0.6rem] text-ash/50 whitespace-nowrap">
          {timeAgo(article.updated_at ?? article.created_at)}
        </span>
        <Link
          to={article.status === 'DRAFT' || article.status === 'REVISION' ? `/articles/${article.id}/edit` : `/articles/${article.id}`}
          className="inline-flex items-center gap-1 font-sans text-xs font-medium
            text-forest hover:text-clay transition-colors duration-[240ms]"
        >
          {cfg.action}
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-start gap-4 px-5 py-4 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-sand flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-sand rounded w-20" />
        <div className="h-4 bg-sand rounded w-3/4" />
        <div className="h-3 bg-sand/60 rounded w-1/2" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-3 bg-sand/60 rounded w-16" />
        <div className="h-3 bg-sand/60 rounded w-12" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MyArticlePage() {
  const navigate = useNavigate()
  const user = session.getUser()
  const firstName = user?.full_name?.split(' ')[0] ?? 'Kontributor'

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session.getAccess()) {
      navigate('/login', { replace: true })
      return
    }
    articlesApi.myArticles().then(({ ok, data }) => {
      if (ok) setArticles(Array.isArray(data) ? data : (data.results ?? []))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const count = (status) => articles.filter((a) => a.status === status).length

  const attentionList = articles.filter((a) => a.status === 'REVISION' || a.status === 'REJECTED')

  const sortedArticles = [...articles].sort(
    (a, b) => (STATUS[a.status]?.priority ?? 5) - (STATUS[b.status]?.priority ?? 5)
  )

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-12">

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Artikel Saya</span>
              </div>
              <h1 className="font-serif text-h1 font-semibold text-ink leading-tight">
                Halo,{' '}
                <em className="font-accent italic text-clay">{firstName}</em>
              </h1>
              <p className="font-sans text-body text-ash mt-1">
                Pantau dan kelola semua artikel serta kontribusimu di RIMBAHARI.
              </p>
            </div>
            <Link
              to="/articles/new"
              className="btn-primary flex items-center gap-2 self-start md:self-auto flex-shrink-0"
            >
              <Plus size={15} />
              Tulis Artikel
            </Link>
          </div>

          {/* ── Stat cards ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard count={loading ? '—' : count('DRAFT')}     label="Draf"         hint="Belum dikirim"            chip={STATUS.DRAFT.chip}     icon={STATUS.DRAFT.icon} />
            <StatCard count={loading ? '—' : count('IN_REVIEW')} label="Direview"     hint="Menunggu keputusan editor" chip={STATUS.IN_REVIEW.chip} icon={STATUS.IN_REVIEW.icon} />
            <StatCard count={loading ? '—' : count('REVISION')}  label="Perlu Revisi" hint="Revisi diminta editor"     chip={STATUS.REVISION.chip}  icon={STATUS.REVISION.icon} />
            <StatCard count={loading ? '—' : count('PUBLISHED')} label="Diterbitkan"  hint="Tersedia untuk publik"     chip={STATUS.PUBLISHED.chip} icon={STATUS.PUBLISHED.icon} />
          </div>

          {/* ── Needs attention ─────────────────────────────────── */}
          {!loading && attentionList.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Perlu Perhatian</span>
              </div>
              <h2 className="font-serif text-h2 font-semibold text-ink leading-tight mb-5">
                Catatan dari{' '}
                <em className="font-accent italic text-clay">Editor</em>
              </h2>
              <div className="bg-white rounded-card border border-sand shadow-subtle divide-y divide-sand">
                {attentionList.map((a) => <ArticleRow key={a.id} article={a} />)}
              </div>
            </div>
          )}

          {/* ── All articles ────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-clay/50" />
                <span className="tag">Semua Artikel</span>
              </div>
              {!loading && articles.length > 0 && (
                <span className="font-sans text-caption text-ash">
                  {articles.length} artikel
                </span>
              )}
            </div>
            <h2 className="font-serif text-h2 font-semibold text-ink leading-tight mb-5">
              Rekam{' '}
              <em className="font-accent italic text-clay">Kontribusi</em>
            </h2>

            <div className="bg-white rounded-card border border-sand shadow-subtle divide-y divide-sand">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
              ) : sortedArticles.length === 0 ? (
                <div className="flex flex-col items-center text-center px-8 py-14">
                  <div className="w-10 h-10 rounded-full bg-sand/60 flex items-center justify-center mb-4">
                    <PenLine size={18} className="text-ash/50" />
                  </div>
                  <p className="font-serif text-h3 font-semibold text-ink mb-1">Belum ada artikel</p>
                  <p className="font-sans text-body text-ash mb-5 max-w-xs leading-relaxed">
                    Mulai tulis artikel pertamamu dan bagikan pengetahuanmu ke komunitas.
                  </p>
                  <Link to="/articles/new" className="btn-primary flex items-center gap-2 text-sm">
                    <Plus size={14} />
                    Tulis Artikel Pertama
                  </Link>
                </div>
              ) : (
                sortedArticles.map((a) => <ArticleRow key={a.id} article={a} />)
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
