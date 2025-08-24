import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { indiaFireData, indianHospitals } from '../utils/indiaFireData.js';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Utility functions
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function findNearestHospital(fireLat, fireLng) {
  let nearestHospital = null;
  let minDistance = Infinity;

  indianHospitals.forEach(hospital => {
    const distance = calculateDistance(fireLat, fireLng, hospital.lat, hospital.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestHospital = { ...hospital, distance: distance.toFixed(2) };
    }
  });

  console.log(`🔥 Fire at ${fireLat.toFixed(4)}, ${fireLng.toFixed(4)} -> Nearest hospital: ${nearestHospital?.name} (${nearestHospital?.distance}km away)`);
  return nearestHospital;
}

async function getRoadRoute(startLat, startLng, endLat, endLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      return {
        coordinates: coordinates,
        distance: (route.distance / 1000).toFixed(2),
        duration: Math.round(route.duration / 60),
        steps: route.legs[0]?.steps || []
      };
    } else {
      // Fallback to straight line
      const distance = calculateDistance(startLat, startLng, endLat, endLng);
      return {
        coordinates: [[startLat, startLng], [endLat, endLng]],
        distance: distance.toFixed(2),
        duration: Math.round(distance * 2),
        steps: [],
        fallback: true
      };
    }
  } catch (error) {
    console.error('Routing error:', error);
    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    return {
      coordinates: [[startLat, startLng], [endLat, endLng]],
      distance: distance.toFixed(2),
      duration: Math.round(distance * 2),
      steps: [],
      fallback: true
    };
  }
}

function getConfidenceColor(confidence) {
  switch (confidence) {
    case 'h': return '#dc2626'; // Red
    case 'n': return '#f97316'; // Orange
    case 'l': return '#fbbf24'; // Yellow
    default: return '#6b7280';
  }
}

function getConfidenceLabel(confidence) {
  switch (confidence) {
    case 'h': return 'High';
    case 'n': return 'Medium';
    case 'l': return 'Low';
    default: return 'Unknown';
  }
}

export default function IndiaFireDetectionMap() {
  const [filters, setFilters] = useState({
    showHigh: true,
    showMedium: true,
    showLow: true,
    showHospitals: true,
    showEmergencyRoutes: false
  });
  
  const [selectedFire, setSelectedFire] = useState(null);
  const [emergencyRoutes, setEmergencyRoutes] = useState([]);
  const [affectedRoutes, setAffectedRoutes] = useState([]);

  const filteredFires = indiaFireData.fires.filter(fire => {
    if (fire.confidence === 'h' && !filters.showHigh) return false;
    if (fire.confidence === 'n' && !filters.showMedium) return false;
    if (fire.confidence === 'l' && !filters.showLow) return false;
    return true;
  });

  const statistics = {
    total: filteredFires.length,
    high: filteredFires.filter(f => f.confidence === 'h').length,
    medium: filteredFires.filter(f => f.confidence === 'n').length,
    low: filteredFires.filter(f => f.confidence === 'l').length,
    avgBrightness: (filteredFires.reduce((sum, f) => sum + f.brightness, 0) / filteredFires.length).toFixed(1)
  };

  // Handle fire click
  const handleFireClick = async (fire) => {
    setSelectedFire(fire);
    
    const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);
    if (nearestHospital) {
      const route = await getRoadRoute(
        fire.latitude, 
        fire.longitude, 
        nearestHospital.lat, 
        nearestHospital.lng
      );
      
      if (route) {
        const newRoute = {
          id: `selected-route-${fire.id}`,
          fire: fire,
          hospital: nearestHospital,
          route: route,
          type: 'selected'
        };
        
        setEmergencyRoutes(prev => {
          const filtered = prev.filter(r => r.type !== 'selected');
          return [...filtered, newRoute];
        });
      }
    }
  };

  // Toggle emergency routes
  const toggleEmergencyRoutes = async () => {
    if (!filters.showEmergencyRoutes) {
      const routes = [];
      const highConfidenceFires = filteredFires.filter(fire => fire.confidence === 'h');
      
      for (const fire of highConfidenceFires) {
        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);
        if (nearestHospital) {
          const route = await getRoadRoute(
            fire.latitude, 
            fire.longitude, 
            nearestHospital.lat, 
            nearestHospital.lng
          );
          
          if (route) {
            routes.push({
              id: `emergency-route-${fire.id}`,
              fire: fire,
              hospital: nearestHospital,
              route: route,
              type: 'emergency'
            });
          }
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
      }
      
      setEmergencyRoutes(prev => [...prev.filter(r => r.type === 'selected'), ...routes]);
    } else {
      setEmergencyRoutes(prev => prev.filter(r => r.type === 'selected'));
    }
    
    setFilters(prev => ({ ...prev, showEmergencyRoutes: !prev.showEmergencyRoutes }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">🛰️ India Fire Detection & Emergency Response Map</h2>
      
      {/* Fire Detection Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Fire Detection Statistics</h3>
        <div className="grid grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{statistics.total}</div>
            <div className="text-sm text-gray-600">Total Fires</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{statistics.high}</div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{statistics.medium}</div>
            <div className="text-sm text-gray-600">Medium Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{statistics.low}</div>
            <div className="text-sm text-gray-600">Low Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{statistics.avgBrightness}K</div>
            <div className="text-sm text-gray-600">Avg Brightness</div>
          </div>
        </div>
      </div>

      {/* Map Controls & Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Map Controls & Filters</h3>
        <div className="grid grid-cols-2 gap-8">
          {/* Fire Confidence Levels */}
          <div>
            <h4 className="font-medium mb-3">Fire Confidence Levels</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showHigh}
                  onChange={(e) => setFilters(prev => ({ ...prev, showHigh: e.target.checked }))}
                  className="mr-2"
                />
                <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                High Confidence ({statistics.high})
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showMedium}
                  onChange={(e) => setFilters(prev => ({ ...prev, showMedium: e.target.checked }))}
                  className="mr-2"
                />
                <span className="w-3 h-3 rounded-full bg-orange-600 mr-2"></span>
                Medium Confidence ({statistics.medium})
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showLow}
                  onChange={(e) => setFilters(prev => ({ ...prev, showLow: e.target.checked }))}
                  className="mr-2"
                />
                <span className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></span>
                Low Confidence ({statistics.low})
              </label>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredFires.length} of {indiaFireData.fires.length} fires
            </div>
          </div>

          {/* Emergency Services */}
          <div>
            <h4 className="font-medium mb-3">Emergency Services</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showHospitals}
                  onChange={(e) => setFilters(prev => ({ ...prev, showHospitals: e.target.checked }))}
                  className="mr-2"
                />
                <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                Show Hospitals ({indianHospitals.length})
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showEmergencyRoutes}
                  onChange={(e) => toggleEmergencyRoutes()}
                  className="mr-2"
                />
                <span className="w-3 h-3 bg-red-600 mr-2"></span>
                Show Emergency Routes
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={affectedRoutes.length > 0}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      // Generate affected routes from urban fires to safe hospitals
                      const urbanFires = filteredFires.filter(fire => fire.type === 'Urban' && fire.confidence === 'h');
                      const newAffectedRoutes = [];
                      
                      for (const fire of urbanFires) {
                        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);
                        const route = await getRoadRoute(fire.latitude, fire.longitude, nearestHospital.lat, nearestHospital.lng);
                        
                        newAffectedRoutes.push({
                          id: `affected-${fire.id}`,
                          fire: fire,
                          hospital: nearestHospital,
                          route: route,
                          type: 'evacuation'
                        });
                      }
                      
                      setAffectedRoutes(newAffectedRoutes);
                      console.log(`🚨 Generated ${newAffectedRoutes.length} evacuation routes for urban fires`);
                    } else {
                      setAffectedRoutes([]);
                    }
                  }}
                  className="mr-2"
                />
                <span className="w-3 h-3 bg-orange-600 mr-2"></span>
                Show Affected Routes
              </label>
            </div>
            <button 
              onClick={() => {
                console.log('=== Testing Nearest Hospital Calculations ===');
                filteredFires.slice(0, 5).forEach(fire => {
                  const hospital = findNearestHospital(fire.latitude, fire.longitude);
                  console.log(`${fire.district}, ${fire.state} -> ${hospital.name} (${hospital.distance}km)`);
                });
                console.log('=== Check browser console for results ===');
              }}
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Test Hospital Routing (Check Console)
            </button>
          </div>
        </div>
      </div>

      {/* Selected Fire Panel */}
      {selectedFire && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-red-800">🔥 Selected Fire Details</h3>
            <button 
              onClick={() => {
                setSelectedFire(null);
                setEmergencyRoutes(prev => prev.filter(r => r.type !== 'selected'));
              }}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div><strong>Location:</strong> {selectedFire.district}, {selectedFire.state}</div>
              <div><strong>Coordinates:</strong> {selectedFire.latitude.toFixed(4)}, {selectedFire.longitude.toFixed(4)}</div>
              <div><strong>Confidence:</strong> {getConfidenceLabel(selectedFire.confidence)}</div>
              <div><strong>Type:</strong> {selectedFire.type}</div>
            </div>
            <div>
              <div><strong>Brightness:</strong> {selectedFire.brightness.toFixed(1)}K</div>
              <div><strong>Date:</strong> {selectedFire.acquisition_date}</div>
              <div><strong>Time:</strong> {selectedFire.acquisition_time}</div>
              <div><strong>Satellite:</strong> {selectedFire.satellite}</div>
            </div>
          </div>
          
          {(() => {
            const selectedRoute = emergencyRoutes.find(r => r.type === 'selected' && r.fire.id === selectedFire.id);
            return selectedRoute ? (
              <div className="mt-4 p-3 bg-green-100 rounded">
                <h4 className="font-medium">🚗 Route to Nearest Hospital</h4>
                <div className="text-sm mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <div><strong>Hospital:</strong> {selectedRoute.hospital.name}</div>
                    <div><strong>Type:</strong> {selectedRoute.hospital.type}</div>
                  </div>
                  <div>
                    <div><strong>Distance:</strong> {selectedRoute.route.distance} km</div>
                    <div><strong>Est. Time:</strong> {selectedRoute.route.duration} minutes</div>
                  </div>
                </div>
                {selectedRoute.route.fallback && (
                  <div className="text-orange-600 font-medium mt-2 text-sm">⚠️ Direct route (routing service unavailable)</div>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: '600px', width: '100%' }}
        >
          {/* Satellite View */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution=""
          />

          {/* Fire Markers */}
          {filteredFires.map((fire) => (
            <CircleMarker
              key={fire.id}
              center={[fire.latitude, fire.longitude]}
              radius={Math.max(8, fire.brightness / 40)}
              color="#ffffff"
              weight={2}
              fillColor={getConfidenceColor(fire.confidence)}
              fillOpacity={0.8}
              eventHandlers={{
                click: () => handleFireClick(fire)
              }}
            >
              <Popup>
                <div>
                  <h4 className="font-bold text-red-600">🔥 Fire Detection Alert</h4>
                  <div className="text-sm mt-2">
                    <div><strong>Location:</strong> {fire.district}, {fire.state}</div>
                    <div><strong>Confidence:</strong> {getConfidenceLabel(fire.confidence)}</div>
                    <div><strong>Type:</strong> {fire.type}</div>
                    <div><strong>Brightness:</strong> {fire.brightness.toFixed(1)}K</div>
                    <div><strong>Time:</strong> {fire.acquisition_date} {fire.acquisition_time}</div>
                  </div>
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                    Click this marker to see route to nearest hospital
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs text-center">
                  🔥 {fire.district}<br/>
                  {getConfidenceLabel(fire.confidence)} Risk
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Hospital Markers */}
          {filters.showHospitals && indianHospitals.map((hospital) => (
            <CircleMarker
              key={hospital.id}
              center={[hospital.lat, hospital.lng]}
              radius={8}
              color="#ffffff"
              weight={2}
              fillColor="#2563eb"
              fillOpacity={0.9}
            >
              <Popup>
                <div>
                  <h4 className="font-bold text-blue-600">🏥 {hospital.name}</h4>
                  <div className="text-sm mt-1">
                    <div><strong>Type:</strong> {hospital.type}</div>
                    <div><strong>Emergency:</strong> {hospital.emergency ? 'Available' : 'Not Available'}</div>
                    <div><strong>State:</strong> {hospital.state}</div>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs text-center">
                  🏥 {hospital.name}<br/>
                  {hospital.type}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
          
          {/* Emergency Routes */}
          {emergencyRoutes.map((routeData) => (
            <Polyline 
              key={routeData.id}
              positions={routeData.route.coordinates}
              color={routeData.type === 'selected' ? "#1d4ed8" : "#dc2626"}
              weight={routeData.type === 'selected' ? 5 : 3}
              opacity={0.8}
              dashArray={routeData.type === 'selected' ? "none" : "10, 5"}
            />
          ))}

          {/* Affected/Evacuation Routes */}
          {affectedRoutes.map((routeData, index) => (
            <Polyline 
              key={`affected-${index}`}
              positions={routeData.route?.coordinates || [[routeData.fire.latitude, routeData.fire.longitude], [routeData.hospital.lat, routeData.hospital.lng]]}
              color="#ea580c"
              weight={4}
              opacity={0.6}
              dashArray="15, 10"
            />
          ))}
        </MapContainer>
      </div>

      {/* Information Panel */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">🛣️ Real Road Navigation Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Satellite View:</strong> High-resolution imagery for precise location identification</li>
          <li>• <strong>Real Road Routes:</strong> Actual driving directions using OpenStreetMap routing</li>
          <li>• <strong>Emergency Routing:</strong> Toggle to show routes from high-risk fires to nearest hospitals</li>
          <li>• <strong>Affected Routes:</strong> Evacuation paths from urban fires to safe zones (orange dashed lines)</li>
          <li>• <strong>Interactive Selection:</strong> Click any fire to see detailed route information</li>
          <li>• <strong>Hospital Network:</strong> {indianHospitals.length} emergency hospitals across India</li>
        </ul>
      </div>
    </div>
  );
}