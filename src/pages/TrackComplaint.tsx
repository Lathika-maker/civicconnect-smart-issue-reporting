import React, { useState } from 'react';
import { 
  Search, Phone, CheckCircle2, Clock, AlertCircle, 
  MapPin, Calendar, User, ArrowRight, Loader2, Image as ImageIcon,
  ShieldCheck, ThumbsUp, Mic, Play, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, ComplaintStatus } from '../types';
import { cn } from '../lib/utils';

interface TrackComplaintProps {
  complaints: Complaint[];
  initialId?: string | null;
  onClearId?: () => void;
  onConfirm?: (id: string) => void;
  onUpvote?: (id: string) => void;
  onViewOnMap?: (lat: number, lng: number) => void;
}

const STATUS_STEPS: ComplaintStatus[] = [
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved'
];

export default function TrackComplaintPage({ complaints, initialId, onClearId, onConfirm, onUpvote, onViewOnMap }: TrackComplaintProps) {
  const [searchId, setSearchId] = useState(initialId || '');
  const [searchPhone, setSearchPhone] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use the latest data from complaints array to ensure reactivity
  const currentComplaint = foundComplaint ? complaints.find(c => c.id === foundComplaint.id) || foundComplaint : null;

  React.useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      // Trigger search automatically if ID is provided
      setIsSearching(true);
      setTimeout(() => {
        const result = complaints.find(c => c.id.toLowerCase() === initialId.toLowerCase());
        setFoundComplaint(result || null);
        setIsSearching(false);
        setHasSearched(true);
        if (onClearId) onClearId();
      }, 800);
    }
  }, [initialId, complaints, onClearId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const result = complaints.find(c => 
        c.id.toLowerCase() === searchId.toLowerCase() || 
        c.phoneNumber === searchPhone
      );
      setFoundComplaint(result || null);
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };

  const getStatusIndex = (status: ComplaintStatus) => STATUS_STEPS.indexOf(status);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Track Your Complaint</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Enter your Complaint ID or registered Phone Number to check the real-time status of your report.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Complaint ID (e.g. CC-1234)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="tel"
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || (!searchId && !searchPhone)}
            className="bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Track Status
          </button>
        </form>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentComplaint ? (
              <div className="space-y-8">
                {/* Status Timeline */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Complaint ID</p>
                        {currentComplaint.isCommunityVerified && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <ShieldCheck className="w-3 h-3" />
                            Community Verified
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-slate-900">{currentComplaint.id}</h3>
                        <button 
                          onClick={() => onUpvote?.(currentComplaint.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-bold transition-all border border-blue-100"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {currentComplaint.upvotes || 0}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-bold",
                        currentComplaint.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {currentComplaint.status}
                      </div>
                      <button 
                        onClick={() => onConfirm?.(currentComplaint.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Confirm Issue ({currentComplaint.confirmations || 0})
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full" />
                    {/* Progress Bar Active */}
                    <div 
                      className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(getStatusIndex(currentComplaint.status) / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="relative flex justify-between">
                      {STATUS_STEPS.map((step, i) => {
                        const isCompleted = i <= getStatusIndex(currentComplaint.status);
                        const isCurrent = i === getStatusIndex(currentComplaint.status);
                        
                        return (
                          <div key={step} className="flex flex-col items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10",
                              isCompleted ? "bg-blue-600 border-blue-100 text-white" : "bg-white border-slate-100 text-slate-300",
                              isCurrent && "ring-4 ring-blue-50 scale-110"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <span className={cn(
                              "text-xs font-bold transition-colors",
                              isCompleted ? "text-slate-900" : "text-slate-400"
                            )}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-lg font-bold text-slate-900">Issue Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
                          <p className="font-medium text-slate-900">{currentComplaint.category}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                          <p className="font-medium text-slate-900">{currentComplaint.location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Submitted On</p>
                          <p className="font-medium text-slate-900">{new Date(currentComplaint.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Reported By</p>
                          <p className="font-medium text-slate-900">{currentComplaint.fullName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Description</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{currentComplaint.description}</p>
                      </div>
                      
                      {currentComplaint.transcription && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Mic className="w-3.5 h-3.5 text-blue-500" />
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Voice Transcription</p>
                          </div>
                          <p className="text-sm text-slate-600 italic">"{currentComplaint.transcription}"</p>
                        </div>
                      )}

                      {currentComplaint.audioUrl && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voice Dispatch Recording</p>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Volume2 className="w-4 h-4 text-slate-400" />
                            <audio src={currentComplaint.audioUrl} controls className="h-8 flex-1 opacity-60" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-lg font-bold text-slate-900">Evidence & Map</h4>
                    <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden group cursor-pointer relative">
                      <img 
                        src={currentComplaint.imageUrl || `https://picsum.photos/seed/${currentComplaint.id}/600/400`} 
                        alt="Issue evidence"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div 
                      className="p-4 bg-blue-50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => onViewOnMap?.(currentComplaint.location.lat, currentComplaint.location.lng)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-600">View on Map</p>
                          <p className="text-xs text-blue-400">Coordinates: {currentComplaint.location.lat.toFixed(4)}, {currentComplaint.location.lng.toFixed(4)}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Complaint Found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  We couldn't find any complaint matching the details provided. Please check the ID or phone number and try again.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
