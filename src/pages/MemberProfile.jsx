import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft, Trophy, Star, Calendar, Zap,
  Globe, ExternalLink, AlertCircle,
} from 'lucide-react';
import { Github, Linkedin, Twitter } from '../components/SocialIcons';

import { getFullUploadUrl } from '../utils/url';

const TYPE_META = {
  workshop:  { label: 'Workshop',  icon: '🎖️', color: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' },
  hackathon: { label: 'Hackathon', icon: '⚡',  color: 'bg-brand-violet/10 text-brand-violet border-brand-violet/20' },
  project:   { label: 'Project',   icon: '⚙️',  color: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20' },
  event:     { label: 'Event',     icon: '🎪',  color: 'bg-brand-pink/10 text-brand-pink border-brand-pink/20' },
  general:   { label: 'General',   icon: '📋',  color: 'bg-brand-amber/10 text-brand-amber border-brand-amber/20' },
};

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.members.getById(id), api.members.getAll()])
      .then(([m, all]) => {
        setMember(m);
        const sorted = [...all].sort((a, b) => b.points - a.points);
        const idx = sorted.findIndex((x) => x.id === id);
        setRank(idx >= 0 ? idx + 1 : null);
      })
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-10 h-10 spinner" />
    </div>
  );

  if (!member) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-text-muted">
      <AlertCircle size={40} className="opacity-30" />
      <p className="text-sm">Member not found.</p>
      <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Go Back</button>
    </div>
  );

  const activityDays = new Set(
    (member.activity_log || []).filter(e => e.count > 0).map(e => e.date)
  ).size;

  const socials = [
    { key: 'github',    Icon: Github,       label: 'GitHub',    url: member.socials?.github },
    { key: 'linkedin',  Icon: Linkedin,     label: 'LinkedIn',  url: member.socials?.linkedin },
    { key: 'twitter',   Icon: Twitter,      label: 'Twitter',   url: member.socials?.twitter },
    { key: 'portfolio', Icon: Globe,        label: 'Portfolio', url: member.socials?.portfolio },
    { key: 'leetcode',  Icon: ExternalLink, label: 'LeetCode',  url: member.socials?.leetcode },
  ].filter(s => s.url);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 group transition-colors">
        <span className="w-8 h-8 rounded-xl bg-bg-card border border-bg-border flex items-center justify-center group-hover:border-brand-violet/40 transition-all">
          <ArrowLeft size={15} />
        </span>
        Back
      </button>

      {/* Banner */}
      <div className="card overflow-hidden mb-6">
        <div className="h-2 w-full bg-gradient-brand" />
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-2xl font-black text-white shadow-glow-sm shrink-0" style={{ padding: 0, overflow: 'hidden' }}>
            {member.avatar_url ? (
              <img src={getFullUploadUrl(member.avatar_url)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              member.name?.charAt(0)?.toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display font-black text-xl text-text-primary">{member.name}</h1>
              <span className="badge badge-violet">{member.role}</span>
              {rank && (
                <span className="badge badge-amber">#{rank} on leaderboard</span>
              )}
            </div>
            <p className="text-text-muted text-xs mt-0.5">
              {member.year} · Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Trophy,   label: 'Points',       value: member.points,           color: 'text-brand-violet', bg: 'bg-brand-violet/10 border-brand-violet/20' },
          { icon: Star,     label: 'Badges',        value: member.badges?.length ?? 0, color: 'text-brand-pink', bg: 'bg-brand-pink/10 border-brand-pink/20' },
          { icon: Calendar, label: 'Active Days',   value: activityDays,            color: 'text-brand-emerald', bg: 'bg-brand-emerald/10 border-brand-emerald/20' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`card border ${bg} p-4 text-center`}>
            <Icon size={20} className={`${color} mx-auto mb-1.5`} />
            <div className={`text-xl font-black font-display ${color}`}>{value}</div>
            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Skills */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-brand-violet" />
            <h3 className="font-bold text-text-primary text-sm">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.skills?.length > 0
              ? member.skills.map((s) => <span key={s} className="badge badge-violet">{s}</span>)
              : <span className="text-text-muted text-sm">No skills listed.</span>
            }
          </div>
        </div>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={15} className="text-brand-blue" />
              <h3 className="font-bold text-text-primary text-sm">Links</h3>
            </div>
            <div className="space-y-2">
              {socials.map(({ key, Icon, label, url }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-bg-elevated border border-bg-border hover:border-brand-violet/30 transition-all group">
                  <Icon size={14} className="text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-text-muted font-semibold uppercase">{label}</div>
                    <div className="text-xs text-text-accent truncate group-hover:underline">
                      {url.replace('https://', '')}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {member.badges?.length > 0 && (
          <div className="card p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Star size={15} className="text-brand-pink" />
              <h3 className="font-bold text-text-primary text-sm">Badges Earned</h3>
              <span className="badge badge-pink ml-auto">{member.badges.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {member.badges.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-bg-elevated border border-bg-border rounded-xl">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <div className="font-semibold text-text-primary text-sm">{b.name}</div>
                    <div className="text-xs text-text-muted">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {member.points_history?.length > 0 && (
          <div className="card p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={15} className="text-brand-violet" />
              <h3 className="font-bold text-text-primary text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[...member.points_history]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 8)
                .map((entry, i) => {
                  const meta = TYPE_META[entry.activity_type] || TYPE_META.general;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-bg-border">
                      <span className="text-lg">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary truncate">{entry.reason}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${meta.color}`}>{meta.label}</span>
                          <span className="text-[10px] text-text-muted">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-brand-emerald shrink-0">+{entry.points} pts</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
