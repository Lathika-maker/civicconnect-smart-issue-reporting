import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, CheckCircle2, Loader2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { useLanguage } from '../LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-24">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">
          Get in <span className="text-serif-italic font-light">Touch</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info - Technical Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 dark:bg-blue-600 rounded-[3rem] p-10 text-white space-y-10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold tracking-tight">{t.contact.infoTitle}</h3>
                <p className="text-slate-400 dark:text-blue-100 text-sm font-light">Available 24/7 for critical civic support.</p>
              </div>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: t.contact.email, value: "support@civicconnect.gov", color: "bg-white/10" },
                  { icon: Phone, label: t.contact.phone, value: "1800-CIVIC-HELP", color: "bg-white/10" },
                  { icon: MapPin, label: t.contact.visit, value: "Municipal Corp, Smart City", color: "bg-white/10" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 group cursor-pointer">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900", item.color)}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-blue-200 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                      <p className="font-bold text-lg tracking-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Atmospheric Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] -ml-24 -mb-24" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Digital Presence</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Network Nodes</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map(social => (
                <motion.div 
                  key={social} 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                >
                  <Globe className="w-6 h-6" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Form - Clean Technical Layout */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 lg:p-16 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-10"
              >
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">Message Sent</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-light max-w-md mx-auto">
                    Your message has been successfully sent to our support team. Expect a response within 24 hours.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-12 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.contact.formName}</label>
                    <div className="relative group">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        required
                        type="text"
                        placeholder="Full Name"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.contact.formEmail}</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        required
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.contact.formSubject}</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      required
                      type="text"
                      placeholder="Subject of Inquiry"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t.contact.formMessage}</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none dark:text-white font-medium leading-relaxed"
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    <span className="text-lg tracking-tight">{t.contact.formSubmit}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
