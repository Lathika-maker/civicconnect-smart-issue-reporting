import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  BarChart3, PieChart, TrendingUp, Filter, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, LogOut,
  ChevronDown, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Complaint, ComplaintStatus, IssueCategory } from '../types';
import { cn } from '../lib/utils';
import { saveAs } from 'file-saver';

interface DashboardProps {
  complaints: Complaint[];
  isAuthority?: boolean;
  onUpdateStatus?: (id: string, status: ComplaintStatus) => void;
  onLogout?: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

const STATUS_OPTIONS: ComplaintStatus[] = [
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved'
];

const CATEGORIES: IssueCategory[] = [
  'Road Potholes',
  'Garbage / Sanitation',
  'Electricity Damage',
  'Water Leakage',
  'Drainage Problems',
  'Streetlight Failure'
];

export default function DashboardPage({ 
  complaints, 
  isAuthority = false, 
  onUpdateStatus,
  onLogout 
}: DashboardProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredComplaints = complaints.filter(c => {
    const statusMatch = filterStatus === 'All' || c.status === filterStatus;
    const categoryMatch = filterCategory === 'All' || c.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const categoryData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const timelineData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 8 },
    { name: 'Sat', count: 15 },
    { name: 'Sun', count: 10 },
  ];

  const stats = [
    { label: 'Total Complaints', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { label: 'Pending Issues', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-5%' },
    { label: 'In Progress', value: inProgress, icon: AlertCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+8%' },
    { label: 'Resolved Issues', value: resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: '+24%' },
  ];

  const exportToDoc = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>CivicConnect Report</title></head>
      <body>
        <h1>CivicConnect Complaint Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <hr/>
        <h2>Summary Statistics</h2>
        <ul>
          <li>Total Complaints: ${total}</li>
          <li>Pending: ${pending}</li>
          <li>In Progress: ${inProgress}</li>
          <li>Resolved: ${resolved}</li>
        </ul>
        <hr/>
        <h2>Recent Complaints</h2>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th>ID</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
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
    saveAs(blob, `CivicConnect_Report_${new Date().toISOString().split('T')[0]}.doc`);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">
            {isAuthority ? "Authority Management Portal" : "Civic Transparency Dashboard"}
          </h1>
          <p className="text-slate-500">
            {isAuthority 
              ? "Manage and update municipal civic complaints." 
              : "Real-time overview of municipal civic works and progress."}
          </p>
        </div>
        <div className="flex gap-2">
          {isAuthority && onLogout && (
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2 border rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Filter className="w-4 h-4" />
              Filter
              {(filterStatus !== 'All' || filterCategory !== 'All') && (
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">Filters</h5>
                  <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                  >
                    <option value="All">All Statuses</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select 
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => {
                    setFilterStatus('All');
                    setFilterCategory('All');
                  }}
                  className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          {isAuthority && (
            <button 
              onClick={exportToDoc}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend.startsWith('+') ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Complaints Trend</h4>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">By Category</h4>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h4 className="font-bold text-slate-900">
            {isAuthority ? "Manage Complaints" : "Recent Progress"}
          </h4>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Complaint ID</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredComplaints.slice(0, 10).map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 font-mono text-sm font-bold text-blue-600">{complaint.id}</td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-900">{complaint.category}</td>
                  <td className="px-8 py-4 text-sm text-slate-500 max-w-xs truncate">{complaint.location.address}</td>
                  <td className="px-8 py-4">
                    {isAuthority ? (
                      <div className="relative">
                        <button 
                          onClick={() => setUpdatingId(updatingId === complaint.id ? null : complaint.id)}
                          className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2 transition-all",
                            complaint.status === 'Resolved' ? "bg-green-100 text-green-600" : 
                            complaint.status === 'Submitted' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                          )}
                        >
                          {complaint.status}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {updatingId === complaint.id && (
                          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-10 py-2">
                            {STATUS_OPTIONS.map(status => (
                              <button
                                key={status}
                                onClick={() => {
                                  onUpdateStatus?.(complaint.id, status);
                                  setUpdatingId(null);
                                }}
                                className={cn(
                                  "w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 transition-all",
                                  complaint.status === status ? "text-blue-600 bg-blue-50" : "text-slate-600"
                                )}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full",
                        complaint.status === 'Resolved' ? "bg-green-100 text-green-600" : 
                        complaint.status === 'Submitted' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {complaint.status}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
