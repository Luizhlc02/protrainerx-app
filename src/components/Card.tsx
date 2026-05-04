import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/types/theme';

// Componente "wrapper" que aplica o visual padrão de card flutuante.
// Em Angular você criaria um <app-card> com <ng-content></ng-content> —
// aqui o equivalente é receber `children` como prop e renderizar dentro do View.
//
// `style` opcional permite que cada uso ajuste/sobreponha (ex: marginTop extra).
type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: Props) {
  // O array em `style` é como o `[ngClass]` / `[ngStyle]`: a ordem importa,
  // estilos posteriores sobrescrevem propriedades dos anteriores.
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
