import os
import json
from llm_engine import get_groq_client

# Note: In a production server, we would load Whisper once globally:
# import whisper
# whisper_model = whisper.load_model("base")

def transcribe_audio(file_path: str) -> str:
    """
    Mock audio transcription. 
    In production: return whisper_model.transcribe(file_path)["text"]
    """
    return "I am walking home now, but someone is following me."

def analyze_emotion(text: str) -> dict:
    """
    Takes text (either raw message or whispered audio) and uses Groq to perform 
    a psychological safety analysis and sentiment classification.
    Returns distress score between 0.0 and 1.0.
    """
    client = get_groq_client()
    if not client:
        return {
            "distress_score": 0.0,
            "classification": "neutral",
            "is_mock": True
        }

    prompt = f"""
    Analyze this text from a user walking alone at night.
    Determine their level of panic, stress, or distress.

    Text: "{text}"

    Return strictly a JSON object:
    {{
      "distress_score": <float between 0.0 (calm) and 1.0 (panic)>,
      "classification": <"calm", "anxious", "distressed", "panic">,
      "reasoning": "<Short 1 sentence explanation>"
    }}
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are an emotion classification safety engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=200,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Emotion Engine Error: {e}")
        return {
            "distress_score": 0.5,
            "classification": "unknown",
            "is_mock": True
        }
