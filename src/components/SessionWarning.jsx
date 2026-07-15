import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

const WARNING_BEFORE_MS = 5 * 60 * 1000; // warn 5 min before expiry

export default function SessionWarning() {
  const { token, logout, isAdmin, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null); // seconds remaining
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    const success = await refreshSession();
    setRefreshing(false);
    if (success) {
      setShow(false);
      setDismissed(false);
    } else {
      logout();
      navigate(isAdmin ? '/admin/login' : '/login');
    }
  };

  const parseExpiry = useCallback(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch { return null; }
  }, [token]);

  useEffect(() => {
    if (!token) { setShow(false); return; }
    setDismissed(false); // reset dismiss when token changes

    const interval = setInterval(() => {
      const expiry = parseExpiry();
      if (!expiry) return;
      const remaining = expiry - Date.now();

      if (remaining <= 0) {
        logout();
        navigate(isAdmin ? '/admin/login' : '/login');
        clearInterval(interval);
        return;
      }

      setTimeLeft(Math.floor(remaining / 1000));

      if (remaining <= WARNING_BEFORE_MS && !dismissed) {
        setShow(true);
      } else if (remaining > WARNING_BEFORE_MS) {
        setShow(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token, dismissed, parseExpiry]);

  if (!show || dismissed) return null;

  const mins = Math.floor((timeLeft || 0) / 60);
  const secs = (timeLeft || 0) % 60;
  const isUrgent = (timeLeft || 0) < 60;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm mx-auto px-4`}>
      <div className={`rounded-2xl p-4 shadow-2xl border animate-slide-up flex flex-col gap-3 ${
        isUrgent
          ? 'bg-brand-red/10 border-brand-red/30'
          : 'bg-bg-card border-brand-amber/30'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isUrgent ? 'bg-brand-red/15' : 'bg-brand-amber/15'
          }`}>
            <Clock size={18} className={isUrgent ? 'text-brand-red' : 'text-brand-amber'} />
          </div>
          <div className="flex-1">
            <div className={`font-bold text-sm ${isUrgent ? 'text-brand-red' : 'text-text-primary'}`}>
              {isUrgent ? 'Session expiring!' : 'Session expiring soon'}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {mins > 0
                ? `Your session expires in ${mins}m ${secs}s`
                : `Your session expires in ${secs}s`
              }
            </div>
          </div>
          <button onClick={() => setDismissed(true)}
            className="text-text-muted hover:text-text-primary text-lg leading-none px-1">×</button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-brand-violet/15 border border-brand-violet/30 text-brand-violet hover:bg-brand-violet/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> 
            {refreshing ? "Refreshing..." : "Refresh Session"}
          </button>
          <button onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-text-muted border border-bg-border hover:text-brand-red hover:border-brand-red/30 hover:bg-brand-red/5 transition-all">
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
