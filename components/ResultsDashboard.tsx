import React, { useMemo, useEffect, useState } from 'react';
import { AWARDS, MEMBERS, VALID_CODES } from '../constants';
import { AwardId, VoteRecord, Votes } from '../types';
import { database } from '../services/database';
import { Lock, RefreshCw, Trash2, Eye, ChevronUp, ChevronDown, List, BarChart3 } from 'lucide-react';

interface MemberScore {
  memberId: string;
  memberName: string;
  score: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
}

interface ResultsDashboardProps {
  onExit: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'management'>('ranking');
  const [scoresData, setScoresData] = useState<Record<AwardId, MemberScore[]> | null>(null);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const refreshData = () => {
    const allVotes = database.getAllVotes();
    setVoteRecords(allVotes);
    calculateRealScores(allVotes);
  };

  const calculateRealScores = (allVotes: VoteRecord[]) => {
    // Initialize structure to hold scores
    const calculatedScores: Record<string, Record<string, MemberScore>> = {};
    
    // Setup initial zero-values
    AWARDS.forEach(award => {
      calculatedScores[award.id] = {};
      MEMBERS.forEach(member => {
        calculatedScores[award.id][member.id] = {
          memberId: member.id,
          memberName: member.name,
          score: 0,
          goldCount: 0,
          silverCount: 0,
          bronzeCount: 0
        };
      });
    });

    // Process votes
    allVotes.forEach(record => {
      const userVotes = record.votes;
      (Object.keys(userVotes) as AwardId[]).forEach(categoryId => {
        const voteSet = userVotes[categoryId];
        if (voteSet.gold) {
           calculatedScores[categoryId][voteSet.gold].goldCount += 1;
           calculatedScores[categoryId][voteSet.gold].score += 3;
        }
        if (voteSet.silver) {
           calculatedScores[categoryId][voteSet.silver].silverCount += 1;
           calculatedScores[categoryId][voteSet.silver].score += 2;
        }
        if (voteSet.bronze) {
           calculatedScores[categoryId][voteSet.bronze].bronzeCount += 1;
           calculatedScores[categoryId][voteSet.bronze].score += 1;
        }
      });
    });

    // Convert to arrays
    const finalResults: Record<string, MemberScore[]> = {};
    AWARDS.forEach(award => {
      const memberScores = Object.values(calculatedScores[award.id]);
      finalResults[award.id] = memberScores.sort((a, b) => b.score - a.score);
    });

    setScoresData(finalResults as Record<AwardId, MemberScore[]>);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDelete = (code: string) => {
    // Explicitly warning the admin that this action re-enables voting for this code
    if (confirm(`⚠️ ATTENZIONE ⚠️\n\nStai per eliminare i voti del codice: ${code}.\n\nProcedendo, questo codice SARÀ ABILITATO A VOTARE NUOVAMENTE.\n\nConfermi l'eliminazione?`)) {
      database.deleteVote(code);
      refreshData();
      setExpandedCode(null);
    }
  };

  const getMemberName = (id: string) => MEMBERS.find(m => m.id === id)?.name || id;

  const renderRanking = () => {
    if (!scoresData) return null;
    return (
      <div className="grid gap-12 animate-fade-in">
        {AWARDS.map(award => {
          const scores = scoresData[award.id];
          const maxScore = scores[0]?.score || 1; 

          return (
            <div key={award.id} className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl">
              <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-4">
                <span className="text-4xl">{award.icon}</span>
                <h2 className="text-2xl font-serif font-bold text-slate-100">
                  {award.title}
                </h2>
              </div>

              <div className="space-y-4">
                {scores.slice(0, 10).map((item, index) => { 
                  const percentage = Math.max((item.score / maxScore) * 100, 1);
                  const isTop3 = index < 3;
                  
                  return (
                    <div key={item.memberId} className="relative">
                      <div className="flex justify-between items-end mb-1 text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono w-6 text-right ${isTop3 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                            #{index + 1}
                          </span>
                          <span className={`font-medium ${isTop3 ? 'text-white text-lg' : 'text-slate-300'}`}>
                            {item.memberName}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400 items-center">
                            <span className="text-white font-bold text-base bg-slate-700 px-2 py-0.5 rounded">{item.score} pt</span>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                            index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                            index === 2 ? 'bg-gradient-to-r from-amber-700 to-amber-800' :
                            'bg-slate-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderManagement = () => {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Codice</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {VALID_CODES.map(code => {
                const record = voteRecords.find(r => r.code === code);
                const isExpanded = expandedCode === code;

                return (
                  <React.Fragment key={code}>
                    <tr className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-white text-base">{code}</td>
                      <td className="px-6 py-4">
                        {record ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            VOTATO
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-500 border border-slate-600">
                            IN ATTESA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        {record && (
                          <>
                            <button 
                              onClick={() => setExpandedCode(isExpanded ? null : code)}
                              className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                              title="Vedi Voti"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                            <button 
                              onClick={() => handleDelete(code)}
                              className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                              title="Elimina Voto e permetti rivotazione"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    {isExpanded && record && (
                      <tr>
                        <td colSpan={3} className="bg-slate-900/50 px-6 py-6 border-b border-slate-700">
                          <div className="grid gap-6 md:grid-cols-2">
                            {AWARDS.map(award => (
                              <div key={award.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold">
                                  <span>{award.icon}</span>
                                  <span>{award.title}</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-amber-400">🥇 Oro (3pt):</span>
                                    <span className="text-white">{getMemberName(record.votes[award.id].gold)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-300">🥈 Argento (2pt):</span>
                                    <span className="text-white">{getMemberName(record.votes[award.id].silver)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-amber-700">🥉 Bronzo (1pt):</span>
                                    <span className="text-white">{getMemberName(record.votes[award.id].bronze)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <header className="mb-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-6">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Area Riservata Admin</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Controllo Globale
        </h1>
        <div className="flex items-center gap-2 text-slate-400 mb-8">
           <span>{voteRecords.length} voti registrati su {VALID_CODES.length} aventi diritto.</span>
           <button onClick={refreshData} className="p-2 hover:bg-slate-800 rounded-full transition-colors" title="Aggiorna dati">
             <RefreshCw className="w-4 h-4" />
           </button>
        </div>

        <div className="flex gap-4 mb-8">
            <button
                onClick={() => setActiveTab('ranking')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                    activeTab === 'ranking' 
                    ? 'bg-amber-500 text-slate-900' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
                <BarChart3 className="w-4 h-4" />
                Classifiche
            </button>
            <button
                onClick={() => setActiveTab('management')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                    activeTab === 'management' 
                    ? 'bg-amber-500 text-slate-900' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
                <List className="w-4 h-4" />
                Gestione Voti
            </button>
        </div>
      </header>

      {activeTab === 'ranking' ? renderRanking() : renderManagement()}
      
      <div className="mt-12 text-center">
        <button 
           onClick={onExit}
           className="text-slate-500 hover:text-white underline"
        >
            Esci dall'area admin
        </button>
      </div>
    </div>
  );
};