import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ExerciseDetailScreen } from '@/screens/student/ExerciseDetailScreen';
import { HomeScreen } from '@/screens/student/HomeScreen';
import { ReportPainScreen } from '@/screens/student/ReportPainScreen';
import { WorkoutSessionScreen } from '@/screens/student/WorkoutSessionScreen';
import { colors } from '@/types/theme';

// StudentHomeStack — pilha de navegação interna do "Início" do aluno.
//
// Diferente do drawer que troca entre seções top-level, o stack tem semântica
// de "drill down": Home → Detalhe → Detalhe do detalhe. Cada `navigation.navigate`
// empilha; `goBack` desempilha (com botão de voltar e swipe nativo de graça).
//
// Por que aninhar Stack dentro do Drawer?
// - Drawer = lateral, escolhe seções
// - Stack = vertical de telas, permite navegar para sub-telas mantendo o
//   contexto da seção atual

export type StudentHomeStackParamList = {
  Home: undefined;
  // route.params digitados: TypeScript reclama se você esquecer `exerciseId`
  ExerciseDetail: { exerciseId: string };
  WorkoutSession: undefined;
  ReportPain: undefined;
};

const Stack = createNativeStackNavigator<StudentHomeStackParamList>();

export function StudentHomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: 'Exercício' }}
      />
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{ title: 'Treino do dia' }}
      />
      <Stack.Screen
        name="ReportPain"
        component={ReportPainScreen}
        options={{ title: 'Relatar dor' }}
      />
    </Stack.Navigator>
  );
}
