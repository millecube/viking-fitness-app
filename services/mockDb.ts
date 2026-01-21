import { Branch, User, UserRole, WorkoutSession, Appointment, CommunityPost, BodyLog } from '../types';

// === INITIAL DATA SEEDING ===

const INITIAL_BRANCHES: Branch[] = [
  { id: 'b_nyc_01', name: 'Metro Iron NYC', location: 'New York, NY', activeMembers: 1240 },
  { id: 'b_la_01', name: 'Venice Beach Prime', location: 'Los Angeles, CA', activeMembers: 890 },
];

const INITIAL_USERS: User[] = [
  { id: 'u_admin_1', name: 'Zeus Commander', email: 'admin@hyper.com', role: UserRole.ADMIN, branchId: 'b_nyc_01', avatarUrl: 'https://picsum.photos/seed/admin1/150/150', points: 0, streakDays: 0 },
  { id: 'u_coach_1', name: 'Jax Briggs', email: 'jax@hyper.com', role: UserRole.COACH, branchId: 'b_nyc_01', avatarUrl: 'https://picsum.photos/seed/coach1/150/150', points: 0, streakDays: 0 },
  { id: 'u_mem_1', name: 'Johnny Cage', email: 'johnny@gmail.com', role: UserRole.MEMBER, branchId: 'b_nyc_01', assignedCoachId: 'u_coach_1', avatarUrl: 'https://picsum.photos/seed/mem1/150/150', points: 2450, streakDays: 12 },
  { id: 'u_mem_2', name: 'Liu Kang', email: 'liu@gmail.com', role: UserRole.MEMBER, branchId: 'b_nyc_01', assignedCoachId: 'u_coach_1', avatarUrl: 'https://picsum.photos/seed/mem2/150/150', points: 3100, streakDays: 24 },
  { id: 'u_mem_3', name: 'Kung Lao', email: 'kung@gmail.com', role: UserRole.MEMBER, branchId: 'b_la_01', assignedCoachId: 'u_coach_2', avatarUrl: 'https://picsum.photos/seed/mem3/150/150', points: 1200, streakDays: 3 },
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
  { id: 'bl_1', userId: 'u_mem_1', branchId: 'b_nyc_01', date: new Date(Date.now() - 86400000 * 30).toISOString(), weight: 185, bodyFatPercentage: 15 },
];

const DB_KEYS = {
  BRANCHES: 'hyper_branches',
  USERS: 'hyper_users',
  WORKOUTS: 'hyper_workouts',
  POSTS: 'hyper_posts',
  BODY_LOGS: 'hyper_body_logs',
  APPOINTMENTS: 'hyper_appointments'
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

  // === WORKOUTS ===
  async getWorkouts(currentUser: User): Promise<WorkoutSession[]> {
    await delay(400);
    const allWorkouts = this.get<WorkoutSession>(DB_KEYS.WORKOUTS);

    if (currentUser.role === UserRole.ADMIN) return allWorkouts;
    if (currentUser.role === UserRole.COACH) {
      return allWorkouts.filter(w => w.branchId === currentUser.branchId);
    }
    return allWorkouts.filter(w => w.userId === currentUser.id);
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

  // === APPOINTMENTS ===
  async getAppointments(currentUser: User): Promise<Appointment[]> {
    return [];
  }
}

export const db = new MockDatabase();