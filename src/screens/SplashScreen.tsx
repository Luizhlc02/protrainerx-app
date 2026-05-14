import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/types/theme';

// Splash mostrado enquanto o authStore hidrata (lê token do AsyncStorage).
// Sem isso, o app pisca a tela de login mesmo quando o usuário já estava logado.
// Tempo médio de hidratação: <100ms — é só para evitar o flash visual.

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>PT</Text>
      </View>
      <Text style={styles.title}>protrainerx</Text>
      <ActivityIndicator color={colors.accentBlue} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: colors.textPrimary, fontSize: 30, fontWeight: '800' },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  spinner: { marginTop: 12 },
});
