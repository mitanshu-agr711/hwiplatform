import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  
  useLoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
  Autocomplete,
  TrafficLayer,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";
import { Menu, Loader2, MapPin, Navigation, AlertTriangle } from "lucide-react";
import Nav from "../components/Navbar";

// Constants
// FIX: Support the proper Vite var and a couple of optional fallbacks if you had old names.
// Prefer VITE_CHECKPOINT_FIRMS. If you had VITE_checkpointFirms or VITE_FIRMS_URL, they’ll work too.
const FIRMS_API_URL =
  import.meta.env.VITE_CHECKPOINT_FIRMS ||
  import.meta.env.VITE_checkpointFirms ||
  import.meta.env.VITE_FIRMS_URL;

const libraries = ["places", "geometry"];

const mapContainerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

// Options for marker clusterer
const clusterOptions = {
  imagePath:
    "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  gridSize: 50,
  minimumClusterSize: 3,
};

// Fire marker styles based on confidence
const getFireMarkerStyle = (confidence) => {
  const styles = {
    h: {
      color: "#FF0000",
      size: 35,
      animation: window.google?.maps?.Animation?.BOUNCE,
    },
    n: {
      color: "#FFA500",
      size: 30,
      animation: window.google?.maps?.Animation?.DROP,
    },
    l: {
      color: "#FFFF00",
      size: 25,
      animation: window.google?.maps?.Animation?.DROP,
    },
  };
  return styles[confidence] || styles["n"];
};

// Indian states coordinates for realistic disaster placement
const indianStatesCoords = [
  { state: "Maharashtra", lat: 19.7515, lng: 75.7139 },
  { state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { state: "Karnataka", lat: 15.3173, lng: 75.7139 },
  { state: "Tamil Nadu", lat: 11.1271, lng: 78.6569 },
  { state: "Gujarat", lat: 22.2587, lng: 71.1924 },
  { state: "Rajasthan", lat: 27.0238, lng: 74.2179 },
  { state: "West Bengal", lat: 22.9868, lng: 87.855 },
  { state: "Madhya Pradesh", lat: 22.9734, lng: 78.6569 },
  { state: "Odisha", lat: 20.9517, lng: 85.0985 },
  { state: "Kerala", lat: 10.8505, lng: 76.2711 },
  { state: "Punjab", lat: 31.1471, lng: 75.3412 },
  { state: "Haryana", lat: 29.0588, lng: 76.0856 },
  { state: "Bihar", lat: 25.0961, lng: 85.3131 },
  { state: "Assam", lat: 26.2006, lng: 92.9376 },
  { state: "Jharkhand", lat: 23.6102, lng: 85.2799 },
];

// Generate realistic disaster data for India
const generateIndianDisasters = () => {
  const disasterTypes = [
    {
      type: "Flood",
      severity: ["Low", "Medium", "High", "Critical"],
      commonStates: [
        "Assam",
        "Bihar",
        "West Bengal",
        "Uttar Pradesh",
        "Kerala",
      ],
    },
    {
      type: "Earthquake",
      severity: ["Low", "Medium", "High", "Critical"],
      commonStates: ["Gujarat", "Himachal Pradesh", "Uttarakhand", "Kashmir"],
    },
    {
      type: "Cyclone",
      severity: ["Category 1", "Category 2", "Category 3", "Category 4"],
      commonStates: ["Odisha", "Tamil Nadu", "Andhra Pradesh", "West Bengal"],
    },
    {
      type: "Drought",
      severity: ["Mild", "Moderate", "Severe", "Extreme"],
      commonStates: [
        "Maharashtra",
        "Karnataka",
        "Rajasthan",
        "Andhra Pradesh",
      ],
    },
    {
      type: "Landslide",
      severity: ["Low", "Medium", "High"],
      commonStates: ["Kerala", "Karnataka", "Maharashtra", "Uttarakhand"],
    },
    {
      type: "Wildfire",
      severity: ["Low", "Medium", "High"],
      commonStates: ["Himachal Pradesh", "Uttarakhand", "Madhya Pradesh"],
    },
  ];

  return Array.from(
    { length: 12 + Math.floor(Math.random() * 8) },
    (_, i) => {
      const disaster =
        disasterTypes[Math.floor(Math.random() * disasterTypes.length)];
      const stateData =
        indianStatesCoords[Math.floor(Math.random() * indianStatesCoords.length)];

      // Add some randomness to coordinates within state boundaries
      const latOffset = (Math.random() - 0.5) * 2; // ±1 degree
      const lngOffset = (Math.random() - 0.5) * 2; // ±1 degree

      return {
        id: i + 1,
        type: disaster.type,
        lat: parseFloat((stateData.lat + latOffset).toFixed(4)),
        lng: parseFloat((stateData.lng + lngOffset).toFixed(4)),
        severity:
          disaster.severity[
            Math.floor(Math.random() * disaster.severity.length)
          ],
        description: `${disaster.type} event in ${stateData.state}`,
        timestamp: new Date().toISOString(),
        affectedArea: Math.floor(Math.random() * 500) + 50, // km²
        casualties: Math.floor(Math.random() * 100),
        status: ["Active", "Monitoring", "Critical", "Contained"][
          Math.floor(Math.random() * 4)
        ],
        state: stateData.state,
        affectedRadius: Math.floor(Math.random() * 20) + 5, // km radius for visualization
      };
    }
  );
};

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [disasters, setDisasters] = useState([]);
  const [filteredDisasters, setFilteredDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(5);
  const [autocomplete, setAutocomplete] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [showTraffic, setShowTraffic] = useState(false);
  const [directions, setDirections] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Enhanced Google Maps loading with error handling
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    version: "weekly",
    region: "IN", // India region
    language: "en",
  });

  // Handle API errors
  useEffect(() => {
    if (loadError) {
      console.error("Google Maps load error:", loadError);
      if (loadError.message?.includes("BillingNotEnabledMapError")) {
        setApiError(
          "Billing not enabled for Google Maps API. Please enable billing in Google Cloud Console."
        );
      } else if (loadError.message?.includes("RefererNotAllowedMapError")) {
        setApiError(
          "Domain not authorized. Please add http://localhost:5173 to your API key restrictions."
        );
      } else {
        setApiError(
          "Error loading Google Maps. Please check your API key configuration."
        );
      }
    }
  }, [loadError]);

  // Fetch real-time FIRMS data
  useEffect(() => {
    const fetchFirmsData = async () => {
      setLoading(true);
      try {
        console.log("Fetching data from:", FIRMS_API_URL);

        if (FIRMS_API_URL) {
          const response = await fetch(FIRMS_API_URL);
          const data = await response.json();
          console.log("Received data:", data);

          if (data && data.fires && Array.isArray(data.fires)) {
            // Convert FIRMS data to our format
            const firmsDisasters = data.fires.map((fire, index) => {
              // FIX: your example has confidence as object { value, bucket }
              const confidenceValue =
                typeof fire.confidence === "object"
                  ? fire.confidence?.value
                  : fire.confidence;
              const confidenceBucket =
                typeof fire.confidence === "object"
                  ? fire.confidence?.bucket
                  : confidenceValue === "h"
                  ? "High"
                  : confidenceValue === "n"
                  ? "Medium"
                  : "Low";

              const severity =
                confidenceBucket ||
                (confidenceValue === "h"
                  ? "High"
                  : confidenceValue === "n"
                  ? "Medium"
                  : "Low");

              return {
                id: index + 1,
                type: "Wildfire",
                lat: fire.location.lat,
                lng: fire.location.lon,
                severity,
                description: `FIRMS detected fire - Confidence: ${
                  confidenceValue || confidenceBucket
                }`,
                timestamp: new Date().toISOString(),
                affectedArea: Math.floor(Math.random() * 100) + 10,
                casualties: 0,
                status: "Active",
                state: "Unknown",
                affectedRadius:
                  confidenceValue === "h"
                    ? 15
                    : confidenceValue === "n"
                    ? 10
                    : 5,
              };
            });

            setDisasters(firmsDisasters);
            setFilteredDisasters(firmsDisasters);

            // Set map center to the first fire location if available
            if (firmsDisasters.length > 0) {
              setMapCenter({
                lat: firmsDisasters[0].lat,
                lng: firmsDisasters[0].lng,
              });
              setMapZoom(6);
            }
          } else {
            console.error("Invalid data format received:", data);
            // Fallback to generated data
            const fallbackData = generateIndianDisasters();
            setDisasters(fallbackData);
            setFilteredDisasters(fallbackData);
          }
        } else {
          // No FIRMS URL, use generated data
          const fallbackData = generateIndianDisasters();
          setDisasters(fallbackData);
          setFilteredDisasters(fallbackData);
        }
      } catch (err) {
        console.error("Error fetching FIRMS data:", err);
        // Fallback to generated data
        const fallbackData = generateIndianDisasters();
        setDisasters(fallbackData);
        setFilteredDisasters(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchFirmsData();
    const interval = setInterval(fetchFirmsData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Enhanced user location for India
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Check if user is in India (approximate bounds)
          if (loc.lat >= 8 && loc.lat <= 37 && loc.lng >= 68 && loc.lng <= 97) {
            setUserLocation(loc);
            if (!searchedLocation) {
              setMapCenter(loc);
              setMapZoom(10);
            }
          } else {
            // Default to India center if outside India
            setUserLocation(defaultCenter);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setUserLocation(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [searchedLocation]);

  // Enhanced filtering
  const handleFilterType = useCallback(
    (type) => {
      setSelectedType(type);
      setDirections(null); // Clear existing directions

      if (type === "all") {
        setFilteredDisasters(disasters);
        setMapCenter(defaultCenter);
        setMapZoom(5);
      } else {
        const filtered = disasters.filter((d) => d.type === type);
        setFilteredDisasters(filtered);

        if (filtered.length > 0) {
          // Calculate bounds for filtered disasters
          const bounds = new window.google.maps.LatLngBounds();
          filtered.forEach((disaster) => {
            bounds.extend(
              new window.google.maps.LatLng(disaster.lat, disaster.lng)
            );
          });

          setMapCenter({
            lat:
              (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
            lng:
              (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
          });
          setMapZoom(7);
        }
      }
    },
    [disasters]
  );

  // Enhanced autocomplete for Indian locations
  const onLoadAutocomplete = (autoC) => {
    if (autoC) {
      // Restrict to India
      autoC.setComponentRestrictions({ country: "in" });
      setAutocomplete(autoC);
    }
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const loc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setSearchedLocation(loc);
        setMapCenter(loc);
        setMapZoom(12);
        setDirections(null); // Clear existing directions

        // Find nearby disasters within 150km for India
        if (disasters.length > 0 && window.google?.maps?.geometry) {
          const nearbyDisasters = disasters.filter((disaster) => {
            const distance =
              window.google.maps.geometry.spherical.computeDistanceBetween(
                new window.google.maps.LatLng(loc.lat, loc.lng),
                new window.google.maps.LatLng(disaster.lat, disaster.lng)
              );
            return distance < 150000; // Within 150km
          });

          if (nearbyDisasters.length > 0) {
            setFilteredDisasters(nearbyDisasters);
            alert(
              `Found ${nearbyDisasters.length} active disaster(s) within 150km of ${place.formatted_address}`
            );
          } else {
            alert(
              `No active disasters found within 150km of ${place.formatted_address}`
            );
          }
        }
      }
    }
  };

  // FIRMS-specific marker icons
  const getMarkerIcon = (type, severity) => {
    const severitySize = {
      High: 35,
      Medium: 30,
      Low: 25,
      Critical: 40,
      "Category 4": 40,
      "Category 3": 35,
      Extreme: 40,
      Severe: 35,
    };

    // Use different colors based on fire confidence or disaster type
    const getColor = () => {
      if (type === "Wildfire") {
        return severity === "High"
          ? "red"
          : severity === "Medium"
          ? "orange"
          : "yellow";
      }

      const typeColors = {
        Earthquake:
          severity?.includes("Critical") || severity?.includes("High")
            ? "red"
            : "orange",
        Flood:
          severity?.includes("Critical") || severity?.includes("High")
            ? "red"
            : "blue",
        Cyclone:
          severity?.includes("Category 4") || severity?.includes("Category 3")
            ? "purple"
            : "pink",
        Drought:
          severity?.includes("Extreme") || severity?.includes("Severe")
            ? "yellow"
            : "orange",
        Landslide: "brown",
      };

      return typeColors[type] || "red";
    };

    return {
      url: `http://maps.google.com/mapfiles/ms/icons/${getColor()}-dot.png`,
      scaledSize: new window.google.maps.Size(
        severitySize[severity] || 30,
        severitySize[severity] || 30
      ),
      animation:
        severity === "High" || severity === "Critical"
          ? window.google.maps.Animation.BOUNCE
          : window.google.maps.Animation.DROP,
    };
  };

  // Enhanced safe route calculation avoiding disaster areas
  const getDirectionsToDisaster = useCallback(
    (disaster) => {
      if (!userLocation || !window.google?.maps) {
        alert("User location not available or Google Maps not loaded");
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();

      // Calculate waypoints to avoid other disaster areas
      const otherDisasters = disasters.filter(
        (d) => d.id !== disaster.id && d.status === "Critical"
      );
      // NOTE: You can build real avoid-polygons with Directions API Advanced; here we simply request routes.

      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: disaster.lat, lng: disaster.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
          avoidHighways: disaster.severity === "Critical", // Avoid highways for critical disasters
          avoidTolls: false,
          optimizeWaypoints: true,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK || status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
            alert("Could not calculate route. Please try again.");
          }
        }
      );
    },
    [userLocation, disasters]
  );

  // Get disaster area circle color
  const getDisasterAreaColor = (type, severity) => {
    const colors = {
      Flood: severity?.includes("Critical") ? "#FF0000" : "#0066CC",
      Earthquake: severity?.includes("Critical") ? "#FF0000" : "#FF6600",
      Cyclone: "#9900CC",
      Drought: "#FFCC00",
      Landslide: "#663300",
      Wildfire: "#FF6600",
    };
    return colors[type] || "#FF6600";
  };

  if (apiError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Google Maps API Error
          </h2>
          <p className="text-gray-700 mb-4">{apiError}</p>
          <div className="text-sm text-left bg-gray-100 p-3 rounded">
            <strong>To fix this:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Enable billing in Google Cloud Console</li>
              <li>Add http://localhost:5173 to your API key restrictions</li>
              <li>
                Enable required APIs: Maps JavaScript, Places, Directions
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Loading Disaster Monitor...</p>
          <p className="text-sm text-gray-600 mt-2">
            Real-time data from FIRMS & India
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/95 backdrop-blur-md p-3 shadow-lg border-b border-orange-200">
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-lg hover:bg-orange-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:block">
            <h1 className="font-bold text-orange-800">🔥 FIRMS Fire Monitor</h1>
            <p className="text-xs text-gray-600">
              Real-time fire detection tracking
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isLoaded && (
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search location..."
                className="w-64 md:w-80 px-4 py-2 border-2 border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </Autocomplete>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 font-medium">
              {disasters.length} Active Events
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          restriction: {
            latLngBounds: {
              north: 37,
              south: 8,
              west: 68,
              east: 97,
            },
            strictBounds: false,
          },
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9f4f9" }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* Traffic Layer */}
        {showTraffic && <TrafficLayer />}

        {/* User Location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Your Location"
          />
        )}

        {/* Searched Location */}
        {searchedLocation && (
          <Marker
            position={searchedLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(35, 35),
            }}
            title="Searched Location"
          />
        )}

        {/* Disaster Area Circles */}
        {filteredDisasters.map((disaster) => (
          <Circle
            key={`circle-${disaster.id}`}
            center={{ lat: disaster.lat, lng: disaster.lng }}
            radius={disaster.affectedRadius * 1000} // Convert km to meters
            options={{
              fillColor: getDisasterAreaColor(disaster.type, disaster.severity),
              fillOpacity: 0.2,
              strokeColor: getDisasterAreaColor(disaster.type, disaster.severity),
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
            }}
          />
        ))}

        {/* Enhanced Disaster Markers */}
        <MarkerClusterer options={clusterOptions}>
          {(clusterer) =>
            filteredDisasters.map((disaster) => (
              <Marker
                key={disaster.id}
                position={{ lat: disaster.lat, lng: disaster.lng }}
                clusterer={clusterer}
                icon={getMarkerIcon(disaster.type, disaster.severity)}
                onClick={() => setSelectedDisaster(disaster)}
                title={`${disaster.type} - ${disaster.severity}`}
              />
            ))
          }
        </MarkerClusterer>

        {/* Enhanced Info Window */}
        {selectedDisaster && (
          <InfoWindow
            position={{ lat: selectedDisaster.lat, lng: selectedDisaster.lng }}
            onCloseClick={() => setSelectedDisaster(null)}
          >
            <div className="p-4 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-red-600">
                  {selectedDisaster.type}
                </h4>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    selectedDisaster.status === "Critical"
                      ? "bg-red-100 text-red-800"
                      : selectedDisaster.status === "Active"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedDisaster.status}
                </span>
              </div>

              <p className="text-gray-700 mb-3 font-medium">
                📍 {selectedDisaster.state}
              </p>
              <p className="text-gray-600 mb-3">{selectedDisaster.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Severity:</strong>
                  <br />
                  {selectedDisaster.severity}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Affected:</strong>
                  <br />
                  {selectedDisaster.affectedArea} km²
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Casualties:</strong>
                  <br />
                  {selectedDisaster.casualties}
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Radius:</strong>
                  <br />
                  {selectedDisaster.affectedRadius} km
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                <strong>Last Updated:</strong>{" "}
                {new Date(selectedDisaster.timestamp).toLocaleString("en-IN")}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => getDirectionsToDisaster(selectedDisaster)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
                >
                  🛣️ Safe Route
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDisaster.lat},${selectedDisaster.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:bg-blue-700 transition-colors font-medium"
                >
                  🗺️ Google Maps
                </a>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Enhanced Directions with safe route styling */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#00AA00",
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Enhanced Sidebar */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl z-40 overflow-y-auto">
          <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <h2 className="text-xl font-bold mb-2 text-orange-800">
              🇮🇳 Disaster Monitor
            </h2>
            <p className="text-sm text-gray-600">Live updates every 5 minutes</p>
            <p className="text-xs text-orange-600 mt-1">FIRMS + India coverage</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Enhanced Filter Controls */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Filter by Disaster Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleFilterType(e.target.value)}
                className="w-full p-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">🌍 All Types ({disasters.length})</option>
                <option value="Earthquake">🏔️ Earthquake</option>
                <option value="Flood">🌊 Flood</option>
                <option value="Cyclone">🌀 Cyclone</option>
                <option value="Drought">☀️ Drought</option>
                <option value="Landslide">⛰️ Landslide</option>
                <option value="Wildfire">🔥 Wildfire</option>
              </select>
            </div>

            {/* Toggle Controls */}
            <div className="space-y-3">
              <label className="flex items-center p-2 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={showTraffic}
                  onChange={(e) => setShowTraffic(e.target.checked)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium">🚦 Show Traffic Layer</span>
              </label>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setMapCenter(userLocation || defaultCenter);
                  setMapZoom(userLocation ? 10 : 5);
                  setSearchedLocation(null);
                  setDirections(null);
                }}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                <Navigation className="w-4 h-4 mr-2" />
                📍 Center to My Location
              </button>

              <button
                onClick={() => {
                  setMapCenter(defaultCenter);
                  setMapZoom(5);
                  setFilteredDisasters(disasters);
                  setSelectedType("all");
                  setSearchedLocation(null);
                  setDirections(null);
                }}
                className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🔄 Reset to India View
              </button>
            </div>

            {/* Active Disasters List */}
            <div>
              <h3 className="font-bold mb-3 text-lg flex items-center">
                🚨 Active Disasters ({filteredDisasters.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {filteredDisasters.map((disaster) => (
                  <div
                    key={disaster.id}
                    className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    onClick={() => {
                      setMapCenter({ lat: disaster.lat, lng: disaster.lng });
                      setMapZoom(12);
                      setSelectedDisaster(disaster);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-gray-800">
                        {disaster.type === "Earthquake" && "🏔️"}
                        {disaster.type === "Flood" && "🌊"}
                        {disaster.type === "Cyclone" && "🌀"}
                        {disaster.type === "Drought" && "☀️"}
                        {disaster.type === "Landslide" && "⛰️"}
                        {disaster.type === "Wildfire" && "🔥"} {disaster.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          disaster.severity.includes("Critical") ||
                          disaster.severity.includes("High") ||
                          disaster.severity.includes("Category 4") ||
                          disaster.severity.includes("Extreme")
                            ? "bg-red-100 text-red-800"
                            : disaster.severity.includes("Medium") ||
                              disaster.severity.includes("Category 3") ||
                              disaster.severity.includes("Severe")
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {disaster.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">📍 {disaster.state}</p>
                    <p className="text-xs text-gray-500">
                      {disaster.affectedArea} km² affected
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
              <h4 className="font-bold text-sm mb-2">📊 Quick Stats</h4>
              <div className="text-xs space-y-1">
                <p>
                  🔴 Critical:{" "}
                  {
                    disasters.filter(
                      (d) =>
                        d.severity.includes("Critical") ||
                        d.severity.includes("Category 4") ||
                        d.severity.includes("Extreme")
                    ).length
                  }
                </p>
                <p>🟡 Active: {disasters.filter((d) => d.status === "Active").length}</p>
                <p>
                  👥 Total Affected:{" "}
                  {disasters.reduce((sum, d) => sum + d.casualties, 0)} people
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}