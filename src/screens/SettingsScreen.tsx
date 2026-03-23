import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { resetDatabase } from '../database/database';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';

export default function SettingsScreen() {
  const { refreshData } = useApp();

  const handleReset = () => {
    Alert.alert(
      'Resetar dados',
      'Todos os dados (transações e metas) serão apagados permanentemente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar tudo',
          style: 'destructive',
          onPress: async () => {
            await resetDatabase();
            await refreshData();
            Alert.alert('Dados resetados', 'Todos os dados foram apagados.');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configurações ⚙️</Text>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>PoupeMaiss</Text>
        <Text style={styles.infoText}>Versão 1.0.0</Text>
        <Text style={styles.infoText}>Controle financeiro pessoal</Text>
        <Text style={styles.infoText}>Dados armazenados localmente 🔒</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Zona de perigo</Text>
        <Text style={styles.warningText}>
          Ao resetar os dados, todas as transações e metas serão apagadas permanentemente. Esta ação não pode ser desfeita.
        </Text>
        <Button
          title="🗑️ Resetar todos os dados"
          onPress={handleReset}
          variant="danger"
          style={styles.resetBtn}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  infoCard: { marginBottom: 8 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  infoText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.danger, marginBottom: 8 },
  warningText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16, lineHeight: 20 },
  resetBtn: {},
});
