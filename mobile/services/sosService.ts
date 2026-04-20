import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { CONFIG } from '../constants/Config';

/**
 * Triggers an autonomous or manual SOS to emergency contacts and Aegis Backend.
 */
export const triggerSOS = async (latitude: number, longitude: number, contacts: string[], user_id: string = "Subject_777", risk_score: number = 85) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const message = `🚨 EMERGENCY (Aegis AI): I am in danger and require immediate assistance. My live location is here: ${mapUrl}`;
  
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const phoneNumbers = contacts.join(',');
  
  const smsUrl = `sms:${phoneNumbers}${separator}body=${encodeURIComponent(message)}`;

  // 1. Trigger Backend Tactical Response (Async)
  try {
    fetch(`${CONFIG.BACKEND_URL}/trigger-sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        latitude,
        longitude,
        risk_score
      })
    }).then(res => res.json())
      .then(data => console.log("Backend SOS Signal Received:", data))
      .catch(err => console.warn("Backend SOS failure (handled):", err));
  } catch (backendErr) {
    console.warn("Backend SOS catch (handled):", backendErr);
  }

  // 2. Trigger Local Device SOS (Native SMS)
  try {
    const canOpen = await Linking.canOpenURL(smsUrl);
    if (canOpen) {
      await Linking.openURL(smsUrl);
      console.log("Native SOS SMS Triggered");
      return true;
    } else {
      console.error("Device cannot open SMS protocol.");
      return false;
    }
  } catch (error) {
    console.error("SOS Trigger failed:", error);
    return false;
  }
};
