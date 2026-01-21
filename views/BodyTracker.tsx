import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, BodyLog } from '../types';
import { db } from '../services/mockDb';
import { generateMotivationalCaption } from '../services/aiService';
import { Scale, Activity, BrainCircuit, Upload, ArrowRight, Sparkles } from 'lucide-react';

interface BodyTrackerProps {
  user: User;
}

export const BodyTracker: React.FC<BodyTrackerProps> = ({ user }) => {
  const [logs, setLogs] = useState<BodyLog[]>([]);
  const [weight, setWeight] = useState<number | ''>('');
  const [bodyFat, setBodyFat] = useState<number | ''>('');
  
  // Transformation Tool State
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [user]);

  const loadLogs = async () => {
    const data = await db.getBodyLogs(user.id);
    setLogs(data);
    if (data.length > 0) {
      setWeight(data[0].weight);
      setBodyFat(data[0].bodyFatPercentage || '');
    }
  };

  const handleLogUpdate = async () => {
    if (typeof weight !== 'number') return;
    
    const newLog: BodyLog = {
      id: `bl_${Date.now()}`,
      userId: user.id,
      branchId: user.branchId,
      date: new Date().toISOString(),
      weight: weight,
      bodyFatPercentage: typeof bodyFat === 'number' ? bodyFat : undefined
    };
    
    await db.addBodyLog(newLog);
    loadLogs();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') setBeforeImage(reader.result as string);
        else setAfterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeTransformation = async () => {
    if (!afterImage) return;
    
    setIsGenerating(true);
    setGeneratedCaption('');
    
    // Simulate slight delay for effect before calling API
    setTimeout(async () => {
        const caption = await generateMotivationalCaption(afterImage);
        setGeneratedCaption(caption);
        setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-viking-grey/10 pb-4">
        <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Body Index</h2>
        <p className="text-viking-grey text-sm font-medium">Track your transformation metrics</p>
      </div>

      {/* Stats Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Current Metrics">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Weight (lbs)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-viking-grey" size={18} />
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full bg-viking-offWhite dark:bg-viking-blue border border-viking-grey/20 text-viking-blue dark:text-white rounded-xl p-3 pl-10 focus:border-viking-action focus:outline-none transition-colors font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Body Fat %</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-viking-grey" size={18} />
                <input 
                  type="number" 
                  value={bodyFat}
                  onChange={(e) => setBodyFat(parseFloat(e.target.value))}
                  className="w-full bg-viking-offWhite dark:bg-viking-blue border border-viking-grey/20 text-viking-blue dark:text-white rounded-xl p-3 pl-10 focus:border-viking-action focus:outline-none transition-colors font-medium"
                />
              </div>
            </div>
            <Button fullWidth onClick={handleLogUpdate} className="mt-2">Update Log</Button>
          </div>
        </Card>

        <Card title="History Log">
          <div className="h-56 overflow-y-auto space-y-2 pr-2">
             {logs.map(log => (
               <div key={log.id} className="flex justify-between items-center p-3 bg-viking-offWhite dark:bg-viking-blue border border-viking-grey/10 hover:border-viking-action/30 transition-colors rounded-lg">
                 <span className="text-viking-grey text-sm font-medium">{new Date(log.date).toLocaleDateString()}</span>
                 <div className="flex gap-4">
                   <span className="text-viking-blue dark:text-white font-mono font-bold">{log.weight} lbs</span>
                   {log.bodyFatPercentage && <span className="text-viking-action font-mono font-bold">{log.bodyFatPercentage}% BF</span>}
                 </div>
               </div>
             ))}
             {logs.length === 0 && <p className="text-viking-grey text-center py-4">No logs yet.</p>}
          </div>
        </Card>
      </div>

      {/* Transformation Tool */}
      <div className="border-t border-viking-grey/10 pt-8">
         <div className="flex items-center gap-3 mb-6">
           <BrainCircuit className="text-viking-action" size={24} />
           <h3 className="text-2xl font-black text-viking-blue dark:text-white uppercase font-display">Transformation AI</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="space-y-3">
              <p className="text-xs text-center text-viking-grey uppercase font-bold tracking-widest">Before</p>
              <div className="aspect-[3/4] bg-viking-offWhite dark:bg-viking-blue border-2 border-dashed border-viking-grey/30 flex flex-col items-center justify-center overflow-hidden relative group hover:border-viking-action transition-colors rounded-2xl">
                {beforeImage ? (
                  <img src={beforeImage} className="w-full h-full object-cover" alt="Before" />
                ) : (
                  <div className="text-center p-6">
                    <Upload className="mx-auto text-viking-grey mb-2" />
                    <span className="text-viking-grey text-xs font-bold uppercase">Upload Photo</span>
                  </div>
                )}
                <input type="file" onChange={(e) => handleImageUpload(e, 'before')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>

            {/* After Photo */}
            <div className="space-y-3">
              <p className="text-xs text-center text-viking-grey uppercase font-bold tracking-widest">After</p>
              <div className="aspect-[3/4] bg-viking-offWhite dark:bg-viking-blue border-2 border-dashed border-viking-grey/30 flex flex-col items-center justify-center overflow-hidden relative group hover:border-viking-action transition-colors rounded-2xl">
                 {afterImage ? (
                  <img src={afterImage} className="w-full h-full object-cover" alt="After" />
                ) : (
                  <div className="text-center p-6">
                    <Upload className="mx-auto text-viking-grey mb-2" />
                    <span className="text-viking-grey text-xs font-bold uppercase">Upload Photo</span>
                  </div>
                )}
                <input type="file" onChange={(e) => handleImageUpload(e, 'after')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
         </div>

         <div className="mt-8 flex justify-center">
            {generatedCaption ? (
              <div className="w-full bg-white dark:bg-viking-blue p-8 border-l-4 border-l-viking-action shadow-lg animate-in zoom-in duration-300 rounded-r-2xl">
                <Sparkles className="mx-auto text-viking-action mb-4" size={32} />
                <p className="text-xl font-bold italic text-viking-blue dark:text-white leading-relaxed font-display text-center">"{generatedCaption}"</p>
                <div className="text-center mt-6">
                    <Button variant="ghost" size="sm" onClick={() => setGeneratedCaption('')} className="uppercase tracking-widest text-xs">Try Again</Button>
                </div>
              </div>
            ) : (
               <Button 
                size="lg" 
                disabled={!afterImage || isGenerating} 
                onClick={analyzeTransformation}
                className="bg-viking-action text-white hover:bg-blue-700 shadow-xl"
               >
                 {isGenerating ? (
                   <span className="flex items-center gap-2">
                     <BrainCircuit className="animate-spin" /> Analyzing Physics...
                   </span>
                 ) : (
                   <span className="flex items-center gap-2">
                     <Sparkles size={18} /> GENERATE CAPTION
                   </span>
                 )}
               </Button>
            )}
         </div>
      </div>
    </div>
  );
};