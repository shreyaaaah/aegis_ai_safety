import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafety } from '../../context/SafetyContext';
import { useVoiceInterface } from '../../hooks/useVoiceInterface';
import { RiskMeter } from '../../components/RiskMeter';
import { AlertCountdown } from '../../components/AlertCountdown';
import { RecordingComponent } from '../../components/RecordingComponent';
import { SystemMonitor } from '../../components/SystemMonitor';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { riskData, isConnected, triggerSOS, isVoiceEnabled, setVoiceEnabled, isTracking } = useSafety();
  const [packetCount, setPacketCount] = useState(0);

  useEffect(() => {
    if (riskData) {
      setPacketCount(prev => prev + 1);
    }
  }, [riskData]);

  const score = riskData?.risk_score || 0;
  const level = riskData?.risk_level || 'Low';
  const urgency = riskData?.urgency || 'low';
  const reasons = riskData?.reasons || [];
  const simulation = riskData?.simulation || '';
  const advice = riskData?.advice || '';

  // Initialize Voice Interface (Optional AI Advisor)
  useVoiceInterface(advice, isVoiceEnabled, score);

  const [acousticResults, setAcousticResults] = useState<any>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleAutoSOS = () => {
    console.log("CRITICAL: Autonomous Tactical Escalation Triggered!");
    triggerSOS(score);
  };

  const handleDismissAlert = () => {
    console.log("User dismissed alert. Resetting urgency.");
  };

  const handleAudioAnalysis = (data: any) => {
    setAcousticResults(data);
    // You could also trigger a risk score update here by sending a flag to the backend
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Modern Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AEGIS<Text style={{color: '#00E5FF'}}>AI</Text></Text>
            <Text style={styles.headerSub}>MISSION INTEL: ACTIVE</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => setVoiceEnabled(!isVoiceEnabled)}
            style={[styles.voiceToggle, isVoiceEnabled && styles.voiceActive]}
          >
             <Ionicons name={isVoiceEnabled ? "volume-high" : "volume-mute"} size={16} color={isVoiceEnabled ? '#05070A' : '#64748B'} />
          </TouchableOpacity>
        </View>

        {/* Real-Time Diagnostics */}
        <SystemMonitor isTracking={isTracking} isConnected={isConnected} packetCount={packetCount} />

        {/* Tactical Status Card */}
        <TouchableOpacity 
          style={[styles.calibrationCard, isCalibrating && styles.calibrationActive]} 
          onPress={() => setIsCalibrating(!isCalibrating)}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="git-branch-outline" size={18} color={isCalibrating ? "#0B0F19" : "#00E5FF"} />
            <Text style={[styles.cardTitle, isCalibrating && {color: '#0B0F19'}]}>CALIBRATION: {isCalibrating ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>

        {/* Core Intelligence UI */}
        <RiskMeter score={score} level={level} />

        {/* Acoustic Intelligence Scanner */}
        <RecordingComponent onAnalysisComplete={handleAudioAnalysis} />

        {/* Acoustic Results Display */}
        {acousticResults && (
          <View style={[styles.card, { borderColor: acousticResults.distress_score > 0.6 ? '#FF0055' : 'rgba(0, 229, 255, 0.2)' }]}>
             <View style={styles.cardHeader}>
              <Ionicons name="mic-outline" size={20} color={acousticResults.distress_score > 0.6 ? '#FF0055' : '#00E5FF'} />
              <Text style={styles.cardTitle}>Acoustic Intel</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.bodyText}><Text style={{color: '#00E5FF'}}>Transcribed: </Text>"{acousticResults.text}"</Text>
            <Text style={[styles.bodyText, {marginTop: 10}]}>
              <Text style={{color: '#00E5FF'}}>Status: </Text>
              {acousticResults.classification.toUpperCase()} ({Math.round(acousticResults.distress_score * 100)}% Stress)
            </Text>
          </View>
        )}

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
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  headerSub: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.6,
  },
  voiceToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  voiceActive: {
    backgroundColor: '#00E5FF',
    borderColor: '#0097A7',
    shadowColor: '#00E5FF',
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  card: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  calibrationCard: {
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  calibrationActive: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
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