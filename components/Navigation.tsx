import React from 'react';
import { User, UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, LayoutDashboard, Users, Map, Dumbbell, Activity, MessageSquare, Scale, Settings, Edit, Sword, Home, User as UserIcon } from 'lucide-react';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, currentView, onChangeView }) => {
  
  // Desktop Nav Item
  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all rounded-2xl mx-2 w-[calc(100%-1rem)] mb-1
        ${currentView === view 
          ? 'bg-viking-action text-white shadow-lg shadow-viking-action/20 scale-105' 
          : 'text-viking-grey hover:bg-viking-surfaceLight hover:text-viking-action dark:hover:bg-white/10 dark:hover:text-white'
        }`}
    >
      <Icon size={22} className={currentView === view ? 'text-white' : ''} />
      {label}
    </button>
  );

  // Mobile Bottom Nav Item
  const MobileNavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label?: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => onChangeView(view)}
        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? '-translate-y-4' : ''}`}
      >
        <div className={`
          p-4 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20
          ${isActive 
            ? 'bg-viking-action text-white shadow-[0_8px_20px_rgba(13,26,196,0.4)] scale-110' 
            : 'text-viking-grey bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
          }
        `}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {isActive && (
          <span className="absolute -bottom-6 text-[10px] font-bold text-viking-textLight dark:text-white animate-in fade-in slide-in-from-bottom-2 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
            {label}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-72 bg-white dark:bg-viking-surfaceDark flex-col z-50 border-r border-viking-grey/10">
        <div className="p-8 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4 mb-12">
             {/* Logo Container with Torchlight Shimmer Effect */}
             <div className="relative group cursor-pointer w-14 h-14 rounded-full overflow-hidden border-2 border-viking-surfaceLight dark:border-viking-bgDark shadow-xl bg-viking-action">
                <img 
                   src="/viking-logo.png" 
                   alt="Viking Fitness" 
                   className="w-full h-full object-cover relative z-10"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.nextElementSibling?.classList.remove('hidden');
                   }}
                />
                {/* Fallback Icon */}
                <div className="hidden absolute inset-0 bg-viking-action text-white flex items-center justify-center">
                    <Sword size={24} />
                </div>
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
             </div>
             
             <div>
               <span className="block text-2xl font-black text-viking-textLight dark:text-white tracking-tight">VIKING</span>
             </div>
          </div>
          
          <div className="space-y-8">
            <div>
               <p className="text-xs font-bold text-viking-grey uppercase tracking-widest px-6 mb-4">Menu</p>
               <nav className="space-y-1">
                <NavItem view="dashboard" icon={Home} label="Dashboard" />
                <NavItem view="community" icon={MessageSquare} label="Club" />
               </nav>
            </div>

            <div>
               <p className="text-xs font-bold text-viking-grey uppercase tracking-widest px-6 mb-4">Manage</p>
               <nav className="space-y-1">
                {user.role === UserRole.ADMIN && (
                  <>
                    <NavItem view="branches" icon={Map} label="Branches" />
                    <NavItem view="users" icon={Users} label="Users" />
                    <NavItem view="schedule" icon={Activity} label="Activity" />
                  </>
                )}
                
                {user.role === UserRole.COACH && (
                  <>
                    <NavItem view="students" icon={Users} label="Students" />
                    <NavItem view="programming" icon={Dumbbell} label="Programs" />
                    <NavItem view="schedule" icon={Activity} label="Activity" />
                  </>
                )}

                {user.role === UserRole.MEMBER && (
                  <>
                    <NavItem view="training" icon={Dumbbell} label="Training Hub" />
                    <NavItem view="bodytracker" icon={Scale} label="Body Index" />
                    <NavItem view="schedule" icon={Activity} label="Activity" />
                  </>
                )}
                <NavItem view="profile" icon={UserIcon} label="Profile" />
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-viking-grey/10 animate-in slide-in-from-bottom duration-700 delay-200">
           <div className="flex items-center justify-between mb-4 px-2">
             <span className="text-xs font-bold text-viking-grey uppercase">Dark Mode</span>
             <ThemeToggle />
           </div>
           <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-viking-grey hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-colors rounded-2xl uppercase tracking-wide"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* --- MOBILE TOP BAR (Logo & Theme Only) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-viking-bgDark/80 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-3 animate-in slide-in-from-top duration-500">
             <div className="relative w-10 h-10 rounded-full overflow-hidden border border-viking-grey/20">
                <img 
                    src="/viking-logo.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                />
             </div>
             <span className="font-black text-xl text-viking-textLight dark:text-white tracking-tight">VIKING</span>
          </div>
          <div className="animate-in slide-in-from-top duration-500 delay-100">
            <ThemeToggle />
          </div>
      </div>

      {/* --- MOBILE BOTTOM NAV (Floating Glass Bubble) --- */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 h-24 bg-white/80 dark:bg-viking-surfaceDark/80 rounded-[3rem] shadow-[0_8px_32px_0_rgba(13,26,196,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-50 flex items-center justify-around px-2 border border-white/40 dark:border-white/5 backdrop-blur-xl animate-in slide-in-from-bottom duration-700">
        <MobileNavItem view="dashboard" icon={Home} label="Home" />
        
        {user.role === UserRole.MEMBER ? (
          <>
            <MobileNavItem view="training" icon={Dumbbell} label="Training" />
            <MobileNavItem view="community" icon={Users} label="Club" />
            <MobileNavItem view="profile" icon={UserIcon} label="Profile" />
          </>
        ) : (
          <>
             <MobileNavItem view="schedule" icon={Activity} label="Activity" />
             <MobileNavItem view="community" icon={MessageSquare} label="Chat" />
             <MobileNavItem view="profile" icon={Settings} label="Admin" />
             <button onClick={onLogout} className="flex flex-col items-center justify-center w-full h-full text-viking-grey hover:text-red-500 transition-colors">
                <LogOut size={24} />
             </button>
          </>
        )}
      </div>
    </>
  );
};