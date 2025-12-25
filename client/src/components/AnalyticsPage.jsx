import { useState } from 'react';
import { 
  Scissors, Link as LinkIcon, BarChart3, Shield, 
  Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
  Globe, Calendar, LogOut 
} from 'lucide-react';
import StatCard from './StatCard.jsx';

export default function AnalyticsPage ({ data, onBack }) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition mb-8 font-medium">
            <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Link Analytics</h2>
            <p className="text-slate-500 truncate">Tracking data for: {data.original}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
            <StatCard icon={<MousePointerClick className="text-blue-600"/>} label="Total Clicks" value={data.clicks} />
            <StatCard icon={<Globe className="text-emerald-600"/>} label="Top Region" value="United States" />
            <StatCard icon={<Calendar className="text-purple-600"/>} label="Created" value={data.date} />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-6">Click Activity (Last 7 Days)</h3>
            <div className="flex items-end gap-2 h-40">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-100 rounded-t-lg hover:bg-indigo-600 transition-all cursor-pointer group relative" style={{ height: `${h}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    {Math.floor(h * 1.5)}
                    </span>
                </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            </div>
        </div>
    );
}