import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2, LogOut, LayoutDashboard, Trophy, Layers,
  BookOpen, Menu, X, Zap, BarChart2, Home, ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (p) => location.pathname === p;

  // Hide navbar on standalone pages — landing, auth utilities
  const hiddenPaths = ['/', '/admin/login', '/forgot-password', '/reset-password'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(to)
        ? 'bg-brand-violet/20 text-text-accent border border-brand-violet/30'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
    }`}>
      {Icon && <Icon size={15} />}{label}
    </Link>
  );

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-bg-primary backdrop-blur-xl border-b border-bg-border shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Brand → always goes to /home (the live club feed) */}
          <Link to="/home" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient tracking-tight">CODEXA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* /home always visible for everyone */}
            <NavLink to="/home"        icon={Home}   label="Home" />
            <NavLink to="/leaderboard" icon={Trophy} label="Leaderboard" />
            <NavLink to="/projects"    icon={Layers} label="Projects" />

            {/* Member-only links */}
            {isAuthenticated && !isAdmin && (
              <>
                <NavLink to="/resources" icon={BookOpen}  label="Resources" />
                <NavLink to="/dashboard" icon={BarChart2} label="My Progress" />
              </>
            )}

            {/* Admin shortcut */}
            {isAuthenticated && isAdmin && (
              <NavLink to="/admin" icon={ShieldCheck} label="Admin Panel" />
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Profile chip → goes to personal portal */}
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-bg-card border border-bg-border hover:border-brand-violet/40 transition-all"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0 ${
                    isAdmin ? 'bg-brand-pink' : 'bg-gradient-brand'
                  }`}>
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-text-primary leading-tight flex items-center gap-1">
                      {profile?.name?.split(' ')[0] || 'Me'}
                      {isAdmin && <span className="text-[9px] text-brand-pink font-bold">(Admin)</span>}
                    </div>
                    <div className="text-text-muted leading-tight">{profile?.points ?? 0} pts</div>
                  </div>
                </Link>
                <button onClick={handleLogout} title="Logout"
                  className="p-2 rounded-xl text-text-muted hover:text-brand-red hover:bg-brand-red/10 transition-all">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm gap-1.5">
                  <Zap size={14} /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-bg-border bg-bg-primary backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
          <NavLink to="/home"        icon={Home}   label="Home" />
          <NavLink to="/leaderboard" icon={Trophy} label="Leaderboard" />
          <NavLink to="/projects"    icon={Layers} label="Projects" />

          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/resources" icon={BookOpen}  label="Resources" />
              <NavLink to="/dashboard" icon={BarChart2} label="My Progress" />
            </>
          )}
          {isAuthenticated && isAdmin && (
            <NavLink to="/admin" icon={ShieldCheck} label="Admin Panel" />
          )}

          <div className="pt-3 border-t border-bg-border mt-3 space-y-1">
            {isAuthenticated ? (
              <button onClick={handleLogout}
                className="w-full flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-brand-red hover:bg-brand-red/10 transition-all">
                <LogOut size={15} /> Log Out
              </button>
            ) : (
              <>
                <NavLink to="/login" label="Sign In" />
                <Link to="/register" className="btn-primary w-full mt-2 justify-center">
                  <Zap size={14} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
