import React, { useState, useRef } from 'react';
import { 
  Camera, MapPin, Send, RotateCcw, CheckCircle2, 
  AlertCircle, Mic, Info, Loader2, X, Play, Square
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, IssueCategory } from '../types';
import { Page } from '../App';

import { useLanguage } from '../LanguageContext';

interface ReportIssueProps {
  onSubmit: (complaint: Complaint) => void;
  onNavigate: (page: Page) => void;
}

const CATEGORIES: IssueCategory[] = [
  'Road Potholes',
  'Garbage / Sanitation',
  'Electricity Damage',
  'Water Leakage',
  'Drainage Problems',
  'Streetlight Failure'
];

export default function ReportIssuePage({ onSubmit, onNavigate }: ReportIssueProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    category: '' as IssueCategory | '',
    description: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  // Media States
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocationDetect = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, we'd reverse geocode here. 
          // For now, we'll just set a placeholder with the coords.
          setFormData(prev => ({
            ...prev,
            address: `Detected Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setFormData(prev => ({
            ...prev,
            address: 'Location detection failed. Please enter manually.'
          }));
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return;

    // Strict validation
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newComplaint: Complaint = {
        id,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        category: formData.category as IssueCategory,
        description: formData.description,
        location: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.01,
          lng: 77.5946 + (Math.random() - 0.5) * 0.01,
          address: formData.address
        },
        status: 'Submitted',
        createdAt: new Date().toISOString(),
        upvotes: 0,
        confirmations: 0,
        isCommunityVerified: false
      };

      onSubmit(newComplaint);
      setComplaintId(id);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      category: '',
      description: '',
      address: ''
    });
    setSelectedImage(null);
    setAudioUrl(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8 py-12"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Complaint Submitted Successfully!</h2>
          <p className="text-slate-500">
            Thank you for being a responsible citizen. Your complaint has been registered and sent to the municipal authorities.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm inline-block">
          <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Complaint ID</p>
          <p className="text-4xl font-mono font-bold text-blue-600">{complaintId}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onNavigate('track')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Track Status
          </button>
          <button 
            onClick={resetForm}
            className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Report Another Issue
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">{t.report.title}</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          {t.report.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.report.fullName}</label>
                <input 
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.report.phone}</label>
                <input 
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.report.email}</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.report.category}</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as IssueCategory})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.report.description}</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the problem in detail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.report.upload}</label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {selectedImage ? (
                  <div className="relative">
                    <img src={selectedImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2 group-hover:text-blue-400" />
                    <p className="text-sm text-slate-500">Click to take photo or upload from gallery</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.report.location}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    required
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter address or detect location"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <button 
                  type="button"
                  onClick={handleLocationDetect}
                  disabled={isLocating}
                  className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                  {t.report.detect}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {t.report.submit}
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                {t.report.reset}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <h4 className="font-bold">Pro Tip</h4>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              Adding a clear photo and precise location helps our team resolve the issue up to 40% faster.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900">Voice Complaint</h4>
            <p className="text-sm text-slate-500">
              No smartphone? No problem. Record a voice message and our AI will convert it to a complaint.
            </p>
            
            {!audioUrl ? (
              <button 
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-900 text-white"
                )}
              >
                {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording ? "Stop Recording" : "Record Voice"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Play className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">Voice Message Recorded</span>
                  <button 
                    onClick={() => setAudioUrl(null)}
                    className="ml-auto text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <audio src={audioUrl} controls className="w-full h-8" />
              </div>
            )}
            
            {isRecording && (
              <p className="text-xs text-center text-red-500 font-medium">Listening to your complaint...</p>
            )}
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900">How it works</h4>
            <div className="space-y-4">
              {[
                { step: 1, text: "Submit your report" },
                { step: 2, text: "Community verifies it" },
                { step: 3, text: "Authority takes action" }
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </span>
                  <span className="text-sm text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
