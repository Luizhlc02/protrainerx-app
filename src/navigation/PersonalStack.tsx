import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StudentDetailScreen } from '@/screens/personal/StudentDetailScreen';
import { StudentListScreen } from '@/screens/personal/StudentListScreen';
import { colors } from '@/types/theme';

// PersonalStack — pilha interna da seção "Alunos" do personal.
// Lista → Detalhe do aluno.

export type PersonalStackParamList = {
  StudentList: undefined;
  StudentDetail: { studentId: string };
};

const Stack = createNativeStackNavigator<PersonalStackParamList>();

export function PersonalStudentsStack() {
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
        name="StudentList"
        component={StudentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: 'Aluno' }}
      />
    </Stack.Navigator>
  );
}
