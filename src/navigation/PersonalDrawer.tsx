import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersonalStudentsStack } from '@/navigation/PersonalStack';
import { DashboardScreen } from '@/screens/personal/DashboardScreen';
import { WorkoutBuilderScreen } from '@/screens/personal/WorkoutBuilderScreen';
import { ProfileScreen } from '@/screens/student/ProfileScreen';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/types/theme';

// PersonalDrawer — drawer do perfil PERSONAL.
// Itens: Dashboard, Alunos (stack), Montar treino, Perfil.

export type PersonalDrawerParamList = {
  Dashboard: undefined;
  Students: undefined;
  WorkoutBuilder: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<PersonalDrawerParamList>();

export function PersonalDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <PersonalDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.surface, width: 280 },
        drawerActiveTintColor: colors.accentBlue,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: `${colors.accentBlue}1A`,
        drawerLabelStyle: { fontSize: 14, fontWeight: '500', marginLeft: -16 },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="speedometer-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Students"
        component={PersonalStudentsStack}
        options={{
          drawerLabel: 'Alunos',
          drawerIcon: ({ color }) => <Ionicons name="people-outline" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="WorkoutBuilder"
        component={WorkoutBuilderScreen}
        options={{
          drawerLabel: 'Montar treino',
          drawerIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Perfil',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function PersonalDrawerContent(props: DrawerContentComponentProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const name = user?.name ?? 'Personal';
  const email = user?.email ?? '';

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="ribbon" size={22} color={colors.textPrimary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
            <Text style={styles.roleTag}>PERSONAL TRAINER</Text>
          </View>
        </View>
      </SafeAreaView>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
      >
        {props.state.routes.map((route, index) => {
          const focused = index === props.state.index;
          const { drawerLabel, drawerIcon } = props.descriptors[route.key].options;
          const label =
            typeof drawerLabel === 'string' ? drawerLabel : (route.name as string);

          return (
            <DrawerItem
              key={route.key}
              label={label}
              focused={focused}
              activeTintColor={colors.accentBlue}
              inactiveTintColor={colors.textSecondary}
              activeBackgroundColor={`${colors.accentBlue}1A`}
              icon={drawerIcon}
              labelStyle={styles.itemLabel}
              onPress={() => props.navigation.navigate(route.name)}
            />
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  headerSafeArea: { backgroundColor: colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  greeting: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  roleTag: {
    color: colors.accentBlue,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },

  itemsContainer: { paddingTop: 12 },
  itemLabel: { fontSize: 14, fontWeight: '500', marginLeft: -16 },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  logoutPressed: { opacity: 0.6 },
  logoutText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
});
