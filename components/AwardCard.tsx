import React from 'react';
import { AwardCategory, VoteSet, Member } from '../types';
import { ChevronDown, Trophy, Medal } from 'lucide-react';

interface AwardCardProps {
  award: AwardCategory;
  voteSet: VoteSet;
  members: Member[];
  onChange: (field: keyof VoteSet, memberId: string) => void;
}

export const AwardCard: React.FC<AwardCardProps> = ({ award, voteSet, members, onChange }) => {
  const isOmmino = award.id === 'ommino';
  
  // Helper to check if a member is already selected in another slot for this category
  const isSelectedElsewhere = (memberId: string, currentField: keyof VoteSet) => {
    const entries = Object.entries(voteSet);
    for (const [key, value] of entries) {
      if (key !== currentField && value === memberId) return true;
    }
    return false;
  };

  const renderSelect = (points: number, field: keyof VoteSet, label: string, colorClass: string, icon: React.ReactNode) => (
    <div className="relative group">
      <div className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-wider ${colorClass} flex items-center gap-1 z-10 
        ${isOmmino ? 'bg-amber-950 border border-amber-500/30 rounded shadow-lg' : 'bg-slate-800'}`}>
        {icon} {points} Punti
      </div>
      <div className="relative">
        <select
          value={voteSet[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full appearance-none border-2 rounded-lg px-4 py-4 outline-none transition-colors cursor-pointer
            ${isOmmino 
                ? 'bg-amber-900/20 text-amber-50 border-amber-500/30 hover:border-amber-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50' 
                : 'bg-slate-900/50 text-white border-slate-700 hover:border-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'
            }
            ${voteSet[field] ? (isOmmino ? 'border-amber-400' : 'border-slate-500') : ''}
          `}
        >
          <option value="" className="text-slate-500">Seleziona un ommino...</option>
          {members.map((member) => (
            <option 
              key={member.id} 
              value={member.id}
              disabled={isSelectedElsewhere(member.id, field)}
              className="bg-slate-900 disabled:text-slate-700 text-slate-200"
            >
              {member.name} {isSelectedElsewhere(member.id, field) ? '(Già selezionato)' : ''}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isOmmino ? 'text-amber-400' : 'text-slate-500'}`} />
      </div>
    </div>
  );

  return (
    <div className={`
      rounded-xl border p-6 md:p-8 mb-8 relative overflow-hidden transition-all duration-500
      ${isOmmino 
        ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20' 
        : 'bg-slate-800 border-slate-700 shadow-xl'
      }
    `}>
      
      {/* Special Effects for Ommino */}
      {isOmmino ? (
        <>
            {/* Pulsing Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-yellow-500/5 animate-pulse pointer-events-none" />
            
            {/* Corner Flares */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-600/20 blur-[60px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-600/20 blur-[60px] rounded-full pointer-events-none animate-pulse delay-75"></div>
            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 border-2 border-amber-400/30 rounded-xl animate-pulse pointer-events-none"></div>
        </>
      ) : (
        /* Standard Background Accent */
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start relative z-10">
        <div className={`
            p-4 rounded-2xl text-4xl shadow-inner border shrink-0 flex items-center justify-center transition-transform duration-700
            ${isOmmino
                ? 'bg-gradient-to-br from-amber-300 to-amber-600 border-amber-200 text-amber-900 shadow-amber-500/50 scale-110 rotate-3'
                : 'bg-slate-900 border-slate-700 text-slate-100'
            }
        `}>
          {award.icon}
        </div>
        <div>
          <h2 className={`text-2xl md:text-3xl font-serif font-bold mb-2 ${isOmmino ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-sm' : 'text-slate-100'}`}>
            {award.title}
          </h2>
          <p className={`${isOmmino ? 'text-amber-200/80' : 'text-slate-400'} font-light leading-relaxed`}>
            {award.longDescription}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10">
        {renderSelect(3, 'gold', 'Oro', isOmmino ? 'text-amber-300' : 'text-amber-400', <Trophy className="w-3 h-3" />)}
        {renderSelect(2, 'silver', 'Argento', isOmmino ? 'text-slate-300' : 'text-slate-300', <Medal className="w-3 h-3" />)}
        {renderSelect(1, 'bronze', 'Bronzo', isOmmino ? 'text-amber-600' : 'text-amber-700', <Medal className="w-3 h-3" />)}
      </div>
    </div>
  );
};