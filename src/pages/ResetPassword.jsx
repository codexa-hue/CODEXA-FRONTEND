import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle, AlertCircle, Code2 } from 'lucide-react';
import PasswordStrength from '../components/PasswordStrength';

export default function ResetPassword() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const API_BASE  = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

  // Where to go back after success — passed from ForgotPassword page
  const backTo = location.state?.from || '/login';

  // Pre-fill email if coming from ForgotPassword page
  const [email, setEmail]       = useState(location.state?.email || new URLSearchParams(location.search).get('email') || '');
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [newPw, setNewPw]       = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [step, setStep]         = useState(1);

  const handleNextStep = async (e) => {
    e.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length < 6) {
      setError('Enter the full 6-digit OTP.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'OTP verification failed.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const otpRefs = useRef([]);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;      // digits only
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setError('Enter the full 6-digit OTP.'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpStr, new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to reset password.');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-saas-standalone">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-brand-emerald" />
          </div>
          <h1 className="font-display font-black text-xl text-text-primary mb-2">Password Reset!</h1>
          <p className="text-text-secondary text-sm mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button onClick={() => navigate(backTo)} className="btn-primary w-full justify-center">
            Go to Sign In
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
          <h1 className="font-display font-black text-2xl text-text-primary mb-1">Reset Password</h1>
          <p className="text-text-muted text-sm">
            {step === 1 
              ? "Enter the 6-digit OTP sent to your email and continue." 
              : "Choose a secure new password for your account."}
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="flex items-start gap-2.5 bg-brand-red/10 border border-brand-red/25 text-brand-red p-3.5 rounded-xl text-sm mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                {/* Email — editable in case they came directly */}
                {!location.state?.email && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                      Your Email
                    </label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" className="input-field" />
                  </div>
                )}

                {/* OTP boxes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                    6-Digit OTP
                  </label>
                  <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-black font-mono rounded-xl border border-bg-border bg-bg-primary text-text-primary outline-none focus:border-brand-violet focus:shadow-glow-sm transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button type="button" onClick={handleNextStep} className="btn-primary w-full py-3 mt-2">
                  Continue
                </button>
              </>
            ) : (
              <>
                 {/* New password */}
                 <div className="space-y-1.5">
                   <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                     New Password
                   </label>
                   <div className="relative">
                     <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                     <input type="password" required minLength={6} value={newPw}
                       onChange={(e) => setNewPw(e.target.value)}
                       placeholder="min. 6 characters" className="input-field pl-10" />
                   </div>
                   <PasswordStrength password={newPw} />
                 </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="password" required value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="repeat password" className="input-field pl-10" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-[2] py-3">
                    {loading ? <div className="w-5 h-5 spinner animate-spin" /> : 'Reset Password'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="text-center mt-5 space-y-2">
          <Link to="/forgot-password" state={{ from: backTo }} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            Didn't receive the OTP? Request a new one →
          </Link>
          <br />
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
