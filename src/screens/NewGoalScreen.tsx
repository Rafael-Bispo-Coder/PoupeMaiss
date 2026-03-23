import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { insertGoal } from '../database/goalRepository';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

export default function NewGoalScreen() {
  const navigation = useNavigation();
  const { refreshData } = useApp();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAmount = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const value = parseInt(cleaned || '0', 10) / 100;
    return value.toFixed(2).replace('.', ',');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Informe o nome da meta.');
      return;
    }
    const numericAmount = parseFloat(targetAmount.replace(',', '.'));
    if (!targetAmount || numericAmount <= 0) {
      Alert.alert('Erro', 'Informe um valor alvo válido.');
      return;
    }
    if (!deadline || deadline.length < 10) {
      Alert.alert('Erro', 'Informe uma data limite válida (AAAA-MM-DD).');
      return;
    }

    setLoading(true);
    try {
      await insertGoal({ title: title.trim(), target_amount: numericAmount, deadline });
      await refreshData();
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
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
        <Text style={styles.label}>Nome da Meta</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Viagem, Reserva de emergência..."
          placeholderTextColor={Colors.textLight}
          maxLength={60}
        />

        <Text style={styles.label}>Valor Alvo (R$)</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.amountInput}
            value={targetAmount}
            onChangeText={(t) => setTargetAmount(formatAmount(t))}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <Text style={styles.label}>Data Limite (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={Colors.textLight}
          maxLength={10}
        />

        <Button title="Salvar Meta" onPress={handleSave} loading={loading} style={styles.saveBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: Colors.text,
  },
  amountRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, paddingHorizontal: 12,
  },
  currency: { fontSize: 18, fontWeight: '700', color: Colors.text, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: Colors.text, paddingVertical: 12 },
  saveBtn: { marginTop: 24 },
});
