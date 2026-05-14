import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { AppDrawer } from '@/navigation/AppDrawer';
import { AuthStack } from '@/navigation/AuthStack';
import { PersonalDrawer } from '@/navigation/PersonalDrawer';
import { SplashScreen } from '@/screens/SplashScreen';
import { useAuthStore } from '@/store/authStore';

// RootNavigator — topo lógico da navegação. Decide entre 3 fluxos:
//
//   1. SPLASH  — enquanto o authStore lê o token do AsyncStorage
//   2. AUTH    — sem usuário logado: AuthStack (Login / Register)
//   3. APP     — usuário logado: AppDrawer (aluno) OU PersonalDrawer (personal)
//
// Conceito-chave: trocar de stack inteiro ao mudar de auth state DESMONTA o
// stack antigo. Isso garante que após login você não tenha mais a tela de
// login no histórico de back, e ao deslogar não fica o app em memória.

type RootStackParamList = {
  // Cada uma dessas rotas é um "fluxo" inteiro. Renderizamos só UMA por vez.
  Auth: undefined;
  StudentApp: undefined;
  PersonalApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  // Seletores granulares: o navigator só re-renderiza se hydrated/user mudarem.
  // Em Zustand isso é o equivalente do `select` do NgRx — evita re-render do
  // mundo todo quando algo unrelated (ex: error) muda no store.
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrate);

  // useEffect com array vazio = "rodar uma vez no mount". Equivale a um
  // ngOnInit do componente raiz. Disparamos a hidratação do storage aqui.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return <SplashScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user.role === 'PERSONAL' ? (
        <Stack.Screen name="PersonalApp" component={PersonalDrawer} />
      ) : (
        <Stack.Screen name="StudentApp" component={AppDrawer} />
      )}
    </Stack.Navigator>
  );
}
