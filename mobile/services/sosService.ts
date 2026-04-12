import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

/**
 * Triggers an autonomous or manual SOS to emergency contacts.
 * In a fully deployed app, this might ping the backend to use Twilio.
 * For a free, immediate solution without external APIs, we use the device's native SMS capabilities.
 */
export const triggerSOS = async (latitude: number, longitude: number, contacts: string[]) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const message = `🚨 EMERGENCY (Aegis AI): I am in danger and require immediate assistance. My live location is here: ${mapUrl}`;
  
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const phoneNumbers = contacts.join(',');
  
  const smsUrl = `sms:${phoneNumbers}${separator}body=${encodeURIComponent(message)}`;

  try {
    const canOpen = await Linking.canOpenURL(smsUrl);
    if (canOpen) {
      await Linking.openURL(smsUrl);
      console.log("SOS SMS Triggered successfully");
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
