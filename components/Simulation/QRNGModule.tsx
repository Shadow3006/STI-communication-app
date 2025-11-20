import React, { useEffect, useRef, useState } from 'react';
import { Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SimulationState } from '../../types';

interface QRNGModuleProps {
  onComplete: (entropy: string) => void;
  active: boolean;
}

const QRNGModule: React.FC<QRNGModuleProps> = ({ onComplete, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [entropy, setEntropy] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!active || !isGenerating || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const drawNoise = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
            buffer32[i] = 0xff000000 | (Math.random() * 0xffffff); // Random color
        } else {
            buffer32[i] = 0xff000000; // Black
        }
      }
      ctx.putImageData(idata, 0, 0);
      animationId = requestAnimationFrame(drawNoise);
    };

    drawNoise();
    return () => cancelAnimationFrame(animationId);
  }, [active, isGenerating]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setEntropy("");
    
    // Simulate quantum harvesting time
    setTimeout(() => {
      setIsGenerating(false);
      const randomBytes = Array.from({length: 32}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
      setEntropy(randomBytes);
      onComplete(randomBytes);
    }, 2500);
  };

  if (!active) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center justify-center gap-2">
          <Zap className="w-6 h-6" /> Step 1: QRNG Entropy Harvesting
        </h2>
        <p className="text-slate-400 mt-2">Generate true randomness from quantum fluctuations to seed keys.</p>
      </div>

      <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-md">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={150} 
          className="rounded-lg bg-black border border-slate-700 shadow-inner w-full h-48 object-cover opacity-80"
        />
        <div className="absolute bottom-3 left-3 right-3">
           <div className="font-mono text-xs text-cyan-300 bg-black/80 p-2 rounded break-all border border-cyan-900/50 min-h-[3rem] flex items-center justify-center">
             {entropy || (isGenerating ? "HARVESTING PHOTONS..." : "WAITING FOR TRIGGER...")}
           </div>
        </div>
      </div>

      <div className="mt-8">
        {!entropy ? (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 flex items-center gap-2
              ${isGenerating ? 'bg-slate-600 cursor-wait' : 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/50'}
            `}
          >
            {isGenerating ? <RefreshCw className="animate-spin" /> : <Zap />}
            {isGenerating ? 'Stabilizing Quantum State...' : 'Harvest Quantum Entropy'}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-500/30">
            <CheckCircle2 /> 
            <span className="font-semibold">Entropy Pool Secured</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRNGModule;