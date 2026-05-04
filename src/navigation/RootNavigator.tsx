import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppDrawer } from '@/navigation/AppDrawer';
import { colors } from '@/types/theme';

// Stack root abriga "fluxos" inteiros — hoje só o App (com drawer dentro).
// Quando o login existir, vai virar:
//   isLoggedIn ? <Stack.Screen name="App" component={AppDrawer} />
//              : <Stack.Screen name="Auth" component={AuthStack} />
export type RootStackParamList = {
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name="App" component={AppDrawer} />
    </Stack.Navigator>
  );
}
