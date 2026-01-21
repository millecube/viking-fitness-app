import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { User, WorkoutSession } from '../types';
import { db } from '../services/mockDb';
import { Button } from '../components/Button';
import { UserPlus, ClipboardList, Clock, Flame } from 'lucide-react';

interface CoachDashboardProps {
  user: User;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ user }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedStudents = await db.getUsers(user);
      const fetchedWorkouts = await db.getWorkouts(user);
      setStudents(fetchedStudents);
      setWorkouts(fetchedWorkouts);
    };
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center border-b border-viking-grey/10 pb-6 animate-in slide-in-from-top duration-500">
        <div>
          <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Coach Portal</h2>
          <p className="text-viking-grey text-sm font-medium">Branch: <span className="text-viking-action font-bold">{user.branchId}</span></p>
        </div>
        <Button size="sm" variant="primary">
          <UserPlus size={16} className="mr-2" />
          Assign New Student
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500 delay-100">
        {/* Student Roster */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={`My Roster (${students.length})`} className="shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map(student => (
                <div key={student.id} className="bg-viking-offWhite dark:bg-viking-blueLight border border-viking-grey/20 p-4 flex items-center gap-4 hover:border-viking-action transition-all cursor-pointer group hover:bg-white dark:hover:bg-white/10 rounded-[2rem] hover:shadow-md hover:scale-[1.02] duration-300">
                  <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border border-viking-grey/30" />
                  <div className="flex-1">
                    <h4 className="font-bold text-viking-blue dark:text-white group-hover:text-viking-action transition-colors font-display uppercase">{student.name}</h4>
                    <p className="text-xs text-viking-grey">Last seen: Today</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">PROFILE</Button>
                </div>
              ))}
              {students.length === 0 && (
                <div className="col-span-2 text-center py-8 text-viking-grey">No students assigned yet.</div>
              )}
            </div>
          </Card>

          <Card title="Recent Student Activity" className="shadow-lg">
            <div className="space-y-3">
              {workouts.slice(0, 5).map(workout => (
                 <div key={workout.id} className="flex items-center justify-between p-4 bg-viking-offWhite dark:bg-viking-blueLight border-l-4 border-l-red-500 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-viking-blue flex items-center justify-center text-red-500 rounded-full shadow-sm">
                        <Flame size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-viking-blue dark:text-white uppercase font-display">{workout.type} Session</p>
                        <p className="text-xs text-viking-grey">{new Date(workout.date).toLocaleDateString()} • {workout.durationMinutes} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-lg font-black text-viking-blue dark:text-white font-display">{workout.caloriesBurned}</span>
                       <span className="text-[10px] text-viking-grey uppercase font-bold tracking-wider">Calories</span>
                    </div>
                 </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions / Schedule */}
        <div className="space-y-6 animate-in slide-in-from-right duration-500 delay-200">
          <Card title="Quick Actions" className="shadow-lg">
            <div className="space-y-3">
              <Button fullWidth variant="outline" className="justify-start rounded-2xl">
                <ClipboardList size={18} className="mr-3" />
                Log Workout
              </Button>
              <Button fullWidth variant="outline" className="justify-start rounded-2xl">
                <Clock size={18} className="mr-3" />
                Schedule Session
              </Button>
            </div>
          </Card>
          
          <Card title="Today's Schedule" className="shadow-lg">
            <div className="space-y-4 relative">
               <div className="absolute left-2.5 top-2 bottom-2 w-px bg-viking-grey/20"></div>
               {[9, 11, 14, 16].map((hour) => (
                 <div key={hour} className="flex items-start gap-4 relative z-10 group">
                    <span className="text-xs text-viking-grey w-12 text-right pt-2 font-bold font-mono group-hover:text-viking-action transition-colors">{hour}:00</span>
                    <div className="flex-1 p-3 bg-viking-offWhite dark:bg-viking-blueLight border-l-4 border-l-viking-action text-sm shadow-sm rounded-r-2xl hover:shadow-md transition-all">
                      <span className="block font-bold text-viking-blue dark:text-white uppercase font-display">PT Session</span>
                      <span className="text-xs text-viking-grey">Hypertrophy Block A</span>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};