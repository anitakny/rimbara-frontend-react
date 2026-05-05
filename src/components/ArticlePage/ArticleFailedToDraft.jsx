import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ArticleFailedToDraft({ isOpen, errorMsg, draftId }) {
  const navigate = useNavigate()
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3 p-5 border-b border-sand bg-clay/5">
          <AlertCircle className="text-clay flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-serif text-lg font-semibold text-clay mb-1">Gagal Mengajukan Artikel</h3>
            <p className="font-sans text-sm text-ink/80 leading-relaxed">
              {errorMsg || 'Terdapat kesalahan saat memproses pengajuan Anda.'}
            </p>
          </div>
        </div>
        <div className="p-5 font-sans text-sm text-ink/80 bg-white">
          <p>
            Artikel Anda telah <strong>berhasil disimpan sebagai Draf</strong>. 
            Anda dapat memperbaikinya nanti melalui halaman Edit.
          </p>
        </div>
        <div className="p-4 bg-bone border-t border-sand flex justify-end gap-3">
          <button
            onClick={() => navigate('/articles/my')}
            className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-ink bg-white border border-sand hover:bg-sand/30 transition-colors"
          >
            Ke Artikel Saya
          </button>
          {draftId && (
            <button
              onClick={() => navigate(`/articles/${draftId}/edit`)}
              className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-white bg-forest hover:bg-forest/90 transition-colors"
            >
              Edit Draf Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
