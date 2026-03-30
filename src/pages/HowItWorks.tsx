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
      color: "bg-blue-500"
    },
    {
      title: t.howItWorks.steps[1].title,
      desc: t.howItWorks.steps[1].desc,
      icon: Send,
      color: "bg-indigo-500"
    },
    {
      title: t.howItWorks.steps[2].title,
      desc: t.howItWorks.steps[2].desc,
      icon: Users,
      color: "bg-amber-500"
    },
    {
      title: t.howItWorks.steps[3].title,
      desc: t.howItWorks.steps[3].desc,
      icon: ShieldCheck,
      color: "bg-green-500"
    },
    {
      title: t.howItWorks.steps[4].title,
      desc: t.howItWorks.steps[4].desc,
      icon: CheckCircle2,
      color: "bg-cyan-500"
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">{t.howItWorks.title}</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          {t.howItWorks.subtitle}
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 hidden md:block" />

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col md:flex-row gap-8 items-start"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg z-10 shrink-0",
                step.color
              )}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step {i + 1}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Voice Feature Section */}
      <section className="bg-slate-900 rounded-3xl p-12 text-white text-center space-y-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">{t.howItWorks.voiceTitle}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {t.howItWorks.voiceDesc}
        </p>
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Voice to Text</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Auto-Generated</span>
          </div>
        </div>
      </section>
    </div>
  );
}

