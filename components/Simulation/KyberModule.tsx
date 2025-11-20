import React, { useState } from 'react';
import { Lock, Key, ArrowRight, Shield, Check, RefreshCw } from 'lucide-react';

interface KyberModuleProps {
  entropy: string;
  onComplete: () => void;
  active: boolean;
}

const KyberModule: React.FC<KyberModuleProps> = ({ entropy, onComplete, active }) => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Alice Gen, 2: Bob Encap, 3: Alice Decap

  const handleNextStep = () => {
    if (step < 3) {
        setStep(s => s + 1);
        if (step + 1 === 3) {
            setTimeout(onComplete, 1500);
        }
    }
  };

  if (!active) return null;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-violet-400 flex items-center justify-center gap-2">
          <Lock className="w-6 h-6" /> Step 2: Kyber Key Exchange
        </h2>
        <p className="text-slate-400 mt-2">Post-Quantum Key Encapsulation Mechanism (KEM) to establish a shared secret.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 relative min-h-[300px]">
        {/* Alice */}
        <div className="flex flex-col items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="font-bold text-violet-300">Alice</div>
            <div className={`w-20 h-20 rounded-full bg-slate-900 border-2 border-violet-500 flex items-center justify-center relative transition-all duration-500 ${step >= 1 ? 'shadow-[0_0_20px_rgba(139,92,246,0.5)]' : ''}`}>
                <div className="text-4xl">👩🏻‍💻</div>
            </div>
            
            {step >= 1 && (
                <div className="text-xs bg-slate-900 p-2 rounded border border-slate-600 w-full animate-fade-in">
                    <div className="text-slate-400 mb-1">Public Key (pk):</div>
                    <div className="font-mono text-violet-400 truncate">Kyber-1024...</div>
                    <div className="text-slate-400 mt-2 mb-1">Secret Key (sk):</div>
                    <div className="font-mono text-red-400 truncate">••••••••</div>
                </div>
            )}

             {step >= 3 && (
                <div className="mt-auto bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 p-2 rounded-lg text-xs flex items-center gap-2 w-full animate-fade-in">
                    <Check size={14} /> Secret Recovered
                </div>
            )}
        </div>

        {/* Network/Exchange Area */}
        <div className="flex flex-col items-center justify-center relative">
             {/* Step 1 Connection: Alice -> Bob (Sends PK) */}
             {step === 1 && (
                 <div className="absolute top-1/3 w-full flex items-center justify-center animate-pulse">
                    <div className="h-0.5 w-full bg-violet-500/50"></div>
                    <div className="absolute bg-slate-900 p-2 rounded-full border border-violet-500">
                        <Key size={20} className="text-violet-400" />
                    </div>
                    <div className="absolute -top-6 text-xs text-violet-300">Sending PK</div>
                 </div>
             )}

             {/* Step 2 Connection: Bob -> Alice (Sends Ciphertext) */}
             {step === 2 && (
                 <div className="absolute bottom-1/3 w-full flex items-center justify-center animate-pulse">
                    <div className="h-0.5 w-full bg-amber-500/50"></div>
                    <div className="absolute bg-slate-900 p-2 rounded-full border border-amber-500">
                        <Lock size={20} className="text-amber-400" />
                    </div>
                    <div className="absolute -bottom-6 text-xs text-amber-300">Sending Ciphertext</div>
                 </div>
             )}
        </div>

        {/* Bob */}
        <div className="flex flex-col items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-300">Bob</div>
            <div className={`w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center transition-all duration-500 ${step >= 2 ? 'shadow-[0_0_20px_rgba(245,158,11,0.5)]' : ''}`}>
                <div className="text-4xl">👨🏽‍💻</div>
            </div>

            {step >= 2 && (
                 <div className="text-xs bg-slate-900 p-2 rounded border border-slate-600 w-full animate-fade-in">
                    <div className="text-slate-400 mb-1">Calculated:</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-emerald-400">Shared Secret</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-amber-400">Ciphertext</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
         {step < 3 ? (
             <button 
                onClick={handleNextStep}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
             >
                {step === 0 && "1. Generate Keys (Alice)"}
                {step === 1 && "2. Encapsulate Secret (Bob)"}
                {step === 2 && "3. Decapsulate & Verify (Alice)"}
                <ArrowRight size={18} />
             </button>
         ) : (
             <div className="text-emerald-400 font-bold flex items-center gap-2 animate-bounce">
                 <Shield /> Secure Channel Established
             </div>
         )}
      </div>
    </div>
  );
};

export default KyberModule;