import { useEffect, useState } from 'react'
import { MessageCircle, Send, Trash2 } from 'lucide-react'
import { articlesApi, session } from '../../lib/api'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)      return 'Baru saja'
  if (diff < 3600)    return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400)   return `${Math.floor(diff / 3600)} jam lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ArticleComment({ articleId }) {
  const sessionUser   = session.getUser()
  const canModerate   = sessionUser?.role === 'ADMIN'
    || sessionUser?.role === 'MODERATOR'
    || sessionUser?.is_staff
    || sessionUser?.is_superuser

  const [comments, setComments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [newComment, setNewComment]     = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => { loadComments() }, [articleId])

  const loadComments = async () => {
    setLoading(true)
    const { ok, data } = await articlesApi.comments(articleId)
    if (ok) setComments(Array.isArray(data) ? data : (data.results ?? []))
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return
    setSubmitting(true); setCommentError('')
    const { ok, data } = await articlesApi.addComment(articleId, newComment.trim())
    if (ok) {
      setNewComment('')
      await loadComments()  // reload for full author data & correct timestamps
    } else {
      setCommentError(data?.error ?? data?.detail ?? 'Gagal mengirim komentar.')
    }
    setSubmitting(false)
  }

  const handleDelete = async (commentId) => {
    const { ok } = await articlesApi.deleteComment(articleId, commentId)
    if (ok) await loadComments()
  }

  return (
    <section className="mt-10">
      {/* Heading with live count */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-6 bg-clay/50" />
        <h2 className="font-serif text-h3 font-semibold text-ink">Komentar</h2>
        <span className="font-sans text-caption text-ash font-tabular">
          ({loading ? '…' : comments.length})
        </span>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => { setNewComment(e.target.value); setCommentError('') }}
          placeholder="Tulis komentar…"
          rows={3}
          className="w-full bg-white border border-sand rounded-lg px-4 py-3 font-sans text-sm text-ink
            placeholder:text-ash/40 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15
            transition-all duration-[240ms] resize-none mb-2"
        />
        {commentError && (
          <p className="font-sans text-caption text-clay mb-2">{commentError}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest text-bone font-sans text-sm font-medium
              hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-[240ms]"
          >
            {submitting
              ? <><span className="w-3.5 h-3.5 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />Mengirim…</>
              : <><Send size={14} />Kirim</>
            }
          </button>
        </div>
      </form>

      {/* Comment list */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-sand flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-sand rounded w-32" />
                <div className="h-3 bg-sand/60 rounded w-full" />
                <div className="h-3 bg-sand/60 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-sand rounded-lg">
          <MessageCircle size={28} className="text-ash/30 mx-auto mb-3" />
          <p className="font-sans text-sm text-ash">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map(comment => {
            const isOwn     = comment.author?.id === sessionUser?.id
            const canDelete = isOwn || canModerate
            return (
              <div key={comment.id} className="flex gap-3">
                {comment.author?.photo_url ? (
                  <img src={comment.author.photo_url} alt={comment.author.full_name}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-serif font-semibold text-[0.6rem] text-forest leading-none">
                      {getInitials(comment.author?.full_name)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-sans text-sm font-medium text-ink truncate">
                        {comment.author?.full_name ?? 'Anggota'}
                      </span>
                      <span className="font-sans text-[0.65rem] text-ash/60 flex-shrink-0">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-ash/40 hover:text-clay transition-colors duration-[200ms] flex-shrink-0"
                        title="Hapus komentar"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="font-sans text-sm text-ink/90 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
