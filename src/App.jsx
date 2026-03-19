import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchControl from './components/SearchControl';
import ElevationSlider from './components/ElevationSlider';
import UnitToggle from './components/UnitToggle';
import { fetchElevationData } from './utils/elevationApi';

function App() {
  const [elevationData, setElevationData] = useState(null);
  const [elevationThreshold, setElevationThreshold] = useState(0);
  const [units, setUnits] = useState('imperial'); // 'imperial' or 'metric'
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA
  const [mapZoom, setMapZoom] = useState(4);

  // Convert elevation threshold based on units
  const getElevationInMeters = () => {
    if (units === 'imperial') {
      return elevationThreshold * 0.3048; // feet to meters
    } else {
      return elevationThreshold; // already in meters
    }
  };

  // Style function for GeoJSON based on elevation
  const getElevationStyle = (feature) => {
    const elevation = feature.properties.elevation || 0;
    const threshold = getElevationInMeters();
    
    if (elevation > threshold) {
      return {
        fillColor: '#10b981', // green for above threshold
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    } else {
      return {
        fillColor: '#9ca3af', // gray for below threshold
        weight: 0.5,
        opacity: 0.3,
        color: 'white',
        fillOpacity: 0.2
      };
    }
  };

  // Load elevation data for current map view
  useEffect(() => {
    const loadElevationData = async () => {
      try {
        const data = await fetchElevationData(mapCenter, mapZoom);
        setElevationData(data);
      } catch (error) {
        console.error('Error loading elevation data:', error);
      }
    };

    loadElevationData();
  }, [mapCenter, mapZoom]);

  // Get max elevation for slider
  const getMaxElevation = () => {
    if (units === 'imperial') {
      return 29032; // Everest height in feet
    } else {
      return 8848; // Everest height in meters
    }
  };

  return (
    <div className="h-screen w-full relative">
      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Elevation Map Explorer</h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Control */}
            <SearchControl onLocationFound={setMapCenter} />
            
            {/* Unit Toggle */}
            <UnitToggle units={units} onToggle={setUnits} />
            
            {/* Elevation Slider */}
            <div className="flex-1 min-w-64">
              <ElevationSlider
                elevation={elevationThreshold}
                onChange={setElevationThreshold}
                max={getMaxElevation()}
                units={units}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-40">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          crs={CRS.EPSG3857}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Topographic/Elevation overlay */}
          {elevationData && (
            <GeoJSON
              data={elevationData}
              style={getElevationStyle}
            />
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">
              Above {elevationThreshold} {units === 'imperial' ? 'ft' : 'm'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-700">
              Below threshold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
