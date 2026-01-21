
import React, { useEffect, useState } from 'react';
import { User, WorkoutSession, LeaderboardEntry } from '../types';
import { db } from '../services/mockDb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, Flame, Timer, Zap, Plus, Crown, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

interface TrainingHubProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const TrainingHub: React.FC<TrainingHubProps> = ({ user, onUpdateUser }) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Log Modal State
  const [isLogging, setIsLogging] = useState(false);
  const [newType, setNewType] = useState<WorkoutSession['type']>('Strength');
  const [newDuration, setNewDuration] = useState(60);
  const [newCalories, setNewCalories] = useState(300);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [fetchedWorkouts, fetchedLeaderboard] = await Promise.all([
      db.getWorkouts(user),
      db.getFatLossLeaderboard(user.branchId)
    ]);
    setWorkouts(fetchedWorkouts);
    setLeaderboard(fetchedLeaderboard);
    setLoading(false);
  };

  const handleLogWorkout = async () => {
    const xp = Math.floor(newDuration * 1.5 + newCalories * 0.1); // XP Calc Logic
    const newWorkout: WorkoutSession = {
      id: `w_${Date.now()}`,
      userId: user.id,
      branchId: user.branchId,
      date: new Date().toISOString(),
      type: newType,
      durationMinutes: newDuration,
      caloriesBurned: newCalories,
      xpEarned: xp
    };

    await db.addWorkout(newWorkout);
    
    // Optimistic Update
    onUpdateUser({ 
        ...user, 
        points: user.points + xp,
        streakDays: user.streakDays + 1 
    });
    
    setIsLogging(false);
    loadData();
  };

  // Gamification Calcs
  const currentLevel = Math.floor(user.points / 1000) + 1;
  const nextLevelPoints = currentLevel * 1000;
  const progress = ((user.points % 1000) / 1000) * 100;

  // Chart Data preparation
  const chartData = workouts.slice(0, 7).reverse().map(w => ({
    day: new Date(w.date).toLocaleDateString('en-US', { weekday: 'short' }),
    xp: w.xpEarned,
    cal: w.caloriesBurned
  }));

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      
      {/* 1. GAMIFICATION HEADER */}
      <div className="relative overflow-hidden bg-viking-blue dark:bg-viking-blueLight rounded-[2.5rem] p-8 text-white shadow-2xl animate-in slide-in-from-top duration-700">
         <div className="absolute top-0 right-0 w-64 h-64 bg-viking-action/20 blur-[80px] rounded-full pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="w-full">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold uppercase tracking-widest text-viking-action bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">Level {currentLevel}</span>
                 <div className="flex items-center gap-2 text-orange-400">
                    <Flame size={18} fill="currentColor" className="animate-pulse" />
                    <span className="font-black font-display text-lg">{user.streakDays} Day Streak</span>
                 </div>
               </div>
               <h1 className="text-4xl md:text-5xl font-black font-display italic tracking-tighter mb-4">
                 {user.points} <span className="text-white/40 text-2xl not-italic">XP</span>
               </h1>
               
               {/* Progress Bar */}
               <div className="relative h-4 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-viking-action to-cyan-400 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <div className="flex justify-between mt-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                  <span>Current</span>
                  <span>{nextLevelPoints - user.points} XP to Level {currentLevel + 1}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. LEADERBOARD WIDGET ("THE SHREDDERS") */}
          <div className="lg:col-span-2 space-y-6 animate-in slide-in-from-left duration-700 delay-100">
             <div className="flex items-center gap-3">
                <Trophy className="text-yellow-500" size={28} />
                <h2 className="text-2xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Fat Loss Leaders</h2>
             </div>
             
             {/* Podium (Top 3) */}
             <div className="flex justify-center items-end gap-4 mb-8 min-h-[180px]">
                {leaderboard[1] && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-700 delay-300">
                        <div className="w-16 h-16 rounded-full border-4 border-gray-400 overflow-hidden mb-2 shadow-lg">
                            <img src={leaderboard[1].avatarUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-gray-400/20 backdrop-blur-md border border-gray-400/30 p-4 rounded-t-2xl w-24 text-center h-24 flex flex-col justify-end">
                             <span className="text-gray-400 font-black text-xl">#2</span>
                             <span className="text-viking-blue dark:text-white font-bold text-sm truncate">{leaderboard[1].name.split(' ')[0]}</span>
                             <span className="text-xs text-viking-action font-bold">-{leaderboard[1].fatLossPercentage}%</span>
                        </div>
                    </div>
                )}
                {leaderboard[0] && (
                    <div className="flex flex-col items-center z-10 animate-in slide-in-from-bottom duration-700 delay-200">
                         <div className="relative">
                            <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-500 animate-bounce" size={24} />
                            <div className="w-20 h-20 rounded-full border-4 border-yellow-500 overflow-hidden mb-2 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                                <img src={leaderboard[0].avatarUrl} className="w-full h-full object-cover" />
                            </div>
                         </div>
                        <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 p-4 rounded-t-2xl w-28 text-center h-32 flex flex-col justify-end shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                             <span className="text-yellow-500 font-black text-2xl">#1</span>
                             <span className="text-viking-blue dark:text-white font-bold text-sm truncate">{leaderboard[0].name.split(' ')[0]}</span>
                             <span className="text-xs text-viking-action font-black">-{leaderboard[0].fatLossPercentage}%</span>
                        </div>
                    </div>
                )}
                {leaderboard[2] && (
                     <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-700 delay-400">
                        <div className="w-16 h-16 rounded-full border-4 border-orange-700 overflow-hidden mb-2 shadow-lg">
                            <img src={leaderboard[2].avatarUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-orange-700/20 backdrop-blur-md border border-orange-700/30 p-4 rounded-t-2xl w-24 text-center h-20 flex flex-col justify-end">
                             <span className="text-orange-700 font-black text-xl">#3</span>
                             <span className="text-viking-blue dark:text-white font-bold text-sm truncate">{leaderboard[2].name.split(' ')[0]}</span>
                             <span className="text-xs text-viking-action font-bold">-{leaderboard[2].fatLossPercentage}%</span>
                        </div>
                    </div>
                )}
             </div>

             {/* Chart */}
             <Card title="Weekly Intensity" className="shadow-lg h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0057B8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0057B8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#132436', borderRadius: '12px', border: 'none' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="xp" stroke="#0057B8" strokeWidth={3} fill="url(#colorXp)" />
                    </AreaChart>
                </ResponsiveContainer>
             </Card>
          </div>

          {/* 3. HISTORY & LOGGING */}
          <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-200">
             <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Logbook</h2>
                 <Button size="sm" onClick={() => setIsLogging(!isLogging)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                    <Plus size={24} />
                 </Button>
             </div>

             {isLogging && (
                 <div className="bg-viking-action/10 border border-viking-action/30 p-6 rounded-[2rem] animate-in zoom-in-95 duration-300">
                    <h3 className="font-bold text-viking-action uppercase mb-4 text-sm">New Entry</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-viking-grey uppercase">Type</label>
                            <select 
                                value={newType} 
                                onChange={(e) => setNewType(e.target.value as any)}
                                className="w-full bg-white dark:bg-viking-blue p-3 rounded-xl font-bold text-sm focus:outline-none"
                            >
                                <option>Strength</option>
                                <option>Cardio</option>
                                <option>HIIT</option>
                                <option>Recovery</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-viking-grey uppercase">Mins</label>
                                <input type="number" value={newDuration} onChange={e => setNewDuration(Number(e.target.value))} className="w-full bg-white dark:bg-viking-blue p-3 rounded-xl font-bold text-sm focus:outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-viking-grey uppercase">Cals</label>
                                <input type="number" value={newCalories} onChange={e => setNewCalories(Number(e.target.value))} className="w-full bg-white dark:bg-viking-blue p-3 rounded-xl font-bold text-sm focus:outline-none" />
                            </div>
                        </div>
                        <Button fullWidth onClick={handleLogWorkout} className="shadow-lg">Save & Earn XP</Button>
                    </div>
                 </div>
             )}

             <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {workouts.map((workout, idx) => (
                    <div 
                        key={workout.id} 
                        className="group relative bg-white dark:bg-viking-blueLight border border-viking-grey/10 hover:border-viking-action/50 p-5 rounded-[2rem] transition-all hover:shadow-xl hover:-translate-y-1"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="px-3 py-1 bg-viking-offWhite dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-wider text-viking-grey group-hover:bg-viking-action group-hover:text-white transition-colors">
                                {workout.type}
                            </span>
                            <span className="text-xs font-bold text-viking-grey">{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-6">
                             <div>
                                <div className="text-2xl font-black font-display text-viking-blue dark:text-white">{workout.xpEarned}</div>
                                <div className="text-[10px] font-bold text-viking-action uppercase">XP Earned</div>
                             </div>
                             <div className="h-8 w-px bg-viking-grey/20"></div>
                             <div>
                                <div className="text-lg font-bold text-viking-blue dark:text-white">{workout.caloriesBurned}</div>
                                <div className="text-[10px] font-bold text-viking-grey uppercase">Calories</div>
                             </div>
                             <div className="ml-auto">
                                <Zap className="text-viking-grey group-hover:text-viking-action transition-colors" size={20} />
                             </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

      </div>
    </div>
  );
};
