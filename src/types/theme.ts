// Paleta de cores do app. Centralizar aqui evita "magic strings" de hex
// espalhadas pelos componentes. Equivale a ter um theme.scss / variables.scss
// importado por toda a aplicação Angular.
//
// Mantemos só uma paleta (dark) porque o spec pede dark mode obrigatório.
// Quando precisar de variantes (hover, pressed, disabled), adicione aqui.

export const colors = {
  primary: '#0C3460',          // azul escuro principal (cor da marca / splash)
  primaryLight: '#1B4F8C',     // tom mais claro para destaques/hovers
  accentBlue: '#2D7CFF',       // azul brilhante para CTAs, anéis e gráficos
  background: '#0A1628',       // fundo da tela — mais escuro que o primary
  surface: '#142844',          // fundo de cards flutuantes
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',    // cinza-azulado para labels secundárias
  accent: '#FF8A3D',           // laranja dos gráficos
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  border: '#1F3556',
} as const;

// `as const` faz cada valor virar um literal type ao invés de string.
// Assim TypeScript sabe que colors.primary é exatamente '#0C3460', não string.

export type AppColor = keyof typeof colors;
