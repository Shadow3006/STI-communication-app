import React from 'react';
import { ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { EducationalContent } from '../../types';

interface InfoCardProps {
    content: EducationalContent;
    color: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ content, color }) => {
  // Tailwind dynamic color classes
  const colorClass = {
    'cyan': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    'violet': 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    'emerald': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  }[color] || 'text-slate-400';

  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700 p-6 h-full flex flex-col shadow-lg">
      <div className="mb-4 border-b border-slate-700 pb-4">
        <h3 className={`text-2xl font-bold mb-1 ${colorClass.split(' ')[0]}`}>{content.title}</h3>
        <p className="text-slate-400 text-sm italic">{content.role}</p>
      </div>
      
      <div className="space-y-6 flex-grow">
        <div>
            <h4 className="flex items-center gap-2 font-bold text-green-400 mb-2 text-sm uppercase tracking-wider">
                <ThumbsUp size={16} /> Positive Use Cases
            </h4>
            <ul className="space-y-2">
                {content.positive?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {item}
                    </li>
                )) || <li className="text-slate-500 text-sm italic">No data available</li>}
            </ul>
        </div>

        <div>
            <h4 className="flex items-center gap-2 font-bold text-red-400 mb-2 text-sm uppercase tracking-wider">
                <ThumbsDown size={16} /> Negative Use Cases / Risks
            </h4>
            <ul className="space-y-2">
                {content.negative?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        {item}
                    </li>
                )) || <li className="text-slate-500 text-sm italic">No data available</li>}
            </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className={`p-3 rounded-lg text-sm leading-relaxed ${colorClass}`}>
            <span className="font-bold mr-1 block mb-1"><Info size={14} className="inline mr-1"/> Summary</span>
            {content.summary}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;