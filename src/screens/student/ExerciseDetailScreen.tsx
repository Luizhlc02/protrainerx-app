import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { MOCK_TODAY_WORKOUT } from '@/services/mockData';
import { colors } from '@/types/theme';
import type { StudentHomeStackParamList } from '@/navigation/StudentHomeStack';

// ExerciseDetailScreen — detalhe de um exercício do treino.
// Recebe `exerciseId` via params da rota. O `useRoute` é o equivalente do
// `ActivatedRoute` do Angular — você pega os parâmetros injetados pela rota.

type DetailRoute = RouteProp<StudentHomeStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { exerciseId } = route.params;

  // Em produção isso viria de um service (`workoutService.getExercise(id)`).
  // Mock por enquanto: pega do treino do dia.
  const workoutExercise = MOCK_TODAY_WORKOUT.exercises.find(
    (e) => e.exercise.id === exerciseId,
  );

  if (!workoutExercise) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.notFound}>Exercício não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const { exercise, planned, notes } = workoutExercise;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroIcon}>
          <Ionicons
            name={(exercise.iconName as React.ComponentProps<typeof Ionicons>['name']) ?? 'barbell-outline'}
            size={42}
            color={colors.accentBlue}
          />
        </View>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.muscle}>{translateMuscle(exercise.muscleGroup)}</Text>

        <Card>
          <Text style={styles.cardTitle}>Planejamento</Text>
          <View style={styles.statsRow}>
            <Stat label="Séries" value={String(planned.sets)} />
            <Stat label="Reps" value={String(planned.reps)} />
            {planned.weightKg !== undefined && (
              <Stat label="Carga" value={`${planned.weightKg} kg`} />
            )}
            {planned.restSec !== undefined && planned.restSec > 0 && (
              <Stat label="Descanso" value={`${planned.restSec}s`} />
            )}
          </View>
        </Card>

        {exercise.description && (
          <Card>
            <Text style={styles.cardTitle}>Como executar</Text>
            <Text style={styles.bodyText}>{exercise.description}</Text>
          </Card>
        )}

        {notes && (
          <Card>
            <Text style={styles.cardTitle}>Observações do seu personal</Text>
            <Text style={styles.bodyText}>{notes}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function translateMuscle(group: string): string {
  const map: Record<string, string> = {
    CHEST: 'Peito',
    BACK: 'Costas',
    LEGS: 'Pernas',
    SHOULDERS: 'Ombros',
    ARMS: 'Braços',
    CORE: 'Core',
    CARDIO: 'Cardio',
    FULL_BODY: 'Corpo inteiro',
  };
  return map[group] ?? group;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  heroIcon: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.accentBlue}26`,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  muscle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  stat: { gap: 2 },
  statValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 11 },
  bodyText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  notFound: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
