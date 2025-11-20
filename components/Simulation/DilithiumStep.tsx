import React, { useState } from 'react';
import { FileSignature, CheckCheck, PenTool, Send } from 'lucide-react';

interface DilithiumStepProps {
  active: boolean;
  onComplete: () => void;
  customLabel?: string;
}

const DilithiumStep: React.FC<DilithiumStepProps> = ({ active, onComplete, customLabel }) => {
  const [msg, setMsg] = useState("Handshake Confirmation: Ready for secure transmission.");
  const [status, setStatus] = useState<'idle' | 'signing' | 'sending' | 'verified'>('idle');

  const handleProcess = () => {
    setStatus('signing');
    setTimeout(() => {
        setStatus('sending');
        setTimeout(() => {
            setStatus('verified');
            setTimeout(onComplete, 1500);
        }, 2000);
    }, 2000);
  };

  if (!active) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-2">
          <FileSignature className="w-6 h-6" /> Step 3: Dilithium Verification
        </h2>
        <p className="text-slate-400 mt-2">Authenticating the secure channel before allowing chat.</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        {/* Visualization Overlay */}
        {status !== 'idle' && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-4">
                {status === 'signing' && (
                    <>
                        <PenTool className="w-16 h-16 text-emerald-400 animate-bounce" />
                        <span className="text-emerald-300 font-mono">Applying Digital Signature...</span>
                    </>
                )}
                {status === 'sending' && (
                    <>
                        <Send className="w-16 h-16 text-blue-400 animate-pulse" />
                        <span className="text-blue-300 font-mono">Verifying Credentials...</span>
                    </>
                )}
                 {status === 'verified' && (
                    <>
                        <CheckCheck className="w-16 h-16 text-green-400" />
                        <span className="text-green-300 font-mono">Identity Verified!</span>
                    </>
                )}
            </div>
        )}

        <div className="flex flex-col gap-4">
            <label className="text-slate-400 text-sm uppercase tracking-wider font-bold">Initial Handshake Packet</label>
            <textarea 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                readOnly
                className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-400 italic focus:ring-0 outline-none resize-none h-24"
            />
            
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Unverified
                </div>
                <button 
                    onClick={handleProcess}
                    disabled={status !== 'idle'}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                    <FileSignature size={18} /> {customLabel || "Sign & Initialize Chat"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DilithiumStep;