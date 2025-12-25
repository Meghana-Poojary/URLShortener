import { useState } from 'react';
import { 
  Scissors, Link as LinkIcon, BarChart3, Shield, 
  Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
  Globe, Calendar, LogOut, Clock, Activity, List
} from 'lucide-react';
import StatCard from './StatCard.jsx';

export default function AnalyticsPage ({ data, analytics, onBack }) {
    function formatDateTime(iso) {
        if (!iso) return { date: '', time: '' };
        const parts = iso.split('T');
        const date = parts[0] || '';
        const time = (parts[1] || '').split('.')[0];
        return { date, time };
    }

    const { date, time } = formatDateTime(data?.created_at);
    const clickCount = analytics?.visitCount ?? data?.clicks ?? 0;
    const visits = analytics?.analytics ?? [];

    function getDaysRangeFromVisits(visitsArr) {
        if (!visitsArr || visitsArr.length === 0) {
            const out = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                d.setHours(0,0,0,0);
                out.push(d);
            }
            return out;
        }
        const dates = visitsArr.map(v => new Date(v.visited_at || v.visitedAt));
        let min = new Date(Math.min(...dates.map(d => d.getTime())));
        let max = new Date(Math.max(...dates.map(d => d.getTime())));
        min.setHours(0,0,0,0);
        max.setHours(0,0,0,0);
        const out = [];
        for (let d = new Date(min); d <= max; d.setDate(d.getDate() + 1)) {
            out.push(new Date(d));
        }
        return out;
    }

    function groupVisitsByDay(visitsArr, days) {
        const counts = days.map(() => 0);
        for (const v of visitsArr) {
            const dt = new Date(v.visited_at || v.visitedAt);
            const nd = new Date(dt);
            nd.setHours(0,0,0,0);
            const idx = days.findIndex(d => d.getTime() === nd.getTime());
            if (idx >= 0) counts[idx]++;
        }
        return counts;
    }

    const lastDays = getDaysRangeFromVisits(visits);
    const counts = groupVisitsByDay(visits, lastDays);

    const svgWidth = 800;
    const svgHeight = 240;
    const padding = 40;
    const maxCount = Math.max(...counts, 1);
    const stepX = (svgWidth - padding * 2) / (Math.max(1, counts.length - 1));
    
    const points = counts.map((c, i) => {
        const x = padding + i * stepX;
        const y = padding + (svgHeight - padding * 2) * (1 - c / maxCount);
        return { x, y, v: c };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            <div className="max-w-5xl mx-auto p-6">
                <button 
                    onClick={onBack} 
                    className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-8 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Link Analytics</h2>
                        <div className="flex items-center gap-2 text-slate-500">
                            <LinkIcon size={16} />
                            <p className="font-medium truncate max-w-md">{data.long_url}</p>
                            <a href={data.long_url} target="_blank" rel="noreferrer">
                                <ExternalLink size={14} className="hover:text-indigo-600 cursor-pointer" />
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                            Link Tracking
                         </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard 
                        icon={<MousePointerClick className="text-indigo-600"/>} 
                        label="Total Engagement" 
                        value={clickCount.toLocaleString()} 
                    />
                    <StatCard 
                        icon={<Calendar className="text-emerald-600"/>} 
                        label="Created Date" 
                        value={date} 
                    />
                    <StatCard 
                        icon={<Clock className="text-amber-600"/>} 
                        label="Created Time" 
                        value={time} 
                    />
                </div>

                <div className="space-y-8">
                    {/* Activity Chart Card */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Activity size={20} className="text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-xl text-slate-800">Click Activity</h3>
                            </div>
                            <div className="text-sm text-slate-400 font-medium">
                                {lastDays.length} Day View
                            </div>
                        </div>

                        <div className="relative">
                            <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* horizontal grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                                    <line 
                                        key={i} 
                                        x1={padding} 
                                        x2={svgWidth - padding} 
                                        y1={padding + (svgHeight - padding * 2) * t} 
                                        y2={padding + (svgHeight - padding * 2) * t} 
                                        stroke="#f1f5f9" 
                                        strokeWidth="1.5" 
                                    />
                                ))}

                                {/* Area Fill */}
                                <path d={areaD} fill="url(#chartGradient)" />

                                {/* Main Line */}
                                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                                
                                {/* Points */}
                                {points.map((p, i) => (
                                    <g key={i} className="hover:opacity-80 transition-opacity">
                                        <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#6366f1" strokeWidth="2" />
                                        <text x={p.x} y={p.y - 12} fontSize="12" fontWeight="600" textAnchor="middle" fill="#475569">{p.v}</text>
                                    </g>
                                ))}

                                {/* x labels */}
                                {lastDays.map((d, i) => (
                                    <text key={i} x={padding + i * stepX} y={svgHeight - 10} fontSize="11" fontWeight="500" textAnchor="middle" fill="#94a3b8">
                                        {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Visitors Table Card */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <List size={20} className="text-slate-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800">Visitor Log</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">IP Address</th>
                                        <th className="px-8 py-4">Date</th>
                                        <th className="px-8 py-4 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visits.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic">
                                                No visit data available for this period.
                                            </td>
                                        </tr>
                                    ) : (
                                        visits
                                            .sort((a,b) => new Date(b.visited_at || b.visitedAt) - new Date(a.visited_at || a.visitedAt))
                                            .map((v, i) => {
                                                const dtObj = new Date(v.visited_at || v.visitedAt);
                                                return (
                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-4 font-mono text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">
                                                            {v.ip_address ?? v.ip ?? 'Unknown'}
                                                        </td>
                                                        <td className="px-8 py-4 text-sm text-slate-600">
                                                            {dtObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </td>
                                                        <td className="px-8 py-4 text-sm text-slate-500 text-right font-medium">
                                                            {dtObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}          