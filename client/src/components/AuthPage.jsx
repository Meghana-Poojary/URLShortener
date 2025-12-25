import { useState } from 'react';

export default function AuthPage({ view, onNavigate, onLogin, name, setName, email, setEmail, password, setPassword }) {

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-white">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500">{view === 'login' ? 'Enter your details to manage links' : 'Join Shortly today'}</p>
            </div>
            {view === 'login' ? 
            <form onSubmit={onLogin} className="space-y-4">
                <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none" required />
                <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none" required />
                <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                    Sign In
                </button>
            </form>
            :
            <form onSubmit={onLogin} className="space-y-4">
                <input name="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none" required />
                <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none" required />
                <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-indigo-500 border-none" required />
                <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                    Sign Up
                </button>
            </form> 
            }
            
            <p className="mt-6 text-center text-slate-500">
                {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button onClick={() => onNavigate(view === 'login' ? 'register' : 'login')} className="text-indigo-600 font-bold underline">
                {view === 'login' ? 'Register' : 'Login'}
                </button>
            </p>
            </div>
        </div>
    );
}