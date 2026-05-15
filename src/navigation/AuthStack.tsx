import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/auth/LoginScreen';
import { colors } from '@/types/theme';

// AuthStack — fluxo de telas pré-login.
//
// Decisão (cap. 12 do AULA.md, 2026-05-14): o app NÃO tem cadastro. O
// onboarding (assinatura + criação da conta no backend) acontece fora do app.
// Por enquanto o Stack tem apenas a tela de Login; mantemos o Stack (em vez
// de renderizar LoginScreen direto) porque futuramente entrarão rotas como
// `ForgotPassword` e `ChangePassword` (primeiro login obriga troca de senha).

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
