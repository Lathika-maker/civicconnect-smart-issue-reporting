import React from 'react';
import { 
  ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Users, 
  BarChart3, Globe, MapPin, Search, Sparkles, Building2, Shield, 
  Heart, Activity, Camera, Terminal, Cpu, Network, Newspaper
} from 'lucide-react';
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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden rounded-[3rem] bg-slate-950 text-white shadow-3xl">
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-7xl md:text-9xl hero-text"
              >
                Building <span className="text-blue-500 text-serif-italic font-light tracking-normal lowercase">Smarter</span> Cities Together.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-slate-400 max-w-lg leading-relaxed font-light"
              >
                {t.home.subtitle}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap gap-6"
            >
              <button 
                onClick={() => onNavigate('report')}
                className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center gap-3 group text-lg"
              >
                {t.home.reportBtn}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('map')}
                className="px-12 py-6 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 hover:-translate-y-1 transition-all border border-white/10 backdrop-blur-sm text-lg"
              >
                Explore Map
              </button>
            </motion.div>
          </div>

          <div className="hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-20"
            >
              {/* Floating Dashboard Preview */}
              <div className="glass-card rounded-[3rem] p-10 space-y-10 animate-float glow-blue">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-lg font-bold">City Pulse</p>
                      <p className="text-xs text-slate-500">Real-time monitoring active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="micro-label">Live Operations Feed</p>
                  {[
                    { icon: MapPin, text: "Pothole reported in Sector 4", color: "text-blue-500", time: "2m ago" },
                    { icon: CheckCircle2, text: "Streetlight fixed in MG Road", color: "text-green-500", time: "15m ago" },
                    { icon: AlertTriangle, text: "New leakage detected", color: "text-amber-500", time: "1h ago" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-900", item.color)}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.text}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Toolbar - Catchy & Simple */}
      <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'report', label: 'Report Issue', icon: AlertTriangle, color: 'bg-rose-500', desc: 'Fast submission' },
            { id: 'track', label: 'Track Status', icon: Search, color: 'bg-blue-500', desc: 'Real-time updates' },
            { id: 'map', label: 'Civic Map', icon: MapPin, color: 'bg-emerald-500', desc: 'Interactive view' },
            { id: 'news', label: 'City News', icon: Newspaper, color: 'bg-amber-500', desc: 'Latest updates' }
          ].map((item, i) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.id as any)}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-blue-500/10 transition-all text-left flex flex-col gap-6 group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{item.label}</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Simple 3-Step Process - Catchy & Visual */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {[
            { 
              title: "Spot It", 
              desc: "See a civic issue? Take a photo and note the location.",
              icon: Camera,
              color: "bg-rose-500"
            },
            { 
              title: "Report It", 
              desc: "Submit your report in seconds through our simple interface.",
              icon: Zap,
              color: "bg-blue-500"
            },
            { 
              title: "Track It", 
              desc: "Watch as authorities verify and resolve the issue in real-time.",
              icon: Activity,
              color: "bg-emerald-500"
            }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-8 p-12 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl group">
              <div className={cn("w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform", item.color)}>
                <item.icon className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Categories - Refined */}
      <section className="max-w-7xl mx-auto px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="micro-label text-blue-600">Categories</p>
            <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{t.home.problemsTitle}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-light">
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
              bg: "bg-amber-50 dark:bg-amber-900/20"
            },
            { 
              title: "Sanitation Issues", 
              desc: "Uncollected garbage and poor waste management.",
              icon: ShieldCheck,
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-900/20"
            },
            { 
              title: "Electricity Damage", 
              desc: "Exposed wires or faulty streetlights in your area.",
              icon: Zap,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/20"
            },
            { 
              title: "Water Leakage", 
              desc: "Wasted water from broken pipes or main lines.",
              icon: Globe,
              color: "text-cyan-500",
              bg: "bg-cyan-50 dark:bg-cyan-900/20"
            },
            { 
              title: "Drainage Problems", 
              desc: "Blocked drains leading to waterlogging and health risks.",
              icon: MapPin,
              color: "text-indigo-500",
              bg: "bg-indigo-50 dark:bg-indigo-900/20"
            },
            { 
              title: "Communication Gap", 
              desc: "Difficulty reaching authorities via traditional methods.",
              icon: Users,
              color: "text-rose-500",
              bg: "bg-rose-50 dark:bg-rose-900/20"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-500 space-y-8"
            >
              <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>
              <div className="pt-4">
                <button className="w-14 h-14 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="bg-slate-950 rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.85]">Ready to make a <span className="text-serif-italic font-light tracking-normal lowercase text-blue-500">difference?</span></h2>
            <p className="text-slate-400 text-2xl max-w-2xl mx-auto font-light leading-relaxed">
              Join our community today and help us build a better, smarter city for everyone. Your first report is just a click away.
            </p>
          </div>
          <div className="relative z-10 flex justify-center pt-8">
            <button 
              onClick={() => onNavigate('report')}
              className="px-16 py-8 bg-blue-600 text-white rounded-[2.5rem] font-bold text-2xl shadow-3xl shadow-blue-600/20 hover:bg-blue-500 hover:-translate-y-2 transition-all flex items-center gap-4 group"
            >
              Report an Issue Now
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
