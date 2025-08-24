import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Test fires with India coordinates
const testFires = [
  { id: 1, latitude: 28.7041, longitude: 77.1025, confidence: "h", state: "Delhi" }, // Delhi
  { id: 2, latitude: 19.0760, longitude: 72.8777, confidence: "h", state: "Mumbai" }, // Mumbai
  { id: 3, latitude: 12.9716, longitude: 77.5946, confidence: "h", state: "Bangalore" }, // Bangalore
  { id: 4, latitude: 22.5726, longitude: 88.3639, confidence: "n", state: "Kolkata" } // Kolkata
];

// Test hospitals
const testHospitals = [
  { id: "h1", name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, state: "Delhi" },
  { id: "h2", name: "Tata Memorial", lat: 19.0176, lng: 72.8562, state: "Mumbai" },
  { id: "h3", name: "Manipal Hospital", lat: 12.9279, lng: 77.6271, state: "Bangalore" },
  { id: "h4", name: "SSKM Hospital", lat: 22.5720, lng: 88.3645, state: "Kolkata" }
];

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest hospital
function findNearestHospital(fireLat, fireLng) {
  let nearestHospital = null;
  let minDistance = Infinity;

  testHospitals.forEach(hospital => {
    const distance = calculateDistance(fireLat, fireLng, hospital.lat, hospital.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestHospital = { ...hospital, distance: distance.toFixed(2) };
    }
  });

  console.log(`Fire at ${fireLat}, ${fireLng} -> Nearest: ${nearestHospital?.name} (${nearestHospital?.distance}km)`);
  return nearestHospital;
}

// Simple route (straight line for testing)
function createSimpleRoute(startLat, startLng, endLat, endLng) {
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  return {
    coordinates: [[startLat, startLng], [endLat, endLng]],
    distance: distance.toFixed(2),
    duration: Math.round(distance * 2)
  };
}

export default function TestFireMap() {
  console.log('TestFireMap rendering with fires:', testFires);
  
  const [routes, setRoutes] = useState([]);
  const [selectedFire, setSelectedFire] = useState(null);

  useEffect(() => {
    console.log('TestFireMap mounted - generating test routes');
    
    // Generate routes for all high confidence fires
    const testRoutes = testFires
      .filter(fire => fire.confidence === 'h')
      .map(fire => {
        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);
        if (nearestHospital) {
          const route = createSimpleRoute(fire.latitude, fire.longitude, nearestHospital.lat, nearestHospital.lng);
          return {
            id: `route-${fire.id}`,
            fire: fire,
            hospital: nearestHospital,
            route: route
          };
        }
        return null;
      })
      .filter(Boolean);
    
    console.log('Generated test routes:', testRoutes);
    setRoutes(testRoutes);
  }, []);

  const handleFireClick = (fire) => {
    console.log('Fire clicked:', fire);
    setSelectedFire(fire);
    
    const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);
    console.log('Nearest hospital for clicked fire:', nearestHospital);
  };

  return (
    <div className="w-full">
      <div className="bg-yellow-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-bold">🧪 Test Fire Map - Hospital Routing Demo</h3>
        <div className="text-sm mt-2">
          <p><strong>Fires:</strong> {testFires.length} total, {testFires.filter(f => f.confidence === 'h').length} high confidence</p>
          <p><strong>Hospitals:</strong> {testHospitals.length} test hospitals</p>
          <p><strong>Routes:</strong> {routes.length} auto-generated</p>
        </div>
        <button 
          onClick={() => {
            console.log('=== Manual Test ===');
            testFires.forEach(fire => {
              const hospital = findNearestHospital(fire.latitude, fire.longitude);
              console.log(`${fire.state} fire -> ${hospital.name} (${hospital.distance}km)`);
            });
          }}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Test All Distances (Check Console)
        </button>
      </div>

      {selectedFire && (
        <div className="bg-red-100 p-4 mb-4 rounded">
          <h4 className="font-bold">Selected Fire: {selectedFire.state}</h4>
          <p>Coordinates: {selectedFire.latitude}, {selectedFire.longitude}</p>
          <p>Confidence: {selectedFire.confidence}</p>
          {(() => {
            const nearestHospital = findNearestHospital(selectedFire.latitude, selectedFire.longitude);
            return (
              <div className="mt-2 p-2 bg-green-100 rounded">
                <strong>Nearest Hospital:</strong> {nearestHospital.name} ({nearestHospital.distance}km)
              </div>
            );
          })()}
        </div>
      )}
      
      <div className="bg-white border-2 border-blue-500">
        <MapContainer 
          center={[20.5, 77.5]} 
          zoom={5} 
          className="w-full h-96"
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer 
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          
          {/* Fire Markers */}
          {testFires.map((fire) => (
            <CircleMarker
              key={fire.id}
              center={[fire.latitude, fire.longitude]}
              radius={12}
              color="#ffffff"
              weight={3}
              fillColor={fire.confidence === 'h' ? '#dc2626' : '#f97316'}
              fillOpacity={0.8}
              eventHandlers={{
                click: () => handleFireClick(fire)
              }}
            >
              <Popup>
                <div>
                  <h4 className="font-bold">🔥 Fire: {fire.state}</h4>
                  <p>Confidence: {fire.confidence}</p>
                  <p>Lat: {fire.latitude}, Lng: {fire.longitude}</p>
                  {(() => {
                    const hospital = findNearestHospital(fire.latitude, fire.longitude);
                    return (
                      <div className="mt-2 p-1 bg-green-100 rounded text-xs">
                        <strong>Nearest Hospital:</strong><br/>
                        {hospital.name} ({hospital.distance}km)
                      </div>
                    );
                  })()}
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Hospital Markers */}
          {testHospitals.map((hospital) => (
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
                  <h4 className="font-bold">🏥 {hospital.name}</h4>
                  <p>Location: {hospital.state}</p>
                  <p>Lat: {hospital.lat}, Lng: {hospital.lng}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Routes */}
          {routes.map((routeData) => (
            <Polyline 
              key={routeData.id}
              positions={routeData.route.coordinates}
              color="#dc2626"
              weight={4}
              opacity={0.8}
              dashArray="10, 5"
            />
          ))}
        </MapContainer>
        
        <div className="p-4 bg-blue-50">
          <h4 className="font-bold mb-2">Route Information:</h4>
          <div className="text-sm space-y-1">
            {routes.map((routeData) => (
              <div key={routeData.id} className="p-2 bg-white rounded">
                <strong>{routeData.fire.state} Fire</strong> → {routeData.hospital.name} 
                <span className="text-blue-600 ml-2">({routeData.route.distance}km)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}