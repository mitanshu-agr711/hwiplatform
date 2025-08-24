import os
import json
from typing import Tuple
import pandas as pd
import folium
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, HTMLResponse

# ------------------ CONFIG ------------------
MAP_KEY = "2ecd542c57f785d3df0e138ffc6e98e4"  # Replace with your NASA FIRMS API key
COUNTRY = "India"
DAYS = 3
SATELLITE = "VIIRS_NOAA20_NRT"

# BBox (India roughly) -> change if needed
lon_min, lat_min, lon_max, lat_max = 68, 6, 97, 37
OUTFILE = "fire_map.html"

# ------------------ HELPERS ------------------
def confidence_color(conf: float) -> str:
    if conf == "h": return "#ff0000"
    elif conf == "n": return "#ffa500"
    return "#ffff00"

def confidence_bucket(conf: float) -> str:
    if conf == "h": return "High"
    elif conf == "n": return "Medium"
    return "Low"

def compute_stats(df: pd.DataFrame) -> dict:
    total = len(df)
    high = len(df[df["confidence"] == "h"])
    medium = len(df[(df["confidence"] == "n")])
    low = len(df[df["confidence"] == "l"])
    avg_brightness = df["bright_ti4"].mean() if "bright_ti4" in df else 0
    updated = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "total": total, "high": high, "medium": medium, "low": low,
        "avg_brightness": round(avg_brightness, 1), "updated": updated
    }

def fetch_firms_bbox(map_key: str, satellite: str, bbox: Tuple[float, float, float, float], days: int) -> pd.DataFrame:
    lon_min, lat_min, lon_max, lat_max = bbox
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{map_key}/{satellite}/{lon_min},{lat_min},{lon_max},{lat_max}/{days}"
    df = pd.read_csv(url)
    return df

def make_map(df: pd.DataFrame, country: str, days: int, satellite: str) -> folium.Map:
    if len(df) > 0:
        center = [df.iloc[0]["latitude"], df.iloc[0]["longitude"]]
    else:
        center = [0, 0]

    m = folium.Map(location=center, zoom_start=5)
    disaster_data = []

    for _, row in df.iterrows():
        lat = float(row["latitude"])
        lon = float(row["longitude"])
        conf = row["confidence"]
        bright = float(row["bright_ti4"]) if "bright_ti4" in row else 300.0

        fire_entry = {
            "location": {"lat": lat, "lon": lon},
            "confidence": {
                "value": conf,
                "bucket": confidence_bucket(conf)
            },
            "brightness": bright,
            "date": str(row.get("acq_date", "")),
            "time": str(row.get("acq_time", "")).zfill(4),
            "color": confidence_color(conf)
        }
        disaster_data.append(fire_entry)

        # popup_html = f"""
        # <div style='font-size:13px;max-width:260px;'>
        # <h4 style='margin:0 0 6px 0;color:#ff5555;'> Fire Detection</h4>
        # <div><b> Location:</b> {lat:.3f}, {lon:.3f}</div>
        # <div><b> Confidence:</b> {conf}% ({confidence_bucket(conf)})</div>
        # <div><b> Brightness:</b> {bright:.0f}K</div>
        # <div><b> Date:</b> {row.get('acq_date', '')} {str(row.get('acq_time', '')).zfill(4)}</div>
        # </div>
        # """

        # folium.CircleMarker(
        #     location=(lat, lon),
        #     radius=8,
        #     color="#ffffff",
        #     weight=2,
        #     fill=True,
        #     fill_color=confidence_color(conf),
        #     fill_opacity=0.9,
        #     popup=folium.Popup(popup_html, max_width=300),
        # ).add_to(m)

    stats = compute_stats(df)
    # stats_html = f"""
    # <div style='background:white;padding:12px 14px;border-radius:12px;
    #     box-shadow:0 4px 10px rgba(0,0,0,.15);font-size:13px;position:fixed;top:80px;right:12px;z-index:1000;'>
    # <div style='font-weight:700;margin-bottom:6px;'> Fire Statistics</div>
    # <div>Total Fires: <b>{stats['total']}</b></div>
    # <div>High Confidence: <b>{stats['high']}</b></div>
    # <div>Medium Confidence: <b>{stats['medium']}</b></div>
    # <div>Low Confidence: <b>{stats['low']}</b></div>
    # <div>Avg Brightness: <b>{stats['avg_brightness']}K</b></div>
    # <div>Last Updated: <b>{stats['updated']}</b></div>
    # </div>
    # """
    # m.get_root().html.add_child(folium.Element(stats_html))
    result = {
        "fires": disaster_data,
        "statistics": {
            "total": stats["total"],
            "high": stats["high"],
            "medium": stats["medium"],
            "low": stats["low"],
            "avg_brightness": stats["avg_brightness"],
            "updated": stats["updated"],
        }
    }
    return result

# ------------------ FASTAPI ------------------
app = FastAPI(title="NASA FIRMS Fire API")

@app.get("/fires/stats")
def get_fire_stats(days: int = Query(DAYS, ge=1, le=10)):
    df = fetch_firms_bbox(MAP_KEY, SATELLITE, (lon_min, lat_min, lon_max, lat_max), days)
    stats = compute_stats(df)
    return JSONResponse(content=stats)

@app.get("/fires/map")
def get_fire_map(days: int = Query(DAYS, ge=1, le=10)):
    df = fetch_firms_bbox(MAP_KEY, SATELLITE, (lon_min, lat_min, lon_max, lat_max), days)
    m = make_map(df, COUNTRY, days, SATELLITE)
    return JSONResponse(content=m)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5476)