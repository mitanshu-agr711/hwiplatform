import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  MarkerClusterer,
  useLoadScript,
} from "@react-google-maps/api";
import { Menu, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { disasterMock } from "../utils/mockData.js";

// Map container style
const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India

// Dummy disaster data for fallback
const fallbackDisasters = [
  { id: 1, type: "Flood", lat: 28.7041, lng: 77.1025, severity: "High", description: "Delhi Floods" },
  { id: 2, type: "Earthquake", lat: 19.076, lng: 72.8777, severity: "Medium", description: "Mumbai tremors" },
  { id: 3, type: "Wildfire", lat: 22.5726, lng: 88.3639, severity: "Low", description: "Kolkata nearby forest fire" },
];

// Fix marker issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [disasters, setDisasters] = useState([]);
  const [filteredDisasters, setFilteredDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  const [filtered, setFiltered] = useState(disasterMock);
  const [baseLayer, setBaseLayer] = useState("map");
  const [searchTerm, setSearchTerm] = useState("");
  const [mapZoom, setMapZoom] = useState(5);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Load Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch disaster data
  useEffect(() => {
    const fetchDisasters = async () => {
      setLoading(true);
      try {
        // Replace with your API endpoint
        const res = await fetch("https://api.example.com/disasters");
        const data = await res.json();
        setDisasters(data);
        setFilteredDisasters(data);
      } catch (err) {
        console.error("Fetching disasters failed, using fallback data", err);
        setDisasters(fallbackDisasters);
        setFilteredDisasters(fallbackDisasters);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (err) => console.error(err)
      );
    }
  }, []);

  const handleFilterType = (type) => {
    setSelectedType(type);
    if (type === "all") setFilteredDisasters(disasters);
    else setFilteredDisasters(disasters.filter((d) => d.type === type));
  };

  const onLoadAutocomplete = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const loc = place.geometry.location;
        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
      }
    }
  };

  const getMarkerIcon = (type) => {
    const colors = { Earthquake: "red", Flood: "blue", Wildfire: "orange", Hurricane: "purple" };
    return `http://maps.google.com/mapfiles/ms/icons/${colors[type] || "gray"}-dot.png`;
  };

  // Geocoding function to search for locations
  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=IN&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const suggestions = data.map((item) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type,
          importance: item.importance,
        }));
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle location selection
  const selectLocation = (location) => {
    setMapCenter({ lat: location.lat, lng: location.lon });

    let zoomLevel = 10;
    if (location.type === "state" || location.type === "administrative") {
      zoomLevel = 8;
    } else if (location.type === "city" || location.type === "town") {
      zoomLevel = 12;
    } else if (location.type === "village" || location.type === "suburb") {
      zoomLevel = 14;
    }

    setMapZoom(zoomLevel);
    setSearchTerm(location.display_name.split(",")[0]);
    setShowSuggestions(false);
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(term);
    }, 500);

    if (term === "") {
      setFiltered(disasterMock);
    } else {
      const filteredDisasters = disasterMock.filter(
        (disaster) =>
          disaster.type.toLowerCase().includes(term.toLowerCase()) ||
          disaster.description.toLowerCase().includes(term.toLowerCase()) ||
          disaster.severity.toLowerCase().includes(term.toLowerCase())
      );
      setFiltered(filteredDisasters);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      selectLocation(searchSuggestions[0]);
    }
  };

  const resetView = () => {
    setMapCenter(defaultCenter);
    setMapZoom(5);
    setSearchTerm("");
    setShowSuggestions(false);
    setFiltered(disasterMock);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading map...</span>
      </div>
    );

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

        {/* Google Autocomplete */}
        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search any location..."
            className="w-1/2 md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
          />
        </Autocomplete>
      </div>

      {/* Google Map */}
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={mapZoom}>
        {/* User Location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {/* Clustered Disaster Markers */}
        <MarkerClusterer>
          {(clusterer) =>
            filteredDisasters.map((d) => (
              <Marker
                key={d.id}
                position={{ lat: d.lat, lng: d.lng }}
                clusterer={clusterer}
                icon={{ url: getMarkerIcon(d.type), scaledSize: new window.google.maps.Size(32, 32) }}
                onClick={() => setSelectedDisaster(d)}
                animation={window.google.maps.Animation.DROP}
              />
            ))
          }
        </MarkerClusterer>

        {selectedDisaster && (
          <InfoWindow
            position={{ lat: selectedDisaster.lat, lng: selectedDisaster.lng }}
            onCloseClick={() => setSelectedDisaster(null)}
          >
            <div className="p-2">
              <h4 className="font-bold text-lg">{selectedDisaster.type}</h4>
              <p className="my-2">{selectedDisaster.description}</p>
              <p className="text-sm">
                Severity: <span className="font-medium">{selectedDisaster.severity}</span>
              </p>
              <div className="mt-2 text-sm text-blue-600">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDisaster.lat},${selectedDisaster.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Sidebar */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          <label className="block text-sm font-medium mb-2">Filter by Type</label>
          <select
            value={selectedType}
            onChange={(e) => handleFilterType(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="all">All Types</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Flood">Flood</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Hurricane">Hurricane</option>
          </select>

          <button
            onClick={() => setMapCenter(userLocation || defaultCenter)}
            className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Center to My Location
          </button>
        </div>
      )}
    </div>
  );
}
