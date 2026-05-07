import { useEffect, useRef, useState, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist'
import { X, ChevronLeft, ChevronRight, BookOpen, Loader2, Download, ZoomIn, ZoomOut } from 'lucide-react'

if (!Math.sumPrecise) Math.sumPrecise = (...nums) => nums.reduce((s, n) => s + n, 0)
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`

const Page = forwardRef(({ src, pageNum }, ref) => (
  <div
    ref={ref}
    className="overflow-hidden bg-white"
    style={{ boxShadow: 'inset -6px 0 16px rgba(0,0,0,0.06)' }}
  >
    <img
      src={src}
      alt={`Halaman ${pageNum}`}
      className="w-full h-full object-cover select-none pointer-events-none"
      draggable={false}
    />
  </div>
))
Page.displayName = 'Page'

export default function FlipbookViewer({ item, onClose }) {
  const [pages, setPages]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom]               = useState(1.0)
  const [pageDims, setPageDims]       = useState(null)
  const [downloading, setDownloading] = useState(false)
  const bookRef = useRef()

  const isMobile = window.innerWidth < 768
  // Max width for one page: half the viewport minus margins (two pages side by side on desktop)
  const availW = isMobile
    ? window.innerWidth - 48
    : Math.floor((window.innerWidth - 140) / 2)
  const pageW = pageDims ? Math.min(pageDims.w, availW) : availW
  const pageH = pageDims ? Math.round(pageW * (pageDims.h / pageDims.w)) : Math.round(pageW * 1.4142)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Load PDF on item change
  useEffect(() => {
    // Support both article pdf_url and etalase file_url field names
    const pdfUrl = item?.pdf_url ?? item?.file_url
    if (!pdfUrl) {
      setError('PDF tidak tersedia untuk publikasi ini.')
      setLoading(false)
      return
    }
    setLoading(true)
    setPages([])
    setError('')
    setCurrentPage(0)
    setZoom(1.0)
    setPageDims(null)
    ;(async () => {
      let blobUrl = null
      try {
        // Pre-fetch as blob — avoids pdfjs worker making a cross-origin request
        // to Supabase Storage, which can fail in some browsers even on public buckets
        const res = await fetch(pdfUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        blobUrl = URL.createObjectURL(blob)

        const pdf  = await getDocument(blobUrl).promise
        const imgs = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const pg     = await pdf.getPage(i)
          const vp     = pg.getViewport({ scale: 1.8 })
          if (i === 1) setPageDims({ w: vp.width / 1.8, h: vp.height / 1.8 })
          const canvas = document.createElement('canvas')
          canvas.width  = vp.width
          canvas.height = vp.height
          await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise
          imgs.push(canvas.toDataURL('image/jpeg', 0.88))
        }
        setPages(imgs)
      } catch {
        setError('Gagal memuat PDF.')
      } finally {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
      }
      setLoading(false)
    })()
  }, [item?.id])

  // Keyboard: Esc = close, arrows = flip pages
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight')  bookRef.current?.pageFlip().flipNext()
      if (e.key === 'ArrowLeft')   bookRef.current?.pageFlip().flipPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const totalPages = pages.length
  const prev = () => bookRef.current?.pageFlip().flipPrev()
  const next = () => bookRef.current?.pageFlip().flipNext()

  const zoomIn  = () => setZoom(z => Math.min(1.5, parseFloat((z + 0.1).toFixed(1))))
  const zoomOut = () => setZoom(z => Math.max(0.5, parseFloat((z - 0.1).toFixed(1))))

  const handleDownload = async () => {
    if (downloading) return
    const pdfUrl = item?.pdf_url ?? item?.file_url
    if (!pdfUrl) return

    setDownloading(true)
    try {
      // 1. Hit the backend download endpoint to increment downloads_count
      //    (fire-and-forget — don't block the actual download on API success)
      if (item?.id && typeof item.id === 'string' && item.id.length > 8) {
        import('../lib/api').then(({ etalaseApi }) => {
          etalaseApi.download?.(item.id).catch(() => {})
        }).catch(() => {})
      }

      // 2. Fetch PDF as blob to force a real file save dialog
      //    (using <a download> alone doesn't work cross-origin)
      const res = await fetch(pdfUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${(item.title ?? 'dokumen').replace(/[/\\]/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="w-full flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-white/8">

          {/* Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BookOpen size={15} className="text-clay flex-shrink-0" />
            <span className="font-serif text-sm font-semibold text-bone/80 truncate">
              {item?.title}
            </span>
          </div>

          {/* Controls — zoom + download + page # + close */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-4">

            {/* Zoom */}
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              title="Perkecil (−)"
              className="p-1.5 rounded-md text-bone/50 hover:text-bone hover:bg-white/10
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[240ms]"
            >
              <ZoomOut size={15} />
            </button>
            <span className="font-sans text-xs text-bone/40 font-tabular w-9 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 1.5}
              title="Perbesar (+)"
              className="p-1.5 rounded-md text-bone/50 hover:text-bone hover:bg-white/10
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[240ms]"
            >
              <ZoomIn size={15} />
            </button>

            <div className="w-px h-4 bg-white/15 mx-2" />

            {/* Download */}
            <button
              onClick={handleDownload}
              title="Unduh PDF"
              className="p-1.5 rounded-md text-bone/50 hover:text-bone hover:bg-white/10
                transition-all duration-[240ms]"
            >
              <Download size={15} />
            </button>

            <div className="w-px h-4 bg-white/15 mx-2" />

            {/* Page counter */}
            {!loading && !error && totalPages > 0 && (
              <span className="font-sans text-xs text-bone/35 font-tabular px-1 select-none">
                {currentPage + 1} / {totalPages}
              </span>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              title="Tutup (Esc)"
              className="p-1.5 rounded-md text-bone/50 hover:text-bone hover:bg-white/10
                transition-all duration-[240ms] ml-1"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── Book area ───────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center w-full min-h-0 py-6 px-4 overflow-hidden">

          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={30} className="text-clay animate-spin" />
              <p className="font-sans text-caption text-bone/40">Memuat halaman PDF…</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center">
              <BookOpen size={36} className="text-bone/20 mx-auto mb-3" />
              <p className="font-sans text-body text-bone/50">{error}</p>
            </div>
          )}

          {!loading && !error && totalPages > 0 && (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={pageW}
                height={pageH}
                size="fixed"
                flippingTime={600}
                showCover={false}
                usePortrait={isMobile}
                mobileScrollSupport={false}
                onFlip={(e) => setCurrentPage(e.data)}
                style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
              >
                {pages.map((src, i) => (
                  <Page key={i} src={src} pageNum={i + 1} />
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </div>

        {/* ── Bottom controls ─────────────────────────────────────── */}
        {!loading && !error && totalPages > 0 && (
          <div className="flex items-center gap-5 pb-6 flex-shrink-0">
            <button
              onClick={prev}
              disabled={currentPage === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15
                font-sans text-sm text-bone/70 hover:text-bone hover:border-white/30
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[240ms]"
            >
              <ChevronLeft size={15} />
              Sebelumnya
            </button>

            {totalPages <= 12 ? (
              <div className="flex gap-1 items-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => bookRef.current?.pageFlip().flip(i)}
                    className={`rounded-full transition-all duration-[240ms] ${
                      currentPage === i
                        ? 'w-4 h-1.5 bg-clay'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="font-sans text-caption text-bone/40 font-tabular min-w-[5rem] text-center">
                {currentPage + 1} / {totalPages}
              </span>
            )}

            <button
              onClick={next}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15
                font-sans text-sm text-bone/70 hover:text-bone hover:border-white/30
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[240ms]"
            >
              Berikutnya
              <ChevronRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
