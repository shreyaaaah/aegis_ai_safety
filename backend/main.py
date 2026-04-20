from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import json
import os
from models import LocationData, EmergencyContact, IncidentLog, EmotionData
from schemas import LocationCreate
from risk_aggregator import process_realtime_context
from emotion_engine import transcribe_audio, analyze_emotion
import os
import shutil
from pathlib import Path
from dotenv import load_dotenv
import datetime

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aegis AI Real-Time Backend")

# Enable Global CORS for Mobile Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure temp directory for audio
AUDIO_TEMP_DIR = Path("temp_audio")
AUDIO_TEMP_DIR.mkdir(exist_ok=True)

@app.post("/analyze-audio")
async def analyze_audio_endpoint(user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Receives an audio file, transcribes it, saves to DB, and analyzes stress levels.
    """
    file_path = AUDIO_TEMP_DIR / file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Transcribe
        text = transcribe_audio(str(file_path))
        
        # 2. Analyze Emotion
        analysis = analyze_emotion(text)
        distress_score = analysis.get("distress_score", 0.0)
        classification = analysis.get("classification", "neutral")

        # 3. Save Signal
        emotion_entry = EmotionData(
            user_id=user_id,
            distress_score=distress_score,
            classification=classification,
            timestamp=datetime.datetime.now().isoformat()
        )
        db.add(emotion_entry)
        db.commit()
        
        return {
            "text": text,
            "distress_score": distress_score,
            "classification": classification,
            "reasoning": analysis.get("reasoning", "")
        }
    finally:
        # Cleanup
        if file_path.exists():
            os.remove(file_path)

# --- Phase 4: Tactical Response Endpoints ---

@app.get("/contacts")
def get_contacts(user_id: str, db: Session = Depends(get_db)):
    return db.query(EmergencyContact).filter(EmergencyContact.user_id == user_id).all()

@app.get("/incidents")
def get_incidents(user_id: str, db: Session = Depends(get_db)):
    return db.query(IncidentLog).filter(IncidentLog.user_id == user_id).all()

@app.post("/contacts")
def add_contact(contact: dict, db: Session = Depends(get_db)):
    db_contact = EmergencyContact(
        user_id=contact.get("user_id"),
        name=contact.get("name"),
        phone=contact.get("phone"),
        relationship=contact.get("relationship"),
        is_primary=contact.get("is_primary", 0)
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).delete()
    db.commit()
    return {"message": "Contact removed"}

@app.post("/trigger-sos")
async def trigger_sos(payload: dict, db: Session = Depends(get_db)):
    """
    Autonomous Tactical Response.
    Escalates based on risk_score provided.
    """
    user_id = payload.get("user_id")
    score = payload.get("risk_score", 0)
    lat = payload.get("latitude")
    lon = payload.get("longitude")
    
    # 1. Identity Primary Contact
    primary = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == user_id, 
        EmergencyContact.is_primary == 1
    ).first()
    
    response_log = []
    response_type = "None"

    # 2. Level 1: Primary Contact Notification
    if primary:
        msg = f"ALERT: EMERGENCY SOS from {user_id}. Location: {lat}, {lon}. Risk Score: {score}."
        print(f"--- [SENDING MOCK SMS TO {primary.name} at {primary.phone}] ---")
        print(f"Message: {msg}")
        response_log.append(f"Primary contact {primary.name} notified.")
        response_type = "Contact"

    # 3. Level 2: Tactical Police Escalation (Critical Threshold 85+)
    if score >= 85:
        # Generate mock nearby police dispatch
        police_id = "Precinct_09"
        dispatch_msg = f"PRIORITY DISPATCH: Potential threat at {lat}, {lon}. Subject ID: {user_id}. Threat Level: CRITICAL ({score}/100)."
        print(f"!!! --- [POLICE DISPATCH INITIATED: {police_id}] --- !!!")
        print(f"Dispatch Signal: {dispatch_msg}")
        response_log.append(f"Local Authorities (Police) alerted.")
        response_type = "Police"

    # 4. Log Incident
    incident = IncidentLog(
        user_id=user_id,
        timestamp=datetime.datetime.now().isoformat(),
        risk_score=score,
        description=f"Manual/Autonomous SOS triggered. Response: {', '.join(response_log)}",
        response_type=response_type
    )
    db.add(incident)
    db.commit()

    return {
        "status": "SOS_NOTIFIED",
        "contacts_alerted": primary.name if primary else "No primary contact configured",
        "police_alerted": score >= 85,
        "log": response_log
    }

# Removed redundant get_db


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("New client connected.")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print("Client disconnected.")

manager = ConnectionManager()

@app.get("/")
def root():
    return {"message": "Aegis AI Real-Time Backend is running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Extract data
            user_id = payload.get("user_id", "unknown")
            latitude = payload.get("latitude")
            longitude = payload.get("longitude")
            timestamp = payload.get("timestamp")
            
            # Store in DB purely for tracking the Digital Twin context
            location_entry = LocationData(
                user_id=user_id,
                latitude=latitude,
                longitude=longitude,
                timestamp=timestamp
            )
            db.add(location_entry)
            db.commit()
            
            # Trigger Continuous Intelligence Layer
            risk_response = process_realtime_context(
                latitude=latitude, 
                longitude=longitude, 
                timestamp=timestamp,
                user_id=user_id,
                db=db
            )
            
            # Stream the intelligence back to the app in real-time
            await websocket.send_text(json.dumps(risk_response))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error handling WebSocket: {e}")
        if websocket in manager.active_connections:
            manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)