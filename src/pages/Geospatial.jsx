import React, { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { geoMock } from '../utils/mockData'
import TestFireMap from '../components/TestFireMap'
import IndiaFireDetectionMap from '../components/IndiaFireDetectionMap'

function colorForSeverity(v) {
  if (v > 0.7) return '#b91c1c'
  if (v > 0.4) return '#f97316'
  return '#fca5a5'
}

export default function Geospatial() {
  const [activeTab, setActiveTab] = useState('severity') // 'severity' or 'fires'
  
  const features = geoMock.regions.map(r => ({ type: 'Feature', properties: { name: r.name, severity: r.severity, count: r.count }, geometry: { type: 'Polygon', coordinates: r.coords } }))

  const style = feature => ({ color: colorForSeverity(feature.properties.severity), weight: 1.5, fillOpacity: 0.6 })

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Geospatial Analysis</h2>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('severity')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'severity'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Severity Distribution
            </button>
            <button
              onClick={() => setActiveTab('fires')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fires'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔥 Live Fire Detection
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'test'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Test Fire Map
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'severity' && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-medium mb-4">Regional Severity Distribution</h3>
          <MapContainer center={[20,0]} zoom={2} className="leaflet-container">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={{ type: 'FeatureCollection', features }} style={style} onEachFeature={(feature, layer) => {
              layer.bindTooltip(`${feature.properties.name}: severity ${feature.properties.severity}`)
              layer.on('mouseover', () => layer.setStyle({ weight: 2 }))
              layer.on('mouseout', () => layer.setStyle({ weight: 1.5 }))
            }} />
          </MapContainer>

          <div className="mt-3">
            <strong>Legend:</strong>
            <div className="flex gap-2 mt-2">
              <div className="flex items-center gap-2"><span className="w-4 h-4" style={{ background: '#b91c1c' }} /> High</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4" style={{ background: '#f97316' }} /> Medium</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4" style={{ background: '#fca5a5' }} /> Low</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fires' && <IndiaFireDetectionMap />}
      {activeTab === 'test' && <TestFireMap />}
    </div>
  )
}
