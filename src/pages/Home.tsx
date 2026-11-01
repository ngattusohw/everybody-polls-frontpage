import { useState } from 'react';
import { ArrowUpRight, Heart, Smartphone } from 'lucide-react';
import { HeroSection, SAMPLE_POLLS, SampleQuestionLink, type SamplePoll } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PollArtwork } from '@/components/PollArtwork';

export default function Home() {
  const [poll, setPoll] = useState<SamplePoll>(SAMPLE_POLLS[0]);
  const chooseSample = (next: SamplePoll) => {
    setPoll(next);
    requestAnimationFrame(() => {
      document.getElementById('sample-poll')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
      document.getElementById('sample-question')?.focus({ preventScroll: true });
    });
  };

  return <main className="home-page">
    <HeroSection poll={poll} />
    <FeaturesSection />
    <section className="curiosity-section" id="little-questions"><div className="section-shell">
      <div className="curiosity-intro"><p className="eyebrow">SERIOUSLY CURIOUS. NEVER TOO SERIOUS.</p><h2>Life’s little debates.<br /><span>Everybody’s invited.</span></h2><p>The everyday choices that make us, us.<br />Try another sample and see how it feels.</p></div>
      <div className="question-examples">
        <article className="question-example food-example"><div className="example-topline"><span>FOOD FOR THOUGHT</span><span>Sample 02</span></div><h3>A sweet treat<br />or a savory snack?</h3><div className="example-art" aria-hidden="true"><PollArtwork kind="sweet" /><span>or</span><PollArtwork kind="savory" /></div><SampleQuestionLink onClick={() => chooseSample(SAMPLE_POLLS[1])} /></article>
        <article className="question-example getaway-example"><div className="example-topline"><span>A CHANGE OF SCENERY</span><span>Sample 03</span></div><h3>Beach days<br />or mountain air?</h3><div className="example-art" aria-hidden="true"><PollArtwork kind="beach" /><span>or</span><PollArtwork kind="mountain" /></div><SampleQuestionLink onClick={() => chooseSample(SAMPLE_POLLS[2])} /></article>
      </div>
      <p className="community-thought"><Heart size={17} /> A different answer can be the start of a good conversation.</p>
    </div></section>
    <section className="ios-section section-shell" id="ios"><div className="ios-copy"><p className="eyebrow">A FAMILIAR FEELING. A FRESH START.</p><h2>A little more curious.<br />A little more connected.</h2><p>Everybody Polls is being built for iOS first. We’re getting the next build ready, one little question at a time.</p><a className="primary-button" href="#sample-poll">One more sample? <ArrowUpRight size={19} /></a><span className="build-status"><span /> iOS build in progress</span></div><div className="ios-illustration" aria-hidden="true"><div className="phone-outline"><div className="phone-speaker" /><div className="phone-mini-brand"><span className="brand-bubbles"><i /><i /></span> everybody<br />polls</div><div className="phone-question">What brings<br />us together?</div><div className="phone-choices"><span><Heart size={30} strokeWidth={1.5} /></span><span><Smartphone size={30} strokeWidth={1.5} /></span></div><div className="phone-home" /></div><span className="phone-orbit orbit-left" /><span className="phone-orbit orbit-right" /><span className="little-plus plus-one">+</span><span className="little-plus plus-two">+</span></div></section>
  </main>;
}
