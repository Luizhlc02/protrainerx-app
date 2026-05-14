import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { MOCK_HEALTH_FEEDBACK, MOCK_STUDENTS } from '@/services/mockData';
import { useUser } from '@/store/authStore';
import { colors } from '@/types/theme';

// DashboardScreen — visão geral do personal: KPIs, alertas de saúde, próximos
// treinos. É a "Home" do perfil PERSONAL.

const WEEK_SERIES = [
  { label: 'Seg', value: 8 },
  { label: 'Ter', value: 5 },
  { label: 'Qua', value: 9 },
  { label: 'Qui', value: 12 },
  { label: 'Sex', value: 7 },
  { label: 'Sáb', value: 3 },
  { label: 'Dom', value: 0 },
];

export function DashboardScreen() {
  const user = useUser();
  const navigation = useNavigation();
  const studentsCount = MOCK_STUDENTS.length;
  const painAlerts = MOCK_HEALTH_FEEDBACK.length;

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
          <View style={styles.headerCenter}>
            <Text style={styles.hello}>Olá, {user?.name}!</Text>
            <Text style={styles.headerSub}>Vamos acompanhar seus alunos hoje?</Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <Kpi
            icon="people-outline"
            color={colors.accentBlue}
            value={String(studentsCount)}
            label="Alunos ativos"
          />
          <Kpi
            icon="fitness-outline"
            color={colors.success}
            value="12"
            label="Treinos hoje"
          />
          <Kpi
            icon="medkit-outline"
            color={colors.danger}
            value={String(painAlerts)}
            label="Alertas saúde"
          />
        </View>

        <Card>
          <SectionHeader title="Treinos completados na semana" />
          <BarChart data={WEEK_SERIES} barColor={colors.accentBlue} showValues />
        </Card>

        <Card>
          <SectionHeader title="ALERTAS DE SAÚDE" small />
          {MOCK_HEALTH_FEEDBACK.length === 0 ? (
            <Text style={styles.empty}>Nenhum alerta no momento.</Text>
          ) : (
            MOCK_HEALTH_FEEDBACK.map((f) => {
              const student = MOCK_STUDENTS.find((s) => s.id === f.studentId);
              return (
                <View key={f.id} style={styles.alertRow}>
                  <View
                    style={[
                      styles.alertDot,
                      { backgroundColor: severityColor(f.severity) },
                    ]}
                  />
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertTitle}>
                      {student?.name ?? 'Aluno'} · {f.bodyPart}
                    </Text>
                    {!!f.notes && <Text style={styles.alertNote}>{f.notes}</Text>}
                  </View>
                  <Text style={styles.severityText}>{severityLabel(f.severity)}</Text>
                </View>
              );
            })
          )}
        </Card>

        <Card>
          <SectionHeader title="Ações rápidas" />
          <View style={styles.actionsRow}>
            <ActionTile
              icon="add-circle-outline"
              color={colors.accentBlue}
              label="Novo treino"
            />
            <ActionTile
              icon="person-add-outline"
              color={colors.success}
              label="Convidar aluno"
            />
            <ActionTile
              icon="calendar-outline"
              color={colors.warning}
              label="Agenda"
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Kpi({
  icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.kpi}>
      <View style={[styles.kpiIcon, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function ActionTile({
  icon,
  color,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  label: string;
}) {
  return (
    <Pressable style={styles.actionTile}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function severityLabel(s: string): string {
  return s === 'MILD' ? 'Leve' : s === 'MODERATE' ? 'Moderada' : 'Grave';
}

function severityColor(s: string): string {
  return s === 'MILD' ? colors.success : s === 'MODERATE' ? colors.warning : colors.danger;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
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
  headerCenter: { flex: 1 },
  hello: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  headerSub: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  kpiRow: { flexDirection: 'row', gap: 10 },
  kpi: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  kpiLabel: { color: colors.textSecondary, fontSize: 11 },

  empty: { color: colors.textSecondary, fontSize: 13, paddingVertical: 8 },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertInfo: { flex: 1 },
  alertTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  alertNote: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  severityText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  actionTile: { alignItems: 'center', gap: 6, flex: 1 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: { color: colors.textPrimary, fontSize: 11, fontWeight: '500' },
});
