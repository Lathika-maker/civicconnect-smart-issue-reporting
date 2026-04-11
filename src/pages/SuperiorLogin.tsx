import React, { useState } from 'react';
import { Lock, ShieldAlert, AlertCircle, Loader2, Mail, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Page } from '../App';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface SuperiorLoginProps {
  onLogin: (id: string) => void;
  onNavigate: (page: Page) => void;
}

export default function SuperiorLoginPage({ onLogin, onNavigate }: SuperiorLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is actually a superior admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists() && userDoc.data().role === 'superior_admin') {
        onLogin(user.uid);
        onNavigate('dashboard');
      } else {
        await auth.signOut();
        setError('Access denied. This portal is reserved for Superior Authorities only.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl space-y-8 text-white"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-slate-900 mx-auto shadow-xl shadow-amber-500/20 mb-4">
            <Crown className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Superior Portal</h1>
          <p className="text-slate-400 text-sm">Command & Control Center Login</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-sm text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Master Email</label>
            <div className="relative">
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="superior@civicconnect.gov"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
            <div className="relative">
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-amber-500 text-slate-900 rounded-2xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-amber-500/20"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6" />}
            Authorize Access
          </button>
        </form>

        <div className="pt-6 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            This system is restricted to high-level municipal oversight. 
            All actions are monitored by the Department of Internal Affairs.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
