import { useState, type ReactNode } from 'react';
import { PORTRAIT_BACKDROPS, PORTRAITS, SCENES } from '../assets';
import { ChoicePicker, OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, MediaQuote } from '../components/Dock';
import { useNarrateOnce, useSpeakOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { NARRATION, PAGE_META, STAKEHOLDERS, UI } from '../sim/content';
import { stakeholderExtras } from '../sim/derive';
import { useSim } from '../sim/store';
import type { StakeholderId } from '../sim/types';

// Screens 5a–5d — the stakeholder and their words are on the media; the dock holds the reply.

const thumbnail = (id: StakeholderId) => (id === 'regulator' ? SCENES.regulator.src : PORTRAITS[id].src);

export function Page06Stakeholders() {
  const { sim, dispatch } = useSim();
  const [showing, setShowing] = useState<StakeholderId | null>(null);
  const [ctx, setCtx] = useState(false);
  const firstOpen = STAKEHOLDERS.find((s) => !sim.stakeholderResponses[s.id]);
  const active = STAKEHOLDERS.find((s) => s.id === showing) ?? firstOpen ?? STAKEHOLDERS[STAKEHOLDERS.length - 1];
  const answer = sim.stakeholderResponses[active.id];
  const index = STAKEHOLDERS.indexOf(active);

  // The first stakeholder speaks once the page narration has finished.
  const introDone = useNarrateOnce('stakeholders-load', NARRATION.stakeholdersLoad);
  useSpeakOnce(`stakeholder-${active.id}`, active.line, !answer && (index > 0 || introDone));

  const remembered = STAKEHOLDERS.filter((s) => s.id !== active.id && sim.stakeholderResponses[s.id]);
  const portrait = active.id === 'regulator' ? null : PORTRAITS[active.id];
  const backdrop = active.id === 'regulator' ? null : PORTRAIT_BACKDROPS[active.id];

  let body: ReactNode;
  if (ctx) {
    body = (
      <ContextView onBack={() => setCtx(false)}>
        <p className="context-title">
          {active.name} · {active.role}
        </p>
        <p>{active.situation}</p>
      </ContextView>
    );
  } else if (answer) {
    body = (
      <OutcomeCard
        chosen={active.short[answer]}
        text={active.reaction[answer]}
        extra={stakeholderExtras(active.id, answer, sim)}
        feedback={active.feedback}
        continueLabel={firstOpen ? `Next: ${firstOpen.name}` : 'Continue'}
        onContinue={() => {
          setCtx(false);
          if (firstOpen) setShowing(null);
          else dispatch({ type: 'GO', page: 7 });
        }}
      />
    );
  } else {
    body = (
      <ChoicePicker
        key={active.id}
        prompt={UI.respond}
        labels={active.short}
        options={active.options}
        seed={sim.seed}
        shuffleKey={`stakeholder-${active.id}`}
        confirmLabel="Respond"
        onConfirm={(opt) => {
          dispatch({ type: 'CHOOSE_STAKEHOLDER', id: active.id, opt });
          setShowing(active.id);
        }}
      />
    );
  }

  return (
    <Stage
      image={backdrop ?? SCENES.regulator}
      label="Stakeholder pressure"
      chapter={index === 0 && !answer ? { title: PAGE_META[6].title, subtitle: PAGE_META[6].subtitle } : undefined}
      quote={!answer ? <MediaQuote key={active.id} speaker={`${active.name} · ${active.role}`} text={active.line} /> : undefined}
      overlay={
        portrait ? (
          <figure className="portrait-card" key={active.id}>
            <img src={portrait.src} alt={portrait.alt} />
            <figcaption className="portrait-card__meta">
              <p className="portrait-card__name">{active.name}</p>
              <p className="portrait-card__role">{active.role}</p>
            </figcaption>
          </figure>
        ) : undefined
      }
    >
      <DockHeader
        page={6}
        title="Stakeholders"
        steps={STAKEHOLDERS.length}
        current={index + (answer ? 1 : 0)}
        onContext={() => setCtx((c) => !c)}
        contextOpen={ctx}
        aside={
          remembered.length > 0 ? (
            <span className="avatars" role="img" aria-label={`They'll remember: ${remembered.map((s) => s.name).join(', ')}`}>
              {remembered.map((s) => {
                const opt = sim.stakeholderResponses[s.id];
                return <img key={s.id} src={thumbnail(s.id)} alt="" title={`${s.name}: ${opt ? s.short[opt] : ''}`} />;
              })}
            </span>
          ) : null
        }
      />
      {body}
    </Stage>
  );
}
