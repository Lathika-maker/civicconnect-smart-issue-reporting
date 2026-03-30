import React, { useState, useEffect } from 'react';
import { 
  MapPin, Filter, Search, Info, ThumbsUp, 
  CheckCircle2, AlertTriangle, Zap, Droplets, Trash2, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Complaint, IssueCategory } from '../types';
import { cn } from '../lib/utils';

// Fix Leaflet icon issue using CDN URLs
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPageProps {
  complaints: Complaint[];
}

const CATEGORY_ICONS: Record<IssueCategory, any> = {
  'Road Potholes': AlertTriangle,
  'Garbage / Sanitation': Trash2,
  'Electricity Damage': Zap,
  'Water Leakage': Droplets,
  'Drainage Problems': Droplets,
  'Streetlight Failure': Lightbulb
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  'Road Potholes': '#f59e0b',
  'Garbage / Sanitation': '#10b981',
  'Electricity Damage': '#3b82f6',
  'Water Leakage': '#06b6d4',
  'Drainage Problems': '#6366f1',
  'Streetlight Failure': '#eab308'
};

const CATEGORY_BG_CLASSES: Record<IssueCategory, string> = {
  'Road Potholes': 'bg-amber-500',
  'Garbage / Sanitation': 'bg-green-500',
  'Electricity Damage': 'bg-blue-500',
  'Water Leakage': 'bg-cyan-500',
  'Drainage Problems': 'bg-indigo-500',
  'Streetlight Failure': 'bg-yellow-500'
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MapPage({ complaints }: MapPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);

  const filteredComplaints = complaints.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setMapCenter([complaint.location.lat, complaint.location.lng]);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Interactive Civic Map</h1>
          <p className="text-slate-500">Explore reported issues across the city in real-time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search area or ID..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-64"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {Object.keys(CATEGORY_ICONS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
        {/* Real Map Container */}
        <div className="lg:col-span-3 bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={mapCenter} />
            {filteredComplaints.map((complaint) => (
              <Marker 
                key={complaint.id} 
                position={[complaint.location.lat, complaint.location.lng]}
                eventHandlers={{
                  click: () => setSelectedComplaint(complaint),
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", CATEGORY_BG_CLASSES[complaint.category])} />
                      <span className="text-[10px] font-bold uppercase text-slate-400">{complaint.category}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{complaint.location.address}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        complaint.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {complaint.status}
                      </span>
                      <button 
                        onClick={() => handleSelectComplaint(complaint)}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg space-y-2 z-[1000]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Map Legend</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(CATEGORY_BG_CLASSES).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", color)} />
                  <span className="text-[10px] font-bold text-slate-600">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Complaint Overlay */}
          <AnimatePresence>
            {selectedComplaint && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-6 right-6 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[1000]"
              >
                <div className="h-32 bg-slate-100 relative">
                  <img 
                    src={`https://picsum.photos/seed/${selectedComplaint.id}/400/200`} 
                    alt="Issue"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:bg-white"
                  >
                    ×
                  </button>
                  <div className={cn(
                    "absolute bottom-2 left-2 px-3 py-1 rounded-full text-[10px] font-bold text-white",
                    CATEGORY_BG_CLASSES[selectedComplaint.category]
                  )}>
                    {selectedComplaint.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ID: {selectedComplaint.id}</p>
                    <h4 className="font-bold text-slate-900 leading-tight">{selectedComplaint.location.address}</h4>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{selectedComplaint.upvotes} Upvotes</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 font-bold",
                      selectedComplaint.status === 'Resolved' ? "text-green-600" : "text-blue-600"
                    )}>
                      {selectedComplaint.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                      {selectedComplaint.status}
                    </div>
                  </div>
                  <button 
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Confirm Issue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Recent Reports</h3>
            <p className="text-xs text-slate-500">{filteredComplaints.length} issues found in this area</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {filteredComplaints.map((complaint) => (
              <button
                key={complaint.id}
                onClick={() => handleSelectComplaint(complaint)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all group",
                  selectedComplaint?.id === complaint.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-slate-100 hover:border-blue-100 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                    CATEGORY_BG_CLASSES[complaint.category]
                  )}>
                    {React.createElement(CATEGORY_ICONS[complaint.category], { className: "w-4 h-4" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{complaint.id}</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{complaint.category}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{complaint.location.address}</p>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    complaint.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {complaint.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
