from datetime import datetime


def calculate_risk(latitude: float, longitude: float, timestamp: str):
    score = 0
    reasons = []

    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", ""))
        hour = dt.hour
    except Exception:
        hour = None

    if hour is not None and (hour >= 22 or hour <= 5):
        score += 30
        reasons.append("Late-night movement detected")

    risky_zones = [
        {"lat": 12.9716, "lon": 77.5946, "radius": 0.01}
    ]

    for zone in risky_zones:
        if (
            abs(latitude - zone["lat"]) < zone["radius"]
            and abs(longitude - zone["lon"]) < zone["radius"]
        ):
            score += 35
            reasons.append("User is in a risky zone")
            break

    if score >= 60:
        level = "High"
    elif score >= 30:
        level = "Medium"
    else:
        level = "Low"

    if not reasons:
        reasons.append("No major risk detected")

    return {
        "risk_score": score,
        "risk_level": level,
        "reasons": reasons
    }