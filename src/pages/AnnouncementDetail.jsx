import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Megaphone, AlertCircle } from 'lucide-react';

import { getFullUploadUrl } from '../utils/url';

const fmtFull = (d) => new Date(d).toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ann, setAnn]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.announcements.getAll()
      .then((all) => setAnn(all.find((a) => a.id === id) || null))
      .catch(() => setAnn(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-10 h-10 spinner" />
    </div>
  );

  if (!ann) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-text-muted">
      <AlertCircle size={40} className="opacity-30" />
      <p className="text-sm">Announcement not found or has expired.</p>
      <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Go Back</button>
    </div>
  );

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

      {/* Media */}
      {ann.image_url && (
        <div className="rounded-2xl overflow-hidden border border-bg-border mb-6">
          <img src={getFullUploadUrl(ann.image_url)} alt={ann.title} className="w-full max-h-80 object-cover" />
        </div>
      )}
      {ann.video_url && (
        <div className="rounded-2xl overflow-hidden border border-bg-border mb-6">
          <video src={getFullUploadUrl(ann.video_url)} className="w-full max-h-80" controls />
        </div>
      )}

      {/* Content card */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-brand-violet/15 border border-brand-violet/25 flex items-center justify-center shrink-0">
            <Megaphone size={15} className="text-brand-violet" />
          </div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Announcement</span>
        </div>

        <h1 className="font-display font-black text-2xl text-text-primary mb-2 leading-snug">{ann.title}</h1>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bg-border">
          <span className="text-xs text-text-muted bg-bg-elevated px-2.5 py-1 rounded-lg">By {ann.author}</span>
          <span className="text-xs text-text-muted">{fmtFull(ann.created_at)}</span>
          {ann.expires_at && (
            <span className={`text-xs px-2.5 py-1 rounded-lg border ${
              new Date(ann.expires_at) < new Date()
                ? 'bg-brand-red/10 border-brand-red/25 text-brand-red'
                : 'bg-brand-amber/10 border-brand-amber/25 text-brand-amber'
            }`}>
              {new Date(ann.expires_at) < new Date() ? 'Expired' : `Expires ${new Date(ann.expires_at).toLocaleDateString()}`}
            </span>
          )}
        </div>

        <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
          {ann.content}
        </div>
      </div>
    </div>
  );
}
