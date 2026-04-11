import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Mail, Smartphone, Shield, 
  Save, Loader2, CheckCircle2, AlertCircle,
  ArrowLeft, LogOut, Settings, Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ProfileProps {
  user: any;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  onUpdateUser?: (userData: any) => void;
}

export default function ProfilePage({ user, onNavigate, onLogout, onUpdateUser }: ProfileProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    statusUpdates: true,
    communityAlerts: false,
    marketingEmails: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.preferences) {
            setPreferences(data.preferences);
          }
          setFormData({
            fullName: data.fullName || user?.fullName || '',
            email: data.email || user?.email || '',
            phoneNumber: data.phoneNumber || user?.phoneNumber || ''
          });
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    try {
      const updatedData = {
        ...formData,
        preferences,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedData, { merge: true });
      
      if (onUpdateUser) {
        onUpdateUser(updatedData);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tighter text-slate-900">
          Account <span className="text-blue-600">Settings</span>
        </h1>
        <p className="text-slate-500 text-lg font-light">Manage your profile and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName || 'Citizen User'}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Verified Citizen
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-2">
              <h4 className="font-bold">Privacy & Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Your data is encrypted and used only for municipal coordination.</p>
            </div>
            <button className="relative z-10 w-full py-3 bg-white/10 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
              View Privacy Policy
            </button>
          </div>
        </div>

        {/* Preferences & Profile Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            {/* Profile Information Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Information</h3>
                  <p className="text-sm text-slate-500">Update your personal details and contact information.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <input 
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Choose how you want to be notified about your reports.</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive detailed updates via your registered email.', icon: Mail },
                { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get instant alerts on your device for urgent updates.', icon: Smartphone },
                { id: 'statusUpdates', label: 'Complaint Status Updates', desc: 'Notify me when the status of my report changes.', icon: CheckCircle2 },
                { id: 'communityAlerts', label: 'Community Alerts', desc: 'Get notified about major civic issues in your area.', icon: Globe },
                { id: 'marketingEmails', label: 'Civic News & Tips', desc: 'Receive weekly newsletters and city improvement tips.', icon: Settings },
              ].map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                      <pref.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{pref.label}</p>
                      <p className="text-xs text-slate-500">{pref.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle(pref.id as any)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      preferences[pref.id as keyof typeof preferences] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                      preferences[pref.id as keyof typeof preferences] ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-emerald-500 font-bold text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Preferences Saved
                  </motion.div>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-500/10"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save All Changes
              </button>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-500/10 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 dark:text-amber-400">Important Note</h4>
              <p className="text-sm text-amber-800/70 dark:text-amber-400/60 leading-relaxed">
                Critical emergency alerts and legal notifications cannot be disabled to ensure public safety and compliance with municipal regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
