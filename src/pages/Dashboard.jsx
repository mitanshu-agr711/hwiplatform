import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
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

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(disasterMock);
  const [baseLayer, setBaseLayer] = useState("map");
  const [searchTerm, setSearchTerm] = useState("");

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
      </div>

      {/* Map Fullscreen */}
      <MapContainer
        center={[20.5937, 78.9629]} // India
        zoom={5}
        className="w-full h-full"
        style={{ height: "100vh", width: "100%" }} // ✅ ensure height
      >
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
          >
            <Popup>
              <div className="max-w-sm">
                <div className="font-semibold">{d.type}</div>
                <div className="text-sm text-slate-600">{d.description}</div>
                <div className="text-xs mt-2">
                  Date: {d.date} | Severity: {d.severity}
                </div>
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
        </div>
      )}
    </div>
  );
}
