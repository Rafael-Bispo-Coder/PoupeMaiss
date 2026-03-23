import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { insertTransaction } from '../database/transactionRepository';
import { CATEGORIES } from '../services/financeService';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type RouteProps = RouteProp<RootStackParamList, 'NewTransaction'>;

export default function NewTransactionScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { refreshData } = useApp();

  const [type, setType] = useState<'income' | 'expense'>(route.params?.type ?? 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const categories = CATEGORIES[type];

  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const value = parseInt(cleaned || '0', 10) / 100;
    return value.toFixed(2).replace('.', ',');
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatAmount(text));
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!amount || numericAmount <= 0) {
      Alert.alert('Erro', 'Informe um valor válido.');
      return;
    }
    if (!category) {
      Alert.alert('Erro', 'Selecione uma categoria.');
      return;
    }
    if (!date || date.length < 10) {
      Alert.alert('Erro', 'Informe uma data válida (AAAA-MM-DD).');
      return;
    }

    setLoading(true);
    try {
      await insertTransaction({ type, amount: numericAmount, category, description, date });
      await refreshData();
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Type Toggle */}
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          {(['income', 'expense'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => { setType(t); setCategory(''); }}
              style={[
                styles.typeBtn,
                type === t && {
                  backgroundColor: t === 'income' ? Colors.income : Colors.expense,
                },
              ]}
            >
              <Text style={[styles.typeBtnText, type === t && { color: '#fff' }]}>
                {t === 'income' ? '⬆️ Receita' : '⬇️ Despesa'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <Text style={styles.label}>Valor (R$)</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Category */}
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.catBtn, category === cat && styles.catBtnActive]}
            >
              <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={Colors.textLight}
          maxLength={10}
        />

        {/* Description */}
        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Adicione uma descrição..."
          placeholderTextColor={Colors.textLight}
          multiline
          numberOfLines={3}
        />

        <Button title="Salvar" onPress={handleSave} loading={loading} style={styles.saveBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 16 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  typeBtnText: { fontSize: 15, fontWeight: '600', color: Colors.text },
  amountRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, paddingHorizontal: 12,
  },
  currency: { fontSize: 18, fontWeight: '700', color: Colors.text, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: Colors.text, paddingVertical: 12 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: Colors.text,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  catBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catBtnText: { fontSize: 14, color: Colors.text },
  catBtnTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: { marginTop: 24 },
});
