import React, { useState } from 'react';
import { Shield, Play, BookOpen, Info } from 'lucide-react';
import SecureChatModule from './components/Simulation/SecureChatModule';
import PresentationView from './components/Presentation/PresentationView';

enum ViewMode {
  SIMULATION,
  PRESENTATION
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.SIMULATION);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/90 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative bg-gradient-to-br from-cyan-500 to-violet-600 p-2 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse-fast"></div>
              <Shield className="text-white w-6 h-6 relative z-10" />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 tracking-tight">
                QuantumShield
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                    Post-Quantum Secure Messenger
                </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setView(ViewMode.SIMULATION)}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${view === ViewMode.SIMULATION ? 'bg-slate-700 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Play size={16} /> Live Demo
            </button>
            <button 
              onClick={() => setView(ViewMode.PRESENTATION)}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${view === ViewMode.PRESENTATION ? 'bg-slate-700 text-violet-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen size={16} /> Interactive Walkthrough
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {view === ViewMode.SIMULATION ? (
          <div className="flex flex-col gap-6">
             {/* Intro Banner for Context */}
             <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-lg flex items-start gap-3 text-sm text-slate-300 shadow-lg">
                <Info className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
                <p>
                  <strong className="text-cyan-300">Live Simulation Active:</strong> Every message you send passes through the Quantum Pipeline. 
                  Watch the top bar to see <span className="text-cyan-400">QRNG</span> entropy generation, <span className="text-violet-400">Kyber</span> encryption, and <span className="text-emerald-400">Dilithium</span> signing in real-time.
                </p>
             </div>

             <SecureChatModule active={true} />
          </div>
        ) : (
          <PresentationView />
        )}
      </main>
      
      <footer className="py-6 border-t border-slate-800 text-center text-slate-600 text-xs font-mono">
         <p>SECURE CHANNEL ACTIVE // PROTOCOL: KYBER-1024 // SIGNATURE: DILITHIUM-5 // ENTROPY: OPTICAL-QRNG</p>
      </footer>
    </div>
  );
};

export default App;