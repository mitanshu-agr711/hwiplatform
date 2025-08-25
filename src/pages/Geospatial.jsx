import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import L from 'leaflet'
import { geoMock } from '../utils/mockData'
import TestFireMap from '../components/TestFireMap'
import IndiaFireDetectionMap from '../components/IndiaFireDetectionMap'

// State coordinates mapping for India
const stateCoordinates = {
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2787, 81.8661],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [23.0225, 72.5714],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550],
  "Delhi": [28.7041, 77.1025]
}

function colorForSeverity(v) {
  if (v > 0.7) return '#b91c1c'
  if (v > 0.4) return '#f97316'
  return '#fca5a5'
}

export default function Geospatial() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('severity') // 'severity' or 'fires'
  const [selectedState, setSelectedState] = useState('')
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]) // Default India center
  const [mapZoom, setMapZoom] = useState(5)
  
  // Get state from URL parameters
  useEffect(() => {
    const stateParam = searchParams.get('state')
    if (stateParam && stateCoordinates[stateParam]) {
      setSelectedState(stateParam)
      setMapCenter(stateCoordinates[stateParam])
      setMapZoom(7) // Zoom closer for state view
      
      // Show welcome message for new users
      setTimeout(() => {
        alert(`Welcome! Showing disaster data for ${stateParam}. You can change the focus area using the dropdown below.`)
      }, 1000)
    }
  }, [searchParams])
  
  const features = geoMock.regions.map(r => ({ 
    type: 'Feature', 
    properties: { 
      name: r.name, 
      severity: r.severity, 
      count: r.count 
    }, 
    geometry: { 
      type: 'Polygon', 
      coordinates: r.coords 
    } 
  }))

  const style = feature => ({ color: colorForSeverity(feature.properties.severity), weight: 1.5, fillOpacity: 0.6 })

  return (
    <div className="max-w-7xl mx-auto">
      {selectedState && (
        <div className="mb-4 p-4 bg-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800 font-semibold">
              Viewing disaster data for: {selectedState}
            </span>
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-4">
        Geospatial Analysis {selectedState && `- ${selectedState}`}
      </h2>
      
      {/* State Selector */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Focus on State:
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              const state = e.target.value
              setSelectedState(state)
              if (state && stateCoordinates[state]) {
                setMapCenter(stateCoordinates[state])
                setMapZoom(7)
              } else {
                setMapCenter([20.5937, 78.9629])
                setMapZoom(5)
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All India View</option>
            {Object.keys(stateCoordinates).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {selectedState && (
            <button
              onClick={() => {
                setSelectedState('')
                setMapCenter([20.5937, 78.9629])
                setMapZoom(5)
                // Update URL to remove state parameter
                window.history.replaceState({}, '', '/geospatial')
              }}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

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
          <h3 className="text-lg font-medium mb-4">
            Regional Severity Distribution
            {selectedState && ` - ${selectedState} Focus`}
          </h3>
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="leaflet-container"
            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // Force re-render when center/zoom changes
          >
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

      {activeTab === 'fires' && (
        <IndiaFireDetectionMap 
          selectedState={selectedState}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
        />
      )}
      {activeTab === 'test' && (
        <TestFireMap 
          selectedState={selectedState}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
        />
      )}
    </div>
  )
}
