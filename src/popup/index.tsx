import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
// eslint-disable-next-line no-restricted-imports
import '../styles/main.scss';
import { App } from '@popup/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
