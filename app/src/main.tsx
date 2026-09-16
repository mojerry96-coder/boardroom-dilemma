import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IconContext } from '@phosphor-icons/react';
import '@fontsource/afacad/400.css';
import '@fontsource/afacad/600.css';
import '@fontsource/afacad/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import './styles/tokens.css';
import './styles/shared.css';
import './styles/stage.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/experience.css';
import './styles/responsive.css';
import App from './App';
import { NarrationProvider } from './components/Narration';
import { SimProvider } from './sim/store';

// Repeat visits and flaky connections: media and app files are kept in a local cache (production only).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    {/* One icon family, one default size and weight everywhere. */}
    <IconContext.Provider value={{ size: 20, weight: 'bold' }}>
      <NarrationProvider>
        <SimProvider>
          <App />
        </SimProvider>
      </NarrationProvider>
    </IconContext.Provider>
  </StrictMode>,
);
