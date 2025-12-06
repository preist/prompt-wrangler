import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
import '../styles/main.scss';
import Howdy from './Howdy';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Howdy />
  </StrictMode>
);
