import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { SectionHeader } from '@/components/SectionHeader';
import type { StudentHomeStackParamList } from '@/navigation/StudentHomeStack';
import { MOCK_PROGRESS, MOCK_TODAY_WORKOUT } from '@/services/mockData';
import { useUser } from '@/store/authStore';
import { colors } from '@/types/theme';

// HomeScreen — tela inicial do aluno, agora ligada ao authStore real e ao
// HomeStack (push de Detalhe/Sessão/Dor).
//
// Mudanças vs versão anterior:
// - MOCK_USER removido — usamos useUser() do authStore
// - Botão "INICIAR TREINO" → navigation.navigate('WorkoutSession')
// - Card Treino de Hoje → toque no exercício abre ExerciseDetail
// - Atalho "Relatar dor" disparando ReportPainScreen
// - Anel agora é o ProgressRing real (com proporção/cor por meta)

type Nav = NativeStackNavigationProp<StudentHomeStackParamList>;

export function HomeScreen() {
  const user = useUser();
  const navigation = useNavigation<Nav>();
  const userName = user?.name ?? 'Atleta';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header userName={userName} />

        {/* Card 1 — Resumo do Dia */}
        <Card>
          <SectionHeader title="Resumo do Dia" />
          <View style={styles.summaryRow}>
            <ProgressRing
              value={MOCK_PROGRESS.caloriesWeek}
              max={MOCK_PROGRESS.caloriesGoalWeek}
              label="kcal"
            />
            <View style={styles.summaryStats}>
              <Stat
                icon="barbell-outline"
                iconColor={colors.accentBlue}
                label="Treinos"
                value={`${MOCK_PROGRESS.workoutsWeek}/${MOCK_PROGRESS.workoutsGoalWeek}`}
              />
              <Stat
                icon="flame-outline"
                iconColor={colors.accent}
                label="Calorias"
                value={`${(MOCK_PROGRESS.caloriesWeek / 1000).toFixed(1)}k/12k`}
              />
            </View>
          </View>
        </Card>

        {/* Card 2 — Treino de Hoje */}
        <Card>
          <SectionHeader title="TREINO DE HOJE" small />
          <View style={styles.workoutHeader}>
            <View style={styles.workoutIcon}>
              <Ionicons name="fitness-outline" size={22} color={colors.accentBlue} />
            </View>
            <Text style={styles.workoutTitle}>{MOCK_TODAY_WORKOUT.title}</Text>
          </View>
          <View style={styles.chipRow}>
            <Chip icon="time-outline" label={`${MOCK_TODAY_WORKOUT.durationMin} min`} />
            <Chip icon="flash-outline" label={translateIntensity(MOCK_TODAY_WORKOUT.intensity)} />
            <Chip icon="barbell-outline" label={`${MOCK_TODAY_WORKOUT.exercises.length} ex.`} />
          </View>

          {/* Lista compacta de exercícios — toque vai para ExerciseDetail */}
          <View style={styles.exercisesList}>
            {MOCK_TODAY_WORKOUT.exercises.slice(0, 3).map((we) => (
              <Pressable
                key={we.exercise.id}
                style={({ pressed }) => [styles.exRow, pressed && styles.exRowPressed]}
                onPress={() =>
                  navigation.navigate('ExerciseDetail', { exerciseId: we.exercise.id })
                }
              >
                <View style={styles.exIcon}>
                  <Ionicons name="ellipse" size={6} color={colors.accentBlue} />
                </View>
                <Text style={styles.exName}>{we.exercise.name}</Text>
                <Text style={styles.exMeta}>
                  {we.planned.sets}×{we.planned.reps}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
              </Pressable>
            ))}
            {MOCK_TODAY_WORKOUT.exercises.length > 3 && (
              <Text style={styles.moreText}>
                +{MOCK_TODAY_WORKOUT.exercises.length - 3} exercícios
              </Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={() => navigation.navigate('WorkoutSession')}
          >
            <Text style={styles.primaryButtonText}>INICIAR TREINO</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textPrimary} />
          </Pressable>
        </Card>

        {/* Card 3 — Atalhos Rápidos */}
        <Card>
          <SectionHeader title="Atalhos Rápidos" />
          <View style={styles.shortcutsRow}>
            <Shortcut
              icon="chatbubble-ellipses-outline"
              label="Chat"
              color={colors.accentBlue}
              onPress={() => navigation.getParent()?.navigate('Contact' as never)}
            />
            <Shortcut
              icon="medkit-outline"
              label="Relatar dor"
              color={colors.danger}
              onPress={() => navigation.navigate('ReportPain')}
            />
            <Shortcut
              icon="trophy-outline"
              label="Evolução"
              color={colors.warning}
              onPress={() => navigation.getParent()?.navigate('Progress' as never)}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Subcomponentes locais ────────────────────────────────────────────────────

function Header({ userName }: { userName: string }) {
  // getParent() acessa o navigator pai (o drawer) — `openDrawer` está nele.
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable style={styles.menuButton} onPress={openDrawer}>
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.greeting} numberOfLines={1}>
          Olá, {userName}! <Text style={styles.wave}>👋</Text>
        </Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function Stat({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: IoniconName;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={14} color={iconColor} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Chip({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function Shortcut({
  icon,
  label,
  color,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.shortcutItem} onPress={onPress}>
      <View style={[styles.shortcutIcon, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

function translateIntensity(i: string): string {
  return i === 'LOW' ? 'Leve' : i === 'HIGH' ? 'Intenso' : 'Média intensidade';
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  greeting: { flex: 1, color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  wave: { fontSize: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  summaryStats: { flex: 1, gap: 12 },
  stat: { gap: 4 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { color: colors.textSecondary, fontSize: 12 },
  statValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },

  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accentBlue}26`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },

  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.textSecondary, fontSize: 12 },

  exercisesList: { gap: 4, marginBottom: 14 },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  exRowPressed: { backgroundColor: colors.background },
  exIcon: { width: 14, alignItems: 'center' },
  exName: { flex: 1, color: colors.textPrimary, fontSize: 13 },
  exMeta: { color: colors.textSecondary, fontSize: 12 },
  moreText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
    paddingLeft: 6,
  },

  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentBlue,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonPressed: { opacity: 0.85 },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  shortcutsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  shortcutItem: { alignItems: 'center', gap: 6 },
  shortcutIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: '500' },
});
