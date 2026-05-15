import type { AuthResponseDTO, LoginCredentials, User } from '@/types/domain';

// authService — fachada para os endpoints de autenticação do backend.
// Mantemos as funções aqui (não nas telas) para que seja fácil:
//   1. Trocar implementação real <-> mock
//   2. Reutilizar em qualquer lugar (login, refresh, etc.)
//
// Por enquanto é MOCK — o backend Spring ainda não está ligado nesta sessão.
// Quando estiver, basta descomentar a versão real abaixo e remover o bloco MOCK.
//
// Decisão (cap. 12 do AULA.md, 2026-05-14): o app NÃO tem cadastro. O usuário
// assina o plano fora do app; o backend cria a conta amarrada ao e-mail. O role
// (STUDENT | PERSONAL) vem do form de Login (seletor visual), não inferido por
// prefixo de e-mail.

// ─── MOCK (remover quando backend estiver disponível) ───────────────────────

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
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
  const user: User = {
    id: 'u-' + credentials.email,
    name: nameFromEmail(credentials.email),
    email: credentials.email,
    role: credentials.role,
  };
  return {
    token: 'mock-jwt-' + Date.now(),
    user,
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
