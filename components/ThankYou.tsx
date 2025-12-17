import React from 'react';
import { Votes } from '../types';
import { AWARDS, MEMBERS } from '../constants';
import { Check } from 'lucide-react';

interface ThankYouProps {
    votes: Votes;
    onBackToHome: () => void;
}

export const ThankYou: React.FC<ThankYouProps> = ({ votes, onBackToHome }) => {
  const getMemberName = (id: string) => MEMBERS.find(m => m.id === id)?.name || 'Sconosciuto';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="mb-8 flex justify-center">
        <div className="bg-green-500/10 p-6 rounded-full border border-green-500/20">
            <Check className="w-16 h-16 text-green-500" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-500 mb-6">
        Voto Registrato!
      </h1>
      <p className="text-slate-300 text-lg mb-12">
        Grazie per aver contribuito alla Storia. Il tuo giudizio è stato scolpito nella pietra digitale dei Solo Ommini Awards 2025.
      </p>

      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-left mb-8 shadow-2xl">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-6 border-b border-slate-700 pb-2">
            Ecco le tue votazioni
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
            {AWARDS.map(award => (
                <div key={award.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-200 font-serif mb-3 border-b border-slate-700/50 pb-2">
                        <span className="text-xl">{award.icon}</span>
                        <span className="font-bold">{award.title}</span>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between items-center">
                            <span className="text-amber-400 font-bold">🥇 3pt</span>
                            <span className="text-slate-300 text-right">{getMemberName(votes[award.id].gold)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">🥈 2pt</span>
                            <span className="text-slate-300 text-right">{getMemberName(votes[award.id].silver)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-amber-700 font-bold">🥉 1pt</span>
                            <span className="text-slate-300 text-right">{getMemberName(votes[award.id].bronze)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <button 
        onClick={onBackToHome}
        className="text-slate-500 hover:text-white underline transition-colors"
      >
        Torna alla home
      </button>
    </div>
  );
};