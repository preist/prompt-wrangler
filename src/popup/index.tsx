import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
import '../styles/main.scss';
import Log from './Log';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Log />
  </StrictMode>
);
