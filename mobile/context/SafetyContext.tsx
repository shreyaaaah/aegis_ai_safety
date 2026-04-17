import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTracking } from '../hooks/useTracking';

interface SafetyContextType {
  riskData: any;
  isConnected: boolean;
  isTracking: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  triggerSOS: (currentScore: number) => Promise<void>;
  isVoiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

const MOCK_USER_ID = "user_777";
const BACKEND_URL = "http://10.35.135.183:8001";

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  const { riskData, isConnected, sendLocation } = useWebSocket(MOCK_USER_ID);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isVoiceEnabled, setVoiceEnabled] = useState(false);

  // Custom sendLocation that also updates local state for the Map
  const handleUpdateLocation = (lat: number, lon: number) => {
    setUserLocation({ latitude: lat, longitude: lon });
    sendLocation(lat, lon);
  };

  const { isTracking } = useTracking(handleUpdateLocation, isConnected);

  const triggerSOS = async (currentScore: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/trigger-sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: MOCK_USER_ID,
          risk_score: currentScore,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
        }),
      });
      const result = await response.json();
      console.log("SOS TRIGGERED:", result);
    } catch (e) {
      console.error("SOS Trigger Failed", e);
    }
  };

  return (
    <SafetyContext.Provider value={{ 
      riskData, 
      isConnected, 
      isTracking, 
      userLocation, 
      triggerSOS,
      isVoiceEnabled,
      setVoiceEnabled
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
