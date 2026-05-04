import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/types/theme';

// Cabeçalho repetido em todos os cards: "Título + chevron à direita".
// `small` muda o estilo para o variante "TREINO DE HOJE" (label maiúsculo,
// menor, cinza) que aparece na 2ª seção do design.
//
// `onPress` é opcional — o chevron sugere navegabilidade, mas nem todo
// header navega para algo agora; só vira clicável se receber a prop.
type Props = {
  title: string;
  small?: boolean;
  onPress?: () => void;
};

export function SectionHeader({ title, small, onPress }: Props) {
  const content = (
    <View style={styles.row}>
      <Text style={[styles.title, small && styles.titleSmall]}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </View>
  );

  // Pressable é a primitiva moderna para "qualquer coisa clicável" em RN.
  // Substitui o antigo TouchableOpacity. Equivale a colocar (click) num <div>
  // do Angular — só que com feedback visual de toque embutido (ripple no Android).
  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  titleSmall: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
