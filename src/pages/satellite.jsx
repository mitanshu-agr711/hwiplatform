import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileType2, 
  AlertCircle, 
  Satellite, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Download,
  Layers,
  AlertTriangle
} from 'lucide-react';

import Nav from "../components/Navbar";

export default function SatelliteAnalysis() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // Enhanced file validation
  const validateFile = (file) => {
    const validTypes = [
      'image/tiff', 
      'image/geotiff', 
      'application/json', 
      'text/csv',
      'image/jpeg',
      'image/png',
      'application/zip'
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.some(type => file.type === type || file.name.toLowerCase().endsWith(type.split('/')[1]))) {
      return 'Please upload a valid satellite data file (GeoTIFF, JSON, CSV, JPG, PNG, or ZIP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 50MB';
    }

    return null;
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Process the uploaded file
  const processFile = (selectedFile) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
    }

    // Start analysis
    performAnalysis(selectedFile);
  };

  // Handle file input change
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  // Enhanced mock analysis with more realistic data
  const performAnalysis = async (file) => {
    try {
      setLoading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Generate realistic mock analysis based on file type
      const analysisResults = generateMockAnalysis(file);
      setAnalysis(analysisResults);

    } catch (err) {
      setError('Error analyzing satellite data. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Generate mock analysis data
  const generateMockAnalysis = (file) => {
    const isImageFile = file.type.startsWith('image/');
    
    return {
      timestamp: new Date().toISOString(),
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      metadata: {
        resolution: isImageFile ? '10m' : '30m',
        bands: isImageFile ? ['Red', 'Green', 'Blue'] : ['Red', 'Green', 'Blue', 'NIR', 'SWIR1', 'SWIR2'],
        coverage: `${Math.floor(Math.random() * 500) + 100} sq km`,
        satellite: ['Landsat-8', 'Sentinel-2', 'MODIS', 'Spot-6'][Math.floor(Math.random() * 4)],
        acquisitionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      landCover: {
        vegetation: Math.floor(Math.random() * 30) + 35,
        water: Math.floor(Math.random() * 15) + 10,
        urban: Math.floor(Math.random() * 20) + 15,
        agriculture: Math.floor(Math.random() * 15) + 10,
        bare: Math.floor(Math.random() * 10) + 5,
        forest: Math.floor(Math.random() * 15) + 10
      },
      indices: {
        ndvi: (0.3 + Math.random() * 0.5).toFixed(3),
        ndwi: (0.1 + Math.random() * 0.3).toFixed(3),
        ndbi: (-0.2 + Math.random() * 0.4).toFixed(3)
      },
      anomalies: [
        { 
          type: 'Deforestation', 
          confidence: 0.85 + Math.random() * 0.12, 
          area: `${(Math.random() * 5 + 1).toFixed(1)} sq km`,
          severity: 'High',
          coordinates: [
            { lat: 23.5 + Math.random() * 0.1, lng: 87.3 + Math.random() * 0.1 }
          ]
        },
        { 
          type: 'Urban Expansion', 
          confidence: 0.78 + Math.random() * 0.15, 
          area: `${(Math.random() * 3 + 0.5).toFixed(1)} sq km`,
          severity: 'Medium',
          coordinates: [
            { lat: 23.6 + Math.random() * 0.1, lng: 87.4 + Math.random() * 0.1 }
          ]
        },
        { 
          type: 'Water Body Change', 
          confidence: 0.72 + Math.random() * 0.18, 
          area: `${(Math.random() * 2 + 0.3).toFixed(1)} sq km`,
          severity: 'Low',
          coordinates: [
            { lat: 23.7 + Math.random() * 0.1, lng: 87.2 + Math.random() * 0.1 }
          ]
        }
      ],
      recommendations: [
        "Monitor deforestation hotspots identified in the northern region",
        "Implement urban planning measures for sustainable development",
        "Conduct field verification of detected water body changes",
        "Set up regular monitoring schedule for detected anomalies"
      ]
    };
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-8">
              <Nav />
        
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Satellite className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Satellite Data Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your satellite imagery and geospatial data to get comprehensive analysis including land cover classification, 
            change detection, and environmental monitoring insights. (suggestions)
          </p>
        </div>

        {/* File Upload Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
              <Upload className="w-6 h-6 mr-2 text-blue-600" />
              Upload Satellite Data
            </h2>

            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              {loading ? (
                <div className="py-8">
                  <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Analyzing satellite data...</p>
                  <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">{uploadProgress.toFixed(0)}% complete</p>
                </div>
              ) : file ? (
                <div className="py-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">{file.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAnalysis();
                    }}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Satellite className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    Drop your satellite data here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                   
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['GeoTIFF', 'JSON', 'CSV', 'JPG', 'PNG', 'ZIP'].map(format => (
                      <span key={format} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".tiff,.geotiff,.json,.csv,.jpg,.jpeg,.png,.zip"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Upload Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Preview Section */}
            {previewUrl && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </h3>
                <img 
                  src={previewUrl} 
                  alt="Satellite data preview" 
                  className="max-w-full h-48 object-cover rounded-lg mx-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center text-gray-800">
                  <BarChart3 className="w-8 h-8 mr-3 text-green-600" />
                  Analysis Results
                </h2>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                  <button 
                    onClick={resetAnalysis}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    New Analysis
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dataset Information */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
                      <FileType2 className="w-5 h-5 mr-2" />
                      Dataset Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File:</span>
                        <span className="font-medium text-gray-800">{analysis.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-800">{analysis.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satellite:</span>
                        <span className="font-medium text-gray-800">{analysis.metadata.satellite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium text-gray-800">{analysis.metadata.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage:</span>
                        <span className="font-medium text-gray-800">{analysis.metadata.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Acquired:</span>
                        <span className="font-medium text-gray-800">{analysis.metadata.acquisitionDate}</span>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-gray-600 mb-2">Spectral Bands:</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.metadata.bands.map((band, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                              {band}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spectral Indices */}
                  <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-green-800">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Spectral Indices
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">NDVI (Vegetation)</span>
                        <span className="font-bold text-green-600">{analysis.indices.ndvi}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">NDWI (Water)</span>
                        <span className="font-bold text-blue-600">{analysis.indices.ndwi}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">NDBI (Built-up)</span>
                        <span className="font-bold text-gray-600">{analysis.indices.ndbi}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Land Cover Distribution */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-xl font-semibold mb-6 flex items-center text-purple-800">
                      <Layers className="w-5 h-5 mr-2" />
                      Land Cover Classification
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(analysis.landCover).map(([key, value]) => (
                        <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="capitalize font-medium text-gray-700">{key}</span>
                            <span className="font-bold text-lg text-purple-600">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Anomalies */}
              <div className="mt-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-red-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Detected Changes & Anomalies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.anomalies.map((anomaly, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-lg text-gray-800">{anomaly.type}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          anomaly.severity === 'High' ? 'bg-red-100 text-red-800' :
                          anomaly.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {anomaly.severity}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{(anomaly.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Affected Area:</span>
                          <span className="font-medium">{anomaly.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-xs">
                            {anomaly.coordinates[0].lat.toFixed(3)}, {anomaly.coordinates[0].lng.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-cyan-800">
                  <Clock className="w-5 h-5 mr-2" />
                  Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Timestamp */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <Clock className="w-4 h-4 inline mr-1" />
                Analysis completed on {new Date(analysis.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!analysis && !loading && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Analysis Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Layers className="w-8 h-8 text-blue-600" />,
                    title: "Land Cover Classification",
                    description: "Automatic classification of vegetation, water bodies, urban areas, and bare land using machine learning algorithms."
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                    title: "Change Detection",
                    description: "Identify temporal changes in land use, deforestation, urban expansion, and environmental degradation."
                  },
                  {
                    icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
                    title: "Spectral Analysis",
                    description: "Calculate vegetation indices (NDVI, NDWI, NDBI) for environmental monitoring and assessment."
                  },
                  {
                    icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
                    title: "Anomaly Detection",
                    description: "Detect unusual patterns and environmental anomalies using advanced computer vision techniques."
                  },
                  {
                    icon: <MapPin className="w-8 h-8 text-orange-600" />,
                    title: "Geospatial Mapping",
                    description: "Precise geographic coordinate mapping and spatial analysis for location-based insights."
                  },
                  {
                    icon: <Satellite className="w-8 h-8 text-cyan-600" />,
                    title: "Multi-sensor Support",
                    description: "Compatible with Landsat, Sentinel, MODIS, and other satellite imagery formats."
                  }
                ].map((feature, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}