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
          ? 'bg-viking-blue text-white dark:bg-white dark:text-viking-blue shadow-lg' 
          : 'text-viking-grey hover:bg-viking-blue/5 hover:text-viking-blue dark:hover:bg-white/10 dark:hover:text-white'
        }`}
    >
      <Icon size={20} className={currentView === view ? 'text-viking-action dark:text-viking-blue' : ''} />
      {label}
    </button>
  );

  return (
    <div className="w-64 h-screen bg-white dark:bg-viking-blue flex flex-col fixed left-0 top-0 overflow-y-auto transition-colors duration-300 z-50 border-r border-viking-blue/5 dark:border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="relative">
             <div className="absolute inset-0 bg-viking-action blur-md opacity-20 rounded-full"></div>
             {/* Note: Ensure the image file 'viking-logo.png' is placed in your public assets folder */}
             <img 
                src="/viking-logo.png" 
                alt="Viking Fitness" 
                className="w-16 h-16 rounded-full object-contain bg-white border-2 border-white dark:border-viking-blueLight shadow-xl relative z-10"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
             />
             <div className="hidden w-16 h-16 rounded-xl bg-viking-blue dark:bg-white flex items-center justify-center border border-viking-blue/10 shadow-xl relative z-10">
                 <span className="font-black text-2xl text-white dark:text-viking-blue">V</span>
             </div>
          </div>
          <div className="leading-none">
            <span className="block text-xl font-black text-viking-blue dark:text-white font-display tracking-tight">VIKING</span>
            <span className="block text-xs font-bold text-viking-action tracking-widest">FITNESS</span>
          </div>
        </div>
        
        <div className="mb-6">
           <p className="text-xs font-bold text-viking-grey uppercase tracking-wider px-4 mb-2">Menu</p>
           <nav className="space-y-1">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="community" icon={MessageSquare} label="Community" />
           </nav>
        </div>

        <div>
           <p className="text-xs font-bold text-viking-grey uppercase tracking-wider px-4 mb-2">Tools</p>
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

      <div className="mt-auto p-6 space-y-2 border-t border-viking-blue/5 dark:border-white/5">
         <div className="flex justify-between items-center px-4 py-2">
             <span className="text-xs font-bold text-viking-grey uppercase">Theme</span>
             <ThemeToggle />
         </div>
         <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-viking-grey hover:text-red-600 transition-colors uppercase tracking-wide"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};