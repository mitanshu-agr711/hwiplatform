import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, Shield, Satellite, Users, Phone, MapPin, 
  TrendingUp, Activity, Heart, Globe, Menu, X, Eye, EyeOff,
  Mail, Lock, User, ChevronRight, Zap, Database, Brain
} from 'lucide-react'

export default function Home({ setRoute }) {
  const [showSignup, setShowSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    phone: '',
    area: ''
  })
  const [signupForm, setSignupForm] = useState({
    name: '',
    state: '',
    password: ''
  })
  
  const [metrics, setMetrics] = useState({
    totalAlerts: 1247,
    activeCases: 89,
    peopleHelped: 12456,
    socialMentions: 2843,
    rescueTeams: 156,
    volunteers: 3421,
    dangerZones: 23
  })

  const [chartData, setChartData] = useState({
    timeline: [
      { month: 'Jan', cases: 45 },
      { month: 'Feb', cases: 52 },
      { month: 'Mar', cases: 38 },
      { month: 'Apr', cases: 61 },
      { month: 'May', cases: 55 },
      { month: 'Jun', cases: 67 }
    ],
    distribution: [
      { label: 'Danger Zones', value: 23, color: '#ea580c' },
      { label: 'Rescue Teams', value: 156, color: '#f97316' },
      { label: 'Volunteers', value: 3421, color: '#fb923c' },
      { label: 'Active Cases', value: 89, color: '#fdba74' }
    ]
  })

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        socialMentions: prev.socialMentions + Math.floor(Math.random() * 5),
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 3),
        activeCases: Math.max(50, prev.activeCases + Math.floor(Math.random() * 6 - 3))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle form submissions
  const handleSignupSubmit = (e) => {
    e.preventDefault()
    console.log('Signup data:', signupForm)
    alert('Account created successfully!')
    setSignupForm({ name: '', state: '', password: '' })
    setShowSignup(false)
  }

  const handleVolunteerSubmit = (e) => {
    e.preventDefault()
    console.log('Volunteer data:', volunteerForm)
    alert('Thank you for volunteering! We will contact you soon.')
    setVolunteerForm({ name: '', phone: '', area: '' })
  }

  // Animated Counter Component
 const AnimatedCounter = ({ target, label, icon, color = 'text-blue-600', darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-12 h-12 ${
            darkMode
              ? 'bg-gray-700'
              : color === 'text-red-600'
              ? 'bg-red-100'
              : color === 'text-green-600'
              ? 'bg-green-100'
              : color === 'text-blue-600'
              ? 'bg-blue-100'
              : 'bg-orange-100'
          } rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
        {target?.toLocaleString()}
      </div>

      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </div>
    </div>
  );
};


  // Line Chart Component
  const LineChart = () => {
    const maxValue = Math.max(...chartData.timeline.map(d => d.cases))
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'}`}>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Disaster Cases Over Time</h3>
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ea580c', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 0.8}} />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line 
                key={i} 
                x1="50" 
                y1={40 + i * 30} 
                x2="350" 
                y2={40 + i * 30} 
                stroke={darkMode ? '#374151' : '#fed7aa'} 
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              points={chartData.timeline.map((d, i) => 
                `${50 + i * 50},${40 + (maxValue - d.cases) * 120 / maxValue}`
              ).join(' ')}
              className="animate-pulse"
            />
            
            {/* Data points */}
            {chartData.timeline.map((d, i) => (
              <circle
                key={i}
                cx={50 + i * 50}
                cy={40 + (maxValue - d.cases) * 120 / maxValue}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all cursor-pointer"
              />
            ))}
            
            {/* X-axis labels */}
            {chartData.timeline.map((d, i) => (
              <text
                key={i}
                x={50 + i * 50}
                y={180}
                textAnchor="middle"
                className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
              >
                {d.month}
              </text>
            ))}
          </svg>
        </div>
      </div>
    )
  }

  // Pie Chart Component
  const PieChart = () => {
    const total = chartData.distribution.reduce((sum, item) => sum + item.value, 0)
    let startAngle = 0
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'}`}>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Resource Distribution</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {chartData.distribution.map((item, index) => {
                const percentage = (item.value / total) * 100
                const angle = (percentage / 100) * 360
                const radius = 70
                const x1 = 96 + radius * Math.cos((startAngle * Math.PI) / 180)
                const y1 = 96 + radius * Math.sin((startAngle * Math.PI) / 180)
                const x2 = 96 + radius * Math.cos(((startAngle + angle) * Math.PI) / 180)
                const y2 = 96 + radius * Math.sin(((startAngle + angle) * Math.PI) / 180)
                const largeArc = angle > 180 ? 1 : 0
                
                const pathData = `M 96 96 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
                startAngle += angle
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {total.toLocaleString()}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          {chartData.distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </div>
              <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      
      {/* Sticky Navbar */}
     <nav
  className={`fixed top-0 left-0 w-full z-50 ${
    darkMode ? "bg-gray-800/95" : "bg-white/95"
  } backdrop-blur-md border-b ${
    darkMode ? "border-gray-700" : "border-gray-200"
  } transition-colors duration-300`}
>
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div
            className={`font-bold text-lg ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            DisasterScope
          </div>
          <div
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Emergency Response
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-yellow-400"
              : "bg-gray-100 text-gray-600"
          } hover:bg-opacity-80 transition-all`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Sign Up Button */}
        <button
          onClick={() => setShowSignup(true)}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 text-yellow-400"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-lg ${
            darkMode ? "text-white" : "text-gray-600"
          }`}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div
        className={`md:hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        } border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } py-4`}
      >
        <div className="flex flex-col space-y-4">
          <a
            href="#home"
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } font-medium px-4`}
          >
            Home
          </a>
          <button
            onClick={() => setRoute("dashboard")}
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } font-medium px-4 text-left`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setRoute("social")}
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } font-medium px-4 text-left`}
          >
            Social Media
          </button>
          <a
            href="#satellite"
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } font-medium px-4`}
          >
            Satellite Analysis
          </a>
          <button
            onClick={() => setShowSignup(true)}
            className="mx-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    )}
  </div>
</nav>


      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section id="home" className="py-20 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                <AlertTriangle className="w-4 h-4 mr-2" />
                🚨 Live Monitoring Active
              </div>
              
              <h1 className={`text-5xl lg:text-7xl font-extrabold leading-tight ${darkMode ? 'text-white' : 'bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent'}`}>
                Centralized 
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Disaster Management
                </span>
                <span className={`block text-4xl lg:text-5xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  & Response Platform
                </span>
              </h1>
              
              <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-powered disaster monitoring, real-time alerts, and coordinated emergency response. 
                Save lives with intelligent analytics and instant communication.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setRoute('dashboard')} 
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  🚀 Launch Dashboard
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setRoute('analysis')} 
                  className={`px-8 py-4 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400' : 'border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600'} rounded-xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1`}
                >
                  📊 View Analytics
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trusted by 500+ organizations</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Animation */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/20">
    {/* Disaster Image */}
    <img 
      src="../images/area.jpeg" 
      alt="Disaster Response"
      className="w-full h-64 lg:h-96 object-cover"
    />

    {/* Optional overlay for better text contrast */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* Optional caption or badge */}
    <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
      🌪️ Live Disaster Monitoring
    </div>
  </div>
        </div>

          </div>
        </section>

        {/* Live Global Impact Section */}
        <section className="py-10">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Live Global Impact</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto text-lg`}>
              Real-time statistics and interactive visualizations showing our platform's reach and effectiveness.
            </p>
          </div>

          {/* Animated Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <AnimatedCounter 
              target={metrics.totalAlerts} 
              label="Total Alerts Issued" 
              icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
              color="text-red-600"
            />
            <AnimatedCounter 
              target={metrics.activeCases} 
              label="Active Cases" 
              icon={<Activity className="w-6 h-6 text-orange-500" />}
              color="text-orange-600"
            />
            <AnimatedCounter 
              target={metrics.peopleHelped} 
              label="People Assisted" 
              icon={<Heart className="w-6 h-6 text-green-500" />}
              color="text-green-600"
            />
            <AnimatedCounter 
              target={metrics.socialMentions} 
              label="Social Mentions" 
              icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
              color="text-blue-600"
            />
          </div>

          {/* Interactive Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            <LineChart />
            <PieChart />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Advanced Disaster Response Features</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto text-lg`}>
              Cutting-edge technology to detect, analyze, and respond to disasters in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Social Media Intelligence */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Social Media Intelligence</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                AI-powered sentiment analysis of social media posts to detect early warning signs and public sentiment during disasters.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live Analysis Active</span>
              </div>
            </div>

            {/* Live Satellite Data */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Satellite className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Live Satellite Data</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Real-time satellite imagery and data analysis to identify danger zones, track weather patterns, and monitor disaster progression.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Satellite Feed Live</span>
              </div>
            </div>

            {/* AI Integrated SOS */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>AI Integrated SOS</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Automated emergency alerts and SOS facility with AI-powered threat assessment and instant notification systems.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Auto Alerts Enabled</span>
              </div>
            </div>

            {/* Centralized Management */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Centralized Hub</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Unified command center for disaster management with integrated communication, resource allocation, and response coordination.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hub Operational</span>
              </div>
            </div>
          </div>
        </section>

        {/* Innovative Live Updates Ticker */}
        <section className="py-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-orange-100'} overflow-hidden`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-orange-50'} px-6 py-3 border-b ${darkMode ? 'border-gray-600' : 'border-orange-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Live Global Updates</span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center space-x-4 animate-marquee">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  🌊 Flood alert issued for Mumbai region • 
                </span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  🔥 Wildfire contained in California • 
                </span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  🌪️ Cyclone warning for Bangladesh coast • 
                </span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  ⛑️ 23 rescue teams deployed to affected areas • 
                </span>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
                  📊 AI analysis shows 87% accuracy in early detection •
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} rounded-t-3xl mt-20`}>
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Emergency Helpline & Volunteer Form Section */}
            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              
              {/* Emergency Helpline */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mb-6 shadow-lg">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  Emergency Rescue Helpline
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4 justify-center lg:justify-start">
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-800'} font-mono text-2xl font-semibold`}>
                      📞 1-800-RESCUE
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 justify-center lg:justify-start">
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-800'} font-mono text-2xl font-semibold`}>
                      📱 +91-911-HELP
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 justify-center lg:justify-start">
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-800'} font-mono text-2xl font-semibold`}>
                      🆘 SOS-DISASTER
                    </span>
                  </div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-2xl shadow-lg border ${darkMode ? 'border-gray-600' : 'border-orange-100'}`}>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-base leading-relaxed`}>
                    <strong className="text-orange-600">24/7 Emergency Response</strong> • 
                    Multilingual Support • GPS Location Tracking • 
                    Instant Emergency Team Dispatch
                  </p>
                </div>
              </div>

              {/* Volunteer Registration Form */}
              <div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-3xl p-8 shadow-xl border ${darkMode ? 'border-gray-600' : 'border-orange-200'}`}>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Join Our Volunteer Network
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                      Make a difference in emergency response
                    </p>
                  </div>
                  
                  <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Full Name
                        </label>
                        <div className="relative">
                          <User className={`absolute left-4 top-4 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-orange-500'}`} />
                          <input
                            type="text"
                            value={volunteerForm.name}
                            onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                            className={`w-full pl-12 pr-4 py-4 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-orange-50 border-orange-200 text-gray-900'} border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-400`}
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className={`absolute left-4 top-4 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-orange-500'}`} />
                          <input
                            type="tel"
                            value={volunteerForm.phone}
                            onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                            className={`w-full pl-12 pr-4 py-4 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-orange-50 border-orange-200 text-gray-900'} border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-400`}
                            placeholder="+91 9876543210"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                        Area of Service
                      </label>
                      <div className="relative">
                        <MapPin className={`absolute left-4 top-4 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-orange-500'}`} />
                        <select
                          value={volunteerForm.area}
                          onChange={(e) => setVolunteerForm({...volunteerForm, area: e.target.value})}
                          className={`w-full pl-12 pr-4 py-4 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-orange-50 border-orange-200 text-gray-900'} border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all`}
                          required
                        >
                          <option value="">Select your area of expertise</option>
                          <option value="Medical Aid">🏥 Medical Aid & First Response</option>
                          <option value="Search Rescue">🔍 Search & Rescue Operations</option>
                          <option value="Relief Distribution">📦 Relief Distribution</option>
                          <option value="Communication">📡 Communication & Coordination</option>
                          <option value="Technical Support">💻 Technical Support</option>
                          <option value="Transportation">🚛 Transportation & Logistics</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-lg transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      Register as Volunteer
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Footer Links Section */}
            <div className={`border-t-2 ${darkMode ? 'border-gray-700' : 'border-orange-200'} pt-16`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* Brand Section */}
                <div className="lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DisasterScope</span>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-orange-600'} font-medium`}>Emergency Response</p>
                    </div>
                  </div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed mb-6`}>
                    Advanced disaster monitoring and response coordination platform powered by AI and real-time data analytics for saving lives.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform shadow-md">f</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform shadow-md">t</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform shadow-md">in</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform shadow-md">yt</div>
                  </div>
                </div>

                {/* Platform Links */}
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Platform</h4>
                  <ul className="space-y-4">
                    <li>
                      <button 
                        onClick={() => setRoute('dashboard')} 
                        className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}
                      >
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setRoute('analysis')} 
                        className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}
                      >
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Analytics
                      </button>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        API Access
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Mobile App
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Resources Links */}
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Resources</h4>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Case Studies
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Training Programs
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Community Forum
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact & Support */}
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Support</h4>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <Globe className="w-4 h-4 mr-2" />
                        Global Partners
                      </a>
                    </li>
                    <li>
                      <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium flex items-center group`}>
                        <Heart className="w-4 h-4 mr-2" />
                        Donate
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className={`border-t-2 ${darkMode ? 'border-gray-700' : 'border-orange-200'} pt-8`}>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center lg:text-left`}>
                    © {new Date().getFullYear()} DisasterScope. All rights reserved. Built with ❤️ for humanity.
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-end gap-8 text-sm">
                    <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium`}>
                      Privacy Policy
                    </a>
                    <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium`}>
                      Terms of Service
                    </a>
                    <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium`}>
                      Cookie Policy
                    </a>
                    <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'} transition-colors font-medium`}>
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Join DisasterScope</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Create your emergency response account</p>
              </div>
              <button
                onClick={() => setShowSignup(false)}
                className={`p-2 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} rounded-full transition-colors`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSignupSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    required
                    className={`w-full pl-10 pr-4 py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  State/Region
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <select
                    value={signupForm.state}
                    onChange={(e) => setSignupForm({...signupForm, state: e.target.value})}
                    required
                    className={`w-full pl-10 pr-4 py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  >
                    <option value="">Select your state</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    required
                    minLength={6}
                    className={`w-full pl-10 pr-12 py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Create Emergency Account
              </button>

              {/* Login Link */}
              <div className={`text-center pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignup(false);
                      alert("Login functionality coming soon!");
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
  )
}
