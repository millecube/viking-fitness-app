import React from 'react';
import { User, UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, LayoutDashboard, Users, Map, Dumbbell, Activity, MessageSquare, Scale, Settings, Edit } from 'lucide-react';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, currentView, onChangeView }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center gap-4 px-6 py-3.5 text-sm font-bold transition-all rounded-xl mx-2 w-[calc(100%-1rem)]
        ${currentView === view 
          ? 'bg-fitness-black text-white shadow-lg' 
          : 'text-fitness-textMuted hover:bg-white hover:text-fitness-textMain'
        }`}
    >
      <Icon size={20} className={currentView === view ? 'text-fitness-lime' : ''} />
      {label}
    </button>
  );

  return (
    <div className="w-64 h-screen bg-fitness-offWhite dark:bg-fitness-black flex flex-col fixed left-0 top-0 overflow-y-auto transition-colors duration-300 z-50 border-r border-transparent dark:border-zinc-800">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-fitness-black flex items-center justify-center border border-fitness-lime/20 shadow-lg shadow-fitness-lime/10">
              <span className="text-fitness-lime font-black text-lg">V</span>
          </div>
          <div className="leading-none">
            <span className="block text-lg font-black text-fitness-textMain dark:text-white font-display tracking-tight">VIKING</span>
          </div>
        </div>
        
        <div className="mb-6">
           <p className="text-xs font-bold text-fitness-textMuted uppercase tracking-wider px-4 mb-2">Menu</p>
           <nav className="space-y-1">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="community" icon={MessageSquare} label="Community" />
           </nav>
        </div>

        <div>
           <p className="text-xs font-bold text-fitness-textMuted uppercase tracking-wider px-4 mb-2">Tools</p>
           <nav className="space-y-1">
            {user.role === UserRole.ADMIN && (
              <>
                <NavItem view="branches" icon={Map} label="Branches" />
                <NavItem view="users" icon={Users} label="All Users" />
              </>
            )}
            
            {user.role === UserRole.COACH && (
              <>
                <NavItem view="students" icon={Users} label="My Students" />
                <NavItem view="programming" icon={Dumbbell} label="Programs" />
              </>
            )}

            {user.role === UserRole.MEMBER && (
              <>
                <NavItem view="bodytracker" icon={Scale} label="Body Index" />
                <NavItem view="history" icon={Activity} label="History" />
                <NavItem view="schedule" icon={Dumbbell} label="Schedule" />
              </>
            )}
            <NavItem view="profile" icon={Edit} label="Edit Profile" />
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 space-y-2">
         <div className="flex justify-between items-center px-4 py-2">
             <span className="text-xs font-bold text-fitness-textMuted uppercase">Theme</span>
             <ThemeToggle />
         </div>
         <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-fitness-textMuted hover:text-red-600 transition-colors uppercase tracking-wide"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};