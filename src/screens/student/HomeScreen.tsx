import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { colors } from '@/types/theme';

// Mocks: dados que depois virão do backend (workoutService + authStore).
// Manter como const no topo do arquivo torna óbvio "isso aqui é fake e
// vai ser substituído". Em Angular, equivale àqueles `const MOCK_USER` que
// se vê em testes ou em service que ainda não tem implementação real.
const MOCK_USER = { name: 'Rafael' };
const MOCK_TODAY = {
  caloriesGoal: 15000,
  caloriesDone: 12450,
  weightGoal: 2500,
  weightDone: 2100,
};
const MOCK_WORKOUT = {
  title: 'Perna & Cardio',
  durationMin: 60,
  intensity: 'Média Intensidade',
};

export function HomeScreen() {
  return (
    // SafeAreaView respeita o "notch", barra de status e indicador home do iPhone.
    // `edges={['top']}` pede que ele respeite SÓ a borda superior — embaixo a
    // bottom tab (quando existir) já cuida do indicador home. Sem isso, o "Olá"
    // ficaria por trás da hora/bateria do sistema.
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ScrollView: container que rola verticalmente. RN não tem overflow:auto
          como CSS — você escolhe explicitamente entre View (não rola) e
          ScrollView (rola). Para listas grandes, FlatList é mais performante,
          mas aqui temos poucos cards fixos, então ScrollView serve. */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header userName={MOCK_USER.name} />

        {/* Card 1 — Resumo do Dia */}
        <Card>
          <SectionHeader title="Resumo do Dia" />
          <View style={styles.summaryRow}>
            <RingPlaceholder value={MOCK_TODAY.caloriesDone.toLocaleString('pt-BR')} />
            <View style={styles.summaryStats}>
              <Stat
                icon="barbell-outline"
                iconColor={colors.accentBlue}
                label="Treinos"
                value={`${MOCK_TODAY.caloriesDone.toLocaleString('pt-BR')}/15k`}
              />
              <Stat
                icon="flame-outline"
                iconColor={colors.accent}
                label="Calorias"
                value={`${MOCK_TODAY.weightDone.toLocaleString('pt-BR')}/2,5k`}
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
            <Text style={styles.workoutTitle}>{MOCK_WORKOUT.title}</Text>
          </View>
          <View style={styles.chipRow}>
            <Chip icon="time-outline" label={`${MOCK_WORKOUT.durationMin} min`} />
            <Chip icon="flash-outline" label={MOCK_WORKOUT.intensity} />
          </View>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={() => {
              // TODO: navegar para a tela de execução do treino
              console.log('iniciar treino');
            }}
          >
            <Text style={styles.primaryButtonText}>INICIAR TREINO</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textPrimary} />
          </Pressable>
        </Card>

        {/* Card 3 — Evolução Semanal */}
        <Card>
          <SectionHeader title="Evolução Semanal" />
          <View style={styles.chartPlaceholder}>
            <Ionicons name="trending-up" size={28} color={colors.accentBlue} />
            <Text style={styles.placeholderText}>Gráfico em breve</Text>
          </View>
        </Card>

        {/* Card 4 — Atalhos Rápidos */}
        <Card>
          <SectionHeader title="Atalhos Rápidos" />
          <View style={styles.shortcutsRow}>
            <Shortcut icon="chatbubble-ellipses-outline" label="Chat" color={colors.accentBlue} />
            <Shortcut icon="nutrition-outline" label="Nutrição" color={colors.success} />
            <Shortcut icon="trophy-outline" label="Metas" color={colors.warning} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Subcomponentes locais ────────────────────────────────────────────────────
// Definidos no MESMO arquivo porque são usados só aqui. Se algum dia outro
// screen precisar de Stat/Chip/Shortcut, mudo para src/components/.
// Essa é a regra empírica: extrair quando reusa, não antes ("regra dos 3").

function Header({ userName }: { userName: string }) {
  // useNavigation: hook que dá acesso ao objeto de navegação da tela atual,
  // sem precisar receber via props. DrawerActions.openDrawer() é uma "ação"
  // dispatch-style — funciona mesmo se o drawer estiver aninhado em qualquer
  // nível acima desta tela.
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable style={styles.menuButton} onPress={openDrawer}>
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.greeting}>
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

// Tipa o nome do ícone aproveitando os tipos do próprio @expo/vector-icons —
// assim o autocomplete só sugere ícones que realmente existem no Ionicons.
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
}: {
  icon: IoniconName;
  label: string;
  color: string;
}) {
  return (
    <Pressable style={styles.shortcutItem}>
      {/* Truque de transparência: `${color}26` adiciona alpha hex (~15%) à cor.
          Resultado: círculo do mesmo tom do ícone, mas bem suave. */}
      <View style={[styles.shortcutIcon, { backgroundColor: `${color}26` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

function RingPlaceholder({ value }: { value: string }) {
  // Placeholder do anel circular. O anel real exige react-native-svg + math
  // (calcular strokeDashoffset proporcional ao progresso). Vamos fazer numa
  // próxima sessão. Por agora: círculo simples com borda, mantém o layout.
  return (
    <View style={styles.ring}>
      <Text style={styles.ringValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// Todos os estilos no fim do arquivo. Convenção comum em RN: mantém o JSX
// no topo (mais lido), estilos embaixo (menos lidos). Em projetos maiores
// alguns times extraem para um arquivo .styles.ts irmão.

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
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
  greeting: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  wave: {
    fontSize: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // RN suporta `gap` desde 0.71 — antes era marginRight em cada filho
  },
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
  avatarText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    borderColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryStats: {
    flex: 1,
    gap: 12,
  },
  stat: {
    gap: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

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
  workoutTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999, // 999 = "pill shape", evita math se altura mudar
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
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
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  chartPlaceholder: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shortcutItem: {
    alignItems: 'center',
    gap: 6,
  },
  shortcutIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
});
