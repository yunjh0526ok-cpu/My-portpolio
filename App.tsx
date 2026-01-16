import React, { Suspense } from 'react';
import Background3D from './components/Background3D';
import Hero from './components/Hero';
import Career from './components/Career';
import Services from './components/Services';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import MouseTrail from './components/MouseTrail';
import Vision from './components/Vision';
import Gallery from './components/Gallery';
import Diagnostics from './components/Diagnostics';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 selection:bg-cyber-accent selection:text-cyber-900 font-sans">
      <Navbar />
      <MouseTrail />
      
      <Suspense fallback={<div className="fixed inset-0 bg-black z-50 flex items-center justify-center text-white">Loading Engine...</div>}>
        <Background3D />
      </Suspense>
      
      <main className="relative w-full overflow-x-hidden">
        <Hero />
        <Vision />
        <Services />
        <Career />
        <Gallery />
        <Diagnostics />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;