# HyperPhysique Technical Blueprint

## 1. Firebase Firestore Schema
The database is structured to support multi-tenancy (multi-branch) with strict data isolation.

### `branches` Collection
Metadata for physical gym locations.
```json
{
  "id": "b_nyc_01",
  "name": "Metro Iron NYC",
  "location": "New York, NY",
  "activeMembers": 120,
  "features": ["sauna", "open_24h"]
}
```

### `users` Collection
Stores authentication and profile data.
*Index:* `branchId` (ASC), `role` (ASC), `points` (DESC)
```json
{
  "id": "u_123",
  "email": "john@example.com",
  "role": "MEMBER", // 'ADMIN' | 'COACH' | 'MEMBER'
  "branchId": "b_nyc_01", // CRITICAL for Isolation
  "assignedCoachId": "u_coach_1",
  "gamification": {
    "points": 2400,
    "streakDays": 12,
    "currentTier": "GOLD"
  }
}
```

### `workout_sessions` Collection
Logs of physical activity.
*Index:* `branchId` (ASC), `date` (DESC)
```json
{
  "id": "w_999",
  "userId": "u_123",
  "branchId": "b_nyc_01",
  "date": "2023-10-24T10:00:00Z",
  "type": "STRENGTH",
  "metrics": {
    "duration": 60,
    "calories": 450,
    "volumeLoad": 12000
  },
  "xpEarned": 150
}
```

### `body_logs` Collection
Progress tracking with photos.
*Security:* Only readable by the owner (`userId`) and their assigned Coach.
```json
{
  "id": "bl_55",
  "userId": "u_123",
  "branchId": "b_nyc_01",
  "date": "2023-10-01",
  "photoUrl": "gs://bucket/users/u_123/progress/img_01.jpg",
  "weight": 185.5
}
```

### `appointments` Collection
Scheduling system.
```json
{
  "id": "apt_22",
  "coachId": "u_coach_1",
  "memberId": "u_123",
  "branchId": "b_nyc_01",
  "time": "2023-10-25T14:00:00Z",
  "status": "SCHEDULED"
}
```

---

## 2. Authentication Flow & RBAC

### Login Process
1. User authenticates via Firebase Auth (Email/Password).
2. Backend triggers `onAuthStateChanged`.
3. Application fetches the `users` document corresponding to `auth.uid`.
4. **Role Check:**
   - **Admin:** Redirect to `/admin`. Has Global Scope.
   - **Coach:** Redirect to `/coach`. Scope restricted to `branchId`.
   - **Member:** Redirect to `/dashboard`. Scope restricted to `userId`.

### Access Control Rules (Firestore Security Rules)
```
match /users/{userId} {
  allow read: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ADMIN', 'COACH'];
}
match /workout_sessions/{sessionId} {
  // Members see own, Coaches see their Branch's, Admins see all
  allow read: if request.auth.uid == resource.data.userId || 
              (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'COACH' && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.branchId == resource.data.branchId);
}
```

---

## 3. Multi-Branch Isolation Logic

To ensure Branch A users never see Branch B data:
1. **Data Stamping:** Every document (`users`, `workouts`, `posts`) MUST contain a `branchId` field.
2. **Query Enforcement:**
   - Client-side queries must strictly include the `.where('branchId', '==', currentUser.branchId)` clause.
   - *Example:* A Coach fetching "All Students" actually runs `db.collection('users').where('role', '==', 'MEMBER').where('branchId', '==', coach.branchId).get()`.
3. **Admin Override:** The "Super Admin" role bypasses this filter in the Admin Dashboard to view global analytics.

---

## 4. Gamification Logic ("Top 1" Calculation)

### XP Calculation Formula
XP is calculated per `workout_session` commit:
```typescript
const BASE_XP = 10;
const DURATION_MULTIPLIER = 1.5; // per minute
const CALORIE_MULTIPLIER = 0.2; // per calorie

let xp = BASE_XP + (duration * DURATION_MULTIPLIER) + (calories * CALORIE_MULTIPLIER);
if (isPersonalBest) xp += 50; // Bonus
```

### Leaderboard ("Top 1") Logic
Since Firestore does not support real-time aggregate sorting of thousands of users cheaply, we use a hybrid approach:

1. **User Document Counter:** The `users` document maintains a running `points` total.
2. **Cloud Function Trigger:** On `workout_session.create`:
   - Calculate XP.
   - Atomically increment `users/{userId}.points`.
3. **Fetching Rank:**
   - *Query:* `db.collection('users').where('branchId', '==', myBranch).orderBy('points', 'desc').limit(1)` determines the "Top 1".
   - *My Rank:* If strict numerical rank (e.g., #45) is needed, we execute a count query for `points > myPoints`.

### Tiers
- **Bronze:** 0 - 1000 XP
- **Silver:** 1001 - 5000 XP
- **Gold:** 5001 - 10000 XP
- **Hyper:** 10001+ XP (Neon access)
