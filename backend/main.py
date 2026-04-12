import json
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import LocationData
from schemas import LocationCreate
from risk_aggregator import process_realtime_context
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aegis AI Real-Time Backend")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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