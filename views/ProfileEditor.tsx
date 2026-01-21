import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/mockDb';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Save, Upload } from 'lucide-react';

interface ProfileEditorProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = { ...user, name, avatarUrl };
            await db.updateUser(updatedUser);
            onUpdateUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">Edit Profile</h2>
                <p className="text-viking-grey text-sm font-medium">Update your personal details</p>
            </div>

            <Card title="User Information">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex items-center gap-6">
                         <img 
                            src={avatarUrl || 'https://via.placeholder.com/150'} 
                            alt="Preview" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-viking-action"
                         />
                         <div className="flex-1">
                             <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Avatar URL</label>
                             <input 
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full bg-viking-offWhite dark:bg-viking-blue border border-viking-grey/20 text-viking-blue dark:text-white p-3 rounded-xl focus:border-viking-action focus:outline-none transition-colors"
                                placeholder="https://..."
                             />
                         </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-viking-offWhite dark:bg-viking-blue border border-viking-grey/20 text-viking-blue dark:text-white p-3 rounded-xl focus:border-viking-action focus:outline-none transition-colors font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Email Address (Read Only)</label>
                        <input 
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full bg-viking-offWhite dark:bg-viking-blue/50 border border-viking-grey/20 text-viking-grey p-3 rounded-xl cursor-not-allowed"
                        />
                    </div>

                     <div>
                        <label className="block text-xs font-bold text-viking-grey uppercase tracking-wider mb-2">Branch ID</label>
                        <input 
                            type="text"
                            value={user.branchId}
                            disabled
                            className="w-full bg-viking-offWhite dark:bg-viking-blue/50 border border-viking-grey/20 text-viking-grey p-3 rounded-xl cursor-not-allowed font-mono"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm font-bold ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <div className="pt-4 border-t border-viking-grey/10 flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : <><Save size={18} className="mr-2"/> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};