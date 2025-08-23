import React, { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { disasterMock } from '../utils/mockData'

function iconForType(type) {
  const color = type === 'Earthquake' ? 'bg-red-500' : type === 'Flood' ? 'bg-blue-500' : type === 'Wildfire' ? 'bg-orange-500' : 'bg-gray-500'
  const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='16' cy='16' r='10' fill='${type === 'Earthquake' ? '%23ef4444' : type === 'Flood' ? '%23006bff' : type === 'Wildfire' ? '%23f97316' : '%236b7280'}' /></svg>`
  return L.icon({ iconUrl: svg, iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28] })
}

export default function Dashboard() {
  // Base layer: 'map' or 'satellite'
  const [baseLayer, setBaseLayer] = useState('map')

  // Disaster types present in data
  const uniqueTypes = useMemo(() => Array.from(new Set(disasterMock.map(d => d.type))), [])

  // Visibility toggles per type
  const [visibleTypes, setVisibleTypes] = useState(() => {
    const obj = {}
    uniqueTypes.forEach(t => { obj[t] = true })
    return obj
  })
  const [allDisasters, setAllDisasters] = useState(true)

  // Severity filter
  const severityLevels = ['All', 'Low', 'Medium', 'High', 'Critical']
  const [severity, setSeverity] = useState('All')

  // Time filter
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Sync allDisasters with visibleTypes
  useEffect(() => {
    const allOn = uniqueTypes.every(t => visibleTypes[t])
    setAllDisasters(allOn)
  }, [visibleTypes, uniqueTypes])

  // Toggle handlers
  function toggleType(t) {
    setVisibleTypes(prev => ({ ...prev, [t]: !prev[t] }))
  }

  function setAllToggle(v) {
    const next = {}
    uniqueTypes.forEach(t => { next[t] = v })
    setVisibleTypes(next)
    setAllDisasters(v)
  }

  // Filter logic for markers
  const filtered = useMemo(() => {
    return disasterMock.filter(d => {
      // type visibility
      if (!visibleTypes[d.type]) return false

      // severity
      if (severity !== 'All') {
        // treat unknown/other severities as not matching
        if (d.severity !== severity) return false
      }

      // date range
      if (startDate) {
        const sd = new Date(startDate)
        const dd = new Date(d.date)
        if (dd < sd) return false
      }
      if (endDate) {
        const ed = new Date(endDate)
        const dd = new Date(d.date)
        if (dd > ed) return false
      }

      return true
    })
  }, [visibleTypes, severity, startDate, endDate])

  const total = filtered.length
  const mostRecent = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  const highest = filtered.slice().sort((a, b) => ({ High: 3, Medium: 2, Low: 1 })[b.severity] - ({ High: 3, Medium: 2, Low: 1 })[a.severity])[0]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white rounded shadow p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Interactive Map</h3>
            <div className="text-sm text-slate-600">Visible events: <strong className="ml-2">{total}</strong></div>
          </div>

          <MapContainer center={[20,0]} zoom={2} className="leaflet-container">
            {baseLayer === 'map' ? (
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            ) : (
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            )}

            {filtered.map(d => (
              <Marker key={d.id} position={[d.lat, d.lng]} icon={iconForType(d.type)}>
                <Popup>
                  <div className="max-w-sm">
                    <div className="font-semibold">{d.type}</div>
                    <div className="text-sm text-slate-600">{d.description}</div>
                    <div className="text-xs mt-2">Date: {d.date}  Severity: {d.severity}</div>
                  </div>
                </Popup>
                <Tooltip>{d.type}  {d.severity}</Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="bg-white rounded shadow p-4 space-y-4">
          <h4 className="font-semibold">View Options</h4>

          {/* Base layer selection */}
          <div>
            <div className="text-sm font-medium text-slate-700">Map Base Layers</div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-3">
                <input type="radio" name="base" value="map" checked={baseLayer === 'map'} onChange={() => setBaseLayer('map')} className="form-radio" />
                <span className="text-sm">Map (OpenStreetMap)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="base" value="satellite" checked={baseLayer === 'satellite'} onChange={() => setBaseLayer('satellite')} className="form-radio" />
                <span className="text-sm">Satellite (World Imagery)</span>
              </label>
            </div>
          </div>

          {/* Disaster toggles */}
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">Disaster Data Layers</div>
              <div className="text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" checked={allDisasters} onChange={e => setAllToggle(e.target.checked)} />
                  <span className="text-xs text-slate-600">All Disasters</span>
                </label>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {uniqueTypes.map(t => (
                <div key={t} className="flex items-center justify-between">
                  <div className="text-sm">{t}</div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={!!visibleTypes[t]} onChange={() => toggleType(t)} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition relative">
                      <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform transition ${visibleTypes[t] ? 'translate-x-5' : ''}`}></span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Severity filter */}
          <div>
            <div className="text-sm font-medium text-slate-700">Severity Filter</div>
            <select value={severity} onChange={e => setSeverity(e.target.value)} className="mt-2 w-full border rounded px-2 py-1">
              {severityLevels.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Time filter */}
          <div>
            <div className="text-sm font-medium text-slate-700">Time Filter</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-600">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="text-xs text-slate-600">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">Leave empty to include all dates.</div>
          </div>

          {/* Quick stats */}
          <div className="border-t pt-3 text-sm text-slate-600">
            <div>Total visible events: <strong className="ml-2 text-slate-800">{total}</strong></div>
            <div className="mt-2">Most recent: <strong className="ml-2">{mostRecent ? `${mostRecent.type} — ${mostRecent.date}` : ''}</strong></div>
            <div className="mt-2">Highest severity: <strong className="ml-2">{highest ? `${highest.type} — ${highest.severity}` : ''}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
