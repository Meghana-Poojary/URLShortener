import { useState } from 'react';
import { 
  Scissors, Link as LinkIcon, BarChart3, Shield, 
  Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
  Globe, Calendar, LogOut 
} from 'lucide-react';

export default function Dashboard({ links, onLogout, onAnalytics, onDelete }){ 
    return (
    <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Scissors size={24} /> <span>Shortly</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition font-medium">
            <LogOut size={20} /> Logout
        </button>
        </div>

        {/* URL Input Area */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
        <h3 className="text-xl font-bold mb-4">Shorten a new link</h3>
        <div className="flex flex-col md:flex-row gap-3">
            <input 
            type="text" 
            placeholder="https://very-long-url.com/path/to/resource" 
            className="flex-1 px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none text-lg"
            />
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <Plus size={20} /> Shorten
            </button>
        </div>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Links</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <tr>
                <th className="px-6 py-4 font-semibold">Original URL</th>
                <th className="px-6 py-4 font-semibold">Short URL</th>
                <th className="px-6 py-4 font-semibold">Clicks</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 max-w-xs truncate font-medium">{link.original}</td>
                    <td className="px-6 py-4 text-indigo-600 font-bold">{link.short}</td>
                    <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                        {link.clicks} clicks
                    </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => onAnalytics(link)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition" title="View Analysis">
                        <BarChart3 size={18} />
                    </button>
                    <button onClick={() => onDelete(link.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
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