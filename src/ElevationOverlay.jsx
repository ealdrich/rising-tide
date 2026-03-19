import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

// Cache decoded elevation arrays so threshold changes only redraw, never re-fetch
// Key: "z/x/y" -> Float32Array of 256*256 elevation values in meters
const elevationCache = new Map()
const MAX_CACHE = 400

function cacheSet(key, val) {
  if (elevationCache.size >= MAX_CACHE) {
    elevationCache.delete(elevationCache.keys().next().value)
  }
  elevationCache.set(key, val)
}

const MAPTILER_KEY = 'qQbqyXXSOJ595wOSETfo'

function getTileUrl(z, x, y) {
  if (import.meta.env.DEV) {
    return `/elevation-tiles/${z}/${x}/${y}.png`
  }
  return `https://api.maptiler.com/tiles/terrain-rgb/${z}/${x}/${y}.png?key=${MAPTILER_KEY}`
}

// Dev uses AWS terrarium: elevation = R*256 + G + B/256 - 32768
// Prod uses MapTiler terrain-rgb: elevation = -10000 + (R*65536 + G*256 + B) * 0.1
function decodeTile(imageData) {
  const { data } = imageData
  const elev = new Float32Array(256 * 256)
  for (let i = 0; i < elev.length; i++) {
    const p = i * 4
    if (import.meta.env.DEV) {
      elev[i] = data[p] * 256 + data[p + 1] + data[p + 2] / 256 - 32768
    } else {
      elev[i] = -10000 + (data[p] * 65536 + data[p + 1] * 256 + data[p + 2]) * 0.1
    }
  }
  return elev
}

function drawMask(ctx, elevations, thresholdM) {
  ctx.clearRect(0, 0, 256, 256)
  const out = ctx.createImageData(256, 256)
  const d = out.data
  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] < thresholdM) {
      const p = i * 4
      d[p]     = 0    // R
      d[p + 1] = 30   // G
      d[p + 2] = 100  // B  (deep ocean blue)
      d[p + 3] = 210  // A  (~82% opaque)
    }
    // above threshold: alpha stays 0 (fully transparent — topo shows through)
  }
  ctx.putImageData(out, 0, 0)
}

export default function ElevationOverlay({ thresholdM }) {
  const map = useMap()
  const layerRef = useRef(null)
  const thresholdRef = useRef(thresholdM)

  useEffect(() => {
    const ElevationLayer = L.GridLayer.extend({
      createTile(coords, done) {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256

        const key = `${coords.z}/${coords.x}/${coords.y}`

        const render = (elevations) => {
          const ctx = canvas.getContext('2d')
          drawMask(ctx, elevations, thresholdRef.current)
          done(null, canvas)
        }

        if (elevationCache.has(key)) {
          // Defer so done() is always called after createTile() returns
          // (Leaflet stores the tile in _tiles right after createTile returns)
          setTimeout(() => render(elevationCache.get(key)), 0)
        } else {
          // Fetch as blob so pixel data is readable regardless of CORS.
          // In dev the Vite proxy makes it same-origin; in production set
          // VITE_ELEVATION_TILE_BASE to a CORS-enabled proxy or tile server.
          fetch(getTileUrl(coords.z, coords.x, coords.y))
            .then(r => {
              if (!r.ok) throw new Error(r.status)
              return r.blob()
            })
            .then(blob => {
              const objUrl = URL.createObjectURL(blob)
              const img = new Image()
              img.onload = () => {
                URL.revokeObjectURL(objUrl)
                try {
                  const off = document.createElement('canvas')
                  off.width = 256
                  off.height = 256
                  const ctx = off.getContext('2d', { willReadFrequently: true })
                  ctx.drawImage(img, 0, 0)
                  const elevations = decodeTile(ctx.getImageData(0, 0, 256, 256))
                  cacheSet(key, elevations)
                  render(elevations)
                } catch {
                  done(null, canvas)
                }
              }
              img.onerror = () => done(null, canvas)
              img.src = objUrl
            })
            .catch(() => done(null, canvas))
        }

        return canvas
      },

      redrawWithThreshold(threshold) {
        Object.values(this._tiles).forEach(({ el, coords }) => {
          const key = `${coords.z}/${coords.x}/${coords.y}`
          const elevations = elevationCache.get(key)
          if (elevations) {
            drawMask(el.getContext('2d'), elevations, threshold)
          }
        })
      },
    })

    const layer = new ElevationLayer({
      opacity: 1,
      zIndex: 450,
      maxNativeZoom: 15,
      keepBuffer: 4,
    })
    layer.addTo(map)
    layerRef.current = layer

    return () => {
      map.removeLayer(layer)
      layerRef.current = null
    }
  }, [map])

  useEffect(() => {
    thresholdRef.current = thresholdM
    layerRef.current?.redrawWithThreshold(thresholdM)
  }, [thresholdM])

  return null
}
