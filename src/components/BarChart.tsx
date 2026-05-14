import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/types/theme';

// BarChart — mini gráfico de barras feito SÓ com Views (sem react-native-svg).
//
// Por que evitar SVG aqui:
// - Adicionar `react-native-svg` exige rebuild nativo (Expo precisa do prebuild
//   ou usar Expo Go que já tem). Pra um chart simples, é overkill.
// - View + height proporcional + flex layout dá conta de barras verticais.
//
// Quando algum dia precisar de área, linha curva, eixos com ticks, aí sim
// instalamos `react-native-svg` + `victory-native` ou `react-native-gifted-charts`.
//
// Comparação Angular: equivale a fazer um gráfico simples com CSS Grid no
// lugar de chamar D3/ngx-charts. Suficiente pra dashboard interno.

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
  // Se true, mostra o valor numérico em cima da barra
  showValues?: boolean;
}

export function BarChart({
  data,
  height = 140,
  barColor = colors.accentBlue,
  showValues,
}: BarChartProps) {
  // Encontra o maior valor da série para normalizar as alturas em %.
  // Se todos forem 0 (semana sem treinos), usa 1 pra evitar divisão por zero.
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <View style={[styles.container, { height: height + 24 }]}>
      <View style={[styles.barsRow, { height }]}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          const isEmpty = d.value === 0;
          return (
            <View key={d.label} style={styles.barColumn}>
              {showValues && !isEmpty && (
                <Text style={styles.value}>{formatValue(d.value)}</Text>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${pct}%`,
                      backgroundColor: isEmpty ? colors.border : barColor,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d) => (
          <Text key={d.label} style={styles.label}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function formatValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // mínimo 2 para barras com valor>0 não sumirem
    minHeight: 2,
  },
  value: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 4,
  },
  label: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
});
