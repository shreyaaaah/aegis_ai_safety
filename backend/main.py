from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import LocationData
from schemas import LocationCreate, RiskRequest, RiskResponse
from risk_engine import calculate_risk

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AURA-X Sentinel Backend")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "AURA-X backend is running"}


@app.post("/location")
def receive_location(data: LocationCreate, db: Session = Depends(get_db)):
    location_entry = LocationData(
        user_id=data.user_id,
        latitude=data.latitude,
        longitude=data.longitude,
        timestamp=data.timestamp
    )
    db.add(location_entry)
    db.commit()
    db.refresh(location_entry)

    return {
        "status": "success",
        "message": "Location stored successfully",
        "data": {
            "id": location_entry.id,
            "user_id": location_entry.user_id,
            "latitude": location_entry.latitude,
            "longitude": location_entry.longitude,
            "timestamp": location_entry.timestamp
        }
    }


@app.get("/locations/{user_id}")
def get_user_locations(user_id: str, db: Session = Depends(get_db)):
    records = db.query(LocationData).filter(LocationData.user_id == user_id).all()

    return {
        "status": "success",
        "count": len(records),
        "locations": [
            {
                "id": r.id,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "timestamp": r.timestamp
            }
            for r in records
        ]
    }


@app.post("/risk", response_model=RiskResponse)
def get_risk(data: RiskRequest):
    return calculate_risk(
        latitude=data.latitude,
        longitude=data.longitude,
        timestamp=data.timestamp
    )


@app.post("/sos")
def trigger_sos(data: LocationCreate):
    print("🚨 SOS TRIGGERED 🚨")
    print(f"User: {data.user_id}")
    print(f"Location: {data.latitude}, {data.longitude}")
    print(f"Time: {data.timestamp}")

    return {
        "status": "alert_sent",
        "message": "SOS signal received successfully",
        "data": {
            "user_id": data.user_id,
            "latitude": data.latitude,
            "longitude": data.longitude,
            "timestamp": data.timestamp
        }
    }