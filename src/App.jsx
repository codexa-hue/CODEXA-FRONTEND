import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import { StudentRoute, AdminRoute } from './components/PrivateRoute';

import Landing        from './pages/Landing';
import MemberHome     from './pages/MemberHome';
import Login          from './pages/Login';
import AdminLogin     from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import Dashboard      from './pages/Dashboard';
import Leaderboard    from './pages/Leaderboard';
import Projects       from './pages/Projects';
import Resources      from './pages/Resources';
import AdminDashboard from './pages/AdminDashboard';
import Settings       from './pages/Settings';
import EventDetail        from './pages/EventDetail';
import AnnouncementDetail from './pages/AnnouncementDetail';
import MemberProfile      from './pages/MemberProfile';
import ProjectDetail      from './pages/ProjectDetail';
import SessionWarning     from './components/SessionWarning';
import NotFound           from './pages/NotFound';
import BackToTop          from './components/BackToTop';

import './App.css';

// Pages where sidebar is hidden — full-screen standalone pages
const NO_SIDEBAR = ['/', '/login', '/register', '/admin/login', '/forgot-password', '/reset-password'];

function Layout() {
  const location = useLocation();
  const hasSidebar = !NO_SIDEBAR.includes(location.pathname);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-root)' }}>
      <Sidebar />
      <SessionWarning />
      <BackToTop />

      {/* Main content — md:ml-56 offsets for the fixed 224px sidebar */}
      <div className={`flex-1 flex flex-col min-h-screen ${hasSidebar ? 'md:ml-[250px] pt-[58px] md:pt-0' : ''}`}>
        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            {/* ── Standalone (no sidebar) ── */}
            <Route path="/"                element={<Landing />} />
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Login />} />
            <Route path="/admin/login"     element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* ── With sidebar — students only ── */}
            <Route path="/home"        element={<StudentRoute><MemberHome /></StudentRoute>} />
            <Route path="/leaderboard" element={<StudentRoute><Leaderboard /></StudentRoute>} />
            <Route path="/projects"    element={<StudentRoute><Projects /></StudentRoute>} />
            <Route path="/dashboard"   element={<StudentRoute><Dashboard /></StudentRoute>} />
            <Route path="/resources"   element={<StudentRoute><Resources /></StudentRoute>} />
            <Route path="/settings"    element={<StudentRoute><Settings /></StudentRoute>} />
            <Route path="/events/:id"         element={<StudentRoute><EventDetail /></StudentRoute>} />
            <Route path="/announcements/:id"  element={<StudentRoute><AnnouncementDetail /></StudentRoute>} />
            <Route path="/members/:id"        element={<StudentRoute><MemberProfile /></StudentRoute>} />
            <Route path="/projects/:id"       element={<StudentRoute><ProjectDetail /></StudentRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* ── Redirects ── */}
            <Route path="/profile" element={<Navigate to="/settings" replace />} />
            <Route path="/apply"   element={<Navigate to="/register"  replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {hasSidebar && (
          <footer className="py-3 text-center text-xs border-t"
                  style={{ color: 'var(--text-muted)', borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-card)' }}>
            <span className="font-bold text-gradient">CODEXA</span>
            {' '}Coding Club &copy; {new Date().getFullYear()}
          </footer>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
