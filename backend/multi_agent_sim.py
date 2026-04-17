import json
from llm_engine import get_groq_client

def simulate_multi_agent_outcome(user_context: dict) -> dict:
    """
    Advanced Multi-Agent Simulation.
    Creates an adversarial interaction between two AI Agents to predict threats.
    
    Agent 1 (User Agent): Represents the user's intent and vulnerabilities.
    Agent 2 (Environment Agent): Represents potential external risks in the area.
    """
    client = get_groq_client()
    if not client:
        return {
            "predicted_outcome": "Simulation disabled - no API key.",
            "risk_probability": 0,
            "is_mock": True
        }

    # In a full-scale app, Agent 1 and Agent 2 would pass messages back and forth.
    # To save latency for real-time (and tokens), we compress this adversarial 
    # setup into a single sophisticated prompt instructing the LLM to roleplay both.
    
    prompt = f"""
    You are the Aegis AI Multi-Agent orchestrator.
    Run a simulation between two agents to determine the probability of a safety threat.
    
    Situation Briefing:
    - User Location: Lat {user_context.get('lat')}, Lon {user_context.get('lon')}
    - Hour: {user_context.get('hour')}
    - Anomaly Detected: {user_context.get('is_anomaly')}
    - Emotional State: {user_context.get('emotion_score', 'Neutral')}
    
    [AGENT 1: User Agent]
    Goal: Describe how the user is currently navigating their environment based on the briefing.
    
    [AGENT 2: Environment/Threat Agent]
    Goal: Given Agent 1's behavior, identify the highest probability vulnerability or external threat.
    
    Conduct the simulation step-by-step internally, and output the final conclusion strictly as a JSON object:
    {{
      "agent_1_assessment": "<One sentence on user state>",
      "agent_2_assessment": "<One sentence on threat probability>",
      "final_predicted_outcome": "<One sentence summarizing what will likely happen>",
      "risk_probability_percentage": <int 0-100>,
      "ghost_path": [
        {{"lat": <lat1>, "lon": <lon1>}},
        {{"lat": <lat2>, "lon": <lon2>}},
        {{"lat": <lat3>, "lon": <lon3>}},
        {{"lat": <lat4>, "lon": <lon4>}},
        {{"lat": <lat5>, "lon": <lon5>}}
      ]
    }}
    Note: ghost_path points should be within 0.005 degrees of the user's location, showing a logical threat trajectory.
    """

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a dual-agent JSON simulation engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3, # Slightly higher temperature for simulation branch exploration
            max_tokens=300,
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Multi-Agent Sim Error: {e}")
        return {
            "predicted_outcome": "Simulation calculation failed.",
            "risk_probability_percentage": 50,
            "is_mock": True
        }
