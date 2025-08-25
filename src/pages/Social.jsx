import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Activity, AlertTriangle, BarChart3, Globe, Search, Filter, RefreshCw, 
  Calendar, MapPin, TrendingUp, Users, Zap, Shield, Clock, Target,
  ChevronDown, ChevronUp, Sun, Moon, Menu, X, Home, Database, 
  Radio, FileText, Map, Settings, Play, Pause
} from 'lucide-react';
import { useApiData, useDataFilter, useRealTimeData, useIntelligencePipeline, useNewsAnalysis } from '../hooks/useApiData';
import { defaultQueries } from '../services/api';
import { createCustomIcon, createSOSIcon, generatePopupContent } from '../components/MapUtils';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import Nav from '../components/Navbar'

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const COLORS = ['#ef4444', '#3b82f6', '#f97316', '#8b5cf6', '#10b981'];

export default function Social() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState({});
  const [selectedDisasterType, setSelectedDisasterType] = useState('general');
  const [customQuery, setCustomQuery] = useState('');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [queryLocation, setQueryLocation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Real-time API Data hooks with fallback
  const { data: statistics, loading: statsLoading, error: statsError, refetch: refetchStats } = 
    useRealTimeData('/statistics', {}, realTimeEnabled ? 60000 : 0);
  
  const { data: recentAnalyses, loading: analysesLoading, error: analysesError, refetch: refetchAnalyses } = 
    useRealTimeData('/recent-analyses', { limit: 20 }, realTimeEnabled ? 30000 : 0);

  // Intelligence Pipeline with custom query
  const currentQuery = customQuery || defaultQueries[selectedDisasterType];
  const pipelineQuery = {
    ...currentQuery,
    location: queryLocation || undefined
  };
  
  const { data: intelligencePipeline, loading: pipelineLoading, error: pipelineError, refetch: refetchPipeline } = 
    useIntelligencePipeline(pipelineQuery);

  // News Analysis with current query
  const { data: newsAnalysis, loading: newsLoading, error: newsError, refetch: refetchNews } = 
    useNewsAnalysis(pipelineQuery);

  // SOS Alerts - For demo, we'll show static alerts unless specific alert data is provided
  const { data: sosAlerts, loading: sosLoading } = useApiData('/sos-alert', {});

  // Filtered data
  const filteredAnalyses = useDataFilter(recentAnalyses, searchTerm, filterType);
  const filteredNews = useDataFilter(newsAnalysis, searchTerm, filterType);
  const filteredAlerts = useDataFilter(sosAlerts, searchTerm, filterType);

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleArticle = (id) => {
    setExpandedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Refresh all data
  const refreshAllData = () => {
    refetchStats();
    refetchAnalyses();
    refetchPipeline();
    refetchNews();
  };

  // Handle custom query submission
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    console.log('Update Analysis clicked!');
    console.log('Current query params:', {
      selectedDisasterType,
      customQuery,
      queryLocation,
      pipelineQuery
    });
    
    try {
      // Trigger refetch for both intelligence pipeline and news analysis
      await Promise.all([refetchPipeline(), refetchNews()]);
      console.log('Analysis updated successfully!');
    } catch (error) {
      console.error('Error updating analysis:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  // API Status Notification Component
  const ApiStatusNotification = ({ data, error, type }) => {
    if (data?.quotaExceeded || data?.limitedAccess) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">API Quota Limited</span>
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {data?.realApiMessage || 'API quota exceeded. Showing cached/demo data with real API structure.'}
          </p>
        </motion.div>
      );
    }
    
    if (error && !data) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">API Connection Error</span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
            {error}. Showing fallback data.
          </p>
        </motion.div>
      );
    }
    
    return null;
  };

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 dark:text-red-300">{message}</span>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`
      fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300
      md:relative md:translate-x-0 md:shadow-none md:block
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Disaster Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Real-time Analysis</p>
      </div>
      
      <nav className="p-4">
        {[
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'statistics', label: 'Statistics', icon: Database },
          { id: 'analyses', label: 'Recent Analyses', icon: BarChart3 },
          { id: 'social', label: 'Social Intelligence', icon: Radio },
          { id: 'news', label: 'News Analysis', icon: FileText },
          { id: 'sos', label: 'SOS Alerts', icon: Map },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors ${
              activeTab === id 
                ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </button>
        ))}
      </nav>

      {/* Query Configuration Panel */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Query Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Disaster Type
            </label>
            <select
              value={selectedDisasterType}
              onChange={(e) => setSelectedDisasterType(e.target.value)}
              className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="general">General</option>
              <option value="earthquake">Earthquake</option>
              <option value="flood">Flood</option>
              <option value="wildfire">Wildfire</option>
              <option value="hurricane">Hurricane</option>
              <option value="landslide">Landslide</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Location (Optional)
            </label>
            <input
              type="text"
              value={queryLocation}
              onChange={(e) => setQueryLocation(e.target.value)}
              placeholder="e.g., California, US"
              className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleQuerySubmit}
            disabled={isUpdating}
            className={`w-full text-xs px-2 py-1 rounded transition-colors ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                Updating...
              </div>
            ) : (
              'Update Analysis'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ title, value, icon: Icon, change, color = 'orange', loading = false }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mt-1"></div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          )}
          {change && !loading && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-300`} />
        </div>
      </div>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* API Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              statsError ? 'bg-red-500' : statsLoading ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              API Status: {statsError ? 'Disconnected' : statsLoading ? 'Connecting...' : 'Connected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              className={`text-sm px-3 py-1 rounded ${
                realTimeEnabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              {realTimeEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {realTimeEnabled ? 'Real-time' : 'Paused'}
            </button>
            <button
              onClick={refreshAllData}
              className="text-sm px-3 py-1 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {statsLoading ? (
        <LoadingSpinner />
      ) : statsError ? (
        <ErrorMessage 
          message={`Failed to load statistics: ${statsError}`} 
          onRetry={refetchStats} 
        />
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Analyses" 
              value={statistics?.totalAnalyses?.toLocaleString() || '0'} 
              icon={Database} 
              change={12} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Avg Social Score" 
              value={statistics?.socialMediaScores?.average || '0'} 
              icon={TrendingUp} 
              change={5} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Success Rate" 
              value={`${statistics?.performanceMetrics?.accuracy || 0}%`} 
              icon={Target} 
              change={2} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Response Time" 
              value={`${statistics?.performanceMetrics?.responseTime || 0}s`} 
              icon={Clock} 
              change={-8} 
              loading={statsLoading}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disaster Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Disaster Type Distribution</h3>
              {statistics?.disasterTypeDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statistics.disasterTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statistics.disasterTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  No distribution data available
                </div>
              )}
            </div>

            {/* Analysis Type Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Analysis Type Distribution</h3>
              {statistics?.analysisTypeDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.analysisTypeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  No analysis data available
                </div>
              )}
            </div>
          </div>

          {/* Top Locations */}
          {statistics?.topLocations?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Affected Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.topLocations.map((location, index) => (
                  <div key={location.name} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-300">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{location.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{location.count} incidents</div>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const StatisticsTab = () => (
    <div className="space-y-6">
      {statsLoading ? (
        <LoadingSpinner />
      ) : statsError ? (
        <ErrorMessage message={`Failed to load statistics: ${statsError}`} onRetry={refetchStats} />
      ) : (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Successful Analyses" 
              value={statistics?.performanceMetrics?.successfulAnalyses?.toLocaleString() || '0'} 
              icon={Shield} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Average Confidence" 
              value={`${statistics?.performanceMetrics?.averageConfidence || 0}%`} 
              icon={Target} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Response Time" 
              value={`${statistics?.performanceMetrics?.responseTime || 0}s`} 
              icon={Clock} 
              loading={statsLoading}
            />
            <StatsCard 
              title="Accuracy" 
              value={`${statistics?.performanceMetrics?.accuracy || 0}%`} 
              icon={Activity} 
              loading={statsLoading}
            />
          </div>

          {/* Social Media Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Social Media Score Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {statistics?.socialMediaScores?.highest || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Highest Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {statistics?.socialMediaScores?.average || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {statistics?.socialMediaScores?.lowest || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lowest Score</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const RecentAnalysesTab = () => (
    <div className="space-y-6">
      {analysesLoading ? (
        <LoadingSpinner />
      ) : analysesError ? (
        <ErrorMessage message={`Failed to load recent analyses: ${analysesError}`} onRetry={refetchAnalyses} />
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or disaster type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Flood">Flood</option>
              <option value="Wildfire">Wildfire</option>
              <option value="Hurricane">Hurricane</option>
              <option value="Landslide">Landslide</option>
            </select>
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnalyses && filteredAnalyses.length > 0 ? (
              filteredAnalyses.map((analysis) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {analysis.disasterType || analysis.type || 'Unknown Event'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {analysis.location || 'Unknown Location'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      analysis.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      analysis.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {analysis.severity || 'Unknown'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {analysis.confidence || 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Social Score</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {analysis.socialScore || 0}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {analysis.summary || 'No summary available'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{analysis.articlesAnalyzed || 0} articles analyzed</span>
                    <span>{analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : 'No timestamp'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                No recent analyses found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const SocialMediaTab = () => (
    <div className="space-y-6">
      <ApiStatusNotification data={intelligencePipeline} error={pipelineError} type="intelligence" />
      
      {pipelineLoading ? (
        <LoadingSpinner />
      ) : pipelineError ? (
        <ErrorMessage message={`Pipeline error: ${pipelineError}`} onRetry={refetchPipeline} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Media Score Gauge */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Real-time Social Media Signal Score
            </h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" 
                  data={[{ name: 'Score', value: (intelligencePipeline?.socialMediaScore || 0) * 10 }]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#f97316" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {intelligencePipeline?.socialMediaScore || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Extracted Disaster Information
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Event Type</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {intelligencePipeline?.extractedInfo?.eventType || 'No data'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {intelligencePipeline?.extractedInfo?.location || 'No data'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {intelligencePipeline?.extractedInfo?.confidence || 0}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Summary</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {intelligencePipeline?.extractedInfo?.summary || 'No summary available'}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {intelligencePipeline?.evidence?.socialMentions?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Social Mentions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {intelligencePipeline?.evidence?.articleCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {intelligencePipeline?.evidence?.trendingHashtags?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Trending Tags</div>
              </div>
            </div>

            {intelligencePipeline?.evidence?.headlines?.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Top Headlines</h4>
                {intelligencePipeline.evidence.headlines.map((headline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {headline.title}
                      </div>
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-300 font-medium">
                      {headline.relevance}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const NewsAnalysisTab = () => (
    <div className="space-y-6">
      <ApiStatusNotification data={newsAnalysis} error={newsError} type="news" />
      
      {newsLoading ? (
        <LoadingSpinner />
      ) : newsError ? (
        <ErrorMessage message={`News analysis error: ${newsError}`} onRetry={refetchNews} />
      ) : (
        <div className="space-y-6">
          {filteredNews && filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {news.event} - {news.location}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        news.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        news.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {news.severity} Severity
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Confidence: {news.confidence}%
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{news.summary}</p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(news.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Collapsible Articles Section */}
                {news.articles && news.articles.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleArticle(news.id)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        Related Articles ({news.articles.length})
                      </span>
                      {expandedArticles[news.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedArticles[news.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-3"
                        >
                          {news.articles.map((article, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white flex-1">
                                  {article.title}
                                </h4>
                                <div className="text-sm text-orange-600 dark:text-orange-300 font-medium ml-3">
                                  {article.relevanceScore}%
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {article.description}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                Source: {article.source}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No news analysis results found
            </div>
          )}
        </div>
      )}
    </div>
  );

  const SOSAlertsTab = () => (
    <div className="space-y-6">
      {sosLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Map */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">SOS Alert Locations</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer 
                center={[39.8283, -98.5795]} 
                zoom={4} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredAlerts?.map((alert) => (
                  <Marker 
                    key={alert.id} 
                    position={[alert.latitude, alert.longitude]}
                    icon={createSOSIcon(alert.priority)}
                  >
                    <Popup>
                      <div dangerouslySetInnerHTML={{ 
                        __html: generatePopupContent(alert, 'sos') 
                      }} />
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Alert List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAlerts && filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alert.alertType || alert.alert_type}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      alert.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                    </div>
                    {alert.query && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Query: "{alert.query}"
                      </div>
                    )}
                    {alert.details && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {alert.details}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'No timestamp'}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                No SOS alerts found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">API Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value="http://192.168.137.155:8000"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Real-time Updates
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  realTimeEnabled ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    realTimeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {realTimeEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Query
            </label>
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Enter custom disaster query (leave empty to use preset)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={refreshAllData}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Refresh All Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'statistics': return <StatisticsTab />;
      case 'analyses': return <RecentAnalysesTab />;
      case 'social': return <SocialMediaTab />;
      case 'news': return <NewsAnalysisTab />;
      case 'sos': return <SOSAlertsTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Nav/>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 md:ml-0">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Social Media & Disaster Analysis Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Activity className="w-4 h-4 mr-1" />
                  {realTimeEnabled ? 'Live Updates' : 'Manual Updates'}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
