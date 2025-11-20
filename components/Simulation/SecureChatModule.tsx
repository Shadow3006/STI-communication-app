import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, ShieldCheck, Loader2, User, Bot, RefreshCw, Terminal, Zap, FileSignature } from 'lucide-react';
import { sendSecureMessage, initializeSecureChat } from '../../services/geminiService';
import Pipeline from './Pipeline';
import { PipelineStep } from '../../types';

interface Message {
  id: string;
  sender: 'Alice' | 'Bob';
  text: string;
  isEncrypted?: boolean;
}

const SecureChatModule: React.FC<{ active: boolean }> = ({ active }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'Bob', text: 'Secure channel established. Kyber keys verified. Ready for Dilithium-signed transmission.' }
  ]);
  const [input, setInput] = useState('');
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>(PipelineStep.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      initializeSecureChat();
    }
  }, [active]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pipelineStep]);

  const runPipelineSequence = async () => {
    setPipelineStep(PipelineStep.QRNG);
    await new Promise(r => setTimeout(r, 1200)); // QRNG time
    
    setPipelineStep(PipelineStep.KYBER);
    await new Promise(r => setTimeout(r, 1000)); // Kyber time
    
    setPipelineStep(PipelineStep.DILITHIUM);
    await new Promise(r => setTimeout(r, 1000)); // Dilithium time
    
    setPipelineStep(PipelineStep.SENDING);
    await new Promise(r => setTimeout(r, 600)); // Network time
  };

  const handleSend = async () => {
    if (!input.trim() || pipelineStep !== PipelineStep.IDLE) return;

    const userMsgId = Date.now().toString();
    const userText = input;
    setInput('');
    
    // Start Visual Sequence
    await runPipelineSequence();

    // Add User Message (Encrypted visual first)
    setMessages(prev => [...prev, { id: userMsgId, sender: 'Alice', text: '••• ENCRYPTED •••', isEncrypted: true }]);
    
    try {
      // Actual API Call
      const responseText = await sendSecureMessage(userText);
      
      // Reveal User Message
      setMessages(prev => prev.map(m => m.id === userMsgId ? { ...m, text: userText, isEncrypted: false } : m));
      setPipelineStep(PipelineStep.RECEIVING);

      // Add Bot Message (Encrypted visual)
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, sender: 'Bob', text: '••• ENCRYPTED •••', isEncrypted: true }]);
      
      // Simulate Decrypt delay
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: responseText, isEncrypted: false } : m));
      
      setPipelineStep(PipelineStep.IDLE);

    } catch (error) {
      console.error(error);
      setPipelineStep(PipelineStep.IDLE);
    }
  };

  if (!active) return null;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in flex flex-col bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden h-[80vh]">
      
      {/* Pipeline Visualization Header */}
      <Pipeline step={pipelineStep} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.3)_2px,transparent_2px),linear-gradient(90deg,rgba(15,23,42,0.3)_2px,transparent_2px)] bg-[size:40px_40px] pointer-events-none" />
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 relative z-10 ${msg.sender === 'Alice' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]
              ${msg.sender === 'Alice' ? 'bg-blue-900/40 border-blue-500 text-blue-400' : 'bg-amber-900/40 border-amber-500 text-amber-400'}`}>
              {msg.sender === 'Alice' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[70%] p-4 rounded-2xl relative group shadow-lg backdrop-blur-sm
              ${msg.sender === 'Alice' ? 'bg-blue-600/10 border border-blue-500/30 text-blue-100 rounded-tr-none' : 'bg-slate-800/60 border border-slate-700 text-slate-200 rounded-tl-none'}`}>
              
              {msg.isEncrypted ? (
                <div className="flex items-center gap-2 font-mono text-emerald-400 animate-pulse">
                   <Lock size={14} /> [LATTICE_CIPHERTEXT]
                </div>
              ) : (
                <p className="leading-relaxed text-sm md:text-base font-light">{msg.text}</p>
              )}

              {/* Message Meta */}
              {!msg.isEncrypted && (
                <div className={`absolute -bottom-5 text-[10px] flex items-center gap-1 opacity-70 transition-opacity
                   ${msg.sender === 'Alice' ? 'right-0 text-blue-400/70' : 'left-0 text-slate-500'}`}>
                  <ShieldCheck size={10} /> 
                  <span className="uppercase tracking-wider">Dilithium Verified</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700 relative z-20">
        <div className="flex gap-2">
          <div className="relative flex-1">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Terminal size={16} />
             </div>
             <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={pipelineStep === PipelineStep.IDLE ? "Enter message to encrypt & sign..." : "Processing secure pipeline..."}
                disabled={pipelineStep !== PipelineStep.IDLE}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm transition-all"
             />
          </div>
          <button 
            onClick={handleSend}
            disabled={pipelineStep !== PipelineStep.IDLE || !input.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20"
          >
            {pipelineStep !== PipelineStep.IDLE ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
           <div className="flex gap-3 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1 text-cyan-500/80"><Zap size={10}/> QRNG Active</span>
              <span className="flex items-center gap-1 text-violet-500/80"><Lock size={10}/> Kyber-1024</span>
              <span className="flex items-center gap-1 text-emerald-500/80"><FileSignature size={10}/> Dilithium-5</span>
           </div>
           <span className="text-[10px] text-slate-600">v2.0.5-QUANTUM</span>
        </div>
      </div>
    </div>
  );
};

export default SecureChatModule;