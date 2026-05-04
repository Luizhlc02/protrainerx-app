import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { colors } from '@/types/theme';

// Tema do React Navigation: ele tem cores próprias para header/border/etc.
// Em vez de aceitar o DarkTheme cru, sobrescrevemos com nossa paleta para
// o navigator (header, tab bar, etc.) usar as MESMAS cores do resto do app.
const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function App() {
  return (
    // GestureHandlerRootView precisa envelopar TUDO para gestos funcionarem
    // (swipe-to-go-back nativo, drag em listas, etc.). É equivalente a
    // garantir que o BrowserAnimationsModule esteja no AppModule do Angular.
    // Ordem dos providers (de fora para dentro):
    //  1. GestureHandlerRootView — gestos (swipe back, drag, etc.)
    //  2. SafeAreaProvider — fornece os insets de notch/status/home bar para
    //     o <SafeAreaView> usado nas telas
    //  3. NavigationContainer — contexto do React Navigation
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
          {/* StatusBar style="light" deixa os ícones do sistema (hora, bateria)
              em branco, contrastando com nosso fundo escuro. */}
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
