import numpy as np
from sklearn.ensemble import IsolationForest
import math

class BehavioralDigitalTwin:
    def __init__(self, user_id):
        self.user_id = user_id
        # We use an Isolation Forest to detect anomalies in location/speed/time mappings
        # In a real app we would load a pre-trained model per user from the DB
        self.model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
        self.is_trained = False
        self.history = []

    def _calculate_speed(self, loc1, loc2):
        # Extremely basic distance calculation (Haversine approximation)
        R = 6371  # Earth radius in km
        lat1, lon1 = np.radians(loc1['lat']), np.radians(loc1['lon'])
        lat2, lon2 = np.radians(loc2['lat']), np.radians(loc2['lon'])

        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
        c = 2 * np.math.atan2(np.math.sqrt(a), np.math.sqrt(1 - a))
        distance_km = R * c

        # Time diff in seconds
        time_diff = (loc2['timestamp'] - loc1['timestamp']).total_seconds()
        if time_diff <= 0:
            return 0
        speed_kmh = (distance_km / (time_diff / 3600))
        return speed_kmh

    def ingest_data(self, history_records):
        """
        Train the digital twin on historical data for this user.
        history_records should be a sorted list of dicts: [{'lat': x, 'lon': y, 'timestamp': dt}]
        """
        if len(history_records) < 10:
            return # Need more data to form a baseline
            
        features = []
        for i in range(1, len(history_records)):
            prev = history_records[i-1]
            curr = history_records[i]
            
            speed = self._calculate_speed(prev, curr)
            hour_of_day = curr['timestamp'].hour
            
            # Feature vector: [latitude, longitude, speed_kmh, hour_of_day]
            features.append([curr['lat'], curr['lon'], speed, hour_of_day])
            
        self.history = features
        self.model.fit(features)
        self.is_trained = True

    def detect_anomaly(self, current_lat, current_lon, speed, hour):
        """
        Returns an anomaly score (-1 for anomaly, 1 for normal)
        """
        if not self.is_trained:
            # Fallback heuristic if no digital twin baseline is formed yet
            if hour >= 23 or hour <= 4:
                return -1
            return 1
            
        feature_vector = np.array([[current_lat, current_lon, speed, hour]])
        prediction = self.model.predict(feature_vector)[0]
        return prediction

# Singleton manager mapping user_id -> DigitalTwin
twins: dict[str, BehavioralDigitalTwin] = {}

def get_digital_twin(user_id: str) -> BehavioralDigitalTwin:
    if user_id not in twins:
        twins[user_id] = BehavioralDigitalTwin(user_id)
    return twins[user_id]
