import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { User, WorkoutSession } from '../types';
import { db } from '../services/mockDb';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Clock, Scale, ChevronRight, Activity, Trophy } from 'lucide-react';
import { Button } from '../components/Button';

interface MemberDashboardProps {
  user: User;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ user }) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await db.getWorkouts(user);
      setWorkouts(data);
    };
    loadData();
  }, [user]);

  // Smoother mock data for the area chart
  const activityData = [
    { name: 'Mon', val: 120 },
    { name: 'Tue', val: 300 },
    { name: 'Wed', val: 200 },
    { name: 'Thu', val: 450 },
    { name: 'Fri', val: 280 },
    { name: 'Sat', val: 390 },
    { name: 'Sun', val: 500 },
  ];

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      
      {/* Header Section */}
      <div className="flex justify-between items-start animate-in slide-in-from-top-4 fade-in duration-700">
        <div>
           <p className="text-viking-grey text-sm font-semibold mb-1">Good Morning</p>
           <h1 className="text-3xl md:text-4xl font-black text-viking-blue dark:text-white font-display tracking-tight leading-none">
             {user.name}
           </h1>
        </div>
        <button className="w-12 h-12 rounded-full bg-viking-offWhite dark:bg-white/10 flex items-center justify-center hover:bg-viking-blue hover:text-white dark:hover:bg-white dark:hover:text-viking-blue transition-all shadow-lg shadow-black/5 hover:scale-110">
           <Activity size={20} />
        </button>
      </div>

      {/* Progress Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-viking-blue dark:bg-viking-blueLight text-white shadow-2xl group cursor-pointer animate-in zoom-in-95 fade-in duration-700 delay-100 hover:scale-[1.02] transition-transform">
         {/* Background Image / Gradient */}
         <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
         <img 
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" 
            alt="Training" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
         />
         
         <div className="relative z-20 p-8 flex flex-col h-48 justify-between">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                  <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
               </div>
               <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/10 shadow-lg">
                 Advanced
               </span>
            </div>
            
            <div>
               <h3 className="text-3xl font-display font-black mb-1 drop-shadow-lg">21 trainings</h3>
               <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70 font-medium drop-shadow-md">8 trainings to PRO level</p>
                  <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                     <span className="text-[10px] font-bold">72%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
        <h2 className="text-xl font-bold text-viking-blue dark:text-white mb-6 font-display">Performance</h2>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           
           {/* Metric 1: Weight */}
           <div className="bg-white dark:bg-viking-blueLight rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-lg border border-viking-grey/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-2 text-viking-blue dark:text-white font-bold">
                 <Scale size={18} />
              </div>
              <div>
                 <p className="text-xs text-viking-grey uppercase font-bold tracking-wider mb-1">Weight</p>
                 <span className="text-3xl font-black text-viking-blue dark:text-white font-display">63</span>
                 <span className="text-sm text-viking-grey ml-1 font-medium">kg</span>
              </div>
           </div>

           {/* Metric 2: Kcal Burn (Highlighted) */}
           <div className="bg-viking-action rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-[0_10px_40px_-10px_rgba(0,87,184,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-2 text-white font-bold relative z-10">
                 <Flame size={20} fill="currentColor" />
              </div>
              <div className="relative z-10">
                 <p className="text-xs text-white/80 uppercase font-bold tracking-wider mb-1">Kcal Burn</p>
                 <span className="text-4xl font-black text-white font-display">5,423</span>
              </div>
           </div>

           {/* Metric 3: Total Duration */}
           <div className="col-span-2 md:col-span-1 bg-white dark:bg-viking-blueLight rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-lg border border-viking-grey/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-2 text-viking-blue dark:text-white font-bold">
                 <Clock size={18} />
              </div>
              <div>
                 <p className="text-xs text-viking-grey uppercase font-bold tracking-wider mb-1">Total Duration</p>
                 <div className="flex items-baseline">
                   <span className="text-3xl font-black text-viking-blue dark:text-white font-display">3</span>
                   <span className="text-sm text-viking-blue dark:text-white font-bold mr-2">h</span>
                   <span className="text-3xl font-black text-viking-blue dark:text-white font-display">46</span>
                   <span className="text-sm text-viking-blue dark:text-white font-bold">m</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-viking-blue dark:bg-black/20 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
         <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
               <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Total Average</p>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black font-display text-viking-action drop-shadow-[0_0_10px_rgba(0,87,184,0.5)]">556</span>
                 <span className="text-lg font-bold text-white/80">Kcal</span>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5">Kcal</button>
               <button className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5">Weekly</button>
            </div>
         </div>

         <div className="h-40 w-full relative z-10 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={activityData}>
                  <defs>
                     <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EA4335" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EA4335" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(19, 36, 54, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                     itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                     cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Area 
                     type="monotone" 
                     dataKey="val" 
                     stroke="#EA4335" 
                     fillOpacity={1} 
                     fill="url(#colorVal)" 
                     strokeWidth={4}
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Quick Action (Start Workout) */}
      <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-400">
         <Button 
            fullWidth 
            size="lg" 
            className="rounded-[2rem] bg-viking-action text-white font-black uppercase tracking-widest text-lg shadow-[0_10px_40px_-10px_rgba(0,87,184,0.6)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/20"
         >
            <div className="w-8 h-8 rounded-full bg-white text-viking-action flex items-center justify-center shadow-md">
               <Flame size={18} fill="currentColor" />
            </div>
            Start Workout
         </Button>
      </div>

    </div>
  );
};