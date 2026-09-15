import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/afacad/400.css';
import '@fontsource/afacad/600.css';
import '@fontsource/afacad/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import './styles.css';
import App from './App';
import { NarrationProvider } from './components/Narration';
import { SimProvider } from './sim/store';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <NarrationProvider>
      <SimProvider>
        <App />
      </SimProvider>
    </NarrationProvider>
  </StrictMode>,
);
