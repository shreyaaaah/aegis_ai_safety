import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../constants/Config';

const MOCK_USER_ID = "user_777";

export default function VaultScreen() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = async () => {
    try {
      const resp = await fetch(`${CONFIG.BACKEND_URL}/incidents?user_id=${MOCK_USER_ID}`);
      const data = await resp.json();
      setIncidents(data.sort((a: any, b: any) => b.id - a.id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchIncidents();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FORENSIC <Text style={{color: '#00E5FF'}}>VAULT</Text></Text>
        <Text style={styles.subtitle}>TACTICAL INCIDENT REPOSITORY</Text>
      </View>

      <ScrollView 
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />}
      >
        {incidents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={64} color="rgba(0, 229, 255, 0.05)" />
            <Text style={styles.emptyText}>Neural net clear. No anomalies detected.</Text>
          </View>
        ) : (
          incidents.map((log) => (
            <View key={log.id} style={[styles.logCard, log.risk_score >= 85 && styles.criticalCard]}>
               <View style={styles.logHeader}>
                  <View>
                    <Text style={styles.logTimestamp}>{new Date(log.timestamp).toLocaleDateString()}</Text>
                    <Text style={styles.logTime}>{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: log.risk_score >= 85 ? '#FF0055' : 'rgba(0, 229, 255, 0.1)' }]}>
                    <Text style={styles.scoreText}>{log.risk_score}%</Text>
                  </View>
               </View>
               <View style={styles.divider} />
               <Text style={styles.bodyText} numberOfLines={2}>{log.description}</Text>
               <View style={styles.footer}>
                  <Text style={styles.responseLabel}>Tactical Response:</Text>
                  <Text style={[styles.responseText, { color: log.response_type === 'Police' ? '#FF0055' : '#00E5FF' }]}>
                    {log.response_type.toUpperCase()}
                  </Text>
               </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  logCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 24,
    borderRadius: 24,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  criticalCard: {
    borderColor: 'rgba(255, 0, 85, 0.3)',
    backgroundColor: 'rgba(255, 0, 85, 0.05)',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logTimestamp: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logTime: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  scoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 15,
  },
  bodyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  responseLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  responseText: {
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 8,
    letterSpacing: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#64748B',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  }
});
