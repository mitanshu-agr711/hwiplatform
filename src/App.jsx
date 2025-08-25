import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
import Social from "./pages/Social";
import Analysis from "./pages/Analysis";
import Geospatial from "./pages/Geospatial";
import Admin from "./pages/admin";
import Satellite from "./pages/satellite";


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-slate-900">
        {/* <Navbar /> */}
        <main className="p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/social" element={<Social />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/geospatial" element={<Geospatial />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/satellite" element={<Satellite />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
