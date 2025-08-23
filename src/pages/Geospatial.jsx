import React from 'react'
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { geoMock } from '../utils/mockData'

function colorForSeverity(v) {
  if (v > 0.7) return '#b91c1c'
  if (v > 0.4) return '#f97316'
  return '#fca5a5'
}

export default function Geospatial() {
  const features = geoMock.regions.map(r => ({ type: 'Feature', properties: { name: r.name, severity: r.severity, count: r.count }, geometry: { type: 'Polygon', coordinates: r.coords } }))

  const style = feature => ({ color: colorForSeverity(feature.properties.severity), weight: 1.5, fillOpacity: 0.6 })

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Geospatial Severity Distribution</h2>
      <div className="bg-white rounded shadow p-4">
        <MapContainer center={[20,0]} zoom={2} className="leaflet-container">
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
    </div>
  )
}
