import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { motion } from 'framer-motion';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-[2rem]"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.5)'
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <span className="text-slate-800 text-3xl font-black tracking-tighter">E</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CarbonSense</h1>
          <p className="text-sm text-slate-500 text-center mt-3 font-medium">
            Minimal. Intelligent. Sustainable.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold bg-white text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold tracking-widest uppercase">Or email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>


        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
