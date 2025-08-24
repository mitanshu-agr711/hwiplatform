import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/social", label: "Social Media" },
    { path: "/analysis", label: "Analysis" },
    { path: "/geospatial", label: "Geospatial Photos" },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded flex items-center justify-center text-white font-bold">
            DM
          </div>
          <div>
            <div className="font-semibold">Disaster Monitor</div>
            <div className="text-xs text-slate-500">Insights & Analysis</div>
          </div>
        </div>

        {/* Hamburger for small screens */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded hover:bg-slate-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  open
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`px-3 py-2 rounded ${
                location.pathname === l.path
                  ? "bg-slate-100 font-semibold"
                  : "hover:bg-slate-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden absolute right-4 top-full mt-2 bg-white shadow rounded w-48 z-50">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setOpen(false)}
                  className={`text-left px-4 py-3 border-b last:border-b-0 ${
                    location.pathname === l.path
                      ? "bg-slate-50 font-semibold"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
