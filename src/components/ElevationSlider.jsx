import React from 'react';

const ElevationSlider = ({ elevation, onChange, max, units }) => {
  const unitLabel = units === 'imperial' ? 'ft' : 'm';
  const step = units === 'imperial' ? 100 : 50;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          Elevation Threshold
        </label>
        <span className="text-sm font-semibold text-gray-900">
          {elevation.toLocaleString()} {unitLabel}
        </span>
      </div>
      
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={elevation}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${(elevation / max) * 100}%, #e5e7eb ${(elevation / max) * 100}%, #e5e7eb 100%)`
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 {unitLabel}</span>
        <span>{max.toLocaleString()} {unitLabel}</span>
      </div>
    </div>
  );
};

export default ElevationSlider;
