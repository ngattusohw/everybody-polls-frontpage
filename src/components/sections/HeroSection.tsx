import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, RotateCcw, Smartphone } from 'lucide-react';
import { PollArtwork, type Artwork } from '../PollArtwork';

export interface SamplePoll {
  id: string;
  question: string;
  options: [string, string];
  art: [Artwork, Artwork];
  percentages: [number, number];
}

export const SAMPLE_POLLS: SamplePoll[] = [
  { id: 'day', question: 'Early bird or night owl?', options: ['Early bird', 'Night owl'], art: ['sun', 'moon'], percentages: [42, 58] },
  { id: 'food', question: 'A sweet treat or a savory snack?', options: ['Something sweet', 'Something savory'], art: ['sweet', 'savory'], percentages: [54, 46] },
  { id: 'getaway', question: 'Where would you rather get away?', options: ['By the beach', 'In the mountains'], art: ['beach', 'mountain'], percentages: [61, 39] },
];

function SampleBallot({ poll }: { poll: SamplePoll }) {
  const [stage, setStage] = useState(0);
  const [vote, setVote] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const winner = poll.percentages[0] > poll.percentages[1] ? 0 : 1;
  const reset = () => { setStage(0); setVote(null); setPrediction(null); };

  return (
    <div className="ballot-console" id="sample-poll">
      <div className="console-topline"><span><i /> THE PRACTICE POLL</span><span>Demo mode</span></div>
      <ol className="ballot-steps" aria-label="Sample poll progress">
        {['Vote', 'Predict', 'Reveal'].map((label, index) => <li key={label} className={stage === index ? 'current' : stage > index ? 'complete' : ''} aria-current={stage === index ? 'step' : undefined}><span>{stage > index ? <Check size={11} strokeWidth={3} /> : index + 1}</span>{label}</li>)}
      </ol>
      <div className="ballot-content" aria-live="polite">
        <p className="ballot-prompt">{stage === 0 ? 'First, what’s your pick?' : stage === 1 ? 'Now, read the room.' : 'And the crowd says…'}</p>
        <h2 id="sample-question" tabIndex={-1}>{stage === 1 ? 'Which will everybody choose?' : poll.question}</h2>
        {stage < 2 ? <div className="ballot-options">
          {poll.options.map((option, index) => <button key={option} className={`ballot-option option-${index}`} onClick={() => {
            if (stage === 0) { setVote(index); setStage(1); }
            else { setPrediction(index); setStage(2); }
          }} aria-label={`${stage === 0 ? 'Vote for' : 'Predict'} ${option}`}>
            <PollArtwork kind={poll.art[index]} />
            <span>{option}</span>
            <span className="option-select">{stage === 1 ? 'Predict this' : 'That’s me'} <ArrowUpRight size={15} /></span>
          </button>)}
        </div> : <div className="sample-reveal">
          <div className="sample-result-options">{poll.options.map((option, index) => <div key={option} className={`sample-result option-${index}`}><PollArtwork kind={poll.art[index]} /><span>{option}</span><strong>{poll.percentages[index]}<small>%</small></strong></div>)}</div>
          <div className="sample-result-bar" aria-label={`Illustrative split: ${poll.options[0]} ${poll.percentages[0]} percent, ${poll.options[1]} ${poll.percentages[1]} percent`}><span style={{ width: `${poll.percentages[0]}%` }} /><span style={{ width: `${poll.percentages[1]}%` }} /></div>
          <p className="prediction-outcome">{prediction === winner ? 'You read this imaginary room!' : 'Even an imaginary crowd can surprise you.'}</p>
          <p className="sample-disclosure">Illustrative percentages, not real community votes.</p>
        </div>}
        <div className="ballot-bottom">
          {stage === 0 ? <span>Two choices. No wrong answer.</span> : stage === 1 ? <span>Your pick: <strong>{poll.options[vote!]}</strong></span> : <span>Your pick: <strong>{poll.options[vote!]}</strong></span>}
          {stage > 0 && <button className="reset-sample" onClick={reset} aria-label="Restart sample poll"><RotateCcw size={14} /> Start over</button>}
        </div>
      </div>
      <div className="console-caption"><span className="caption-dot" /> Just a sample. Nothing is submitted or saved.</div>
    </div>
  );
}

export function HeroSection({ poll }: { poll: SamplePoll }) {
  return <section className="hero-section">
    <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
    <div className="section-shell hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span className="tiny-spark">✳</span> A LITTLE QUESTION. A NEW CONNECTION.</p>
        <h1>Two choices.<br />A whole lot<br />{' '}of <span className="us-word">us.<svg viewBox="0 0 140 20" aria-hidden="true"><path d="M4 12Q63 1 133 10" /></svg></span></h1>
        <p className="hero-description">Pick your side. Predict the crowd.<br className="desktop-break" /> Discover what we have in common.</p>
        <div className="hero-actions"><a className="primary-button" href="#sample-poll">Explore a sample <ArrowUpRight size={19} /></a><a className="text-button" href="#how-it-works">How it works <ChevronDown size={17} /></a></div>
        <p className="ios-note"><Smartphone size={17} /> Made for iOS. A fresh build is in progress.</p>
      </div>
      <div className="hero-demo"><div className="floating-note"><span aria-hidden="true">↙</span> Go on, pick a side.</div><SampleBallot key={poll.id} poll={poll} /><div className="hero-demo-footnote"><span className="mini-bubbles" aria-hidden="true"><i /><i /><i /></span> Your opinion is only half the fun.</div></div>
    </div>
    <div className="hero-bottom"><span>EVERYDAY QUESTIONS</span><span className="divider-dot" /><span>UNEXPECTED CONNECTIONS</span><span className="divider-dot" /><span>A LITTLE FRIENDLY GUESSWORK</span></div>
  </section>;
}

export function SampleQuestionLink({ onClick }: { onClick: () => void }) {
  return <button className="text-button" onClick={onClick}>Try this question <ArrowRight size={17} /></button>;
}
