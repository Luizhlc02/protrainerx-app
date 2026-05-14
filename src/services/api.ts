import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Cliente HTTP central do app.
// Comparação Angular: este arquivo é o equivalente de configurar um HttpClient
// com HttpInterceptor que injeta o Authorization: Bearer <token>. A diferença
// é que aqui usamos Axios direto, sem DI.
//
// Como usar:
//   import { api } from '@/services/api';
//   const res = await api.get<User>('/users/me');
//
// O baseURL aponta para o Spring Boot local por padrão. Em dev real você troca
// pra um IP de máquina (porque o emulador Android não enxerga "localhost" da
// máquina hospedeira — ele enxerga o próprio localhost dele). Por agora deixamos
// configurável via EXPO_PUBLIC_API_URL (variáveis EXPO_PUBLIC_* são lidas em
// runtime pelo Expo).

const baseURL =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ?? 'http://localhost:8080/api';

export const TOKEN_STORAGE_KEY = '@protrainerx/auth-token';

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de REQUEST: antes de cada chamada, lê o token do AsyncStorage
// e injeta no header Authorization. Equivalente exato de um HttpInterceptor
// do Angular que faz `req.clone({ setHeaders: { Authorization: ... } })`.
//
// Por que ler do AsyncStorage a cada request em vez de manter em memória?
// - É a fonte da verdade (sobrevive a reloads/hot reload)
// - O custo é baixinho — AsyncStorage usa cache nativo
// - Evita estado duplicado com o authStore
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } catch {
    // Storage indisponível (raro). Segue sem token — o backend devolve 401
    // e o interceptor de response cuida do logout abaixo.
  }
  return config;
});

// Interceptor de RESPONSE: centraliza tratamento de 401 (token expirado/inválido).
// Por enquanto só limpamos o token; o authStore reage à ausência dele.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      // Não dispatchamos navegação daqui (este arquivo não conhece o navigator).
      // O authStore observa o storage / chama logout() em outro momento.
    }
    return Promise.reject(error);
  },
);
