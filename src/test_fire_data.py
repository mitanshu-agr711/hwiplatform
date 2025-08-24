import requests
import json
import pandas as pd

# NASA FIRMS API configuration
MAP_KEY = "2ecd542c57f785d3df0e138ffc6e98e4"
SATELLITE = "VIIRS_NOAA20_NRT"
DAYS = 3  # Use 3 days to get more data

# BBox for a larger region in India (covering more fire-prone areas)
lon_min, lat_min, lon_max, lat_max = 70, 15, 85, 30

def test_fire_data():
    """Test function to fetch and examine fire data structure"""
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/{SATELLITE}/{lon_min},{lat_min},{lon_max},{lat_max}/{DAYS}"
    
    print(f"Fetching data from: {url}")
    
    try:
        # Fetch the data
        df = pd.read_csv(url)
        
        print(f"\nData shape: {df.shape}")
        print(f"\nColumns: {list(df.columns)}")
        print(f"\nFirst few rows:")
        print(df.head())
        
        if len(df) > 0:
            print(f"\nSample data structure:")
            sample_fires = []
            
            for i, row in df.head(5).iterrows():  # Take first 5 rows as sample
                fire_data = {
                    "id": i,
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "confidence": str(row["confidence"]),
                    "brightness": float(row["bright_ti4"]) if "bright_ti4" in row else 300.0,
                    "acquisition_date": str(row.get("acq_date", "")),
                    "acquisition_time": str(row.get("acq_time", "")).zfill(4),
                    "satellite": str(row.get("satellite", "")),
                    "instrument": str(row.get("instrument", "")),
                    "version": str(row.get("version", ""))
                }
                sample_fires.append(fire_data)
            
            print(f"\nFormatted sample data:")
            print(json.dumps(sample_fires, indent=2))
            
            # Create mock data for testing
            mock_data = {
                "fires": sample_fires,
                "statistics": {
                    "total": len(df),
                    "high_confidence": len(df[df["confidence"] == "h"]),
                    "medium_confidence": len(df[df["confidence"] == "n"]),
                    "low_confidence": len(df[df["confidence"] == "l"]),
                    "average_brightness": float(df["bright_ti4"].mean()) if "bright_ti4" in df else 300.0
                }
            }
            
            # Save mock data to file
            with open("fire_mock_data.json", "w") as f:
                json.dump(mock_data, f, indent=2)
            
            print(f"\nMock data saved to fire_mock_data.json")
            return mock_data
        else:
            print("No fire data found for the specified region and time period")
            return None
            
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

if __name__ == "__main__":
    test_fire_data()