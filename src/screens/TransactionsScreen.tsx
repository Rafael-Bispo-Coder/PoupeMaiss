import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../services/financeService';
import { deleteTransaction, Transaction } from '../database/transactionRepository';
import Card from '../components/Card';

type Filter = 'all' | 'income' | 'expense';

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Todas',
  income: 'Receitas',
  expense: 'Despesas',
};

export default function TransactionsScreen() {
  const { transactions, refreshData } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData]),
  );

  const filtered =
    filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  const handleDelete = (id: number) => {
    Alert.alert('Excluir transação', 'Deseja realmente excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          refreshData();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <Card style={styles.item}>
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: item.type === 'income' ? Colors.income : Colors.expense },
          ]}
        >
          <Text style={styles.typeBadgeText}>{item.type === 'income' ? '⬆️' : '⬇️'}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {!!item.description && (
            <Text style={styles.itemDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text
          style={[
            styles.itemAmount,
            { color: item.type === 'income' ? Colors.income : Colors.expense },
          ]}
        >
          {item.type === 'expense' ? '- ' : '+ '}{formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id!)} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transações 💳</Text>
        <View style={styles.filters}>
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            >
              <Text
                style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}
              >
                {FILTER_LABELS[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterBtnText: { fontSize: 13, color: Colors.textSecondary },
  filterBtnTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 12, paddingBottom: 32 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  typeBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  typeBadgeText: { fontSize: 16 },
  itemInfo: { flex: 1 },
  itemCategory: { fontSize: 15, fontWeight: '600', color: Colors.text },
  itemDescription: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  itemDate: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  itemAmount: { fontSize: 15, fontWeight: '700' },
  deleteBtn: { marginTop: 4 },
  deleteBtnText: { fontSize: 16 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
});
