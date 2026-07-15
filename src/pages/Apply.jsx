import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function Apply() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('1st Year');
  const [joiningYear, setJoiningYear] = useState(new Date().getFullYear());
  const [skillsStr, setSkillsStr] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    try {
      await api.joinRequests.submit({
        name,
        email,
        year,
        joining_year: parseInt(joiningYear),
        skills,
        reason_to_join: reason,
        password,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-saas-standalone">
        <div className="w-full max-w-md card p-10 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={30} className="text-brand-emerald" />
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary mb-2">
            Application Submitted!
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-7">
            Thanks for applying to Codexa! Our team will review your application
            and reach out with your login credentials once approved.
          </p>
          <Link to="/" className="btn-secondary inline-flex">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-saas-standalone">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-brand-violet/15 border border-brand-violet/25 text-text-accent px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Sparkles size={12} />
            Membership Application
          </div>
          <h1 className="font-display font-black text-3xl text-text-primary mb-2">
            Join Codexa
          </h1>
          <p className="text-text-muted text-sm">
            Fill in your details below. Our team reviews every application personally.
          </p>
        </div>

        <div className="card p-7">
          {error && (
            <div className="flex items-start gap-2.5 bg-brand-red/10 border border-brand-red/25 text-brand-red p-3.5 rounded-xl text-sm mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@university.edu"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="input-field"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Joining Year
                </label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={2100}
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(e.target.value)}
                  placeholder="e.g. 2023"
                  className="input-field"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Skills <span className="font-normal normal-case text-text-muted">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="Python, React, Node.js…"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat password"
                  className="input-field"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Why do you want to join?
              </label>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us about your interest in coding, what you hope to learn, and what you'd bring to the club…"
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <div className="w-5 h-5 spinner" />
              ) : (
                <>
                  <Send size={15} />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          Already a member?{' '}
          <Link to="/login" className="text-text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
