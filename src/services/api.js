import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://192.168.137.155:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle quota exceeded errors gracefully
    if (error.response?.status === 429 || 
        error.response?.data?.message?.includes('quota') ||
        error.response?.data?.status === 'analysis_error') {
      console.warn('API quota exceeded or analysis error, continuing with available data');
      return {
        data: {
          status: 'quota_exceeded',
          message: error.response?.data?.message || 'API quota exceeded',
          ...error.response?.data
        }
      };
    }
    
    return Promise.reject(error);
  }
);

// API Services
export class DisasterAnalysisAPI {
  
  // GET /statistics - System performance statistics and analytics
  static async getStatistics() {
    try {
      const response = await apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  // GET /recent-analyses - Recent disaster analyses and SOS alerts
  static async getRecentAnalyses(limit = 10) {
    try {
      const response = await apiClient.get('/recent-analyses', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch recent analyses: ${error.message}`);
    }
  }

  // POST /intelligence-pipeline - Complete social media intelligence pipeline
  static async runIntelligencePipeline(queryData) {
    try {
      const payload = {
        query: queryData.query || "flood OR earthquake OR cyclone OR landslide",
        location: queryData.location || null,
        page_size: queryData.pageSize || 5,
        min_location_relevance: queryData.minLocationRelevance || 0.6,
        min_disaster_relevance: queryData.minDisasterRelevance || 0.4
      };
      
      const response = await apiClient.post('/intelligence-pipeline', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to run intelligence pipeline: ${error.message}`);
    }
  }

  // POST /analyze-news - Fetch and analyze news articles for disaster information
  static async analyzeNews(queryData) {
    try {
      const payload = {
        query: queryData.query || "flood OR earthquake OR cyclone OR landslide",
        location: queryData.location || null,
        page_size: queryData.pageSize || 5,
        min_location_relevance: queryData.minLocationRelevance || 0.6,
        min_disaster_relevance: queryData.minDisasterRelevance || 0.4
      };
      
      const response = await apiClient.post('/analyze-news', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to analyze news: ${error.message}`);
    }
  }

  // POST /sos-alert - Process SOS alert and return social media intelligence
  static async processSOSAlert(alertData) {
    try {
      const payload = {
        latitude: alertData.latitude,
        longitude: alertData.longitude,
        alert_type: alertData.alertType || "general",
        priority: alertData.priority || "medium"
      };
      
      const response = await apiClient.post('/sos-alert', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to process SOS alert: ${error.message}`);
    }
  }

  // POST /analyze - Flood detection analysis (Satellite imagery analysis)
  static async analyzeFlood(analysisData) {
    try {
      const payload = {
        pre_vh_path: analysisData.preVhPath,
        pre_vv_path: analysisData.preVvPath,
        post_vh_path: analysisData.postVhPath,
        post_vv_path: analysisData.postVvPath,
        analysis_name: analysisData.analysisName || "flood_analysis",
        downsample_factor: analysisData.downsampleFactor || 4
      };
      
      const response = await apiClient.post('/analyze', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to analyze flood: ${error.message}`);
    }
  }

  // GET /results/{analysis_id} - Get analysis results
  static async getAnalysisResults(analysisId) {
    try {
      const response = await apiClient.get(`/results/${analysisId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get analysis results: ${error.message}`);
    }
  }

  // DELETE /results/{analysis_id} - Delete analysis results
  static async deleteAnalysisResults(analysisId) {
    try {
      const response = await apiClient.delete(`/results/${analysisId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete analysis results: ${error.message}`);
    }
  }

  // GET /download/{analysis_id}/{filename} - Download analysis file
  static getDownloadUrl(analysisId, filename) {
    return `${API_BASE_URL}/download/${analysisId}/${filename}`;
  }

  // GET /health - Health check
  static async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  // GET / - API root information
  static async getAPIInfo() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get API info: ${error.message}`);
    }
  }
}

// Default query configurations for different disaster types
export const defaultQueries = {
  earthquake: {
    query: "earthquake OR seismic activity OR tremor OR magnitude",
    minLocationRelevance: 0.7,
    minDisasterRelevance: 0.6,
    pageSize: 10
  },
  flood: {
    query: "flood OR flooding OR inundation OR water level OR overflow",
    minLocationRelevance: 0.6,
    minDisasterRelevance: 0.5,
    pageSize: 10
  },
  wildfire: {
    query: "wildfire OR forest fire OR bushfire OR fire emergency",
    minLocationRelevance: 0.7,
    minDisasterRelevance: 0.6,
    pageSize: 10
  },
  hurricane: {
    query: "hurricane OR cyclone OR typhoon OR storm OR wind damage",
    minLocationRelevance: 0.6,
    minDisasterRelevance: 0.6,
    pageSize: 10
  },
  landslide: {
    query: "landslide OR mudslide OR rockslide OR slope failure",
    minLocationRelevance: 0.7,
    minDisasterRelevance: 0.6,
    pageSize: 10
  },
  general: {
    query: "disaster OR emergency OR natural disaster OR catastrophe",
    minLocationRelevance: 0.5,
    minDisasterRelevance: 0.4,
    pageSize: 15
  }
};

// Helper functions for API data transformation
export const transformApiData = {
  // Transform statistics response to dashboard format
  statistics: (apiResponse) => {
    return {
      totalAnalyses: apiResponse.total_analyses || 0,
      socialMediaScores: {
        average: apiResponse.avg_social_score || 0,
        highest: apiResponse.max_social_score || 0,
        lowest: apiResponse.min_social_score || 0
      },
      disasterTypeDistribution: apiResponse.disaster_distribution || [],
      analysisTypeDistribution: apiResponse.analysis_types || [],
      topLocations: apiResponse.top_locations || [],
      performanceMetrics: {
        successfulAnalyses: apiResponse.successful_analyses || 0,
        averageConfidence: apiResponse.avg_confidence || 0,
        responseTime: apiResponse.avg_response_time || 0,
        accuracy: apiResponse.accuracy_rate || 0
      }
    };
  },

  // Transform recent analyses response
  recentAnalyses: (apiResponse) => {
    if (Array.isArray(apiResponse)) {
      return apiResponse.map(analysis => ({
        id: analysis.id || analysis.analysis_id,
        disasterType: analysis.disaster_type || analysis.type,
        location: analysis.location,
        severity: analysis.severity,
        confidence: analysis.confidence,
        articlesAnalyzed: analysis.articles_count || 0,
        timestamp: analysis.timestamp || analysis.created_at,
        socialScore: analysis.social_score || 0,
        summary: analysis.summary || analysis.description
      }));
    }
    return [];
  },

  // Transform intelligence pipeline response
  intelligencePipeline: (apiResponse) => {
    // Handle quota exceeded responses
    if (apiResponse.status === 'quota_exceeded' || apiResponse.status === 'analysis_error') {
      return {
        status: apiResponse.status,
        message: apiResponse.message,
        socialMediaScore: 0,
        extractedInfo: {
          eventType: 'Analysis Limited',
          location: 'N/A',
          severity: 'Unknown',
          confidence: 0
        },
        rawArticles: apiResponse.raw_articles || [],
        limitedData: true,
        timestamp: apiResponse.timestamp || new Date().toISOString()
      };
    }

    return {
      socialMediaScore: apiResponse.social_media_score || 0,
      extractedInfo: {
        eventType: apiResponse.event_type || 'Unknown',
        location: apiResponse.location || 'Unknown',
        severity: apiResponse.severity || 'Medium',
        confidence: apiResponse.confidence || 0
      },
      rawArticles: apiResponse.raw_articles || [],
      processedAt: apiResponse.processed_at || new Date().toISOString(),
      filteringApplied: apiResponse.filtering_applied || {},
      timestamp: apiResponse.timestamp || new Date().toISOString()
    };
  },

  // Transform news analysis response  
  newsAnalysis: (apiResponse) => {
    if (apiResponse.status === 'success' && apiResponse.source_articles) {
      return {
        status: 'success',
        articles: apiResponse.source_articles.map(article => ({
          title: article.title,
          description: article.description,
          publishedAt: article.published_at || article.published,
          relevanceScore: article.relevance_score,
          locationRelevance: article.location_relevance,
          disasterRelevance: article.disaster_relevance,
          url: article.url
        })),
        articlesAnalyzed: apiResponse.articles_analyzed || 0,
        event: apiResponse.event || 'none',
        location: apiResponse.location || 'Multiple',
        severity: apiResponse.severity || 'low',
        confidence: apiResponse.confidence || 0,
        summary: apiResponse.summary,
        timestamp: apiResponse.timestamp || new Date().toISOString()
      };
    }
    return {
      status: 'no_data',
      articles: [],
      message: 'No relevant articles found'
    };
  },

  // Transform SOS alert response
  sosAlert: (apiResponse) => {
    return {
      minDisasterRelevance: apiResponse.min_disaster_relevance || 0,
      timestamp: apiResponse.timestamp || new Date().toISOString(),
      sosMetadata: apiResponse.sos_metadata || {},
      alertCoordinates: apiResponse.sos_metadata?.alert_coordinates || [],
      alertType: apiResponse.sos_metadata?.alert_type || 'general',
      locationVariationsTried: apiResponse.sos_metadata?.location_variations_tried || [],
      coordinates: apiResponse.sos_metadata?.coordinates || '',
      coordinateSearchQuery: apiResponse.coordinate_search_query || '',
      processedAt: apiResponse.processed_at || new Date().toISOString(),
      filteringThresholds: apiResponse.filtering_thresholds || {},
      requestInfo: apiResponse.request_info || {}
    };
  }
};

// Export the API class and client
export default DisasterAnalysisAPI;
