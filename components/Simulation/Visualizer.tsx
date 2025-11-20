import React from 'react';
import { Lock, Key, FileSignature, ShieldCheck, Zap, Radio, ArrowRight } from 'lucide-react';

export const Node: React.FC<{ name: string; type: 'user' | 'server' }> = ({ name, type }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-lg w-32">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${type === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
      {type === 'user' ? <div className="w-8 h-8 rounded-full border-2 border-current" /> : <Radio size={32} />}
    </div>
    <span className="font-bold text-sm tracking-wider">{name}</span>
  </div>
);

export const DataPacket: React.FC<{ type: 'key' | 'msg' | 'sig'; label?: string }> = ({ type, label }) => {
    let icon = <Lock size={16} />;
    let color = "bg-violet-600";
    
    if (type === 'key') { icon = <Key size={16} />; color = "bg-amber-500"; }
    if (type === 'sig') { icon = <FileSignature size={16} />; color = "bg-emerald-500"; }
    if (type === 'msg') { icon = <ShieldCheck size={16} />; color = "bg-blue-500"; }

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${color} text-white text-xs font-mono shadow-lg animate-pulse`}>
            {icon}
            <span>{label || 'DATA'}</span>
        </div>
    );
};

export const ConnectionLine: React.FC<{ active?: boolean }> = ({ active }) => (
    <div className="flex-1 h-1 bg-slate-700 relative mx-4 rounded-full overflow-hidden">
        {active && (
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/2 animate-[shimmer_1s_infinite_linear]" style={{ transform: 'skewX(-20deg)' }} />
        )}
    </div>
);
