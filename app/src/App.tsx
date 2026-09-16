import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { DebugPanel } from './components/Debug';
import { ChapterCard, ExperienceContext } from './components/Experience';
import { LogoSplash } from './components/LogoSting';
import { BackgroundMusic } from './components/Music';
import { CaptionBar, NarrationLive, useNarration } from './components/Narration';
import { Page01Intro } from './pages/Page01Intro';
import { warmPage } from './preload';
import { PAGE_META } from './sim/content';
import { CHAPTERS } from './sim/experience';
import { useSim } from './sim/store';

// Page 1 ships with the app. The others download when needed, and the next one is fetched ahead of time.
type PageModule = Promise<{ default: ComponentType }>;
const named = (load: () => Promise<Record<string, unknown>>, name: string) => (): PageModule =>
  load().then((m) => ({ default: m[name] as ComponentType }));
const LOADERS: (() => PageModule)[] = [
  async () => ({ default: Page01Intro }),
  named(() => import('./pages/Page02Role'), 'Page02Role'),
  named(() => import('./pages/Page03Evidence'), 'Page03Evidence'),
  named(() => import('./pages/Page04Crisis'), 'Page04Crisis'),
  named(() => import('./pages/Page05Accountability'), 'Page05Accountability'),
  named(() => import('./pages/Page06Stakeholders'), 'Page06Stakeholders'),
  named(() => import('./pages/Page07Executive'), 'Page07Executive'),
  named(() => import('./pages/Page08BoardCase'), 'Page08BoardCase'),
  named(() => import('./pages/Page09BoardQA'), 'Page09BoardQA'),
  named(() => import('./pages/Page10Outcome'), 'Page10Outcome'),
];
const PAGES: (ComponentType | LazyExoticComponent<ComponentType>)[] = LOADERS.map((load, i) => (i === 0 ? Page01Intro : lazy(load)));

const debug = new URLSearchParams(window.location.search).has('debug');
const SPLASH_KEY = 'boardroom-dilemma:splash-shown';

export default function App() {
  const { sim, ready } = useSim();
  const { stop } = useNarration();
  const lastPage = useRef<number | null>(null);
  const [chapterPage, setChapterPage] = useState<number | null>(null);
  // The logo opens the simulation once per browser session, covering the initial load.
  const [splash, setSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_KEY);
    } catch {
      return true;
    }
  });
  const endSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* ignore */
    }
    setSplash(false);
  }, []);

  // Every arrival on a page (including resuming a saved run) opens with its chapter card.
  useLayoutEffect(() => {
    if (!ready) return;
    document.title = `${PAGE_META[sim.page].title} — The Boardroom Dilemma`;
    if (lastPage.current === sim.page) return;
    const first = lastPage.current === null;
    lastPage.current = sim.page;
    if (!first) {
      stop();
      window.scrollTo(0, 0);
    }
    setChapterPage(CHAPTERS[sim.page] ? sim.page : null);
  }, [sim.page, ready, stop]);

  // Focus the page title once the chapter card has gone (or the page itself when the title is still hidden).
  useEffect(() => {
    if (!ready || splash || chapterPage !== null) return;
    const id = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>('[data-page-title]') ?? document.querySelector<HTMLElement>('main');
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(id);
  }, [chapterPage, sim.page, ready, splash]);

  // Fetch this page's media straight away, and the next page's code and media once things are quiet.
  useEffect(() => {
    if (!ready) return;
    warmPage(sim.page);
    const id = window.setTimeout(() => {
      warmPage(sim.page + 1);
      void LOADERS[sim.page]?.();
    }, 2500);
    return () => window.clearTimeout(id);
  }, [sim.page, ready]);

  if (splash) return <LogoSplash ready={ready} onDone={endSplash} />;
  if (!ready) return <div className="loading">Loading…</div>;

  const Page = PAGES[sim.page - 1] ?? Page01Intro;

  return (
    <ExperienceContext.Provider value={{ chapterActive: chapterPage !== null }}>
      <div className="app">
        <a className="skip-link" href="#controls">
          Skip to controls
        </a>
        <Suspense fallback={<div className="sim-stage" aria-busy="true" />}>
          <Page key={`${sim.runId}-${sim.page}`} />
        </Suspense>
        {chapterPage !== null && <ChapterCard key={`${sim.runId}-${chapterPage}`} page={chapterPage} onDone={() => setChapterPage(null)} />}
        {chapterPage === null && <CaptionBar />}
        <BackgroundMusic page={sim.page} chapterActive={chapterPage !== null} />
        <NarrationLive />
        {debug && <DebugPanel />}
      </div>
    </ExperienceContext.Provider>
  );
}
