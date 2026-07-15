import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * BackToTop — floating scroll-to-top button.
 * Appears after scrolling down 300px. Smooth scroll back to top on click.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          border: '1px solid rgba(99,102,241,0.3)',
          background: 'var(--bg-card, #1e1e2e)',
          color: 'var(--text-accent, #a5b4fc)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.1)',
          transition: 'opacity 0.25s, transform 0.25s, box-shadow 0.2s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.3)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.1)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
          e.currentTarget.style.background = 'var(--bg-card, #1e1e2e)';
        }}
      >
        <ChevronUp size={20} />
      </button>
    </>
  );
}
