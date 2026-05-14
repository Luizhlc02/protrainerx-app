import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors } from '@/types/theme';

// TextField — wrapper visual para TextInput com label, ícone à esquerda e
// suporte opcional a campo de senha (com toggle de visibilidade).
//
// Por que extrair em componente?
// - O design do app usa esse mesmo input em vários lugares (login, cadastro,
//   formulários de registro de treino, etc.). DRY.
// - Centralizar a borda, padding e cores aqui evita drift visual.
//
// Comparação Angular: equivale a um <app-text-field> standalone que envolve
// <input matInput> com label/erro/ícone.

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = TextInputProps & {
  label?: string;
  icon?: IoniconName;
  error?: string;
  // Se true, mostra botão de "olho" para alternar visibilidade
  isPassword?: boolean;
};

export function TextField({
  label,
  icon,
  error,
  isPassword,
  style,
  ...inputProps
}: Props) {
  // Estado local para controlar visibilidade da senha. Só usado quando isPassword=true.
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, !!error && styles.inputRowError]}>
        {icon && <Ionicons name={icon} size={18} color={colors.textSecondary} />}
        <TextInput
          // Defaults úteis para inputs em fundo escuro: cor de texto branca,
          // placeholder cinza, sem auto-capitalize/correct em campos técnicos.
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
          secureTextEntry={isPassword && !visible}
          style={[styles.input, style]}
        />
        {isPassword && (
          <Pressable hitSlop={8} onPress={() => setVisible((v) => !v)}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRowError: { borderColor: colors.danger },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0, // alguns devices Android adicionam padding default
  },
  errorText: { color: colors.danger, fontSize: 12 },
});
