/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home as HomeIcon, AlertCircle, Search, Map as MapIcon, 
  Info, LayoutDashboard, HelpCircle, Phone, Globe, User, 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Bell,
  Languages, Accessibility, Mic, ThumbsUp, MapPin, Lock, ShieldCheck, Newspaper, LogOut, Crown, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Complaint, IssueCategory, Notification } from './types';
import { MOCK_COMPLAINTS } from './mockData';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc, 
  getDoc,
  query,
  orderBy,
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pages
import HomePage from './pages/Home';
import ReportIssuePage from './pages/ReportIssue';
import TrackComplaintPage from './pages/TrackComplaint';
import MapPage from './pages/Map';
import HowItWorksPage from './pages/HowItWorks';
import DashboardPage from './pages/Dashboard';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import AuthorityLoginPage from './pages/AuthorityLogin';
import SuperiorLoginPage from './pages/SuperiorLogin';
import UserLoginPage from './pages/UserLogin';
import NewsPage from './pages/News';
import ProfilePage from './pages/Profile';

import { LanguageProvider, useLanguage } from './LanguageContext';
import { Language } from './translations';

export type Page = 
  | 'home' 
  | 'report' 
  | 'track' 
  | 'map' 
  | 'how-it-works' 
  | 'dashboard' 
  | 'about' 
  | 'contact'
  | 'authority-login'
  | 'superior-login'
  | 'user-login'
  | 'news'
  | 'profile';

function AppContent({ 
  currentPage, 
  setCurrentPage, 
  trackId,
  setTrackId,
  complaints, 
  addComplaint, 
  notifications, 
  isSimpleMode, 
  setIsSimpleMode,
  isAuthority,
  setIsAuthority,
  isUser,
  setIsUser,
  updateComplaintStatus,
  deleteComplaint,
  confirmComplaint,
  isSuperior,
  setIsSuperior,
  mapInitialCenter,
  setMapInitialCenter,
  upvoteComplaint,
  showNotifications,
  setShowNotifications,
  markNotificationAsRead,
  clearNotifications
}: any) {
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthority(false);
      setIsUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: HomeIcon },
    { id: 'report', label: t.nav.report, icon: AlertCircle },
    { id: 'track', label: t.nav.track, icon: Search },
    { id: 'map', label: t.nav.map, icon: MapIcon },
    { id: 'news', label: 'Civic News', icon: Newspaper },
    { id: 'how-it-works', label: t.nav.howItWorks, icon: HelpCircle },
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'about', label: t.nav.about, icon: Info },
    { id: 'contact', label: t.nav.contact, icon: Phone },
    ...(!isUser && !isAuthority ? [
      { id: 'user-login', label: 'User Login', icon: User },
      { id: 'authority-login', label: 'Authority', icon: ShieldCheck },
    ] : [])
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'report': return <ReportIssuePage onSubmit={addComplaint} onNavigate={setCurrentPage} />;
      case 'track': return (
        <TrackComplaintPage 
          complaints={complaints} 
          initialId={trackId} 
          onClearId={() => setTrackId(null)} 
          onConfirm={confirmComplaint} 
          onUpvote={upvoteComplaint}
          onViewOnMap={(lat, lng) => {
            setMapInitialCenter([lat, lng]);
            setCurrentPage('map');
          }}
        />
      );
      case 'map': return (
        <MapPage 
          complaints={complaints} 
          onTrackComplaint={(id) => {
            setTrackId(id);
            setCurrentPage('track');
          }} 
          onConfirm={confirmComplaint}
          onUpvote={upvoteComplaint}
          initialCenter={mapInitialCenter}
        />
      );
      case 'how-it-works': return <HowItWorksPage />;
      case 'dashboard': return (
        <DashboardPage 
          complaints={complaints} 
          isAuthority={isAuthority} 
          isSuperior={isSuperior}
          onUpdateStatus={updateComplaintStatus}
          onDeleteComplaint={deleteComplaint}
          onLogout={() => {
            setIsAuthority(false);
            setIsSuperior(false);
            setCurrentPage('home');
          }}
        />
      );
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'news': return <NewsPage />;
      case 'profile': return (
        <ProfilePage 
          user={isUser} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout} 
          onUpdateUser={setIsUser}
        />
      );
      case 'authority-login': return (
        <AuthorityLoginPage 
          onLogin={setIsAuthority} 
          onNavigate={setCurrentPage} 
        />
      );
      case 'superior-login': return (
        <SuperiorLoginPage 
          onLogin={(uid) => {
            setIsSuperior(true);
            setIsAuthority(true);
          }} 
          onNavigate={setCurrentPage} 
        />
      );
      case 'user-login': return (
        <UserLoginPage 
          onLogin={(user: any) => {
            setIsUser(user);
            setCurrentPage('home');
          }} 
          onNavigate={setCurrentPage} 
        />
      );
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900",
      isSimpleMode && "text-xl leading-relaxed"
    )}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
              <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => setCurrentPage('home')}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">
                  Civic<span className="text-blue-600">Connect</span>
                </span>
              </div>

              {/* Main Menu - Now next to logo */}
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      if (link.id === 'map') setMapInitialCenter(undefined);
                      setCurrentPage(link.id as Page);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap",
                      currentPage === link.id 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage('report')}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Report Now
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
              {isUser && (
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Profile Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
              {(isUser || isAuthority) && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">
                    <User className="w-3.5 h-3.5" />
                    {isAuthority ? 'Authority' : (isUser?.fullName || isUser?.email)}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 gap-2">
                <Languages className="w-4 h-4 text-slate-500" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="ta">TA</option>
                </select>
              </div>
              <button 
                onClick={() => setIsSimpleMode(!isSimpleMode)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isSimpleMode ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
                title={t.nav.simpleMode}
              >
                <Accessibility className="w-5 h-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowNotifications(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                          <h3 className="font-bold text-slate-900">Notifications</h3>
                          {notifications.some(n => !n.read) && (
                            <button 
                              onClick={clearNotifications}
                              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                              {notifications.map((n) => (
                                <div 
                                  key={n.id} 
                                  onClick={() => markNotificationAsRead(n.id)}
                                  className={cn(
                                    "p-4 hover:bg-slate-50 transition-colors cursor-pointer group",
                                    !n.read && "bg-blue-50/30"
                                  )}
                                >
                                  <div className="flex gap-3">
                                    <div className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                      n.type === 'success' ? "bg-emerald-100 text-emerald-600" : 
                                      n.type === 'warning' ? "bg-amber-100 text-amber-600" : 
                                      "bg-blue-100 text-blue-600"
                                    )}>
                                      {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                                       n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                                       <Info className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                      <p className={cn(
                                        "text-sm font-bold leading-tight",
                                        !n.read ? "text-slate-900" : "text-slate-600"
                                      )}>{n.title}</p>
                                      <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                      <p className="text-[10px] text-slate-400 font-medium">
                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-12 text-center space-y-3">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                <Bell className="w-6 h-6" />
                              </div>
                              <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">CivicConnect</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering citizens to build smarter cities through transparent and efficient civic reporting.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-blue-400 transition-colors">{t.nav.home}</button></li>
                <li><button onClick={() => setCurrentPage('report')} className="hover:text-blue-400 transition-colors">{t.nav.report}</button></li>
                <li><button onClick={() => setCurrentPage('track')} className="hover:text-blue-400 transition-colors">{t.nav.track}</button></li>
                <li><button onClick={() => { setMapInitialCenter(undefined); setCurrentPage('map'); }} className="hover:text-blue-400 transition-colors">{t.nav.map}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('how-it-works')} className="hover:text-blue-400 transition-colors">{t.nav.howItWorks}</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-blue-400 transition-colors">{t.nav.about}</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-blue-400 transition-colors">{t.nav.contact}</button></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-CIVIC-HELP</li>
                <li className="flex items-center gap-2"><Bell className="w-4 h-4" /> support@civicconnect.gov</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Municipal Corp, Smart City</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setCurrentPage('user-login')} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <User className="w-3 h-3" />
                    User Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('authority-login')} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Authority Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('superior-login')} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Crown className="w-3 h-3" />
                    Superior Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
            <p>&copy; 2026 CivicConnect - Smart Civic Issue Reporting System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [trackId, setTrackId] = useState<string | null>(null);
  const [mapInitialCenter, setMapInitialCenter] = useState<[number, number] | undefined>(undefined);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);
  const [isSuperior, setIsSuperior] = useState(false);
  const [isUser, setIsUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isDeveloper = user.email === 'lathika292006@gmail.com';
        
        // If developer, set state immediately to avoid permission blocks
        if (isDeveloper) {
          setIsSuperior(true);
          setIsAuthority(true);
          setIsUser(null);
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const role = userDoc.exists() ? userDoc.data().role : null;
          
          if (isDeveloper || role === 'superior_admin') {
            setIsSuperior(true);
            setIsAuthority(true);
            setIsUser(null);
            
            // If developer but no role in DB, promote to superior_admin
            if (isDeveloper && !role) {
              await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                fullName: 'Chief Administrator',
                email: user.email,
                role: 'superior_admin',
                createdAt: new Date().toISOString()
              }, { merge: true });
            }
          } else if (role === 'admin') {
            setIsAuthority(true);
            setIsSuperior(false);
            setIsUser(null);
          } else if (userDoc.exists()) {
            setIsUser(userDoc.data());
            setIsAuthority(false);
            setIsSuperior(false);
          } else {
            // New user or social login without profile doc
            setIsUser({ email: user.email, uid: user.uid });
            setIsAuthority(false);
            setIsSuperior(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setIsUser(null);
        setIsAuthority(false);
        setIsSuperior(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'users', auth.currentUser.uid, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotifications = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Notification[];
        setNotifications(fetchedNotifications);
      });
      return () => unsubscribe();
    } else {
      setNotifications([]);
    }
  }, [isAuthReady]);

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Firestore snapshot received: ${snapshot.size} complaints`);
      const fetchedComplaints = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Complaint[];
      
      setComplaints(fetchedComplaints);

      // Seed with mock data if empty (one-time)
      const hasSeeded = sessionStorage.getItem('hasSeeded');
      if (fetchedComplaints.length === 0 && !hasSeeded) {
        sessionStorage.setItem('hasSeeded', 'true');
        MOCK_COMPLAINTS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'complaints', c.id), {
              ...c,
              authorUid: 'system',
              upvotes: c.upvotes || 0,
              confirmations: c.confirmations || 0,
              isCommunityVerified: c.isCommunityVerified || false
            });
          } catch (e) {
            console.error("Error seeding data:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'complaints');
    });

    return () => unsubscribe();
  }, [isAuthority]);

  const addComplaint = async (newComplaint: Complaint) => {
    try {
      const complaintData = {
        ...newComplaint,
        authorUid: auth.currentUser?.uid || 'anonymous',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'complaints', newComplaint.id), complaintData);
      
      // Add notification to Firestore if user is logged in
      if (auth.currentUser) {
        const notificationId = Math.random().toString(36).substr(2, 9);
        const notificationData = {
          title: 'Complaint Submitted',
          message: `Your complaint ${newComplaint.id} has been successfully submitted.`,
          type: 'success',
          createdAt: new Date().toISOString(),
          read: false
        };
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', notificationId), notificationData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'complaints');
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearNotifications = async () => {
    if (!auth.currentUser) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach(n => {
        if (!n.read) {
          batch.update(doc(db, 'users', auth.currentUser!.uid, 'notifications', n.id), { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const updateComplaintStatus = async (id: string, status: any) => {
    try {
      const complaintRef = doc(db, 'complaints', id);
      const complaintDoc = await getDoc(complaintRef);
      
      await updateDoc(complaintRef, { status });

      if (complaintDoc.exists()) {
        const data = complaintDoc.data();
        if (data.authorUid && data.authorUid !== 'anonymous' && data.authorUid !== 'system') {
          const notificationId = Math.random().toString(36).substr(2, 9);
          const notificationData = {
            title: 'Status Updated',
            message: `Your complaint ${id} status has been changed to ${status}.`,
            type: 'info',
            createdAt: new Date().toISOString(),
            read: false
          };
          await setDoc(doc(db, 'users', data.authorUid, 'notifications', notificationId), notificationData);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${id}`);
    }
  };

  const deleteComplaint = async (id: string) => {
    try {
      // In this app, we use the complaint.id as the firestore doc id
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'complaints', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `complaints/${id}`);
    }
  };

  const upvoteComplaint = async (id: string) => {
    if (!auth.currentUser) {
      setCurrentPage('user-login');
      return;
    }

    try {
      const upvoteId = `${auth.currentUser.uid}`;
      const upvoteRef = doc(db, 'complaints', id, 'upvotes', upvoteId);
      
      // Check if already upvoted
      const existing = await getDoc(upvoteRef);
      if (existing.exists()) {
        console.log("You have already upvoted this issue.");
        return;
      }

      // Atomic update using batch
      const batch = writeBatch(db);
      const complaintRef = doc(db, 'complaints', id);
      
      batch.set(upvoteRef, {
        complaintId: id,
        userUid: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });

      batch.update(complaintRef, {
        upvotes: increment(1)
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${id}`);
    }
  };

  const confirmComplaint = async (id: string) => {
    if (!auth.currentUser) {
      setCurrentPage('user-login');
      return;
    }

    try {
      const confirmationId = `${auth.currentUser.uid}`;
      const confirmationRef = doc(db, 'complaints', id, 'confirmations', confirmationId);
      
      // Check if already confirmed
      const existing = await getDoc(confirmationRef);
      if (existing.exists()) {
        console.log("You have already confirmed this issue.");
        return;
      }

      // Atomic update using batch
      const batch = writeBatch(db);
      const complaintRef = doc(db, 'complaints', id);
      const complaintDoc = await getDoc(complaintRef);
      
      if (complaintDoc.exists()) {
        const currentConfirmations = (complaintDoc.data().confirmations || 0) + 1;
        
        batch.set(confirmationRef, {
          complaintId: id,
          userUid: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        });

        batch.update(complaintRef, {
          confirmations: increment(1),
          isCommunityVerified: currentConfirmations >= 5
        });

        await batch.commit();

        // Send notification if verified
        if (currentConfirmations === 5) {
          const data = complaintDoc.data();
          if (data.authorUid && data.authorUid !== 'anonymous' && data.authorUid !== 'system') {
            const notificationId = Math.random().toString(36).substr(2, 9);
            const notificationData = {
              title: 'Community Verified!',
              message: `Your complaint ${id} has been verified by the community.`,
              type: 'success',
              createdAt: new Date().toISOString(),
              read: false
            };
            await setDoc(doc(db, 'users', data.authorUid, 'notifications', notificationId), notificationData);
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${id}`);
    }
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <AppContent 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        trackId={trackId}
        setTrackId={setTrackId}
        complaints={complaints}
        addComplaint={addComplaint}
        notifications={notifications}
        isSimpleMode={isSimpleMode}
        setIsSimpleMode={setIsSimpleMode}
        isAuthority={isAuthority}
        setIsAuthority={setIsAuthority}
        isUser={isUser}
        setIsUser={setIsUser}
        updateComplaintStatus={updateComplaintStatus}
        deleteComplaint={deleteComplaint}
        confirmComplaint={confirmComplaint}
        isSuperior={isSuperior}
        setIsSuperior={setIsSuperior}
        mapInitialCenter={mapInitialCenter}
        setMapInitialCenter={setMapInitialCenter}
        upvoteComplaint={upvoteComplaint}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        markNotificationAsRead={markNotificationAsRead}
        clearNotifications={clearNotifications}
      />
    </LanguageProvider>
  );
}
