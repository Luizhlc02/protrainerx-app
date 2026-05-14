import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionHeader } from '@/components/SectionHeader';
import {
  MOCK_HEALTH_FEEDBACK,
  MOCK_PROGRESS,
  MOCK_STUDENTS,
} from '@/services/mockData';
import { colors } from '@/types/theme';
import type { PersonalStackParamList } from '@/navigation/PersonalStack';

type DetailRoute = RouteProp<PersonalStackParamList, 'StudentDetail'>;

export function StudentDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { studentId } = route.params;

  const student = MOCK_STUDENTS.find((s) => s.id === studentId);
  const feedback = MOCK_HEALTH_FEEDBACK.filter((f) => f.studentId === studentId);

  if (!student) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.empty}>Aluno não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.email}>{student.email}</Text>
        </View>

        <View style={styles.actionRow}>
          <PrimaryButton label="MONTAR TREINO" icon="barbell" onPress={() => {}} />
        </View>

        <Card>
          <SectionHeader title="Evolução (últ. 7 dias)" />
          <BarChart data={MOCK_PROGRESS.series} showValues />
        </Card>

        <Card>
          <SectionHeader title="Histórico de saúde" />
          {feedback.length === 0 ? (
            <Text style={styles.muted}>Nenhum relato de dor registrado.</Text>
          ) : (
            feedback.map((f) => (
              <View key={f.id} style={styles.feedbackRow}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
                <View style={styles.feedbackInfo}>
                  <Text style={styles.feedbackTitle}>{f.bodyPart}</Text>
                  {!!f.notes && <Text style={styles.feedbackNote}>{f.notes}</Text>}
                  <Text style={styles.feedbackTime}>
                    {new Date(f.reportedAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <Card>
          <SectionHeader title="Treinos da semana" />
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>4/5</Text>
              <Text style={styles.metricLabel}>Concluídos</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>92%</Text>
              <Text style={styles.metricLabel}>Aderência</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>+8kg</Text>
              <Text style={styles.metricLabel}>Carga total</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },

  profileHeader: { alignItems: 'center', gap: 4, marginVertical: 8 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarText: { color: colors.textPrimary, fontSize: 32, fontWeight: '800' },
  name: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: 13 },

  actionRow: { gap: 10 },

  muted: { color: colors.textSecondary, fontSize: 13 },
  feedbackRow: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
  feedbackInfo: { flex: 1 },
  feedbackTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  feedbackNote: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  feedbackTime: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },

  metricRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center', gap: 4 },
  metricValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  metricLabel: { color: colors.textSecondary, fontSize: 11 },

  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
