import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { MOCK_EXERCISES } from '@/services/mockData';
import type { Exercise, WorkoutIntensity } from '@/types/domain';
import { colors } from '@/types/theme';

// WorkoutBuilderScreen — personal monta um novo treino.
// Fluxo: dá um nome, escolhe intensidade, adiciona exercícios da biblioteca.
//
// Conceito novo: gerenciar uma "lista que cresce" com useState.
// Cada exercício adicionado vira um item do array; remover = filter.
// Sempre criar novo array (`[...prev, novo]`, `prev.filter(...)`) — mutar
// não dispara re-render.

const intensities: { value: WorkoutIntensity; label: string }[] = [
  { value: 'LOW', label: 'Leve' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'HIGH', label: 'Intenso' },
];

export function WorkoutBuilderScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('MEDIUM');
  const [selected, setSelected] = useState<Exercise[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);

  const toggleExercise = (ex: Exercise) => {
    setSelected((prev) =>
      prev.find((e) => e.id === ex.id) ? prev.filter((e) => e.id !== ex.id) : [...prev, ex],
    );
  };

  const onSave = () => {
    // TODO: POST /workouts
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Montar treino</Text>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card>
            <TextField
              label="NOME DO TREINO"
              icon="barbell-outline"
              placeholder="Ex: Peito e tríceps"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
            />
            <View style={styles.spacer} />
            <TextField
              label="DURAÇÃO ESTIMADA (MIN)"
              icon="time-outline"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
            <View style={styles.spacer} />
            <Text style={styles.label}>INTENSIDADE</Text>
            <View style={styles.intensityRow}>
              {intensities.map((opt) => {
                const active = intensity === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.intensityBtn, active && styles.intensityBtnActive]}
                    onPress={() => setIntensity(opt.value)}
                  >
                    <Text
                      style={[styles.intensityLabel, active && styles.intensityLabelActive]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card>
            <View style={styles.exercisesHeader}>
              <Text style={styles.cardTitle}>
                Exercícios{selected.length > 0 ? ` (${selected.length})` : ''}
              </Text>
              <Pressable onPress={() => setShowCatalog((v) => !v)}>
                <Text style={styles.link}>
                  {showCatalog ? 'Fechar catálogo' : '+ Adicionar'}
                </Text>
              </Pressable>
            </View>

            {selected.length === 0 && !showCatalog && (
              <Text style={styles.muted}>
                Nenhum exercício adicionado. Toque em &quot;+ Adicionar&quot; para escolher.
              </Text>
            )}

            {selected.map((ex) => (
              <View key={ex.id} style={styles.selectedRow}>
                <View style={styles.exIcon}>
                  <Ionicons name="barbell-outline" size={16} color={colors.accentBlue} />
                </View>
                <Text style={styles.selectedName}>{ex.name}</Text>
                <Pressable onPress={() => toggleExercise(ex)} hitSlop={6}>
                  <Ionicons name="close-circle" size={20} color={colors.danger} />
                </Pressable>
              </View>
            ))}

            {showCatalog && (
              <View style={styles.catalog}>
                {MOCK_EXERCISES.map((ex) => {
                  const isSelected = selected.some((s) => s.id === ex.id);
                  return (
                    <Pressable
                      key={ex.id}
                      style={[styles.catalogRow, isSelected && styles.catalogRowSelected]}
                      onPress={() => toggleExercise(ex)}
                    >
                      <Text style={styles.catalogName}>{ex.name}</Text>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                        size={20}
                        color={isSelected ? colors.success : colors.textSecondary}
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Card>

          <PrimaryButton
            label="SALVAR TREINO"
            icon="checkmark"
            onPress={onSave}
            disabled={!title.trim() || selected.length === 0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },

  content: { padding: 16, gap: 14, paddingBottom: 32 },
  spacer: { height: 12 },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  intensityRow: { flexDirection: 'row', gap: 8 },
  intensityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  intensityBtnActive: { backgroundColor: colors.accentBlue, borderColor: colors.accentBlue },
  intensityLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  intensityLabelActive: { color: colors.textPrimary },

  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  link: { color: colors.accentBlue, fontSize: 13, fontWeight: '600' },
  muted: { color: colors.textSecondary, fontSize: 13 },

  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  exIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: `${colors.accentBlue}26`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedName: { flex: 1, color: colors.textPrimary, fontSize: 14 },

  catalog: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  catalogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  catalogRowSelected: { backgroundColor: `${colors.success}10` },
  catalogName: { color: colors.textPrimary, fontSize: 14 },
});
