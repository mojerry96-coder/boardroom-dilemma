import { useEffect, useRef, type ComponentType } from 'react';
import { DebugPanel } from './components/Debug';
import { CaptionBar, NarrationLive, useNarration } from './components/Narration';
import { TopBar } from './components/TopBar';
import { Page01Intro } from './pages/Page01Intro';
import { Page02Role } from './pages/Page02Role';
import { Page03Evidence } from './pages/Page03Evidence';
import { Page04Crisis } from './pages/Page04Crisis';
import { Page05Accountability } from './pages/Page05Accountability';
import { Page06Stakeholders } from './pages/Page06Stakeholders';
import { Page07Executive } from './pages/Page07Executive';
import { Page08BoardCase } from './pages/Page08BoardCase';
import { Page09BoardQA } from './pages/Page09BoardQA';
import { Page10Outcome } from './pages/Page10Outcome';
import { PAGE_META } from './sim/content';
import { useSim } from './sim/store';

const PAGES: ComponentType[] = [
  Page01Intro,
  Page02Role,
  Page03Evidence,
  Page04Crisis,
  Page05Accountability,
  Page06Stakeholders,
  Page07Executive,
  Page08BoardCase,
  Page09BoardQA,
  Page10Outcome,
];

const debug = new URLSearchParams(window.location.search).has('debug');

export default function App() {
  const { sim, ready } = useSim();
  const { stop } = useNarration();
  const firstPage = useRef(true);

  useEffect(() => {
    if (!ready) return;
    document.title = `${PAGE_META[sim.page].title} — The Boardroom Dilemma`;
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    stop();
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [sim.page, ready, stop]);

  if (!ready) return <div className="loading">Loading…</div>;

  const Page = PAGES[sim.page - 1] ?? Page01Intro;

  return (
    <div className="app">
      <a className="skip-link" href="#controls">
        Skip to controls
      </a>
      <TopBar page={sim.page} />
      <Page key={`${sim.runId}-${sim.page}`} />
      <CaptionBar />
      <NarrationLive />
      {debug && <DebugPanel />}
    </div>
  );
}
