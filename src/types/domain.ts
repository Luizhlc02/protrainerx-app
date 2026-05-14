// Tipos do domínio do app protrainerx.
// Espelham (ou pretendem espelhar) os DTOs do backend Spring Boot.
// Centralizar aqui evita "shapes" duplicados espalhados pelos services/telas.
//
// Convenção:
// - Tipos do servidor terminam em DTO (ex: LoginResponseDTO) quando representam
//   exatamente o payload da API
// - Modelos do app (User, Workout) são os "transformados", usados pelas telas
// - IDs sempre string para evitar problemas de precisão (Spring envia Long que
//   em JS vira number, mas tratamos como string por segurança/uniformidade)

// ─── Usuário ─────────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'PERSONAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Para alunos: id do personal associado. Para personal: undefined.
  personalId?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Resposta do POST /auth/login (e /auth/register) do Spring
export interface AuthResponseDTO {
  token: string;
  user: User;
}

// ─── Exercício ───────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'LEGS'
  | 'SHOULDERS'
  | 'ARMS'
  | 'CORE'
  | 'CARDIO'
  | 'FULL_BODY';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  // URL ou nome do ícone Ionicons para o thumbnail
  iconName?: string;
  // Vídeo ou imagem demonstrativa (opcional)
  mediaUrl?: string;
  description?: string;
}

// Um "set" planejado dentro de um treino (ex: 4 séries × 12 reps × 60kg)
export interface PlannedSet {
  sets: number;
  reps: number;
  // Peso sugerido em kg (opcional — alguns exercícios são de peso corporal)
  weightKg?: number;
  // Descanso sugerido entre séries, em segundos
  restSec?: number;
}

// Exercício dentro de um treino, com a planificação específica daquele treino
export interface WorkoutExercise {
  exercise: Exercise;
  planned: PlannedSet;
  // Notas do personal para o aluno sobre esse exercício
  notes?: string;
}

// ─── Treino ──────────────────────────────────────────────────────────────────

export type WorkoutIntensity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Workout {
  id: string;
  title: string;
  // Grupos musculares trabalhados (resumo do conteúdo)
  focus: MuscleGroup[];
  durationMin: number;
  intensity: WorkoutIntensity;
  exercises: WorkoutExercise[];
  // Data ISO para qual dia esse treino foi programado (yyyy-MM-dd)
  scheduledFor?: string;
}

// ─── Execução / Sessão de treino ─────────────────────────────────────────────

// O que o aluno efetivamente fez em um set durante a sessão.
export interface PerformedSet {
  reps: number;
  weightKg?: number;
  completed: boolean;
}

export interface PerformedExercise {
  exerciseId: string;
  sets: PerformedSet[];
  // Comentário rápido (ex: "subi a carga", "doeu no ombro")
  comment?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  studentId: string;
  startedAt: string; // ISO datetime
  finishedAt?: string;
  performed: PerformedExercise[];
  // 1-5 — como o aluno se sentiu nesse treino
  feeling?: 1 | 2 | 3 | 4 | 5;
}

// ─── Feedback de saúde / dor ────────────────────────────────────────────────

export type PainSeverity = 'MILD' | 'MODERATE' | 'SEVERE';

export interface HealthFeedback {
  id: string;
  studentId: string;
  // Onde está doendo (texto livre ou grupo muscular)
  bodyPart: string;
  severity: PainSeverity;
  notes?: string;
  reportedAt: string; // ISO datetime
}

// ─── Progresso semanal (para a tela Evolução) ───────────────────────────────

export interface WeeklyProgressPoint {
  // Dia da semana abreviado (Seg, Ter, ...)
  label: string;
  // Quantidade de calorias gastas (ou outra métrica) naquele dia
  value: number;
}

export interface ProgressSummary {
  caloriesWeek: number;
  workoutsWeek: number;
  caloriesGoalWeek: number;
  workoutsGoalWeek: number;
  series: WeeklyProgressPoint[];
}
