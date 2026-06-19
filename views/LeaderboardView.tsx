import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  footprint: number;
  score: number;
  avatar: string;
  isCurrentUser: boolean;
}

export const LeaderboardView: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  useEffect(() => {
    // Track current logged-in user
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUid(u?.uid || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Bulletproof Firestore fetching
        const q = query(collection(db, 'users'), orderBy('score', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        
        const fetchedUsers = snapshot.docs.map((doc, idx) => {
          const data = doc.data();
          return {
            id: doc.id,
            rank: idx + 1,
            name: data.name || 'Anonymous',
            footprint: data.footprint || 0,
            score: data.score || 0,
            avatar: (data.name || 'A').substring(0, 2).toUpperCase(),
            isCurrentUser: false // We will map this below dynamically
          };
        });

        // If the DB is completely empty (first time load), add a placeholder so it doesn't look broken
        if (fetchedUsers.length === 0) {
          setUsers([]);
        } else {
          setUsers(fetchedUsers);
        }
      } catch(err) {
         console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Compute final display users based on currentUid
  const displayUsers = users.map(u => ({ ...u, isCurrentUser: u.id === currentUid }));

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20 relative z-20 w-full">
      
      {/* Header Widget */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 shadow-sm">
            Live Database Sync
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Global Leaderboard</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time ranking of bulletproof sustainability data pulled directly from Firebase.</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-3xl overflow-hidden shadow-xl relative z-20 w-full">
        
        {/* Bulletproof Flex Header */}
        <div className="flex items-center p-5 bg-white/40 backdrop-blur-md border-b border-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 w-full">
          <div className="w-12 sm:w-16 shrink-0 text-center">Rank</div>
          <div className="flex-1 px-4">CarbonSense User</div>
          <div className="w-24 sm:w-32 shrink-0 text-right px-2">Footprint</div>
          <div className="hidden sm:block w-32 shrink-0 text-right px-2">Score</div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 font-bold">Syncing global data...</div>
        ) : displayUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-bold">No users synced yet. Go to your dashboard to sync your score!</div>
        ) : (
          displayUsers.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(user.rank * 0.05, 0.5) }}
              className={`flex items-center p-4 sm:p-5 border-b border-white/60 transition-colors hover:bg-white/80 w-full ${user.isCurrentUser ? 'bg-teal-50/50' : ''}`}
            >
              {/* Rank */}
              <div className="w-12 sm:w-16 shrink-0 flex justify-center">
                {user.rank <= 3 ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white shadow-md ${
                    user.rank === 1 ? 'bg-amber-400 border-2 border-amber-200' : 
                    user.rank === 2 ? 'bg-slate-300 border-2 border-slate-100' : 
                    'bg-orange-400 border-2 border-orange-200'
                  }`}>
                    {user.rank}
                  </div>
                ) : (
                  <div className="text-slate-400 font-bold text-lg">
                    {user.rank}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 flex items-center gap-3 sm:gap-4 px-2 sm:px-4 min-w-0">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold border-2 ${
                  user.isCurrentUser ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-slate-200 text-slate-600 border-white'
                }`}>
                  {user.avatar}
                </div>
                <div className="min-w-0 truncate">
                  <div className={`font-bold text-sm sm:text-base truncate ${user.isCurrentUser ? 'text-teal-700' : 'text-slate-900'}`}>
                    {user.name}
                    {user.isCurrentUser && <span className="ml-2 text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">You</span>}
                  </div>
                </div>
              </div>

              {/* Footprint */}
              <div className="w-24 sm:w-32 shrink-0 text-right px-2 flex flex-col justify-center">
                <div className="font-black text-slate-900 text-sm sm:text-base">{user.footprint.toFixed(1)} <span className="text-[10px] sm:text-xs font-bold text-slate-400">kg</span></div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">CO₂e / day</div>
              </div>

              {/* Score */}
              <div className="hidden sm:flex w-32 shrink-0 items-center justify-end px-2">
                <div className={`text-lg sm:text-xl font-black pr-2 ${
                  user.score >= 90 ? 'text-teal-500' : 
                  user.score >= 70 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {user.score}
                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
