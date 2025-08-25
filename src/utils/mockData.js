export const disasterMock = [
  { id: 1, type: 'Earthquake', lat: 37.7749, lng: -122.4194, date: '2025-08-20', severity: 'High', description: 'M6.2 earthquake near San Francisco' },
  { id: 2, type: 'Flood', lat: 29.7604, lng: -95.3698, date: '2025-08-15', severity: 'Medium', description: 'River overflow in Houston suburbs' },
  { id: 3, type: 'Wildfire', lat: 34.0522, lng: -118.2437, date: '2025-07-30', severity: 'High', description: 'Rapidly spreading wildfire in LA county' },
  { id: 4, type: 'Hurricane', lat: 25.7617, lng: -80.1918, date: '2025-09-02', severity: 'High', description: 'Category 3 hurricane approaching Florida' },
  { id: 5, type: 'Earthquake', lat: 35.6895, lng: 139.6917, date: '2024-11-05', severity: 'Low', description: 'Minor tremors in Tokyo region' },
  { id: 6, type: 'Flood', lat: 51.5074, lng: -0.1278, date: '2024-12-12', severity: 'Low', description: 'Localized flooding in London boroughs' },
  { id: 7, type: 'Wildfire', lat: -33.8688, lng: 151.2093, date: '2025-01-10', severity: 'Medium', description: 'Bushfire contained near Sydney' },
  { id: 8, type: 'Earthquake', lat: -6.2088, lng: 106.8456, date: '2025-02-14', severity: 'Medium', description: 'Shallow quake near Jakarta' }
]

// Mock API Data for Social Media & Disaster Analysis Dashboard

// GET /statistics
export const statisticsData = {
  totalAnalyses: 1247,
  socialMediaScores: {
    average: 7.2,
    highest: 9.8,
    lowest: 3.1
  },
  disasterTypeDistribution: [
    { name: 'Earthquake', value: 425, color: '#ef4444' },
    { name: 'Flood', value: 312, color: '#3b82f6' },
    { name: 'Wildfire', value: 298, color: '#f97316' },
    { name: 'Hurricane', value: 127, color: '#8b5cf6' },
    { name: 'Landslide', value: 85, color: '#10b981' }
  ],
  analysisTypeDistribution: [
    { type: 'Social Media', count: 567 },
    { type: 'News Analysis', count: 423 },
    { type: 'Satellite', count: 257 }
  ],
  topLocations: [
    { name: 'California, US', count: 156, lat: 36.7783, lng: -119.4179 },
    { name: 'Florida, US', count: 134, lat: 27.7663, lng: -82.6404 },
    { name: 'Texas, US', count: 98, lat: 31.9686, lng: -99.9018 },
    { name: 'Japan', count: 87, lat: 36.2048, lng: 138.2529 },
    { name: 'Philippines', count: 76, lat: 12.8797, lng: 121.7740 }
  ],
  performanceMetrics: {
    successfulAnalyses: 1184,
    averageConfidence: 84.3,
    responseTime: 2.8,
    accuracy: 91.7
  }
}

// GET /recent-analyses
export const recentAnalysesData = [
  {
    id: 'RA001',
    disasterType: 'Earthquake',
    location: 'San Francisco, CA',
    severity: 'High',
    confidence: 92.5,
    articlesAnalyzed: 47,
    timestamp: '2025-08-25T10:30:00Z',
    socialScore: 8.7,
    summary: 'M6.2 earthquake detected with high social media activity'
  },
  {
    id: 'RA002',
    disasterType: 'Flood',
    location: 'Houston, TX',
    severity: 'Medium',
    confidence: 87.3,
    articlesAnalyzed: 32,
    timestamp: '2025-08-25T09:15:00Z',
    socialScore: 7.4,
    summary: 'Flash flooding reported in multiple districts'
  },
  {
    id: 'RA003',
    disasterType: 'Wildfire',
    location: 'Los Angeles, CA',
    severity: 'High',
    confidence: 95.1,
    articlesAnalyzed: 63,
    timestamp: '2025-08-25T08:45:00Z',
    socialScore: 9.2,
    summary: 'Large wildfire spreading rapidly near populated areas'
  },
  {
    id: 'RA004',
    disasterType: 'Hurricane',
    location: 'Miami, FL',
    severity: 'High',
    confidence: 89.7,
    articlesAnalyzed: 58,
    timestamp: '2025-08-25T07:20:00Z',
    socialScore: 8.9,
    summary: 'Category 3 hurricane approaching coastline'
  },
  {
    id: 'RA005',
    disasterType: 'Landslide',
    location: 'Seattle, WA',
    severity: 'Medium',
    confidence: 78.4,
    articlesAnalyzed: 19,
    timestamp: '2025-08-25T06:10:00Z',
    socialScore: 6.1,
    summary: 'Landslide risk elevated due to heavy rainfall'
  }
]

// POST /intelligence-pipeline
export const intelligencePipelineData = {
  socialMediaScore: 8.4,
  extractedInfo: {
    eventType: 'Earthquake',
    location: 'Northern California',
    severity: 'High',
    confidence: 91.2,
    summary: 'Major earthquake detected through social media signals and news analysis'
  },
  evidence: {
    headlines: [
      { title: 'Breaking: 6.2 Magnitude Earthquake Strikes Northern California', relevance: 98.5 },
      { title: 'Emergency Services Respond to Bay Area Earthquake', relevance: 94.2 },
      { title: 'Residents Report Strong Shaking Across San Francisco', relevance: 89.7 }
    ],
    articleCount: 47,
    socialMentions: 12847,
    trendingHashtags: ['#earthquake', '#BayArea', '#emergency']
  }
}

// POST /analyze-news
export const analyzeNewsData = [
  {
    id: 'AN001',
    event: 'Earthquake',
    location: 'San Francisco Bay Area',
    severity: 'High',
    confidence: 94.3,
    summary: 'A 6.2 magnitude earthquake struck the San Francisco Bay Area at 10:30 AM local time, causing widespread panic and minor infrastructure damage.',
    timestamp: '2025-08-25T10:30:00Z',
    articles: [
      {
        title: 'Major Earthquake Rocks San Francisco Bay Area',
        description: 'A powerful 6.2 magnitude earthquake struck Northern California this morning, causing buildings to sway and residents to flee outdoors.',
        relevanceScore: 97.8,
        source: 'CNN'
      },
      {
        title: 'Emergency Response Teams Deploy After Bay Area Quake',
        description: 'First responders are assessing damage and checking for injuries following the strongest earthquake to hit the region in over a decade.',
        relevanceScore: 93.5,
        source: 'ABC News'
      },
      {
        title: 'USGS Confirms 6.2 Magnitude Earthquake Near San Francisco',
        description: 'The United States Geological Survey has confirmed a 6.2 magnitude earthquake occurred 15 miles northeast of San Francisco.',
        relevanceScore: 96.2,
        source: 'Reuters'
      }
    ]
  },
  {
    id: 'AN002',
    event: 'Wildfire',
    location: 'Los Angeles County',
    severity: 'High',
    confidence: 89.7,
    summary: 'A fast-moving wildfire has burned over 5,000 acres in Los Angeles County, prompting evacuations and threatening residential areas.',
    timestamp: '2025-08-25T08:45:00Z',
    articles: [
      {
        title: 'Wildfire Forces Evacuations in Los Angeles County',
        description: 'A rapidly spreading wildfire has forced thousands of residents to evacuate their homes in northern Los Angeles County.',
        relevanceScore: 95.1,
        source: 'LA Times'
      },
      {
        title: 'Firefighters Battle Massive Blaze Near LA',
        description: 'Hundreds of firefighters are working to contain a wildfire that has already consumed over 5,000 acres of dry vegetation.',
        relevanceScore: 91.8,
        source: 'NBC Los Angeles'
      }
    ]
  }
]

// POST /sos-alert
export const sosAlertData = [
  {
    id: 'SOS001',
    alertType: 'Emergency Evacuation',
    latitude: 37.7749,
    longitude: -122.4194,
    query: 'earthquake help evacuation',
    priority: 'Critical',
    timestamp: '2025-08-25T10:35:00Z',
    details: 'Multiple SOS signals detected in earthquake zone'
  },
  {
    id: 'SOS002',
    alertType: 'Medical Emergency',
    latitude: 34.0522,
    longitude: -118.2437,
    query: 'wildfire smoke medical help',
    priority: 'High',
    timestamp: '2025-08-25T09:20:00Z',
    details: 'Smoke inhalation cases reported near wildfire area'
  },
  {
    id: 'SOS003',
    alertType: 'Rescue Request',
    latitude: 29.7604,
    longitude: -95.3698,
    query: 'flood water rescue',
    priority: 'High',
    timestamp: '2025-08-25T08:15:00Z',
    details: 'Residents trapped by rising flood waters'
  },
  {
    id: 'SOS004',
    alertType: 'Shelter Request',
    latitude: 25.7617,
    longitude: -80.1918,
    query: 'hurricane shelter emergency',
    priority: 'Medium',
    timestamp: '2025-08-25T07:30:00Z',
    details: 'Families seeking emergency shelter from hurricane'
  }
]

export const socialMock = {
  hashtags: ['#earthquake', '#floodrelief', '#wildfire'],
  data: {
    '#earthquake': Array.from({ length: 12 }).map((_, i) => ({
      ts: `2025-0${(i % 9) + 1}-01`,
      mentions: Math.round(50 + Math.random() * 200),
      sentiment: {
        positive: Math.round(10 + Math.random() * 60),
        neutral: Math.round(10 + Math.random() * 60),
        negative: Math.round(10 + Math.random() * 60)
      }
    })),
    '#floodrelief': Array.from({ length: 12 }).map((_, i) => ({
      ts: `2025-0${(i % 9) + 1}-01`,
      mentions: Math.round(30 + Math.random() * 120),
      sentiment: {
        positive: Math.round(5 + Math.random() * 40),
        neutral: Math.round(5 + Math.random() * 40),
        negative: Math.round(5 + Math.random() * 40)
      }
    })),
    '#wildfire': Array.from({ length: 12 }).map((_, i) => ({
      ts: `2025-0${(i % 9) + 1}-01`,
      mentions: Math.round(20 + Math.random() * 150),
      sentiment: {
        positive: Math.round(5 + Math.random() * 50),
        neutral: Math.round(5 + Math.random() * 50),
        negative: Math.round(5 + Math.random() * 50)
      }
    }))
  }
}

export const historicalMock = {
  monthly: Array.from({ length: 24 }).map((_, i) => ({
    month: `2024-${String((i % 12) + 1).padStart(2, '0')}`,
    count: Math.round(5 + Math.random() * 40)
  })),
  types: [
    { type: 'Earthquake', count: 120 },
    { type: 'Flood', count: 80 },
    { type: 'Wildfire', count: 60 },
    { type: 'Hurricane', count: 30 }
  ],
  severity: { High: 80, Medium: 120, Low: 90 },
  impact: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2, '0')}`,
    affected: Math.round(1000 + Math.random() * 20000),
    economic: Math.round(1e6 + Math.random() * 5e7)
  }))
}

export const geoMock = {
  regions: [
    { id: 'r1', name: 'Western US', coords: [[[-125, 32], [-115, 32], [-115, 42], [-125, 42], [-125, 32]]], severity: 0.8, count: 34 },
    { id: 'r2', name: 'Southeast Asia', coords: [[[95, -11], [141, -11], [141, 23], [95, 23], [95, -11]]], severity: 0.6, count: 28 },
    { id: 'r3', name: 'Mediterranean', coords: [[[ -10,30],[40,30],[40,46],[-10,46],[-10,30]]], severity: 0.3, count: 12 }
  ]
}
