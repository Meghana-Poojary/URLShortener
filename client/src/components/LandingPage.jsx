import React, { useState } from 'react';
import { 
  Scissors, Link as LinkIcon, BarChart3, Shield, 
  Trash2, ExternalLink, ArrowLeft, Plus, MousePointerClick, 
  Globe, Calendar, LogOut 
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
    return (
        <div className="flex flex-col min-h-screen">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
                <Scissors /> <span>Shortly</span>
            </div>
            
            <div className="flex gap-4">
                <button onClick={() => onNavigate('login')} className="px-6 py-2 font-medium hover:text-indigo-600 transition">Login</button>
                <button onClick={() => onNavigate('register')} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">Register</button>
            </div>
            </nav>
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                Short links, <span className="text-indigo-600">big impact.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mb-10">
                The complete link management platform. Built for influencers, developers, and businesses who care about their click-through rates.
            </p>
            <button onClick={() => onNavigate('register')} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                Get Started for Free
            </button>
            </main>
        </div>
    );
}