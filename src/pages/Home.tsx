import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Users, BarChart3, Globe, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../App';
import { useLanguage } from '../LanguageContext';
import { cn } from '../lib/utils';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomeProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-3xl">
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="w-4 h-4" />
              Smart City Initiative
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl hero-text"
              >
                {t.home.heroTitle.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-blue-500 block" : "block"}>
                    {word}
                  </span>
                ))}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 max-w-lg leading-relaxed font-light"
              >
                {t.home.heroSubtitle}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <button 
                onClick={() => onNavigate('report')}
                className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center gap-3 group text-lg"
              >
                {t.home.reportBtn}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('track')}
                className="px-10 py-5 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm text-lg"
              >
                {t.home.trackBtn}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 pt-8 border-t border-white/5"
            >
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">12k+</p>
                <p className="micro-label">Issues Resolved</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">4.8/5</p>
                <p className="micro-label">Citizen Rating</p>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative z-20"
            >
              {/* Floating Dashboard Preview */}
              <div className="glass-card rounded-[2rem] p-8 space-y-8 animate-float">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold">Live Statistics</p>
                      <p className="text-xs text-slate-500">Updated just now</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="micro-label mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-slate-900">1.4h</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="micro-label mb-1">Satisfaction</p>
                    <p className="text-2xl font-bold text-slate-900">98%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="micro-label">Recent Activity</p>
                  {[
                    { icon: MapPin, text: "Pothole reported in Sector 4", color: "text-blue-500" },
                    { icon: CheckCircle2, text: "Streetlight fixed in MG Road", color: "text-green-500" },
                    { icon: AlertTriangle, text: "New leakage detected", color: "text-amber-500" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-50 shadow-sm">
                      <item.icon className={cn("w-4 h-4", item.color)} />
                      <span className="text-xs font-medium text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-slate-900">Community Powered</h3>
              <p className="text-slate-500 leading-relaxed">
                Join thousands of citizens who are actively participating in making their city better. Your voice matters.
              </p>
            </div>
            <button className="text-blue-600 font-bold flex items-center gap-2 group">
              Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="bg-blue-600 p-10 rounded-[2rem] text-white space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold">40%</h3>
              <p className="text-blue-100 text-sm font-medium">Faster resolution time compared to traditional methods.</p>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2rem] text-white space-y-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">Secure</h3>
              <p className="text-slate-400 text-sm">End-to-end encrypted reporting and verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Categories - Refined */}
      <section className="max-w-7xl mx-auto px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="micro-label text-blue-600">Categories</p>
            <h2 className="text-5xl font-bold text-slate-900 tracking-tight">{t.home.problemsTitle}</h2>
          </div>
          <p className="text-slate-500 max-w-md text-lg font-light">
            {t.home.problemsSubtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Road Potholes", 
              desc: "Damaged roads causing accidents and vehicle wear.",
              icon: AlertTriangle,
              color: "text-amber-500",
              bg: "bg-amber-50"
            },
            { 
              title: "Sanitation Issues", 
              desc: "Uncollected garbage and poor waste management.",
              icon: ShieldCheck,
              color: "text-green-500",
              bg: "bg-green-50"
            },
            { 
              title: "Electricity Damage", 
              desc: "Exposed wires or faulty streetlights in your area.",
              icon: Zap,
              color: "text-blue-500",
              bg: "bg-blue-50"
            },
            { 
              title: "Water Leakage", 
              desc: "Wasted water from broken pipes or main lines.",
              icon: Globe,
              color: "text-cyan-500",
              bg: "bg-cyan-50"
            },
            { 
              title: "Drainage Problems", 
              desc: "Blocked drains leading to waterlogging and health risks.",
              icon: MapPin,
              color: "text-indigo-500",
              bg: "bg-indigo-50"
            },
            { 
              title: "Communication Gap", 
              desc: "Difficulty reaching authorities via traditional phone calls.",
              icon: Users,
              color: "text-rose-500",
              bg: "bg-rose-50"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 space-y-6"
            >
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
              <div className="pt-4">
                <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="bg-blue-600 rounded-[3rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Ready to make a difference?</h2>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto font-light">
              Join our community today and help us build a better, smarter city for everyone.
            </p>
          </div>
          <div className="relative z-10 flex justify-center">
            <button 
              onClick={() => onNavigate('report')}
              className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-bold text-xl shadow-2xl hover:bg-blue-50 transition-all flex items-center gap-3 group"
            >
              Report an Issue Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
