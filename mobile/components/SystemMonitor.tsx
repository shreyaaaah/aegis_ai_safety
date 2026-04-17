import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SystemMonitorProps {
  isConnected: boolean;
  isTracking: boolean;
  packetCount?: number;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ isConnected, isTracking, packetCount = 0 }) => {
  const [pulseAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <View style={styles.labelRow}>
          <Text style={styles.statLabel}>SATELLITE SYNC</Text>
          <View style={[styles.statusDot, { backgroundColor: isTracking ? '#00E5FF' : '#FF0055' }]} />
        </View>
        <Text style={styles.statValue}>{isTracking ? 'ACTIVE' : 'LOCKED'}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
         <View style={styles.labelRow}>
          <Text style={styles.statLabel}>DATA PACKETS</Text>
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
        </View>
        <Text style={styles.statValue}>{packetCount.toString().padStart(5, '0')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <View style={styles.labelRow}>
          <Text style={styles.statLabel}>BRAIN STATUS</Text>
          <Ionicons 
            name={isConnected ? "flash" : "flash-off"} 
            size={10} 
            color={isConnected ? "#B026FF" : "#64748B"} 
          />
        </View>
        <Text style={[styles.statValue, { color: isConnected ? '#B026FF' : '#64748B' }]}>
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.05)',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statValue: {
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B026FF',
    marginLeft: 6,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 15,
  }
});
