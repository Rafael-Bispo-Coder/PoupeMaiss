import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface AppLottieProps {
  source: object;
  width?: number;
  height?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export default function AppLottie({
  source,
  width = 200,
  height = 200,
  loop = true,
  autoPlay = true,
}: AppLottieProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
