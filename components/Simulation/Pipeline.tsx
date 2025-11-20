import React, { useEffect, useRef } from 'react';
import { Zap, Lock, FileSignature, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { PipelineStep } from '../../types';

interface PipelineProps {
  step: PipelineStep;
}

const MiniQRNG: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      
      for (let i = 0; i < buffer32.length; i++) {
        buffer32[i] = 0xff000000 | (Math.random() * 0xffffff);
      }
      ctx.putImageData(idata, 0, 0);
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [active]);

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${active ? 'bg-cyan-900/40 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
      <div className="relative w-12 h-12 rounded overflow-hidden border border-slate-600 bg-black">
        <canvas ref={canvasRef} width={48} height={48} className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center text-white/80 font-bold text-xs">
            {active ? <Zap size={16} className="animate-bounce text-cyan-400" /> : <Zap size={16} />}
        </div>
      </div>
      <span className={`text-xs font-bold uppercase ${active ? 'text-cyan-400' : 'text-slate-500'}`}>QRNG</span>
    </div>
  );
};

const MiniKyber: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${active ? 'bg-violet-900/40 border-violet-400 scale-105 shadow-[0_0_15px_rgba(167,139,250,0.3)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
      <div className={`w-12 h-12 rounded flex items-center justify-center border border-slate-600 bg-slate-900`}>
        <Lock size={24} className={`transition-all duration-500 ${active ? 'text-violet-400 rotate-0' : 'text-slate-500 -rotate-12'}`} />
      </div>
      <span className={`text-xs font-bold uppercase ${active ? 'text-violet-400' : 'text-slate-500'}`}>Kyber</span>
    </div>
  );
};

const MiniDilithium: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${active ? 'bg-emerald-900/40 border-emerald-400 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
       <div className={`w-12 h-12 rounded flex items-center justify-center border border-slate-600 bg-slate-900`}>
        <FileSignature size={24} className={`transition-all duration-300 ${active ? 'text-emerald-400 scale-110' : 'text-slate-500'}`} />
      </div>
      <span className={`text-xs font-bold uppercase ${active ? 'text-emerald-400' : 'text-slate-500'}`}>Dilithium</span>
    </div>
  );
};

const Pipeline: React.FC<PipelineProps> = ({ step }) => {
  return (
    <div className="w-full bg-slate-900/50 border-b border-slate-700 p-4">
       <div className="flex items-center justify-center gap-2 md:gap-6">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden md:block absolute left-8 top-8">
            Secure Transmission Pipeline
          </div>

          <MiniQRNG active={step === PipelineStep.QRNG} />
          
          <ArrowRight className={`text-slate-600 ${step === PipelineStep.QRNG ? 'text-cyan-500 animate-pulse' : ''}`} size={20} />
          
          <MiniKyber active={step === PipelineStep.KYBER} />
          
          <ArrowRight className={`text-slate-600 ${step === PipelineStep.KYBER ? 'text-violet-500 animate-pulse' : ''}`} size={20} />
          
          <MiniDilithium active={step === PipelineStep.DILITHIUM} />

          <ArrowRight className={`text-slate-600 ${step === PipelineStep.DILITHIUM ? 'text-emerald-500 animate-pulse' : ''}`} size={20} />

          <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${step === PipelineStep.SENDING || step === PipelineStep.RECEIVING ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
             <div className="w-12 h-12 rounded flex items-center justify-center border border-slate-600 bg-slate-900">
                <Shield size={24} className={step === PipelineStep.SENDING ? 'text-blue-400 animate-pulse' : 'text-slate-500'} />
             </div>
             <span className={`text-xs font-bold uppercase ${step === PipelineStep.SENDING ? 'text-blue-400' : 'text-slate-500'}`}>Network</span>
          </div>
       </div>

       <div className="h-8 flex items-center justify-center mt-4">
          {step === PipelineStep.QRNG && <span className="text-cyan-400 font-mono text-sm animate-fade-in">Generating High-Entropy Nonce...</span>}
          {step === PipelineStep.KYBER && <span className="text-violet-400 font-mono text-sm animate-fade-in">Encapsulating with Shared Secret...</span>}
          {step === PipelineStep.DILITHIUM && <span className="text-emerald-400 font-mono text-sm animate-fade-in">Signing Message Integrity...</span>}
          {step === PipelineStep.SENDING && <span className="text-blue-400 font-mono text-sm animate-fade-in">Transmitting Encrypted Packet...</span>}
          {step === PipelineStep.IDLE && <span className="text-slate-600 font-mono text-xs">SYSTEM READY. WAITING FOR INPUT.</span>}
       </div>
    </div>
  );
};

export default Pipeline;