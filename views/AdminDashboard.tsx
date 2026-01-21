import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Branch, User, WorkoutSession } from '../types';
import { db } from '../services/mockDb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Users, TrendingUp, MapPin, DollarSign, Building } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.getBranches();
      setBranches(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter logic based on selection
  const activeBranch = selectedBranchId === 'all' 
    ? null 
    : branches.find(b => b.id === selectedBranchId);

  // Mock aggregate data for charts
  const activityData = [
    { name: 'Mon', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.4) : 4000 },
    { name: 'Tue', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.35) : 3000 },
    { name: 'Wed', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.3) : 2000 },
    { name: 'Thu', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.38) : 2780 },
    { name: 'Fri', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.25) : 1890 },
    { name: 'Sat', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.45) : 2390 },
    { name: 'Sun', active: activeBranch ? Math.floor(activeBranch.activeMembers * 0.5) : 3490 },
  ];

  const revenueData = [
    { name: 'Jan', val: activeBranch ? 1200 : 4000 },
    { name: 'Feb', val: activeBranch ? 1500 : 3000 },
    { name: 'Mar', val: activeBranch ? 1800 : 5000 },
    { name: 'Apr', val: activeBranch ? 1600 : 4500 },
    { name: 'May', val: activeBranch ? 2100 : 6000 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card className="border-l-4 border-l-viking-action">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-viking-grey text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
          <h4 className="text-3xl font-black text-viking-blue dark:text-white font-display">{value}</h4>
          {trend && <span className="text-green-600 dark:text-green-400 text-xs flex items-center mt-2 font-bold">+{trend}% this week</span>}
        </div>
        <div className="p-3 bg-viking-offWhite dark:bg-white/10 rounded-xl text-viking-action dark:text-white">
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );

  if (loading) return <div className="p-8 text-viking-action animate-pulse font-bold uppercase tracking-widest">Initializing HQ...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-viking-grey/10 pb-6">
        <div>
          <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">HQ Command</h2>
          <span className="flex items-center gap-2 text-xs text-viking-grey font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Operational
          </span>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-viking-blueLight p-2 border border-viking-grey/20 rounded-xl">
          <Building size={16} className="text-viking-action ml-2" />
          <select 
            className="bg-transparent text-viking-blue dark:text-white text-sm font-bold focus:outline-none cursor-pointer uppercase tracking-wide"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            <option value="all">All Branches (Global)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={activeBranch ? activeBranch.activeMembers.toLocaleString() : "12,450"} 
          icon={Users} 
          trend={12} 
        />
        <StatCard 
          title="Active Locations" 
          value={activeBranch ? 1 : branches.length} 
          icon={MapPin} 
        />
        <StatCard 
          title="Avg. Daily Workouts" 
          value={activeBranch ? Math.floor(3200 / branches.length) : "3,200"} 
          icon={TrendingUp} 
          trend={5} 
        />
        <StatCard 
          title="Revenue (Est.)" 
          value={activeBranch ? "$240k" : "$840k"} 
          icon={DollarSign} 
          trend={8} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`Network Activity (${selectedBranchId === 'all' ? 'Global' : activeBranch?.name})`} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#132436', borderColor: '#333', color: '#fff' }} 
                cursor={{ fill: '#333' }}
              />
              {/* Bars are Action Blue */}
              <Bar dataKey="active" fill="#0057B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Trend" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <Tooltip contentStyle={{ backgroundColor: '#132436', borderColor: '#333', color: '#fff' }} />
              <Line type="monotone" dataKey="val" stroke="#132436" strokeWidth={3} dot={{ fill: '#132436', strokeWidth: 2 }} className="dark:stroke-white dark:fill-white" />
              {/* Hack for line color in dark mode via CSS override is usually needed, or use stroke="currentColor" and a class */}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Branch List">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-viking-grey">
            <thead className="bg-viking-offWhite dark:bg-viking-blueLight text-xs uppercase font-bold text-viking-blue dark:text-white tracking-wider border-b border-viking-grey/20">
              <tr>
                <th className="p-4">Branch Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-viking-grey/10">
              {branches
                .filter(b => selectedBranchId === 'all' || b.id === selectedBranchId)
                .map(branch => (
                <tr key={branch.id} className="hover:bg-viking-offWhite dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-viking-blue dark:text-white uppercase">{branch.name}</td>
                  <td className="p-4">{branch.location}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-200 dark:border-green-500/20 rounded-md">
                      Operational
                    </span>
                  </td>
                  <td className="p-4 text-right text-viking-action font-mono font-bold">{branch.activeMembers.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};