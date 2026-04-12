import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button, ScrollView } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Waiting...");
  const [tracking, setTracking] = useState(false);
  const [lastSent, setLastSent] = useState("");

  const userId = "user_001";
  const BACKEND_URL = "http://192.168.2.104:8000/location";

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return false;
    }

    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
      return currentLocation.coords;
    } catch (error) {
      console.error("Location fetch error:", error);
      setStatus("Failed to fetch location");
      return null;
    }
  };

  const sendLocationToBackend = async (coords) => {
    try {
      const payload = {
        user_id: userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Location sent successfully");
        setLastSent(payload.timestamp);
        console.log("Backend response:", result);
      } else {
        setStatus("Backend error");
        console.log("Backend error:", result);
      }
    } catch (error) {
      console.error("API error:", error);
      setStatus("Failed to send location");
    }
  };

  const startTracking = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    setTracking(true);
    setStatus("Tracking started");
  };

  const stopTracking = () => {
    setTracking(false);
    setStatus("Tracking stopped");
  };

  useEffect(() => {
    let interval;

    if (tracking) {
      getCurrentLocation().then((coords) => {
        if (coords) {
          sendLocationToBackend(coords);
        }
      });

      interval = setInterval(async () => {
        const coords = await getCurrentLocation();
        if (coords) {
          await sendLocationToBackend(coords);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tracking]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aegis AI</Text>
      <Text style={styles.subtitle}>Live Location Tracking</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text>{status}</Text>

        <Text style={styles.label}>Last Sent:</Text>
        <Text>{lastSent || "Not sent yet"}</Text>

        <Text style={styles.label}>Latitude:</Text>
        <Text>{location ? location.latitude : "N/A"}</Text>

        <Text style={styles.label}>Longitude:</Text>
        <Text>{location ? location.longitude : "N/A"}</Text>

        <Text style={styles.label}>Tracking:</Text>
        <Text>{tracking ? "Active" : "Stopped"}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Start Tracking" onPress={startTracking} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Stop Tracking" onPress={stopTracking} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 8,
  },
});