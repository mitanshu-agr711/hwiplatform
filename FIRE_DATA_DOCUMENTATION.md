# NASA FIRMS Fire Detection Data Integration

## Overview
This project integrates real-time fire detection data from NASA's Fire Information for Resource Management System (FIRMS) to display active fires on an interactive map.

## Data Source
- **API**: NASA FIRMS API
- **Satellite**: VIIRS NOAA-20 (Visible Infrared Imaging Radiometer Suite)
- **Coverage**: Global, near real-time
- **Update Frequency**: Multiple times daily

## Fire Data Structure

### Individual Fire Object
```json
{
  "id": 0,
  "latitude": 21.10012,
  "longitude": 72.63592,
  "confidence": "n",
  "brightness": 338.02,
  "acquisition_date": "2025-08-22",
  "acquisition_time": "0837",
  "satellite": "N20",
  "instrument": "VIIRS",
  "version": "2.0NRT"
}
```

### Complete Data Structure
```json
{
  "fires": [/* Array of fire objects */],
  "statistics": {
    "total": 27,
    "high_confidence": 0,
    "medium_confidence": 25,
    "low_confidence": 2,
    "average_brightness": 321.94
  }
}
```

## Data Fields Explained

| Field | Description | Values |
|-------|-------------|---------|
| `latitude` | Fire location latitude | Decimal degrees |
| `longitude` | Fire location longitude | Decimal degrees |
| `confidence` | Detection confidence level | `"h"` (High), `"n"` (Nominal/Medium), `"l"` (Low) |
| `brightness` | Fire brightness temperature | Kelvin (K) |
| `acquisition_date` | Date fire was detected | YYYY-MM-DD |
| `acquisition_time` | Time fire was detected | HHMM (UTC) |
| `satellite` | Satellite name | e.g., "N20" (NOAA-20) |
| `instrument` | Detection instrument | "VIIRS" |
| `version` | Data version | e.g., "2.0NRT" (Near Real Time) |

## Fire Confidence Levels

### High Confidence (`"h"`)
- **Color**: Red (#dc2626)
- **Meaning**: Very likely to be fire
- **Typical Use**: Emergency response, immediate attention

### Medium/Nominal Confidence (`"n"`)
- **Color**: Orange (#f97316)  
- **Meaning**: Likely to be fire
- **Typical Use**: Monitoring, investigation

### Low Confidence (`"l"`)
- **Color**: Yellow (#fbbf24)
- **Meaning**: Possible fire, uncertain
- **Typical Use**: Initial screening, further verification needed

## Map Features

### Interactive Elements
- **Fire Markers**: Circle markers color-coded by confidence level
- **Popups**: Detailed fire information on click
- **Tooltips**: Quick info on hover
- **Filters**: Toggle confidence levels on/off
- **Statistics Panel**: Real-time fire count and metrics

### Map Controls
- **Zoom**: Mouse wheel or map controls
- **Pan**: Click and drag
- **Reset**: Double-click to reset view
- **Full Screen**: Standard Leaflet controls

## Implementation

### React Component Structure
```
src/
├── components/
│   └── FireMap.jsx          # Main fire map component
├── pages/
│   └── Geospatial.jsx       # Page with tabs (includes fire map)
├── fire_mock_data.json      # Sample fire data
└── test_fire_data.py        # Data fetching script
```

### Key Dependencies
- **react-leaflet**: Map rendering
- **leaflet**: Core mapping library
- **tailwindcss**: Styling

## Usage Examples

### Basic Fire Map Display
```jsx
import FireMap from '../components/FireMap';

function MyPage() {
  return <FireMap />;
}
```

### With Custom Data
```jsx
// Fetch fresh data from NASA FIRMS
const fetchFireData = async () => {
  const response = await fetch('NASA_FIRMS_API_URL');
  const data = await response.json();
  return processFireData(data);
};
```

## API Configuration

### NASA FIRMS API Parameters
- **API Key**: Required (get from NASA)
- **Satellite**: VIIRS_NOAA20_NRT, MODIS_C6_1, etc.
- **Area**: Bounding box (lon_min, lat_min, lon_max, lat_max)
- **Days**: Number of days to look back (1-10)

### Example API Call
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/YOUR_API_KEY/VIIRS_NOAA20_NRT/70,15,85,30/3
```

## Data Processing

### From NASA FIRMS CSV to JSON
1. Fetch CSV data from NASA FIRMS API
2. Parse using pandas
3. Transform to standardized JSON format
4. Add metadata and statistics
5. Save for React consumption

### Sample Processing Script
```python
import pandas as pd
import json

def process_fire_data(csv_url):
    df = pd.read_csv(csv_url)
    
    fires = []
    for i, row in df.iterrows():
        fire = {
            "id": i,
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"]),
            "confidence": str(row["confidence"]),
            "brightness": float(row["bright_ti4"]),
            "acquisition_date": str(row["acq_date"]),
            "acquisition_time": str(row["acq_time"]).zfill(4),
            "satellite": str(row["satellite"]),
            "instrument": str(row["instrument"]),
            "version": str(row["version"])
        }
        fires.append(fire)
    
    return {
        "fires": fires,
        "statistics": calculate_stats(df)
    }
```

## Performance Considerations

### Large Datasets
- **Pagination**: Display fires in chunks
- **Clustering**: Group nearby fires at low zoom levels
- **Filtering**: Client-side confidence filtering
- **Lazy Loading**: Load only visible map area

### Optimization Tips
- Use `react-leaflet` clustering for 100+ fires
- Implement virtual scrolling for fire lists
- Cache API responses for better performance
- Use map bounds to limit data fetching

## Real-time Updates

### Auto-refresh Implementation
```jsx
useEffect(() => {
  const interval = setInterval(fetchFireData, 300000); // 5 minutes
  return () => clearInterval(interval);
}, []);
```

### WebSocket Integration (Future)
- Real-time fire updates
- Push notifications for new high-confidence fires
- Live statistics updates

## Styling and Theming

### Fire Marker Styles
```css
.fire-marker {
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.fire-popup {
  min-width: 200px;
  font-size: 13px;
}
```

### Responsive Design
- Mobile-friendly map controls
- Collapsible statistics panel
- Touch-optimized markers and popups

## Error Handling

### Common Issues
1. **API Rate Limits**: Implement caching and request throttling
2. **No Data**: Show appropriate empty state
3. **Network Errors**: Retry logic with exponential backoff
4. **Invalid Coordinates**: Data validation and filtering

### Error States
```jsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!fires.length) return <NoFiresMessage />;
```

## Future Enhancements

### Planned Features
- [ ] Historical fire data analysis
- [ ] Fire spread prediction models
- [ ] Integration with weather data
- [ ] Mobile app version
- [ ] Email/SMS alerts for specific regions
- [ ] Export capabilities (PDF, CSV)
- [ ] Multi-satellite data fusion

### Advanced Analytics
- Fire trend analysis
- Seasonal pattern detection
- Risk assessment algorithms
- Integration with emergency services

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Get NASA FIRMS API key
4. Configure environment variables
5. Run development server: `npm run dev`

### Data Updates
- Update `test_fire_data.py` with new regions/parameters
- Regenerate `fire_mock_data.json`
- Test with new data on map

---

**Note**: This implementation uses sample data from NASA FIRMS API. For production use, implement proper API key management, error handling, and data caching strategies.