import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import * as authService from '@/services/authService';
import { TOKEN_STORAGE_KEY } from '@/services/api';
import type { LoginCredentials, RegisterPayload, User } from '@/types/domain';

// authStore — fonte da verdade do estado de autenticação.
//
// Por que Zustand?
// - Não tem boilerplate (sem reducer, sem action, sem provider extra)
// - Você cria um "hook" e chama em qualquer componente
// - Estado mutável de leitura simples + ações async sem ginástica
//
// Comparação Angular: equivale a um service singleton (`@Injectable({providedIn:'root'})`)
// que expõe um BehaviorSubject<AuthState>. A diferença: aqui o "subscribe" é
// automático (o React re-renderiza quando o slice usado muda).
//
// Persistência: armazenamos token e user em AsyncStorage manualmente (sem
// `zustand/middleware/persist`) por dois motivos:
//   1. Mantém o controle do formato (compatível com `api.ts` que lê o token)
//   2. Evita uma camada de middleware até precisarmos de mais features

const USER_STORAGE_KEY = '@protrainerx/auth-user';

interface AuthState {
  user: User | null;
  token: string | null;
  // hydrated = `true` depois que tentamos ler do storage. Antes disso o app
  // exibe um splash, pra não piscar a tela de login para usuário já logado.
  hydrated: boolean;
  loading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  loading: false,
  error: null,

  // Lê token+user do AsyncStorage. Chamado uma vez no boot do app.
  hydrate: async () => {
    try {
      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);
      if (token && userJson) {
        set({ token, user: JSON.parse(userJson) as User, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authService.login(credentials);
      await Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]);
      set({ token, user, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao entrar';
      set({ loading: false, error: message });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authService.register(payload);
      await Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]);
      set({ token, user, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao cadastrar';
      set({ loading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      AsyncStorage.removeItem(USER_STORAGE_KEY),
    ]);
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

// Seletores pré-prontos — evitam re-render desnecessário quando você só
// precisa de uma parte do estado. Convenção: cada seletor é um hook fininho.
//
// Equivale a um `select(state => state.user)` no NgRx, mas mais leve.
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => !!s.token && !!s.user);
export const useAuthHydrated = () => useAuthStore((s) => s.hydrated);
