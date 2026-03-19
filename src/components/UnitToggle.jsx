import React from 'react';

const UnitToggle = ({ units, onToggle }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Units
      </label>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onToggle('imperial')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            units === 'imperial'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Imperial (ft)
        </button>
        <button
          onClick={() => onToggle('metric')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            units === 'metric'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Metric (m)
        </button>
      </div>
    </div>
  );
};

export default UnitToggle;
