import { pictureSources } from './assets';

// Loading for slow networks. Constrained connections get the lighter film rendition; everything the
// player is about to need is fetched quietly ahead of time; voice clips are downloaded once and replayed
// from memory. Good connections always receive full-quality media.

interface NetworkInformation {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
}

const SLOW_KEY = 'boardroom-dilemma:slow-network';

const connection = (): NetworkInformation | undefined =>
  typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { connection?: NetworkInformation }).connection;

export const saveData = () => !!connection()?.saveData;

/** Data saver, a 2G/3G connection, very low bandwidth, or a film that already struggled this session. */
export function isConstrainedNetwork() {
  const c = connection();
  if (c?.saveData) return true;
  if (c?.effectiveType && /2g|3g/.test(c.effectiveType)) return true;
  if (c?.downlink && c.downlink < 1.5) return true;
  try {
    return sessionStorage.getItem(SLOW_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSlowNetwork() {
  try {
    sessionStorage.setItem(SLOW_KEY, '1');
  } catch {
    /* ignore */
  }
}

const whenIdle = (fn: () => void) => {
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (idle) idle(fn, { timeout: 3000 });
  else window.setTimeout(fn, 1200);
};

const clips = new Map<string, Promise<string>>();

/** Downloads an audio clip once and returns an object URL, so pre-fetched or repeated lines start instantly. */
export function loadClip(url: string): Promise<string> {
  let clip = clips.get(url);
  if (!clip) {
    clip = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        return res.blob();
      })
      .then((blob) => URL.createObjectURL(blob));
    clip.catch(() => clips.delete(url));
    clips.set(url, clip);
  }
  return clip;
}

const warmed = new Set<string>();

/** Fetch images and voice clips ahead of time, when the browser is idle. Skipped when data saver is on. */
export function warm(urls: string[]) {
  if (typeof window === 'undefined' || saveData()) return;
  const todo = urls.filter((url) => url && !warmed.has(url));
  if (!todo.length) return;
  todo.forEach((url) => warmed.add(url));
  whenIdle(() => {
    for (const url of todo) {
      if (/\.(avif|webp|jpe?g|png)$/i.test(url)) {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
      } else {
        loadClip(url).catch(() => warmed.delete(url));
      }
    }
  });
}

/** Pre-fetch a photo in the same format and size the page will pick (AVIF, WebP or JPEG). */
export function warmPicture(src: string) {
  if (typeof window === 'undefined' || saveData() || warmed.has(src)) return;
  warmed.add(src);
  whenIdle(() => {
    const sources = pictureSources(src);
    const picture = document.createElement('picture');
    if (sources) {
      for (const [type, srcset] of [
        ['image/avif', sources.avif],
        ['image/webp', sources.webp],
      ]) {
        if (!srcset) continue;
        const source = document.createElement('source');
        source.type = type;
        source.srcset = srcset;
        source.sizes = '100vw';
        picture.appendChild(source);
      }
    }
    const img = document.createElement('img');
    img.decoding = 'async';
    picture.appendChild(img);
    img.src = src;
  });
}
