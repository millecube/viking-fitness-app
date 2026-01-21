
import React, { useEffect, useState } from 'react';
import { User, Exercise, PlannedActivity, ExerciseLevel } from '../types';
import { db } from '../services/mockDb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Plus, Clock, Flame, ChevronRight, X, Play, Dumbbell, Zap, Edit2 } from 'lucide-react';

interface ActivityScheduleProps {
  user: User;
}

export const ActivitySchedule: React.FC<ActivityScheduleProps> = ({ user }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [todaysPlan, setTodaysPlan] = useState<PlannedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Activity Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDesc, setNewExerciseDesc] = useState('');
  const [newExerciseCal, setNewExerciseCal] = useState(10);
  const [newExerciseDuration, setNewExerciseDuration] = useState(30);
  const [newExerciseLevel, setNewExerciseLevel] = useState<ExerciseLevel>('Beginner');
  const [newExerciseType, setNewExerciseType] = useState<'Strength' | 'Cardio' | 'Muscle' | 'Flexibility'>('Strength');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    setLoading(true);
    const data = await db.getExercises(user.branchId);
    setExercises(data);
    setLoading(false);
  };

  const handleAddToPlan = (exercise: Exercise) => {
    const activity: PlannedActivity = {
      id: `plan_${Date.now()}`,
      exerciseId: exercise.id,
      exercise: exercise,
      customName: exercise.name,
      targetDurationMinutes: exercise.defaultDurationMinutes,
      targetQty: 3, // Default sets
      targetReps: 12, // Default reps
      calculatedCalories: exercise.defaultDurationMinutes * exercise.defaultCaloriesPerMinute,
      completed: false
    };
    setTodaysPlan(prev => [activity, ...prev]);
  };

  const handleUpdatePlan = (id: string, updates: Partial<PlannedActivity>) => {
    setTodaysPlan(prev => prev.map(p => {
      if (p.id === id) {
        // Recalculate calories if minutes changed
        let newCals = p.calculatedCalories;
        if (updates.targetDurationMinutes !== undefined) {
           newCals = updates.targetDurationMinutes * p.exercise.defaultCaloriesPerMinute;
        }

        return { 
          ...p, 
          ...updates,
          calculatedCalories: newCals 
        };
      }
      return p;
    }));
  };

  const handleRemoveFromPlan = (id: string) => {
    setTodaysPlan(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateExercise = async () => {
    if (!newExerciseName) return;
    const newEx: Exercise = {
      id: `custom_${Date.now()}`,
      branchId: user.branchId,
      name: newExerciseName,
      description: newExerciseDesc || 'Custom activity',
      defaultCaloriesPerMinute: newExerciseCal,
      defaultDurationMinutes: newExerciseDuration,
      level: newExerciseLevel,
      type: newExerciseType,
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=60&w=300' // Placeholder
    };
    await db.createExercise(newEx);
    setIsCreating(false);
    loadLibrary();
  };

  const totalCalories = todaysPlan.reduce((acc, curr) => acc + curr.calculatedCalories, 0);
  const totalDuration = todaysPlan.reduce((acc, curr) => acc + curr.targetDurationMinutes, 0);

  const LevelBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      Pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      Elite: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors[level] || colors.Beginner}`}>
        {level}
      </span>
    );
  };

  const TypeBadge = ({ type }: { type: string }) => {
     const colors: Record<string, string> = {
        Cardio: 'text-green-500 bg-green-500/10',
        Strength: 'text-purple-500 bg-purple-500/10',
        Muscle: 'text-orange-500 bg-orange-500/10',
        Flexibility: 'text-blue-500 bg-blue-500/10'
     };
     return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${colors[type] || colors.Strength}`}>
            {type}
        </span>
     );
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      
      {/* Header */}
      <div className="flex justify-between items-center animate-in slide-in-from-top duration-500">
        <div>
           <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Activity</h2>
           <p className="text-viking-grey text-sm font-medium">Plan your daily grind</p>
        </div>
        <div className="text-right">
             <div className="text-xs text-viking-grey uppercase font-bold">Total Est.</div>
             <div className="flex items-center gap-1 text-viking-action">
                 <Flame size={18} fill="currentColor" />
                 <span className="text-2xl font-black font-display">{Math.round(totalCalories)}</span>
                 <span className="text-xs font-bold">kcal</span>
             </div>
        </div>
      </div>

      {/* 1. TODAY'S PLAN */}
      <div className="animate-in slide-in-from-left duration-500 delay-100">
        <h3 className="text-lg font-bold text-viking-blue dark:text-white mb-4 flex items-center gap-2">
            <Clock className="text-viking-action" size={20} /> Today's Plan
        </h3>
        
        {todaysPlan.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-viking-grey/20 rounded-[2rem] text-center text-viking-grey bg-white/50 dark:bg-white/5">
                <p className="text-sm font-medium">No activities added yet.</p>
                <p className="text-xs mt-1">Select from recommendations below.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {todaysPlan.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-viking-blueLight border border-viking-grey/10 rounded-[2rem] p-4 flex flex-col xl:flex-row items-center gap-4 shadow-sm animate-in zoom-in-95 duration-300">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                            <img src={item.exercise.imageUrl} className="w-full h-full object-cover" />
                        </div>

                        {/* Details (Name Editable) */}
                        <div className="flex-1 text-center xl:text-left w-full">
                            <input 
                                value={item.customName || item.exercise.name}
                                onChange={(e) => handleUpdatePlan(item.id, { customName: e.target.value })}
                                className="font-bold text-viking-blue dark:text-white font-display uppercase bg-transparent border-b border-transparent hover:border-viking-grey/30 focus:border-viking-action focus:outline-none w-full text-center xl:text-left text-lg truncate transition-colors"
                            />
                            <div className="flex items-center justify-center xl:justify-start gap-2 mt-1">
                                <LevelBadge level={item.exercise.level} />
                                <div className="flex items-center gap-1 text-viking-action">
                                    <Flame size={12} fill="currentColor" />
                                    <span className="text-xs font-bold">{Math.round(item.calculatedCalories)} kcal</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Inputs: Mins | Sets | Reps */}
                        <div className="flex items-center gap-2 bg-viking-offWhite dark:bg-white/5 p-2 rounded-xl">
                            <div className="flex flex-col items-center w-14">
                                <label className="text-[9px] text-viking-grey font-bold uppercase">Mins</label>
                                <input 
                                    type="number" 
                                    value={item.targetDurationMinutes}
                                    onChange={(e) => handleUpdatePlan(item.id, { targetDurationMinutes: Number(e.target.value) })}
                                    className="w-full bg-transparent text-center font-bold text-viking-blue dark:text-white border-b border-viking-grey/20 focus:outline-none focus:border-viking-action text-sm"
                                />
                            </div>
                            <div className="w-px h-6 bg-viking-grey/20"></div>
                            <div className="flex flex-col items-center w-14">
                                <label className="text-[9px] text-viking-grey font-bold uppercase">Sets</label>
                                <input 
                                    type="number" 
                                    placeholder="-"
                                    value={item.targetQty || ''}
                                    onChange={(e) => handleUpdatePlan(item.id, { targetQty: Number(e.target.value) })}
                                    className="w-full bg-transparent text-center font-bold text-viking-blue dark:text-white border-b border-viking-grey/20 focus:outline-none focus:border-viking-action text-sm"
                                />
                            </div>
                            <div className="w-px h-6 bg-viking-grey/20"></div>
                            <div className="flex flex-col items-center w-14">
                                <label className="text-[9px] text-viking-grey font-bold uppercase">Reps</label>
                                <input 
                                    type="number" 
                                    placeholder="-"
                                    value={item.targetReps || ''}
                                    onChange={(e) => handleUpdatePlan(item.id, { targetReps: Number(e.target.value) })}
                                    className="w-full bg-transparent text-center font-bold text-viking-blue dark:text-white border-b border-viking-grey/20 focus:outline-none focus:border-viking-action text-sm"
                                />
                            </div>
                        </div>

                        <button onClick={() => handleRemoveFromPlan(item.id)} className="p-2 text-viking-grey hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                ))}
                
                <Button fullWidth className="mt-4 shadow-xl" size="lg">
                    <Play size={18} fill="currentColor" className="mr-2" /> Start {Math.floor(totalDuration / 60)}h {totalDuration % 60}m Workout
                </Button>
            </div>
        )}
      </div>

      {/* 2. RECOMMENDATION LIBRARY */}
      <div className="animate-in slide-in-from-bottom duration-500 delay-200">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-viking-blue dark:text-white flex items-center gap-2">
                <Dumbbell className="text-viking-action" size={20} /> Recommendation
            </h3>
         </div>

         {/* Create New Form Modal / Inline */}
         {isCreating && (
             <div className="bg-viking-offWhite dark:bg-white/5 border border-viking-action/20 p-6 rounded-[2rem] mb-6 animate-in fade-in zoom-in-95">
                 <h4 className="font-bold text-viking-blue dark:text-white uppercase mb-4">Create Activity</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input 
                        placeholder="Activity Name (e.g. Burpees)" 
                        value={newExerciseName}
                        onChange={e => setNewExerciseName(e.target.value)}
                        className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-bold text-sm"
                    />
                     <select 
                        value={newExerciseType} 
                        onChange={e => setNewExerciseType(e.target.value as any)}
                        className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-bold text-sm"
                    >
                        <option>Strength</option><option>Cardio</option><option>Muscle</option><option>Flexibility</option>
                    </select>
                    <input 
                        placeholder="Description" 
                        value={newExerciseDesc}
                        onChange={e => setNewExerciseDesc(e.target.value)}
                        className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-medium text-sm md:col-span-2"
                    />
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Cals/Min" 
                            value={newExerciseCal}
                            onChange={e => setNewExerciseCal(Number(e.target.value))}
                            className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-bold text-sm w-full"
                        />
                        <input 
                            type="number" 
                            placeholder="Default Mins" 
                            value={newExerciseDuration}
                            onChange={e => setNewExerciseDuration(Number(e.target.value))}
                            className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-bold text-sm w-full"
                        />
                    </div>
                     <select 
                        value={newExerciseLevel} 
                        onChange={e => setNewExerciseLevel(e.target.value as any)}
                        className="p-3 rounded-xl bg-white dark:bg-viking-blueLight border border-viking-grey/10 font-bold text-sm"
                    >
                        <option>Beginner</option><option>Intermediate</option><option>Pro</option><option>Elite</option>
                    </select>
                 </div>
                 <div className="flex justify-end gap-2">
                     <Button variant="ghost" onClick={() => setIsCreating(false)} size="sm">Cancel</Button>
                     <Button onClick={handleCreateExercise} size="sm">Create Activity</Button>
                 </div>
             </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* ADD CUSTOM CARD - Prominent Place */}
             <button 
                onClick={() => setIsCreating(true)}
                className="bg-viking-action/5 hover:bg-viking-action/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-[2rem] p-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-viking-action/30 dark:border-white/20 hover:border-viking-action transition-all h-full min-h-[120px]"
             >
                 <div className="w-12 h-12 rounded-full bg-viking-action text-white flex items-center justify-center shadow-lg">
                     <Plus size={24} />
                 </div>
                 <span className="font-bold text-viking-action dark:text-white uppercase text-sm tracking-wider">Add Custom Activity</span>
             </button>

            {exercises.map((ex, idx) => (
                <div 
                    key={ex.id} 
                    className="bg-white dark:bg-viking-blueLight rounded-[2rem] p-4 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:border-viking-action border border-transparent"
                    onClick={() => handleAddToPlan(ex)}
                    style={{ animationDelay: `${idx * 50}ms` }}
                >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0">
                        <img src={ex.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-viking-blue dark:text-white font-display text-lg group-hover:text-viking-action transition-colors">{ex.name}</h4>
                            <TypeBadge type={ex.type} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-viking-grey mt-1 font-medium">
                            <span className="flex items-center gap-1"><Clock size={12} /> {ex.defaultDurationMinutes} mins</span>
                            <span className="w-1 h-1 bg-viking-grey/40 rounded-full"></span>
                            <span className="flex items-center gap-1"><Zap size={12} /> {ex.level}</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-viking-offWhite dark:bg-white/5 flex items-center justify-center text-viking-blue dark:text-white group-hover:bg-viking-action group-hover:text-white transition-colors shrink-0">
                        <Plus size={20} />
                    </div>
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};
