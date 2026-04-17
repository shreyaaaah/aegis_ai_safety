import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// For a true map implementaton, you would use 'react-native-maps'
// `npx expo install react-native-maps`
// But we build the visually perfect HUD overlay here first.

const { width, height } = Dimensions.get('window');

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Circle } from 'react-native-maps';
import { useSafety } from '../../context/SafetyContext';

const { width, height } = Dimensions.get('window');

// Tactical Midnight HUD Map Style
const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

export default function LiveTrackerScreen() {
  const { userLocation, riskData } = useSafety();

  const currentRegion = {
    latitude: userLocation?.latitude || 12.9716,
    longitude: userLocation?.longitude || 77.5946,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const threatProbability = riskData?.multi_agent?.threat_probability || 0;
  const outcome = riskData?.multi_agent?.outcome || "Establishing tactical baseline...";
  const ghostPath = riskData?.multi_agent?.ghost_path || [];
  const heatmap = riskData?.heatmap || [];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={DARK_MAP_STYLE}
        region={currentRegion}
      >
        {/* Spatial Threat Heatmap */}
        {heatmap.map((zone: any) => (
          <Circle 
            key={zone.id}
            center={{ latitude: zone.lat, longitude: zone.lon }}
            radius={zone.radius}
            fillColor={`rgba(255, 0, 85, ${zone.intensity * 0.3})`}
            strokeColor="rgba(255, 0, 85, 0.5)"
            strokeWidth={1}
          />
        ))}

        {/* Adversarial Ghost Path (Threat Vector) */}
        {ghostPath.length > 0 && (
          <Polyline 
            coordinates={ghostPath}
            strokeColor="#FF0055"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}

        {userLocation && (
          <Marker 
            coordinate={userLocation}
            title="SUBJECT_777"
          >
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarkerPulse} />
              <View style={styles.userMarkerCore} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Futuristic HUD Overlay */}
      <View style={styles.hudOverlay}>
        <View style={styles.hudHeader}>
          <View>
            <Text style={styles.hudTitle}>TACTICAL HUD</Text>
            <Text style={styles.hudStatus}>SATELLITE SYNC: ACTIVE</Text>
          </View>
          <View style={[styles.radarPing, { backgroundColor: threatProbability > 50 ? '#FF0055' : '#00E5FF' }]} />
        </View>

        <View style={styles.targetInfo}>
          <View style={[styles.threatBadge, { backgroundColor: threatProbability > 50 ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 229, 255, 0.1)' }]}>
            <Ionicons name="shield-outline" size={16} color={threatProbability > 50 ? '#FF0055' : '#00E5FF'} />
            <Text style={[styles.threatValue, { color: threatProbability > 50 ? '#FF0055' : '#00E5FF' }]}>{threatProbability}%</Text>
          </View>
          <View style={styles.targetData}>
            <Text style={styles.targetName}>Adversarial Outcome</Text>
            <Text style={styles.targetCoord} numberOfLines={2}>{outcome}</Text>
          </View>
        </View>
      </View>

      {/* Cybernetic Grid Lines */}
      <View style={styles.gridLineHorizontal} />
      <View style={styles.gridLineVertical} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  mapMock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
  },
  mockText: {
    color: '#00E5FF',
    fontFamily: 'monospace',
    marginTop: 20,
    opacity: 0.5,
    letterSpacing: 2,
  },
  subMockText: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 10,
  },
  hudOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  hudTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  hudStatus: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.7,
  },
  threatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 15,
  },
  threatValue: {
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetData: {
    flex: 1,
  },
  targetName: {
    color: '#64748B',
    fontWeight: '900',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  targetCoord: {
    color: '#E2E8F0',
    fontFamily: 'monospace',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  userMarkerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00E5FF',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.5)',
  },
  gridLineHorizontal: {
    position: 'absolute',
    top: height / 2,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
  },
  gridLineVertical: {
    position: 'absolute',
    left: width / 2,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
  }
});
