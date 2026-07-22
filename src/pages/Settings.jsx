// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../services/api';
// import {
//   Settings as SettingsIcon, User, Lock, Globe, Save,
//   CheckCircle, Eye, EyeOff, AlertCircle, Mail, Hash, ExternalLink,
// } from 'lucide-react';
// import { Github, Linkedin, Twitter } from '../components/SocialIcons';

// const SOCIAL_FIELDS = [
//   { key: 'github',    Icon: Github,   label: 'GitHub',    placeholder: 'https://github.com/…' },
//   { key: 'linkedin',  Icon: Linkedin,  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/…' },
//   { key: 'twitter',   Icon: Twitter,   label: 'Twitter',   placeholder: 'https://twitter.com/…' },
//   { key: 'portfolio', Icon: Globe,     label: 'Portfolio', placeholder: 'https://yoursite.com' },
//   { key: 'leetcode',  Icon: ExternalLink, label: 'LeetCode', placeholder: 'https://leetcode.com/u/yourhandle' },
// ];

// const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// function Toast({ message, type = 'success' }) {
//   if (!message) return null;
//   return (
//     <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-2xl animate-slide-up ${
//       type === 'success'
//         ? 'bg-brand-emerald text-bg-primary'
//         : 'bg-brand-red/90 text-white'
//     }`}>
//       {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
//       {message}
//     </div>
//   );
// }

// function SectionHeader({ icon: Icon, title, description }) {
//   return (
//     <div className="flex items-start gap-3 pb-4 border-b border-bg-border mb-5">
//       <div className="w-9 h-9 rounded-xl bg-brand-violet/15 flex items-center justify-center shrink-0">
//         <Icon size={17} className="text-brand-violet" />
//       </div>
//       <div>
//         <h2 className="font-display font-bold text-base text-text-primary">{title}</h2>
//         {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
//       </div>
//     </div>
//   );
// }

// // ── Profile section ──────────────────────────────────────────────
// function ProfileSection({ profile, email, updateProfileState, showToast }) {
//   const [name, setName]           = useState(profile?.name || '');
//   const [year, setYear]           = useState(profile?.year || '1st Year');
//   const [skillsStr, setSkillsStr] = useState(profile?.skills?.join(', ') || '');
//   const [socials, setSocials]     = useState({
//     github:    profile?.socials?.github    || '',
//     linkedin:  profile?.socials?.linkedin  || '',
//     twitter:   profile?.socials?.twitter   || '',
//     portfolio: profile?.socials?.portfolio || '',
//     leetcode:  profile?.socials?.leetcode  || '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
//     try {
//       const updated = await api.members.update(profile.id, { name, year, skills, socials });
//       updateProfileState(updated);
//       showToast('Profile updated successfully!', 'success');
//     } catch (err) {
//       showToast(err.message || 'Failed to update profile.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!profile) {
//     return (
//       <div className="card p-6">
//         <SectionHeader icon={User} title="Profile Information" />
//         <p className="text-text-muted text-sm">
//           No member profile is linked to your account. Contact an admin to set one up.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSave} className="card p-6">
//       <SectionHeader
//         icon={User}
//         title="Profile Information"
//         description="Update your public profile details visible to other members."
//       />

//       {/* Account read-only info */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-bg-elevated border border-bg-border">
//         <div className="flex items-center gap-2.5">
//           <Mail size={14} className="text-text-muted shrink-0" />
//           <div>
//             <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5">Email</div>
//             <div className="text-xs font-medium text-text-primary break-all">{email || '—'}</div>
//           </div>
//         </div>
//         <div className="flex items-center gap-2.5">
//           <Hash size={14} className="text-text-muted shrink-0" />
//           <div>
//             <div className="text-[10px] text-text-muted uppercase font-semibold mb-0.5">Member ID</div>
//             <div className="text-xs font-mono text-text-muted break-all">{profile.id}</div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-5">
//         {/* Name + Year */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//               Full Name
//             </label>
//             <input
//               type="text"
//               required
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="input-field"
//               placeholder="Your full name"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//               Academic Year
//             </label>
//             <select
//               value={year}
//               onChange={(e) => setYear(e.target.value)}
//               className="input-field"
//             >
//               {YEAR_OPTIONS.map((y) => (
//                 <option key={y} value={y}>{y}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Skills */}
//         <div className="space-y-1.5">
//           <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//             Skills <span className="font-normal normal-case text-text-muted">(comma-separated)</span>
//           </label>
//           <input
//             type="text"
//             value={skillsStr}
//             onChange={(e) => setSkillsStr(e.target.value)}
//             placeholder="Python, React, TypeScript…"
//             className="input-field"
//           />
//         </div>

//         {/* Social links */}
//         <div className="space-y-3">
//           <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
//             Social Links
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {SOCIAL_FIELDS.map(({ key, Icon, label, placeholder }) => (
//               <div key={key} className="space-y-1">
//                 <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
//                   <Icon size={12} className="text-text-muted" /> {label}
//                 </label>
//                 <input
//                   type="url"
//                   value={socials[key]}
//                   onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
//                   placeholder={placeholder}
//                   className="input-field text-xs"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end pt-5 border-t border-bg-border mt-5">
//         <button type="submit" disabled={loading} className="btn-primary text-sm gap-2">
//           {loading ? (
//             <div className="w-4 h-4 spinner" />
//           ) : (
//             <><Save size={14} /> Save Profile</>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// // ── Password section ─────────────────────────────────────────────
// function PasswordSection({ showToast }) {
//   const [current, setCurrent]   = useState('');
//   const [next, setNext]         = useState('');
//   const [confirm, setConfirm]   = useState('');
//   const [loading, setLoading]   = useState(false);
//   const [showCur, setShowCur]   = useState(false);
//   const [showNew, setShowNew]   = useState(false);
//   const [showCon, setShowCon]   = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (next !== confirm) {
//       showToast('New passwords do not match.', 'error');
//       return;
//     }
//     if (next.length < 6) {
//       showToast('Password must be at least 6 characters.', 'error');
//       return;
//     }
//     setLoading(true);
//     try {
//       await api.auth.changePassword(current, next);
//       showToast('Password changed successfully!', 'success');
//       setCurrent(''); setNext(''); setConfirm('');
//     } catch (err) {
//       showToast(err.message || 'Failed to change password.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const PasswordInput = ({ value, onChange, placeholder, show, onToggle }) => (
//     <div className="relative">
//       <input
//         type={show ? 'text' : 'password'}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required
//         className="input-field pr-10"
//       />
//       <button
//         type="button"
//         onClick={onToggle}
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
//         aria-label={show ? 'Hide password' : 'Show password'}
//       >
//         {show ? <EyeOff size={15} /> : <Eye size={15} />}
//       </button>
//     </div>
//   );

//   return (
//     <form onSubmit={handleSubmit} className="card p-6">
//       <SectionHeader
//         icon={Lock}
//         title="Change Password"
//         description="Use a strong password you haven't used before."
//       />

//       <div className="space-y-4">
//         <div className="space-y-1.5">
//           <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//             Current Password
//           </label>
//           <PasswordInput
//             value={current}
//             onChange={(e) => setCurrent(e.target.value)}
//             placeholder="Enter current password"
//             show={showCur}
//             onToggle={() => setShowCur((v) => !v)}
//           />
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//             New Password
//           </label>
//           <PasswordInput
//             value={next}
//             onChange={(e) => setNext(e.target.value)}
//             placeholder="At least 6 characters"
//             show={showNew}
//             onToggle={() => setShowNew((v) => !v)}
//           />
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//             Confirm New Password
//           </label>
//           <PasswordInput
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             placeholder="Repeat new password"
//             show={showCon}
//             onToggle={() => setShowCon((v) => !v)}
//           />
//         </div>

//         {/* Strength hint */}
//         {next && (
//           <div className="flex items-center gap-2 text-xs">
//             <div className="flex gap-1">
//               {[6, 10, 14].map((threshold) => (
//                 <div
//                   key={threshold}
//                   className={`h-1 w-10 rounded-full transition-colors ${
//                     next.length >= threshold
//                       ? next.length >= 14 ? 'bg-brand-emerald'
//                         : next.length >= 10 ? 'bg-yellow-400'
//                         : 'bg-brand-red'
//                       : 'bg-bg-elevated'
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-text-muted">
//               {next.length < 6 ? 'Too short' : next.length < 10 ? 'Weak' : next.length < 14 ? 'Fair' : 'Strong'}
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end pt-5 border-t border-bg-border mt-5">
//         <button type="submit" disabled={loading} className="btn-primary text-sm gap-2">
//           {loading ? (
//             <div className="w-4 h-4 spinner" />
//           ) : (
//             <><Lock size={14} /> Update Password</>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// // ── Main Settings page ───────────────────────────────────────────
// export default function Settings() {
//   const { email, profile, updateProfileState } = useAuth();
//   const [toast, setToast] = useState({ message: '', type: 'success' });

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
//       <Toast message={toast.message} type={toast.type} />

//       {/* Page header */}
//       <div className="flex items-center gap-3 mb-8">
//         <div className="w-10 h-10 rounded-2xl bg-brand-violet/20 flex items-center justify-center">
//           <SettingsIcon size={20} className="text-brand-violet" />
//         </div>
//         <div>
//           <h1 className="font-display font-black text-2xl text-text-primary">Settings</h1>
//           <p className="text-text-muted text-sm mt-0.5">Manage your account and profile</p>
//         </div>
//       </div>

//       <div className="space-y-6">
//         <ProfileSection
//           profile={profile}
//           email={email}
//           updateProfileState={updateProfileState}
//           showToast={showToast}
//         />
//         <PasswordSection showToast={showToast} />
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getFullUploadUrl } from '../utils/url';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Globe,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Hash,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Upload,
  Camera,
  RefreshCw,
} from 'lucide-react';

import {
  Github,
  Linkedin,
  Twitter,
} from '../components/SocialIcons';

const SOCIAL_FIELDS = [
  {
    key: 'github',
    Icon: Github,
    label: 'GitHub',
    placeholder: 'https://github.com/yourusername',
  },
  {
    key: 'linkedin',
    Icon: Linkedin,
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/yourusername',
  },
  {
    key: 'twitter',
    Icon: Twitter,
    label: 'Twitter',
    placeholder: 'https://twitter.com/yourusername',
  },
  {
    key: 'portfolio',
    Icon: Globe,
    label: 'Portfolio',
    placeholder: 'https://yoursite.com',
  },
  {
    key: 'leetcode',
    Icon: ExternalLink,
    label: 'LeetCode',
    placeholder: 'https://leetcode.com/u/yourhandle',
  },
];

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];


/* =========================================================
   TOAST
========================================================= */

function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div
      className={`settings-toast ${
        type === 'success'
          ? 'settings-toast-success'
          : 'settings-toast-error'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}

      <span>{message}</span>
    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}) {
  return (
    <div className="settings-section-header">
      <div className="settings-section-title-area">
        <div className="settings-section-icon">
          <Icon size={20} />
        </div>

        <div>
          <div className="settings-title-row">
            <h2>{title}</h2>

            {badge && (
              <span className="settings-section-badge">
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  profile,
  email,
  uniqueId,
  updateProfileState,
  showToast,
}) {
  const [name, setName] = useState(profile?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [year, setYear] = useState(
    profile?.year || '1st Year'
  );

  const [skills, setSkills] = useState(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [socials, setSocials] = useState({
    github: profile?.socials?.github || '',
    linkedin: profile?.socials?.linkedin || '',
    twitter: profile?.socials?.twitter || '',
    portfolio: profile?.socials?.portfolio || '',
    leetcode: profile?.socials?.leetcode || '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAvatarUrl(profile.avatar_url || '');
      setYear(profile.year || '1st Year');
      setSkills(profile.skills || []);
      setSocials({
        github: profile.socials?.github || '',
        linkedin: profile.socials?.linkedin || '',
        twitter: profile.socials?.twitter || '',
        portfolio: profile.socials?.portfolio || '',
        leetcode: profile.socials?.leetcode || '',
      });
    }
  }, [profile]);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload.file(file);
      setAvatarUrl(res.url);
      showToast('Image uploaded successfully! Save profile to confirm.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = newSkill.trim().replace(/,$/, '');
      if (clean && !skills.includes(clean)) {
        setSkills([...skills, clean]);
      }
      setNewSkill('');
    } else if (e.key === 'Backspace' && !newSkill && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const handleAddSkill = () => {
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const updated = await api.members.update(
        profile.id,
        {
          name,
          year,
          skills,
          socials,
          avatar_url: avatarUrl || null,
        }
      );

      updateProfileState(updated);

      showToast(
        'Profile updated successfully!',
        'success'
      );
    } catch (err) {
      showToast(
        err.message || 'Failed to update profile.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };


  if (!profile) {
    return (
      <div className="settings-card">
        <SectionHeader
          icon={User}
          title="Profile Information"
        />

        <div className="settings-empty-state">
          <AlertCircle size={24} />

          <p>
            No member profile is linked to your
            account. Contact an admin to set one up.
          </p>
        </div>
      </div>
    );
  }


  return (
    <form
      onSubmit={handleSave}
      className="settings-card"
    >
      <SectionHeader
        icon={User}
        title="Profile Information"
        description="Manage the information other CODEXA members can see."
        badge="Public profile"
      />


      {/* ACCOUNT INFORMATION */}

      <div className="settings-account-strip">

        <div className="settings-account-item">
          <div className="settings-account-icon">
            <Mail size={18} />
          </div>

          <div className="settings-account-content">
            <span>Email address</span>
            <strong>{email || '—'}</strong>
          </div>
        </div>


        <div className="settings-account-divider" />


        <div className="settings-account-item">
          <div className="settings-account-icon">
            <Hash size={18} />
          </div>

          <div className="settings-account-content">
            <span>Member ID</span>
            <strong className="settings-member-id">
              {uniqueId || '—'}
            </strong>
          </div>
        </div>

      </div>


      {/* BASIC INFORMATION */}

      <div className="settings-form-section">

        <div className="settings-subheading">
          <h3>Basic information</h3>
          <p>
            Keep your club profile accurate and up to date.
          </p>
        </div>


        <div className="settings-form-grid">

          {/* Profile Picture Upload Zone */}
          <div className="settings-avatar-picker-section" style={{
            gridColumn: '1 / -1',
            marginBottom: '24px',
            padding: '24px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            {/* Avatar Preview */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              border: '2px solid var(--brand-violet)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-card)',
              fontSize: '28px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              boxShadow: '0 8px 30px rgba(108,117,255,0.15)',
              flexShrink: 0,
              position: 'relative',
            }}>
              {uploading ? (
                <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
                  <RefreshCw size={24} className="animate-spin" color="#fff" />
                </div>
              ) : avatarUrl ? (
                <img src={getFullUploadUrl(avatarUrl)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                name.split(' ').filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase() || '?'
              )}
            </div>

            {/* Upload Copy & Actions */}
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Profile Picture
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Upload a personal profile image. Supporting PNG, JPG, or WEBP formats up to 5MB.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label className="btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}>
                  <Camera size={14} />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('');
                      showToast('Photo removed. Save profile to confirm.');
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--brand-red)',
                    }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="full-name">
              Full name
            </label>

            <input
              id="full-name"
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your full name"
            />
          </div>


          <div className="settings-field">
            <label htmlFor="academic-year">
              Academic year
            </label>

            <select
              id="academic-year"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
            >
              {YEAR_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>

        </div>


        <div className="settings-field settings-full-field">
          <label htmlFor="skills-tag-input">
            Skills & Expertise
          </label>

          <div
            className="settings-tag-input-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '10px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--bg-border)',
              borderRadius: '12px',
              minHeight: '46px',
              alignItems: 'center',
              cursor: 'text',
              transition: 'border-color 0.2s',
            }}
            onClick={() => document.getElementById('skills-tag-input')?.focus()}
          >
            {/* Render current skills pills */}
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(108,117,255,0.1)',
                  color: 'var(--brand-violet)',
                  border: '1px solid rgba(108,117,255,0.2)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSkill(skill);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--brand-violet)',
                    fontWeight: 'bold',
                    marginLeft: '2px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Input field */}
            <input
              id="skills-tag-input"
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder={skills.length === 0 ? "Add your skills (e.g. React, Python, Go)..." : "Add..."}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                flex: 1,
                minWidth: '120px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                padding: '2px 0',
              }}
            />
          </div>

          <span className="settings-field-hint">
            Type a skill and press <strong>Enter</strong> or <strong>Comma</strong> to add. Backspace deletes the last tag.
          </span>
        </div>

      </div>


      {/* SOCIAL LINKS */}

      <div className="settings-form-section settings-social-section">

        <div className="settings-subheading">
          <h3>Developer profiles</h3>

          <p>
            Connect your professional and coding accounts.
          </p>
        </div>


        <div className="settings-social-grid">

          {SOCIAL_FIELDS.map(
            ({
              key,
              Icon,
              label,
              placeholder,
            }) => (

              <div
                key={key}
                className={`settings-field ${
                  key === 'leetcode'
                    ? 'settings-social-last'
                    : ''
                }`}
              >

                <label htmlFor={`social-${key}`}>
                  <Icon size={14} />
                  {label}
                </label>


                <div className="settings-input-with-icon">

                  <Icon
                    size={17}
                    className="settings-input-icon"
                  />

                  <input
                    id={`social-${key}`}
                    type="url"
                    value={socials[key]}
                    onChange={(e) =>
                      setSocials((current) => ({
                        ...current,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                  />

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* SAVE AREA */}

      <div className="settings-card-footer">

        <div className="settings-save-message">
          <ShieldCheck size={17} />

          <span>
            Changes are applied to your public
            member profile.
          </span>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="settings-primary-button"
        >
          {loading ? (
            <>
              <div className="settings-spinner" />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save changes
            </>
          )}
        </button>

      </div>

    </form>
  );
}


/* =========================================================
   PASSWORD SECTION
========================================================= */

function PasswordSection({ showToast }) {

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (next !== confirm) {
      showToast(
        'New passwords do not match.',
        'error'
      );

      return;
    }

    if (next.length < 6) {
      showToast(
        'Password must be at least 6 characters.',
        'error'
      );

      return;
    }

    setLoading(true);

    try {
      await api.auth.changePassword(
        current,
        next
      );

      showToast(
        'Password changed successfully!',
        'success'
      );

      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      showToast(
        err.message ||
          'Failed to change password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };


  const PasswordInput = ({
    id,
    value,
    onChange,
    placeholder,
    show,
    onToggle,
  }) => (

    <div className="settings-password-input">

      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />


      <button
        type="button"
        onClick={onToggle}
        aria-label={
          show
            ? 'Hide password'
            : 'Show password'
        }
      >
        {show ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>

    </div>

  );


  const getStrength = () => {

    if (!next) {
      return {
        label: '',
        level: 0,
      };
    }

    if (next.length < 6) {
      return {
        label: 'Too short',
        level: 1,
      };
    }

    if (next.length < 10) {
      return {
        label: 'Weak',
        level: 1,
      };
    }

    if (next.length < 14) {
      return {
        label: 'Good',
        level: 2,
      };
    }

    return {
      label: 'Strong',
      level: 3,
    };
  };


  const strength = getStrength();


  return (

    <form
      onSubmit={handleSubmit}
      className="settings-card"
    >

      <SectionHeader
        icon={Lock}
        title="Password & Security"
        description="Update your password and protect your CODEXA account."
        badge="Security"
      />


      <div className="settings-security-layout">

        <div className="settings-security-form">

          <div className="settings-field">
            <label htmlFor="current-password">
              Current password
            </label>

            <PasswordInput
              id="current-password"
              value={current}
              onChange={(e) =>
                setCurrent(e.target.value)
              }
              placeholder="Enter your current password"
              show={showCur}
              onToggle={() =>
                setShowCur((value) => !value)
              }
            />
          </div>


          <div className="settings-password-grid">

            <div className="settings-field">

              <label htmlFor="new-password">
                New password
              </label>

              <PasswordInput
                id="new-password"
                value={next}
                onChange={(e) =>
                  setNext(e.target.value)
                }
                placeholder="Create a new password"
                show={showNew}
                onToggle={() =>
                  setShowNew((value) => !value)
                }
              />

            </div>


            <div className="settings-field">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <PasswordInput
                id="confirm-password"
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)
                }
                placeholder="Repeat your new password"
                show={showCon}
                onToggle={() =>
                  setShowCon((value) => !value)
                }
              />

            </div>

          </div>


          {next && (

            <div className="settings-strength">

              <div className="settings-strength-bars">

                {[1, 2, 3].map((level) => (

                  <span
                    key={level}
                    className={
                      strength.level >= level
                        ? `active strength-${strength.level}`
                        : ''
                    }
                  />

                ))}

              </div>

              <span>
                Password strength:
                <strong>
                  {' '}
                  {strength.label}
                </strong>
              </span>

            </div>

          )}

        </div>


        <div className="settings-security-tip">

          <div className="settings-security-tip-icon">
            <KeyRound size={22} />
          </div>

          <div>
            <h3>Protect your account</h3>

            <p>
              Use a unique password that you do not
              use on any other website.
            </p>
          </div>

        </div>

      </div>


      <div className="settings-card-footer">

        <div className="settings-save-message">
          <ShieldCheck size={17} />

          <span>
            Your password is securely protected.
          </span>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="settings-primary-button"
        >

          {loading ? (
            <>
              <div className="settings-spinner" />
              Updating...
            </>
          ) : (
            <>
              <Lock size={17} />
              Update password
            </>
          )}

        </button>

      </div>

    </form>

  );
}


/* =========================================================
   MAIN SETTINGS PAGE
========================================================= */

export default function Settings() {

  const {
    email,
    uniqueId,
    profile,
    updateProfileState,
  } = useAuth();


  const [toast, setToast] = useState({
    message: '',
    type: 'success',
  });


  const showToast = (
    message,
    type = 'success'
  ) => {

    setToast({
      message,
      type,
    });

    setTimeout(() => {

      setToast({
        message: '',
        type: 'success',
      });

    }, 3500);

  };


  return (

    <div className="settings-page">

      <Toast
        message={toast.message}
        type={toast.type}
      />


      <div className="settings-page-container">


        {/* PAGE HEADER */}

        <header className="settings-page-header">

          <div className="settings-page-heading">

            <div className="settings-page-icon">
              <SettingsIcon size={24} />
            </div>


            <div>

              <div className="settings-eyebrow">
                <Sparkles size={13} />
                ACCOUNT PREFERENCES
              </div>

              <h1>Settings</h1>

              <p>
                Manage your profile, developer links
                and account security.
              </p>

            </div>

          </div>


          <div className="settings-profile-status">

            <span className="settings-status-dot" />

            <div>
              <strong>Profile active</strong>
              <span>Visible to CODEXA members</span>
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <main className="settings-content">

          <ProfileSection
            profile={profile}
            email={email}
            uniqueId={uniqueId}
            updateProfileState={
              updateProfileState
            }
            showToast={showToast}
          />


          <PasswordSection
            showToast={showToast}
          />

        </main>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        .settings-page {
          width: 100%;
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(99, 102, 241, 0.08),
              transparent 28%
            ),
            var(--bg-primary);
        }


        .settings-page-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 48px 48px 80px;
        }


        /* HEADER */

        .settings-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 36px;
        }


        .settings-page-heading {
          display: flex;
          align-items: center;
          gap: 18px;
        }


        .settings-page-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          background:
            linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.18),
              rgba(124, 58, 237, 0.08)
            );
          border: 1px solid
            rgba(99, 102, 241, 0.16);
          box-shadow:
            0 10px 30px
            rgba(99, 102, 241, 0.08);
          flex-shrink: 0;
        }


        .settings-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
          font-size: 10px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #6366f1;
        }


        .settings-page-heading h1 {
          margin: 0;
          color: var(--text-primary);
          font-family: inherit;
          font-size: clamp(30px, 3vw, 40px);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.04em;
        }


        .settings-page-heading p {
          margin: 8px 0 0;
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.6;
        }


        .settings-profile-status {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 16px;
          border-radius: 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-border);
        }


        .settings-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 5px
            rgba(16, 185, 129, 0.12);
          flex-shrink: 0;
        }


        .settings-profile-status div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }


        .settings-profile-status strong {
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 700;
        }


        .settings-profile-status span {
          color: var(--text-muted);
          font-size: 10px;
        }


        /* CONTENT */

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }


        /* CARD */

        .settings-card {
          width: 100%;
          padding: 32px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-border);
          border-radius: 24px;
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.02),
            0 18px 50px rgba(15, 23, 42, 0.04);
        }


        /* SECTION HEADER */

        .settings-section-header {
          padding-bottom: 24px;
          margin-bottom: 26px;
          border-bottom:
            1px solid var(--bg-border);
        }


        .settings-section-title-area {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }


        .settings-section-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.1);
          flex-shrink: 0;
        }


        .settings-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }


        .settings-title-row h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 19px;
          line-height: 1.3;
          font-weight: 750;
          letter-spacing: -0.025em;
        }


        .settings-section-title-area p {
          margin: 5px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.55;
        }


        .settings-section-badge {
          padding: 4px 8px;
          border-radius: 999px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.08);
          border:
            1px solid
            rgba(99, 102, 241, 0.14);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }


        /* ACCOUNT STRIP */

        .settings-account-strip {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 22px;
          padding: 20px 22px;
          margin-bottom: 30px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.07),
              rgba(124, 58, 237, 0.025)
            );
          border:
            1px solid
            rgba(99, 102, 241, 0.13);
        }


        .settings-account-item {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }


        .settings-account-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          color: #6366f1;
          background:
            rgba(255, 255, 255, 0.6);
        }


        .settings-account-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 4px;
        }


        .settings-account-content span {
          color: var(--text-muted);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }


        .settings-account-content strong {
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 650;
          overflow-wrap: anywhere;
        }


        .settings-member-id {
          font-family: monospace;
          color: var(--text-muted) !important;
          font-weight: 500 !important;
        }


        .settings-account-divider {
          width: 1px;
          height: 38px;
          background:
            rgba(99, 102, 241, 0.15);
        }


        /* FORM SECTIONS */

        .settings-form-section {
          padding-bottom: 30px;
        }


        .settings-form-section +
        .settings-form-section {
          padding-top: 30px;
          border-top:
            1px solid var(--bg-border);
        }


        .settings-subheading {
          margin-bottom: 20px;
        }


        .settings-subheading h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 750;
        }


        .settings-subheading p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.5;
        }


        .settings-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }


        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }


        .settings-field label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 10px;
          line-height: 1;
          font-weight: 750;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }


        .settings-field input,
        .settings-field select,
        .settings-password-input input {
          width: 100%;
          min-height: 48px;
          padding: 0 15px;
          border-radius: 12px;
          border:
            1px solid var(--bg-border);
          outline: none;
          color: var(--text-primary);
          background: var(--bg-primary);
          font-family: inherit;
          font-size: 13px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .settings-field input::placeholder,
        .settings-password-input input::placeholder {
          color: var(--text-muted);
          opacity: 0.72;
        }


        .settings-field input:focus,
        .settings-field select:focus,
        .settings-password-input input:focus {
          border-color:
            rgba(99, 102, 241, 0.6);
          box-shadow:
            0 0 0 4px
            rgba(99, 102, 241, 0.08);
        }


        .settings-field-hint {
          color: var(--text-muted);
          font-size: 10px;
        }


        /* SOCIAL */

        .settings-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 20px;
        }


        .settings-social-last {
          grid-column: span 1;
        }


        .settings-input-with-icon {
          position: relative;
        }


        .settings-input-with-icon input {
          padding-left: 43px;
        }


        .settings-input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }


        /* FOOTER */

        .settings-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-top: 24px;
          border-top:
            1px solid var(--bg-border);
        }


        .settings-save-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 11px;
        }


        .settings-save-message svg {
          color: #10b981;
          flex-shrink: 0;
        }


        .settings-primary-button {
          min-height: 44px;
          padding: 0 20px;
          border: none;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #5b5cf0,
              #7c5cff
            );
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 10px 24px
            rgba(99, 102, 241, 0.2);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .settings-primary-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 14px 30px
            rgba(99, 102, 241, 0.27);
        }


        .settings-primary-button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }


        /* SECURITY */

        .settings-security-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.6fr)
            minmax(250px, 0.7fr);
          gap: 32px;
          align-items: start;
          padding-bottom: 30px;
        }


        .settings-security-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }


        .settings-password-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }


        .settings-password-input {
          position: relative;
        }


        .settings-password-input input {
          padding-right: 48px;
        }


        .settings-password-input button {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transition:
            color 0.2s ease,
            background 0.2s ease;
        }


        .settings-password-input button:hover {
          color: var(--text-primary);
          background: var(--bg-elevated);
        }


        .settings-security-tip {
          padding: 22px;
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              rgba(99, 102, 241, 0.09),
              rgba(124, 58, 237, 0.035)
            );
          border:
            1px solid
            rgba(99, 102, 241, 0.14);
        }


        .settings-security-tip-icon {
          width: 42px;
          height: 42px;
          margin-bottom: 16px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.12);
        }


        .settings-security-tip h3 {
          margin: 0 0 7px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 750;
        }


        .settings-security-tip p {
          margin: 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.7;
        }


        /* PASSWORD STRENGTH */

        .settings-strength {
          display: flex;
          align-items: center;
          gap: 12px;
        }


        .settings-strength-bars {
          display: flex;
          gap: 5px;
        }


        .settings-strength-bars span {
          width: 42px;
          height: 4px;
          border-radius: 999px;
          background: var(--bg-elevated);
          transition:
            background 0.25s ease;
        }


        .settings-strength-bars
        span.active.strength-1 {
          background: #ef4444;
        }


        .settings-strength-bars
        span.active.strength-2 {
          background: #f59e0b;
        }


        .settings-strength-bars
        span.active.strength-3 {
          background: #10b981;
        }


        .settings-strength > span {
          color: var(--text-muted);
          font-size: 10px;
        }


        .settings-strength strong {
          color: var(--text-primary);
        }


        /* TOAST */

        .settings-toast {
          position: fixed;
          right: 28px;
          bottom: 28px;
          z-index: 9999;
          min-width: 280px;
          padding: 14px 18px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          box-shadow:
            0 20px 50px
            rgba(15, 23, 42, 0.22);
          animation:
            settingsToastIn 0.3s ease;
        }


        .settings-toast-success {
          background: #059669;
        }


        .settings-toast-error {
          background: #dc2626;
        }


        @keyframes settingsToastIn {

          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        /* SPINNER */

        .settings-spinner {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border:
            2px solid
            rgba(255, 255, 255, 0.35);
          border-top-color: white;
          animation:
            settingsSpin 0.7s linear infinite;
        }


        @keyframes settingsSpin {

          to {
            transform: rotate(360deg);
          }

        }


        /* EMPTY STATE */

        .settings-empty-state {
          padding: 30px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          background: var(--bg-primary);
          border:
            1px solid var(--bg-border);
        }


        .settings-empty-state p {
          margin: 0;
          font-size: 13px;
        }


        /* TABLET */

        @media (max-width: 1050px) {

          .settings-page-container {
            padding:
              36px 28px 70px;
          }


          .settings-security-layout {
            grid-template-columns: 1fr;
          }


          .settings-security-tip {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }


          .settings-security-tip-icon {
            margin-bottom: 0;
            flex-shrink: 0;
          }

        }


        /* MOBILE */

        @media (max-width: 767px) {

          .settings-page-container {
            padding:
              26px 16px 60px;
          }


          .settings-page-header {
            align-items: flex-start;
          }


          .settings-profile-status {
            display: none;
          }


          .settings-page-icon {
            width: 48px;
            height: 48px;
            border-radius: 15px;
          }


          .settings-page-heading {
            gap: 13px;
          }


          .settings-page-heading h1 {
            font-size: 28px;
          }


          .settings-page-heading p {
            font-size: 13px;
          }


          .settings-card {
            padding: 22px;
            border-radius: 20px;
          }


          .settings-account-strip {
            grid-template-columns: 1fr;
          }


          .settings-account-divider {
            width: 100%;
            height: 1px;
          }


          .settings-form-grid,
          .settings-social-grid,
          .settings-password-grid {
            grid-template-columns: 1fr;
          }


          .settings-social-last {
            grid-column: auto;
          }


          .settings-card-footer {
            align-items: stretch;
            flex-direction: column;
          }


          .settings-primary-button {
            width: 100%;
          }


          .settings-save-message {
            justify-content: center;
          }


          .settings-toast {
            left: 16px;
            right: 16px;
            bottom: 16px;
            min-width: 0;
          }

        }

      `}</style>

    </div>

  );
}