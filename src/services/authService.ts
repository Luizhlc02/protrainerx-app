import type {
  AuthResponseDTO,
  LoginCredentials,
  RegisterPayload,
  User,
} from '@/types/domain';

// authService — fachada para os endpoints de autenticação do backend.
// Mantemos as funções aqui (não nas telas) para que seja fácil:
//   1. Trocar implementação real <-> mock
//   2. Reutilizar em qualquer lugar (login, register, refresh, etc.)
//
// Por enquanto é tudo MOCK — o backend Spring ainda não está ligado nesta
// sessão. Quando estiver, basta descomentar a versão real abaixo e remover o
// bloco MOCK.

// ─── MOCK (remover quando backend estiver disponível) ───────────────────────
//
// Aceita qualquer email/senha não vazia. O `role` é deduzido do prefixo do
// email para facilitar testes: emails começando com "p@" ou "personal" caem
// no perfil PERSONAL, o resto vira STUDENT.

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function deduceRoleFromEmail(email: string): User['role'] {
  const e = email.toLowerCase();
  if (e.startsWith('p@') || e.startsWith('personal')) return 'PERSONAL';
  return 'STUDENT';
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'Atleta';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export async function login(credentials: LoginCredentials): Promise<AuthResponseDTO> {
  await sleep(700); // simula latência
  if (!credentials.email || !credentials.password) {
    throw new Error('Credenciais inválidas');
  }
  const role = deduceRoleFromEmail(credentials.email);
  return {
    token: 'mock-jwt-' + Date.now(),
    user: {
      id: 'u-' + credentials.email,
      name: nameFromEmail(credentials.email),
      email: credentials.email,
      role,
    },
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponseDTO> {
  await sleep(800);
  if (!payload.email || !payload.password || !payload.name) {
    throw new Error('Dados incompletos');
  }
  return {
    token: 'mock-jwt-' + Date.now(),
    user: {
      id: 'u-' + payload.email,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  };
}

// ─── Versão REAL (descomentar quando o backend estiver disponível) ──────────
//
// import { api } from '@/services/api';
//
// export async function login(credentials: LoginCredentials) {
//   const { data } = await api.post<AuthResponseDTO>('/auth/login', credentials);
//   return data;
// }
//
// export async function register(payload: RegisterPayload) {
//   const { data } = await api.post<AuthResponseDTO>('/auth/register', payload);
//   return data;
// }
