import { useNavigation } from '@react-navigation/native';
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

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { PainSeverity } from '@/types/domain';
import { colors } from '@/types/theme';

// ReportPainScreen — aluno relata dor/desconforto ao personal.
// Severidade selecionada via 3 botões (leve / moderada / grave).

const severities: { value: PainSeverity; label: string; color: string }[] = [
  { value: 'MILD', label: 'Leve', color: colors.success },
  { value: 'MODERATE', label: 'Moderada', color: colors.warning },
  { value: 'SEVERE', label: 'Grave', color: colors.danger },
];

export function ReportPainScreen() {
  const navigation = useNavigation();
  const [bodyPart, setBodyPart] = useState('');
  const [severity, setSeverity] = useState<PainSeverity>('MILD');
  const [notes, setNotes] = useState('');

  const onSubmit = () => {
    // TODO: POST /health-feedback
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Relatar dor</Text>
          <Text style={styles.subtitle}>
            Compartilhe com seu personal qualquer desconforto sentido durante ou após o treino.
          </Text>

          <TextField
            label="ONDE DOEU"
            icon="body-outline"
            placeholder="Ex: joelho direito, lombar..."
            value={bodyPart}
            onChangeText={setBodyPart}
            autoCapitalize="sentences"
          />

          <Text style={styles.sectionLabel}>INTENSIDADE</Text>
          <View style={styles.severityRow}>
            {severities.map((s) => {
              const active = severity === s.value;
              return (
                <Pressable
                  key={s.value}
                  style={[
                    styles.severityBtn,
                    active && { backgroundColor: `${s.color}26`, borderColor: s.color },
                  ]}
                  onPress={() => setSeverity(s.value)}
                >
                  <View style={[styles.severityDot, { backgroundColor: s.color }]} />
                  <Text
                    style={[styles.severityLabel, active && { color: colors.textPrimary }]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextField
            label="OBSERVAÇÕES (OPCIONAL)"
            placeholder="Descreva o que sentiu..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            autoCapitalize="sentences"
          />

          <PrimaryButton
            label="ENVIAR RELATO"
            icon="send"
            onPress={onSubmit}
            disabled={!bodyPart.trim()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: 16, gap: 16 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 4 },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  severityRow: { flexDirection: 'row', gap: 10 },
  severityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  severityDot: { width: 10, height: 10, borderRadius: 5 },
  severityLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
});
