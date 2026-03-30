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
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: t.about.values[1].title, 
      desc: t.about.values[1].desc,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      title: t.about.values[2].title, 
      desc: t.about.values[2].desc,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
            {t.about.mission}
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight">
            {t.about.title}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            {t.about.subtitle}
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="text-3xl font-bold text-slate-900">50k+</h4>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">{t.about.resolved}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold text-slate-900">120+</h4>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">{t.about.cities}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-blue-600 rounded-3xl rotate-3 absolute inset-0 -z-10 opacity-10" />
          <img 
            src="https://picsum.photos/seed/city/800/800" 
            alt="Smart City"
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">{t.about.valuesTitle}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t.about.valuesSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", value.bg, value.color)}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{value.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-slate-900 rounded-3xl p-12 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Target className="w-12 h-12 text-blue-400 mx-auto" />
          <h2 className="text-4xl font-bold">{t.about.visionTitle}</h2>
          <p className="text-xl text-slate-400 leading-relaxed italic">
            {t.about.visionDesc}
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              Smart City Award 2025
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-bold">
              <Heart className="w-4 h-4 text-rose-400" />
              Citizen Choice 2026
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

