import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, WorkoutSession } from '../types';
import { db } from '../services/mockDb';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';
import { ArrowUpRight, Footprints } from 'lucide-react';

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

  // Mock Data for Heart Rate Chart to match image
  const heartRateData = [
    { name: '10', val: 40 },
    { name: '12', val: 70 },
    { name: '14', val: 50 },
    { name: '16', val: 80 }, // Highlighted
    { name: '18', val: 60 },
    { name: '20', val: 30 },
    { name: '22', val: 55 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
           <p className="text-fitness-textMuted text-sm font-semibold">Good Morning</p>
           <h1 className="text-3xl font-bold text-fitness-textMain dark:text-white font-display">{user.name}</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
           <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Heart Rate Zone */}
        <div className="space-y-6">
           <Card variant="dark" className="relative h-[420px]" title="Target Heart Rate Zone">
              <div className="flex gap-4 mb-6">
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-fitness-lime"></span>
                    <span className="text-xs text-zinc-400">Below zones</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white"></span>
                    <span className="text-xs text-zinc-400">Fat Burn</span>
                 </div>
              </div>

              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heartRateData} barGap={8}>
                       <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#6B7280', fontSize: 12}} 
                          dy={10}
                       />
                       <Bar dataKey="val" radius={[20, 20, 20, 20]} barSize={32}>
                          {heartRateData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 3 ? '#D2F665' : '#FFFFFF'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-end mt-4 px-2">
                 <div>
                    <span className="text-4xl font-bold text-white font-display">186</span>
                    <p className="text-xs text-zinc-500 mt-1">Peak BPM</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-bold text-white font-display">44</span>
                    <p className="text-xs text-zinc-500 mt-1">Resting BPM</p>
                 </div>
              </div>
           </Card>
           
           {/* Agenda / Steps */}
           <div className="flex flex-col sm:flex-row gap-8 items-start pt-4">
              <div className="flex-1">
                 <p className="text-fitness-textMain dark:text-white font-bold mb-2">1 Agenda :</p>
                 <div className="flex items-center gap-2 text-fitness-textMuted">
                    <span className="w-2 h-2 rounded-full bg-fitness-textMain dark:bg-white"></span>
                    Walking
                 </div>
              </div>
              <div className="flex-1">
                 <p className="text-fitness-textMuted text-sm font-medium mb-1">Steps :</p>
                 <h2 className="text-5xl font-bold text-fitness-textMain dark:text-white font-display tracking-tight">7.435</h2>
              </div>
           </div>
        </div>

        {/* Right Col: Daily Activities Grid */}
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-fitness-textMain dark:text-white font-display">Daily Activities</h2>
              <span className="text-xs font-bold text-fitness-textMuted uppercase">Today</span>
           </div>

           <div className="grid grid-cols-2 gap-6">
              {/* Weight Card */}
              <Card className="h-48 relative group hover:shadow-lg transition-all cursor-pointer">
                 <div className="absolute top-6 right-6 p-2 rounded-full bg-black text-white group-hover:bg-fitness-lime group-hover:text-black transition-colors">
                    <ArrowUpRight size={18} />
                 </div>
                 <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 text-fitness-textMain dark:text-white font-bold">
                       <span className="p-1.5 border-2 border-fitness-textMain dark:border-white rounded-md">
                          <div className="w-0.5 h-3 bg-fitness-textMain dark:bg-white mx-auto"></div>
                       </span>
                       Weight
                    </div>
                    <div>
                       <span className="text-3xl font-bold text-fitness-textMain dark:text-white font-display">72.2</span>
                       <span className="text-sm font-medium text-fitness-textMuted ml-1">kg</span>
                       <p className="text-xs text-fitness-textMuted mt-1">Stable Weight</p>
                    </div>
                 </div>
              </Card>

              {/* Heart Rate Card */}
              <Card variant="green" className="h-48 relative group hover:shadow-lg transition-all cursor-pointer">
                 <div className="absolute top-6 right-6 p-2 rounded-full bg-white text-fitness-darkGreen group-hover:bg-fitness-lime group-hover:text-black transition-colors">
                    <ArrowUpRight size={18} />
                 </div>
                 <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 text-white font-bold">
                       <span className="text-xl">♥</span>
                       Heart Rate
                    </div>
                    <div>
                       <span className="text-3xl font-bold text-white font-display">101</span>
                       <span className="text-sm font-medium text-white/80 ml-1">bpm</span>
                       <div className="mt-2 inline-block px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                          High HR
                       </div>
                    </div>
                 </div>
              </Card>

              {/* Body Composition Card - Full Width */}
              <Card variant="dark" className="col-span-2 relative group hover:shadow-xl transition-all cursor-pointer">
                  <div className="absolute top-6 right-6 p-2 rounded-full bg-white text-black group-hover:bg-fitness-lime transition-colors">
                    <ArrowUpRight size={18} />
                 </div>
                 <div className="flex flex-col md:flex-row justify-between items-end gap-6 h-full">
                    <div className="flex-1 w-full">
                       <div className="flex items-center gap-2 text-white font-bold mb-6">
                          <Footprints size={18} />
                          Body Composition
                       </div>
                       
                       <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white font-display">87.9</span>
                          <span className="text-xl text-white/80 font-display">%</span>
                       </div>
                       
                       <div className="mt-4 inline-block px-3 py-1 rounded-full bg-fitness-lime text-black text-xs font-bold">
                          Gaining Muscle
                       </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full md:w-1/2">
                       <div className="flex h-12 gap-1 items-end">
                          <div className="h-full w-full bg-fitness-lime rounded-2xl opacity-90 relative">
                             <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                          </div>
                          <div className="h-10 w-full bg-fitness-lime/30 rounded-2xl"></div>
                          <div className="h-8 w-full bg-fitness-lime/10 rounded-2xl"></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-zinc-500 mt-2 px-1">
                          <span>60</span>
                          <span>70</span>
                          <span>80</span>
                          <span>90</span>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};