import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { SectionHeader } from '@/components/SectionHeader';
import { MOCK_PROGRESS } from '@/services/mockData';
import { colors } from '@/types/theme';

// ProgressScreen — visão semanal de evolução do aluno.
// Em produção pegaria do `progressService.getWeekly()`; agora usa MOCK_PROGRESS.

export function ProgressScreen() {
  const navigation = useNavigation();
  const data = MOCK_PROGRESS;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.menuBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Evolução</Text>
          <View style={styles.menuBtn} />
        </View>

        <Card>
          <SectionHeader title="Resumo da semana" />
          <View style={styles.summaryRow}>
            <ProgressRing
              value={data.caloriesWeek}
              max={data.caloriesGoalWeek}
              label="kcal"
              size={120}
            />
            <View style={styles.stats}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>
                  {data.workoutsWeek}/{data.workoutsGoalWeek}
                </Text>
                <Text style={styles.statLabel}>Treinos</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>
                  {Math.round((data.caloriesWeek / data.caloriesGoalWeek) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Meta semanal</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <SectionHeader title="Calorias por dia" />
          <BarChart data={data.series} showValues />
        </Card>

        <Card>
          <SectionHeader title="Conquistas recentes" />
          <Achievement
            icon="flame"
            color={colors.accent}
            title="3 dias seguidos!"
            subtitle="Você treinou ter, qui e sex. Continue assim."
          />
          <Achievement
            icon="trending-up"
            color={colors.success}
            title="Carga +5kg no agachamento"
            subtitle="Comparado à semana passada."
          />
          <Achievement
            icon="trophy"
            color={colors.warning}
            title="Meta de cardio batida"
            subtitle="Você completou 60 min nesta semana."
          />
        </Card>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Achievement({
  icon,
  color,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.achievementRow}>
      <View style={[styles.achievementIcon, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.achievementText}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stats: { flex: 1, gap: 12 },
  statBlock: { gap: 2 },
  statValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 12 },

  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementText: { flex: 1 },
  achievementTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  achievementSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  spacer: { height: 24 },
});
