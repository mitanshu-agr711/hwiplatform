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
