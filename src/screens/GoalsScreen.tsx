import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../services/financeService';
import { deleteGoal, Goal } from '../database/goalRepository';
import Card from '../components/Card';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = StackNavigationProp<RootStackParamList>;

export default function GoalsScreen() {
  const navigation = useNavigation<Nav>();
  const { goals, accumulatedSavings, refreshData } = useApp();

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData]),
  );

  const handleDelete = (id: number) => {
    Alert.alert('Excluir meta', 'Deseja realmente excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteGoal(id);
          refreshData();
        },
      },
    ]);
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    const progress = item.target_amount > 0 ? Math.min(accumulatedSavings / item.target_amount, 1) : 0;
    const achieved = progress >= 1;
    return (
      <Card style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          {achieved && <Text style={styles.achievedBadge}>✅ Atingida</Text>}
          <TouchableOpacity onPress={() => handleDelete(item.id!)} style={styles.deleteBtn}>
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: achieved ? Colors.success : Colors.primary,
              },
            ]}
          />
        </View>
        <View style={styles.goalStats}>
          <Text style={styles.goalStatText}>
            💰 {formatCurrency(Math.min(accumulatedSavings, item.target_amount))} / {formatCurrency(item.target_amount)}
          </Text>
          <Text style={styles.goalStatText}>{Math.round(progress * 100)}%</Text>
        </View>
        <Text style={styles.goalDeadline}>📅 Prazo: {formatDate(item.deadline)}</Text>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Metas 🎯</Text>
        <Button
          title="+ Nova Meta"
          onPress={() => navigation.navigate('NewGoal')}
          style={styles.newBtn}
        />
      </View>
      <View style={styles.savingsInfo}>
        <Text style={styles.savingsLabel}>Economia acumulada total:</Text>
        <Text style={styles.savingsValue}>{formatCurrency(accumulatedSavings)}</Text>
      </View>
      <FlatList
        data={goals}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderGoal}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma meta cadastrada.</Text>
            <Text style={styles.emptySubText}>Crie sua primeira meta e comece a poupar!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.text },
  newBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  savingsInfo: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: { color: '#fff', fontSize: 14 },
  savingsValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  list: { padding: 12, paddingBottom: 32 },
  goalCard: {},
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  goalTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  achievedBadge: { fontSize: 13 },
  deleteBtn: {},
  progressBar: {
    height: 12, backgroundColor: Colors.border, borderRadius: 6,
    overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 6 },
  goalStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  goalStatText: { fontSize: 13, color: Colors.textSecondary },
  goalDeadline: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.textSecondary, fontSize: 16, marginBottom: 8 },
  emptySubText: { color: Colors.textLight, fontSize: 14 },
});
