import React from 'react';

export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Safe fallback to 1
  const finalScore = Math.max(1, score);

  const strengthMap = {
    1: { label: 'Too Weak', color: '#ef4444' }, // Red
    2: { label: 'Weak', color: '#f97316' },     // Orange
    3: { label: 'Fair', color: '#eab308' },     // Yellow
    4: { label: 'Good', color: '#3b82f6' },     // Blue
    5: { label: 'Strong', color: '#10b981' },   // Green
  };

  const strength = strengthMap[finalScore] || strengthMap[1];

  return (
    <div style={{ marginTop: '10px', fontFamily: 'inherit' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          color: 'var(--text-muted, #8a90aa)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          Security Level
        </span>
        <span style={{
          fontSize: '11px',
          fontWeight: '800',
          color: strength.color,
          transition: 'color 0.2s ease'
        }}>
          {strength.label}
        </span>
      </div>

      {/* Segmented Progress Indicator */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = index <= finalScore;
          return (
            <div
              key={index}
              style={{
                height: '4px',
                flex: 1,
                borderRadius: '2px',
                background: isActive ? strength.color : 'rgba(255, 255, 255, 0.07)',
                transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
