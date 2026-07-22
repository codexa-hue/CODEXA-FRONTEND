import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Award, Mail, Edit3, Globe, Save, CheckCircle, Hash } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../components/SocialIcons';

const SOCIAL_FIELDS = [
  { key: 'github',    Icon: Github,   label: 'GitHub',    placeholder: 'https://github.com/…' },
  { key: 'linkedin',  Icon: Linkedin,  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/…' },
  { key: 'twitter',   Icon: Twitter,   label: 'Twitter',   placeholder: 'https://twitter.com/…' },
  { key: 'portfolio', Icon: Globe,     label: 'Portfolio', placeholder: 'https://yoursite.com' },
];

export default function Profile() {
  const { email, profile, updateProfileState } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [year, setYear] = useState(profile?.year || '1st Year');
  const [skillsStr, setSkillsStr] = useState(profile?.skills?.join(', ') || '');
  const [socials, setSocials] = useState({
    github: profile?.socials?.github || '',
    linkedin: profile?.socials?.linkedin || '',
    twitter: profile?.socials?.twitter || '',
    portfolio: profile?.socials?.portfolio || '',
  });
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setYear(profile.year || '1st Year');
      setSkillsStr(profile.skills?.join(', ') || '');
      setSocials({
        github: profile.socials?.github || '',
        linkedin: profile.socials?.linkedin || '',
        twitter: profile.socials?.twitter || '',
        portfolio: profile.socials?.portfolio || '',
      });
    }
  }, [profile]);


  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    try {
      const updated = await api.members.update(profile.id, { name, year, skills, socials });
      updateProfileState(updated);
      setIsEditing(false);
      setToast('Profile updated!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-text-muted">
        No member profile linked to this account.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-emerald text-bg-primary px-4 py-3 rounded-xl font-semibold text-sm shadow-2xl animate-slide-up">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

      {/* Profile banner */}
      <div className="card overflow-hidden mb-7">
        <div
          className="h-24 relative"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />
        </div>

        <div className="px-6 pb-6 -mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border-4 border-bg-card flex items-center justify-center text-2xl font-black text-brand-violet shadow-lg shrink-0">
            {profile.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display font-black text-xl text-text-primary">{profile.name}</h1>
              <span className="badge badge-violet">{profile.role}</span>
            </div>
            <p className="text-text-muted text-xs mt-0.5">
              {profile.year} · Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary gap-1.5 text-sm">
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Stats */}
        <div className="space-y-5">
          {/* Points card */}
          <div className="card p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{ background: 'radial-gradient(circle at 50% 50%, #7c3aed, transparent 70%)' }}
            />
            <Award size={30} className="mx-auto text-brand-violet mb-2" />
            <div className="text-3xl font-black font-display text-text-primary mb-1">
              {profile.points}
            </div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Club Points</div>
            <p className="text-text-muted text-xs mt-2 leading-relaxed">
              Earned from workshop attendance and project contributions.
            </p>
          </div>

          {/* Private info */}
          <div className="card p-5 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-bg-border pb-2">
              Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail size={14} className="text-text-muted mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5">Email</div>
                  <div className="text-xs font-medium text-text-primary break-all">{email || '—'}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Hash size={14} className="text-text-muted mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5">Member ID</div>
                  <div className="text-xs font-mono text-text-muted break-all">{profile.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable details */}
        <div className="md:col-span-2">
          {isEditing ? (
            <form onSubmit={handleSave} className="card p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-bg-border pb-3">
                <Edit3 size={16} className="text-brand-violet" />
                <h2 className="font-display font-bold text-base text-text-primary">Edit Profile</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Academic Year</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Skills <span className="font-normal normal-case">(comma-separated)</span>
                </label>
                <input
                  type="text" value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="Python, React, TypeScript…"
                  className="input-field"
                />
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider border-t border-bg-border pt-4">
                  Social Links
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOCIAL_FIELDS.map(({ key, Icon, placeholder }) => (
                    <div key={key} className="relative">
                      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="url"
                        value={socials[key]}
                        onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="input-field pl-9 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-bg-border pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary text-sm">
                  {loading ? <div className="w-4 h-4 spinner" /> : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="card p-6 space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-bg-border pb-2 mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span key={skill} className="badge badge-violet text-xs">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-muted text-sm">
                      No skills listed. Click "Edit Profile" to add yours.
                    </span>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-bg-border pb-2 mb-3">
                  Social Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOCIAL_FIELDS.map(({ key, Icon, label }) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated border border-bg-border">
                      <Icon size={16} className="text-text-muted shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] text-text-muted font-semibold uppercase mb-0.5">{label}</div>
                        {profile.socials?.[key] ? (
                          <a
                            href={profile.socials[key]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-text-accent hover:underline truncate block"
                          >
                            {profile.socials[key].replace('https://', '')}
                          </a>
                        ) : (
                          <span className="text-xs text-text-muted">Not connected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
