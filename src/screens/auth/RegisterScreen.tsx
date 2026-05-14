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
import type { AuthStackParamList } from '@/navigation/AuthStack';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/domain';
import { colors } from '@/types/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// RegisterScreen — formulário de cadastro com seletor de perfil.
//
// Decisão: o role é escolhido aqui na tela (segmented control "ALUNO"/"PERSONAL").
// Em produção o personal trainer provavelmente teria fluxo separado (com
// código de convite, validação manual), mas para o MVP do front esse seletor
// permite testar os dois fluxos sem precisar de email mágico.

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');

  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const onSubmit = async () => {
    try {
      await register({ name: name.trim(), email: email.trim(), password, role });
    } catch {
      /* erro fica no store */
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Comece sua jornada com a gente.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.roleSwitch}>
              <RoleOption
                label="ALUNO"
                active={role === 'STUDENT'}
                onPress={() => setRole('STUDENT')}
              />
              <RoleOption
                label="PERSONAL"
                active={role === 'PERSONAL'}
                onPress={() => setRole('PERSONAL')}
              />
            </View>

            <TextField
              label="NOME"
              icon="person-outline"
              placeholder="Seu nome"
              autoCapitalize="words"
              autoCorrect
              value={name}
              onChangeText={setName}
            />
            <TextField
              label="EMAIL"
              icon="mail-outline"
              placeholder="seu@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="SENHA"
              icon="lock-closed-outline"
              placeholder="Mínimo 6 caracteres"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            {!!error && <Text style={styles.errorBanner}>{error}</Text>}

            <PrimaryButton
              label="CADASTRAR"
              icon="arrow-forward"
              onPress={onSubmit}
              loading={loading}
              disabled={!name || !email || password.length < 6}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta?</Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Entrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RoleOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.roleOption, active && styles.roleOptionActive]}
      onPress={onPress}
    >
      <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },
  header: { gap: 4, marginTop: 16 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
  form: { gap: 14 },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleOptionActive: { backgroundColor: colors.accentBlue },
  roleLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  roleLabelActive: { color: colors.textPrimary },
  errorBanner: {
    backgroundColor: `${colors.danger}22`,
    color: colors.danger,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  link: { color: colors.accentBlue, fontSize: 14, fontWeight: '700' },
});
