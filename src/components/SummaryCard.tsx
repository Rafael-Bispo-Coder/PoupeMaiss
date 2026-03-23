import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import Card from './Card';

interface SummaryCardProps {
  title: string;
  value: string;
  color?: string;
  icon?: string;
}

export default function SummaryCard({ title, value, color = Colors.text, icon }: SummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
