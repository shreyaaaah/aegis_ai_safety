import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTracking } from '../../hooks/useTracking';
import { RiskMeter } from '../../components/RiskMeter';
import { AlertCountdown } from '../../components/AlertCountdown';

const { width } = Dimensions.get('window');
const MOCK_USER_ID = "user_777";

export default function DashboardScreen() {
  const { riskData, isConnected, sendLocation } = useWebSocket(MOCK_USER_ID);
  
  // Start tracking when WebSocket is connected
  const { isTracking } = useTracking(sendLocation, isConnected);

  const score = riskData?.risk_score || 0;
  const level = riskData?.risk_level || 'Low';
  const urgency = riskData?.urgency || 'low';
  const reasons = riskData?.reasons || [];
  const simulation = riskData?.simulation || '';
  const advice = riskData?.advice || '';

  const handleAutoSOS = () => {
    console.log("CRITICAL: Autonomous SOS Triggered!");
    alert("Emergency contacts have been notified with your live location.");
  };

  const handleDismissAlert = () => {
    console.log("User dismissed alert. Resetting urgency.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AEGIS <Text style={styles.headerAccent}>AI</Text></Text>
            <Text style={styles.headerSub}>Continuous Intelligence</Text>
          </View>
          <View style={[styles.statusBadge, { borderColor: isConnected ? '#00E5FF' : '#FF0055' }]}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#00E5FF' : '#FF0055' }]} />
            <Text style={[styles.statusText, { color: isConnected ? '#00E5FF' : '#FF0055' }]}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        {/* Core Intelligence UI */}
        <RiskMeter score={score} level={level} />

        {/* Autonomous SOS Module */}
        <AlertCountdown 
          urgency={urgency} 
          onAutoSOS={handleAutoSOS} 
          onDismiss={handleDismissAlert} 
        />

        {/* Context Logs */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={20} color="#00E5FF" />
            <Text style={styles.cardTitle}>Context Logs</Text>
          </View>
          <View style={styles.divider} />
          
          {reasons.length > 0 ? (
            reasons.map((r: string, idx: number) => (
              <View key={idx} style={styles.listItemContainer}>
                <Ionicons name="chevron-forward" size={14} color="#00E5FF" style={{ marginTop: 3, marginRight: 5 }} />
                <Text style={styles.listItem}>{r}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.bodyText}>Establishing baseline environmental patterns...</Text>
          )}
        </View>

        {/* Advanced Future Simulation */}
        {(simulation || advice) ? (
          <View style={styles.simCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="git-network-outline" size={20} color="#B026FF" />
              <Text style={styles.simTitle}>Scenario Prediction</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: 'rgba(176, 38, 255, 0.2)' }]} />
            
            <Text style={styles.bodyText}>{simulation}</Text>
            
            {advice ? (
              <View style={styles.adviceBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#B026FF" />
                <Text style={styles.adviceText}>{advice}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerAccent: {
    color: '#00E5FF',
    fontWeight: '900',
  },
  headerSub: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    shadowColor: '#00E5FF',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginLeft: 10,
    letterSpacing: 1,
  },
  simCard: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(176, 38, 255, 0.2)',
  },
  simTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginLeft: 10,
    letterSpacing: 1,
  },
  bodyText: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 24,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listItem: {
    flex: 1,
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 22,
  },
  adviceBox: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'rgba(176, 38, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(176, 38, 255, 0.3)',
    alignItems: 'center',
  },
  adviceText: {
    flex: 1,
    color: '#E9D5FF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 20,
  }
});