import { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import AnalyticsPage from './components/AnalyticsPage.jsx';

export default function App() {
  const [view, setView] = useState('landing'); // landing, login, register, dashboard, analytics
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', { withCredentials: true });
        setUser(res.data.user);
        setView('dashboard');
      } catch (err) {
        setView('landing');
      }
    };
    checkAuth();
  }, []);

  // Mock Data
const [links, setLinks] = useState([
  { id: 1, original: 'https://github.com/reactjs/ry', short: 'shrt.ly/react', clicks: 124, date: '2023-10-12' },
  { id: 2, original: 'https://tailwindcss.com/docs', short: 'shrt.ly/tw-docs', clicks: 89, date: '2023-10-15' },
]);

  const navigate = (newView) => setView(newView);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = view === 'login' ? '/login' : '/register';
    const payload = view === 'login' ? { email, password } : { name, email, password };

    try {
      const result = await axios.post(`http://localhost:5000/auth${endpoint}`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      // Update user state with the returned data
      setUser(result.data.user); 
      console.log("Authentication successful:", result.data);
      navigate('dashboard');
      
      // Clear inputs
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      // FIX: Access error from err.response
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('landing');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const showAnalytics = (link) => {
    setSelectedUrl(link);
    navigate('analytics');
  };

  const deleteLink = (id) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {view === 'landing' && <LandingPage onNavigate={navigate} />}
      {(view === 'login' || view === 'register') && (
        <AuthPage 
          view={view} 
          onNavigate={navigate} 
          onLogin={handleAuth}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword} 
        />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          links={links} 
          onLogout={handleLogout} 
          onAnalytics={showAnalytics}
          onDelete={deleteLink}
        />
      )}
      {view === 'analytics' && (
        <AnalyticsPage data={selectedUrl} onBack={() => navigate('dashboard')} />
      )}
    </div>
  );
}