from sqlalchemy import Column, Integer, Float, String
from database import Base

class LocationData(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)

class EmergencyContact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    name = Column(String)
    phone = Column(String)
    relationship = Column(String)
    is_primary = Column(Integer, default=0)

class IncidentLog(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    timestamp = Column(String)
    risk_score = Column(Integer)
    description = Column(String)
    response_type = Column(String)

class EmotionData(Base):
    __tablename__ = "emotion_signals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    distress_score = Column(Float)
    classification = Column(String)
    timestamp = Column(String)