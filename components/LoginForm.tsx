import React, { useState } from 'react';
import { ADMIN_CODE, VALID_CODES } from '../constants';
import { database } from '../services/database';

interface LoginFormProps {
  onLogin: (code: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    // 1. Check for Admin
    if (cleanCode === ADMIN_CODE) {
      onLogin(cleanCode);
      return;
    }

    // 2. Check if code is valid
    if (!VALID_CODES.includes(cleanCode)) {
      setError('Codice non valido. Accesso negato.');
      return;
    }

    // 3. Check if code has already voted
    if (database.hasUserVoted(cleanCode)) {
      setError('Questo codice ha già espresso il suo voto. Non è possibile votare due volte.');
      return;
    }

    onLogin(cleanCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
      <div className="mb-8 text-6xl">👔</div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-500 mb-4">
        Solo Ommini Awards 2025
      </h1>
      <p className="text-slate-400 mb-8 max-w-lg text-lg font-light leading-relaxed">
        Benvenuti alla cerimonia. Inserisci il codice univoco per accedere alla cabina elettorale.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-800/50 p-8 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-sm">
        <label className="block text-left text-sm font-semibold text-slate-300 mb-2">
          Codice Accesso
        </label>
        <input
          type="password"
          inputMode="numeric"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          placeholder="XXXX"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-slate-600 mb-4 tracking-widest text-center text-xl font-mono"
        />
        {error && <p className="text-red-400 text-sm mb-4 text-left">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/20"
        >
          Accedi al Voto
        </button>
      </form>
      
      <p className="mt-8 text-xs text-slate-600 uppercase tracking-widest">
        La gloria vi attende
      </p>
    </div>
  );
};