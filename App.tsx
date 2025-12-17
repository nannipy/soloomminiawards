import React, { useState } from 'react';
import { AppStep, Votes } from './types';
import { ADMIN_CODE } from './constants';
import { LoginForm } from './components/LoginForm';
import { VotingInterface } from './components/VotingInterface';
import { ThankYou } from './components/ThankYou';
import { ResultsDashboard } from './components/ResultsDashboard';
import { database } from './services/database';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('login');
  const [userCode, setUserCode] = useState<string>('');
  const [finalVotes, setFinalVotes] = useState<Votes | null>(null);

  const handleLogin = (code: string) => {
    setUserCode(code);
    
    // Check for admin
    if (code === ADMIN_CODE) {
      setStep('admin');
      window.scrollTo(0, 0);
      return;
    }

    // Since LoginForm handles validation and "already voted" checks,
    // if we get here, the code is valid and hasn't voted yet.
    setStep('voting');
    window.scrollTo(0, 0);
  };

  const handleSubmitVotes = (votes: Votes) => {
    // Save to the persistent local database
    database.submitVote(userCode, votes);
    
    setFinalVotes(votes);
    setStep('submitted');
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setStep('login');
    setUserCode('');
    setFinalVotes(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-amber-500/30">
        
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {step === 'login' && <LoginForm onLogin={handleLogin} />}
        {step === 'voting' && <VotingInterface code={userCode} onSubmit={handleSubmitVotes} />}
        {step === 'submitted' && finalVotes && <ThankYou votes={finalVotes} onBackToHome={handleReset} />}
        {step === 'admin' && <ResultsDashboard onExit={handleReset} />}
      </div>
      
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm">
        <p>© 2025 Solo Ommini Group. All rights reserved (and judged).</p>
      </footer>
    </div>
  );
};

export default App;