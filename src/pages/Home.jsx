import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Code2, Trophy, Layers, BookOpen, Users, Zap, ArrowRight,
  Star, CheckCircle, Calendar, MapPin, Sparkles, Target,
  TrendingUp, Shield, Globe, MessageSquare, Bell, ChevronRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: Code2, color: 'text-brand-violet', bg: 'bg-brand-violet/10 border-brand-violet/20',
    title: 'Daily Coding Challenges',
    desc: 'Sharpen your skills with hand-picked problems every day. Track your streaks, earn badges, and watch your rank climb.',
  },
  {
    icon: Trophy, color: 'text-brand-amber', bg: 'bg-brand-amber/10 border-brand-amber/20',
    title: 'Live Leaderboard',
    desc: 'Compete with peers in real time. Points for every problem solved, event attended, and project shipped.',
  },
  {
    icon: Layers, color: 'text-brand-blue', bg: 'bg-brand-blue/10 border-brand-blue/20',
    title: 'Project Showcase',
    desc: 'Build real-world projects, share your GitHub repos, and get feedback from the community.',
  },
  {
    icon: BookOpen, color: 'text-brand-emerald', bg: 'bg-brand-emerald/10 border-brand-emerald/20',
    title: 'Curated Resources',
    desc: 'A growing library of docs, tutorials, and cheat-sheets — organized by language and skill level.',
  },
  {
    icon: TrendingUp, color: 'text-brand-pink', bg: 'bg-brand-pink/10 border-brand-pink/20',
    title: 'Personal Growth Dashboard',
    desc: 'HackerRank-style profile: activity heatmap, language breakdown, problem stats, and milestone badges.',
  },
  {
    icon: Users, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20',
    title: 'Workshops & Events',
    desc: 'Attend workshops, hackathons, and tech talks led by seniors and industry guests. Register in one click.',
  },
];

const ADVANTAGES = [
  { icon: Target,       label: 'Structured Learning Path' },
  { icon: Zap,          label: 'Earn Points for Every Activity' },
  { icon: Shield,       label: 'Beginner-Friendly Community' },
  { icon: Star,         label: 'Mentor-Led Workshops' },
  { icon: Globe,        label: 'Open-Source Projects' },
  { icon: MessageSquare, label: 'Peer Code Reviews' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    Promise.all([api.events.getAll(), api.announcements.getAll()])
      .then(([ev, ann]) => { setEvents(ev.slice(0, 3)); setAnnouncements(ann.slice(0, 3)); })
      .catch(() => {});
  }, []);

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-20">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)', filter: 'blur(60px)' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-violet/15 border border-brand-violet/30 text-text-accent px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles size={12} /> Student Developer Community · Est. 2024
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl xl:text-7xl leading-[1.05] mb-6">
            <span className="text-text-primary">Code. Compete.</span>
            <br />
            <span className="text-gradient">Grow Together.</span>
          </h1>

          <p className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            CODEXA is a student coding club where you solve problems, ship projects,
            attend workshops — and track every bit of your growth like a pro.
          </p>

          {isAuthenticated ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/leaderboard" className="btn-secondary text-base px-8 py-3.5">
                View Rankings
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                Get Started Free <Zap size={16} />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign In
              </Link>
            </div>
          )}

          {/* Proof chips */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-text-muted">
            {['50+ Members', '30+ Projects', 'Weekly Events', 'Free to Join'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-brand-emerald" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-bg-card border border-bg-border text-text-muted px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            Everything you need
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary mb-3">
            Why join CODEXA?
          </h2>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Everything a developer needs — under one roof, built by students, for students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="card card-hover p-6 group">
              <div className={`w-10 h-10 rounded-xl border ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className={`font-display font-bold text-base text-text-primary mb-2 group-hover:${color} transition-colors`}>
                {title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADVANTAGES STRIP ── */}
      <section className="border-y border-bg-border bg-bg-secondary py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ADVANTAGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center group">
                <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center group-hover:bg-brand-violet/20 transition-all">
                  <Icon size={18} className="text-brand-violet" />
                </div>
                <span className="text-xs font-semibold text-text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5">
              <TrendingUp size={12} /> Your Personal Growth Hub
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
              Track your progress<br />like a pro athlete
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-6">
              Your personal dashboard shows everything — problems solved, active streaks,
              language breakdown, earned badges, and a heatmap of all your coding activity.
              Just like LeetCode and HackerRank, but for your club journey.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Activity heatmap (last 52 weeks)',
                'Problems solved with language breakdown',
                'Streak tracker with fire badges',
                'Milestone achievements & badges',
                'Club points & leaderboard rank',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <CheckCircle size={15} className="text-brand-emerald shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {!isAuthenticated && (
              <Link to="/register" className="btn-primary inline-flex">
                Create Your Profile <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Mock dashboard preview */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-bg-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-lg">J</div>
              <div>
                <div className="font-bold text-text-primary text-sm">Jane Developer</div>
                <div className="text-xs text-text-muted">2nd Year · Member</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-black text-brand-violet">142</div>
                <div className="text-xs text-text-muted">points</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: '28', l: 'Solved', c: 'text-brand-violet' },
                { v: '🔥 7', l: 'Streak', c: 'text-brand-amber' },
                { v: '4', l: 'Badges', c: 'text-brand-pink' },
              ].map(({ v, l, c }) => (
                <div key={l} className="bg-bg-elevated border border-bg-border rounded-xl p-3 text-center">
                  <div className={`font-black text-xl font-display ${c}`}>{v}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wide">{l}</div>
                </div>
              ))}
            </div>

            {/* Mini heatmap */}
            <div>
              <div className="text-xs font-semibold text-text-muted mb-2">Activity (Last 12 Weeks)</div>
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-0.5 flex-1">
                    {Array.from({ length: 7 }).map((_, d) => {
                      const r = Math.random();
                      const bg = r > 0.7 ? 'bg-brand-violet' : r > 0.4 ? 'bg-brand-violet/40' : 'bg-bg-elevated';
                      return <div key={d} className={`h-2.5 rounded-[2px] ${bg}`} />;
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {['🩸 First Blood', '🔥 Week Warrior', '💡 Problem Solver'].map((b) => (
                <span key={b} className="badge badge-violet text-[10px]">{b}</span>
              ))}
            </div>

            {/* Language bar */}
            <div>
              <div className="text-xs font-semibold text-text-muted mb-2">Languages</div>
              <div className="space-y-1.5">
                {[['Python', 60, 'bg-brand-blue'], ['JavaScript', 30, 'bg-brand-amber'], ['C++', 10, 'bg-brand-pink']].map(([lang, pct, bar]) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary w-20 shrink-0">{lang}</span>
                    <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                      <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES FEED ── */}
      {(events.length > 0 || announcements.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Upcoming Events */}
            {events.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-pink/15 border border-brand-pink/25 flex items-center justify-center">
                      <Calendar size={14} className="text-brand-pink" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary">Upcoming Events</h3>
                  </div>
                  <Link to="/leaderboard" className="text-xs text-text-accent hover:underline flex items-center gap-1">
                    View all <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="card p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center shrink-0">
                        <Calendar size={16} className="text-brand-pink" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary text-sm line-clamp-1">{ev.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(ev.date)}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {ev.location}</span>
                        </div>
                      </div>
                      {!isAuthenticated && (
                        <Link to="/login" className="btn-secondary text-xs px-3 py-1.5 shrink-0">Join</Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Announcements */}
            {announcements.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-violet/15 border border-brand-violet/25 flex items-center justify-center">
                      <Bell size={14} className="text-brand-violet" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary">Latest News</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="card p-4 relative overflow-hidden">
                      <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-brand rounded-full ml-3.5" />
                      <div className="pl-3">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="font-semibold text-text-primary text-sm">{ann.title}</h4>
                          <span className="text-[10px] text-text-muted whitespace-nowrap">{new Date(ann.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-text-muted text-xs line-clamp-2 leading-relaxed">{ann.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
          <div className="relative rounded-3xl overflow-hidden p-10 text-center">
            <div className="absolute inset-0 bg-gradient-brand opacity-10" />
            <div className="absolute inset-0 border border-brand-violet/20 rounded-3xl" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-text-primary mb-3">
                Ready to level up?
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Join CODEXA today, start tracking your coding journey, and climb to the top of the leaderboard.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn-primary text-base px-8 py-3.5">
                  Create Account <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
