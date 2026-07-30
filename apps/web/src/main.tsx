import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

import { recordVisit } from './services/visitorService';

// Record visitor when the app starts
recordVisit();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Check index.html for <div id="root"></div>.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);