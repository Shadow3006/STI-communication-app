import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Zap, Lock, FileSignature, Info, ShieldCheck } from 'lucide-react';
import QRNGModule from '../Simulation/QRNGModule';
import KyberModule from '../Simulation/KyberModule';
import DilithiumStep from '../Simulation/DilithiumStep';

const PresentationView: React.FC = () => {
  const [step, setStep] = useState(1);
  const [entropy, setEntropy] = useState<string>("");
  const [stepStatus, setStepStatus] = useState({
    1: false,
    2: false,
    3: false
  });

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const updateStatus = (stepNum: 1 | 2 | 3, done: boolean) => {
    setStepStatus(prev => ({ ...prev, [stepNum]: done }));
  };

  const steps = [
    { id: 1, title: "QRNG", icon: <Zap size={18} />, color: "text-cyan-400", border: "border-cyan-500" },
    { id: 2, title: "Kyber", icon: <Lock size={18} />, color: "text-violet-400", border: "border-violet-500" },
    { id: 3, title: "Dilithium", icon: <FileSignature size={18} />, color: "text-emerald-400", border: "border-emerald-500" },
    { id: 4, title: "Complete", icon: <ShieldCheck size={18} />, color: "text-white", border: "border-white" }
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in min-h-[80vh] flex flex-col">
      {/* Header & Stepper */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
          Security Architecture Showcase
        </h1>
        
        <div className="flex justify-center items-center gap-4 md:gap-8">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2 md:gap-4">
              <div 
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 
                  ${step === s.id ? `${s.border} bg-slate-800 ${s.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 
                    step > s.id ? 'border-slate-600 bg-slate-800 text-slate-400 opacity-60' : 'border-slate-700 bg-slate-900 text-slate-600 opacity-40'
                  }`}
              >
                {s.icon}
                <span className="font-bold hidden md:inline">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-8 md:w-16 rounded-full transition-colors ${step > s.id ? 'bg-slate-600' : 'bg-slate-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Simulation */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-2 md:p-8 shadow-xl min-h-[500px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(15,23,42,0.5)_2px,transparent_2px)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="relative z-10 w-full">
              {step === 1 && (
                <QRNGModule 
                  active={true} 
                  onComplete={(val) => {
                    setEntropy(val);
                    updateStatus(1, true);
                  }} 
                />
              )}

              {step === 2 && (
                <KyberModule 
                  active={true} 
                  entropy={entropy || "DEMO_ENTROPY_SEED_0X99"} 
                  onComplete={() => updateStatus(2, true)} 
                />
              )}

              {step === 3 && (
                <DilithiumStep 
                  active={true} 
                  onComplete={() => updateStatus(3, true)} 
                  customLabel="Sign & Verify Packet"
                />
              )}

              {step === 4 && (
                <div className="text-center space-y-6 animate-fade-in">
                   <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(139,92,246,0.4)]">
                      <ShieldCheck size={64} className="text-white" />
                   </div>
                   <h2 className="text-3xl font-bold text-white">System Secure</h2>
                   <p className="text-slate-400 max-w-md mx-auto">
                     All components have been verified. The communication channel effectively resists both classical and quantum cryptanalysis.
                   </p>
                   <div className="grid grid-cols-3 gap-4 text-sm mt-8">
                      <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg text-cyan-400">QRNG Verified</div>
                      <div className="p-3 bg-violet-900/20 border border-violet-500/30 rounded-lg text-violet-400">Kyber Encrypted</div>
                      <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-400">Dilithium Signed</div>
                   </div>
                </div>
              )}
            </div>
        </div>

        {/* Right Column: Educational Context */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                  <Info className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">
                    {step === 1 && "How QRNG Works"}
                    {step === 2 && "Understanding Kyber"}
                    {step === 3 && "Why Dilithium?"}
                    {step === 4 && "Defense-in-Depth"}
                  </h3>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed">
                 {step === 1 && (
                   <>
                     <p>
                       <strong>True Randomness:</strong> Unlike standard software (PRNG) which uses math formulas, QRNG uses quantum physics. It measures the "noise" of subatomic particles, which is fundamentally unpredictable.
                     </p>
                     <p>
                       <strong>Role:</strong> This entropy creates the "Seed" for all subsequent keys. If the seed is guessable, the encryption is weak. QRNG ensures the seed is impossible to guess.
                     </p>
                     <ul className="list-disc pl-5 space-y-1 text-cyan-400/80 text-sm">
                       <li>Prevents backtracking attacks</li>
                       <li>No periodic patterns</li>
                     </ul>
                   </>
                 )}

                 {step === 2 && (
                   <>
                     <p>
                       <strong>Lattice Cryptography:</strong> Kyber is a Key Encapsulation Mechanism (KEM). It creates a complex mathematical lattice problem that even quantum supercomputers struggle to solve efficiently.
                     </p>
                     <p>
                       <strong>Harvest Now, Decrypt Later:</strong> Hackers store encrypted data today hoping to break it in 10 years with a quantum computer. Kyber prevents this future decryption.
                     </p>
                     <ul className="list-disc pl-5 space-y-1 text-violet-400/80 text-sm">
                       <li>NIST Selected Standard</li>
                       <li>Efficient performance</li>
                     </ul>
                   </>
                 )}

                 {step === 3 && (
                   <>
                     <p>
                       <strong>Digital Signatures:</strong> Encryption hides the message, but Dilithium proves <em>who</em> sent it. It also ensures the message wasn't changed in transit.
                     </p>
                     <p>
                       <strong>Authentication:</strong> Without this, a hacker could pretend to be "Bob". Dilithium signatures are mathematically linked to the sender's private key and cannot be forged by quantum computers.
                     </p>
                     <ul className="list-disc pl-5 space-y-1 text-emerald-400/80 text-sm">
                       <li>Strong integrity checks</li>
                       <li>Non-repudiation</li>
                     </ul>
                   </>
                 )}

                 {step === 4 && (
                   <>
                     <p>
                       This system combines three layers of defense:
                     </p>
                     <ol className="list-decimal pl-5 space-y-2">
                       <li><strong>QRNG</strong> ensures keys start unpredictable.</li>
                       <li><strong>Kyber</strong> ensures keys cannot be broken by brute force or quantum algorithms.</li>
                       <li><strong>Dilithium</strong> ensures trust between parties.</li>
                     </ol>
                     <p className="mt-4 italic text-slate-400 border-l-2 border-slate-600 pl-4">
                       "The chain is only as strong as its weakest link. We reinforce every link with quantum-resistant physics and math."
                     </p>
                   </>
                 )}
              </div>
           </div>

           {/* Navigation Controls */}
           <div className="flex justify-between items-center pt-4">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} /> Previous
              </button>

              {step < 4 ? (
                 <button 
                   onClick={handleNext}
                   disabled={!stepStatus[step as 1|2|3]}
                   className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition-all transform
                     ${stepStatus[step as 1|2|3] 
                       ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/30' 
                       : 'bg-slate-700 opacity-50 cursor-not-allowed'
                     }`}
                 >
                   Next Step <ArrowRight size={18} />
                 </button>
              ) : (
                 <button 
                   className="px-8 py-3 rounded-lg font-bold bg-emerald-600 text-white shadow-lg flex items-center gap-2 cursor-default"
                 >
                   Showcase Complete <CheckCircle size={18} />
                 </button>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default PresentationView;