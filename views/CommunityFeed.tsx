import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, CommunityPost } from '../types';
import { db } from '../services/mockDb';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon } from 'lucide-react';

interface CommunityFeedProps {
  user: User;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ user }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postAuthors, setPostAuthors] = useState<Record<string, User>>({});

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    setLoading(true);
    const fetchedPosts = await db.getCommunityPosts(user);
    setPosts(fetchedPosts);
    
    // Fetch authors
    const authorIds = Array.from(new Set(fetchedPosts.map(p => p.authorId)));
    const authors: Record<string, User> = {};
    for (const id of authorIds) {
      const author = await db.getUserById(id);
      if (author) authors[id] = author;
    }
    setPostAuthors(authors);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `p_${Date.now()}`,
      authorId: user.id,
      branchId: user.branchId,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    await db.addPost(newPost);
    setNewPostContent('');
    loadPosts(); // Refresh
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 animate-in slide-in-from-top duration-500">
        <div>
           <h2 className="text-3xl font-black text-viking-blue dark:text-white uppercase tracking-tight font-display">The Arena</h2>
           <p className="text-sm text-viking-grey font-medium">Branch Community: <span className="text-viking-action font-bold uppercase">{user.branchId}</span></p>
        </div>
      </div>

      {/* Create Post Input */}
      <div className="bg-white dark:bg-viking-blueLight border border-viking-grey/20 p-6 mb-8 shadow-xl rounded-[2rem] animate-in zoom-in-95 duration-500 delay-100">
        <div className="flex gap-4">
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-viking-grey/30" />
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your victory..."
              className="w-full bg-viking-offWhite dark:bg-viking-blue text-viking-blue dark:text-white placeholder:text-viking-grey focus:outline-none resize-none min-h-[80px] p-3 border border-viking-grey/10 focus:border-viking-action transition-colors rounded-2xl"
            />
            <div className="flex justify-between items-center pt-3 border-t border-viking-grey/10">
               <div className="flex gap-2 text-viking-action">
                 <button className="p-2 hover:bg-viking-blue/5 dark:hover:bg-white/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
               </div>
               <Button size="sm" onClick={handlePost} disabled={!newPostContent.trim()} className="shadow-lg">
                 <Send size={14} className="mr-2" />
                 POST
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center text-viking-grey py-10 font-bold uppercase tracking-widest animate-pulse">Loading The Arena...</div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-700 delay-200">
          {posts.map((post, index) => {
            const author = postAuthors[post.authorId] || { name: 'Unknown User', avatarUrl: '' };
            const isMe = user.id === post.authorId;

            return (
              <div 
                key={post.id} 
                className="bg-white dark:bg-viking-blueLight border border-viking-grey/10 p-6 hover:border-viking-action/30 transition-all shadow-md rounded-[2rem] hover:shadow-xl hover:-translate-y-1 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-4 mb-4">
                  <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full object-cover border border-viking-grey/20" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-viking-blue dark:text-white text-base font-display uppercase">{author.name}</span>
                      <span className="text-viking-grey text-xs font-semibold">• {new Date(post.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-viking-action font-bold uppercase tracking-wider">{author.role}</span>
                  </div>
                </div>
                
                <p className="text-viking-blue dark:text-white mb-5 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                {post.imageUrl && (
                  <div className="mb-5 overflow-hidden border border-viking-grey/10 rounded-2xl shadow-sm">
                    <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                  </div>
                )}

                <div className="flex items-center gap-8 text-viking-grey text-sm font-medium">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                    <Heart size={20} className="group-hover:fill-red-500 transition-all group-active:scale-125" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 hover:text-viking-action transition-colors">
                    <MessageCircle size={20} />
                    Comment
                  </button>
                  <button className="flex items-center gap-2 hover:text-viking-blue dark:hover:text-white transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
          {posts.length === 0 && (
             <div className="text-center py-10">
               <p className="text-viking-grey">No activity in the arena. Be the first to strike!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};