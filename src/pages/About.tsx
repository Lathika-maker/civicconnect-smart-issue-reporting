import React from 'react';
import { cn } from '../lib/utils';
import { Globe, Users, ShieldCheck, BarChart3, Target, Heart, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '../LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  const coreValues = [
    { 
      title: t.about.values[0].title, 
      desc: t.about.values[0].desc,
      icon: ShieldCheck,
      color: "bg-blue-500"
    },
    { 
      title: t.about.values[1].title, 
      desc: t.about.values[1].desc,
      icon: Zap,
      color: "bg-amber-500"
    },
    { 
      title: t.about.values[2].title, 
      desc: t.about.values[2].desc,
      icon: Users,
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section - Split Editorial Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
        <div className="space-y-10">
          <h1 className="text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            {t.about.title.split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-serif-italic font-light text-blue-600 dark:text-blue-400">
              {t.about.title.split(' ').slice(-2).join(' ')}
            </span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg font-light leading-relaxed">
            {t.about.subtitle}
          </p>
          <div className="flex items-center gap-12 pt-4">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">50k+</p>
              <p className="micro-label text-slate-400 uppercase tracking-widest">{t.about.resolved}</p>
            </div>
            <div className="w-px h-16 bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">120+</p>
              <p className="micro-label text-slate-400 uppercase tracking-widest">{t.about.cities}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group">
            <img 
              src="https://picsum.photos/seed/city-manifesto/1200/1500" 
              alt="Smart City"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          {/* Floating Badge */}
          <motion.div 
            initial={{ rotate: 12, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 12, scale: 1, opacity: 1 }}
            whileHover={{ rotate: 0, scale: 1.1 }}
            className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center p-8 text-center shadow-2xl z-20"
          >
            <p className="text-white text-xs font-bold uppercase tracking-widest leading-tight">
              CivicConnect <br /> v1.0.0 <br /> STABLE
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Grid Layout */}
      <section className="space-y-20">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.about.valuesTitle.split(' ').slice(0, -1).join(' ')} <span className="text-serif-italic font-light">{t.about.valuesTitle.split(' ').slice(-1)}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {t.about.valuesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {coreValues.map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500", value.color)}>
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{value.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Section - Full Width Atmospheric */}
      <section className="relative h-[650px] rounded-[5rem] overflow-hidden group shadow-2xl border border-slate-100 dark:border-slate-800">
        <img 
          src="https://picsum.photos/seed/city-vision/2000/1000" 
          alt="Future City"
          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[20s] grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center text-center p-12">
          <div className="max-w-3xl space-y-10">
            <Target className="w-16 h-16 text-blue-400 mx-auto animate-bounce" />
            <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-tight">
              {t.about.visionTitle.split(' ').slice(0, -1).join(' ')} <span className="text-serif-italic font-light">{t.about.visionTitle.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-xl text-slate-200 font-light leading-relaxed italic">
              "{t.about.visionDesc}"
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-widest">
                <Award className="w-4 h-4 text-amber-400" />
                Smart City Award 2025
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-widest">
                <Heart className="w-4 h-4 text-rose-400" />
                Citizen Choice 2026
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

