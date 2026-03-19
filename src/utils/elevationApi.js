// Real elevation data using Open Elevation API
// Free service with no API key required
// Rate limit: 60 requests per minute

export const fetchElevationData = async (center, zoom) => {
  try {
    const [lat, lng] = center;
    const bounds = getBoundsFromCenterZoom(lat, lng, zoom);
    
    // Generate sample points within the visible bounds
    const points = [];
    const gridSize = Math.max(3, 15 - zoom); // Fewer points when zoomed out
    
    for (let lat = bounds.south; lat <= bounds.north; lat += (bounds.north - bounds.south) / gridSize) {
      for (let lng = bounds.west; lng <= bounds.east; lng += (bounds.east - bounds.west) / gridSize) {
        points.push({
          latitude: lat,
          longitude: lng
        });
      }
    }
    
    // Batch request to Open Elevation API
    const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: points
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert to GeoJSON format
    const features = data.results.map((point, index) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude]
      },
      properties: {
        elevation: point.elevation
      }
    }));
    
    return {
      type: 'FeatureCollection',
      features: features
    };
    
  } catch (error) {
    console.error('Error fetching elevation data:', error);
    // Fallback to mock data if API fails
    return generateFallbackData(center, zoom);
  }
};

// Fallback function for when API is unavailable
const generateFallbackData = (center, zoom) => {
  const [lat, lng] = center;
  const bounds = getBoundsFromCenterZoom(lat, lng, zoom);
  
  const features = [];
  const gridSize = Math.max(3, 15 - zoom);
  
  for (let lat = bounds.south; lat <= bounds.north; lat += (bounds.north - bounds.south) / gridSize) {
    for (let lng = bounds.west; lng <= bounds.east; lng += (bounds.east - bounds.west) / gridSize) {
      const elevation = generateMockElevation(lat, lng);
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          elevation: elevation
        }
      });
    }
  }
  
  return {
    type: 'FeatureCollection',
    features: features
  };
};

const getBoundsFromCenterZoom = (lat, lng, zoom) => {
  const latDelta = 180 / Math.pow(2, zoom);
  const lngDelta = 360 / Math.pow(2, zoom);
  
  return {
    north: Math.min(90, lat + latDelta / 2),
    south: Math.max(-90, lat - latDelta / 2),
    east: lng + lngDelta / 2,
    west: lng - lngDelta / 2
  };
};

const generateMockElevation = (lat, lng) => {
  // Simplified elevation model for fallback
  const rockies = isNear(lat, lng, [40, -110], 15);
  const appalachians = isNear(lat, lng, [37, -82], 8);
  const sierraNevada = isNear(lat, lng, [37, -119], 6);
  
  if (rockies) {
    return 2000 + Math.random() * 2000;
  } else if (sierraNevada) {
    return 1500 + Math.random() * 2500;
  } else if (appalachians) {
    return 500 + Math.random() * 1000;
  }
  
  if (Math.abs(lat) < 40) {
    return Math.random() * 500;
  } else {
    return Math.random() * 1000;
  }
};

const isNear = (lat1, lng1, [lat2, lng2], threshold) => {
  const distance = Math.sqrt(
    Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)
  );
  return distance < threshold;
};
