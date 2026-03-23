import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../services/financeService';
import SummaryCard from '../components/SummaryCard';
import Card from '../components/Card';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type Nav = StackNavigationProp<RootStackParamList>;

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { monthlySummary, currentYear, currentMonth, setCurrentMonth, goals, accumulatedSavings, refreshData } =
    useApp();

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData]),
  );

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(currentYear - 1, 12);
    } else {
      setCurrentMonth(currentYear, currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(currentYear + 1, 1);
    } else {
      setCurrentMonth(currentYear, currentMonth + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PoupeMaiss 💰</Text>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthBtn}>
            <Text style={styles.monthBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {MONTHS[currentMonth - 1]} {currentYear}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthBtn}>
            <Text style={styles.monthBtnText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saldo Mensal */}
      <Card style={[styles.balanceCard, { backgroundColor: Colors.primary }]}>
        <Text style={styles.balanceLabel}>Saldo do Mês</Text>
        <Text
          style={[
            styles.balanceValue,
            { color: monthlySummary.balance >= 0 ? '#ffffff' : Colors.secondaryLight },
          ]}
        >
          {formatCurrency(monthlySummary.balance)}
        </Text>
      </Card>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <SummaryCard
          title="Receitas"
          value={formatCurrency(monthlySummary.totalIncome)}
          color={Colors.income}
          icon="⬆️"
        />
        <SummaryCard
          title="Despesas"
          value={formatCurrency(monthlySummary.totalExpenses)}
          color={Colors.expense}
          icon="⬇️"
        />
      </View>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Metas 🎯</Text>
          {goals.map((goal) => {
            const progress = goal.target_amount > 0 ? Math.min(accumulatedSavings / goal.target_amount, 1) : 0;
            return (
              <Card key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalPercent}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={styles.goalFooter}>
                  <Text style={styles.goalSaved}>
                    Poupado: {formatCurrency(Math.min(accumulatedSavings, goal.target_amount))}
                  </Text>
                  <Text style={styles.goalTarget}>
                    Meta: {formatCurrency(goal.target_amount)}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.income }]}
          onPress={() => navigation.navigate('NewTransaction', { type: 'income' })}
        >
          <Text style={styles.actionIcon}>⬆️</Text>
          <Text style={styles.actionLabel}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.expense }]}
          onPress={() => navigation.navigate('NewTransaction', { type: 'expense' })}
        >
          <Text style={styles.actionIcon}>⬇️</Text>
          <Text style={styles.actionLabel}>Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: Colors.secondary }]}
          onPress={() => navigation.navigate('NewGoal')}
        >
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionLabel}>Meta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  monthNav: { flexDirection: 'row', alignItems: 'center' },
  monthBtn: { padding: 8 },
  monthBtnText: { fontSize: 24, color: Colors.primary, fontWeight: '700' },
  monthText: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600', color: Colors.text },
  balanceCard: { marginBottom: 12, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  balanceValue: { fontSize: 32, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginVertical: 12 },
  goalCard: {},
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, flex: 1 },
  goalPercent: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  progressBar: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 5 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  goalSaved: { fontSize: 12, color: Colors.income },
  goalTarget: { fontSize: 12, color: Colors.textSecondary },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
