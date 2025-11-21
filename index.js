import { registerRootComponent } from 'expo';
// Agora importando diretamente de './App.js' (que agora contém toda a lógica)
import App from './App.js';

// Registra o componente raiz do seu aplicativo
registerRootComponent(App);