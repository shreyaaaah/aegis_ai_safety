from pydantic import BaseModel


class LocationCreate(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    timestamp: str


class RiskRequest(BaseModel):
    latitude: float
    longitude: float
    timestamp: str


class RiskResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: list[str]