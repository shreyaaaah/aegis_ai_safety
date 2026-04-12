import os
import json
from groq import Groq

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_free_groq_api_key_here":
        return None
    return Groq(api_key=api_key)

def simulate_scenario(context: dict) -> dict:
    """
    Called by risk_aggregator when score >= 40.
    Predicts the next 15 minutes, suggests action, and determines urgency.
    """
    client = get_groq_client()
    if not client:
        return {
            "future_simulation": "LLM inactive. Missing GROQ_API_KEY.",
            "actionable_advice": "Stay alert.",
            "urgency": "medium",
            "is_mock": True
        }

    prompt = f"""
    You are AURA-X Sentinel, a proactive safety reasoning layer.
    Analyze the situation and simulate what might happen next.

    Context:
    - User ID: {context.get('user_id')}
    - Anomaly Detected: {context.get('is_anomaly')}
    - Current Speed: {context.get('speed_kmh', 0):.1f} km/h
    - Hour: {context.get('hour')}
    - Risk Score: {context.get('risk_score')} (0-100)
    
    Return strictly a JSON object with this format:
    {{
      "future_simulation": "<A 1 sentence prediction of what happens in the next 15 minutes>",
      "actionable_advice": "<A 1 sentence specific action for the user to take immediately>",
      "urgency": "<'low' | 'medium' | 'high' | 'immediate'>"
    }}
    """

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "system", "content": "You are a specialized JSON-only safety engine."},
                      {"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=256,
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "future_simulation": "Simulation failed due to engine error.",
            "actionable_advice": "Proceed with caution.",
            "urgency": "medium",
            "is_mock": True
        }
