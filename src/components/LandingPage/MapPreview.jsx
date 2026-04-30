import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin } from 'lucide-react'

const communities = [
  { id: 0, name: 'Dayak Ngaju',   province: 'Kalimantan Tengah',   lat: -1.68, lng: 113.38, count: 12 },
  { id: 1, name: 'Baduy Dalam',   province: 'Banten',               lat: -6.58, lng: 106.17, count: 8  },
  { id: 2, name: 'Suku Toraja',   province: 'Sulawesi Selatan',     lat: -3.05, lng: 119.87, count: 10 },
  { id: 3, name: 'Suku Sasak',    province: 'Nusa Tenggara Barat',  lat: -8.65, lng: 116.35, count: 6  },
  { id: 4, name: 'Talang Mamak',  province: 'Riau',                 lat:  0.10, lng: 102.30, count: 9  },
  { id: 5, name: 'Suku Arfak',    province: 'Papua Barat',          lat: -1.33, lng: 133.47, count: 7  },
  { id: 6, name: 'Dayak Meratus', province: 'Kalimantan Selatan',   lat: -2.59, lng: 115.42, count: 5  },
  { id: 7, name: 'Suku Mentawai', province: 'Sumatera Barat',       lat: -2.07, lng:  99.61, count: 6  },
]

const GEOJSON = {
  type: 'FeatureCollection',
  features: communities.map((c) => ({
    type: 'Feature',
    id: c.id,
    geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
    properties: { name: c.name, province: c.province, count: c.count },
  })),
}

const INDONESIA_CENTER = [118, -2.5]
const INDONESIA_BOUNDS = [[90, -14], [145, 10]]

function IndonesiaMap() {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const popupRef     = useRef(null)
  const hoveredId    = useRef(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }],
      },
      center: INDONESIA_CENTER,
      zoom: 4.3,
      minZoom: 3.8,
      maxZoom: 12,
      maxBounds: INDONESIA_BOUNDS,
      dragRotate: false,
      touchPitch: false,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    // Single reusable popup — no button, no arrow (styled in index.css)
    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 16,
      className: 'rimbahari-popup',
    })

    map.on('load', () => {
      // ── Data source ─────────────────────────────────────────
      map.addSource('communities', { type: 'geojson', data: GEOJSON })

      // ── Glow halo (expands on hover via feature-state) ──────
      map.addLayer({
        id: 'pins-glow',
        type: 'circle',
        source: 'communities',
        paint: {
          'circle-radius': [
            'case', ['boolean', ['feature-state', 'hover'], false], 20, 14,
          ],
          'circle-color': '#B85C3E',
          'circle-opacity': 0.18,
          'circle-blur': 0.7,
        },
      })

      // ── Main pin dot ─────────────────────────────────────────
      map.addLayer({
        id: 'pins',
        type: 'circle',
        source: 'communities',
        paint: {
          'circle-radius': [
            'case', ['boolean', ['feature-state', 'hover'], false], 11, 8,
          ],
          'circle-color': [
            'case', ['boolean', ['feature-state', 'hover'], false], '#E8DCC4', '#B85C3E',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(245,239,227,0.6)',
        },
      })

      // ── Hover: show popup + update feature-state ─────────────
      map.on('mouseenter', 'pins', (e) => {
        map.getCanvas().style.cursor = 'pointer'

        const feature = e.features[0]
        const { name, province, count } = feature.properties
        const coords = feature.geometry.coordinates.slice()

        // Clear previous hover
        if (hoveredId.current !== null) {
          map.setFeatureState(
            { source: 'communities', id: hoveredId.current },
            { hover: false }
          )
        }
        hoveredId.current = feature.id
        map.setFeatureState(
          { source: 'communities', id: feature.id },
          { hover: true }
        )

        popupRef.current
          .setLngLat(coords)
          .setHTML(`
            <div style="flex:1;min-width:0;padding:13px 15px;font-family:'Inter',system-ui,sans-serif;">
              <p style="font-family:'Fraunces',Georgia,serif;font-weight:600;color:#1A1814;font-size:14px;margin:0 0 4px 0;line-height:1.2;">
                ${name}
              </p>
              <p style="color:#5C7A4A;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">
                Terverifikasi
              </p>
              <p style="color:#6B665E;font-size:11px;margin:0;">
                ${province}
              </p>
              <p style="color:#6B665E;font-size:11px;margin:0;">
                ${count} konten
              </p>
            </div>
            <div style="
              width:60px;flex-shrink:0;
              background-color:#1F3B2D;
              background-image:url(&quot;data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='0.12'%3E%3Cpath d='M20 20l-4-4 4-4 4 4-4 4zm0-8l-4-4 4-4 4 4-4 4zm0 16l-4-4 4-4 4 4-4 4zM12 20l-4-4 4-4 4 4-4 4zm16 0l-4-4 4-4 4 4-4 4z'/%3E%3C/g%3E%3C/svg%3E&quot;);
              background-repeat:repeat;
            "></div>
          `)
          .addTo(map)
      })

      // ── Mouse leave: clear state + hide popup ────────────────
      map.on('mouseleave', 'pins', () => {
        map.getCanvas().style.cursor = ''
        if (hoveredId.current !== null) {
          map.setFeatureState(
            { source: 'communities', id: hoveredId.current },
            { hover: false }
          )
          hoveredId.current = null
        }
        popupRef.current.remove()
      })
    })

    return () => {
      popupRef.current?.remove()
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-80 lg:h-[420px] rounded-card overflow-hidden border border-white/8 shadow-elevated"
    />
  )
}

export default function MapPreview() {
  return (
    <section id="peta" className="py-24 lg:py-32 bg-forest overflow-hidden relative">
      {/* Batik texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5EFE3' fill-opacity='1'%3E%3Cpath d='M30 30l-8-8 8-8 8 8-8 8zm0-16l-8-8 8-8 8 8-8 8zm0 32l-8-8 8-8 8 8-8 8zM14 30l-8-8 8-8 8 8-8 8zm32 0l-8-8 8-8 8 8-8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-content mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-clay/50" />
              <span className="font-sans text-caption uppercase tracking-widest text-bone/50 font-medium">
                Peta Interaktif
              </span>
            </div>
            <h2 className="font-serif text-h1 font-semibold text-bone leading-tight mb-4">
              Wilayah Adat{' '}
              <em className="font-accent italic text-sand">di Seluruh Nusantara</em>
            </h2>
            <p className="font-sans text-body text-bone/65 leading-relaxed">
              Delapan wilayah adat di enam provinsi terdokumentasi dalam platform
              live-archiving yang terus diperbarui oleh komunitas.
            </p>
          </div>
        </div>

        {/* Live map */}
        <IndonesiaMap />

        {/* Community chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {communities.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-white/8
                hover:bg-white/5 transition-all duration-[240ms] cursor-default"
            >
              <MapPin size={13} className="text-clay flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-bone truncate">{c.name}</p>
                <p className="font-sans text-caption text-bone/45 truncate">{c.province}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
