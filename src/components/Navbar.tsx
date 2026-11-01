import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Brand({ light = false }: { light?: boolean }) {
  return <span className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-bubbles" aria-hidden="true"><i /><i /></span><span>everybody<span className="brand-second">polls</span></span></span>;
}

export default function Navbar() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><nav className="section-shell nav-inner" aria-label="Main navigation"><Link to="/" aria-label="Everybody Polls home"><Brand /></Link><div className="nav-links"><a href="/#how-it-works">How it works</a><a href="/#little-questions">Little questions</a><a href="/#ios" className="nav-ios">iOS is on its way <span /></a></div><a className="nav-cta" href="/#sample-poll">Try a sample <ArrowUpRight size={16} /></a></nav></header></>;
}
