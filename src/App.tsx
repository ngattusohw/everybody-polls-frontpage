import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
const Delete = lazy(() => import('./pages/Delete'));
const SharedResults = lazy(() => import('./pages/SharedResults'));

function App() {
  return <BrowserRouter><div className="site-frame"><Navbar /><div id="main-content" tabIndex={-1}><Suspense fallback={<main className="error-state section-shell" role="status"><p>Loading page…</p></main>}><Routes><Route path="/" element={<Home />} /><Route path="/privacy" element={<Privacy />} /><Route path="/delete" element={<Delete />} /><Route path="/shared/:questionId" element={<SharedResults />} /><Route path="*" element={<main className="error-state section-shell"><p className="eyebrow">A LITTLE DETOUR</p><h1>This page went exploring.</h1><p>Let’s get you back to a good question.</p><a className="primary-button" href="/">Back to Everybody Polls</a></main>} /></Routes></Suspense></div><Footer /></div></BrowserRouter>;
}

export default App;
