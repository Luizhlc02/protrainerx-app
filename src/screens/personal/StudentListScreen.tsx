import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_STUDENTS } from '@/services/mockData';
import type { User } from '@/types/domain';
import { colors } from '@/types/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PersonalStackParamList } from '@/navigation/PersonalStack';

// StudentListScreen — lista de alunos do personal trainer com busca.
//
// Conceito novo: `useMemo`.
// - Cacheia o resultado de uma computação cara entre renders, só recalculando
//   quando alguma das dependências muda.
// - Aqui evita filtrar a lista a cada keystroke fora do query.
// - Equivale ao `pipe` puro do Angular (sem side effects, recalcula só quando
//   input muda).

export function StudentListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PersonalStackParamList>>();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_STUDENTS;
    return MOCK_STUDENTS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Alunos ({MOCK_STUDENTS.length})</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="person-add-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar aluno..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <StudentRow
            student={item}
            onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum aluno encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

function StudentRow({ student, onPress }: { student: User; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{student.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{student.name}</Text>
        <Text style={styles.rowEmail}>{student.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
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
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14, padding: 0 },

  listContent: { padding: 12 },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  rowPressed: { backgroundColor: colors.surface },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  rowInfo: { flex: 1 },
  rowName: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  rowEmail: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
