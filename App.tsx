import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@poupemaiss:onboarding_done';

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setShowOnboarding(value !== 'true');
    });
  }, []);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding === null) return null;
  if (showOnboarding) return <OnboardingScreen onFinish={finishOnboarding} />;
  return <AppNavigator />;
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppContent />
    </AppProvider>
  );
}
