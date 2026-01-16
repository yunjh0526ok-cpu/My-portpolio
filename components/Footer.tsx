import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 py-12 border-t border-slate-800 bg-slate-950 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-white mb-2 font-tech">Ethics-CoreAI</h3>
        <p className="text-slate-500 text-sm mb-6">청렴공정AI센터 | Copyright © 2024. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-slate-400 text-sm">
           <span>Contact</span>
           <span>•</span>
           <span>Privacy Policy</span>
           <span>•</span>
           <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;