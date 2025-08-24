import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polyline } from 'react-leaflet';

import L from 'leaflet';import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polyline } from 'react-leaflet';import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Polyline } from 'react-leaflet';

import { fireData } from '../utils/fireData.js';

import { fireData } from '../utils/fireData.js';import L from 'leaflet';

// Fix Leaflet icon issue

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',// Hospital data for India// Fix Leaflet icon issue

  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',

  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',const indianHospitals = [delete L.Icon.Default.prototype._getIconUrl;

});

  { "id": "h1", "name": "AIIMS Delhi", "lat": 28.5672, "lng": 77.2100, "type": "Government", "emergency": true },L.Icon.Default.mergeOptions({

// Hospital data for India

const indianHospitals = [  { "id": "h2", "name": "Fortis Hospital Gurgaon", "lat": 28.4595, "lng": 77.0266, "type": "Private", "emergency": true },  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',

  { "id": "h1", "name": "AIIMS Delhi", "lat": 28.5672, "lng": 77.2100, "type": "Government", "emergency": true },

  { "id": "h2", "name": "Fortis Hospital Gurgaon", "lat": 28.4595, "lng": 77.0266, "type": "Private", "emergency": true },  { "id": "h3", "name": "Tata Memorial Hospital", "lat": 19.0176, "lng": 72.8562, "type": "Government", "emergency": true },  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',

  { "id": "h3", "name": "Tata Memorial Hospital", "lat": 19.0176, "lng": 72.8562, "type": "Government", "emergency": true },

  { "id": "h4", "name": "Kokilaben Hospital", "lat": 19.1136, "lng": 72.8697, "type": "Private", "emergency": true },  { "id": "h4", "name": "Kokilaben Hospital", "lat": 19.1136, "lng": 72.8697, "type": "Private", "emergency": true },  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

  { "id": "h5", "name": "Manipal Hospital", "lat": 12.9279, "lng": 77.6271, "type": "Private", "emergency": true },

  { "id": "h6", "name": "NIMHANS", "lat": 12.9430, "lng": 77.5957, "type": "Government", "emergency": true },  { "id": "h5", "name": "Manipal Hospital", "lat": 12.9279, "lng": 77.6271, "type": "Private", "emergency": true },});

  { "id": "h7", "name": "Apollo Hospital", "lat": 13.0358, "lng": 80.2297, "type": "Private", "emergency": true },

  { "id": "h8", "name": "Stanley Medical College", "lat": 13.0889, "lng": 80.2808, "type": "Government", "emergency": true },  { "id": "h6", "name": "Apollo Hospital", "lat": 13.0358, "lng": 80.2297, "type": "Private", "emergency": true },

  { "id": "h9", "name": "SSKM Hospital", "lat": 22.5720, "lng": 88.3645, "type": "Government", "emergency": true },

  { "id": "h10", "name": "Belle Vue Clinic", "lat": 22.5448, "lng": 88.3426, "type": "Private", "emergency": true },  { "id": "h7", "name": "SSKM Hospital", "lat": 22.5720, "lng": 88.3645, "type": "Government", "emergency": true },// Fire data for India

  { "id": "h11", "name": "Ruby Hall Clinic", "lat": 18.5089, "lng": 73.8155, "type": "Private", "emergency": true },

  { "id": "h12", "name": "Sassoon Hospital", "lat": 18.5314, "lng": 73.8446, "type": "Government", "emergency": true },  { "id": "h8", "name": "Ruby Hall Clinic", "lat": 18.5089, "lng": 73.8155, "type": "Private", "emergency": true },const indiaFireData = {

  { "id": "h13", "name": "Civil Hospital Ahmedabad", "lat": 23.0324, "lng": 72.5818, "type": "Government", "emergency": true },

  { "id": "h14", "name": "Sterling Hospital", "lat": 23.0395, "lng": 72.5448, "type": "Private", "emergency": true },  { "id": "h9", "name": "Civil Hospital Ahmedabad", "lat": 23.0324, "lng": 72.5818, "type": "Government", "emergency": true },  "fires": [

  { "id": "h15", "name": "SMS Hospital", "lat": 26.9157, "lng": 75.8281, "type": "Government", "emergency": true },

  { "id": "h16", "name": "Fortis Escorts Hospital", "lat": 26.8467, "lng": 75.8061, "type": "Private", "emergency": true }  { "id": "h10", "name": "SMS Hospital", "lat": 26.9157, "lng": 75.8281, "type": "Government", "emergency": true }    { "id": 1, "latitude": 30.9010, "longitude": 75.8573, "confidence": "h", "brightness": 342.5, "type": "Agricultural", "state": "Punjab", "district": "Ludhiana" },

];

];    { "id": 2, "latitude": 31.3260, "longitude": 75.5762, "confidence": "h", "brightness": 351.2, "type": "Agricultural", "state": "Punjab", "district": "Jalandhar" },

// Utility functions

function calculateDistance(lat1, lon1, lat2, lon2) {    { "id": 3, "latitude": 29.0588, "longitude": 76.0856, "confidence": "h", "brightness": 347.8, "type": "Agricultural", "state": "Haryana", "district": "Hisar" },

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;// Calculate distance between two points (Haversine formula)    { "id": 4, "latitude": 28.4595, "longitude": 77.0266, "confidence": "n", "brightness": 334.1, "type": "Urban", "state": "Haryana", "district": "Gurgaon" },

  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +function calculateDistance(lat1, lon1, lat2, lon2) {    { "id": 5, "latitude": 28.7041, "longitude": 77.1025, "confidence": "h", "brightness": 345.9, "type": "Urban", "state": "Delhi", "district": "New Delhi" },

    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon/2) * Math.sin(dLon/2);  const R = 6371; // Radius of Earth in kilometers    { "id": 6, "latitude": 28.5355, "longitude": 77.3910, "confidence": "n", "brightness": 338.6, "type": "Urban", "state": "Delhi", "district": "Noida" },

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;  const dLat = (lat2 - lat1) * Math.PI / 180;    { "id": 7, "latitude": 26.8467, "longitude": 80.9462, "confidence": "n", "brightness": 331.9, "type": "Agricultural", "state": "Uttar Pradesh", "district": "Lucknow" },

}

  const dLon = (lon2 - lon1) * Math.PI / 180;    { "id": 8, "latitude": 25.4358, "longitude": 81.8463, "confidence": "l", "brightness": 329.4, "type": "Agricultural", "state": "Uttar Pradesh", "district": "Allahabad" },

function findNearestHospital(fireLat, fireLng) {

  let nearestHospital = null;  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +    { "id": 9, "latitude": 26.9124, "longitude": 75.7873, "confidence": "h", "brightness": 348.7, "type": "Forest", "state": "Rajasthan", "district": "Jaipur" },

  let minDistance = Infinity;

    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *    { "id": 10, "latitude": 24.5854, "longitude": 73.7125, "confidence": "n", "brightness": 335.2, "type": "Forest", "state": "Rajasthan", "district": "Udaipur" },

  indianHospitals.forEach(hospital => {

    const distance = calculateDistance(fireLat, fireLng, hospital.lat, hospital.lng);    Math.sin(dLon/2) * Math.sin(dLon/2);    { "id": 11, "latitude": 19.0760, "longitude": 72.8777, "confidence": "h", "brightness": 352.4, "type": "Urban", "state": "Maharashtra", "district": "Mumbai" },

    if (distance < minDistance) {

      minDistance = distance;  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));    { "id": 12, "latitude": 18.5204, "longitude": 73.8567, "confidence": "n", "brightness": 340.1, "type": "Urban", "state": "Maharashtra", "district": "Pune" },

      nearestHospital = { ...hospital, distance: distance.toFixed(2) };

    }  return R * c;    { "id": 13, "latitude": 23.0225, "longitude": 72.5714, "confidence": "h", "brightness": 349.8, "type": "Industrial", "state": "Gujarat", "district": "Ahmedabad" },

  });

}    { "id": 14, "latitude": 21.1702, "longitude": 72.8311, "confidence": "n", "brightness": 337.6, "type": "Industrial", "state": "Gujarat", "district": "Surat" },

  console.log(`Fire at ${fireLat}, ${fireLng} -> Nearest hospital: ${nearestHospital?.name} (${nearestHospital?.distance}km)`);

  return nearestHospital;    { "id": 15, "latitude": 12.9716, "longitude": 77.5946, "confidence": "n", "brightness": 333.8, "type": "Urban", "state": "Karnataka", "district": "Bangalore" },

}

// Find nearest hospital to a fire location    { "id": 16, "latitude": 15.3173, "longitude": 75.7139, "confidence": "l", "brightness": 328.9, "type": "Forest", "state": "Karnataka", "district": "Belgaum" },

async function getRoadRoute(startLat, startLng, endLat, endLng) {

  try {function findNearestHospital(fireLat, fireLng) {    { "id": 17, "latitude": 13.0827, "longitude": 80.2707, "confidence": "h", "brightness": 346.5, "type": "Urban", "state": "Tamil Nadu", "district": "Chennai" },

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    console.log(`Fetching route: ${url}`);  let nearestHospital = null;    { "id": 18, "latitude": 11.0168, "longitude": 76.9558, "confidence": "n", "brightness": 332.7, "type": "Agricultural", "state": "Tamil Nadu", "district": "Coimbatore" },

    

    const response = await fetch(url);  let minDistance = Infinity;    { "id": 19, "latitude": 22.5726, "longitude": 88.3639, "confidence": "h", "brightness": 344.2, "type": "Urban", "state": "West Bengal", "district": "Kolkata" },

    const data = await response.json();

        { "id": 20, "latitude": 22.9868, "longitude": 87.8550, "confidence": "n", "brightness": 336.4, "type": "Agricultural", "state": "West Bengal", "district": "Howrah" }

    console.log('Route API Response:', data);

      indianHospitals.forEach(hospital => {  ],

    if (data.routes && data.routes.length > 0) {

      const route = data.routes[0];    const distance = calculateDistance(fireLat, fireLng, hospital.lat, hospital.lng);  "statistics": { "total": 20, "high_confidence": 9, "medium_confidence": 8, "low_confidence": 3 }

      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          if (distance < minDistance) {};

      const routeInfo = {

        coordinates: coordinates,      minDistance = distance;

        distance: (route.distance / 1000).toFixed(2),

        duration: Math.round(route.duration / 60),      nearestHospital = { ...hospital, distance: distance.toFixed(2) };// Hospital data for India

        steps: route.legs[0]?.steps || []

      };    }const indianHospitals = [

      

      console.log(`Route calculated: ${routeInfo.distance}km, ${routeInfo.duration}min, ${coordinates.length} points`);  });  { "id": "h1", "name": "AIIMS Delhi", "lat": 28.5672, "lng": 77.2100, "type": "Government", "emergency": true },

      return routeInfo;

    } else {  { "id": "h2", "name": "Fortis Hospital Gurgaon", "lat": 28.4595, "lng": 77.0266, "type": "Private", "emergency": true },

      console.warn('No routes found - using straight line');

      const distance = calculateDistance(startLat, startLng, endLat, endLng);  console.log(`Fire at ${fireLat}, ${fireLng} -> Nearest hospital: ${nearestHospital?.name} (${nearestHospital?.distance}km)`);  { "id": "h3", "name": "Tata Memorial Hospital", "lat": 19.0176, "lng": 72.8562, "type": "Government", "emergency": true },

      return {

        coordinates: [[startLat, startLng], [endLat, endLng]],  return nearestHospital;  { "id": "h4", "name": "Kokilaben Hospital", "lat": 19.1136, "lng": 72.8697, "type": "Private", "emergency": true },

        distance: distance.toFixed(2),

        duration: Math.round(distance * 2),}  { "id": "h5", "name": "Manipal Hospital", "lat": 12.9279, "lng": 77.6271, "type": "Private", "emergency": true },

        steps: [],

        fallback: true  { "id": "h6", "name": "NIMHANS", "lat": 12.9430, "lng": 77.5957, "type": "Government", "emergency": true },

      };

    }// Get road route using OSRM  { "id": "h7", "name": "Apollo Hospital", "lat": 13.0358, "lng": 80.2297, "type": "Private", "emergency": true },

  } catch (error) {

    console.error('Routing error:', error);async function getRoadRoute(startLat, startLng, endLat, endLng) {  { "id": "h8", "name": "Stanley Medical College", "lat": 13.0889, "lng": 80.2808, "type": "Government", "emergency": true },

    const distance = calculateDistance(startLat, startLng, endLat, endLng);

    return {  try {  { "id": "h9", "name": "SSKM Hospital", "lat": 22.5720, "lng": 88.3645, "type": "Government", "emergency": true },

      coordinates: [[startLat, startLng], [endLat, endLng]],

      distance: distance.toFixed(2),    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;  { "id": "h10", "name": "Belle Vue Clinic", "lat": 22.5448, "lng": 88.3426, "type": "Private", "emergency": true },

      duration: Math.round(distance * 2),

      steps: [],    console.log(`Fetching route: ${url}`);  { "id": "h11", "name": "Ruby Hall Clinic", "lat": 18.5089, "lng": 73.8155, "type": "Private", "emergency": true },

      fallback: true

    };      { "id": "h12", "name": "Sassoon Hospital", "lat": 18.5314, "lng": 73.8446, "type": "Government", "emergency": true },

  }

}    const response = await fetch(url);  { "id": "h13", "name": "Civil Hospital Ahmedabad", "lat": 23.0324, "lng": 72.5818, "type": "Government", "emergency": true },



function getConfidenceColor(confidence) {    const data = await response.json();  { "id": "h14", "name": "Sterling Hospital", "lat": 23.0395, "lng": 72.5448, "type": "Private", "emergency": true },

  switch (confidence) {

    case 'h': return '#dc2626';      { "id": "h15", "name": "SMS Hospital", "lat": 26.9157, "lng": 75.8281, "type": "Government", "emergency": true },

    case 'n': return '#f97316';

    case 'l': return '#fbbf24';    console.log('OSRM Response:', data);  { "id": "h16", "name": "Fortis Escorts Hospital", "lat": 26.8467, "lng": 75.8061, "type": "Private", "emergency": true }

    default: return '#6b7280';

  }    ];

}

    if (data.routes && data.routes.length > 0) {

export default function FireMap() {

  console.log('FireMap component loaded with fire data:', fireData);      const route = data.routes[0];// Routing API

  

  const [selectedFire, setSelectedFire] = useState(null);      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]const ROUTING_API_URL = 'https://router.project-osrm.org/route/v1/driving';

  const [roadRoutes, setRoadRoutes] = useState([]);

  const [filters, setFilters] = useState({      

    showHigh: true,

    showMedium: true,      const routeInfo = {function getConfidenceColor(confidence) {

    showLow: true,

    showHospitals: true        coordinates: coordinates,  switch (confidence) {

  });

          distance: (route.distance / 1000).toFixed(2), // Convert meters to km    case 'h': return '#dc2626';

  const filteredFires = fireData.fires.filter(fire => {

    if (fire.confidence === 'h' && !filters.showHigh) return false;        duration: Math.round(route.duration / 60), // Convert seconds to minutes    case 'n': return '#f97316';

    if (fire.confidence === 'n' && !filters.showMedium) return false;

    if (fire.confidence === 'l' && !filters.showLow) return false;        steps: route.legs[0]?.steps || []    case 'l': return '#fbbf24';

    return true;

  });      };    default: return '#6b7280';



  // Handle fire click to show route to nearest hospital        }

  const handleFireClick = async (fire) => {

    console.log('Fire clicked:', fire);      console.log(`Route calculated: ${routeInfo.distance}km, ${routeInfo.duration}min, ${coordinates.length} points`);}

    setSelectedFire(fire);

          return routeInfo;

    const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);

    if (nearestHospital) {    } else {function getConfidenceLabel(confidence) {

      const roadRoute = await getRoadRoute(

        fire.latitude,       console.warn('No routes found - using fallback');  switch (confidence) {

        fire.longitude, 

        nearestHospital.lat,       // Fallback to straight line    case 'h': return 'High';

        nearestHospital.lng

      );      const distance = calculateDistance(startLat, startLng, endLat, endLng);    case 'n': return 'Medium';

      

      if (roadRoute) {      return {    case 'l': return 'Low';

        const newRoute = {

          id: `route-${fire.id}`,        coordinates: [[startLat, startLng], [endLat, endLng]],    default: return 'Unknown';

          fire: fire,

          hospital: nearestHospital,        distance: distance.toFixed(2),  }

          route: roadRoute,

          isSelected: true        duration: Math.round(distance * 2), // Rough estimate}

        };

                steps: [],

        setRoadRoutes(prev => {

          const filtered = prev.filter(r => r.fire.id !== fire.id);        fallback: true// Calculate distance between two points

          return [...filtered, newRoute];

        });      };function calculateDistance(lat1, lon1, lat2, lon2) {

      }

    }    }  const R = 6371;

  };

  } catch (error) {  const dLat = (lat2 - lat1) * Math.PI / 180;

  // Auto-generate routes for high confidence fires

  useEffect(() => {    console.error('Routing error:', error);  const dLon = (lon2 - lon1) * Math.PI / 180;

    const generateHighRiskRoutes = async () => {

      console.log('Generating auto routes for high confidence fires...');    // Fallback to straight line  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +

      const highConfidenceFires = filteredFires.filter(fire => fire.confidence === 'h');

      console.log(`Found ${highConfidenceFires.length} high confidence fires`);    const distance = calculateDistance(startLat, startLng, endLat, endLng);    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *

      

      const routes = [];    return {    Math.sin(dLon/2) * Math.sin(dLon/2);

      

      for (const fire of highConfidenceFires) {      coordinates: [[startLat, startLng], [endLat, endLng]],  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        console.log(`Processing fire ${fire.id}`);

        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);      distance: distance.toFixed(2),  return R * c;

        if (nearestHospital) {

          const roadRoute = await getRoadRoute(      duration: Math.round(distance * 2),}

            fire.latitude, 

            fire.longitude,       steps: [],

            nearestHospital.lat, 

            nearestHospital.lng      fallback: true// Find nearest hospital

          );

              };function findNearestHospital(fireLat, fireLng) {

          if (roadRoute) {

            routes.push({  }  let nearestHospital = null;

              id: `auto-route-${fire.id}`,

              fire: fire,}  let minDistance = Infinity;

              hospital: nearestHospital,

              route: roadRoute,

              isSelected: false

            });function getConfidenceColor(confidence) {  indianHospitals.forEach(hospital => {

          }

        }  switch (confidence) {    const distance = calculateDistance(fireLat, fireLng, hospital.lat, hospital.lng);

        await new Promise(resolve => setTimeout(resolve, 300));

      }    case 'h': return '#dc2626'; // High confidence - red    if (distance < minDistance) {

      

      console.log(`Generated ${routes.length} auto routes`);    case 'n': return '#f97316'; // Medium confidence - orange        minDistance = distance;

      setRoadRoutes(prev => {

        const selectedRoutes = prev.filter(r => r.isSelected);    case 'l': return '#fbbf24'; // Low confidence - yellow      nearestHospital = { ...hospital, distance: distance.toFixed(2) };

        return [...selectedRoutes, ...routes];

      });    default: return '#6b7280'; // Unknown - gray    }

    };

  }  });

    generateHighRiskRoutes();

  }, [filteredFires]);}



  return (  console.log(`Fire at ${fireLat}, ${fireLng} -> Nearest hospital: ${nearestHospital?.name} (${nearestHospital?.distance}km)`);

    <div className="max-w-7xl mx-auto">

      <h2 className="text-2xl font-semibold mb-4">🛰️ India Fire Detection & Emergency Response</h2>export default function FireMap() {  return nearestHospital;

      

      {/* Debug Info */}  console.log('FireMap component loaded with fire data:', fireData);}

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">

        <div className="text-sm text-yellow-700">  

          <strong>Total Fires:</strong> {filteredFires.length} |

          <strong>High Confidence:</strong> {filteredFires.filter(f => f.confidence === 'h').length} |   const [selectedFire, setSelectedFire] = useState(null);// Get road route

          <strong>Active Routes:</strong> {roadRoutes.length}

        </div>  const [roadRoutes, setRoadRoutes] = useState([]);async function getRoadRoute(startLat, startLng, endLat, endLng) {

        <button 

          onClick={async () => {  const [filters, setFilters] = useState({  try {

            console.log('=== Manual Test ===');

            const testFire = filteredFires.find(f => f.confidence === 'h');    showHigh: true,    const url = `${ROUTING_API_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

            if (testFire) {

              console.log('Testing with fire:', testFire);    showMedium: true,    console.log(`Fetching route: ${url}`);

              const hospital = findNearestHospital(testFire.latitude, testFire.longitude);

              console.log('Found hospital:', hospital);    showLow: true,    

              if (hospital) {

                const route = await getRoadRoute(testFire.latitude, testFire.longitude, hospital.lat, hospital.lng);    showHospitals: true    const response = await fetch(url);

                console.log('Route result:', route);

              }  });    const data = await response.json();

            }

          }}    

          className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"

        >  const filteredFires = fireData.fires.filter(fire => {    console.log('Route API Response:', data);

          Test Route (Check Console)

        </button>    if (fire.confidence === 'h' && !filters.showHigh) return false;    

      </div>

    if (fire.confidence === 'n' && !filters.showMedium) return false;    if (data.routes && data.routes.length > 0) {

      {/* Selected Fire Panel */}

      {selectedFire && (    if (fire.confidence === 'l' && !filters.showLow) return false;      const route = data.routes[0];

        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">

          <div className="flex justify-between items-start">    return true;      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            <h3 className="font-semibold text-red-800">🔥 Selected Fire Details</h3>

            <button   });      

              onClick={() => {

                setSelectedFire(null);      const routeInfo = {

                setRoadRoutes(prev => prev.filter(r => !r.isSelected));

              }}  // Handle fire click to show route to nearest hospital        coordinates: coordinates,

              className="text-red-600 hover:text-red-800 font-bold"

            >  const handleFireClick = async (fire) => {        distance: (route.distance / 1000).toFixed(2),

              ×

            </button>    console.log('Fire clicked:', fire);        duration: Math.round(route.duration / 60),

          </div>

          <div className="mt-2 text-sm">    setSelectedFire(fire);        steps: route.legs[0]?.steps || []

            <div><strong>Coordinates:</strong> {selectedFire.latitude.toFixed(4)}, {selectedFire.longitude.toFixed(4)}</div>

            <div><strong>Confidence:</strong> {selectedFire.confidence.toUpperCase()}</div>          };

            <div><strong>Brightness:</strong> {selectedFire.brightness.toFixed(1)}K</div>

            <div><strong>Date:</strong> {selectedFire.acquisition_date}</div>    const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);      

          </div>

              if (nearestHospital) {      console.log(`Route calculated: ${routeInfo.distance}km, ${routeInfo.duration}min, ${coordinates.length} points`);

          {(() => {

            const selectedRoute = roadRoutes.find(r => r.isSelected && r.fire.id === selectedFire.id);      const roadRoute = await getRoadRoute(      return routeInfo;

            return selectedRoute ? (

              <div className="mt-3 p-2 bg-green-100 rounded">        fire.latitude,     } else {

                <h4 className="font-medium">🚗 Route to Nearest Hospital</h4>

                <div className="text-sm mt-1">        fire.longitude,       console.warn('No routes found - using straight line');

                  <div><strong>Hospital:</strong> {selectedRoute.hospital.name}</div>

                  <div><strong>Distance:</strong> {selectedRoute.route.distance} km</div>        nearestHospital.lat,       const distance = calculateDistance(startLat, startLng, endLat, endLng);

                  <div><strong>Est. Time:</strong> {selectedRoute.route.duration} minutes</div>

                  <div><strong>Type:</strong> {selectedRoute.hospital.type}</div>        nearestHospital.lng      return {

                  {selectedRoute.route.fallback && (

                    <div className="text-orange-600 font-medium mt-1">⚠️ Direct route (routing service unavailable)</div>      );        coordinates: [[startLat, startLng], [endLat, endLng]],

                  )}

                </div>              distance: distance.toFixed(2),

              </div>

            ) : null;      if (roadRoute) {        duration: Math.round(distance * 2),

          })()}

        </div>        const newRoute = {        steps: [],

      )}

          id: `route-${fire.id}`,        fallback: true

      {/* Map */}

      <div className="bg-white rounded-lg shadow overflow-hidden">          fire: fire,      };

        <MapContainer 

          center={[20.5937, 78.9629]}           hospital: nearestHospital,    }

          zoom={5} 

          style={{ height: '600px', width: '100%' }}          route: roadRoute,  } catch (error) {

        >

          {/* Satellite View */}          isSelected: true    console.error('Routing error:', error);

          <TileLayer

            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"        };    const distance = calculateDistance(startLat, startLng, endLat, endLng);

            attribution='&copy; Esri'

          />            return {

          <TileLayer

            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"        setRoadRoutes(prev => {      coordinates: [[startLat, startLng], [endLat, endLng]],

            attribution=""

          />          // Replace any existing route for this fire      distance: distance.toFixed(2),



          {/* Fire Markers */}          const filtered = prev.filter(r => r.fire.id !== fire.id);      duration: Math.round(distance * 2),

          {filteredFires.map((fire) => (

            <CircleMarker          return [...filtered, newRoute];      steps: [],

              key={fire.id}

              center={[fire.latitude, fire.longitude]}        });      fallback: true

              radius={Math.max(6, fire.brightness / 50)}

              color="#ffffff"      }    };

              weight={2}

              fillColor={getConfidenceColor(fire.confidence)}    }  }

              fillOpacity={0.8}

              eventHandlers={{  };}

                click: () => handleFireClick(fire)

              }}

            >

              <Popup>  // Auto-generate routes for high confidence firesexport default function FireMap() {

                <div>

                  <h4 className="font-bold text-red-600">🔥 Fire Detection Alert</h4>  useEffect(() => {  console.log('FireMap component loaded');

                  <div className="text-sm mt-1">

                    <div><strong>Confidence:</strong> {fire.confidence.toUpperCase()}</div>    const generateHighRiskRoutes = async () => {  

                    <div><strong>Brightness:</strong> {fire.brightness.toFixed(1)}K</div>

                    <div><strong>Date:</strong> {fire.acquisition_date}</div>      console.log('Generating auto routes for high confidence fires...');  const [filters, setFilters] = useState({

                    <div><strong>Time:</strong> {fire.acquisition_time}</div>

                    <div><strong>Satellite:</strong> {fire.satellite}</div>      const highConfidenceFires = filteredFires.filter(fire => fire.confidence === 'h');    showHigh: true,

                    <div><strong>Coordinates:</strong> {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}</div>

                  </div>      console.log(`Found ${highConfidenceFires.length} high confidence fires`);    showMedium: true,

                  <div className="mt-2 p-2 bg-red-100 rounded text-xs">

                    Click this marker to see route to nearest hospital          showLow: true,

                  </div>

                </div>      const routes = [];    showHospitals: true,

              </Popup>

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>          showPaths: false

                <div className="text-xs text-center">

                  🔥 Fire Alert<br/>      for (const fire of highConfidenceFires) {  });

                  {fire.confidence.toUpperCase()} Confidence

                </div>        console.log(`Processing fire ${fire.id}`);  

              </Tooltip>

            </CircleMarker>        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);  const [selectedFire, setSelectedFire] = useState(null);

          ))}

        if (nearestHospital) {  const [roadRoutes, setRoadRoutes] = useState([]);

          {/* Hospital Markers */}

          {filters.showHospitals && indianHospitals.map((hospital) => (          const roadRoute = await getRoadRoute(

            <CircleMarker

              key={hospital.id}            fire.latitude,   const filteredFires = indiaFireData.fires.filter(fire => {

              center={[hospital.lat, hospital.lng]}

              radius={8}            fire.longitude,     if (fire.confidence === 'h' && !filters.showHigh) return false;

              color="#ffffff"

              weight={2}            nearestHospital.lat,     if (fire.confidence === 'n' && !filters.showMedium) return false;

              fillColor="#2563eb"

              fillOpacity={0.9}            nearestHospital.lng    if (fire.confidence === 'l' && !filters.showLow) return false;

            >

              <Popup>          );    return true;

                <div>

                  <h4 className="font-bold text-blue-600">🏥 {hospital.name}</h4>            });

                  <div className="text-sm mt-1">

                    <div><strong>Type:</strong> {hospital.type}</div>          if (roadRoute) {

                    <div><strong>Emergency Services:</strong> {hospital.emergency ? '✅ Available' : '❌ Not Available'}</div>

                    <div><strong>Location:</strong> {hospital.lat.toFixed(4)}, {hospital.lng.toFixed(4)}</div>            routes.push({  // Handle fire click

                  </div>

                </div>              id: `auto-route-${fire.id}`,  const handleFireClick = async (fire) => {

              </Popup>

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>              fire: fire,    console.log('Fire clicked:', fire);

                <div className="text-xs text-center">

                  🏥 {hospital.name}<br/>              hospital: nearestHospital,    setSelectedFire(fire);

                  {hospital.type} Hospital

                </div>              route: roadRoute,    

              </Tooltip>

            </CircleMarker>              isSelected: false    if (fire.confidence === 'h' || filters.showPaths) {

          ))}

                      });      const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);

          {/* Road Routes to Hospitals */}

          {roadRoutes.map((routeData) => (          }      if (nearestHospital) {

            <Polyline 

              key={routeData.id}        }        const roadRoute = await getRoadRoute(

              positions={routeData.route.coordinates}

              color={routeData.isSelected ? "#1d4ed8" : "#dc2626"}        // Small delay to avoid overwhelming the routing service          fire.latitude, 

              weight={routeData.isSelected ? 6 : 4}

              opacity={0.9}        await new Promise(resolve => setTimeout(resolve, 300));          fire.longitude, 

              dashArray={routeData.isSelected ? "none" : "10, 5"}

            />      }          nearestHospital.lat, 

          ))}

        </MapContainer>                nearestHospital.lng

      </div>

      console.log(`Generated ${routes.length} auto routes`);        );

      {/* Information Panel */}

      <div className="mt-4 bg-blue-50 rounded-lg p-4">      setRoadRoutes(prev => {        

        <h3 className="font-medium text-blue-800 mb-2">🛣️ Real Road Navigation Features</h3>

        <ul className="text-sm text-blue-700 space-y-1">        // Keep selected routes, replace auto routes        if (roadRoute) {

          <li>• <strong>Satellite View:</strong> High-resolution imagery for precise location identification</li>

          <li>• <strong>Real Road Routes:</strong> Actual driving directions using road networks (not straight lines)</li>        const selectedRoutes = prev.filter(r => r.isSelected);          const newRoute = {

          <li>• <strong>Auto-Routing:</strong> High-risk fires automatically show road routes to nearest hospitals</li>

          <li>• <strong>Click Interaction:</strong> Click any fire for detailed road directions with estimated drive time</li>        return [...selectedRoutes, ...routes];            id: `route-${fire.id}`,

          <li>• <strong>Distance & Time:</strong> Real road distance in km and estimated drive time in minutes</li>

          <li>• <strong>Route Comparison:</strong> Red routes for auto-generated, blue for selected detailed routes</li>      });            fire: fire,

        </ul>

        <div className="mt-3 text-xs text-blue-600 border-t pt-2">    };            hospital: nearestHospital,

          <strong>Data Sources:</strong><br/>

          🛰️ Fire Detection: NASA FIRMS (VIIRS Satellite) - Real-time updates<br/>            route: roadRoute,

          🏥 Hospital Network: Major emergency medical facilities across India<br/>

          📍 Satellite Imagery: High-resolution Esri World Imagery with place labels<br/>    generateHighRiskRoutes();            isSelected: true

          🛣️ Road Routing: OpenStreetMap Routing Machine (OSRM) for real driving directions

        </div>  }, [filteredFires]);          };

      </div>

    </div>          

  );

}  return (          setRoadRoutes(prev => {

    <div className="max-w-7xl mx-auto">            const filtered = prev.filter(r => r.fire.id !== fire.id);

      <h2 className="text-2xl font-semibold mb-4">🛰️ India Fire Detection & Emergency Response</h2>            return [...filtered, newRoute];

                });

      {/* Debug Info */}        }

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">      }

        <div className="text-sm text-yellow-700">    }

          <strong>Total Fires:</strong> {filteredFires.length} |   };

          <strong>High Confidence:</strong> {filteredFires.filter(f => f.confidence === 'h').length} | 

          <strong>Active Routes:</strong> {roadRoutes.length}  // Auto-generate routes for high confidence fires

        </div>  useEffect(() => {

        <button     const generateHighRiskRoutes = async () => {

          onClick={async () => {      console.log('Generating auto routes...');

            console.log('=== Manual Test ===');      const highConfidenceFires = filteredFires.filter(fire => fire.confidence === 'h');

            const testFire = filteredFires[0]; // Test with first fire      console.log(`Found ${highConfidenceFires.length} high confidence fires`);

            if (testFire) {      

              console.log('Testing with fire:', testFire);      const routes = [];

              const hospital = findNearestHospital(testFire.latitude, testFire.longitude);      

              console.log('Found hospital:', hospital);      for (const fire of highConfidenceFires) {

              if (hospital) {        const nearestHospital = findNearestHospital(fire.latitude, fire.longitude);

                const route = await getRoadRoute(testFire.latitude, testFire.longitude, hospital.lat, hospital.lng);        if (nearestHospital) {

                console.log('Route result:', route);          const roadRoute = await getRoadRoute(

              }            fire.latitude, 

            }            fire.longitude, 

          }}            nearestHospital.lat, 

          className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"            nearestHospital.lng

        >          );

          Test Route (Check Console)          

        </button>          if (roadRoute) {

      </div>            routes.push({

              id: `auto-route-${fire.id}`,

      {/* Selected Fire Panel */}              fire: fire,

      {selectedFire && (              hospital: nearestHospital,

        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">              route: roadRoute,

          <div className="flex justify-between items-start">              isSelected: false

            <h3 className="font-semibold text-red-800">🔥 Selected Fire Details</h3>            });

            <button           }

              onClick={() => {        }

                setSelectedFire(null);        await new Promise(resolve => setTimeout(resolve, 300));

                setRoadRoutes(prev => prev.filter(r => !r.isSelected));      }

              }}      

              className="text-red-600 hover:text-red-800 font-bold"      console.log(`Generated ${routes.length} auto routes`);

            >      setRoadRoutes(prev => {

              ×        const selectedRoutes = prev.filter(r => r.isSelected);

            </button>        return [...selectedRoutes, ...routes];

          </div>      });

          <div className="mt-2 text-sm">    };

            <div><strong>Coordinates:</strong> {selectedFire.latitude.toFixed(4)}, {selectedFire.longitude.toFixed(4)}</div>

            <div><strong>Confidence:</strong> {selectedFire.confidence.toUpperCase()}</div>    generateHighRiskRoutes();

            <div><strong>Brightness:</strong> {selectedFire.brightness.toFixed(1)}K</div>  }, [filteredFires]);

            <div><strong>Date:</strong> {selectedFire.acquisition_date}</div>

          </div>export default function TestFireMap() {

            console.log('TestFireMap rendering with data:', testFires);

          {(() => {

            const selectedRoute = roadRoutes.find(r => r.isSelected && r.fire.id === selectedFire.id);  useEffect(() => {

            return selectedRoute ? (    console.log('TestFireMap mounted');

              <div className="mt-3 p-2 bg-green-100 rounded">  }, []);

                <h4 className="font-medium">🚗 Route to Nearest Hospital</h4>

                <div className="text-sm mt-1">  return (

                  <div><strong>Hospital:</strong> {selectedRoute.hospital.name}</div>    <div className="max-w-7xl mx-auto">

                  <div><strong>Distance:</strong> {selectedRoute.route.distance} km</div>      <h2 className="text-2xl font-semibold mb-4">🛰️ India Fire Detection & Emergency Response</h2>

                  <div><strong>Est. Time:</strong> {selectedRoute.route.duration} minutes</div>      

                  <div><strong>Type:</strong> {selectedRoute.hospital.type}</div>      {/* Debug Info */}

                  {selectedRoute.route.fallback && (      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">

                    <div className="text-orange-600 font-medium mt-1">⚠️ Direct route (routing service unavailable)</div>        <div className="text-sm text-yellow-700">

                  )}          <strong>Active Routes:</strong> {roadRoutes.length} | 

                </div>          <strong> High-Risk Fires:</strong> {filteredFires.filter(f => f.confidence === 'h').length} |

              </div>          <strong> Total Fires:</strong> {filteredFires.length}

            ) : null;        </div>

          })()}        <button 

        </div>          onClick={async () => {

      )}            console.log('=== Manual Test ===');

            const testFire = filteredFires.find(f => f.confidence === 'h');

      {/* Map */}            if (testFire) {

      <div className="bg-white rounded-lg shadow overflow-hidden">              console.log('Testing with fire:', testFire);

        <MapContainer               const hospital = findNearestHospital(testFire.latitude, testFire.longitude);

          center={[20.5937, 78.9629]}               console.log('Found hospital:', hospital);

          zoom={5}               if (hospital) {

          style={{ height: '600px', width: '100%' }}                const route = await getRoadRoute(testFire.latitude, testFire.longitude, hospital.lat, hospital.lng);

        >                console.log('Route result:', route);

          {/* Satellite View */}              }

          <TileLayer            }

            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"          }}

            attribution='&copy; Esri'          className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"

          />        >

          <TileLayer          Test Route (Check Console)

            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"        </button>

            attribution=""      </div>

          />

      {/* Selected Fire Panel */}

          {/* Fire Markers */}      {selectedFire && (

          {filteredFires.map((fire) => (        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">

            <CircleMarker          <div className="flex justify-between items-start">

              key={fire.id}            <h3 className="font-semibold text-red-800">🔥 Selected Fire</h3>

              center={[fire.latitude, fire.longitude]}            <button 

              radius={Math.max(6, fire.brightness / 50)} // Size based on brightness              onClick={() => {

              color="#ffffff"                setSelectedFire(null);

              weight={2}                setRoadRoutes(prev => prev.filter(r => !r.isSelected));

              fillColor={getConfidenceColor(fire.confidence)}              }}

              fillOpacity={0.8}              className="text-red-600 hover:text-red-800 font-bold"

              eventHandlers={{            >

                click: () => handleFireClick(fire)              ×

              }}            </button>

            >          </div>

              <Popup>          <div className="mt-2 text-sm">

                <div>            <div><strong>Location:</strong> {selectedFire.district}, {selectedFire.state}</div>

                  <h4 className="font-bold text-red-600">🔥 Fire Detection Alert</h4>            <div><strong>Confidence:</strong> {getConfidenceLabel(selectedFire.confidence)}</div>

                  <div className="text-sm mt-1">            <div><strong>Type:</strong> {selectedFire.type}</div>

                    <div><strong>Confidence:</strong> {fire.confidence.toUpperCase()}</div>          </div>

                    <div><strong>Brightness:</strong> {fire.brightness.toFixed(1)}K</div>          

                    <div><strong>Date:</strong> {fire.acquisition_date}</div>          {(() => {

                    <div><strong>Time:</strong> {fire.acquisition_time}</div>            const selectedRoute = roadRoutes.find(r => r.isSelected && r.fire.id === selectedFire.id);

                    <div><strong>Satellite:</strong> {fire.satellite}</div>            return selectedRoute ? (

                    <div><strong>Coordinates:</strong> {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}</div>              <div className="mt-3 p-2 bg-green-100 rounded">

                  </div>                <h4 className="font-medium">🚗 Route to Hospital</h4>

                  <div className="mt-2 p-2 bg-red-100 rounded text-xs">                <div className="text-sm mt-1">

                    Click this marker to see route to nearest hospital                  <div><strong>Hospital:</strong> {selectedRoute.hospital.name}</div>

                  </div>                  <div><strong>Distance:</strong> {selectedRoute.route.distance} km</div>

                </div>                  <div><strong>Time:</strong> {selectedRoute.route.duration} minutes</div>

              </Popup>                  {selectedRoute.route.fallback && (

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>                    <div className="text-orange-600 font-medium">⚠️ Direct route (API unavailable)</div>

                <div className="text-xs text-center">                  )}

                  🔥 Fire Alert<br/>                </div>

                  {fire.confidence.toUpperCase()} Confidence              </div>

                </div>            ) : null;

              </Tooltip>          })()}

            </CircleMarker>        </div>

          ))}      )}



          {/* Hospital Markers */}      {/* Map */}

          {filters.showHospitals && indianHospitals.map((hospital) => (      <div className="bg-white rounded-lg shadow overflow-hidden">

            <CircleMarker        <MapContainer 

              key={hospital.id}          center={[20.5937, 78.9629]} 

              center={[hospital.lat, hospital.lng]}          zoom={5} 

              radius={8}          style={{ height: '600px', width: '100%' }}

              color="#ffffff"        >

              weight={2}          {/* Satellite View */}

              fillColor="#2563eb"          <TileLayer

              fillOpacity={0.9}            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

            >            attribution='&copy; Esri'

              <Popup>          />

                <div>          <TileLayer

                  <h4 className="font-bold text-blue-600">🏥 {hospital.name}</h4>            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"

                  <div className="text-sm mt-1">            attribution=""

                    <div><strong>Type:</strong> {hospital.type}</div>          />

                    <div><strong>Emergency Services:</strong> {hospital.emergency ? '✅ Available' : '❌ Not Available'}</div>

                    <div><strong>Location:</strong> {hospital.lat.toFixed(4)}, {hospital.lng.toFixed(4)}</div>          {/* Fire Markers */}

                  </div>          {filteredFires.map((fire) => (

                </div>            <CircleMarker

              </Popup>              key={fire.id}

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>              center={[fire.latitude, fire.longitude]}

                <div className="text-xs text-center">              radius={fire.brightness / 30}

                  🏥 {hospital.name}<br/>              color="#ffffff"

                  {hospital.type} Hospital              weight={2}

                </div>              fillColor={getConfidenceColor(fire.confidence)}

              </Tooltip>              fillOpacity={0.8}

            </CircleMarker>              eventHandlers={{

          ))}                click: () => handleFireClick(fire)

                        }}

          {/* Road Routes to Hospitals */}            >

          {roadRoutes.map((routeData) => (              <Popup>

            <Polyline                 <div>

              key={routeData.id}                  <h4 className="font-bold text-red-600">🔥 Fire Alert</h4>

              positions={routeData.route.coordinates}                  <div className="text-sm mt-1">

              color={routeData.isSelected ? "#1d4ed8" : "#dc2626"}                    <div><strong>Location:</strong> {fire.district}, {fire.state}</div>

              weight={routeData.isSelected ? 6 : 4}                    <div><strong>Confidence:</strong> {getConfidenceLabel(fire.confidence)}</div>

              opacity={0.9}                    <div><strong>Type:</strong> {fire.type}</div>

              dashArray={routeData.isSelected ? "none" : "10, 5"}                    <div><strong>Brightness:</strong> {fire.brightness.toFixed(1)}K</div>

            />                  </div>

          ))}                </div>

        </MapContainer>              </Popup>

      </div>              <Tooltip direction="top" offset={[0, -10]} opacity={1}>

                <div className="text-xs text-center">

      {/* Information Panel */}                  🔥 {fire.district}<br/>

      <div className="mt-4 bg-blue-50 rounded-lg p-4">                  {getConfidenceLabel(fire.confidence)} Risk

        <h3 className="font-medium text-blue-800 mb-2">🛣️ Real Road Navigation Features</h3>                </div>

        <ul className="text-sm text-blue-700 space-y-1">              </Tooltip>

          <li>• <strong>Satellite View:</strong> High-resolution imagery for precise location identification</li>            </CircleMarker>

          <li>• <strong>Real Road Routes:</strong> Actual driving directions using road networks (not straight lines)</li>          ))}

          <li>• <strong>Auto-Routing:</strong> High-risk fires automatically show road routes to nearest hospitals</li>

          <li>• <strong>Click Interaction:</strong> Click any fire for detailed road directions with estimated drive time</li>          {/* Hospital Markers */}

          <li>• <strong>Distance & Time:</strong> Real road distance in km and estimated drive time in minutes</li>          {filters.showHospitals && indianHospitals.map((hospital) => (

          <li>• <strong>Route Comparison:</strong> Red routes for auto-generated, blue for selected detailed routes</li>            <CircleMarker

        </ul>              key={hospital.id}

        <div className="mt-3 text-xs text-blue-600 border-t pt-2">              center={[hospital.lat, hospital.lng]}

          <strong>Data Sources:</strong><br/>              radius={8}

          🛰️ Fire Detection: NASA FIRMS (VIIRS Satellite) - Real-time updates<br/>              color="#ffffff"

          🏥 Hospital Network: Major emergency medical facilities across India<br/>              weight={2}

          📍 Satellite Imagery: High-resolution Esri World Imagery with place labels<br/>              fillColor="#2563eb"

          🛣️ Road Routing: OpenStreetMap Routing Machine (OSRM) for real driving directions              fillOpacity={0.9}

        </div>            >

      </div>              <Popup>

    </div>                <div>

  );                  <h4 className="font-bold text-blue-600">🏥 {hospital.name}</h4>

}                  <div className="text-sm mt-1">
                    <div><strong>Type:</strong> {hospital.type}</div>
                    <div><strong>Emergency:</strong> {hospital.emergency ? 'Available' : 'Not Available'}</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Road Routes */}
          {roadRoutes.map((routeData) => (
            <Polyline 
              key={routeData.id}
              positions={routeData.route.coordinates}
              color={routeData.isSelected ? "#1d4ed8" : "#dc2626"}
              weight={routeData.isSelected ? 6 : 4}
              opacity={0.9}
              dashArray={routeData.isSelected ? "none" : "10, 5"}
            />
          ))}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">🛣️ Real Road Navigation Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• High-risk fires automatically show road routes to nearest hospitals</li>
          <li>• Click any fire to see detailed road directions with drive time</li>
          <li>• Real road distance and estimated drive time displayed</li>
          <li>• Red routes: auto-generated, Blue routes: selected detailed routes</li>
          <li>• Satellite view for precise location identification</li>
        </ul>
        <div className="mt-3 text-xs text-blue-600">
          Check browser console for detailed routing information and debugging logs.
        </div>
      </div>
    </div>
  );
}