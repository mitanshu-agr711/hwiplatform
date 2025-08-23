import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Social from './pages/Social'
import Analysis from './pages/Analysis'
import Geospatial from './pages/Geospatial'

export default function App() {
  const [route, setRoute] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Navbar route={route} setRoute={setRoute} />
      <main className="p-4 md:p-8">
        {route === 'home' && <Home setRoute={setRoute} />}
        {route === 'dashboard' && <Dashboard />}
        {route === 'social' && <Social />}
        {route === 'analysis' && <Analysis />}
        {route === 'geospatial' && <Geospatial />}
      </main>
    </div>
  )
}
