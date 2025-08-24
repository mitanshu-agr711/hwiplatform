import React, { useEffect, useState } from "react";

export default function Home() {
  const [disasterData, setDisasterData] = useState({
    flood: 0,
    landslide: 0,
    fire: 0,
    cyclone: 0,
  });

  // Fetch real-time disaster data (replace with your API later)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.example.com/disasters"); // put your API here
        const data = await res.json();
        setDisasterData(data);
      } catch (err) {
        console.error("Error fetching disaster data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // update every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          Centralized Disaster Management
        </h1>
        <p className="text-center text-gray-200">
          Real-Time Disaster Analysis & Emergency Support
        </p>
      </header>

      {/* Real-Time Disaster Analysis */}
      <section className="flex-1 px-6 py-10">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Real-Time Disaster Analysis of India
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-700">Flood</h3>
            <p className="text-3xl font-bold">{disasterData.flood}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-green-700">Landslide</h3>
            <p className="text-3xl font-bold">{disasterData.landslide}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600">Fire</h3>
            <p className="text-3xl font-bold">{disasterData.fire}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-700">Cyclone</h3>
            <p className="text-3xl font-bold">{disasterData.cyclone}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-10 px-6">
        <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold">📩 SOS Messaging</h3>
            <p className="text-gray-600 mt-2">
              Send instant SOS messages during disasters for immediate help.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold">📍 Live Location Tracking</h3>
            <p className="text-gray-600 mt-2">
              Get real-time location updates of disaster-prone areas.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold">🌐 Centralized Management</h3>
            <p className="text-gray-600 mt-2">
              One-stop platform for disaster response & management.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold">📊 Social Media Metrics</h3>
            <p className="text-gray-600 mt-2">
              Monitor disaster impact using live social media analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Centralized Disaster Management</p>
        <p className="text-sm text-gray-200">
          Built with ❤️ using React & TailwindCSS
        </p>
      </footer>
    </div>
  );
}
