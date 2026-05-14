import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/types/theme';

// PrimaryButton — botão CTA do app. Centraliza o visual do "INICIAR TREINO",
// "ENTRAR", "CADASTRAR", etc. Quem precisar de outro estilo (secundário, ghost)
// pode passar `variant` ou criar um SecondaryButton irmão depois.
//
// Estado loading: bloqueia clique e mostra spinner. Útil para botões de form
// que disparam request async (login, cadastro).

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  icon?: IoniconName;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  loading,
  disabled,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <View style={styles.row}>
          <Text style={[styles.label, variant === 'ghost' && styles.labelGhost]}>{label}</Text>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'ghost' ? colors.accentBlue : colors.textPrimary}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelGhost: { color: colors.accentBlue },
});

// Object lookup por variant — evita if/else encadeado no JSX
const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.accentBlue },
  secondary: { backgroundColor: colors.primaryLight },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accentBlue },
});
