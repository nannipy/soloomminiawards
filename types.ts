export interface Member {
  id: string;
  name: string;
}

export type AwardId = 'cagnolino' | 'bollito' | 'bruciato' | 'scomparso' | 'ommino';

export interface AwardCategory {
  id: AwardId;
  title: string;
  icon: string;
  description: string;
  longDescription: string;
}

// 3 points, 2 points, 1 point
export interface VoteSet {
  gold: string;   // Member ID
  silver: string; // Member ID
  bronze: string; // Member ID
}

export type Votes = Record<AwardId, VoteSet>;

export interface VoteRecord {
  code: string; // Authentication code
  timestamp: number;
  votes: Votes;
}

export type AppStep = 'login' | 'voting' | 'submitted' | 'admin';