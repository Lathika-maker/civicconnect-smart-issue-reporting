import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Mail, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { validateEmail, validatePassword } from '../lib/validation';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface UserLoginProps {
  onLogin: (user: any) => void;
  onNavigate: (page: string) => void;
}

export default function UserLoginPage({ onLogin, onNavigate }: UserLoginProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('Password reset email sent! Check your inbox.');
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

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Invalid password format. Please enter a password with at least 8 characters, including one number and one special character.');
      setIsLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        if (!fullName) {
          setError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: fullName });
        
        // Create user profile in Firestore
        const userData = {
          uid: user.uid,
          fullName,
          email,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        
        setSuccess(true);
        setTimeout(() => {
          onLogin(userData);
          onNavigate('home');
        }, 1500);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccess(true);
        setTimeout(() => {
          onNavigate('home');
        }, 1500);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead of registering.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in your Firebase Console. Please enable it here: https://console.firebase.google.com/project/gen-lang-client-0715963397/authentication/providers');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">User Login</h2>
            <p className="text-slate-500 text-sm">Access your civic dashboard and track reports.</p>
          </div>

            <form onSubmit={isResetting ? handleResetPassword : handleLogin} className="space-y-6">
              <div className="space-y-4">
                {!isResetting && isRegistering && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        required
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                    />
                  </div>
                </div>

                {!isResetting && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      {!isRegistering && (
                        <button 
                          type="button"
                          onClick={() => setIsResetting(true)}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        required
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-4 border rounded-2xl flex items-center gap-3 text-sm font-medium",
                    error.includes('sent') ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-rose-50 border-rose-100 text-rose-600"
                  )}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && !isResetting && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Login successful! Redirecting...
                </motion.div>
              )}

              <button 
                disabled={isLoading || (success && !isResetting)}
                type="submit"
                className={cn(
                  "w-full py-4 rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200",
                  isLoading || (success && !isResetting) ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isResetting ? 'Send Reset Link' : (isRegistering ? 'Register' : 'Sign In')}
                    {isResetting ? <Mail className="w-5 h-5" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
                  </>
                )}
              </button>
            </form>

            <div className="text-center space-y-4">
              {isResetting ? (
                <button 
                  onClick={() => setIsResetting(false)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Back to Login
                </button>
              ) : (
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {isRegistering ? 'Already have an account? Sign In' : 'Create a new account'}
                </button>
              )}
            <br />
            <button 
              onClick={() => onNavigate('home')}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
