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
  const [longUrl, setLongUrl] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  const backend_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${backend_url}/auth/me`, { withCredentials: true });
        setUser(res.data.user);
        setView('dashboard');
      } catch (err) {
        setView('landing');
      }
    };

    checkAuth();
  }, []);

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const getLinks = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${backend_url}/short_url/urls`, { withCredentials: true });
        setLinks(res.data.urls);
      } catch (err) {
        if (err.response?.status === 404) {
          setLinks([]);
        } else {
          console.error('Failed to fetch urls', err);
        }
      }
    };

    getLinks();
  }, [user]);

  const navigate = (newView) => {
    // Don't allow showing auth pages when already logged in
    if ((newView === 'login' || newView === 'register') && user) {
      setView('dashboard');
      return;
    }

    // Allow navigating to protected views even if `user` hasn't been set
    // immediately (prevents a brief flash caused by React state being
    // updated asynchronously after an auth request completes).
    setView(newView);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = view === 'login' ? '/login' : '/register';
    const payload = view === 'login' ? { email, password } : { name, email, password };

    try {
      const result = await axios.post(`${backend_url}/auth${endpoint}`, payload, {
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
      await axios.post(`${backend_url}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('landing');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const shorten = async () => {
    if (!longUrl) {
      alert("Please enter a URL to shorten");
      return;
    }
    try {
      const res = await axios.post(`${backend_url}/short_url/shorten`, 
        { longUrl }, 
        { withCredentials: true }
      );
      console.log("URL shortened:", res.data);
      setLongUrl('');
      try {
        const linksRes = await axios.get(`${backend_url}/short_url/urls`, { withCredentials: true });
        setLinks(linksRes.data.urls);
        console.log(links)
      } catch (err) {
        console.error('Failed to refresh links after shorten', err);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to shorten URL");
    }
  }; 

  const showAnalytics = async (link) => {
    setSelectedUrl(link);
    try {
      const res = await axios.get(`${backend_url}/short_url/analytics/${link.id}`, { withCredentials: true });
      setAnalyticsData(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch analytics");
      return;
    }
    console.log("Analytics data:", analyticsData);
    console.log("Selected URL:", link);
    navigate('analytics');
  };

  const deleteLink = async (id) => {
    try {
      const res = await axios.delete(`${backend_url}/short_url/${id}`, { withCredentials: true });
      console.log("URL deleted:", res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete URL");
    }
    setLinks(links.filter(l => l.id !== id));
  };

  const redirect = async (short_url) => {
    try {
      const res = await axios.get(`${backend_url}/short_url/${short_url}`);
      window.open(res.data.longUrl, '_blank')
    } catch (err) {
      alert(err.response?.data?.error || "Failed to redirect");
    } 
  }

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
      {view === 'dashboard' && user && (
        <Dashboard 
          links={links} 
          onLogout={handleLogout} 
          onAnalytics={showAnalytics}
          onDelete={deleteLink}
          longUrl={longUrl}
          setLongUrl={setLongUrl}
          shorten={shorten}
          redirect={redirect}
        />
      )}
      {view === 'analytics' && user && (
        <AnalyticsPage data={selectedUrl} analytics={analyticsData} onBack={() => navigate('dashboard')} />
      )}
    </div>
  );
}