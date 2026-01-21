
import { Branch, User, UserRole, WorkoutSession, Appointment, CommunityPost, BodyLog, LeaderboardEntry, Exercise, PlannedActivity } from '../types';

// === INITIAL DATA SEEDING ===

const INITIAL_BRANCHES: Branch[] = [
  { id: 'b_nyc_01', name: 'Metro Iron NYC', location: 'New York, NY', activeMembers: 1240 },
  { id: 'b_la_01', name: 'Venice Beach Prime', location: 'Los Angeles, CA', activeMembers: 890 },
];

const INITIAL_USERS: User[] = [
  { id: 'u_admin_1', name: 'Zeus Commander', email: 'admin@hyper.com', role: UserRole.ADMIN, branchId: 'b_nyc_01', avatarUrl: 'https://picsum.photos/seed/admin1/150/150', points: 0, streakDays: 0 },
  { id: 'u_coach_1', name: 'Jax Briggs', email: 'jax@hyper.com', role: UserRole.COACH, branchId: 'b_nyc_01', avatarUrl: 'https://picsum.photos/seed/coach1/150/150', points: 0, streakDays: 0 },
  { id: 'u_mem_1', name: 'Johnny Cage', email: 'johnny@gmail.com', role: UserRole.MEMBER, branchId: 'b_nyc_01', assignedCoachId: 'u_coach_1', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=60', points: 2450, streakDays: 12 },
  { id: 'u_mem_2', name: 'Liu Kang', email: 'liu@gmail.com', role: UserRole.MEMBER, branchId: 'b_nyc_01', assignedCoachId: 'u_coach_1', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60', points: 3100, streakDays: 24 },
  { id: 'u_mem_3', name: 'Kung Lao', email: 'kung@gmail.com', role: UserRole.MEMBER, branchId: 'b_la_01', assignedCoachId: 'u_coach_2', avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=60', points: 1200, streakDays: 3 },
  { id: 'u_mem_4', name: 'Sonya Blade', email: 'sonya@gmail.com', role: UserRole.MEMBER, branchId: 'b_nyc_01', assignedCoachId: 'u_coach_1', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60', points: 4100, streakDays: 45 },
];

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    branchId: 'b_nyc_01',
    name: 'Pull Up',
    description: 'Upper body compound pulling exercise.',
    defaultCaloriesPerMinute: 8,
    defaultDurationMinutes: 15,
    level: 'Beginner',
    type: 'Cardio', // Using Cardio tag from image for visual consistency, though technically strength
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-3115ed0d77eb?auto=format&fit=crop&q=60&w=300'
  },
  {
    id: 'ex_2',
    branchId: 'b_nyc_01',
    name: 'Sit Up',
    description: 'Abdominal endurance training.',
    defaultCaloriesPerMinute: 5,
    defaultDurationMinutes: 30,
    level: 'Intermediate',
    type: 'Muscle',
    imageUrl: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?auto=format&fit=crop&q=60&w=300'
  },
  {
    id: 'ex_3',
    branchId: 'b_nyc_01',
    name: 'Biceps Curl',
    description: 'Isolation exercise for the biceps brachii.',
    defaultCaloriesPerMinute: 4,
    defaultDurationMinutes: 120, // 2 hours from image
    level: 'Pro',
    type: 'Strength',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=60&w=300'
  },
  {
    id: 'ex_4',
    branchId: 'b_nyc_01',
    name: 'Treadmill Run',
    description: 'Steady state cardio.',
    defaultCaloriesPerMinute: 12,
    defaultDurationMinutes: 20,
    level: 'Beginner',
    type: 'Cardio',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=60&w=300'
  }
];

const INITIAL_WORKOUTS: WorkoutSession[] = [
  { id: 'w_1', userId: 'u_mem_1', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'Strength', durationMinutes: 60, caloriesBurned: 450, notes: 'Chest day, PR on bench.', xpEarned: 150 },
  { id: 'w_2', userId: 'u_mem_1', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'HIIT', durationMinutes: 45, caloriesBurned: 600, notes: 'Sprints.', xpEarned: 120 },
  { id: 'w_3', userId: 'u_mem_2', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 0.5).toISOString(), type: 'Cardio', durationMinutes: 30, caloriesBurned: 300, notes: 'Light jog.', xpEarned: 80 },
];

const INITIAL_POSTS: CommunityPost[] = [
  { id: 'p_1', authorId: 'u_mem_1', branchId: 'b_nyc_01', content: 'Just hit a new PR on deadlift! 405lbs moving easy. #LightWeight', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 24 },
  { id: 'p_2', authorId: 'u_mem_3', branchId: 'b_la_01', content: 'West coast best coast. Morning cardio done.', timestamp: new Date().toISOString(), likes: 12 },
  { id: 'p_3', authorId: 'u_coach_1', branchId: 'b_nyc_01', content: 'Remember folks, hydration is key. Drink your water!', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 45 },
];

const INITIAL_BODY_LOGS: BodyLog[] = [
  { id: 'bl_1', userId: 'u_mem_1', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 30).toISOString(), weight: 185, bodyFatPercentage: 18 },
  { id: 'bl_2', userId: 'u_mem_1', branchId: 'b_nyc_01', date: new Date().toISOString(), weight: 180, bodyFatPercentage: 15 }, // Lost 3%
  { id: 'bl_3', userId: 'u_mem_4', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 60).toISOString(), weight: 140, bodyFatPercentage: 24 },
  { id: 'bl_4', userId: 'u_mem_4', branchId: 'b_nyc_01', date: new Date().toISOString(), weight: 135, bodyFatPercentage: 19 }, // Lost 5%
  { id: 'bl_5', userId: 'u_mem_2', branchId: 'b_nyc_01', date: new Date().toISOString(), weight: 175, bodyFatPercentage: 12 }, // Maintenance
];

const DB_KEYS = {
  BRANCHES: 'hyper_branches',
  USERS: 'hyper_users',
  WORKOUTS: 'hyper_workouts',
  POSTS: 'hyper_posts',
  BODY_LOGS: 'hyper_body_logs',
  APPOINTMENTS: 'hyper_appointments',
  EXERCISES: 'hyper_exercises'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(DB_KEYS.BRANCHES)) localStorage.setItem(DB_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
    if (!localStorage.getItem(DB_KEYS.USERS)) localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    if (!localStorage.getItem(DB_KEYS.WORKOUTS)) localStorage.setItem(DB_KEYS.WORKOUTS, JSON.stringify(INITIAL_WORKOUTS));
    if (!localStorage.getItem(DB_KEYS.POSTS)) localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    if (!localStorage.getItem(DB_KEYS.BODY_LOGS)) localStorage.setItem(DB_KEYS.BODY_LOGS, JSON.stringify(INITIAL_BODY_LOGS));
    if (!localStorage.getItem(DB_KEYS.EXERCISES)) localStorage.setItem(DB_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
  }

  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // === GAMIFICATION LOGIC ===
  private calculateRank(users: User[], targetUser: User): number {
    const branchUsers = users.filter(u => u.branchId === targetUser.branchId && u.role === UserRole.MEMBER);
    const sorted = branchUsers.sort((a, b) => b.points - a.points);
    const index = sorted.findIndex(u => u.id === targetUser.id);
    return index + 1;
  }

  // === BRANCHES ===
  async getBranches(): Promise<Branch[]> {
    await delay(300);
    return this.get<Branch>(DB_KEYS.BRANCHES);
  }

  // === USERS ===
  async getUsers(currentUser: User): Promise<User[]> {
    await delay(400);
    const allUsers = this.get<User>(DB_KEYS.USERS);
    
    if (currentUser.role === UserRole.ADMIN) return allUsers; 
    
    if (currentUser.role === UserRole.COACH) {
      return allUsers.filter(u => u.branchId === currentUser.branchId && u.role === UserRole.MEMBER);
    }
    
    const myself = allUsers.find(u => u.id === currentUser.id);
    if (myself) {
      myself.rank = this.calculateRank(allUsers, myself);
      return [myself];
    }
    return [];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await delay(500);
    const users = this.get<User>(DB_KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.role === UserRole.MEMBER) {
      user.rank = this.calculateRank(users, user);
    }
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const users = this.get<User>(DB_KEYS.USERS);
    return users.find(u => u.id === id);
  }

  async updateUser(updatedUser: User): Promise<User> {
      await delay(400);
      const users = this.get<User>(DB_KEYS.USERS);
      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
          users[index] = updatedUser;
          this.set(DB_KEYS.USERS, users);
          return updatedUser;
      }
      throw new Error("User not found");
  }

  // === EXERCISES (ACTIVITIES) ===
  async getExercises(branchId: string): Promise<Exercise[]> {
    await delay(300);
    const exercises = this.get<Exercise>(DB_KEYS.EXERCISES);
    // Return default global exercises (id starting with ex_) or custom branch ones
    return exercises.filter(e => e.branchId === branchId || e.id.startsWith('ex_'));
  }

  async createExercise(exercise: Exercise): Promise<void> {
    await delay(300);
    const exercises = this.get<Exercise>(DB_KEYS.EXERCISES);
    exercises.push(exercise);
    this.set(DB_KEYS.EXERCISES, exercises);
  }

  // === WORKOUTS ===
  async getWorkouts(currentUser: User): Promise<WorkoutSession[]> {
    await delay(400);
    const allWorkouts = this.get<WorkoutSession>(DB_KEYS.WORKOUTS);

    if (currentUser.role === UserRole.ADMIN) return allWorkouts;
    if (currentUser.role === UserRole.COACH) {
      return allWorkouts.filter(w => w.branchId === currentUser.branchId);
    }
    return allWorkouts.filter(w => w.userId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addWorkout(workout: WorkoutSession): Promise<void> {
      await delay(400);
      const workouts = this.get<WorkoutSession>(DB_KEYS.WORKOUTS);
      workouts.unshift(workout);
      this.set(DB_KEYS.WORKOUTS, workouts);

      // Update User Points
      const users = this.get<User>(DB_KEYS.USERS);
      const userIndex = users.findIndex(u => u.id === workout.userId);
      if(userIndex !== -1) {
          users[userIndex].points += workout.xpEarned;
          // Simple streak logic: if workout date is today/yesterday relative to last workout, increment or maintain
          // For Mock, just increment
          users[userIndex].streakDays += 1;
          this.set(DB_KEYS.USERS, users);
      }
  }

  // === COMMUNITY POSTS ===
  async getCommunityPosts(currentUser: User): Promise<CommunityPost[]> {
    await delay(300);
    const allPosts = this.get<CommunityPost>(DB_KEYS.POSTS);
    // Strict Branch Isolation
    return allPosts.filter(p => p.branchId === currentUser.branchId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async addPost(post: CommunityPost): Promise<void> {
    await delay(300);
    const posts = this.get<CommunityPost>(DB_KEYS.POSTS);
    posts.unshift(post);
    this.set(DB_KEYS.POSTS, posts);
  }

  // === BODY LOGS ===
  async getBodyLogs(userId: string): Promise<BodyLog[]> {
    await delay(300);
    const logs = this.get<BodyLog>(DB_KEYS.BODY_LOGS);
    return logs.filter(l => l.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addBodyLog(log: BodyLog): Promise<void> {
    await delay(300);
    const logs = this.get<BodyLog>(DB_KEYS.BODY_LOGS);
    logs.unshift(log);
    this.set(DB_KEYS.BODY_LOGS, logs);
  }

  // === LEADERBOARD (FAT LOSS) ===
  async getFatLossLeaderboard(branchId: string): Promise<LeaderboardEntry[]> {
    await delay(600); // Simulate calculation
    const users = this.get<User>(DB_KEYS.USERS).filter(u => u.branchId === branchId && u.role === UserRole.MEMBER);
    const logs = this.get<BodyLog>(DB_KEYS.BODY_LOGS);

    const leaderboard: LeaderboardEntry[] = [];

    users.forEach(user => {
        const userLogs = logs.filter(l => l.userId === user.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (userLogs.length >= 2) {
            const first = userLogs[0];
            const last = userLogs[userLogs.length - 1];
            if (first.bodyFatPercentage && last.bodyFatPercentage) {
                const diff = first.bodyFatPercentage - last.bodyFatPercentage;
                if (diff > 0) { // Only count positive loss
                    leaderboard.push({
                        userId: user.id,
                        name: user.name,
                        avatarUrl: user.avatarUrl || 'https://via.placeholder.com/150',
                        fatLossPercentage: parseFloat(diff.toFixed(1)),
                        rank: 0
                    });
                }
            }
        }
    });

    // Sort by fat loss desc
    leaderboard.sort((a, b) => b.fatLossPercentage - a.fatLossPercentage);
    
    // Assign Rank
    return leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }

  // === APPOINTMENTS ===
  async getAppointments(currentUser: User): Promise<Appointment[]> {
    return [];
  }
}

export const db = new MockDatabase();
