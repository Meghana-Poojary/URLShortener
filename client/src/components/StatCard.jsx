import { useState } from 'react';
import { 
  Scissors, Link as LinkIcon, BarChart3, Shield, 
  Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
  Globe, Calendar, LogOut 
} from 'lucide-react';

export default function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="mb-4">{icon}</div>
            <div className="text-slate-500 text-sm font-medium">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}