import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON, Tooltip, Marker, Popup } from 'react-leaflet'
import { MapPin, Flame, Waves, Mountain, Wind, CloudRain } from 'lucide-react'
import L from 'leaflet'
import { geoMock } from '../utils/mockData'
import TestFireMap from '../components/TestFireMap'
import IndiaFireDetectionMap from '../components/IndiaFireDetectionMap'
import Nav from '../components/Navbar'

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

// Disaster types configuration
const disasterTypes = {
  fires: {
    name: 'Fires',
    icon: Flame,
    color: '#dc2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    description: 'Real-time fire detection and monitoring'
  },
  floods: {
    name: 'Floods',
    icon: Waves,
    color: '#2563eb',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    description: 'Flood monitoring and water level tracking'
  },
  landslides: {
    name: 'Landslides',
    icon: Mountain,
    color: '#92400e',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Landslide risk assessment and monitoring'
  },
  cyclones: {
    name: 'Cyclones',
    icon: Wind,
    color: '#7c3aed',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Cyclone tracking and storm monitoring'
  },
  rainfall: {
    name: 'Heavy Rainfall',
    icon: CloudRain,
    color: '#059669',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    description: 'Rainfall monitoring and precipitation tracking'
  }
}

// Dummy disaster data for different types
const dummyDisasterData = {
  floods: [
    { id: 1, lat: 22.5726, lng: 88.3639, severity: 'High', location: 'Kolkata, West Bengal', time: '2 hours ago' },
    { id: 2, lat: 19.0760, lng: 72.8777, severity: 'Medium', location: 'Mumbai, Maharashtra', time: '4 hours ago' },
    { id: 3, lat: 26.9124, lng: 75.7873, severity: 'Low', location: 'Jaipur, Rajasthan', time: '6 hours ago' },
    { id: 4, lat: 13.0827, lng: 80.2707, severity: 'High', location: 'Chennai, Tamil Nadu', time: '1 hour ago' },
    { id: 5, lat: 17.3850, lng: 78.4867, severity: 'Medium', location: 'Hyderabad, Telangana', time: '3 hours ago' }
  ],
  landslides: [
    { id: 1, lat: 31.1048, lng: 77.1734, severity: 'High', location: 'Shimla, Himachal Pradesh', time: '1 hour ago' },
    { id: 2, lat: 30.0668, lng: 79.0193, severity: 'Medium', location: 'Dehradun, Uttarakhand', time: '5 hours ago' },
    { id: 3, lat: 25.4670, lng: 91.3662, severity: 'High', location: 'Shillong, Meghalaya', time: '2 hours ago' },
    { id: 4, lat: 10.8505, lng: 76.2711, severity: 'Medium', location: 'Kerala Hills', time: '4 hours ago' },
    { id: 5, lat: 27.5330, lng: 88.5122, severity: 'Low', location: 'Gangtok, Sikkim', time: '7 hours ago' }
  ],
  cyclones: [
    { id: 1, lat: 20.9517, lng: 85.0985, severity: 'High', location: 'Bhubaneswar, Odisha', time: '30 minutes ago' },
    { id: 2, lat: 15.9129, lng: 79.7400, severity: 'Medium', location: 'Visakhapatnam, Andhra Pradesh', time: '2 hours ago' },
    { id: 3, lat: 13.0827, lng: 80.2707, severity: 'High', location: 'Chennai Coast, Tamil Nadu', time: '1 hour ago' },
    { id: 4, lat: 22.9868, lng: 87.8550, severity: 'Medium', location: 'Kolkata, West Bengal', time: '3 hours ago' }
  ],
  rainfall: [
    { id: 1, lat: 19.0760, lng: 72.8777, severity: 'High', location: 'Mumbai, Maharashtra', time: '15 minutes ago' },
    { id: 2, lat: 12.9716, lng: 77.5946, severity: 'Medium', location: 'Bangalore, Karnataka', time: '45 minutes ago' },
    { id: 3, lat: 26.9124, lng: 75.7873, severity: 'Low', location: 'Jaipur, Rajasthan', time: '2 hours ago' },
    { id: 4, lat: 23.0225, lng: 72.5714, severity: 'High', location: 'Ahmedabad, Gujarat', time: '1 hour ago' },
    { id: 5, lat: 28.7041, lng: 77.1025, severity: 'Medium', location: 'Delhi NCR', time: '30 minutes ago' }
  ]
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
  const [selectedDisaster, setSelectedDisaster] = useState('fires') // Default to fires
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
  
  // Create custom icons for different disaster types
  const createDisasterIcon = (disasterType, severity) => {
    const config = disasterTypes[disasterType]
    const size = severity === 'High' ? 32 : severity === 'Medium' ? 24 : 18
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${config.color}; 
          border-radius: 50%; 
          width: ${size}px; 
          height: ${size}px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <span style="color: white; font-size: ${size * 0.6}px; font-weight: bold;">
            ${disasterType === 'fires' ? '🔥' : 
              disasterType === 'floods' ? '🌊' : 
              disasterType === 'landslides' ? '🏔️' : 
              disasterType === 'cyclones' ? '🌪️' : '🌧️'}
          </span>
        </div>
      `,
      className: 'custom-disaster-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    })
  }
  
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Nav/>
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
      
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
        Geospatial Analysis {selectedState && `- ${selectedState}`}
      </h2>

      {/* Disaster Type Selector */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Disaster Type</h3>
          
          {/* Disaster Type Cards - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {Object.entries(disasterTypes).map(([key, config]) => {
              const IconComponent = config.icon
              const isSelected = selectedDisaster === key
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDisaster(key)}
                  className={`
                    relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 
                    ${isSelected 
                      ? `${config.bgColor} border-orange-500 shadow-lg transform scale-105` 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      ${isSelected ? 'bg-white shadow-md' : 'bg-gray-100'}
                    `}>
                      <IconComponent 
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isSelected ? config.textColor : 'text-gray-600'
                        }`} 
                      />
                    </div>
                    <span className={`
                      text-xs sm:text-sm font-medium text-center
                      ${isSelected ? config.textColor : 'text-gray-700'}
                    `}>
                      {config.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Selected Disaster Description */}
          <div className={`
            p-3 sm:p-4 rounded-lg ${disasterTypes[selectedDisaster].bgColor} 
            border ${disasterTypes[selectedDisaster].textColor.replace('text-', 'border-').replace('-700', '-200')}
          `}>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${disasterTypes[selectedDisaster].textColor}`}>
                {disasterTypes[selectedDisaster].name} Monitoring:
              </span>
              <span className="text-gray-700 text-sm">
                {disasterTypes[selectedDisaster].description}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* State Selector */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Focus on State:
          </label>
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition-colors whitespace-nowrap"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="flex flex-wrap -mb-px px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('severity')}
              className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'severity'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{disasterTypes[selectedDisaster].name} Distribution</span>
              </span>
            </button>
            
            {/* Fire-specific tabs only show when fires are selected */}
            {selectedDisaster === 'fires' && (
              <>
                <button
                  onClick={() => setActiveTab('fires')}
                  className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'fires'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🔥</span>
                    <span className="hidden sm:inline">Live Fire Detection</span>
                    <span className="sm:hidden">Live Fires</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('test')}
                  className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'test'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🧪</span>
                    <span className="hidden sm:inline">Test Fire Map</span>
                    <span className="sm:hidden">Test Map</span>
                  </span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'severity' && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4">
            {disasterTypes[selectedDisaster].name} Distribution
            {selectedState && ` - ${selectedState} Focus`}
          </h3>
          <div className="h-64 sm:h-96 rounded-lg overflow-hidden">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              className="leaflet-container w-full h-full"
              key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}-${selectedDisaster}`} // Force re-render when disaster type changes
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {/* Show real fire data for fires, dummy data for others */}
              {selectedDisaster === 'fires' ? (
                <GeoJSON data={{ type: 'FeatureCollection', features }} style={style} onEachFeature={(feature, layer) => {
                  layer.bindTooltip(`${feature.properties.name}: severity ${feature.properties.severity}`)
                  layer.on('mouseover', () => layer.setStyle({ weight: 2 }))
                  layer.on('mouseout', () => layer.setStyle({ weight: 1.5 }))
                }} />
              ) : (
                // Show dummy disaster markers for other disaster types
                dummyDisasterData[selectedDisaster]?.map((disaster) => (
                  <Marker
                    key={disaster.id}
                    position={[disaster.lat, disaster.lng]}
                    icon={createDisasterIcon(selectedDisaster, disaster.severity)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {disasterTypes[selectedDisaster].name} Alert
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Location:</strong> {disaster.location}</p>
                          <p><strong>Severity:</strong> 
                            <span className={`ml-1 px-2 py-1 rounded text-xs ${
                              disaster.severity === 'High' ? 'bg-red-100 text-red-700' :
                              disaster.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {disaster.severity}
                            </span>
                          </p>
                          <p><strong>Reported:</strong> {disaster.time}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <strong className="text-sm text-gray-700">Legend:</strong>
            <div className="flex flex-wrap gap-4 mt-2">
              {selectedDisaster === 'fires' ? (
                // Fire severity legend
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: '#b91c1c' }}></span>
                    <span className="text-sm">High Severity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: '#f97316' }}></span>
                    <span className="text-sm">Medium Severity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ background: '#fca5a5' }}></span>
                    <span className="text-sm">Low Severity</span>
                  </div>
                </>
              ) : (
                // Disaster marker legend
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                      {selectedDisaster === 'floods' ? '🌊' : 
                       selectedDisaster === 'landslides' ? '🏔️' : 
                       selectedDisaster === 'cyclones' ? '🌪️' : '🌧️'}
                    </div>
                    <span className="text-sm">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                      {selectedDisaster === 'floods' ? '🌊' : 
                       selectedDisaster === 'landslides' ? '🏔️' : 
                       selectedDisaster === 'cyclones' ? '🌪️' : '🌧️'}
                    </div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">
                      {selectedDisaster === 'floods' ? '🌊' : 
                       selectedDisaster === 'landslides' ? '🏔️' : 
                       selectedDisaster === 'cyclones' ? '🌪️' : '🌧️'}
                    </div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Statistics */}
          {selectedDisaster !== 'fires' && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dummyDisasterData[selectedDisaster]?.filter(d => d.severity === 'High').length || 0}
                </div>
                <div className="text-sm text-red-700">High Risk</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {dummyDisasterData[selectedDisaster]?.filter(d => d.severity === 'Medium').length || 0}
                </div>
                <div className="text-sm text-yellow-700">Medium Risk</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dummyDisasterData[selectedDisaster]?.filter(d => d.severity === 'Low').length || 0}
                </div>
                <div className="text-sm text-green-700">Low Risk</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dummyDisasterData[selectedDisaster]?.length || 0}
                </div>
                <div className="text-sm text-blue-700">Total Active</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'fires' && selectedDisaster === 'fires' && (
        <IndiaFireDetectionMap 
          selectedState={selectedState}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
        />
      )}
      {activeTab === 'test' && selectedDisaster === 'fires' && (
        <TestFireMap 
          selectedState={selectedState}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
        />
      )}
      
      {/* Message for non-fire disasters in fire-specific tabs */}
      {(activeTab === 'fires' || activeTab === 'test') && selectedDisaster !== 'fires' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">ℹ️</span>
            <h3 className="text-lg font-semibold text-yellow-800">Fire Detection Only</h3>
          </div>
          <p className="text-yellow-700">
            Fire detection tabs are only available when "Fires" is selected as the disaster type. 
            Please switch to the "Severity Distribution" tab to view {disasterTypes[selectedDisaster].name.toLowerCase()} data.
          </p>
          <button
            onClick={() => setActiveTab('severity')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            View {disasterTypes[selectedDisaster].name} Data
          </button>
        </div>
      )}
    </div>
  )
}
