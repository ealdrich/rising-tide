import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const SearchControl = ({ onLocationFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Using Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onLocationFound([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchControl;
