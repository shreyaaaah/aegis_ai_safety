import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";

type RiskResult = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [status, setStatus] = useState<string>("Waiting...");
  const [tracking, setTracking] = useState<boolean>(false);
  const [lastSent, setLastSent] = useState<string>("");
  const [risk, setRisk] = useState<RiskResult | null>(null);

  const userId = "user_001";
  const BASE_URL = "http://192.168.2.104:8000";
  const LOCATION_URL = `${BASE_URL}/location`;
  const RISK_URL = `${BASE_URL}/risk`;
  const SOS_URL = `${BASE_URL}/sos`;

  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return false;
    }

    return true;
  };

  const getCurrentLocation = async (): Promise<Location.LocationObjectCoords | null> => {
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

  const sendLocationToBackend = async (
    coords: Location.LocationObjectCoords,
    timestamp: string
  ): Promise<void> => {
    try {
      const payload = {
        user_id: userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      };

      const response = await fetch(LOCATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Location sent successfully");
        setLastSent(timestamp);
        console.log("Location response:", result);
      } else {
        setStatus("Backend error while saving location");
        console.log("Location backend error:", result);
      }
    } catch (error) {
      console.error("Location API error:", error);
      setStatus("Failed to send location");
    }
  };

  const fetchRiskFromBackend = async (
    coords: Location.LocationObjectCoords,
    timestamp: string
  ): Promise<void> => {
    try {
      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      };

      const response = await fetch(RISK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: RiskResult = await response.json();

      if (response.ok) {
        setRisk(result);
        console.log("Risk response:", result);
      } else {
        console.log("Risk backend error:", result);
      }
    } catch (error) {
      console.error("Risk API error:", error);
    }
  };

  const sendSOS = async (): Promise<void> => {
    if (!location) {
      Alert.alert("Location unavailable", "Current location is not available yet.");
      return;
    }

    try {
      const payload = {
        user_id: userId,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(SOS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("SOS Sent", "Emergency signal triggered successfully.");
        console.log("SOS response:", result);
      } else {
        Alert.alert("Error", "Failed to send SOS.");
        console.log("SOS backend error:", result);
      }
    } catch (error) {
      console.error("SOS API error:", error);
      Alert.alert("Error", "Something went wrong while sending SOS.");
    }
  };

  const startTracking = async (): Promise<void> => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    setTracking(true);
    setStatus("Tracking started");
  };

  const stopTracking = (): void => {
    setTracking(false);
    setStatus("Tracking stopped");
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (tracking) {
      const runTrackingCycle = async () => {
        const coords = await getCurrentLocation();
        if (coords) {
          const timestamp = new Date().toISOString();
          await sendLocationToBackend(coords, timestamp);
          await fetchRiskFromBackend(coords, timestamp);
        }
      };

      runTrackingCycle();

      interval = setInterval(async () => {
        await runTrackingCycle();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tracking]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AURA-X Sentinel</Text>
      <Text style={styles.subtitle}>Live Location + Risk Monitoring</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tracking Details</Text>

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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Risk Analysis</Text>

        <Text style={styles.label}>Risk Score:</Text>
        <Text>{risk ? risk.risk_score : "N/A"}</Text>

        <Text style={styles.label}>Risk Level:</Text>
        <Text
          style={[
            styles.riskLevel,
            risk?.risk_level === "High"
              ? styles.high
              : risk?.risk_level === "Medium"
              ? styles.medium
              : styles.low,
          ]}
        >
          {risk ? risk.risk_level : "N/A"}
        </Text>

        <Text style={styles.label}>Reasons:</Text>
        {risk && risk.reasons.length > 0 ? (
          risk.reasons.map((reason, index) => (
            <Text key={index} style={styles.reason}>
              • {reason}
            </Text>
          ))
        ) : (
          <Text>N/A</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Start Tracking" onPress={startTracking} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Stop Tracking" onPress={stopTracking} color="red" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🚨 Send SOS" onPress={sendSOS} color="#d32f2f" />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 8,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  high: {
    color: "red",
  },
  medium: {
    color: "orange",
  },
  low: {
    color: "green",
  },
  reason: {
    marginTop: 4,
  },
});