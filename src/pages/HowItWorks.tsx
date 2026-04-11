import React from 'react';
import { cn } from '../lib/utils';
import { 
  Camera, MapPin, Send, CheckCircle2, 
  Users, ShieldCheck, ArrowRight, Globe, 
  Zap, MessageSquare, Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '../LanguageContext';

export default function HowItWorksPage() {
  const { t } = useLanguage();
  
  const steps = [
    {
      title: t.howItWorks.steps[0].title,
      desc: t.howItWorks.steps[0].desc,
      icon: Camera,
      color: "bg-blue-500",
      label: "Data Capture"
    },
    {
      title: t.howItWorks.steps[1].title,
      desc: t.howItWorks.steps[1].desc,
      icon: Send,
      color: "bg-indigo-500",
      label: "Transmission"
    },
    {
      title: t.howItWorks.steps[2].title,
      desc: t.howItWorks.steps[2].desc,
      icon: Users,
      color: "bg-amber-500",
      label: "Verification"
    },
    {
      title: t.howItWorks.steps[3].title,
      desc: t.howItWorks.steps[3].desc,
      icon: ShieldCheck,
      color: "bg-emerald-500",
      label: "Authentication"
    },
    {
      title: t.howItWorks.steps[4].title,
      desc: t.howItWorks.steps[4].desc,
      icon: CheckCircle2,
      color: "bg-cyan-500",
      label: "Resolution"
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">
          How it <span className="text-serif-italic font-light">Works</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          {t.howItWorks.subtitle}
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Connecting Line - Technical Style */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
        <div className="absolute left-11 top-0 bottom-0 w-3 bg-blue-500/5 hidden md:block" />

        <div className="space-y-24">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 25 }}
              className="relative flex flex-col md:flex-row gap-12 items-start group"
            >
              {/* Step Icon Container */}
              <div className="relative shrink-0">
                <div className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl z-10 relative transition-transform duration-500 group-hover:scale-110",
                  step.color
                )}>
                  <step.icon className="w-10 h-10" />
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold shadow-xl border-4 border-white dark:border-slate-900">
                    {i + 1}
                  </div>
                </div>
                {/* Connecting Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Step Content Card */}
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all flex-1 space-y-6 relative overflow-hidden">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">{step.label}</span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{step.title}</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">{step.desc}</p>
                
                {/* Technical Detail Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                  <step.icon className="w-32 h-32 rotate-12" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Voice Feature Section - Immersive Media Style */}
      <section className="bg-slate-900 dark:bg-blue-600 rounded-[5rem] p-16 lg:p-24 text-white text-center space-y-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 group hover:scale-110 transition-transform duration-500">
            <Smartphone className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tighter">{t.howItWorks.voiceTitle}</h2>
            <p className="text-xl text-slate-300 dark:text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              {t.howItWorks.voiceDesc}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: MessageSquare, label: "Voice to Text", desc: "AI-Powered Transcription" },
              { icon: Globe, label: "Auto-Generated", desc: "Multilingual Support" },
              { icon: Zap, label: "Real-time Sync", desc: "Instant Cloud Processing" }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 group">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500 shadow-xl">
                  <feature.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest block">{feature.label}</span>
                  <span className="text-[8px] text-slate-400 dark:text-blue-200 font-bold uppercase tracking-widest opacity-60">{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Atmospheric Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[150px] animate-pulse delay-1000" />
        </div>
      </section>
    </div>
  );
}

