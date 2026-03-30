/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home as HomeIcon, AlertCircle, Search, Map as MapIcon, 
  Info, LayoutDashboard, HelpCircle, Phone, Globe, User, 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Bell,
  Languages, Accessibility, Mic, ThumbsUp, MapPin, Lock, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Complaint, IssueCategory, Notification } from './types';
import { MOCK_COMPLAINTS } from './mockData';

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
import UserLoginPage from './pages/UserLogin';

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
  | 'user-login';

function AppContent({ 
  currentPage, 
  setCurrentPage, 
  isMenuOpen, 
  setIsMenuOpen, 
  complaints, 
  addComplaint, 
  notifications, 
  isSimpleMode, 
  setIsSimpleMode,
  isAuthority,
  setIsAuthority,
  isUser,
  setIsUser,
  updateComplaintStatus
}: any) {
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: HomeIcon },
    { id: 'report', label: t.nav.report, icon: AlertCircle },
    { id: 'track', label: t.nav.track, icon: Search },
    { id: 'map', label: t.nav.map, icon: MapIcon },
    { id: 'how-it-works', label: t.nav.howItWorks, icon: HelpCircle },
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'about', label: t.nav.about, icon: Info },
    { id: 'contact', label: t.nav.contact, icon: Phone },
    { id: 'user-login', label: 'User Login', icon: User },
    { id: 'authority-login', label: 'Authority', icon: ShieldCheck },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'report': return <ReportIssuePage onSubmit={addComplaint} onNavigate={setCurrentPage} />;
      case 'track': return <TrackComplaintPage complaints={complaints} />;
      case 'map': return <MapPage complaints={complaints} />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'dashboard': return (
        <DashboardPage 
          complaints={complaints} 
          isAuthority={!!isAuthority} 
          onUpdateStatus={updateComplaintStatus}
          onLogout={() => {
            setIsAuthority(null);
            setCurrentPage('home');
          }}
        />
      );
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'authority-login': return (
        <AuthorityLoginPage 
          onLogin={setIsAuthority} 
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Civic<span className="text-blue-600">Connect</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.filter(link => {
                if (isUser || isAuthority) {
                  return link.id !== 'user-login' && link.id !== 'authority-login';
                }
                return true;
              }).map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id as Page)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    currentPage === link.id 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">
                  <User className="w-3.5 h-3.5" />
                  {isUser.name}
                </div>
              )}
              {isAuthority && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold border border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ID: {isAuthority}
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
                <Bell className="w-6 h-6 text-slate-400 hover:text-slate-600 cursor-pointer" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.filter(link => {
                  if (isUser || isAuthority) {
                    return link.id !== 'user-login' && link.id !== 'authority-login';
                  }
                  return true;
                }).map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentPage(link.id as Page);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all",
                      currentPage === link.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </button>
                ))}
                <div className="pt-4 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-slate-400" />
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="bg-transparent font-medium focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => setIsSimpleMode(!isSimpleMode)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                      isSimpleMode ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Accessibility className="w-4 h-4" />
                    {t.nav.simpleMode}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                <li><button onClick={() => setCurrentPage('map')} className="hover:text-blue-400 transition-colors">{t.nav.map}</button></li>
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
                {!(isUser || isAuthority) ? (
                  <>
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
                  </>
                ) : (
                  <li>
                    <p className="text-slate-400 italic">Logged in as {isAuthority ? 'Authority' : 'User'}</p>
                  </li>
                )}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [isAuthority, setIsAuthority] = useState<any>(null);
  const [isUser, setIsUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('civic_connect_complaints');
    if (saved) {
      setComplaints(JSON.parse(saved));
    } else {
      setComplaints(MOCK_COMPLAINTS);
      localStorage.setItem('civic_connect_complaints', JSON.stringify(MOCK_COMPLAINTS));
    }
  }, []);

  const addComplaint = (newComplaint: Complaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('civic_connect_complaints', JSON.stringify(updated));
    
    // Add notification
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Complaint Submitted',
      message: `Your complaint ${newComplaint.id} has been successfully submitted.`,
      type: 'success',
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications]);
  };

  const updateComplaintStatus = (id: string, status: any) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    localStorage.setItem('civic_connect_complaints', JSON.stringify(updated));
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <AppContent 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
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
      />
    </LanguageProvider>
  );
}
