from datetime import datetime
from digital_twin import get_digital_twin
from llm_engine import simulate_scenario
from models import LocationData

def process_realtime_context(latitude: float, longitude: float, timestamp: str, user_id: str, db):
    """
    Dynamic Risk Aggregator
    Fuses anomaly, emotion, and context signals into a single score.
    If score >= 40, fires the LLM Scenario Simulation.
    """
    
    # 1. Parse Context
    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", ""))
        hour = dt.hour
        time_str = dt.strftime("%H:%M:%S")
    except Exception:
        dt = datetime.now()
        hour = dt.hour
        time_str = "Unknown"

    # 2. Digital Twin Anomaly Signal
    twin = get_digital_twin(user_id)
    history = db.query(LocationData).filter(LocationData.user_id == user_id).order_by(LocationData.timestamp.desc()).limit(2).all()
    
    speed_kmh = 0
    if len(history) == 2:
        last_loc = {'lat': history[1].latitude, 'lon': history[1].longitude, 'timestamp': datetime.fromisoformat(history[1].timestamp.replace("Z", ""))}
        curr_loc = {'lat': latitude, 'lon': longitude, 'timestamp': dt}
        speed_kmh = twin._calculate_speed(last_loc, curr_loc)

    anomaly_prediction = twin.detect_anomaly(latitude, longitude, speed_kmh, hour)
    is_anomaly = (anomaly_prediction == -1)
    
    # 3. Emotion Signal (Placeholder until emotion_engine.py is integrated)
    # emotion_score = get_emotion_stress_level(user_id)
    emotion_score = 0.0 

    # 4. Weighted Fusion for Final Risk Score
    score = 0
    reasons = []

    # Weights configuration
    W_ANOMALY = 40
    W_TIME = 20
    W_EMOTION = 30
    
    if is_anomaly:
        score += W_ANOMALY
        reasons.append("Behavioral anomaly detected (unusual route/speed).")
        
    if hour >= 22 or hour <= 5:
        score += W_TIME
        reasons.append("Late-night movement.")
        
    if emotion_score > 0.5:
        score += W_EMOTION
        reasons.append("High voice stress indicators detected.")

    if score == 0:
        reasons.append("Routine movement. No risks detected.")

    # Determine level
    level = "Low"
    if score >= 80: level = "Critical"
    elif score >= 60: level = "High"
    elif score >= 30: level = "Medium"

    # 5. LLM Scenario Trigger (Rate limited in production, here simply driven by threshold)
    simulation_output = {}
    if score >= 40:
        context = {
            "user_id": user_id,
            "is_anomaly": is_anomaly,
            "speed_kmh": speed_kmh,
            "hour": hour,
            "risk_score": score
        }
        simulation_output = simulate_scenario(context)
        
        # If the LLM deems it immediate, elevate risk to critical instantly.
        if simulation_output.get("urgency") == "immediate":
            score = max(score, 85)
            level = "Critical"

    return {
        "risk_score": score,
        "risk_level": level,
        "reasons": reasons,
        "digital_twin_anomaly": is_anomaly,
        "simulation": simulation_output.get("future_simulation", ""),
        "advice": simulation_output.get("actionable_advice", ""),
        "urgency": simulation_output.get("urgency", "low")
    }
