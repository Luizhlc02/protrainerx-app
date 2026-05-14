import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { MOCK_TODAY_WORKOUT } from '@/services/mockData';
import { colors } from '@/types/theme';

// WorkoutSessionScreen — tela de execução do treino.
//
// O aluno marca cada série como concluída tocando no checkbox. Quando todas
// estão completas, libera o botão "FINALIZAR TREINO".
//
// Por simplicidade, mantemos o estado local com `useState<Set<string>>`. Em
// produção, isso viraria um workoutSession no backend (POST /sessions) com
// updates incrementais.

// Cada série tem um id derivado de `${exerciseId}-${setIndex}`. Set de strings
// é mais eficiente para lookup do que array de booleans num cenário de toggle.
type CompletedSets = Set<string>;

export function WorkoutSessionScreen() {
  const navigation = useNavigation();
  const workout = MOCK_TODAY_WORKOUT; // mock — viria do route.params em produção
  const [completed, setCompleted] = useState<CompletedSets>(new Set());

  const totalSets = useMemo(
    () => workout.exercises.reduce((acc, e) => acc + e.planned.sets, 0),
    [workout],
  );

  const progress = totalSets === 0 ? 0 : completed.size / totalSets;

  const toggle = (id: string) => {
    setCompleted((prev) => {
      // Sempre criamos um novo Set — React só re-renderiza se a referência muda.
      // Mutar o set existente NÃO dispara update (pegadinha clássica de RN/React).
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onFinish = () => {
    // TODO: enviar workoutSession ao backend
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.subtitle}>
          {completed.size} de {totalSets} séries concluídas
        </Text>
        {/* Barra de progresso simples: View com largura proporcional */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {workout.exercises.map((we) => (
          <Card key={we.exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseIcon}>
                <Ionicons name="barbell-outline" size={20} color={colors.accentBlue} />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{we.exercise.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {we.planned.sets}×{we.planned.reps}
                  {we.planned.weightKg ? ` · ${we.planned.weightKg}kg` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.setsGrid}>
              {Array.from({ length: we.planned.sets }).map((_, i) => {
                const id = `${we.exercise.id}-${i}`;
                const isDone = completed.has(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => toggle(id)}
                    style={[styles.setChip, isDone && styles.setChipDone]}
                  >
                    {isDone && (
                      <Ionicons name="checkmark" size={14} color={colors.textPrimary} />
                    )}
                    <Text style={[styles.setText, isDone && styles.setTextDone]}>
                      Série {i + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="FINALIZAR TREINO"
          icon="checkmark-done"
          onPress={onFinish}
          disabled={completed.size === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: { height: '100%', backgroundColor: colors.accentBlue },

  scrollContent: { padding: 16, paddingBottom: 24 },
  exerciseCard: { marginBottom: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accentBlue}26`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  exerciseMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  setsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  setChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setChipDone: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
  },
  setText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  setTextDone: { color: colors.textPrimary },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
