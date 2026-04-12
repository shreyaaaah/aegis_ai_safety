import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    // Navigate straight to the Sentinel Dashboard
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.glowOrb} />
      <View style={styles.glowOrb2} />
      
      <View style={styles.content}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#00E5FF" />
          <Text style={styles.brandTitle}>AEGIS</Text>
          <Text style={styles.brandSubtitle}>A I</Text>
        </View>

        {/* Auth Box */}
        <View style={styles.authCard}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="System ID / Username"
              placeholderTextColor="#475569"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Passcode"
              placeholderTextColor="#475569"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth} activeOpacity={0.8}>
            <Text style={styles.buttonText}>INITIALIZE LINK</Text>
            <Ionicons name="arrow-forward" size={18} color="#0B0F19" />
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity>
              <Text style={styles.secondaryText}>CREATE IDENTITY</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.secondaryText}>RECOVER ACCESS</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A', // Deepest black
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Futuristic blurry orbs in the background
  glowOrb: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(176, 38, 255, 0.05)',
  },
  content: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginTop: 10,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 8,
    marginTop: 5,
  },
  authCard: {
    width: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    color: '#FFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  primaryButton: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#0B0F19', // Darkest text for contrast
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginRight: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  secondaryText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
