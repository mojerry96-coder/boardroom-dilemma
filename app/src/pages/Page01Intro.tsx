import { useState } from 'react';
import { FILMS, SCENES } from '../assets';
import { usePageIntro } from '../components/Experience';
import { FilmPlayer } from '../components/FilmPlayer';
import { SimulationStage } from '../components/SimulationStage';
import { PillButton, StageCopy, TextLink } from '../components/ui';
import { BRAND, INTRO_FILM, PAGE_META } from '../sim/content';
import { OBJECTIVES } from '../sim/experience';
import { useSim } from '../sim/store';

// Page 01 — A Governance Crisis (spec §12). The film opens behind a 3-2-1 countdown.

export function Page01Intro() {
  const { dispatch } = useSim();
  const [film, setFilm] = useState(false);
  const intro = usePageIntro('landing', null);
  const next = () => dispatch({ type: 'GO', page: 2 });

  return (
    <>
      <SimulationStage page={1} image={SCENES.intro} label="A Governance Crisis">
        <StageCopy
          className="page01__copy"
          eyebrow={BRAND.eyebrow}
          title={PAGE_META[1].title}
          subtitle={PAGE_META[1].subtitle}
          objective={OBJECTIVES[1]}
          intro={intro}
        >
          <div className="stage-actions">
            <PillButton onClick={() => setFilm(true)}>Play Intro</PillButton>
            <TextLink onClick={next}>Skip cinematic</TextLink>
          </div>
        </StageCopy>
      </SimulationStage>
      {film && <FilmPlayer title="The Boardroom Dilemma" cues={INTRO_FILM} video={FILMS.intro} onEnd={next} skipLabel="Skip cinematic" countdown={3} />}
    </>
  );
}
