import { AlertTriangle, X } from 'lucide-react'

export default function ArticleDeleteModal({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-sand">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-sienna" size={20} />
            <h3 className="font-serif text-lg font-semibold text-ink">Hapus Artikel</h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="text-ash hover:text-ink transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 font-sans text-body text-ink/80">
          <p>Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="p-4 bg-bone border-t border-sand flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-ink bg-white border border-sand hover:bg-sand/30 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-white bg-sienna hover:bg-sienna/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus Artikel'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
