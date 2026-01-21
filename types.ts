
export enum UserRole {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  MEMBER = 'MEMBER'
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  activeMembers: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string; // CRITICAL: Every user belongs to a branch
  assignedCoachId?: string; // For Members
  avatarUrl?: string;
  
  // Gamification & Metrics
  points: number;
  rank?: number; // Calculated dynamically
  streakDays: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  branchId: string; // CRITICAL: Data ownership
  date: string; // ISO Date
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Recovery';
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  xpEarned: number; // For gamification
}

export interface BodyLog {
  id: string;
  userId: string;
  branchId: string;
  date: string;
  weight: number;
  photoUrl?: string; // Firebase Storage URL
  bodyFatPercentage?: number;
}

export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatarUrl: string;
    fatLossPercentage: number; // Total % lost
    rank: number;
}

export interface Appointment {
  id: string;
  coachId: string;
  memberId: string;
  branchId: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  type: 'PT' | 'CONSULTATION';
}

export interface CommunityPost {
  id: string;
  authorId: string;
  branchId: string; // Isolation: Only visible to this branch
  content: string;
  timestamp: string;
  likes: number;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
