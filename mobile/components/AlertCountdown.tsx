import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertCountdownProps {
  urgency: string;
  onAutoSOS: () => void;
  onDismiss: () => void;
}

export const AlertCountdown: React.FC<AlertCountdownProps> = ({ urgency, onAutoSOS, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (urgency !== 'immediate') return;

    if (timeLeft <= 0) {
      onAutoSOS();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [urgency, timeLeft, onAutoSOS]);

  if (urgency !== 'immediate') return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="warning" size={28} color="#FFF" />
        <Text style={styles.alertText}>CRITICAL THREAT DETECTED</Text>
      </View>
      
      <Text style={styles.subText}>Autonomous SOS Sequence Initiated. Live location will be broadcast to emergency contacts.</Text>
      
      <Text style={styles.timerText}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</Text>

      <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.8}>
        <Ionicons name="hand-left-outline" size={20} color="#FF0055" />
        <Text style={styles.dismissText}>CANCEL (I AM SAFE)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#38000F', // Very dark deep red
    padding: 24,
    borderRadius: 16,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF0055',
    shadowColor: '#FF0055',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 10,
    letterSpacing: 1,
  },
  subText: {
    color: '#FFA1B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  timerText: {
    fontFamily: 'monospace',
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 25,
    textShadowColor: '#FF0055',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dismissButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    color: '#FF0055',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    marginLeft: 10,
  }
});
