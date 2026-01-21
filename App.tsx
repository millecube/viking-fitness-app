import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from './types';
import { db } from './services/mockDb';
import { AdminDashboard } from './views/AdminDashboard';
import { CoachDashboard } from './views/CoachDashboard';
import { MemberDashboard } from './views/MemberDashboard';
import { CommunityFeed } from './views/CommunityFeed';
import { BodyTracker } from './views/BodyTracker';
import { TrainingHub } from './views/TrainingHub';
import { ProfileEditor } from './views/ProfileEditor';
import { Navigation } from './components/Navigation';
import { Button } from './components/Button';
import { Lock, Sword, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Login State
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // Torchlight Effect State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const foundUser = await db.getUserByEmail(email);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('User not found. Try: admin@hyper.com');
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

  const renderDashboard = () => {
    if (!user) return null;
    
    if (currentView === 'profile') return <ProfileEditor user={user} onUpdateUser={handleUpdateUser} />;
    if (currentView === 'community') return <CommunityFeed user={user} />;
    if (user.role === UserRole.MEMBER && currentView === 'bodytracker') return <BodyTracker user={user} />;
    if (user.role === UserRole.MEMBER && currentView === 'training') return <TrainingHub user={user} onUpdateUser={handleUpdateUser} />;

    if (currentView === 'dashboard') {
      switch (user.role) {
        case UserRole.ADMIN: return <AdminDashboard user={user} />;
        case UserRole.COACH: return <CoachDashboard user={user} />;
        case UserRole.MEMBER: return <MemberDashboard user={user} />;
        default: return <div>Unknown Role</div>;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-viking-grey animate-in fade-in">
        <Sword size={48} className="mb-4 opacity-20" />
        <p>This module is under construction.</p>
        <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mt-4">Return Home</Button>
      </div>
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // --- NEW LOGIN DESIGN (Full Screen with Torchlight) ---
  if (!user) {
    return (
      <div 
        className="min-h-screen bg-viking-bgDark text-white relative overflow-hidden flex flex-col"
        onMouseMove={handleMouseMove}
      >
        
        {/* Background Layer: Blurred Logo */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
             <img 
               src="/viking-logo.png" 
               alt="Background" 
               className="w-[150%] max-w-none h-auto object-cover opacity-20 blur-3xl animate-pulse"
               style={{ animationDuration: '8s' }}
             />
        </div>

        {/* Torchlight Overlay - Reveals slightly more light around cursor */}
        <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(13, 26, 196, 0.2), transparent 50%)`
            }}
        />
        
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col justify-between p-8 relative z-10">
           
           {/* Header */}
           <div className="pt-8 animate-in slide-in-from-top duration-700">
              <div className="flex items-center gap-4 mb-6 group cursor-pointer w-fit">
                 <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img src="/viking-logo.png" className="w-full h-full object-cover" alt="Logo" />
                    {/* Mini torchlight on logo hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                 </div>
                 <span className="font-black tracking-tighter text-lg">VIKING FITNESS</span>
              </div>
           </div>

           {/* Hero Text */}
           <div className="mb-auto mt-12 animate-in slide-in-from-left duration-700 delay-200">
              <h1 className="text-5xl md:text-7xl font-black italic leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl">
                BE HEALTHY<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">BE STRONGER</span><br/>
                <span className="text-viking-action drop-shadow-[0_0_20px_rgba(13,26,196,0.8)]">BE YOURSELF</span>
              </h1>
              <p className="text-white/60 max-w-xs leading-relaxed font-medium backdrop-blur-sm bg-black/10 p-2 rounded-lg">
                Join the elite community of high-performance athletes. Your journey to Valhalla starts now.
              </p>
           </div>

           {/* Login Form (Bottom Anchored) */}
           <div className="space-y-4 w-full max-w-md mx-auto animate-in slide-in-from-bottom duration-700 delay-300">
              {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center animate-in zoom-in">{error}</div>}
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 flex items-center shadow-2xl group focus-within:ring-2 focus-within:ring-viking-action/50 transition-all">
                 <div className="w-12 h-12 flex items-center justify-center text-white/50">
                    <Lock size={20} />
                 </div>
                 <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Access ID / Email"
                    className="bg-transparent border-none outline-none text-white placeholder:text-white/30 w-full h-12 font-bold px-2"
                 />
                 <button 
                   onClick={handleLogin}
                   className="h-12 px-8 rounded-full bg-viking-action text-white font-black uppercase tracking-wider hover:bg-white hover:text-viking-action transition-all shadow-[0_8px_30px_rgba(13,26,196,0.4)] backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95"
                 >
                   {loading ? '...' : 'GO'}
                 </button>
              </div>

              {/* Demo Pills */}
              <div className="flex justify-center gap-3 pt-4 overflow-x-auto pb-2 no-scrollbar">
                 <button onClick={() => setEmail('johnny@gmail.com')} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold hover:bg-white hover:text-viking-action transition-colors whitespace-nowrap">Member Demo</button>
                 <button onClick={() => setEmail('jax@hyper.com')} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold hover:bg-white hover:text-viking-action transition-colors whitespace-nowrap">Coach Demo</button>
                 <button onClick={() => setEmail('admin@hyper.com')} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold hover:bg-white hover:text-viking-action transition-colors whitespace-nowrap">Admin Demo</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP LAYOUT ---
  return (
    <div className="min-h-screen bg-viking-bgLight dark:bg-viking-bgDark text-viking-textLight dark:text-viking-textDark flex transition-colors duration-300 font-sans">
      <Navigation 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      {/* 
         Layout logic: 
         Desktop: ml-72 for sidebar, p-8
         Mobile: pb-28 for bottom nav, pt-24 for top bar (or just spacing), px-6
      */}
      <main className="flex-1 w-full md:ml-72 p-6 md:p-8 pt-24 md:pt-8 pb-32 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default App;