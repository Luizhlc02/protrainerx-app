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
import { colors } from '@/types/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// LoginScreen — formulário de entrada.
//
// Conceitos novos para quem vem de Angular:
//
// - `useState` no lugar de variáveis no controller. Cada `set` re-renderiza
//   o componente (zero magia tipo `ngModel`/Zone.js — é explícito).
// - `KeyboardAvoidingView` resolve o problema do teclado tampar o input.
//   No web/Angular você não precisa disso; no mobile é obrigatório.
// - O store é injetado via hook (`useAuthStore`) — equivale a injetar um
//   service no construtor, mas chamado dentro da função.

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const onSubmit = async () => {
    try {
      await login({ email: email.trim(), password });
      // Sucesso: o RootNavigator vai reagir ao state e mostrar o AppDrawer
    } catch {
      // Erro já está no store (state.error). UI mostra abaixo.
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* KeyboardAvoidingView: no iOS empurra a tela quando o teclado aparece.
          No Android o sistema cuida disso via softInputMode, mas o behavior
          'height' funciona em ambos para nosso layout. */}
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
            <TextField
              label="EMAIL"
              icon="mail-outline"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) clearError();
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
                if (error) clearError();
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Cadastre-se</Text>
            </Pressable>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              💡 Dica de teste: use email começando com {'"p@"'} para entrar como personal.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  link: { color: colors.accentBlue, fontSize: 14, fontWeight: '700' },
  hint: {
    backgroundColor: `${colors.accentBlue}1A`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  hintText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
