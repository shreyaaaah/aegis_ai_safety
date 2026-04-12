import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RiskMeterProps {
  score: number;
  level: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, level }) => {
  let indicatorColor = '#00E5FF'; // Cyber Blue 'Low'
  if (level === 'Medium') indicatorColor = '#F59E0B'; // Amber
  if (level === 'High') indicatorColor = '#FF0055'; // Neon Pink/Red
  if (level === 'Critical') indicatorColor = '#FF0000'; // Pure Red

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THREAT LEVEL</Text>
      
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreText, { color: indicatorColor }]}>
          {score}
        </Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: `${indicatorColor}20`, borderColor: indicatorColor }]}>
            <Text style={[styles.badgeText, { color: indicatorColor }]}>{level.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.gaugeBackground}>
        {/* Glowing gauge line */}
        <View 
          style={[
            styles.gaugeFill, 
            { 
              width: `${Math.min(score, 100)}%`, 
              backgroundColor: indicatorColor,
              shadowColor: indicatorColor,
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 10
            }
          ]} 
        />
      </View>

      <Text style={styles.hashMarks}>|  .  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 5,
    letterSpacing: 3,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 56,
    fontWeight: '900',
    fontFamily: 'monospace', // Gives it a techy feel if custom fonts aren't loaded
  },
  badgeContainer: {
    marginLeft: 15,
    marginBottom: 10, // Align with baseline
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  gaugeBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  hashMarks: {
    color: '#334155',
    fontSize: 10,
    letterSpacing: 5,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.5,
  }
});
