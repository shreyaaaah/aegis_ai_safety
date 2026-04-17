import random

def get_nearby_heatmap(lat: float, lon: float) -> list:
    """
    Generates mock high-risk heatmap zones within 1-2km of the user.
    In a production app, this would fetch from a database of crime stats.
    """
    zones = []
    
    # Generate 3-5 high-threat zones nearby
    for i in range(random.randint(3, 5)):
        # Small random offset within ~0.01 degrees (~1km)
        lat_off = (random.random() - 0.5) * 0.02
        lon_off = (random.random() - 0.5) * 0.02
        
        zones.append({
            "id": f"zone_{i}",
            "lat": lat + lat_off,
            "lon": lon + lon_off,
            "radius": random.randint(100, 300), # radius in meters
            "intensity": random.random() # 0.0 to 1.0 (opacity/risk)
        })
        
    return zones
