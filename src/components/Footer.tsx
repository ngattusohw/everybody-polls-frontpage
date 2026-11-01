import { Link } from 'react-router-dom';
import { Brand } from './Navbar';

export default function Footer() {
  return <footer className="site-footer"><div className="section-shell"><div className="footer-main"><Link to="/" aria-label="Everybody Polls home"><Brand light /></Link><p>A little question.<br />A little closer together.</p><div className="footer-links"><Link to="/privacy">Privacy policy</Link><Link to="/delete">Account deletion</Link><a href="/#sample-poll">Explore a sample ↗</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Everybody Polls</span><span>For curious people, everywhere.</span></div></div></footer>;
}
