import { VoteRecord, Votes } from '../types';

const DB_KEY = 'solo_ommini_awards_db_2025';

const getDb = (): VoteRecord[] => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Database error", e);
    return [];
  }
};

const saveDb = (data: VoteRecord[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const database = {
  // Save a new vote
  submitVote: (code: string, votes: Votes): boolean => {
    const db = getDb();
    
    // Check if user already voted
    const existingIndex = db.findIndex(v => v.code === code);
    
    const newRecord: VoteRecord = {
      code,
      timestamp: Date.now(),
      votes
    };

    if (existingIndex >= 0) {
      // Overwrite is theoretically not allowed by UI logic, but safe to handle
      db[existingIndex] = newRecord;
    } else {
      // Add new vote
      db.push(newRecord);
    }

    saveDb(db);
    return true;
  },

  // Retrieve all votes
  getAllVotes: (): VoteRecord[] => {
    return getDb();
  },

  // Check if a specific code has voted
  hasUserVoted: (code: string): boolean => {
    const db = getDb();
    return db.some(v => v.code === code);
  },

  // Delete a vote record (Admin feature)
  deleteVote: (code: string) => {
    let db = getDb();
    db = db.filter(v => v.code !== code);
    saveDb(db);
  },
  
  // Reset DB
  reset: () => {
    localStorage.removeItem(DB_KEY);
  }
};