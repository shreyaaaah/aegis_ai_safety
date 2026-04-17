import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Animated, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  const orb1Anim = useState(new Animated.Value(0))[0];
  const orb2Anim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Subtle orb floating animations
    const float = (anim: Animated.Value) => {
       Animated.loop(
         Animated.sequence([
           Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: true }),
           Animated.timing(anim, { toValue: 0, duration: 4000, useNativeDriver: true }),
         ])
       ).start();
    };
    float(orb1Anim);
    float(orb2Anim);
  }, []);

  const handleAuth = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background Orbs */}
      <Animated.View style={[styles.glowOrb, { 
        transform: [{ translateY: orb1Anim.interpolate({ inputRange:[0, 1], outputRange: [0, 50] }) }] 
      }]} />
      <Animated.View style={[styles.glowOrb2, { 
        transform: [{ translateY: orb2Anim.interpolate({ inputRange:[0, 1], outputRange: [0, -70] }) }] 
      }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={['#00E5FF', '#B026FF']}
                style={styles.logoGradient}
              >
                <Ionicons name="shield-checkmark" size={40} color="#FFF" />
              </LinearGradient>
            </View>
            <Text style={styles.brandTitle}>AEGIS<Text style={{color: '#00E5FF'}}>AI</Text></Text>
            <Text style={styles.brandTagline}>NEURAL AEGIS PROTOCOL</Text>
          </View>

          {/* GlassAuth Card */}
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Initialize Connection</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OPERATOR ID</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="finger-print-outline" size={18} color="#00E5FF" />
                <TextInput 
                  style={styles.input}
                  placeholder="Subject_777"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NEURAL PASSCODE</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={18} color="#00E5FF" />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleAuth} activeOpacity={0.9}>
              <LinearGradient
                colors={['#00E5FF', '#0097A7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>ESTABLISH LINK</Text>
                <Ionicons name="pulse" size={18} color="#0B0F19" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <TouchableOpacity><Text style={styles.footerLink}>ENROLL SUBJECT</Text></TouchableOpacity>
              <View style={styles.footerDivider} />
              <TouchableOpacity><Text style={styles.footerLink}>LOST ACCESS</Text></TouchableOpacity>
            </View>
          </View>

          <Text style={styles.legal}>V5.2.0 • Proactive Intelligence Layer</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOrb: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(176, 38, 255, 0.1)',
  },
  content: {
    width: width * 0.85,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
     width: 80,
     height: 80,
     borderRadius: 40,
     padding: 3,
     backgroundColor: 'rgba(255,255,255,0.1)',
     marginBottom: 15,
  },
  logoGradient: {
    flex: 1,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 4,
  },
  brandTagline: {
    fontSize: 10,
    color: '#64748B',
    letterSpacing: 3,
    marginTop: 5,
    fontWeight: '600',
  },
  authCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
  },
  authTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    color: '#FFF',
    marginLeft: 12,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#05070A',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    marginRight: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  footerLink: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginHorizontal: 15,
  },
  legal: {
    color: '#334155',
    fontSize: 10,
    marginTop: 40,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
