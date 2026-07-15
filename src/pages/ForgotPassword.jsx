import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle, Code2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const location              = useLocation();
  const backTo                = location.state?.from || '/login';
  const API_BASE              = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Something went wrong.');
      }
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-saas-standalone">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-brand-emerald" />
          </div>
          <h1 className="font-display font-black text-xl text-text-primary mb-2">Check Your Email</h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            If <strong className="text-text-primary">{email}</strong> is registered, we've sent a
            6-digit OTP to that address. It expires in 15 minutes.
          </p>
          <button
            onClick={() => navigate('/reset-password', { state: { email, from: backTo } })}
            className="btn-primary w-full justify-center mb-3"
          >
            Enter OTP & Reset Password
          </button>
          <button onClick={() => setSent(false)} className="btn-secondary w-full justify-center text-sm">
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-saas-standalone">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-violet">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">CODEXA</span>
          </Link>
          <h1 className="font-display font-black text-2xl text-text-primary mb-1">Forgot Password?</h1>
          <p className="text-text-muted text-sm">
            Enter your registered email and we'll send you a one-time password reset code.
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="flex items-start gap-2.5 bg-brand-red/10 border border-brand-red/25 text-brand-red p-3.5 rounded-xl text-sm mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Registered Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <div className="w-5 h-5 spinner" /> : <><Send size={15} /> Send Reset OTP</>}
            </button>
          </form>
        </div>

        <div className="text-center mt-5">
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
