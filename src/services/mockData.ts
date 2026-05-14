import type {
  Exercise,
  HealthFeedback,
  ProgressSummary,
  User,
  Workout,
} from '@/types/domain';

// Catálogo central de mocks. Mantemos tudo num arquivo só pra trocar fácil
// por chamadas reais à API depois — basta substituir os imports nas telas.
//
// Diferente de "MOCK_USER hardcoded dentro da tela" (que era nossa fase 0),
// agora os mocks têm tipo Forte, ficam num lugar previsível e simulam o
// retorno real de um endpoint.

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Agachamento livre',
    muscleGroup: 'LEGS',
    iconName: 'barbell-outline',
    description: 'Agachamento com barra. Manter coluna neutra e descer até paralela.',
  },
  {
    id: 'ex-2',
    name: 'Leg press 45°',
    muscleGroup: 'LEGS',
    iconName: 'fitness-outline',
    description: 'Pés na largura dos ombros, descer controlado, não estender joelho totalmente.',
  },
  {
    id: 'ex-3',
    name: 'Cadeira extensora',
    muscleGroup: 'LEGS',
    iconName: 'fitness-outline',
  },
  {
    id: 'ex-4',
    name: 'Esteira (cardio)',
    muscleGroup: 'CARDIO',
    iconName: 'walk-outline',
    description: '20 min em ritmo moderado, inclinação 3%.',
  },
];

export const MOCK_TODAY_WORKOUT: Workout = {
  id: 'w-1',
  title: 'Perna & Cardio',
  focus: ['LEGS', 'CARDIO'],
  durationMin: 60,
  intensity: 'MEDIUM',
  scheduledFor: '2026-05-13',
  exercises: [
    { exercise: MOCK_EXERCISES[0], planned: { sets: 4, reps: 10, weightKg: 60, restSec: 90 } },
    { exercise: MOCK_EXERCISES[1], planned: { sets: 4, reps: 12, weightKg: 120, restSec: 75 } },
    { exercise: MOCK_EXERCISES[2], planned: { sets: 3, reps: 15, weightKg: 35, restSec: 60 } },
    { exercise: MOCK_EXERCISES[3], planned: { sets: 1, reps: 1, restSec: 0 }, notes: '20 min, incl 3%' },
  ],
};

export const MOCK_PROGRESS: ProgressSummary = {
  caloriesWeek: 8400,
  workoutsWeek: 4,
  caloriesGoalWeek: 12000,
  workoutsGoalWeek: 5,
  series: [
    { label: 'Seg', value: 1800 },
    { label: 'Ter', value: 1200 },
    { label: 'Qua', value: 0 },
    { label: 'Qui', value: 2100 },
    { label: 'Sex', value: 1500 },
    { label: 'Sáb', value: 1800 },
    { label: 'Dom', value: 0 },
  ],
};

// Alunos do personal (vistos só pelo perfil PERSONAL)
export const MOCK_STUDENTS: User[] = [
  { id: 's-1', name: 'Rafael', email: 'rafael@exemplo.com', role: 'STUDENT', personalId: 'p-1' },
  { id: 's-2', name: 'Carla', email: 'carla@exemplo.com', role: 'STUDENT', personalId: 'p-1' },
  { id: 's-3', name: 'João', email: 'joao@exemplo.com', role: 'STUDENT', personalId: 'p-1' },
  { id: 's-4', name: 'Mariana', email: 'mariana@exemplo.com', role: 'STUDENT', personalId: 'p-1' },
];

export const MOCK_HEALTH_FEEDBACK: HealthFeedback[] = [
  {
    id: 'h-1',
    studentId: 's-1',
    bodyPart: 'Joelho direito',
    severity: 'MILD',
    notes: 'Pequeno desconforto após agachamento.',
    reportedAt: '2026-05-12T19:00:00Z',
  },
  {
    id: 'h-2',
    studentId: 's-2',
    bodyPart: 'Lombar',
    severity: 'MODERATE',
    reportedAt: '2026-05-11T08:30:00Z',
  },
];

// Contatos (para a tela ContactScreen) — mock genérico de chat preview.
export interface ContactPreview {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  updatedAt: string;
  initials: string;
}

export const MOCK_CONTACTS: ContactPreview[] = [
  {
    id: 'c-1',
    name: 'Personal André',
    lastMessage: 'Bora subir a carga essa semana!',
    unread: 2,
    updatedAt: '2026-05-13T10:20:00Z',
    initials: 'A',
  },
  {
    id: 'c-2',
    name: 'Nutri Camila',
    lastMessage: 'Te mandei o plano alimentar atualizado.',
    unread: 0,
    updatedAt: '2026-05-12T15:00:00Z',
    initials: 'C',
  },
  {
    id: 'c-3',
    name: 'Suporte protrainerx',
    lastMessage: 'Seu chamado foi resolvido.',
    unread: 0,
    updatedAt: '2026-05-10T09:00:00Z',
    initials: 'S',
  },
];
