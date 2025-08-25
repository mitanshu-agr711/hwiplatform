import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: "/home", label: "Home" },
    // { path: "/dashboard", label: "Dashboard" },
    { path: "/social", label: "Social Media" },
    { path: "/analysis", label: "Analysis" },
    { path: "/geospatial", label:  "Dashboard" },
    { path: "/satellite", label:  "Satellite" },

  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
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
          
          {/* Signup Button */}
          {/* <button
            onClick={() => setShowSignup(true)}
            className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-lg hover:from-red-600 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Sign Up
          </button> */}
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
              
              {/* Mobile Signup Button */}
              {/* <button
                onClick={() => {
                  setShowSignup(true);
                  setOpen(false);
                }}
                className="text-left px-4 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold hover:from-red-600 hover:to-yellow-600 transition-all duration-200"
              >
                Sign Up
              </button> */}
            </div>
          </div>
        )}

        {/* Signup Modal */}
        {showSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Join Disaster Monitor</h2>
                  <p className="text-sm text-gray-600 mt-1">Create your account to get started</p>
                </div>
                <button
                  onClick={() => setShowSignup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSignupSubmit} className="p-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-red-600 hover:text-red-700 underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red-600 hover:text-red-700 underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Create Account
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignup(false);
                        // You can add login modal logic here
                        alert("Login functionality can be added here");
                      }}
                      className="text-red-600 hover:text-red-700 font-semibold underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
