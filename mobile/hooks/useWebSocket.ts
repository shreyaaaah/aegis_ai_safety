import { useEffect, useState, useRef } from 'react';

// For local testing, ensure you use your machine's local IP address instead of localhost, 
// e.g., 'ws://192.168.x.x:8000/ws' based on the backend.
const WS_URL = 'ws://10.35.135.183:8001/ws';

export function useWebSocket(userId: string) {
  const [riskData, setRiskData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Connected to Aegis AI');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setRiskData(data);
        } catch (e) {
          console.error("Failed to parse risk data", e);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('Disconnected from Aegis AI. Retrying in 5s...');
        setTimeout(connect, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.log('WebSocket Error:', error);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userId]);

  const sendLocation = (latitude: number, longitude: number) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          user_id: userId,
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        })
      );
    }
  };

  return { riskData, isConnected, sendLocation };
}
