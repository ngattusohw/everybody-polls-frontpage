import { ArrowRight, Check, MousePointer2, Target, Users } from 'lucide-react';

export function FeaturesSection() {
  return <section className="how-section section-shell" id="how-it-works">
    <div className="section-heading"><div><p className="eyebrow">THE GOOD KIND OF TAKING SIDES</p><h2>A small ritual.<br />A fun little reveal.</h2></div><p>A poll takes a moment.<br />The second guess is what makes it interesting.</p></div>
    <div className="how-steps">
      <article className="how-step"><div className="step-visual vote-visual" aria-hidden="true"><span className="mini-choice"><Check size={24} /></span><span className="mini-choice" /><MousePointer2 className="demo-pointer" size={37} fill="white" /></div><p className="step-number">01 / YOUR OPINION</p><h3>Pick your side.</h3><p>Go with your gut. Choose the answer that feels most like you.</p><ArrowRight className="step-arrow" size={22} aria-hidden="true" /></article>
      <article className="how-step"><div className="step-visual predict-visual" aria-hidden="true"><Users size={46} strokeWidth={1.5} /><span className="thought-bubble"><Target size={22} /></span></div><p className="step-number">02 / YOUR PREDICTION</p><h3>Read the room.</h3><p>Make a separate guess. Which answer do you think everyone else will pick?</p><ArrowRight className="step-arrow" size={22} aria-hidden="true" /></article>
      <article className="how-step"><div className="step-visual reveal-visual" aria-hidden="true"><span /><span /><span /><span /><i className="reveal-line" /></div><p className="step-number">03 / THE BIG REVEAL</p><h3>See where we land.</h3><p>When a poll closes, explore the results. Did you see the majority coming?</p></article>
    </div>
  </section>;
}
