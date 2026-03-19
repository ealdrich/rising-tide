# Elevation Map Explorer

An interactive topographic map that allows you to explore elevation data with dynamic filtering based on altitude thresholds.

## Features

- **Interactive Map**: Pan, zoom, and explore any location worldwide
- **Elevation Filtering**: Use the slider to highlight areas above specific elevations
- **Unit Support**: Toggle between imperial (feet) and metric (meters) units
- **Location Search**: Search for any location to quickly navigate there
- **Topographic Visualization**: Areas above the elevation threshold are highlighted in green, below in gray
- **Real-time Updates**: Map updates dynamically as you adjust the elevation threshold

## How It Works

1. **Search for a location** or navigate the map manually
2. **Set the elevation threshold** using the slider (0 to Everest height)
3. **Toggle units** between feet and meters
4. **View results**: Areas above your threshold appear in green, below in gray

## Technical Details

- Built with React and Vite
- Uses Leaflet for interactive mapping
- Mock elevation data generation (in production, would use real elevation APIs)
- Responsive design with Tailwind CSS
- GitHub Pages deployment ready

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/elevation-map.git
cd elevation-map
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the app for production:
```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages. To deploy:

1. Make sure you have a GitHub repository for this project
2. Run the deployment script:
```bash
npm run deploy
```

The app will be deployed to `https://yourusername.github.io/elevation-map/`

## Future Enhancements

- Integration with real elevation APIs (Mapbox, Google Maps, USGS)
- Higher resolution elevation data
- 3D terrain visualization
- Elevation profile tool
- Export functionality for filtered areas
- Offline mode support

## Technologies Used

- React 18
- Vite
- Leaflet & React-Leaflet
- Tailwind CSS
- JavaScript ES6+

## License

MIT License
