import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { colors } from '@/types/theme';

// AuthStack — fluxo de telas pré-login (Login / Cadastro).
// Fica fora do drawer: telas inteiras, sem menu lateral.
// O RootNavigator escolhe entre AuthStack e AppDrawer baseado em `isAuthenticated`.

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        // Transição: slide horizontal entre login/cadastro (default já é esse no iOS,
        // forçamos no Android para uniformizar)
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
