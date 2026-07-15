import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog — reusable styled confirmation modal.
 *
 * Props:
 *   open        {bool}     — whether the dialog is visible
 *   title       {string}   — dialog title
 *   message     {string}   — body text
 *   confirmText {string}   — confirm button label (default: "Delete")
 *   cancelText  {string}   — cancel button label (default: "Cancel")
 *   variant     {string}   — "danger" | "warning" (default: "danger")
 *   onConfirm   {fn}       — called when user confirms
 *   onCancel    {fn}       — called when user cancels or clicks backdrop
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Trap Escape key to cancel
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger  = variant === 'danger';
  const accentHex = isDanger ? '#ef4444' : '#f59e0b';
  const bgTint    = isDanger ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)';
  const borderTint = isDanger ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.22)';
  const btnBg      = isDanger ? '#ef4444' : '#f59e0b';
  const btnHover   = isDanger ? '#dc2626' : '#d97706';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          animation: 'cd-fade-in 0.15s ease',
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cd-title"
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-card, #1e1e2e)',
            border: `1px solid ${borderTint}`,
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '400px', width: '100%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            animation: 'cd-slide-up 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: bgTint, border: `1px solid ${borderTint}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '18px',
          }}>
            <AlertTriangle size={24} color={accentHex} />
          </div>

          {/* Title */}
          <h2
            id="cd-title"
            style={{
              margin: '0 0 8px',
              color: 'var(--text-primary, #f1f5f9)',
              fontSize: '17px', fontWeight: '700',
              fontFamily: 'inherit',
            }}
          >
            {title}
          </h2>

          {/* Message */}
          <p style={{
            margin: '0 0 24px',
            color: 'var(--text-muted, #94a3b8)',
            fontSize: '14px', lineHeight: '1.65',
          }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px', borderRadius: '12px',
                border: '1px solid var(--bg-border, rgba(255,255,255,0.1))',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px', borderRadius: '12px',
                border: 'none', cursor: 'pointer',
                background: btnBg, color: '#fff',
                fontSize: '14px', fontWeight: '700', fontFamily: 'inherit',
                transition: 'all 0.15s',
                boxShadow: `0 4px 14px ${accentHex}40`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = btnHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = btnBg; }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cd-fade-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cd-slide-up { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </>
  );
}
