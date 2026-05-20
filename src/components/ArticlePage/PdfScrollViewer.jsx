import { useEffect, useState } from 'react'
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist'
import { Loader2 } from 'lucide-react'

if (!Math.sumPrecise) Math.sumPrecise = (...nums) => nums.reduce((s, n) => s + n, 0)
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`

export default function PdfScrollViewer({ url }) {
  const [pages, setPages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!url) { setError('URL tidak tersedia.'); setLoading(false); return }
    setLoading(true); setPages([]); setError('')

    let blobUrl = null
    ;(async () => {
      try {
        // Pre-fetch as blob to bypass cross-origin restrictions on mobile
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        blobUrl = URL.createObjectURL(blob)

        const pdf = await getDocument(blobUrl).promise
        const imgs = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const pg = await pdf.getPage(i)
          const vp = pg.getViewport({ scale: 1.6 })
          const canvas = document.createElement('canvas')
          canvas.width  = vp.width
          canvas.height = vp.height
          await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise
          imgs.push(canvas.toDataURL('image/jpeg', 0.88))
        }
        setPages(imgs)
      } catch {
        setError('Gagal memuat dokumen PDF.')
      } finally {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setLoading(false)
      }
    })()
  }, [url])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3 bg-sand/10">
        <Loader2 size={26} className="text-forest animate-spin" />
        <p className="font-sans text-caption text-ash">Memuat halaman PDF…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center bg-sand/10">
        <p className="font-sans text-body text-ash">{error}</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[80vh] bg-sand/10 p-3 flex flex-col gap-2">
      {pages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Halaman ${i + 1}`}
          className="w-full rounded shadow-sm select-none"
          draggable={false}
        />
      ))}
      <p className="font-sans text-[0.6rem] text-ash/40 text-center pt-1">
        {pages.length} halaman
      </p>
    </div>
  )
}
