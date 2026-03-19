import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import ElevationOverlay from './ElevationOverlay.jsx';

const FEET_TO_METERS = 0.3048
const MAX_ELEVATION_FT = 29032  // Everest
const MAX_ELEVATION_M  = 8849

function App() {
  const [elevationThreshold, setElevationThreshold] = useState(0);
  const [units, setUnits] = useState('imperial');

  const isImperial = units === 'imperial'
  const maxElev = isImperial ? MAX_ELEVATION_FT : MAX_ELEVATION_M

  // Always work in meters internally for the overlay
  const thresholdM = isImperial
    ? elevationThreshold * FEET_TO_METERS
    : elevationThreshold

  const handleUnitToggle = () => {
    // Convert current threshold to the new unit so the slider doesn't jump
    if (isImperial) {
      setElevationThreshold(Math.round(elevationThreshold * FEET_TO_METERS))
    } else {
      setElevationThreshold(Math.round(elevationThreshold / FEET_TO_METERS))
    }
    setUnits(isImperial ? 'metric' : 'imperial')
  }

  return (
    <div className="h-screen w-full relative">
      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Rising Tide Elevation Map</h1>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Unit Toggle */}
            <button
              onClick={handleUnitToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isImperial
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isImperial ? 'Imperial (ft)' : 'Metric (m)'}
            </button>

            {/* Elevation Slider */}
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elevation Threshold ({isImperial ? 'feet' : 'meters'}):
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={maxElev}
                  value={elevationThreshold}
                  onChange={(e) => setElevationThreshold(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 min-w-24">
                  {elevationThreshold.toLocaleString()} {isImperial ? 'ft' : 'm'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Range: 0 to {maxElev.toLocaleString()} {isImperial ? 'ft' : 'm'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, paddingTop: '9rem' }}>
        <MapContainer
          center={[45.4654, 9.1859]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
          <ElevationOverlay thresholdM={thresholdM} />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Elevation Filter</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ background: 'rgba(0,30,100,0.82)' }} />
            <span className="text-gray-700">Below threshold (hidden)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded border border-gray-300" style={{ background: 'transparent' }} />
            <span className="text-gray-700">Above threshold (visible)</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {elevationThreshold > 0
              ? `Hiding below ${elevationThreshold.toLocaleString()} ${isImperial ? 'ft' : 'm'}`
              : 'Drag slider to filter elevations'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
