import L from 'leaflet';

// Custom marker icons for different disaster types
export const createCustomIcon = (type, severity = 'medium') => {
  const colors = {
    high: '#ef4444',
    medium: '#f97316', 
    low: '#10b981',
    critical: '#dc2626'
  };

  const size = severity === 'high' || severity === 'critical' ? 25 : severity === 'medium' ? 20 : 15;
  
  const icons = {
    earthquake: '🏚️',
    flood: '🌊',
    wildfire: '🔥',
    hurricane: '🌀',
    landslide: '⛰️',
    'emergency evacuation': '🚨',
    'medical emergency': '🏥',
    'rescue request': '🆘',
    'shelter request': '🏠'
  };

  const emoji = icons[type?.toLowerCase()] || '⚠️';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${colors[severity.toLowerCase()] || colors.medium};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.6}px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-disaster-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Priority-based marker for SOS alerts
export const createSOSIcon = (priority) => {
  const colors = {
    critical: '#dc2626',
    high: '#f97316',
    medium: '#eab308',
    low: '#10b981'
  };

  const size = priority === 'Critical' ? 30 : priority === 'High' ? 25 : 20;
  
  return L.divIcon({
    html: `
      <div style="
        background: ${colors[priority?.toLowerCase()] || colors.medium};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.6}px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        animation: pulse 2s infinite;
      ">
        🆘
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    className: 'sos-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Heat map configuration for disaster density
export const getHeatMapConfig = () => ({
  radius: 20,
  maxZoom: 17,
  gradient: {
    0.2: '#10b981',
    0.4: '#eab308', 
    0.6: '#f97316',
    0.8: '#ef4444',
    1.0: '#dc2626'
  }
});

// Map style configurations
export const mapStyles = {
  default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

// Popup content generator
export const generatePopupContent = (item, type = 'disaster') => {
  switch (type) {
    case 'disaster':
      return `
        <div class="p-3 min-w-48">
          <h3 class="font-bold text-lg mb-2">${item.disasterType || item.type}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Severity:</strong> <span class="px-2 py-1 rounded text-xs ${
              item.severity === 'High' ? 'bg-red-100 text-red-800' :
              item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">${item.severity}</span></p>
            <p><strong>Confidence:</strong> ${item.confidence}%</p>
            <p><strong>Time:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
            ${item.summary ? `<p class="mt-2 text-gray-600">${item.summary}</p>` : ''}
          </div>
        </div>
      `;
    
    case 'sos':
      return `
        <div class="p-3 min-w-48">
          <h3 class="font-bold text-lg mb-2">${item.alertType}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Priority:</strong> <span class="px-2 py-1 rounded text-xs ${
              item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
              item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }">${item.priority}</span></p>
            <p><strong>Query:</strong> "${item.query}"</p>
            <p><strong>Coordinates:</strong> ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</p>
            <p><strong>Time:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
            ${item.details ? `<p class="mt-2 text-gray-600">${item.details}</p>` : ''}
          </div>
        </div>
      `;
    
    default:
      return `<div class="p-3">${JSON.stringify(item)}</div>`;
  }
};
