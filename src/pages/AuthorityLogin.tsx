import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../App';
import { db } from '../lib/db';
import { validateAuthorityId, validatePassword } from '../lib/validation';

interface AuthorityLoginProps {
  onLogin: (id: string) => void;
  onNavigate: (page: Page) => void;
}

export default function AuthorityLoginPage({ onLogin, onNavigate }: AuthorityLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateAuthorityId(username)) {
      setError('Invalid ID format. Authority ID must start with CIVIC_ADMIN_ followed by 4 numbers (e.g., CIVIC_ADMIN_1234).');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Invalid password format. Please enter a password with at least 8 characters, including one number and one special character.');
      setIsLoading(false);
      return;
    }

    // Simulate secure login/registration
    setTimeout(() => {
      if (isRegistering) {
        const success = db.addAuthority({ id: username, passwordHash: password });
        if (success) {
          onLogin(username);
          onNavigate('dashboard');
        } else {
          setError('This Authority ID is already registered. Please login instead.');
          setIsLoading(false);
        }
      } else {
        const authority = db.authenticateAuthority(username, password);
        if (authority) {
          onLogin(username);
          onNavigate('dashboard');
        } else {
          setError('Invalid credentials. Please check your ID and password.');
          setIsLoading(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Authority Portal</h1>
          <p className="text-slate-500 text-sm">Secure login for municipal officials</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Username</label>
            <div className="relative">
              <input 
                required
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter official ID"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <Lock className="w-5 h-5" />)}
            {isRegistering ? 'Register Authority' : 'Secure Login'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {isRegistering ? 'Already have an account? Login' : 'Register new Authority ID'}
          </button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-slate-400">
            Unauthorized access is strictly prohibited. All login attempts are logged for security purposes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
