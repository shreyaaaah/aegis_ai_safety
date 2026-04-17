import * as Speech from 'expo-speech';
import { useEffect, useRef } from 'react';

/**
 * Tactical Voice Advisor Hook.
 * Automatically vocalizes actionable advice when risk escalates.
 */
export function useVoiceInterface(advice: string, isEnabled: boolean, riskScore: number) {
  const lastAdviceRef = useRef('');

  useEffect(() => {
    if (!isEnabled || !advice || riskScore < 40) return;

    // Only speak if the advice has changed and isn't a repeat
    if (advice !== lastAdviceRef.current) {
      lastAdviceRef.current = advice;
      
      Speech.speak(advice, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  }, [advice, isEnabled, riskScore]);

  const stopSpeaking = () => {
    Speech.stop();
  };

  return { stopSpeaking };
}
