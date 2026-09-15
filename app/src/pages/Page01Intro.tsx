import { useState } from 'react';
import { FILMS, SCENES } from '../assets';
import { FilmPlayer } from '../components/FilmPlayer';
import { PlayIcon } from '../components/Icons';
import { Stage } from '../components/Stage';
import { INTRO_FILM, PAGE_META } from '../sim/content';
import { useSim } from '../sim/store';

export function Page01Intro() {
  const { dispatch } = useSim();
  const [film, setFilm] = useState(false);
  const next = () => dispatch({ type: 'GO', page: 2 });

  return (
    <>
      <Stage image={SCENES.intro} label="Intro">
        <div>
          <p className="eyebrow">The Boardroom Dilemma</p>
          <h1 className="hero-title" tabIndex={-1} data-page-title>
            {PAGE_META[1].title}
          </h1>
          <p className="dock__lead" style={{ marginTop: 8 }}>
            {PAGE_META[1].subtitle}
          </p>
        </div>
        <div className="row">
          <button type="button" className="btn btn--primary btn--large" onClick={() => setFilm(true)}>
            <PlayIcon />
            Play Intro
          </button>
          <button type="button" className="btn btn--link" onClick={next}>
            Skip intro
          </button>
        </div>
      </Stage>
      {film && <FilmPlayer title="Intro film" cues={INTRO_FILM} video={FILMS.intro} onEnd={next} skipLabel="Skip intro" />}
    </>
  );
}
