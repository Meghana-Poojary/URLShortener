import { useState } from 'react';
import { 
    Scissors, Link as LinkIcon, BarChart3, Shield, 
    Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
    Globe, Calendar, LogOut 
} from 'lucide-react';

export default function Dashboard({ links, onLogout, onAnalytics, onDelete, longUrl, setLongUrl, shorten, redirect }) { 
    const [copiedId, setCopiedId] = useState(null);
    const backendBase = import.meta.env.VITE_API_URL;

    function formatDateTime(iso) {
        if (!iso) return { date: '', time: '' };
        // Expected format: 2025-12-25T14:46:34.448Z
        const parts = iso.split('T');
        const date = parts[0] || '';
        const time = (parts[1] || '').split('.')[0];
        return { date, time };
    }

    async function copyFullUrl(link) {
        try {
            const full = `${backendBase}/short_url/${link.short_url}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(full);
            } else {
                const ta = document.createElement('textarea');
                ta.value = full;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            setCopiedId(link.id);
            setTimeout(() => setCopiedId(null), 1800);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }

    function handleShortUrlCopy(e, link) {
        e.preventDefault();
        const full = `${backendBase}/short_url/${link.short_url}`;
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', full);
        }
        copyFullUrl(link);
    }

    return (
    <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Scissors size={24} /> <span>Shortly</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition font-medium">
            <LogOut size={20} /> Logout
        </button>
        </div>

        {/* separator */}
        <div className="border-b border-slate-200 mb-6" />

        {/* URL Input Area */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
        <h3 className="text-xl font-bold mb-4">Shorten a new link</h3>
        
        <form>
            <div className="flex flex-col md:flex-row gap-3">
            <input 
            type="text" 
            name="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://very-long-url.com/path/to/resource" 
            className="flex-1 px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none text-lg"
            required/>
            <button type="button" onClick={shorten} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <Plus size={20} /> Shorten
            </button>
            </div>
        </form>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Previously Shortened Links</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <tr>
                <th className="px-6 py-4 font-semibold">Original URL</th>
                <th className="px-6 py-4 font-semibold">Short URL</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {links && links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 max-w-xs truncate font-medium">{link.long_url}</td>
                    <td className="px-6 py-4 text-indigo-600 font-bold">
                    <div 
                        className="flex items-center gap-2 select-all"
                        onCopy={(e) => handleShortUrlCopy(e, link)}
                    >
                        <span 
                            className="cursor-pointer select-all" 
                            onClick={() => redirect(link.short_url)}
                        >
                            short_url/{link.short_url}
                        </span>
                        <button
                        onClick={(e) => { e.stopPropagation(); copyFullUrl(link); }}
                        className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-md text-sm transition"
                        title="Copy full URL"
                        >
                            <MousePointerClick size={14} />
                        </button>
                        {copiedId === link.id && (
                        <span className="text-sm text-emerald-600 font-medium">Copied</span>
                        )}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    {(() => {
                        const { date, time } = formatDateTime(link.created_at);
                        return (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                            <strong className="font-semibold">Date:</strong> {date} <span className="mx-2" /> <strong className="font-semibold">Time:</strong> {time}
                        </span>
                        );
                    })()}
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