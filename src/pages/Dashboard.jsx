import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Menu } from "lucide-react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { disasterMock } from "../utils/mockData.js";


// Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map interactions
function MapController({ selectedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation) {
      const zoom = selectedLocation.zoom || 12;
      map.flyTo([selectedLocation.lat, selectedLocation.lng], zoom, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedLocation, map]);
  
  return null;
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(disasterMock);
  const [baseLayer, setBaseLayer] = useState("map");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Handle marker click to zoom to location
  const handleMarkerClick = (disaster) => {
    setSelectedLocation(disaster);
  };

  // Reset zoom to show all markers
  const resetZoom = () => {
    setSelectedLocation({ lat: 20.5937, lng: 78.9629, zoom: 5 });
  };

  // Filter data based on search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFiltered(disasterMock);
    } else {
      const filtered = disasterMock.filter(disaster => 
        disaster.type.toLowerCase().includes(term) ||
        disaster.description.toLowerCase().includes(term) ||
        disaster.severity.toLowerCase().includes(term)
      );
      setFiltered(filtered);
    }
  };

  // Optional: Create a simple icon function for different disaster types
  const iconForType = (type) => {
    const colors = {
      'Earthquake': 'red',
      'Flood': 'blue', 
      'Wildfire': 'orange',
      'Hurricane': 'purple'
    };
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${colors[type] || 'gray'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md p-3 shadow-md">
        <button
          className="p-2 rounded-lg hover:bg-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>

        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/2 md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
        />

        <button
          onClick={resetZoom}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          Reset View
        </button>
      </div>

      {/* Map Fullscreen */}
      <MapContainer
        center={[20.5937, 78.9629]} // India
        zoom={5}
        className="w-full h-full"
        style={{ height: "100vh", width: "100%" }} // ✅ ensure height
      >
        <MapController selectedLocation={selectedLocation} />
        
        {baseLayer === "map" ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        ) : (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        )}

        {filtered && filtered.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={iconForType ? iconForType(d.type) : undefined}
            eventHandlers={{
              click: () => handleMarkerClick(d),
            }}
          >
            <Popup>
              <div className="max-w-sm">
                <div className="font-semibold">{d.type}</div>
                <div className="text-sm text-slate-600">{d.description}</div>
                <div className="text-xs mt-2">
                  Date: {d.date} | Severity: {d.severity}
                </div>
                <button 
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  onClick={() => handleMarkerClick(d)}
                >
                  Zoom Here
                </button>
              </div>
            </Popup>
            <Tooltip>
              {d.type} | {d.severity}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {isOpen && (
        <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          
          {/* Layer Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Map Layer</label>
            <select 
              value={baseLayer} 
              onChange={(e) => setBaseLayer(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="map">Street Map</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>

          {/* Filter by Disaster Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Filter by Type</label>
            <select 
              onChange={(e) => {
                if (e.target.value === "all") {
                  setFiltered(disasterMock);
                } else {
                  setFiltered(disasterMock.filter(d => d.type === e.target.value));
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Types</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Flood">Flood</option>
              <option value="Wildfire">Wildfire</option>
              <option value="Hurricane">Hurricane</option>
            </select>
          </div>

          <h3 className="text-md font-medium mb-2">Quick Actions</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:underline">Hospitals</li>
            <li className="cursor-pointer hover:underline">Shelters</li>
            <li className="cursor-pointer hover:underline">Food</li>
            <li className="cursor-pointer hover:underline">Routes</li>
          </ul>

          {/* Disaster List for quick zoom */}
          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">Active Disasters</h3>
            <div className="max-h-60 overflow-y-auto">
              {filtered && filtered.slice(0, 5).map((disaster) => (
                <div 
                  key={disaster.id}
                  className="p-2 mb-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleMarkerClick(disaster)}
                >
                  <div className="text-sm font-medium">{disaster.type}</div>
                  <div className="text-xs text-gray-600">{disaster.severity}</div>
                  <div className="text-xs text-blue-600">Click to zoom</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
