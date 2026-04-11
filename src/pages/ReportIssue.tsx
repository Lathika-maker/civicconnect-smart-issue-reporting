import React, { useState, useRef } from 'react';
import { 
  Camera, MapPin, Send, RotateCcw, CheckCircle2, 
  AlertCircle, Mic, Info, Loader2, X, Play, Square,
  User, ArrowRight, Terminal, Cpu, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, IssueCategory } from '../types';
import { Page } from '../App';

import { useLanguage } from '../LanguageContext';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { transcribeAudio } from '../services/geminiService';

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
    address: '',
    lat: 12.9716,
    lng: 77.5946
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Media States
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value) error = 'Full name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Enter a valid 10-digit number';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address';
        break;
      case 'category':
        if (!value) error = 'Please select a category';
        break;
      case 'description':
        if (!value) error = 'Description is required';
        else if (value.length < 10) error = 'Description must be at least 10 characters';
        else if (value.length > 1000) error = 'Description cannot exceed 1000 characters';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleLocationDetect = () => {
    setIsLocating(true);
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using Nominatim for real reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const address = data.display_name || `Geotagged: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setFormData(prev => ({
              ...prev,
              address,
              lat: latitude,
              lng: longitude
            }));
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            setFormData(prev => ({
              ...prev,
              address: `Geotagged: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              lat: latitude,
              lng: longitude
            }));
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsLocating(false);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access was denied. Please check your browser's address bar for a blocked location icon and set it to 'Allow'. If you are on mobile, ensure GPS is turned on.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred while detecting location.");
              break;
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    setMicError(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Your browser does not support audio recording. Please try a modern browser like Chrome or Firefox.");
      return;
    }

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

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());

        // Auto-transcribe
        setIsTranscribing(true);
        try {
          const base64 = await blobToBase64(blob);
          const text = await transcribeAudio(base64, 'audio/webm');
          setTranscription(text);
          // If description is empty, use transcription
          if (!formData.description && text && text !== "Transcription failed" && text !== "Transcription unavailable") {
            setFormData(prev => ({ ...prev, description: text }));
            validateField('description', text);
          }
        } catch (error) {
          console.error("Transcription failed:", error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError("Microphone access was denied. Please check your browser's address bar for a blocked microphone icon and set it to 'Allow'. Also ensure your system settings allow microphone access for this browser.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setMicError("No microphone was found on your device.");
        } else {
          setMicError("Could not access microphone. Please ensure it is not being used by another application.");
        }
      } else {
        setMicError("An unexpected error occurred while accessing the microphone.");
      }
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
      setImageFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const fieldsToValidate = ['fullName', 'phoneNumber', 'email', 'category', 'description', 'address'];
    let isValid = true;
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, (formData as any)[field]);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) return;

    setIsSubmitting(true);
    
    const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    let finalAudioUrl = '';
    let finalImageUrl = '';

    try {
      // Upload Audio if exists
      if (audioBlob) {
        const audioRef = ref(storage, `complaints/${id}/audio.webm`);
        await uploadBytes(audioRef, audioBlob);
        finalAudioUrl = await getDownloadURL(audioRef);
      }

      // Upload Image if exists
      if (imageFile) {
        const imageRef = ref(storage, `complaints/${id}/evidence.jpg`);
        await uploadBytes(imageRef, imageFile);
        finalImageUrl = await getDownloadURL(imageRef);
      }

      const newComplaint: Complaint = {
        id,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        category: formData.category as IssueCategory,
        description: formData.description,
        location: {
          lat: formData.lat + (Math.random() - 0.5) * 0.001,
          lng: formData.lng + (Math.random() - 0.5) * 0.001,
          address: formData.address
        },
        status: 'Submitted',
        createdAt: new Date().toISOString(),
        upvotes: 0,
        confirmations: 0,
        isCommunityVerified: false,
        authorUid: auth.currentUser?.uid || 'anonymous',
        audioUrl: finalAudioUrl || undefined,
        transcription: transcription || undefined,
        imageUrl: finalImageUrl || undefined
      } as any;

      await onSubmit(newComplaint);
      setComplaintId(id);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      category: '',
      description: '',
      address: '',
      lat: 12.9716,
      lng: 77.5946
    });
    setSelectedImage(null);
    setAudioUrl(null);
    setAudioBlob(null);
    setImageFile(null);
    setTranscription(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto py-20 px-6"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">Complaint <span className="text-serif-italic font-light">Submitted</span></h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg font-light">
              Your report has been successfully logged into the CivicConnect system. Our team will verify and assign it shortly.
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 inline-block min-w-[300px]">
            <p className="micro-label opacity-40 mb-2">Official Reference ID</p>
            <p className="text-5xl font-mono font-bold text-blue-600 tracking-tighter">{complaintId}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button 
              onClick={() => onNavigate('track')}
              className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
            >
              Track Status
            </button>
            <button 
              onClick={resetForm}
              className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              New Report
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
          Report <span className="text-serif-italic font-light">Issue</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
          {t.report.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            {/* Personal Information */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Reporter Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="micro-label opacity-60 ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium",
                      errors.fullName ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    )}
                  />
                  {errors.fullName && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="micro-label opacity-60 ml-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium",
                      errors.phoneNumber ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    )}
                  />
                  {errors.phoneNumber && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="micro-label opacity-60 ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium",
                    errors.email ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  )}
                />
                {errors.email && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* Issue Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Issue Specification</h3>
              </div>

              <div className="space-y-2">
                <label className="micro-label opacity-60 ml-1">Category</label>
                <div className="relative">
                  <select 
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium appearance-none",
                      errors.category ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    )}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
                {errors.category && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="micro-label opacity-60 ml-1">Detailed Description</label>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    formData.description.length > 900 ? "text-rose-500" : "text-slate-400"
                  )}>
                    {formData.description.length} / 1000
                  </span>
                </div>
                <textarea 
                  required
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue, its impact, and any specific landmarks..."
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium resize-none",
                    errors.description ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  )}
                />
                {errors.description && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.description}</p>}
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* Location */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Deployment Location</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 space-y-2">
                  <div className="relative">
                    <input 
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter street address or landmarks"
                      className={cn(
                        "w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border outline-none transition-all dark:text-white font-medium",
                        errors.address ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                      )}
                    />
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  {errors.address && <p className="text-xs text-rose-500 ml-1 font-medium">{errors.address}</p>}
                </div>
                <button 
                  type="button"
                  onClick={handleLocationDetect}
                  disabled={isLocating}
                  className="px-8 py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 h-fit mt-0"
                >
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                  Auto-Detect
                </button>
              </div>
              {locationError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed font-medium">
                    {locationError}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                Dispatch Report
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[1.5rem] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-4 space-y-8">
          {/* Media Upload Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Visual Evidence</h4>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Camera className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div 
              onClick={triggerFileInput}
              className="aspect-square border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden bg-slate-50/50 dark:bg-slate-800/30"
            >
              {selectedImage ? (
                <div className="relative w-full h-full">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-[2.5rem]" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full shadow-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:scale-110 transition-all shadow-sm">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Upload Evidence</p>
                    <p className="text-xs text-slate-400 mt-1">Tap to capture or browse</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Voice Dispatch Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Voice Dispatch</h4>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Mic className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Prefer speaking? Record a voice message and our system will automatically transcribe and categorize your report.
            </p>
            
            {!audioUrl ? (
              <div className="space-y-3">
                <button 
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                    isRecording 
                      ? "bg-rose-500 text-white animate-pulse shadow-xl shadow-rose-500/20" 
                      : "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800"
                  )}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? "Stop Recording" : "Start Voice Report"}
                </button>
                {micError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed font-medium">
                      {micError}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                    {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {isTranscribing ? "Transcribing..." : "Audio Logged"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isTranscribing ? "Using AI to process voice" : "Ready for processing"}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setAudioUrl(null); setTranscription(null); }}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {transcription && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="micro-label opacity-40 mb-2">AI Transcription</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{transcription}"</p>
                  </div>
                )}
                <audio src={audioUrl} controls className="w-full h-10 opacity-50" />
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="flex items-center gap-3 relative z-10">
              <Info className="w-5 h-5" />
              <h4 className="font-bold">Submission Protocol</h4>
            </div>
            <div className="space-y-4 relative z-10">
              {[
                "Ensure photos are well-lit and clear.",
                "Provide specific landmarks if possible.",
                "Geotagging improves response time by 40%."
              ].map((text, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  <p className="text-sm text-blue-100 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
