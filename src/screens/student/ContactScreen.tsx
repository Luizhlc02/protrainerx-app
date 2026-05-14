import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_CONTACTS, type ContactPreview } from '@/services/mockData';
import { colors } from '@/types/theme';

// ContactScreen — preview do que vai virar o chat (V2 com WebSocket/STOMP).
// Por ora: lista de contatos com último recado e indicador de não lidas.
//
// Conceito novo: `FlatList`.
// - Diferente de `<ScrollView>` que renderiza TUDO de uma vez, `FlatList`
//   virtualiza: só renderiza os itens que estão na tela + um buffer.
// - É equivalente a `*cdkVirtualFor` do Angular CDK, mas vem nativo no RN.
// - `keyExtractor` é o `trackBy` do Angular — diz como identificar cada item.

export function ContactScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.menuBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Mensagens</Text>
        <Pressable style={styles.menuBtn}>
          <Ionicons name="create-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={MOCK_CONTACTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma conversa por enquanto.</Text>
        }
        renderItem={({ item }) => <ContactItem contact={item} />}
      />

      <View style={styles.footerHint}>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.footerText}>Chat em tempo real chega na V2 do app.</Text>
      </View>
    </SafeAreaView>
  );
}

function ContactItem({ contact }: { contact: ContactPreview }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={() => {
        // TODO: navegar para tela de chat individual (V2)
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{contact.initials}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.time}>{formatTime(contact.updatedAt)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.message} numberOfLines={1}>
            {contact.lastMessage}
          </Text>
          {contact.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{contact.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (sameDay) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },

  listContent: { paddingHorizontal: 12, paddingBottom: 12 },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 12 },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemPressed: { backgroundColor: colors.surface },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  info: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  time: { color: colors.textSecondary, fontSize: 11 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  message: { flex: 1, color: colors.textSecondary, fontSize: 13 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.textPrimary, fontSize: 11, fontWeight: '700' },

  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: { color: colors.textSecondary, fontSize: 12 },
});
