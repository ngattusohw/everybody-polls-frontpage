import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Delete from './pages/Delete';
import SharedResults from './pages/SharedResults';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/shared/:questionId" element={<SharedResults />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
