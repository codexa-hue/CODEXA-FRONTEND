import React from 'react';

/**
 * Skeleton — reusable layout placeholders with shimmer animation.
 */
export function Skeleton({ width = '100%', height = '16px', borderRadius = '4px', className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.05)',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer-anim 1.6s infinite linear',
        ...style
      }}
    />
  );
}

/**
 * CardSkeleton — skeleton matching card details.
 */
export function CardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg-card, #1e1e2e)',
      border: '1px solid var(--bg-border, rgba(255,255,255,0.08))',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="40px" height="16px" borderRadius="6px" />
        <div style={{ display: 'flex', gap: '8px' }}>
          <Skeleton width="20px" height="20px" borderRadius="6px" />
          <Skeleton width="20px" height="20px" borderRadius="6px" />
        </div>
      </div>
      
      <Skeleton width="32px" height="32px" borderRadius="10px" style={{ marginTop: '4px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Skeleton width="70%" height="20px" borderRadius="6px" />
        <Skeleton width="100%" height="14px" borderRadius="4px" />
        <Skeleton width="85%" height="14px" borderRadius="4px" />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Skeleton width="24px" height="24px" borderRadius="999px" />
          <Skeleton width="24px" height="24px" borderRadius="999px" />
        </div>
        <Skeleton width="48px" height="14px" borderRadius="4px" />
      </div>
    </div>
  );
}

// Add animation styles globally via a style block (injected once)
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-animation-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = `
      @keyframes skeleton-shimmer-anim {
        0% { background-position: 120% 0; }
        100% { background-position: -80% 0; }
      }
    `;
    document.head.appendChild(styleEl);
  }
}
