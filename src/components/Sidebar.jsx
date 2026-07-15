// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../services/api';
// import logo from '../assets/logo.png';
// import { useTheme } from '../context/ThemeContext';
// import {
//   Home, Trophy, Layers, BookOpen, BarChart2,
//   LogOut, Menu, X, Zap, Sun, Moon,
//   FileText, Users, Megaphone, Calendar, Settings,
// } from 'lucide-react';

// export default function Sidebar() {
//   const { isAuthenticated, isAdmin, profile, logout } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const [open, setOpen] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);

//   useEffect(() => {
//     if (!isAdmin) return;
//     api.joinRequests.getAll()
//       .then((data) => setPendingCount(data.filter(r => r.status === 'pending').length))
//       .catch(() => {});
//   }, [isAdmin, location.pathname, location.search]);

//   const hiddenPaths = ['/', '/login', '/register', '/admin/login', '/forgot-password', '/reset-password'];
//   if (hiddenPaths.includes(location.pathname)) return null;

//   const currentTab = new URLSearchParams(location.search).get('tab') || '';
//   const isActive = (p, tab) => {
//     if (tab) return location.pathname === p && currentTab === tab;
//     return location.pathname === p && !currentTab;
//   };

//   const handleLogout = () => { logout(); navigate('/'); };

//   const NavItem = ({ to, icon: Icon, label, tab, badge }) => {
//     const href   = tab ? `${to}?tab=${tab}` : to;
//     const active = isActive(to, tab || '');
//     return (
//       <Link to={href} onClick={() => setOpen(false)}
//         className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group relative"
//         style={{
//           backgroundColor: active ? 'var(--nav-active-bg)' : 'transparent',
//           color: active ? 'var(--nav-active-color)' : 'var(--text-secondary)',
//         }}
//         onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
//         onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
//       >
//         <Icon size={17} strokeWidth={active ? 2.5 : 2}
//           style={{ color: active ? 'var(--nav-active-color)' : 'var(--text-muted)' }} />
//         <span className="flex-1">{label}</span>
//         {badge ? (
//           <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center"
//                 style={{ background: 'var(--brand-amber)' }}>
//             {badge}
//           </span>
//         ) : null}
//       </Link>
//     );
//   };

//   const studentNav = [
//     { to: '/home',        icon: Home,      label: 'Home' },
//     { to: '/leaderboard', icon: Trophy,    label: 'Leaderboard' },
//     { to: '/projects',    icon: Layers,    label: 'Projects' },
//     { to: '/resources',   icon: BookOpen,  label: 'Resources' },
//     { to: '/dashboard',   icon: BarChart2, label: 'My Progress' },
//   ];

//   const adminNav = [
//     { to: '/admin', tab: 'requests',      icon: FileText,  label: 'Registrations', badge: pendingCount > 0 ? pendingCount : null },
//     { to: '/admin', tab: 'members',       icon: Users,     label: 'Members' },
//     { to: '/admin', tab: 'announcements', icon: Megaphone, label: 'Announcements' },
//     { to: '/admin', tab: 'events',        icon: Calendar,  label: 'Events' },
//     { to: '/admin', tab: 'resources',     icon: BookOpen,  label: 'Resources' },
//   ];

//   const navItems = isAdmin ? adminNav : studentNav;

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full py-5 px-4">

//       {/* ── Brand ── */}
//       <Link to={isAdmin ? '/admin?tab=requests' : '/home'} onClick={() => setOpen(false)}
//         className="flex items-center gap-2.5 mb-7 px-1">
//         <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
//              style={{ background: 'var(--gradient-brand)' }}>
//           <img src={logo} alt="CODEXA" className="w-7 h-7 object-cover" />
//         </div>
//         <div>
//           <div className="font-extrabold text-base leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
//             CODEXA
//           </div>
//           <div className="text-[10px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
//             {isAdmin ? 'Admin Portal' : 'Coding Club'}
//           </div>
//         </div>
//       </Link>

//       {/* ── Navigation ── */}
//       <div className="flex-1 space-y-0.5 overflow-y-auto">
//         {isAdmin && (
//           <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-2 pt-1"
//              style={{ color: 'var(--text-muted)' }}>
//             Management
//           </p>
//         )}
//         {navItems.map((item) => (
//           <NavItem key={item.tab || item.to} {...item} />
//         ))}
//       </div>

//       {/* ── Decorative circle (like screenshot) ── */}
//       <div className="my-4 flex justify-center pointer-events-none">
//         <div className="w-28 h-28 rounded-full opacity-[0.07]"
//              style={{ background: 'radial-gradient(circle, var(--brand-violet), transparent)' }} />
//       </div>

//       {/* ── User area ── */}
//       <div className="space-y-1 border-t pt-3" style={{ borderColor: 'var(--bg-sidebar-border)' }}>
//         {isAuthenticated ? (
//           <>
//             <Link to={isAdmin ? '/admin?tab=requests' : '/settings'} onClick={() => setOpen(false)}
//               className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group"
//               style={{ color: 'var(--text-secondary)' }}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
//               onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
//                    style={{ background: isAdmin ? 'linear-gradient(135deg,#f472b6,#e879a0)' : 'var(--gradient-brand)' }}>
//                 {profile?.name?.charAt(0)?.toUpperCase() || (isAdmin ? 'A' : 'U')}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
//                   {isAdmin ? 'Administrator' : (profile?.name?.split(' ')[0] || 'Account')}
//                 </div>
//                 <div className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>
//                   {isAdmin ? 'System Admin' : `${profile?.points ?? 0} pts`}
//                 </div>
//               </div>
//               {!isAdmin && <Settings size={13} style={{ color: 'var(--text-muted)', opacity: 0 }} className="group-hover:!opacity-100 transition-opacity" />}
//             </Link>

//             <button onClick={toggleTheme}
//               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
//               style={{ color: 'var(--text-muted)' }}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
//               onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               {theme === 'light'
//                 ? <><Moon size={15} style={{ color: 'var(--brand-violet)' }} /><span>Dark Mode</span></>
//                 : <><Sun size={15} style={{ color: 'var(--brand-amber)' }} /><span>Light Mode</span></>
//               }
//             </button>

//             <button onClick={handleLogout}
//               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
//               style={{ color: 'var(--text-muted)' }}
//               onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = 'var(--brand-red)'; }}
//               onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
//             >
//               <LogOut size={15} />
//               <span>Sign Out</span>
//             </button>
//           </>
//         ) : (
//           <div className="space-y-2 pt-1">
//             <Link to="/login" onClick={() => setOpen(false)}
//               className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold transition-all border"
//               style={{ color: 'var(--text-secondary)', borderColor: 'var(--bg-border)' }}>
//               Sign In
//             </Link>
//             <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
//               <Zap size={13} /> Apply to Join
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop sidebar — floating card style like screenshot */}
//       <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 z-40"
//              style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--bg-sidebar-border)' }}>
//         <SidebarContent />
//       </aside>

//       {/* Mobile topbar */}
//       <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-[52px] backdrop-blur-xl border-b"
//            style={{ backgroundColor: 'rgba(238,240,251,0.95)', borderColor: 'var(--bg-border)' }}>
//         <Link to="/home" className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg overflow-hidden" style={{ background: 'var(--gradient-brand)' }}>
//             <img src={logo} alt="CODEXA" className="w-full h-full object-cover" />
//           </div>
//           <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CODEXA</span>
//         </Link>
//         <button onClick={() => setOpen(!open)}
//           className="p-2 rounded-lg transition-all"
//           style={{ color: 'var(--text-secondary)' }}>
//           {open ? <X size={18} /> : <Menu size={18} />}
//         </button>
//       </div>

//       {open && (
//         <>
//           <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
//           <aside className="md:hidden fixed top-0 left-0 h-full w-60 z-50 animate-slide-up"
//                  style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--bg-sidebar-border)' }}>
//             <SidebarContent />
//           </aside>
//         </>
//       )}
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import { getFullUploadUrl } from "../utils/url";
import logo from "../assets/logo.png";

import {
  BarChart2,
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  Home,
  Layers,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";


/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar() {
  const {
    isAuthenticated,
    isAdmin,
    profile,
    logout,
  } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] =
    useState(0);


  /* =========================================================
     LOAD PENDING ADMIN REQUEST COUNT
  ========================================================= */

  useEffect(() => {
    if (!isAdmin) {
      setPendingCount(0);
      return;
    }

    api.joinRequests
      .getAll()
      .then((data) => {
        const pending = data.filter(
          (request) =>
            request.status === "pending"
        ).length;

        setPendingCount(pending);
      })
      .catch(() => {});
  }, [
    isAdmin,
    location.pathname,
    location.search,
  ]);


  /* =========================================================
     HIDE SIDEBAR
  ========================================================= */

  const hiddenPaths = [
    "/",
    "/login",
    "/register",
    "/admin/login",
    "/forgot-password",
    "/reset-password",
  ];

  if (
    hiddenPaths.includes(location.pathname)
  ) {
    return null;
  }


  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const currentTab =
    new URLSearchParams(
      location.search
    ).get("tab") || "";

  const isActive = (path, tab) => {
    if (tab) {
      return (
        location.pathname === path &&
        currentTab === tab
      );
    }

    return (
      location.pathname === path &&
      !currentTab
    );
  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const studentNav = [
    {
      to: "/home",
      icon: Home,
      label: "Home",
      description: "Club overview",
    },
    {
      to: "/leaderboard",
      icon: Trophy,
      label: "Leaderboard",
      description: "Club rankings",
    },
    {
      to: "/projects",
      icon: Layers,
      label: "Projects",
      description: "Build together",
    },
    {
      to: "/resources",
      icon: BookOpen,
      label: "Resources",
      description: "Learning library",
    },
    {
      to: "/dashboard",
      icon: BarChart2,
      label: "My Progress",
      description: "Growth analytics",
    },
  ];

  const adminNav = [
    {
      to: "/admin",
      tab: "requests",
      icon: FileText,
      label: "Registrations",
      description: "Review applications",
      badge:
        pendingCount > 0
          ? pendingCount
          : null,
    },
    {
      to: "/admin",
      tab: "members",
      icon: Users,
      label: "Members",
      description: "Manage community",
    },
    {
      to: "/admin",
      tab: "announcements",
      icon: Megaphone,
      label: "Announcements",
      description: "Publish updates",
    },
    {
      to: "/admin",
      tab: "events",
      icon: Calendar,
      label: "Events",
      description: "Manage schedule",
    },
    {
      to: "/admin",
      tab: "resources",
      icon: BookOpen,
      label: "Resources",
      description: "Manage library",
    },
    {
      to: "/admin",
      tab: "challenges",
      icon: Trophy,
      label: "Challenges",
      description: "Manage prompts",
    },
  ];

  const navItems = isAdmin
    ? adminNav
    : studentNav;


  /* =========================================================
     NAV ITEM
  ========================================================= */

  const NavItem = ({
    to,
    icon: Icon,
    label,
    description,
    tab,
    badge,
  }) => {
    const href = tab
      ? `${to}?tab=${tab}`
      : to;

    const active = isActive(
      to,
      tab || ""
    );

    return (
      <Link
        to={href}
        onClick={() => setOpen(false)}
        className={`codexa-nav-item ${
          active ? "active" : ""
        }`}
      >
        <span className="codexa-nav-icon">
          <Icon
            size={18}
            strokeWidth={
              active ? 2.4 : 2
            }
          />
        </span>

        <span className="codexa-nav-copy">
          <strong>{label}</strong>
          <small>{description}</small>
        </span>

        {badge ? (
          <span className="codexa-nav-badge">
            {badge}
          </span>
        ) : (
          <ChevronRight
            size={14}
            className="codexa-nav-arrow"
          />
        )}
      </Link>
    );
  };


  /* =========================================================
     SIDEBAR CONTENT
  ========================================================= */

  const SidebarContent = () => {
    const firstName =
      profile?.name?.split(" ")[0] ||
      "Account";

    const initials = profile?.name
      ? profile.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : isAdmin
      ? "AD"
      : "U";

    return (
      <div className="codexa-sidebar-content">

        {/* BRAND */}

        <div className="codexa-sidebar-brand-area">
          <Link
            to={
              isAdmin
                ? "/admin?tab=requests"
                : "/home"
            }
            onClick={() => setOpen(false)}
            className="codexa-sidebar-brand"
          >
            <div className="codexa-logo-box">
              <img
                src={logo}
                alt="CODEXA"
              />
            </div>

            <div className="codexa-brand-copy">
              <strong>CODEXA</strong>

              <span>
                {isAdmin
                  ? "Admin Workspace"
                  : "Developer Club"}
              </span>
            </div>
          </Link>

          <div
            className={`codexa-portal-badge ${
              isAdmin ? "admin" : ""
            }`}
          >
            <span />

            {isAdmin
              ? "ADMIN PORTAL"
              : "STUDENT PORTAL"}
          </div>
        </div>


        {/* NAVIGATION */}

        <nav className="codexa-sidebar-navigation">
          <div className="codexa-nav-heading">
            <span>
              {isAdmin
                ? "MANAGEMENT"
                : "WORKSPACE"}
            </span>

            <small>
              {navItems.length}
            </small>
          </div>

          <div className="codexa-nav-list">
            {navItems.map((item) => (
              <NavItem
                key={
                  item.tab || item.to
                }
                {...item}
              />
            ))}
          </div>
        </nav>


        {/* UPGRADE / PROGRESS CARD */}

        {!isAdmin && (
          <div className="codexa-momentum-card">
            <div className="momentum-glow" />

            <div className="momentum-icon">
              <Sparkles size={16} />
            </div>

            <span>
              YOUR MOMENTUM
            </span>

            <strong>
              {profile?.points ?? 0} points
            </strong>

            <p>
              Keep contributing to climb the
              club leaderboard.
            </p>

            <Link
              to="/dashboard"
              onClick={() =>
                setOpen(false)
              }
            >
              View progress
              <ChevronRight size={13} />
            </Link>
          </div>
        )}


        {/* ADMIN STATUS */}

        {isAdmin && (
          <div className="codexa-admin-status">
            <div className="admin-status-top">
              <span className="admin-live-dot" />

              <strong>
                System operational
              </strong>
            </div>

            <p>
              {pendingCount > 0
                ? `${pendingCount} registration ${
                    pendingCount === 1
                      ? "request"
                      : "requests"
                  } need attention.`
                : "No pending registration requests."}
            </p>
          </div>
        )}


        {/* USER SECTION */}

        <div className="codexa-sidebar-bottom">

          {isAuthenticated ? (
            <>
              <Link
                to={
                  isAdmin
                    ? "/admin?tab=profile"
                    : "/settings"
                }
                onClick={() =>
                  setOpen(false)
                }
                className="codexa-user-card"
              >
                <div
                  className={`codexa-user-avatar ${
                    isAdmin ? "admin" : ""
                  }`}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={getFullUploadUrl(profile.avatar_url)}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    initials
                  )}

                  <span />
                </div>

                <div className="codexa-user-copy">
                  <strong>
                    {isAdmin
                      ? (profile?.name || 'Administrator')
                      : firstName}
                  </strong>

                  <span>
                    {isAdmin
                      ? "System administrator"
                      : `${
                          profile?.points ??
                          0
                        } points earned`}
                  </span>
                </div>

                <Settings
                  size={15}
                  className="codexa-user-settings"
                />
              </Link>


              <div className="codexa-bottom-actions">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="codexa-action-button"
                  title={
                    theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                  }
                >
                  {theme === "light" ? (
                    <Moon size={17} />
                  ) : (
                    <Sun size={17} />
                  )}

                  <span>
                    {theme === "light"
                      ? "Dark mode"
                      : "Light mode"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="codexa-action-button logout"
                >
                  <LogOut size={17} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="codexa-guest-actions">
              <Link
                to="/login"
                onClick={() =>
                  setOpen(false)
                }
                className="codexa-signin-button"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() =>
                  setOpen(false)
                }
                className="codexa-join-button"
              >
                <Zap size={14} />
                Apply to Join
              </Link>
            </div>
          )}

          <div className="codexa-sidebar-version">
            <span>
              CODEXA PLATFORM
            </span>

            <small>v1.0</small>
          </div>
        </div>
      </div>
    );
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* DESKTOP SIDEBAR */}

      <aside className="codexa-desktop-sidebar">
        <SidebarContent />
      </aside>


      {/* MOBILE HEADER */}

      <header className="codexa-mobile-header">
        <Link
          to={
            isAdmin
              ? "/admin?tab=requests"
              : "/home"
          }
          className="codexa-mobile-brand"
        >
          <div>
            <img
              src={logo}
              alt="CODEXA"
            />
          </div>

          <span>CODEXA</span>
        </Link>

        <div className="codexa-mobile-actions">
          <span
            className={`mobile-portal-label ${
              isAdmin ? "admin" : ""
            }`}
          >
            {isAdmin
              ? "Admin"
              : "Student"}
          </span>

          <button
            type="button"
            onClick={() =>
              setOpen(!open)
            }
            className="codexa-mobile-menu"
          >
            {open ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>
      </header>


      {/* MOBILE OVERLAY */}

      {open && (
        <div
          className="codexa-mobile-overlay"
          onClick={() =>
            setOpen(false)
          }
        />
      )}


      {/* MOBILE SIDEBAR */}

      <aside
        className={`codexa-mobile-sidebar ${
          open ? "open" : ""
        }`}
      >
        <SidebarContent />
      </aside>


      {/* STYLES */}

      <style>{`

        /* ===================================================
           DESKTOP SIDEBAR
        =================================================== */

        .codexa-desktop-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          width: 250px;
          height: 100vh;
          border-right:
            1px solid
            var(--bg-sidebar-border);
          background:
            var(--bg-sidebar);
          box-shadow:
            10px 0 40px
            rgba(25, 30, 70, 0.025);
        }

        .codexa-sidebar-content {
          height: 100%;
          padding: 22px 16px 16px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
        }


        /* ===================================================
           BRAND
        =================================================== */

        .codexa-sidebar-brand-area {
          padding: 0 4px 22px;
          border-bottom:
            1px solid
            var(--bg-sidebar-border);
        }

        .codexa-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: inherit;
          text-decoration: none;
        }

        .codexa-logo-box {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 12px;
          background:
            var(--gradient-brand);
          box-shadow:
            0 8px 20px
            rgba(99, 91, 255, 0.2);
        }

        .codexa-logo-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .codexa-brand-copy {
          min-width: 0;
          flex: 1;
        }

        .codexa-brand-copy strong {
          display: block;
          color:
            var(--text-primary);
          font-family:
            "Plus Jakarta Sans",
            sans-serif;
          font-size: 16px;
          line-height: 1;
          letter-spacing: -0.02em;
          font-weight: 900;
        }

        .codexa-brand-copy span {
          display: block;
          margin-top: 5px;
          color:
            var(--text-muted);
          font-size: 9px;
          font-weight: 600;
        }

        .codexa-portal-badge {
          width: fit-content;
          margin-top: 16px;
          padding: 6px 9px;
          display: flex;
          align-items: center;
          gap: 7px;
          border:
            1px solid
            rgba(99, 91, 255, 0.12);
          border-radius: 999px;
          color: #635bff;
          background:
            rgba(99, 91, 255, 0.07);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .codexa-portal-badge > span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #635bff;
          box-shadow:
            0 0 0 4px
            rgba(99, 91, 255, 0.1);
        }

        .codexa-portal-badge.admin {
          color: #db4f91;
          border-color:
            rgba(219, 79, 145, 0.15);
          background:
            rgba(219, 79, 145, 0.07);
        }

        .codexa-portal-badge.admin > span {
          background: #db4f91;
          box-shadow:
            0 0 0 4px
            rgba(219, 79, 145, 0.1);
        }


        /* ===================================================
           NAVIGATION
        =================================================== */

        .codexa-sidebar-navigation {
          padding-top: 22px;
        }

        .codexa-nav-heading {
          padding: 0 9px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .codexa-nav-heading span {
          color:
            var(--text-muted);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .codexa-nav-heading small {
          min-width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color:
            var(--text-muted);
          background:
            var(--bg-elevated);
          font-size: 8px;
          font-weight: 800;
        }

        .codexa-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .codexa-nav-item {
          position: relative;
          min-height: 54px;
          padding: 8px 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          border:
            1px solid transparent;
          border-radius: 13px;
          color:
            var(--text-secondary);
          text-decoration: none;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .codexa-nav-item:hover {
          background:
            var(--bg-elevated);
          transform:
            translateX(2px);
        }

        .codexa-nav-item.active {
          border-color:
            rgba(99, 91, 255, 0.12);
          background:
            linear-gradient(
              90deg,
              rgba(99, 91, 255, 0.12),
              rgba(99, 91, 255, 0.04)
            );
        }

        .codexa-nav-item.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          border-radius:
            0 4px 4px 0;
          background:
            var(--gradient-brand);
        }

        .codexa-nav-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          color:
            var(--text-muted);
          background:
            transparent;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .codexa-nav-item.active
        .codexa-nav-icon {
          color: #635bff;
          background:
            rgba(99, 91, 255, 0.1);
        }

        .codexa-nav-copy {
          min-width: 0;
          flex: 1;
        }

        .codexa-nav-copy strong {
          display: block;
          overflow: hidden;
          color:
            var(--text-secondary);
          font-size: 11px;
          line-height: 1.2;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .codexa-nav-item.active
        .codexa-nav-copy strong {
          color:
            var(--text-primary);
        }

        .codexa-nav-copy small {
          display: block;
          margin-top: 3px;
          overflow: hidden;
          color:
            var(--text-muted);
          font-size: 8px;
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .codexa-nav-arrow {
          flex-shrink: 0;
          color:
            var(--text-muted);
          opacity: 0;
          transform:
            translateX(-4px);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .codexa-nav-item:hover
        .codexa-nav-arrow,
        .codexa-nav-item.active
        .codexa-nav-arrow {
          opacity: 1;
          transform:
            translateX(0);
        }

        .codexa-nav-badge {
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #f59e0b,
              #f97316
            );
          font-size: 8px;
          font-weight: 900;
          box-shadow:
            0 5px 12px
            rgba(245, 158, 11, 0.2);
        }


        /* ===================================================
           MOMENTUM CARD
        =================================================== */

        .codexa-momentum-card {
          position: relative;
          margin-top: auto;
          padding: 16px;
          overflow: hidden;
          border:
            1px solid
            rgba(99, 91, 255, 0.12);
          border-radius: 15px;
          background:
            linear-gradient(
              145deg,
              rgba(99, 91, 255, 0.1),
              rgba(139, 92, 246, 0.04)
            );
        }

        .momentum-glow {
          position: absolute;
          right: -45px;
          top: -45px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background:
            rgba(99, 91, 255, 0.15);
          filter: blur(15px);
        }

        .momentum-icon {
          position: relative;
          width: 32px;
          height: 32px;
          margin-bottom: 12px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #635bff;
          background:
            rgba(99, 91, 255, 0.12);
        }

        .codexa-momentum-card > span {
          position: relative;
          display: block;
          color: #7770e9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .codexa-momentum-card > strong {
          position: relative;
          display: block;
          margin: 5px 0;
          color:
            var(--text-primary);
          font-size: 16px;
          letter-spacing: -0.03em;
        }

        .codexa-momentum-card > p {
          position: relative;
          margin: 0 0 11px;
          color:
            var(--text-muted);
          font-size: 8px;
          line-height: 1.5;
        }

        .codexa-momentum-card > a {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #635bff;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }


        /* ===================================================
           ADMIN STATUS
        =================================================== */

        .codexa-admin-status {
          margin-top: auto;
          padding: 14px;
          border:
            1px solid
            rgba(34, 197, 94, 0.13);
          border-radius: 14px;
          background:
            rgba(34, 197, 94, 0.05);
        }

        .admin-status-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 0 4px
            rgba(34, 197, 94, 0.1);
        }

        .admin-status-top strong {
          color:
            var(--text-primary);
          font-size: 9px;
        }

        .codexa-admin-status p {
          margin: 8px 0 0;
          color:
            var(--text-muted);
          font-size: 8px;
          line-height: 1.5;
        }


        /* ===================================================
           USER AREA
        =================================================== */

        .codexa-sidebar-bottom {
          padding-top: 14px;
        }

        .codexa-user-card {
          padding: 9px;
          display: flex;
          align-items: center;
          gap: 9px;
          border:
            1px solid
            var(--bg-sidebar-border);
          border-radius: 13px;
          color: inherit;
          background:
            var(--bg-elevated);
          text-decoration: none;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .codexa-user-card:hover {
          border-color:
            rgba(99, 91, 255, 0.2);
          transform:
            translateY(-1px);
        }

        .codexa-user-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: white;
          background:
            var(--gradient-brand);
          font-size: 10px;
          font-weight: 900;
        }

        .codexa-user-avatar.admin {
          background:
            linear-gradient(
              135deg,
              #db4f91,
              #f472b6
            );
        }

        .codexa-user-avatar > span {
          position: absolute;
          right: -2px;
          bottom: -2px;
          width: 10px;
          height: 10px;
          border:
            2px solid
            var(--bg-elevated);
          border-radius: 50%;
          background: #22c55e;
        }

        .codexa-user-copy {
          min-width: 0;
          flex: 1;
        }

        .codexa-user-copy strong {
          display: block;
          overflow: hidden;
          color:
            var(--text-primary);
          font-size: 10px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .codexa-user-copy span {
          display: block;
          margin-top: 3px;
          overflow: hidden;
          color:
            var(--text-muted);
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .codexa-user-settings {
          flex-shrink: 0;
          color:
            var(--text-muted);
          opacity: 0;
          transition:
            opacity 0.2s ease;
        }

        .codexa-user-card:hover
        .codexa-user-settings {
          opacity: 1;
        }


        /* ===================================================
           BOTTOM ACTIONS
        =================================================== */

        .codexa-bottom-actions {
          margin-top: 7px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
        }

        .codexa-action-button {
          min-height: 37px;
          padding: 0 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 0;
          border-radius: 10px;
          color:
            var(--text-muted);
          background: transparent;
          font-size: 8px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .codexa-action-button:hover {
          color: #635bff;
          background:
            rgba(99, 91, 255, 0.07);
        }

        .codexa-action-button.logout:hover {
          color: #ef4444;
          background:
            rgba(239, 68, 68, 0.07);
        }


        /* ===================================================
           VERSION
        =================================================== */

        .codexa-sidebar-version {
          margin-top: 9px;
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color:
            var(--text-muted);
        }

        .codexa-sidebar-version span {
          font-size: 6px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .codexa-sidebar-version small {
          font-size: 7px;
        }


        /* ===================================================
           GUEST ACTIONS
        =================================================== */

        .codexa-guest-actions {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .codexa-signin-button,
        .codexa-join-button {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .codexa-signin-button {
          border:
            1px solid
            var(--bg-sidebar-border);
          color:
            var(--text-secondary);
        }

        .codexa-join-button {
          color: white;
          background:
            var(--gradient-brand);
        }


        /* ===================================================
           MOBILE HEADER
        =================================================== */

        .codexa-mobile-header {
          display: none;
        }

        .codexa-mobile-sidebar {
          display: none;
        }

        .codexa-mobile-overlay {
          display: none;
        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 767px) {

          .codexa-desktop-sidebar {
            display: none;
          }

          .codexa-mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 70;
            height: 58px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom:
              1px solid
              var(--bg-sidebar-border);
            background:
              var(--bg-sidebar);
            box-shadow:
              0 8px 25px
              rgba(20, 25, 60, 0.05);
          }

          .codexa-mobile-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            color:
              var(--text-primary);
            text-decoration: none;
          }

          .codexa-mobile-brand > div {
            width: 32px;
            height: 32px;
            overflow: hidden;
            border-radius: 9px;
            background:
              var(--gradient-brand);
          }

          .codexa-mobile-brand img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .codexa-mobile-brand span {
            font-family:
              "Plus Jakarta Sans",
              sans-serif;
            font-size: 13px;
            font-weight: 900;
          }

          .codexa-mobile-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-portal-label {
            padding: 5px 8px;
            border-radius: 999px;
            color: #635bff;
            background:
              rgba(99, 91, 255, 0.08);
            font-size: 7px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .mobile-portal-label.admin {
            color: #db4f91;
            background:
              rgba(219, 79, 145, 0.08);
          }

          .codexa-mobile-menu {
            width: 36px;
            height: 36px;
            display: grid;
            place-items: center;
            border:
              1px solid
              var(--bg-sidebar-border);
            border-radius: 10px;
            color:
              var(--text-secondary);
            background:
              var(--bg-elevated);
            cursor: pointer;
          }

          .codexa-mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 75;
            display: block;
            background:
              rgba(10, 13, 28, 0.48);
            backdrop-filter: blur(4px);
          }

          .codexa-mobile-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 80;
            width: min(280px, 86vw);
            height: 100vh;
            display: block;
            border-right:
              1px solid
              var(--bg-sidebar-border);
            background:
              var(--bg-sidebar);
            box-shadow:
              25px 0 60px
              rgba(10, 13, 28, 0.18);
            transform:
              translateX(-105%);
            transition:
              transform 0.28s ease;
          }

          .codexa-mobile-sidebar.open {
            transform:
              translateX(0);
          }

        }

      `}</style>
    </>
  );
}