import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import AppLottie from '../components/AppLottie';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const manWomanHi = require('../../assets/lottie/man-woman-hi.json');

interface OnboardingScreenProps {
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <AppLottie source={manWomanHi} width={width * 0.8} height={width * 0.8} loop autoPlay />
      </View>
      <Text style={styles.title}>Bem-vindo ao PoupeMaiss!</Text>
      <Text style={styles.subtitle}>
        Controle suas finanças, crie metas e{'\n'}poupe mais a cada mês. 💚
      </Text>
      <Button title="Começar agora" onPress={onFinish} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  animationContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    width: '100%',
  },
});
