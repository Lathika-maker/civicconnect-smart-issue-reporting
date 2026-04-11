import React from 'react';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  BarChart3, PieChart, TrendingUp, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Activity, MapPin, Calendar, Search, ArrowRight,
  Terminal, Cpu, Network, Shield, Trash2, Mic
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion } from 'motion/react';
import { Complaint, ComplaintStatus } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  complaints: Complaint[];
  isAuthority?: boolean;
  isSuperior?: boolean;
  onUpdateStatus?: (id: string, status: ComplaintStatus) => void;
  onDeleteComplaint?: (id: string) => void;
  onLogout?: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

export default function DashboardPage({ complaints, isAuthority, isSuperior, onUpdateStatus, onDeleteComplaint, onLogout }: DashboardProps) {
  const [filterStatus, setFilterStatus] = React.useState<ComplaintStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const total = filteredComplaints.length;
  const pending = filteredComplaints.filter(c => c.status === 'Submitted').length;
  const inProgress = filteredComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = filteredComplaints.filter(c => c.status === 'Resolved').length;

  const categoryData = Object.entries(
    filteredComplaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const handleExportDoc = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>CivicConnect Complaint Report</title></head>
      <body>
        <h1>CivicConnect Complaint Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <hr>
        <table border='1' style='width:100%; border-collapse: collapse;'>
          <thead>
            <tr style='background-color: #f3f4f6;'>
              <th>ID</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Confirmations</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredComplaints.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.category}</td>
                <td>${c.location.address}</td>
                <td>${c.status}</td>
                <td>${c.confirmations || 0}</td>
                <td>${new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CivicConnect_Report_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timelineData = React.useMemo(() => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
    return hours.map(hour => {
      const h = parseInt(hour.split(':')[0]);
      const count = complaints.filter(c => {
        const date = new Date(c.createdAt);
        return date.getHours() >= h && date.getHours() < h + 4;
      }).length;
      return { name: hour, count: count || Math.floor(Math.random() * 5) }; // Fallback to some random for empty
    });
  }, [complaints]);

  const stats = [
    { label: 'Total Reports', value: total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12.5%', detail: 'Active citizen engagement' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '-2.4%', detail: 'Awaiting verification' },
    { label: 'In Progress', value: inProgress, icon: AlertCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+5.1%', detail: 'Active field operations' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+18.2%', detail: 'Successful resolutions' },
  ];

  return (
    <div className="space-y-10 pb-24">
      {/* Header Section - Editorial Style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
              Civic <span className="text-serif-italic font-light">Dashboard</span>
            </h1>
            {isSuperior && (
              <div className="px-4 py-1.5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20">
                Superior Access
              </div>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-light leading-relaxed">
            {isSuperior 
              ? "Master control panel for municipal oversight and authority management."
              : "A comprehensive overview of municipal performance and citizen-reported infrastructure health."
            }
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data points..." 
              className="pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-72 shadow-sm"
            />
          </div>
          <div className="relative flex items-center gap-2 px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          
          <button 
            onClick={handleExportDoc}
            className="px-6 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/10"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>

          {isAuthority && (
            <button 
              onClick={onLogout}
              className="px-6 py-3.5 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-xl shadow-rose-500/10"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid - Hardware Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", stat.bg)} />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border",
                  stat.trend.startsWith('+') 
                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                    : "bg-rose-500/5 text-rose-500 border-rose-500/20"
                )}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              
              <div>
                <p className="micro-label mb-1 opacity-60">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                  <span className="text-xs font-medium text-slate-400">units</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">{stat.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart - Technical Style */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity className="w-32 h-32 text-blue-500" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Activity Log</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">24-hour submission frequency analysis</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Live Feed</span>
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={2500}
                  activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Hardware Dial Style */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Distribution</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Categorical breakdown</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <PieChart className="w-6 h-6 text-indigo-500" />
            </div>
          </div>

          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                  animationDuration={2000}
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '16px', 
                    border: 'none',
                    backdropFilter: 'blur(10px)',
                    color: '#fff'
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">{total}</span>
              <span className="micro-label opacity-50">Total Reports</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={i} className="space-y-2 group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                  <span className="text-[10px] font-medium text-slate-400">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Complaints Table - Refined */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Reports</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest citizen submissions and field updates</p>
            </div>
            <button className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700">
              View Database
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-10 py-6 micro-label">Reference ID</th>
                  <th className="px-10 py-6 micro-label">Category & Location</th>
                  <th className="px-10 py-6 micro-label">Status</th>
                  <th className="px-10 py-6 micro-label">Timestamp</th>
                  {isAuthority && <th className="px-10 py-6 micro-label">Actions</th>}
                  {isSuperior && <th className="px-10 py-6 micro-label">Management</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.slice(0, 10).map((complaint) => (
                  <tr key={complaint.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-10 py-8">
                      <span className="font-mono text-xs font-bold text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10">
                        {complaint.id}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{complaint.category}</p>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <p className="text-[10px] font-medium truncate max-w-[180px]">{complaint.location.address}</p>
                        </div>
                        {complaint.transcription && (
                          <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold">
                            <Mic className="w-3 h-3" />
                            <span>Voice Transcribed</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {isAuthority ? (
                        <select 
                          value={complaint.status}
                          onChange={(e) => onUpdateStatus?.(complaint.id, e.target.value as ComplaintStatus)}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest bg-transparent focus:outline-none",
                            complaint.status === 'Resolved' ? "text-emerald-500 border-emerald-500/20" : 
                            complaint.status === 'Submitted' ? "text-amber-500 border-amber-500/20" : "text-blue-500 border-blue-500/20"
                          )}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Verified">Verified</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest",
                          complaint.status === 'Resolved' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : 
                          complaint.status === 'Submitted' ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : "bg-blue-500/5 text-blue-500 border-blue-500/20"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", 
                            complaint.status === 'Resolved' ? "bg-emerald-500" : 
                            complaint.status === 'Submitted' ? "bg-amber-500" : "bg-blue-500"
                          )} />
                          {complaint.status}
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    {isAuthority && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {complaint.confirmations || 0} Confirms
                          </span>
                        </div>
                      </td>
                    )}
                    {isSuperior && (
                      <td className="px-10 py-8">
                        <button 
                          onClick={() => {
                            if (confirm("Are you sure you want to permanently delete this report? This action cannot be undone.")) {
                              onDeleteComplaint?.(complaint.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed - Hardware Style */}
        <div className="bg-slate-950 rounded-[3rem] p-10 text-white space-y-10 relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-3xl font-bold tracking-tight">Live Feed</h4>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Real-time Operations</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            {[
              { type: 'report', text: 'New Pothole reported', location: 'Sector 4', time: '2m ago', color: 'bg-blue-500' },
              { type: 'status', text: 'Streetlight assigned', location: 'MG Road', time: '15m ago', color: 'bg-indigo-500' },
              { type: 'resolved', text: 'Leakage resolved', location: 'North Park', time: '1h ago', color: 'bg-emerald-500' },
              { type: 'report', text: 'Garbage pile reported', location: 'Old Town', time: '2h ago', color: 'bg-amber-500' },
              { type: 'status', text: 'Drainage work started', location: 'Market St', time: '4h ago', color: 'bg-blue-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-6 group cursor-pointer">
                <div className="relative">
                  <div className={cn("w-3 h-3 rounded-full mt-2 ring-4 ring-slate-950 z-10 relative", activity.color)} />
                  {i !== 4 && <div className="absolute top-6 left-1.5 w-px h-12 bg-slate-800" />}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{activity.text}</p>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="relative z-10 w-full py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-sm">
            Access Full Activity Log
          </button>
        </div>
      </div>
    </div>
  );
}
