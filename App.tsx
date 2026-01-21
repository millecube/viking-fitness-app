import React, { useState } from 'react';
import { User, UserRole } from './types';
import { db } from './services/mockDb';
import { AdminDashboard } from './views/AdminDashboard';
import { CoachDashboard } from './views/CoachDashboard';
import { MemberDashboard } from './views/MemberDashboard';
import { CommunityFeed } from './views/CommunityFeed';
import { BodyTracker } from './views/BodyTracker';
import { ProfileEditor } from './views/ProfileEditor';
import { Navigation } from './components/Navigation';
import { Button } from './components/Button';
import { Lock, Sword } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Login State
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      const foundUser = await db.getUserByEmail(email);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('User not found. Try: admin@hyper.com, jax@hyper.com, or johnny@gmail.com');
      }
    } catch (err) {
      setError('System error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
  };

  // Render Dashboard based on Role
  const renderDashboard = () => {
    if (!user) return null;
    
    // Shared Views
    if (currentView === 'profile') {
        return <ProfileEditor user={user} onUpdateUser={handleUpdateUser} />;
    }

    if (currentView === 'community') {
      return <CommunityFeed user={user} />;
    }

    // Role Specific Views
    if (user.role === UserRole.MEMBER && currentView === 'bodytracker') {
      return <BodyTracker user={user} />;
    }

    // Default Dashboard View
    if (currentView === 'dashboard') {
      switch (user.role) {
        case UserRole.ADMIN:
          return <AdminDashboard user={user} />;
        case UserRole.COACH:
          return <CoachDashboard user={user} />;
        case UserRole.MEMBER:
          return <MemberDashboard user={user} />;
        default:
          return <div>Unknown Role</div>;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-viking-grey">
        <Sword size={48} className="mb-4 opacity-20" />
        <p>This module is under construction.</p>
        <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mt-4">Return Home</Button>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-viking-navy p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-viking-action/10 blur-[120px] rounded-full"></div>
           <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="w-full max-w-md bg-viking-navyLight border border-viking-action/20 rounded-none p-10 relative z-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-full bg-viking-action mb-4 shadow-lg shadow-blue-500/30">
              <Sword size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2 font-display">VIKING <span className="text-viking-action">FITNESS</span></h1>
            <p className="text-viking-grey text-sm font-bold uppercase tracking-widest">Trainers for Everyone</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-viking-grey uppercase tracking-widest mb-2">Access ID / Email</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-viking-grey" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-viking-navy border border-viking-grey/30 text-white p-3 pl-10 focus:outline-none focus:border-viking-action focus:ring-1 focus:ring-viking-action transition-all placeholder:text-slate-600 font-medium"
                  placeholder="admin@hyper.com"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold uppercase">{error}</p>}

            <Button type="button" fullWidth variant="primary" onClick={handleLogin} disabled={loading} className="h-14 text-lg">
              {loading ? 'Authenticating...' : 'Enter Valhalla'}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-viking-grey/10">
            <p className="text-xs text-center text-viking-grey mb-4 font-bold uppercase tracking-wider">Demo Credentials</p>
            <div className="flex justify-between gap-3 text-xs">
              <button onClick={() => setEmail('admin@hyper.com')} className="flex-1 py-3 bg-viking-navy hover:bg-black/20 border border-viking-grey/20 text-viking-grey hover:text-white transition-colors font-bold uppercase">Admin</button>
              <button onClick={() => setEmail('jax@hyper.com')} className="flex-1 py-3 bg-viking-navy hover:bg-black/20 border border-viking-grey/20 text-viking-grey hover:text-white transition-colors font-bold uppercase">Coach</button>
              <button onClick={() => setEmail('johnny@gmail.com')} className="flex-1 py-3 bg-viking-navy hover:bg-black/20 border border-viking-grey/20 text-viking-grey hover:text-white transition-colors font-bold uppercase">Member</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-viking-navy text-viking-navy dark:text-white flex transition-colors duration-300">
      <Navigation 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default App;