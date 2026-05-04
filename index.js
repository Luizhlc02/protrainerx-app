import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e cuida de inicializações específicas do Expo (ambiente Expo Go vs build nativo).
// Equivale ao bootstrapApplication(AppComponent) do Angular: é o ponto único
// onde o framework descobre qual é o componente raiz a renderizar.
registerRootComponent(App);
