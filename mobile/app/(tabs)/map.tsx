import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// For a true map implementaton, you would use 'react-native-maps'
// `npx expo install react-native-maps`
// But we build the visually perfect HUD overlay here first.

const { width, height } = Dimensions.get('window');

export default function LiveTrackerScreen() {
  return (
    <View style={styles.container}>
      {/* MOCK MAP BACKGROUND: 
          In production, replace this View with <MapView> from react-native-maps 
          using a customDarkMapStyle JSON passed into customMapStyle prop. */}
      <View style={styles.mapMock}>
        <Ionicons name="map-outline" size={100} color="rgba(0, 229, 255, 0.1)" />
        <Text style={styles.mockText}>[ LIVE SATELLITE FEED ]</Text>
        <Text style={styles.subMockText}>Awaiting react-native-maps package installation...</Text>
      </View>

      {/* Futuristic HUD Overlay */}
      <View style={styles.hudOverlay}>
        <View style={styles.hudHeader}>
          <Text style={styles.hudTitle}>TACTICAL VIEW</Text>
          <View style={styles.radarPing} />
        </View>

        <View style={styles.targetInfo}>
          <Ionicons name="location-sharp" size={24} color="#00E5FF" />
          <View style={styles.targetData}>
            <Text style={styles.targetName}>Subject: USER_777</Text>
            <Text style={styles.targetCoord}>Lat 12.9716 | Lon 77.5946</Text>
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
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 255, 0.2)',
    paddingBottom: 10,
  },
  hudTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  radarPing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetData: {
    marginLeft: 15,
  },
  targetName: {
    color: '#E2E8F0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  targetCoord: {
    color: '#00E5FF',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 4,
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
