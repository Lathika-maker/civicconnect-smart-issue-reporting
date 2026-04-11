import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, Loader2, UserPlus, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Page } from '../App';
import { validatePassword } from '../lib/validation';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthorityLoginProps {
  onLogin: (id: string) => void;
  onNavigate: (page: Page) => void;
}

export default function AuthorityLoginPage({ onLogin, onNavigate }: AuthorityLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your official email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('Password reset link sent to your official email.');
      setTimeout(() => {
        setSuccess(false);
        setIsResetting(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isResetting && !validatePassword(password)) {
      setError('Invalid password format. Please enter a password with at least 8 characters, including one number and one special character.');
      setIsLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // In a real app, authority registration would be restricted
        // For this demo, we'll allow it but tag the role as 'admin'
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userData = {
          uid: user.uid,
          fullName: 'Authority Official',
          email: email,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        
        onLogin(user.uid);
        onNavigate('dashboard');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Check if user is actually an admin
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        // AUTO-PROMOTION for the developer email
        const isDeveloper = email === 'lathika292006@gmail.com';
        
        if (isDeveloper || (userDoc.exists() && userDoc.data().role === 'admin')) {
          if (isDeveloper && (!userDoc.exists() || userDoc.data().role !== 'admin')) {
            // Promote to admin in Firestore if not already
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              fullName: 'System Administrator',
              email: email,
              role: 'admin',
              createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString()
            }, { merge: true });
          }
          onLogin(user.uid);
          onNavigate('dashboard');
        } else {
          // If not admin, sign out and show error
          await auth.signOut();
          setError('Access denied. This account does not have authority privileges.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead of registering.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in your Firebase Console.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
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
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3 text-sm border",
            error.includes('sent') ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-red-50 border-red-100 text-red-600"
          )}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={isResetting ? handleResetPassword : handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Official Email</label>
            <div className="relative">
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="official@civicconnect.gov"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {!isResetting && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {!isRegistering && (
                  <button 
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
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
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isResetting ? <Mail className="w-5 h-5" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <Lock className="w-5 h-5" />))}
            {isResetting ? 'Send Reset Link' : (isRegistering ? 'Register Authority' : 'Secure Login')}
          </button>
        </form>

        <div className="text-center space-y-4">
          {isResetting ? (
            <button 
              onClick={() => setIsResetting(false)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 block w-full"
              >
                {isRegistering ? 'Already have an account? Login' : 'Register new Authority ID'}
              </button>
              <button 
                onClick={() => onNavigate('superior-login')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center justify-center gap-2 w-full pt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Superior Authority Portal
              </button>
            </>
          )}
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
