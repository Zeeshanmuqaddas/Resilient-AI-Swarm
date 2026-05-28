import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectSwarmPrompt } from './lib/swarmPrompt';

// Inject the HERMES RESILIENCE-X system-level prompt into a globally accessible hidden config
injectSwarmPrompt();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
