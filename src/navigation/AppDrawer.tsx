import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactScreen } from '@/screens/student/ContactScreen';
import { HomeScreen } from '@/screens/student/HomeScreen';
import { ProgressScreen } from '@/screens/student/ProgressScreen';
import { colors } from '@/types/theme';

// Mock — vai ser substituído pelo authStore quando o login existir
const MOCK_USER = { name: 'Rafael', email: 'rafael@exemplo.com' };

export type AppDrawerParamList = {
  Home: undefined;
  Progress: undefined;
  Contact: undefined;
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: 'Início',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          drawerLabel: 'Evolução',
          drawerIcon: ({ color }) => <Ionicons name="trending-up" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          drawerLabel: 'Contato',
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// ─── Custom drawer content ───────────────────────────────────────────────────
// Substitui o conteúdo padrão (só lista de itens) por: header com avatar+nome,
// itens da lista no meio, botão de logout no rodapé.

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = () => {
    // TODO: chamar authStore.logout() quando existir
    console.log('logout');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{MOCK_USER.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Olá, {MOCK_USER.name}!</Text>
            <Text style={styles.email}>{MOCK_USER.email}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* DrawerContentScrollView mantém o scroll funcionando se a lista crescer.
          Renderiza os itens declarados no Drawer.Navigator. */}
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
          onPress={handleLogout}
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
  avatarText: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  headerInfo: { flex: 1 },
  greeting: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

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
