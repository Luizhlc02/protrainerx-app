# 📘 Aula — Construindo o App de Treino (React Native + Expo)

> Documento de apoio ao desenvolvimento. Atualizado a cada mudança significativa
> no projeto. Leia com calma — os capítulos estão em ordem cronológica.
>
> **Para quem é:** Luiz, dev fullstack Angular/Spring aprendendo React Native.
> Sempre que possível, conceitos novos são comparados ao mundo Angular/Spring.
>
> **Última atualização:** capítulos 4-10 — finalização do front (auth, store,
> bifurcação, telas do aluno e do personal, charts).

---

## 0. ⚡ Briefing para retomar em nova conversa

> **Se você (assistente) está lendo isto numa nova sessão de chat porque o
> usuário perdeu o histórico anterior — comece por aqui.** Esta seção é
> auto-suficiente: cobre quem é o usuário, como ele trabalha, o estado atual
> do projeto e o que está em aberto.

### 0.1 Sobre o desenvolvedor

- **Nome:** Luiz
- **Background:** Fullstack experiente em **Angular** e **Spring Boot**
- **Aprendendo:** **React Native** pela primeira vez através deste projeto
- **Idioma:** Português (Brasil)

### 0.2 Como ele quer trabalhar (regras importantes)

1. **Chat curto.** Respostas no terminal devem ter o mínimo: o que foi feito,
   por quê, próximo passo. **Não despeje pedagogia no chat.**
2. **Toda explicação detalhada vai NESTE arquivo (`AULA.md`)**, em capítulo
   apropriado. Atualize-o a cada mudança significativa: novo capítulo ou
   parágrafo + entrada na tabela de "Histórico de atualizações" no fim do
   arquivo + linha "Última atualização" no topo.
3. **Compare com Angular sempre que ajudar.** Ex: "isso é como `@Injectable()`",
   "esse hook funciona como `ngOnInit`", "useNavigation é como injetar `Router`".
4. **Não pular etapas.** Ele prefere entender do que copiar código.
5. **TypeScript em tudo.**
6. Quando ele pedir para **fazer sozinho** algo (ex: ajustar um espaçamento),
   apenas dê **dicas direcionadas** apontando para o arquivo/área certa, sem
   resolver o problema para ele.
7. **NÃO assumir que ele conhece o vocabulário do React/RN.** Termos como
   "Zustand", "AsyncStorage", "hook seletor", "interceptor", "FlatList",
   "SafeAreaView", "Pressable", "Stack/Drawer navigator" não comunicam nada
   se aparecerem sem tradução. **Sempre que um termo do ecossistema mobile
   for usado pela primeira vez num capítulo, abrir com uma linha do tipo
   "Zustand = biblioteca de estado global; pense como um `@Injectable()`
   com `BehaviorSubject` embutido".** Sem essa ponte ele não acompanha.

### 0.2.1 ⚠️ AVISO PARA O ASSISTENTE — onde a explicação atual falha

Em 2026-05-13 o usuário deu o seguinte feedback explícito:

> "Sou um dev java e angular que não entende muito do contexto de mobile e
> react então coisas como **Zustand persistido em AsyncStorage com hooks
> seletores** não quer dizer muito para mim."

**Onde isso acontece no AULA.md atual:** capítulos 6, 7, 10 e o resumo do
fim do capítulo 0.7 usam essas siglas como se fossem conhecidas. Precisam
ser revisitados com a regra acima: cada termo do ecossistema React/RN tem
que ser **traduzido na primeira aparição** dentro do capítulo, com
analogia Angular/Spring. Frases sem tradução são ruído.

**Padrão a seguir nos próximos capítulos:**

> ❌ Ruim: "Criamos um `authStore` Zustand persistido em AsyncStorage com
> hooks seletores que disparam re-render granular."
>
> ✅ Bom: "Criamos um `authStore` — um lugar único onde mora o estado de
> login (token + dados do usuário). Em Angular você faria isso com um
> service `@Injectable({providedIn:'root'})` que expõe um
> `BehaviorSubject<AuthState>`. Aqui usamos uma biblioteca chamada
> **Zustand** que faz a mesma coisa com menos código. Esse estado fica
> guardado em disco (no **AsyncStorage** — pense no `localStorage` do
> browser, mas no celular e assíncrono) para sobreviver a fechar/abrir
> o app. As telas leem fatias específicas desse estado via **hooks
> seletores** — funções tipo `useUser()` que são equivalentes a um
> `this.store.select(state => state.user)` do NgRx; cada componente só
> re-renderiza quando a fatia que ele lê muda."

### 0.3 O projeto em uma frase

App mobile **protrainerx** ("App de Treino") para personal trainers gerenciarem
treinos de alunos e acompanharem progresso. Dois perfis: **personal trainer**
e **aluno**. Backend Spring Boot já existente (REST + JWT + PostgreSQL).

### 0.4 Stack já decidida (não mudar sem perguntar)

- React Native + **Expo** (TypeScript)
- **React Navigation clássico** (Stack + Drawer) — **NÃO usar `expo-router`**
  (foi explicitamente removido na sessão de setup)
- **Zustand** para estado global (ainda não criado)
- **Axios** + interceptor JWT (ainda não criado)
- **AsyncStorage** para JWT persistido (ainda não usado)
- Estrutura de pastas em `src/` (não na raiz como o template Expo padrão sugere)

### 0.5 Estado atual do código (o que JÁ existe)

```
protrainerx/
├── App.tsx                              ✅ providers
├── index.js                             ✅ entrypoint
├── babel.config.js                      ✅ alias @/ + worklets
├── tsconfig.json                        ✅ strict, alias @/* → src/*
├── app.json                             ✅ splash #0C3460, web.output=single
├── src/
│   ├── components/
│   │   ├── Card.tsx                     ✅ wrapper visual reutilizável
│   │   ├── SectionHeader.tsx            ✅ título + chevron
│   │   ├── TextField.tsx                ✅ input com label/ícone/erro/senha
│   │   ├── PrimaryButton.tsx            ✅ CTA com loading + variants
│   │   ├── BarChart.tsx                 ✅ mini gráfico de barras (sem SVG)
│   │   └── ProgressRing.tsx             ✅ anel de progresso (placeholder visual)
│   ├── navigation/
│   │   ├── RootNavigator.tsx            ✅ bifurca Auth / Student / Personal
│   │   ├── AuthStack.tsx                ✅ Login + Register
│   │   ├── AppDrawer.tsx                ✅ drawer do ALUNO (Início/Evolução/Mensagens/Perfil)
│   │   ├── PersonalDrawer.tsx           ✅ drawer do PERSONAL (Dashboard/Alunos/Montar/Perfil)
│   │   ├── StudentHomeStack.tsx         ✅ stack interno do "Início" (Home→Detalhe/Sessão/Dor)
│   │   └── PersonalStack.tsx            ✅ stack interno de "Alunos" (Lista→Detalhe)
│   ├── screens/
│   │   ├── SplashScreen.tsx             ✅ tela enquanto authStore hidrata
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx          ✅ form completo + integra authStore
│   │   │   └── RegisterScreen.tsx       ✅ form com seletor de role
│   │   ├── student/
│   │   │   ├── HomeScreen.tsx           ✅ ligada ao stack + authStore + atalhos reais
│   │   │   ├── ProgressScreen.tsx       ✅ BarChart + ProgressRing + conquistas
│   │   │   ├── ContactScreen.tsx        ✅ FlatList de contatos com preview
│   │   │   ├── ProfileScreen.tsx        ✅ perfil + logout
│   │   │   ├── ExerciseDetailScreen.tsx ✅ detalhe do exercício
│   │   │   ├── WorkoutSessionScreen.tsx ✅ executar treino (toggle séries + progress bar)
│   │   │   └── ReportPainScreen.tsx     ✅ form de relato de dor
│   │   └── personal/
│   │       ├── DashboardScreen.tsx      ✅ KPIs + chart + alertas saúde
│   │       ├── StudentListScreen.tsx    ✅ lista de alunos com busca
│   │       ├── StudentDetailScreen.tsx  ✅ detalhe do aluno (chart + saúde + métricas)
│   │       └── WorkoutBuilderScreen.tsx ✅ montagem de treino + catálogo
│   ├── services/
│   │   ├── api.ts                       ✅ Axios + interceptor JWT
│   │   ├── authService.ts               ✅ login/register (mockado, com versão real comentada)
│   │   └── mockData.ts                  ✅ catálogo central de dados fake tipados
│   ├── store/
│   │   └── authStore.ts                 ✅ Zustand + persistência AsyncStorage
│   └── types/
│       ├── theme.ts                     ✅ paleta
│       └── domain.ts                    ✅ User, Workout, Exercise, etc.
└── assets/                              📁 ícones e splash
```

### 0.6 O que ainda é MOCK (precisa virar real quando o backend ligar)

- `authService.login/register` retornam token fake (`mock-jwt-<timestamp>`). A
  versão real está COMENTADA no fim do arquivo — descomentar quando endpoint
  do Spring estiver disponível
- `mockData.ts` substitui chamadas como `workoutService.getToday()`,
  `progressService.getWeekly()`, `studentsService.list()`, etc. Cada tela
  importa direto dali; trocar é trocar o import + tornar a função async
- Notificações (sino) ainda não fazem nada
- WebSocket de chat (V2) — `ContactScreen` mostra preview, sem chat real

### 0.7 Histórico macro de tarefas concluídas

| Bloco | Descrição |
|-------|-----------|
| Setup | template movido, expo-router removido, alias @/*, App.tsx com providers |
| Home (v1) | HomeScreen com mocks + Card/SectionHeader + Drawer |
| **Auth** | Tipos de domínio, Axios+JWT, authStore Zustand+AsyncStorage, AuthStack (Login+Register) |
| **Bifurcação** | RootNavigator escolhe Auth / StudentDrawer / PersonalDrawer por estado |
| **Aluno completo** | HomeStack (Detalhe/Sessão/Dor) + Profile, ProgressScreen real, ContactScreen real |
| **Personal completo** | PersonalDrawer com Dashboard, StudentList+Detail, WorkoutBuilder |
| **Visualização** | BarChart e ProgressRing sem SVG (só Views), reusados nas duas pontas |

### 0.8 Próximos passos sugeridos

1. **Plugar backend real**: descomentar versão real em `authService.ts`,
   substituir os imports de `mockData` por chamadas a services reais
2. **Cobertura nativa**: instalar `react-native-svg` e trocar ProgressRing
   por anel SVG real (proporcional via strokeDashoffset)
3. **Notificações push** (sino do header) — Expo Notifications
4. **Chat V2** com WebSocket/STOMP — substitui o preview da ContactScreen
5. Testes (Jest + React Native Testing Library) das telas principais

### 0.9 Decisões importantes que NÃO devem ser revertidas sem perguntar

- **`expo-router` foi removido propositalmente.** Se algum tutorial/erro
  sugerir reinstalar, não faça — confirme antes.
- **Não usar `app/` (filesystem routing).** Toda rota é declarada em código
  dentro de `src/navigation/`.
- **Estrutura `src/`** — não voltar pra raiz como o template original.
- **Paleta dark obrigatória.** Cor da marca é `#0C3460` (primary, navy escuro).
  CTAs/anel/gráficos usam `#2D7CFF` (accentBlue, mais brilhante).
- **Comentários em código:** o usuário valoriza comentários explicativos
  porque está aprendendo. Aqui é diferente do default "minimal comments" —
  pode comentar livremente o "porquê" das decisões e conceitos novos.

### 0.10 Como rodar o projeto

```bash
cd C:/Projetos/protrainerx
npx expo start
```

Aperta `a` (Android emulado), escaneia QR no Expo Go (celular), ou `w` (web —
limitado, alguns componentes renderizam diferente).

---

## Sumário

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Stack escolhida e por quê](#2-stack-escolhida-e-por-quê)
3. [Anatomia de um projeto Expo](#3-anatomia-de-um-projeto-expo)
4. [Conceitos fundamentais do React Native](#4-conceitos-fundamentais-do-react-native)
5. [Capítulo 1 — Setup inicial](#5-capítulo-1--setup-inicial)
6. [Capítulo 2 — Tela Home do aluno](#6-capítulo-2--tela-home-do-aluno)
7. [Capítulo 3 — Menu lateral (Drawer Navigator)](#7-capítulo-3--menu-lateral-drawer-navigator)
8. [Capítulo 4 — Tipos do domínio](#8-capítulo-4--tipos-do-domínio)
9. [Capítulo 5 — Cliente HTTP (Axios + JWT)](#9-capítulo-5--cliente-http-axios--jwt)
10. [Capítulo 6 — Estado global (Zustand + AsyncStorage)](#10-capítulo-6--estado-global-zustand--asyncstorage)
11. [Capítulo 7 — AuthStack (Login + Cadastro)](#11-capítulo-7--authstack-login--cadastro)
12. [Capítulo 8 — Bifurcação do RootNavigator](#12-capítulo-8--bifurcação-do-rootnavigator)
13. [Capítulo 9 — Fluxo do aluno (HomeStack + telas)](#13-capítulo-9--fluxo-do-aluno-homestack--telas)
14. [Capítulo 10 — Fluxo do personal](#14-capítulo-10--fluxo-do-personal)
15. [Capítulo 11 — Componentes reutilizáveis criados](#15-capítulo-11--componentes-reutilizáveis-criados)
16. [Glossário rápido](#16-glossário-rápido)
17. [Próximos passos planejados](#17-próximos-passos-planejados)
18. [Histórico de atualizações](#18-histórico-de-atualizações)

---

## 1. Visão geral do projeto

App mobile chamado **App de Treino (protrainerx)** — plataforma para personal
trainers gerenciarem treinos de alunos e acompanharem progresso.

**Dois perfis:**

- **Personal trainer** — cria treinos, monta biblioteca de exercícios,
  acompanha alunos pelo dashboard
- **Aluno** — vê o treino do dia, marca exercícios feitos, registra carga real,
  reporta dor/desconforto, vê gráficos de evolução

**MVP (V1):** autenticação JWT, gestão de treinos, execução de treino, feedback
de saúde, gráficos. **V2:** chat WebSocket/STOMP entre aluno e personal.

**Backend:** Spring Boot (já existente) + PostgreSQL + JWT.

---

## 2. Stack escolhida e por quê

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **React Native + Expo** (TypeScript) | Expo abstrai Xcode/Android Studio na maior parte do dev. Você foca em JS/TS |
| Navegação | **React Navigation** (Stack + Tabs) | Padrão de mercado. Mais explícito que `expo-router` (filesystem-based) — bom pra aprender |
| Estado global | **Zustand** | Mais simples que Redux, sem boilerplate. Você cria stores como hooks |
| HTTP | **Axios** + interceptor JWT | `interceptors.request.use(...)` é exatamente como `HttpInterceptor` do Angular |
| Storage local | **AsyncStorage** | Equivale ao `localStorage`, mas async (mexe com I/O nativo) |

### Decisão importante: por que NÃO usamos `expo-router`

O template padrão do Expo vem com **expo-router** (roteamento por arquivos,
tipo Next.js). Removemos porque:

1. Você está aprendendo — roteamento explícito (declarado em código) ensina
   melhor o mecanismo. `expo-router` esconde muita coisa "por mágica".
2. Casa melhor com a estrutura `src/screens/` separada por perfil que você
   desenhou no spec.
3. A maior parte da literatura/tutoriais usa React Navigation clássico.

**Trade-off:** abrimos mão de deep linking automático e SSG no web. Para um
app mobile interno de treinos, isso não importa.

---

## 3. Anatomia de um projeto Expo

Estrutura final após o setup:

```
protrainerx/
├── App.tsx                 ← componente raiz (providers + NavigationContainer)
├── index.js                ← entrypoint que registra o App
├── babel.config.js         ← preset Expo + module-resolver (alias @) + worklets
├── tsconfig.json           ← strict, alias @/* → src/*, exclui app-example
├── app.json                ← config Expo (nome, ícone, splash, plataformas)
├── package.json            ← deps e scripts (npm/yarn)
├── src/
│   ├── screens/
│   │   ├── auth/           → Login, Cadastro
│   │   ├── personal/       → Dashboard, Lista alunos, etc.
│   │   └── student/        → Home, Detalhe exercício, Registrar treino
│   │       └── HomeScreen.tsx       ← já existe
│   ├── components/         → UI reutilizável
│   │   ├── Card.tsx                 ← já existe
│   │   └── SectionHeader.tsx        ← já existe
│   ├── navigation/
│   │   └── RootNavigator.tsx        ← já existe (1 rota: Home)
│   ├── services/           → chamadas à API (vazio)
│   ├── store/              → Zustand stores (vazio)
│   ├── hooks/              → custom hooks (vazio)
│   ├── utils/              → helpers (vazio)
│   └── types/
│       └── theme.ts                 ← paleta de cores
├── app-example/            ← template original do Expo (referência, ignorado)
└── assets/                 ← ícones, splash images
```

### Comparação com Angular

| Conceito Angular | Equivalente Expo/RN |
|---|---|
| `main.ts` (`bootstrapApplication`) | `index.js` (`registerRootComponent`) |
| `app.component.ts` + `app.module.ts` | `App.tsx` |
| `app-routing.module.ts` | `src/navigation/RootNavigator.tsx` |
| `environments/environment.ts` | `app.json` + `process.env` |
| `angular.json` | `app.json` (configuração do Expo) |
| `tsconfig.app.json` `paths` | `tsconfig.json` `paths` (TS) **+** `babel.config.js` `module-resolver` (runtime) |
| `assets/` | `assets/` (idêntico) |
| `node_modules/` | `node_modules/` (idêntico) |

---

## 4. Conceitos fundamentais do React Native

### 4.1 Tudo é componente, e existem primitivos só de RN

RN **não tem HTML**. Em vez de `<div>`, `<span>`, `<p>`, `<button>`, você usa
componentes importados de `react-native`:

| HTML | React Native | Observação |
|---|---|---|
| `<div>` | `<View>` | Layout flex por padrão (column) |
| `<span>` / `<p>` | `<Text>` | **Toda letra na tela** precisa estar dentro de `<Text>` |
| `<img>` | `<Image>` | Ou `<ImageBackground>` para imagem de fundo |
| `<button>` | `<Pressable>` | Recebe `onPress`, não `onClick` |
| `<input>` | `<TextInput>` | Sem `type="email"`; usa `keyboardType="email-address"` |
| `<ul>` longa | `<FlatList>` | Renderiza só os itens visíveis (virtualização) |
| `<div style="overflow:auto">` | `<ScrollView>` | Container que rola |

**Regra de ouro:** se for letra, embrulha em `<Text>`. Esquecer disso é o erro
mais comum de quem vem do web.

### 4.2 Layout é Flexbox por padrão

Todo `<View>` já é `display: flex; flex-direction: column;`. Você nunca
declara isso. Layouts verticais ficam triviais:

```tsx
<View>           // já empilha filhos verticalmente
  <Text>A</Text>
  <Text>B</Text>
</View>
```

Para horizontal, só declara `flexDirection: 'row'`. Para ocupar o espaço
disponível, `flex: 1`.

### 4.3 Estilos com `StyleSheet.create`

Não existe CSS separado. Estilos são objetos JS:

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#142844',
    padding: 16,
    borderRadius: 12,
  },
});

<View style={styles.card}>...</View>
```

**Diferenças do CSS:**

- Camel case: `backgroundColor`, não `background-color`
- Sem unidades: `padding: 16` (são "density-independent pixels", DP)
- Sem cascata: estilos não herdam do pai (exceto `color`/`fontFamily` em Text)
- Sem `:hover` (não tem mouse) — o equivalente é o `({pressed})` do `<Pressable>`

### 4.4 Componente é uma função que retorna JSX

```tsx
function MeuComponente({ titulo }: { titulo: string }) {
  return <Text>{titulo}</Text>;
}
```

Equivale a um Angular standalone component minimalista, mas:

- Sem decorators (`@Component`)
- Sem template em arquivo separado (`.html`) — JSX é inline
- Sem ciclo de vida com nomes (`ngOnInit` etc.) — usa **hooks** (`useEffect`,
  `useState`)
- Sem `@Input()` — props chegam como argumento da função
- Sem `@Output()` — passe callbacks como props (`onPress={() => ...}`)

### 4.5 Path alias `@/` precisa de duas configurações

Diferente do Angular (que configura uma vez no `tsconfig.json`), em RN você
precisa configurar **dois lugares**:

1. **`tsconfig.json`** → para o TypeScript entender (autocomplete, type check)
2. **`babel.config.js`** com `babel-plugin-module-resolver` → para o Metro
   bundler resolver em runtime

Se configurar só um, tipo passa mas roda quebra (ou vice-versa).

---

## 5. Capítulo 1 — Setup inicial

Estado de partida: pasta com template padrão do Expo (com `expo-router`,
componentes de exemplo, etc.).

### 5.1 Por que NÃO rodamos `npm run reset-project`

O script é interativo (`readline.question`) e não funciona bem em terminal
não-interativo. Fizemos os mesmos passos manualmente para ter controle.

**Para futuros projetos do zero:** use `npx create-expo-app meu-app --template blank-typescript`
em vez de `default` — já vem sem expo-router, pulando esse trabalho todo.

### 5.2 Passos executados (em ordem)

1. **Mover template para `app-example/`** (referência, não apaga)
   - `app/`, `components/`, `hooks/`, `constants/`, `scripts/` → `app-example/`

2. **Trocar entrypoint para clássico**
   - `package.json`: `"main": "expo-router/entry"` → `"main": "index.js"`
   - Criar `index.js` com `registerRootComponent(App)`
   - Remover deps `expo-router` e `expo-linking` do `package.json`

3. **Limpar `app.json`**
   - Remover `"expo-router"` do array `plugins`
   - Remover `experiments.typedRoutes`
   - Trocar `web.output` de `"static"` para `"single"` (SPA clássica)
   - Trocar background da splash para `#0C3460` (cor da marca)

4. **Instalar deps que faltavam**
   - `npx expo install @react-navigation/native-stack @react-native-async-storage/async-storage`
     - **Por que `expo install`** e não `npm install`? O Expo install resolve a
       versão compatível com o SDK 54. Pacotes com código nativo precisam disso.
   - `npm install zustand axios`
     - Puro JS, sem código nativo, `npm` direto serve.

5. **Criar estrutura `src/`**
   - `mkdir` das pastas + `.gitkeep` em cada uma para o git rastrear pastas
     vazias

6. **Configurar alias `@/*` → `src/*`**
   - `tsconfig.json` → `paths`
   - Instalar `babel-plugin-module-resolver`
   - Criar `babel.config.js` com preset Expo + plugin do alias + plugin do
     `react-native-worklets` (necessário para `react-native-reanimated`)

7. **Criar `App.tsx` e tela placeholder**
   - `App.tsx` envelopa: `GestureHandlerRootView` → `SafeAreaProvider` →
     `NavigationContainer` (com tema dark customizado) → `RootNavigator`
   - `RootNavigator.tsx` com `createNativeStackNavigator` e 1 tela placeholder

### 5.3 Conceito-chave: ordem dos providers

No `App.tsx`, a ordem **de fora para dentro** importa:

```
GestureHandlerRootView   ← gestos (swipe back nativo, drag em listas)
  └─ SafeAreaProvider    ← mede insets de notch/status/home bar
      └─ NavigationContainer  ← contexto do React Navigation + tema
          └─ RootNavigator    ← suas rotas
              └─ telas...
```

**Analogia Angular:** é como a hierarquia de providers em `app.config.ts`
(`provideRouter`, `provideHttpClient`, etc.) — só que em RN você materializa
como JSX visível em vez de array de configuração.

### 5.4 Erro que apareceu e como resolvemos

Ao rodar `npx expo start` pela primeira vez:

```
CommandError: static and server rendering requires the expo-router package...
Either install the expo-router package or change 'web.output' to 'single'
```

**Causa:** o `app.json` ainda tinha `"web": { "output": "static" }`, opção
que só faz sentido com expo-router (gera HTML por rota).

**Fix:** trocar para `"single"` (SPA clássica, igual `ng build`).

---

## 6. Capítulo 2 — Tela Home do aluno

Primeira tela real do app, baseada no design enviado pelo cliente.

### 6.1 Análise do design

A HOME do aluno tem 5 blocos verticais dentro de um `ScrollView`:

1. **Header** — saudação personalizada + sino de notificações + avatar
2. **Card "Resumo do Dia"** — anel circular com calorias + 2 stats numéricos
3. **Card "TREINO DE HOJE"** — título do treino + chips + botão CTA grande
4. **Card "Evolução Semanal"** — mini gráfico de linha
5. **Card "Atalhos Rápidos"** — 3 círculos coloridos (Chat, Nutrição, Metas)

### 6.2 Decisões de implementação

| Decisão | Por quê |
|---|---|
| Mock data hardcoded no topo do arquivo | Sem auth + services prontos, vem de `const MOCK_USER = {...}`. Substituiremos depois |
| Anel circular = `View` com borda colorida | Anel real (com progresso parcial) precisa de `react-native-svg` + math. Placeholder mantém o layout visualmente correto |
| Gráfico de linha = placeholder com ícone | Mesmo motivo. Vai virar `react-native-gifted-charts` numa próxima sessão |
| 5 subcomponentes locais (`Header`, `Stat`, `Chip`, `Shortcut`, `RingPlaceholder`) | São usados só nesta tela. Extrair para `src/components/` agora seria abstração prematura |
| 2 componentes reutilizáveis (`Card`, `SectionHeader`) | Repetem 4-5 vezes. Vale extrair |
| Adicionei `accentBlue: '#2D7CFF'` ao tema | Design tem 2 azuis: o `#0C3460` da marca e um brighter blue para CTAs/anel/gráficos |

### 6.3 Componentes criados

#### `src/components/Card.tsx`

Wrapper visual: surface escura, borda sutil, padding, border-radius.
Recebe `children` (analogia: `<ng-content>` do Angular).

```tsx
type Props = { children: ReactNode; style?: StyleProp<ViewStyle> };

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}
```

A prop `style` opcional permite que cada uso ajuste detalhes (ex: marginTop
extra). O array `[styles.card, style]` é o equivalente do `[ngClass]` —
estilos posteriores sobrescrevem propriedades dos anteriores.

#### `src/components/SectionHeader.tsx`

"Título + chevron à direita" repetido em cada card. Variante `small` muda
para o estilo "TREINO DE HOJE" (label maiúsculo, menor, cinza). `onPress`
opcional só vira `<Pressable>` se receber a prop.

#### `src/screens/student/HomeScreen.tsx`

A tela inteira. Estrutura:

```
SafeAreaView (edges=top)
└─ ScrollView
   ├─ <Header />                          (subcomponente local)
   ├─ <Card> Resumo do Dia </Card>
   ├─ <Card> Treino de Hoje </Card>
   ├─ <Card> Evolução Semanal </Card>
   └─ <Card> Atalhos Rápidos </Card>
```

### 6.4 Conceitos novos que apareceram nesta tela

#### `Pressable` com estado de toque

```tsx
<Pressable
  style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
  onPress={() => console.log('clicado')}
>
```

A prop `style` aceita uma **função** que recebe `{pressed}`. Permite mudar
visual durante o toque — equivalente do `:active` do CSS, mas em JS.

#### `SafeAreaView` + `SafeAreaProvider`

`SafeAreaView` adiciona padding automático para evitar notch/status bar.
Precisa do `SafeAreaProvider` envelopando a árvore (já configurado no
`App.tsx`). `edges={['top']}` = "respeita só borda de cima".

#### Truque do círculo

```ts
{ width: 96, height: 96, borderRadius: 48 }   // círculo perfeito
```

`borderRadius >= width/2` faz qualquer View virar círculo. Usado em avatar,
sino, anel, ícones de atalho.

#### Transparência com hex `${color}26`

```tsx
backgroundColor: `${colors.accentBlue}26`
```

`#26` é o canal alpha em hex (~15%). Cria um "halo" suave da cor do ícone
sem precisar adicionar nova cor ao tema.

#### Tipagem de nome de ícone

```ts
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
```

Pega o tipo da prop `name` direto da definição do `Ionicons`. Autocomplete
só sugere ícones que existem. Se digitar errado, erro de compile.

#### `gap` no layout flex

```ts
{ flexDirection: 'row', gap: 12 }
```

RN suporta `gap` desde 0.71. Antes precisava `marginRight: 12` em cada filho
(menos o último). Ganho de ergonomia enorme.

### 6.5 Débitos técnicos assumidos

1. **Anel de progresso real** — exige `react-native-svg` + cálculo de
   `strokeDashoffset` proporcional ao progresso
2. **Mini gráfico de linha** — biblioteca `react-native-gifted-charts` (mais
   simples) ou `victory-native` (mais flexível)
3. **Avatar com foto real** — substituir initial por `<Image source={{uri}}>`
   quando auth estiver pronta
4. **Ações funcionais** — sino, atalhos e "INICIAR TREINO" só fazem
   `console.log`. Quando o navigator tiver mais telas, `useNavigation()`
   resolve

---

## 7. Capítulo 3 — Menu lateral (Drawer Navigator)

### 7.1 A pergunta que originou: "qual é o arquivo mais alto?"

O arquivo "mais alto" do app é o `App.tsx`, equivalente ao `app.component.ts`
do Angular. Mas a primeira intuição vinda do Angular ("vou colocar a `<app-navbar>`
direto no `app.component.html`") **não é o caminho** em React Navigation.

**Por quê:** se a navbar mora no `App.tsx`, ela aparece em TODAS as telas — login,
cadastro, splash, modais. Aí você teria que esconder manualmente em cada tela
indesejada (frágil e bagunçado).

**Padrão correto:** a navbar pertence a um **Navigator** (Drawer ou Tab). Telas
declaradas dentro desse Navigator ganham a navbar; telas fora não. Limpa, sem
condicionais.

### 7.2 Drawer vs Tab — qual usar?

| Padrão | Quando usar |
|---|---|
| **Bottom Tab** | 3-5 destinos top-level acessados o tempo todo (Instagram, Twitter, WhatsApp) |
| **Drawer (lateral)** | Mais destinos ou itens secundários (menus de admin, configurações) |
| **Stack** | Hierarquia "drill-down" (lista → detalhe → detalhe do detalhe) |

Você escolheu **Drawer**. Funciona bem porque o app tem um perfil (aluno OU
personal), não vários espaços paralelos.

### 7.3 Hierarquia final dos navigators

```
App.tsx
  └─ NavigationContainer
      └─ RootNavigator (Stack)              ← topo lógico do app
          └─ AppDrawer (Drawer Navigator)    ← contém a navbar lateral
              ├─ HomeScreen
              ├─ ProgressScreen
              └─ ContactScreen
```

**Por que ainda existe um Stack ROOT cobrindo o Drawer?** Porque ele vai abrigar
a bifurcação `Auth vs App` quando o login existir:

```tsx
{isLoggedIn
  ? <Stack.Screen name="App" component={AppDrawer} />
  : <Stack.Screen name="Auth" component={AuthStack} />}
```

Com isso, login não aparece dentro do drawer — fica fora dele, tela cheia. Padrão
clássico em apps mobile.

### 7.4 Anatomia do `AppDrawer.tsx`

```
AppDrawer
├─ Drawer.Navigator (com drawerContent custom)
│   ├─ Drawer.Screen "Home" (HomeScreen)
│   ├─ Drawer.Screen "Progress" (ProgressScreen)
│   └─ Drawer.Screen "Contact" (ContactScreen)
└─ CustomDrawerContent (substitui o conteúdo padrão)
    ├─ Header com avatar + "Olá, Rafael!" + email
    ├─ DrawerContentScrollView com a lista de itens
    └─ Footer com botão "Sair" (logout)
```

### 7.5 Por que `drawerContent` custom em vez do padrão?

O drawer padrão do React Navigation só renderiza a lista de itens — sem header,
sem footer, sem espaço para greeting/logout. A prop `drawerContent` recebe uma
**função que retorna um componente** com layout livre.

Recebemos `props: DrawerContentComponentProps` que dão acesso ao state da
navegação, lista de rotas e helpers (`navigation.navigate(name)`,
`state.index`, `state.routes`). Isso permite renderizar a lista nós mesmos
mantendo o highlight da rota ativa.

### 7.6 Conceitos novos que apareceram

#### `useNavigation` (hook) — comparação com Angular

```tsx
const navigation = useNavigation();
navigation.dispatch(DrawerActions.openDrawer());
```

`useNavigation` é como injetar o `Router` do Angular num componente:

```ts
// Angular
constructor(private router: Router) {}
this.router.navigate(['/home']);
```

Diferenças:
- Em RN, é hook (`useX()`) chamado dentro do componente, não no construtor
- Você não precisa importar/declarar nada num module
- A "rota" se chama "screen name", não path

#### `dispatch` + Actions

`navigation.navigate('Home')` é o jeito direto. Mas para abrir/fechar drawer,
existe um helper:

```tsx
navigation.dispatch(DrawerActions.openDrawer())
navigation.dispatch(DrawerActions.closeDrawer())
navigation.dispatch(DrawerActions.toggleDrawer())
```

Pattern Redux-ish: você "dispara uma ação" que o navigator interpreta. Útil
quando o drawer está em qualquer nível acima da tela atual — `dispatch` sobe
a cadeia até achar quem responde.

#### `drawerType: 'front'`

Três valores possíveis: `front` (drawer cobre o conteúdo), `back` (conteúdo
desliza para revelar), `slide` (ambos deslizam juntos). `front` é o mais
comum e o mais "iOS-ish".

#### Cores semi-transparentes via `${color}1A` no item ativo

```ts
drawerActiveBackgroundColor: `${colors.accentBlue}1A`
```

Mesmo truque do `${color}26` da Home, mas com `1A` (~10%, mais sutil) para o
fundo do item ativo. Mantém o highlight discreto.

### 7.7 Mudanças no `HomeScreen` para integrar com o drawer

- Adicionado botão hambúrguer (`Ionicons "menu"`) à esquerda da saudação
- Reduzida fonte do "Olá Rafael" de 22 → 18 para caber com o botão
- Importado `useNavigation` + `DrawerActions` para abrir o drawer no toque

**Bônus:** o drawer também abre por **swipe da borda esquerda** automaticamente —
gesto nativo gratuito do `@react-navigation/drawer`.

### 7.8 Sobre o "igual para os dois perfis"

O componente `AppDrawer` é único para aluno e personal. Os ITENS do menu por
enquanto são os mesmos (Início, Evolução, Contato) e as TELAS por trás vão
internamente decidir o que renderizar conforme o perfil do usuário logado
(quando o `authStore` existir).

Se no futuro quiser bifurcar mais cedo (drawers totalmente diferentes por
perfil), basta criar `StudentDrawer` e `PersonalDrawer` e escolher no
`RootNavigator` baseado em `user.role`.

### 7.9 Débitos técnicos assumidos

1. **Nome no drawer ainda é mock** (`'Rafael'`) — vira `useAuthStore(s => s.user.name)` quando o store existir
2. **Logout só faz `console.log`** — vai chamar `authStore.logout()` + limpar AsyncStorage
3. **Telas Progress e Contact são placeholders** — serão construídas em sessões dedicadas

---

## 8. Capítulo 4 — Tipos do domínio

Arquivo: `src/types/domain.ts`. Toda a tipagem de dados que circulam pelo
app — espelho dos DTOs do Spring Boot.

### 8.1 Por que centralizar em um arquivo só

Em projetos médios é comum quebrar em `src/types/user.ts`, `workout.ts`, etc.
Por enquanto temos poucos tipos relacionados, então um arquivo único é mais
fácil de navegar. Quando passar de ~300 linhas, quebramos.

**Analogia Angular:** é o equivalente das `interface` em `models/` ou de
`*.dto.ts` que você gera com `nswag`/`openapi-generator` a partir do swagger
do backend.

### 8.2 Convenções

- IDs sempre `string` (Spring envia `Long` mas tratamos como string para
  evitar perda de precisão e padronizar o front)
- Enums como **union types** (`'STUDENT' | 'PERSONAL'`) em vez de `enum`. Por
  quê: `enum` do TS gera código em runtime; union é só checagem em compile.
  Mais leve.
- Tipos terminados em `DTO` representam o payload exato da API (ex:
  `AuthResponseDTO`). Tipos sem `DTO` (ex: `User`, `Workout`) são o modelo do
  app — pode haver transformação entre o que o backend manda e o que a tela
  usa, embora hoje sejam iguais.

### 8.3 Tipos criados

| Tipo | Uso |
|---|---|
| `User`, `UserRole` | Usuário logado, tem `role: STUDENT | PERSONAL` |
| `LoginCredentials`, `RegisterPayload`, `AuthResponseDTO` | Auth |
| `Exercise`, `MuscleGroup`, `PlannedSet`, `WorkoutExercise` | Catálogo + planificação |
| `Workout`, `WorkoutIntensity` | Treino completo (lista de exercícios + meta) |
| `WorkoutSession`, `PerformedSet`, `PerformedExercise` | O que o aluno fez de fato |
| `HealthFeedback`, `PainSeverity` | Relato de dor |
| `ProgressSummary`, `WeeklyProgressPoint` | Dados da tela Evolução |

---

## 9. Capítulo 5 — Cliente HTTP (Axios + JWT)

Arquivo: `src/services/api.ts`. Cliente Axios central com interceptor JWT.

### 9.1 Por que Axios e não fetch

Os dois funcionam em RN. Axios ganha por:
- Interceptors (request E response) prontos
- Transform de JSON automático
- Erro com `error.response.status` é mais ergonômico que decodificar a
  Response do `fetch`
- Cancelamento de request com AbortController integrado

### 9.2 Anatomia do `api.ts`

```ts
const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';
export const api = axios.create({ baseURL, timeout: 15000, ... });
```

- `EXPO_PUBLIC_API_URL`: variável de ambiente lida em runtime. Tudo que começa
  com `EXPO_PUBLIC_` é exposto ao bundle (segredos NÃO podem ir aqui).
- Em emulador Android, `localhost` da máquina é `10.0.2.2`. Em iOS simulator,
  `localhost` mesmo. Em dispositivo físico, IP da máquina na rede.

### 9.3 Interceptor de request (injeta JWT)

```ts
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
```

**Equivalência Angular**: idêntico ao padrão `HttpInterceptor` do Angular —
você intercepta a request e adiciona/clona com `setHeaders`. A diferença é
que Axios não tem injeção de dependência: o interceptor é registrado uma vez
no módulo, e qualquer chamada `api.get/post/...` passa por ele.

**Por que ler do AsyncStorage a cada request, não cachear em memória?**
- AsyncStorage é a fonte da verdade (sobrevive a reloads/hot reload)
- Custo é baixíssimo (cache nativo)
- Evita estado duplicado com o authStore (sem risco de "store dizer X,
  storage dizer Y")

### 9.4 Interceptor de response (401 → limpa token)

Quando o backend devolve 401 (token expirado), apagamos o token do storage.
O authStore, em seguida, percebe via fluxo de logout que será disparado pela
UI. Não dispatchamos navegação daqui: este arquivo não conhece o navigator —
mantém a separação de camadas.

### 9.5 authService

Arquivo: `src/services/authService.ts`. Funções `login()` e `register()`.

Por enquanto retornam mocks (token fake + user inferido pelo email). A versão
real está **comentada no fim do arquivo** — basta descomentar e remover o
bloco mock quando o backend estiver disponível.

Truque pra testar: emails começando com `p@` ou `personal` viram PERSONAL,
o resto vira STUDENT. Permite testar os dois fluxos sem precisar de email mágico.

---

## 10. Capítulo 6 — Estado global (Zustand + AsyncStorage)

Arquivo: `src/store/authStore.ts`.

### 10.1 Por que Zustand?

Comparação com outras opções para estado global em RN:

| Lib | Boilerplate | Curva | Performance | Quando usar |
|---|---|---|---|---|
| Redux Toolkit | Alto | Alta | Alta | Apps grandes com state machine claro |
| MobX | Médio | Média | Alta | Times que vêm de OOP/Vue |
| **Zustand** | **Baixíssimo** | **Baixa** | **Alta** | **Default moderno** |
| Context + useState | Zero | Zero | Baixa em escala | Estado local de árvore pequena |

Zustand é literalmente "uma função que cria um hook":

```ts
const useAuthStore = create((set) => ({
  user: null,
  login: async (creds) => {
    const { token, user } = await authService.login(creds);
    set({ token, user });
  },
}));

// Em qualquer componente:
const user = useAuthStore((s) => s.user);
```

**Comparação Angular:** equivale a um `@Injectable({providedIn:'root'})` que
expõe um `BehaviorSubject<AuthState>`, mas o "subscribe" é automático e
granular — você passa um seletor (`s => s.user`) e o componente só re-renderiza
quando essa fatia muda.

### 10.2 Estrutura do nosso authStore

```
user            User | null         — usuário logado
token           string | null       — JWT
hydrated        boolean             — true depois de tentar ler do storage
loading         boolean             — request de login/register em andamento
error           string | null       — última mensagem de erro de auth

hydrate()       lê token+user do AsyncStorage
login(creds)    chama authService.login + persiste
register(p)     chama authService.register + persiste
logout()        limpa storage + state
clearError()    zera o campo error
```

### 10.3 Persistência manual (sem `zustand/middleware/persist`)

Optamos por chamar `AsyncStorage.getItem/setItem` direto em vez de usar o
middleware `persist` do Zustand. Razões:

1. **Compatibilidade com `api.ts`**: o interceptor lê o token de uma chave
   conhecida (`@protrainerx/auth-token`). Se usássemos `persist`, o formato
   seria um JSON envelope (`{ state, version }`) e teríamos que decodificar
   no interceptor. Atrito desnecessário.
2. **Controle do timing**: queremos `hydrated: false` antes da leitura para
   poder mostrar o splash. O middleware faz isso transparente, mas a gente
   prefere ver o código.

### 10.4 Hooks seletores prontos

No final do arquivo:

```ts
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => !!s.token && !!s.user);
export const useAuthHydrated = () => useAuthStore((s) => s.hydrated);
```

São wrappers ergonômicos. Em qualquer tela:

```tsx
const user = useUser();          // re-renderiza só se user mudar
```

Equivalente Angular: `store.select(state => state.user)` no NgRx, mas mais
leve.

### 10.5 Padrão "set imutável"

```ts
set({ token, user, loading: false });
```

`set` recebe um objeto parcial e mescla. NUNCA mute o estado existente
(`state.user.name = 'X'`) — o React não detecta e a UI não atualiza. Mesma
regra do Redux/RxJS.

---

## 11. Capítulo 7 — AuthStack (Login + Cadastro)

Arquivo: `src/navigation/AuthStack.tsx` + telas em `src/screens/auth/`.

### 11.1 Por que um Stack separado para auth?

Telas de login/cadastro **não** devem ter o drawer lateral. Colocá-las em um
Stack próprio (fora do AppDrawer/PersonalDrawer) garante isso por construção
— elas nem existem no mesmo navigator que o resto do app.

O `RootNavigator` decide a cada render qual stack montar (Auth vs App), então
após login você simplesmente desaparece do AuthStack — o swipe-back nativo do
iOS não consegue voltar para Login (ele nem está mais na árvore).

### 11.2 LoginScreen — conceitos novos

#### KeyboardAvoidingView

```tsx
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
```

O teclado virtual do mobile tapa inputs na parte de baixo. `KeyboardAvoidingView`
ajusta o layout quando o teclado aparece:
- `padding`: adiciona padding inferior do tamanho do teclado
- `height`: encolhe a altura
- `position`: muda a posição absoluta

Convenção: `padding` no iOS, `height` no Android funciona pra maioria dos casos.

#### useState para form

```tsx
const [email, setEmail] = useState('');
<TextInput value={email} onChangeText={setEmail} />
```

Comparação direta com Angular:
- Angular: `[(ngModel)]="email"` (two-way binding mágico via Zone.js)
- React: `value={email} onChangeText={setEmail}` (explícito, sem mágica)

A vantagem do React: você sempre sabe quem está atualizando o estado. A
desvantagem: mais verboso. Pra forms maiores existem libs (`react-hook-form`,
`formik`), mas para 2-3 campos a versão na mão serve.

#### Consumindo o store

```tsx
const login = useAuthStore((s) => s.login);
const loading = useAuthStore((s) => s.loading);
const error = useAuthStore((s) => s.error);
```

Cada hook retorna uma fatia diferente — o componente re-renderiza só quando
ALGUMA dessas fatias muda. Se o store atualizar um campo `user` (não usado
aqui), nada acontece.

### 11.3 RegisterScreen — seletor de role

A escolha de perfil (`ALUNO | PERSONAL`) é feita por um par de botões com
estado local (`useState<UserRole>`). Toque alterna; o `register()` recebe
isso no payload.

Em produção, criar conta de personal geralmente exige aprovação manual ou
código de convite. Pro MVP, deixamos aberto para facilitar testes.

---

## 12. Capítulo 8 — Bifurcação do RootNavigator

Arquivo: `src/navigation/RootNavigator.tsx`.

### 12.1 O padrão "stack que troca de filho"

```tsx
<Stack.Navigator>
  {!user ? (
    <Stack.Screen name="Auth" component={AuthStack} />
  ) : user.role === 'PERSONAL' ? (
    <Stack.Screen name="PersonalApp" component={PersonalDrawer} />
  ) : (
    <Stack.Screen name="StudentApp" component={AppDrawer} />
  )}
</Stack.Navigator>
```

**O que acontece em runtime:** quando o usuário faz login, o `user` muda no
store, o RootNavigator re-renderiza e o Stack agora declara apenas o
`StudentApp` (ou `PersonalApp`). React Navigation detecta a mudança de
filhos e **monta/desmonta** os stacks inteiros — sem animação de "go back"
involvida. A transição visual é a `animation: 'fade'` que pusemos no
`screenOptions`.

**Por que isso é seguro:**
- Após login, AuthStack é DESMONTADO. Não tem como o gesto de voltar levar
  a tela de Login de volta (não existe na árvore).
- Após logout, o app inteiro é desmontado, evitando vazamento de estado de
  tela.

### 12.2 Hidratação no boot

```tsx
const hydrate = useAuthStore((s) => s.hydrate);
useEffect(() => { hydrate(); }, [hydrate]);

if (!hydrated) return <SplashScreen />;
```

`useEffect(fn, [])` (array vazio) = "rodar uma vez no mount". Equivale ao
`ngOnInit` do componente raiz. Aqui disparamos `hydrate()` que lê o token
do AsyncStorage.

Enquanto `hydrated === false`, renderiza splash. Sem isso, o app pisca a
tela de login mesmo quando o usuário já estava logado (porque hydrated
inicia falso → user inicia null → cai no AuthStack por meio segundo).

### 12.3 Por que `useEffect([hydrate])` em vez de `useEffect([], [])`

`hydrate` é uma função estável (Zustand garante referência constante), então
incluí-la na dependência é seguro e satisfaz o lint do `react-hooks`. Em
ambos os casos roda uma vez só.

---

## 13. Capítulo 9 — Fluxo do aluno (HomeStack + telas)

### 13.1 Estrutura

```
AppDrawer (StudentDrawer)
├─ Drawer.Screen "HomeTab"  → StudentHomeStack
│                              ├─ Home
│                              ├─ ExerciseDetail   (push do Home)
│                              ├─ WorkoutSession   (push do Home)
│                              └─ ReportPain       (push de Home)
├─ Drawer.Screen "Progress" → ProgressScreen
├─ Drawer.Screen "Contact"  → ContactScreen
└─ Drawer.Screen "Profile"  → ProfileScreen
```

### 13.2 Por que aninhar Stack dentro do Drawer

- **Drawer**: seções top-level, lateral. Trocar de drawer item NÃO mantém histórico de Stack.
- **Stack**: drill-down. Push empilha (com botão voltar); back desempilha.

Como queremos que "abrir um exercício a partir da Home" mostre botão de voltar
e mantenha o gesto de swipe-back, sub-telas precisam de Stack. E como o
**header** do Stack só aparece quando você está navegando dentro dele,
escondê-lo na Home (`headerShown: false` na rota Home) deixa a aparência
limpa nessa tela, mas as sub-telas ganham header automático com o título
configurado.

### 13.3 Tipando params da rota

```ts
export type StudentHomeStackParamList = {
  Home: undefined;
  ExerciseDetail: { exerciseId: string };
  WorkoutSession: undefined;
  ReportPain: undefined;
};
```

Quando você chama `navigation.navigate('ExerciseDetail', { exerciseId: 'x' })`,
TypeScript checa que:
1. A rota existe nesse stack
2. Os params batem com o tipo declarado

Em telas: `useRoute<RouteProp<ParamList, 'ExerciseDetail'>>()` retorna params
com o tipo certo. Erro de digitação vira erro de compile.

**Equivalência Angular:** o `ActivatedRoute.snapshot.params` é tipado como
`Params` (basicamente `Record<string, string>`). Aqui temos tipagem real, com
shapes específicos por rota.

### 13.4 ExerciseDetailScreen

Recebe `exerciseId` via params, busca no `MOCK_TODAY_WORKOUT` (vai virar
`workoutService.getExercise(id)`). Mostra:
- Hero icon centralizado
- Card "Planejamento" (séries, reps, carga, descanso)
- Card "Como executar" (descrição do exercício)
- Card "Observações do seu personal" (notes do `WorkoutExercise`)

### 13.5 WorkoutSessionScreen

Tela de execução do treino. Conceitos:

**Estado com Set**: para marcar séries concluídas usamos `Set<string>` onde
o id é `${exerciseId}-${setIndex}`. Lookup em O(1), toggle simples:

```tsx
const next = new Set(prev);   // CRIA novo Set — referência diferente
if (next.has(id)) next.delete(id); else next.add(id);
return next;
```

**Pegadinha**: mutar o Set existente (`prev.add(id)`) NÃO dispara re-render.
React compara por referência; o Set é o mesmo objeto. Sempre clone.

**Barra de progresso**: View com `width: '${progress * 100}%'`. Sem libs.

### 13.6 ReportPainScreen

Form para o aluno relatar dor: localização, severidade (3 botões coloridos),
notas. Severidade usa um array tipado de opções:

```ts
const severities: { value: PainSeverity; label: string; color: string }[] = [...]
```

Renderizar via `.map()` é o padrão `*ngFor` do React — você mapeia array
para JSX direto.

### 13.7 ProfileScreen

Visão do perfil + acesso ao logout. Funciona para os dois perfis (é importado
pelo AppDrawer E pelo PersonalDrawer) porque depende só do `user` do store.

### 13.8 Mudanças na HomeScreen

A versão anterior:
- Usava `MOCK_USER = { name: 'Rafael' }` hardcoded
- Botão "INICIAR TREINO" só fazia `console.log`
- Atalhos não navegavam

Agora:
- `useUser()` puxa o nome do store
- Botão "INICIAR TREINO" → `navigation.navigate('WorkoutSession')`
- Atalho "Relatar dor" → `navigation.navigate('ReportPain')`
- Atalho "Chat" e "Evolução" → `navigation.getParent()?.navigate(...)` para
  pular pro drawer item irmão
- Lista de exercícios do treino com tap → ExerciseDetail
- Anel agora é o `ProgressRing` real, com cor reativa à meta

#### `navigation.getParent()` — quando usar

A Home está dentro do `StudentHomeStack`, que está dentro do `AppDrawer`.
`navigation` por padrão é do stack. Para falar com o drawer (irmão da rota
"Contact", por exemplo), pegamos o pai: `navigation.getParent()`.

`as never` no segundo arg é uma escape hatch porque o `getParent()` retorna
um navigator não tipado — a outra opção é tipar o pai manualmente, o que
encrespa a árvore de tipos. Em projeto pequeno, `as never` é um trade-off
ok.

---

## 14. Capítulo 10 — Fluxo do personal

### 14.1 Estrutura

```
PersonalDrawer
├─ Drawer.Screen "Dashboard"     → DashboardScreen
├─ Drawer.Screen "Students"      → PersonalStudentsStack
│                                   ├─ StudentList
│                                   └─ StudentDetail (push)
├─ Drawer.Screen "WorkoutBuilder"→ WorkoutBuilderScreen
└─ Drawer.Screen "Profile"       → ProfileScreen
```

Mesmo padrão do aluno: drawer top-level, stack interno onde precisa de
drill-down (Lista → Detalhe).

### 14.2 DashboardScreen — KPIs + chart + alertas

Três cards de KPI no topo (Alunos ativos, Treinos hoje, Alertas saúde), um
BarChart com treinos por dia da semana e uma lista de feedbacks de saúde
recentes. Cada alerta tem cor (verde/amarelo/vermelho) por severidade.

### 14.3 StudentListScreen — useMemo + busca

```tsx
const [query, setQuery] = useState('');
const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_STUDENTS;
  return MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(q));
}, [query]);
```

**`useMemo` em uma frase:** cacheia o resultado entre renders, recalcula só
quando dependências mudam. Análogo Angular: **pipe puro** (`@Pipe({pure:true})`).

Aqui evita filtrar 1000 alunos a cada keystroke fora da searchbox. Como
nossa lista tem 4 itens, o ganho é nulo na prática — mas é o padrão certo
para listas maiores e custa nada.

### 14.4 StudentDetailScreen

Recebe `studentId` via params, mostra perfil + chart de evolução + histórico
de saúde + métricas semanais.

### 14.5 WorkoutBuilderScreen — gerenciar lista que cresce

```tsx
const [selected, setSelected] = useState<Exercise[]>([]);
const toggle = (ex: Exercise) => {
  setSelected(prev =>
    prev.find(e => e.id === ex.id)
      ? prev.filter(e => e.id !== ex.id)
      : [...prev, ex]
  );
};
```

Padrão: sempre criar um array NOVO em vez de mutar (`prev.push(ex)` não
funcionaria — mesma referência, sem re-render).

O catálogo expandível (botão "+ Adicionar") é só um boolean (`showCatalog`)
que mostra/esconde a lista de exercícios disponíveis.

---

## 15. Capítulo 11 — Componentes reutilizáveis criados

### 15.1 TextField

`src/components/TextField.tsx`. Wrapper visual de `TextInput` com:
- Label opcional acima
- Ícone à esquerda (Ionicons)
- Mensagem de erro abaixo
- `isPassword` que adiciona toggle de visibilidade (olho aberto/fechado)
- Defaults sensatos: `autoCapitalize="none"`, `autoCorrect={false}`,
  `placeholderTextColor` correto pro dark mode

### 15.2 PrimaryButton

`src/components/PrimaryButton.tsx`. CTA com:
- Estado `loading` (mostra `ActivityIndicator`, bloqueia toque)
- `disabled` (50% opacity, bloqueia)
- Variants: `primary` (azul cheio), `secondary` (azul escuro), `ghost`
  (transparente com borda azul)
- Ícone à direita opcional

### 15.3 BarChart

`src/components/BarChart.tsx`. Mini gráfico de barras feito **só com View**
— sem `react-native-svg`. Como funciona:

```tsx
const max = Math.max(1, ...data.map(d => d.value));
<View style={{ height: `${(d.value / max) * 100}%` }} />
```

Cada barra é uma `View` com altura proporcional ao maior valor. Layout em
flex row com `alignItems: 'flex-end'` para crescer de baixo pra cima.

**Trade-off** vs SVG: não dá pra ter linhas curvas, áreas preenchidas com
gradiente, eixos com ticks. Mas para barras simples + labels, é suficiente
e evita a dep nativa. Quando precisar de algo mais sofisticado, instalamos
`react-native-svg` + `react-native-gifted-charts`.

### 15.4 ProgressRing

`src/components/ProgressRing.tsx`. Anel circular **placeholder** — borda
colorida + número no centro. A cor muda em função do ratio:
- < 30% → cinza (longe da meta)
- 30-70% → amarelo (a caminho)
- ≥ 70% → azul (perto/atingiu)

Anel REAL com arco proporcional exige `react-native-svg` para desenhar um
`<Circle>` com `strokeDasharray` + `strokeDashoffset` calculados pelo
perímetro. Quando trocarmos por SVG, a API do componente (`value`, `max`,
`label`) fica igual — só o interior muda.

---

## 15-bis. Deploy web na Vercel

Adicionamos suporte para publicar o app como **site web estático** na Vercel,
para mostrar funcionalidades a um cliente sem precisar do app no celular.

### O que é cada coisa (vocabulário antes do código)

- **Build web do Expo:** o Expo consegue empacotar o mesmo código React Native
  como uma **página web**. Por baixo, ele usa `react-native-web` (uma biblioteca
  que traduz `<View>` para `<div>`, `<Text>` para `<span>`, etc.). O resultado
  é uma pasta com `index.html` + JS + CSS — equivalente exato ao `dist/` que
  o `ng build` do Angular produz.
- **SPA (Single Page Application):** o site tem **um único HTML**. As "rotas"
  (Home, Evolução, Login) são trocadas pelo JavaScript no cliente, sem o
  servidor recarregar a página. Igual ao Angular. Está configurado no
  `app.json` com `"web": { "output": "single" }`.
- **Vercel:** serviço de hospedagem que pega uma pasta de arquivos estáticos
  e serve numa URL pública (com HTTPS, CDN, deploy automático ligado ao git).
  Equivalente "para frontend" do que seria um Netlify, Render, ou Firebase
  Hosting. Não é específico de React — qualquer build estático funciona.
- **`vercel.json`:** arquivo de configuração que diz à Vercel COMO fazer o
  build e QUAL pasta servir. Análogo distante: o `nginx.conf` num servidor
  próprio, ou o bloco `staticwebapp.config.json` da Azure.

### O que adicionamos

#### 1. Script no `package.json`

```json
"build:web": "expo export --platform web"
```

Esse comando roda o **bundler do Expo** (Metro) em modo "produção web" e
gera a pasta `dist/` com tudo otimizado (JS minificado, hashes nos arquivos
pra cache-busting). É o equivalente do `npm run build` num projeto Angular.

#### 2. `vercel.json` na raiz

```json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Linha a linha:**

- `buildCommand`: o que rodar para gerar o build. Apontamos para o script
  que acabamos de criar.
- `outputDirectory`: onde a Vercel vai achar os arquivos prontos depois do
  build. Tem que bater com o que o `expo export` gera (`dist`).
- `framework: null`: dizemos "não tente detectar Next.js / Angular / etc.,
  esse projeto é genérico". Sem isso, a Vercel pode tentar otimizações que
  não fazem sentido para um build do Expo.
- `rewrites`: **aqui mora a parte importante**. Em uma SPA, se o usuário
  digitar diretamente `https://app.vercel.app/profile` no navegador, o
  servidor não tem um arquivo chamado `profile` — só tem `index.html`. Sem
  o rewrite, a Vercel devolveria **404**. Com o rewrite, **qualquer URL**
  cai no `index.html`, o JavaScript carrega, lê a URL e renderiza a rota
  certa. É o "fallback to index.html" clássico de SPA.

  Analogia Angular: é o equivalente do `try_files $uri /index.html` no
  Nginx ou do `<rewrite>` no `web.config` do IIS quando você publica um
  Angular sem hash routing.

### Como subir

**Opção A — via GitHub (recomendado, deploy contínuo):**

1. Commit do código + push pro GitHub.
2. Em `vercel.com` → "Add New Project" → importa o repositório.
3. Na tela de configuração, a Vercel já vai ler o `vercel.json` e preencher
   tudo. Só clicar **Deploy**.
4. A cada `git push` na branch principal, ela rebuilda e publica sozinha.

**Opção B — via CLI (deploy avulso, sem GitHub):**

```bash
npm i -g vercel    # instala a CLI uma vez
vercel             # primeiro deploy (preview)
vercel --prod      # publica em produção
```

A CLI lê o `vercel.json` localmente e faz upload do build pronto.

### O que avisar pro cliente

- O app foi **desenhado para celular**. Abrir no celular ou no modo
  responsivo do DevTools (F12 → ícone de celular) é o ideal.
- **Login é mock:** qualquer email/senha entra.
  - Email começando com `p@` → entra como **personal trainer**
  - Qualquer outro email → entra como **aluno**
- Gestos de swipe (abrir drawer arrastando da borda) **não funcionam no
  web**. Use o botão de menu (hambúrguer) no canto superior esquerdo.
- Notificações (sino) e chat (mensagens) ainda são placeholders visuais.

### Limitações do build web

Alguns componentes do React Native não têm equivalente exato no web — o
`react-native-web` tenta aproximar mas pode ter diferenças visuais:

- `SafeAreaView` (que respeita notch do iPhone) vira um `<div>` comum no web
- `KeyboardAvoidingView` (que afasta o input do teclado) não faz nada no web
- Animações de transição entre telas são mais "duras" que no nativo
- O `react-native-reanimated` funciona mas com overhead maior

Para apresentação de funcionalidades isso não é problema. Para experiência
real, o caminho é o `npx expo start --tunnel` + Expo Go no celular.

---

## 16. Glossário rápido

| Termo | O que é | Análogo Angular |
|---|---|---|
| **Metro** | Bundler do React Native (empacota seu JS) | Webpack/esbuild do `ng build` |
| **Expo Go** | App genérico onde você testa seu projeto sem build nativo | — |
| **EAS** | Expo Application Services — builds nativos na cloud | — |
| **JSX** | Sintaxe que parece HTML mas vira chamadas de função | Templates `.html` (mas inline) |
| **Hook** | Função que adiciona "ciclo de vida"/state a um componente função | `ngOnInit`, `ngOnDestroy`, mas modular |
| **`useState`** | Hook para estado local reativo | `BehaviorSubject` privado |
| **`useEffect`** | Hook para efeitos colaterais (lifecycle) | `ngOnInit` + `ngOnDestroy` combinados |
| **Provider** | Componente que injeta contexto na árvore | `providers: [...]` em `app.config.ts` |
| **Ref** | Referência mutável a um elemento ou valor | `@ViewChild` (para refs de elemento) |
| **Native module** | Pacote npm que tem código Swift/Kotlin | Sem análogo direto no web |
| **DP** (density-independent pixel) | Unidade de tamanho visual em RN | `px` no web, mas escalado por densidade da tela |
| **Worklet** | Função JS que roda na thread de UI (animações 60fps) | Sem análogo |

---

## 17. Próximos passos planejados

Ordem sugerida (mudou bastante: front está praticamente pronto agora):

- [x] **Tipos do domínio** — `User`, `Workout`, `Exercise`, `WorkoutSession`,
  `HealthFeedback`, `ProgressSummary`
- [x] **Cliente Axios + interceptor JWT**
- [x] **`authService.login/register`** (mockado; versão real pronta no fim do arquivo)
- [x] **Zustand `authStore`** persistido no AsyncStorage
- [x] **`LoginScreen` + `RegisterScreen`**
- [x] **`AuthStack` vs `AppDrawer/PersonalDrawer`** — bifurcação do navigator
- [x] **Telas do aluno** — Home, Evolução, Mensagens, Perfil, Detalhe do exercício,
  Executar treino, Relatar dor
- [x] **Telas do personal** — Dashboard, Lista de alunos, Detalhe aluno,
  Montagem de treino, Perfil
- [x] **Charts** — `BarChart` (sem SVG) e `ProgressRing` (placeholder visual)
- [ ] **Backend real** — descomentar versão real em `authService.ts`, trocar
  imports de `mockData` por chamadas a services dedicados
- [ ] **`react-native-svg`** — anel de progresso real (com strokeDashoffset
  proporcional), gráficos com curvas
- [ ] **Notificações push** — Expo Notifications, integrar com o sino do header
- [ ] **Chat WebSocket/STOMP** — V2, substitui o preview da ContactScreen
- [ ] **Testes** — Jest + React Native Testing Library

---

## 18. Histórico de atualizações

| Data | Capítulo afetado | Resumo |
|---|---|---|
| 2026-05-02 | Cap 1 | Setup inicial: removeu expo-router, criou estrutura `src/`, configurou alias, criou App.tsx |
| 2026-05-02 | Cap 1 | Fix do `web.output: "static"` que quebrou `expo start` |
| 2026-05-03 | Cap 2 | Tela Home do aluno com mock data + componentes `Card` e `SectionHeader` |
| 2026-05-03 | Cap 3 | Drawer lateral com avatar+nome+logout, hambúrguer no header, telas placeholder Progress/Contact |
| 2026-05-03 | Seção 0 | Adicionado briefing de retomada — auto-suficiente para nova sessão |
| 2026-05-13 | Cap 4 | Tipos do domínio (`User`, `Workout`, `Exercise`, ...) em `src/types/domain.ts` |
| 2026-05-13 | Cap 5 | Cliente Axios + interceptor JWT + `authService` (com versão real comentada) |
| 2026-05-13 | Cap 6 | `authStore` Zustand persistido em AsyncStorage; hooks seletores `useUser`, `useIsAuthenticated`, `useAuthHydrated` |
| 2026-05-13 | Cap 7 | `AuthStack`: LoginScreen + RegisterScreen (com seletor de role) + componentes `TextField` e `PrimaryButton` |
| 2026-05-13 | Cap 8 | Bifurcação do RootNavigator: Auth / StudentApp / PersonalApp + SplashScreen durante hidratação |
| 2026-05-13 | Cap 9 | Fluxo do aluno: `StudentHomeStack` (ExerciseDetail, WorkoutSession, ReportPain), ProfileScreen; HomeScreen ligada ao store; ProgressScreen real; ContactScreen real |
| 2026-05-13 | Cap 10 | Fluxo do personal: `PersonalDrawer` + DashboardScreen, StudentListScreen (com busca/useMemo), StudentDetailScreen, WorkoutBuilderScreen |
| 2026-05-13 | Cap 11 | Componentes reusáveis: `TextField`, `PrimaryButton`, `BarChart`, `ProgressRing` |
| 2026-05-13 | Seção 0 | Briefing atualizado com nova estrutura de arquivos e mocks pendentes |
| 2026-05-13 | Seção 0.2 | Regra 7 adicionada: NÃO usar jargão RN/React sem traduzir com analogia Angular |
| 2026-05-13 | Cap 15-bis | Deploy web na Vercel: `vercel.json` + script `build:web`, com explicação de SPA/rewrite |
