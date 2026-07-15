import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, ArrowLeft, Code2, Terminal } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const homeLink = isAdmin ? '/admin' : isAuthenticated ? '/home' : '/';

  // Theme-aware radial/linear background gradient
  const backgroundStyle = isDark
    ? 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 40%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.12), transparent 40%), linear-gradient(135deg, #0c0e1a 0%, #111325 50%, #0c0e1a 100%)'
    : 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.05), transparent 40%), linear-gradient(135deg, #f0f2fd 0%, #e8eaf8 100%)';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: backgroundStyle,
      padding: '24px',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease',
    }}>

      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isDark ? 0.04 : 0.25,
        backgroundImage: isDark
          ? 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)'
          : 'linear-gradient(rgba(79,92,239,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(79,92,239,0.15) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transition: 'opacity 0.3s ease',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)',
        filter: 'blur(80px)', top: '-100px', left: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        borderRadius: '50%',
        background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.03)',
        filter: 'blur(60px)', bottom: '-80px', right: '-80px', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '520px', width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-border)',
        borderRadius: '24px',
        padding: '48px 40px',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        boxShadow: 'var(--card-shadow)',
        transition: 'all 0.3s ease',
      }}>

        {/* Terminal icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))'
            : 'linear-gradient(135deg, rgba(79,92,239,0.1), rgba(37,99,235,0.1))',
          border: isDark ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(79,92,239,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: isDark ? '0 0 30px rgba(99,102,241,0.2)' : 'none',
        }}>
          <Terminal size={32} color={isDark ? '#a5b4fc' : 'var(--brand-violet)'} />
        </div>

        {/* 404 */}
        <div style={{
          fontSize: '96px', fontWeight: '900', lineHeight: '1',
          background: isDark
            ? 'linear-gradient(135deg, #a5b4fc, #60a5fa)'
            : 'linear-gradient(135deg, var(--brand-violet), var(--brand-blue))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-4px', marginBottom: '16px',
        }}>
          404
        </div>

        {/* Code-style error label */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px', padding: '6px 14px', marginBottom: '20px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
            ERROR: PAGE_NOT_FOUND
          </span>
        </div>

        <h1 style={{
          color: 'var(--text-primary)', fontSize: '22px', fontWeight: '700',
          margin: '0 0 10px', lineHeight: '1.3',
        }}>
          Looks like this page went missing
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7',
          margin: '0 0 32px',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Double-check the URL or head back to safety.
        </p>

        {/* Terminal snippet */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--bg-border)',
          borderRadius: '12px', padding: '16px 20px', marginBottom: '32px',
          textAlign: 'left', fontFamily: 'monospace',
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>$ codexa navigate --to &lt;url&gt;</div>
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>✗ Route not found: {window.location.pathname}</div>
          <div style={{ fontSize: '12px', color: 'var(--brand-violet)', marginTop: '4px' }}>→ Suggestion: try going home</div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to={homeLink}
            className="btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px', textDecoration: 'none'
            }}
          >
            <Home size={16} />
            Go Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px'
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* CODEXA branding */}
        <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Code2 size={14} color="var(--brand-violet)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            CODEXA
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Coding Club</span>
        </div>
      </div>
    </div>
  );
}
