# 📘 Aula — Construindo o App de Treino (React Native + Expo)

> Documento de apoio ao desenvolvimento. Atualizado a cada mudança significativa
> no projeto. Leia com calma — os capítulos estão em ordem cronológica.
>
> **Para quem é:** Luiz, dev fullstack Angular/Spring aprendendo React Native.
> Sempre que possível, conceitos novos são comparados ao mundo Angular/Spring.
>
> **Última atualização:** capítulo 3 — Menu lateral (Drawer Navigator).

---

## Sumário

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Stack escolhida e por quê](#2-stack-escolhida-e-por-quê)
3. [Anatomia de um projeto Expo](#3-anatomia-de-um-projeto-expo)
4. [Conceitos fundamentais do React Native](#4-conceitos-fundamentais-do-react-native)
5. [Capítulo 1 — Setup inicial (o que rodamos e por quê)](#5-capítulo-1--setup-inicial)
6. [Capítulo 2 — Tela Home do aluno](#6-capítulo-2--tela-home-do-aluno)
7. [Capítulo 3 — Menu lateral (Drawer Navigator)](#7-capítulo-3--menu-lateral-drawer-navigator)
8. [Glossário rápido](#8-glossário-rápido)
9. [Próximos passos planejados](#9-próximos-passos-planejados)
10. [Histórico de atualizações](#10-histórico-de-atualizações)

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

## 8. Glossário rápido

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

## 9. Próximos passos planejados

Em ordem sugerida (pode mudar conforme decidirmos juntos):

- [ ] **Anel de progresso real + gráfico de linha** — instalar
  `react-native-svg` e uma lib de chart. Substituir os 2 placeholders da Home
- [ ] **Tipos do domínio** (`src/types/`) — `User`, `Workout`, `Exercise`,
  `WorkoutSession`, `HealthFeedback` espelhando os DTOs do Spring
- [ ] **Cliente Axios + interceptor JWT** (`src/services/api.ts`)
- [ ] **`authService.login()`** falando com `POST /auth/login` do backend
- [ ] **Zustand `authStore`** persistido no AsyncStorage
- [ ] **`LoginScreen`** (`src/screens/auth/LoginScreen.tsx`)
- [ ] **`AuthStack` vs `AppStack`** — bifurcação do navigator pelo estado de
  auth (padrão clássico em apps mobile)
- [ ] **Bottom tab navigator** para o aluno (Home / Evolução / Chat)
- [ ] **Telas restantes do aluno** — Detalhe do exercício, Registrar treino,
  Meu progresso, Relatar dor
- [ ] **Telas do personal** — Dashboard, Lista de alunos, Montagem de treino,
  Acompanhamento de aluno
- [ ] **Chat WebSocket/STOMP** — V2

---

## 10. Histórico de atualizações

| Data | Capítulo afetado | Resumo |
|---|---|---|
| 2026-05-02 | Capítulo 1 | Setup inicial completo: removeu expo-router, criou estrutura `src/`, configurou alias, criou App.tsx |
| 2026-05-02 | Capítulo 1 | Fix do `web.output: "static"` que quebrou `expo start` |
| 2026-05-03 | Capítulo 2 | Tela Home do aluno com mock data + componentes `Card` e `SectionHeader` |
| 2026-05-03 | Capítulo 3 | Drawer lateral com avatar+nome+logout, hambúrguer no header, telas placeholder Progress/Contact |
