import React, { useState } from 'react';
import { AWARDS, MEMBERS } from '../constants';
import { Votes, AwardId, VoteSet } from '../types';
import { AwardCard } from './AwardCard';
import { AlertCircle } from 'lucide-react';

interface VotingInterfaceProps {
  code: string;
  onSubmit: (votes: Votes) => void;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ code, onSubmit }) => {
  // Initialize empty votes
  const initialVotes: Votes = {
    cagnolino: { gold: '', silver: '', bronze: '' },
    bollito: { gold: '', silver: '', bronze: '' },
    bruciato: { gold: '', silver: '', bronze: '' },
    scomparso: { gold: '', silver: '', bronze: '' },
    ommino: { gold: '', silver: '', bronze: '' },
  };

  const [votes, setVotes] = useState<Votes>(initialVotes);
  const [error, setError] = useState<string | null>(null);

  const handleVoteChange = (category: AwardId, field: keyof VoteSet, memberId: string) => {
    setVotes(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: memberId
      }
    }));
    setError(null);
  };

  const validateAndSubmit = () => {
    // Check if all slots are filled
    for (const award of AWARDS) {
      const v = votes[award.id];
      if (!v.gold || !v.silver || !v.bronze) {
        setError(`Devi assegnare tutti i punti per la categoria: ${award.title}`);
        
        // Scroll to the error
        const element = document.getElementById(`award-${award.id}`);
        if(element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return;
      }
    }
    onSubmit(votes);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wider uppercase mb-4 border border-amber-500/20">
          CODICE: {code}
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
          La Scheda Elettorale
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Assegna 3, 2 e 1 punto per ogni categoria. Ricorda: da grandi poteri derivano grandi responsabilità (e grandi figure di merda).
        </p>
      </header>

      <div className="space-y-12">
        {AWARDS.map(award => (
          <div key={award.id} id={`award-${award.id}`}>
            <AwardCard 
              award={award} 
              members={MEMBERS}
              voteSet={votes[award.id]}
              onChange={(field, memberId) => handleVoteChange(award.id, field, memberId)}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-md border border-red-400 z-50 animate-bounce">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="mt-16 text-center">
        <button
          onClick={validateAndSubmit}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 text-xl font-bold py-4 px-12 rounded-full shadow-lg shadow-amber-500/25 transform transition hover:scale-105"
        >
          Conferma i Voti Definitivi
        </button>
        <p className="mt-4 text-slate-500 text-sm">
          Questa azione è irreversibile. Il destino degli ommini sarà segnato.
        </p>
      </div>
    </div>
  );
};