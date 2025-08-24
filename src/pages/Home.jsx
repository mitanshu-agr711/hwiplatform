import React, { useState, useEffect } from 'react'
import HeroImg from '../assets/hero.png?url'

export default function Home({ setRoute }) {
  const [showLogin, setShowLogin] = useState(false)
  const [metrics, setMetrics] = useState({
    totalAlerts: 1247,
    activeCases: 89,
    peopleHelped: 12456,
    socialMentions: 2843
  })

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        socialMentions: prev.socialMentions + Math.floor(Math.random() * 5),
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 3)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="admin@disaster-monitor.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Sign In
          </button>
          
          <div className="text-center text-sm text-gray-500">
            Demo credentials: admin@demo.com / password123
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Login */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌍</span>
            </div>
            <span className="text-xl font-bold text-gray-800">DisasterScope</span>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="text-gray-600 hover:text-red-600 transition">Features</a>
            <a href="#" className="text-gray-600 hover:text-red-600 transition">Analytics</a>
            <a href="#" className="text-gray-600 hover:text-red-600 transition">API</a>
            <a href="#" className="text-gray-600 hover:text-red-600 transition">Pricing</a>
          </nav>
          
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Sign In
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center py-16">
          <div>
            <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              🚨 Live Monitoring Active
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 bg-clip-text text-transparent leading-tight">
              Real-Time Disaster Intelligence
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Monitor global disasters, track social sentiment, and coordinate emergency response with advanced AI-powered analytics and real-time data visualization.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setRoute('dashboard')} 
                className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🚀 Launch Dashboard
              </button>
              <button 
                onClick={() => setRoute('analysis')} 
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-red-600 hover:text-red-600 transition font-semibold text-lg"
              >
                📊 View Analytics
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span>Trusted by 500+ organizations</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border">
              <img src={HeroImg} alt="Disaster monitoring dashboard" className="w-full h-80 object-cover" />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                🟢 Live Data
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Metrics */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Global Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time statistics showing our platform's reach and effectiveness in disaster response coordination.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrics.totalAlerts.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Alerts Issued</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrics.activeCases}
              </div>
              <div className="text-sm text-gray-600">Active Cases</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrics.peopleHelped.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">People Assisted</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrics.socialMentions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Social Mentions</div>
            </div>
          </div>
        </section>

        {/* Social Media Integration Overview */}
        <section className="py-12">
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Social Intelligence</h3>
                <p className="text-gray-600 mb-6">
                  Our AI analyzes millions of social media posts, news articles, and sensor data to provide early disaster detection and sentiment analysis.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm">f</div>
                  <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center text-white text-sm">t</div>
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-sm">yt</div>
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm">ig</div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-blue-700">Sentiment Analysis</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">87.3%</div>
                  <div className="text-sm text-blue-600">Positive Response Rate</div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-700">Early Detection</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">23 min</div>
                  <div className="text-sm text-green-600">Average Detection Time</div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-purple-700">Social Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">2.4M</div>
                  <div className="text-sm text-purple-600">Monthly Impressions</div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-orange-700">Response Time</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 mb-1">4.2 sec</div>
                  <div className="text-sm text-orange-600">Alert Processing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Disaster Response</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform processes multiple data sources to deliver actionable insights for emergency response teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition transform">
                <span className="text-2xl text-white">📡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600 leading-relaxed">
                Aggregate data from social media, sensors, satellite imagery, and emergency services in real-time for comprehensive situational awareness.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition transform">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply machine learning algorithms for sentiment analysis, threat assessment, and predictive modeling to identify emerging disasters.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition transform">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Visualization</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive maps, real-time dashboards, and predictive analytics help emergency teams make informed decisions quickly.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join emergency response teams worldwide using our platform to save lives and coordinate disaster relief efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setRoute('dashboard')} 
                className="px-8 py-4 bg-white text-red-600 rounded-xl hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
              >
                Start Monitoring Now
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-red-600 transition font-semibold text-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌍</span>
                </div>
                <span className="text-xl font-bold text-gray-800">DisasterScope</span>
              </div>
              <p className="text-gray-600 text-sm">
                Advanced disaster monitoring and response coordination platform powered by AI and real-time data.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-red-600 transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Analytics</a></li>
                <li><a href="#" className="hover:text-red-600 transition">API Access</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-red-600 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Case Studies</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Support</a></li>
                <li><a href="#" className="hover:text-red-600 transition">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <div className="flex space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm cursor-pointer hover:bg-blue-700 transition">f</div>
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white text-sm cursor-pointer hover:bg-sky-600 transition">t</div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white text-sm cursor-pointer hover:bg-gray-900 transition">in</div>
              </div>
              <p className="text-sm text-gray-600">
                Follow us for updates and disaster response insights.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              © {new Date().getFullYear()} DisasterScope. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-red-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-red-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-red-600 transition">Contact</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal />}
    </div>
  )
}
