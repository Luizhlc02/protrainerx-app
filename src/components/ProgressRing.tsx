import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/types/theme';

// ProgressRing — anel circular de progresso simulado com 2 Views sobrepostas.
//
// IMPORTANTE: este é um placeholder "convincente" — o anel REAL com arco
// proporcional ao progresso exige SVG (calcular strokeDashoffset). Aqui temos
// um anel cheio que muda a cor da borda em função do progresso:
// - <30% → cinza (longe da meta)
// - 30-70% → amarelo (no caminho)
// - >70% → azul/verde (perto/atingiu)
//
// O número grande no centro mostra o progresso real, então funcionalmente o
// usuário vê o quanto falta. Visualmente fica menos preciso que um anel real,
// mas evita a dependência nativa.
//
// Quando substituirmos por anel real, troca-se só este componente — a API
// (props value / max / label) permanece igual.

interface ProgressRingProps {
  // valor atual (ex: calorias feitas hoje)
  value: number;
  // meta (ex: meta diária de calorias)
  max: number;
  // label embaixo do valor (ex: "kcal")
  label?: string;
  size?: number;
  thickness?: number;
}

export function ProgressRing({
  value,
  max,
  label,
  size = 110,
  thickness = 8,
}: ProgressRingProps) {
  const ratio = max === 0 ? 0 : Math.min(1, value / max);
  const color = ratio >= 0.7 ? colors.accentBlue : ratio >= 0.3 ? colors.warning : colors.border;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: color,
        },
      ]}
    >
      <Text style={styles.value}>{formatNumber(value)}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.goal}>de {formatNumber(max)}</Text>
    </View>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString('pt-BR');
}

const styles = StyleSheet.create({
  ring: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  label: { color: colors.textSecondary, fontSize: 11 },
  goal: { color: colors.textSecondary, fontSize: 10, marginTop: 2 },
});
