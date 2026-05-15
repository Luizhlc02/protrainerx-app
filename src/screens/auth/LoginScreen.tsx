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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// LoginScreen — única porta de entrada do app.
//
// Decisão (cap. 12 do AULA.md, 2026-05-14): o app não tem cadastro. O usuário
// escolhe o perfil (Aluno / Personal) aqui mesmo e o role vai no payload de
// login para o backend validar.
//
// Conceitos novos para quem vem de Angular:
// - `useState` no lugar de variáveis no controller. Cada `set` re-renderiza o
//   componente (sem `ngModel`/Zone.js — é explícito).
// - `KeyboardAvoidingView` resolve o problema do teclado tampar o input.
// - O store é injetado via hook (`useAuthStore`) — equivale a injetar um
//   service no construtor, mas chamado dentro da função.

export function LoginScreen(_: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Default = aluno (perfil de maior volume). Personal tem que trocar.
  const [role, setRole] = useState<UserRole>('STUDENT');

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const onSubmit = async () => {
    try {
      await login({ email: email.trim(), password, role });
      // Sucesso: o RootNavigator reage ao state e troca para o Drawer certo.
    } catch {
      // Erro fica no store (state.error). UI mostra abaixo.
    }
  };

  const resetErrorOnEdit = () => {
    if (error) clearError();
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
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>PT</Text>
            </View>
            <Text style={styles.title}>protrainerx</Text>
            <Text style={styles.subtitle}>Seu treino, sua evolução.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.roleHeader}>Entrar como</Text>
            <View style={styles.roleSwitch}>
              <RoleOption
                label="ALUNO"
                active={role === 'STUDENT'}
                onPress={() => {
                  setRole('STUDENT');
                  resetErrorOnEdit();
                }}
              />
              <RoleOption
                label="PERSONAL"
                active={role === 'PERSONAL'}
                onPress={() => {
                  setRole('PERSONAL');
                  resetErrorOnEdit();
                }}
              />
            </View>

            <TextField
              label="EMAIL"
              icon="mail-outline"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                resetErrorOnEdit();
              }}
            />
            <TextField
              label="SENHA"
              icon="lock-closed-outline"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                resetErrorOnEdit();
              }}
            />

            {!!error && <Text style={styles.errorBanner}>{error}</Text>}

            <PrimaryButton
              label="ENTRAR"
              icon="arrow-forward"
              onPress={onSubmit}
              loading={loading}
              disabled={!email || !password}
            />

            <Pressable>
              <Text style={styles.linkMuted}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Acesso liberado após a assinatura da plataforma — sua conta foi
              criada com o e-mail informado no cadastro.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Botão único do segmented control. Visual: pílula azul quando ativo, texto
// suave quando inativo. Pressable é o equivalente RN do <button> — recebe
// `onPress` (não `onClick`) e estiliza por estado.
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
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
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
    gap: 32,
  },
  brand: { alignItems: 'center', gap: 8, marginTop: 40 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  form: { gap: 14 },
  roleHeader: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: -6,
  },
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
  linkMuted: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  hint: {
    backgroundColor: `${colors.accentBlue}1A`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    marginTop: 'auto',
  },
  hintText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
