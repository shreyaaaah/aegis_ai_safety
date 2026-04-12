import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useTracking(sendLocationCallback: (lat: number, lon: number) => void, isConnected: boolean) {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      setIsTracking(true);
      
      // Use watchPositionAsync for real-time foreground updates matching the WebSocket tick
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, 
          distanceInterval: 1, 
        },
        (location) => {
          if (isConnected) {
            sendLocationCallback(location.coords.latitude, location.coords.longitude);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      setIsTracking(false);
    };
  }, [isConnected]);

  return { isTracking };
}
