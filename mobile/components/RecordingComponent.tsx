import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../constants/Config';

export function RecordingComponent({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setIsRecording(false);
    setIsAnalyzing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        await uploadAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setRecording(null);
      setIsAnalyzing(false);
    }
  }

  async function uploadAudio(uri: string) {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', {
      uri,
      name: 'voice_context.m4a',
      type: 'audio/m4a',
    });

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      onAnalysisComplete(result);
    } catch (err) {
      console.error('Upload Error:', err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ACOUSTIC SURVEILLANCE</Text>
      <TouchableOpacity 
        style={[styles.recordButton, isRecording && styles.recordingActive]} 
        onPressIn={startRecording}
        onPressOut={stopRecording}
        activeOpacity={0.7}
      >
        {isAnalyzing ? (
          <ActivityIndicator color="#00E5FF" />
        ) : (
          <Ionicons 
            name={isRecording ? "mic" : "mic-outline"} 
            size={30} 
            color={isRecording ? "#FFF" : "#00E5FF"} 
          />
        )}
      </TouchableOpacity>
      <Text style={styles.hint}>
        {isRecording ? "RECORDING CONTEXT..." : isAnalyzing ? "ANALYZING STRESS..." : "HOLD TO SCAN VOICE"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  label: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 15,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    marginBottom: 10,
  },
  recordingActive: {
    backgroundColor: '#FF0055',
    borderColor: '#FF0055',
    shadowColor: '#FF0055',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  hint: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
  }
});
