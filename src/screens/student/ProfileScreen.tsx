import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/types/theme';

// ProfileScreen — perfil do usuário logado (aluno OU personal).
// Mostra avatar, nome, email, role e botão de logout.

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null; // teoricamente impossível chegar aqui sem user

  const initial = user.name.charAt(0).toUpperCase();
  const roleLabel = user.role === 'PERSONAL' ? 'Personal trainer' : 'Aluno';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={user.role === 'PERSONAL' ? 'ribbon-outline' : 'person-outline'}
              size={14}
              color={colors.accentBlue}
            />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Conta</Text>
          <ProfileRow icon="person-circle-outline" label="Editar perfil" />
          <ProfileRow icon="notifications-outline" label="Notificações" />
          <ProfileRow icon="lock-closed-outline" label="Alterar senha" />
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Sobre</Text>
          <ProfileRow icon="help-circle-outline" label="Ajuda" />
          <ProfileRow icon="document-text-outline" label="Termos de uso" />
          <ProfileRow icon="information-circle-outline" label="Versão 1.0.0 (MVP)" />
        </Card>

        <PrimaryButton label="SAIR" icon="log-out-outline" variant="ghost" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },
  header: { alignItems: 'center', gap: 6, marginVertical: 12 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarText: { color: colors.textPrimary, fontSize: 36, fontWeight: '800' },
  name: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: 13 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${colors.accentBlue}1A`,
    borderRadius: 999,
    marginTop: 6,
  },
  roleText: { color: colors.accentBlue, fontSize: 12, fontWeight: '600' },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  rowLabel: { flex: 1, color: colors.textPrimary, fontSize: 14 },
});
