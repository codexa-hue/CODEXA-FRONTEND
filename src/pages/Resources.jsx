// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import { BookOpen, Plus, ExternalLink, Trash2, X, CheckCircle, ArrowLeft } from 'lucide-react';

// const CATEGORY_COLORS = {
//   Frontend:        { badge: 'badge-blue', dot: 'bg-brand-blue' },
//   Backend:         { badge: 'badge-violet', dot: 'bg-brand-violet' },
//   Database:        { badge: 'badge-amber', dot: 'bg-brand-amber' },
//   DevOps:          { badge: 'badge-emerald', dot: 'bg-brand-emerald' },
//   'Machine Learning': { badge: 'badge-pink', dot: 'bg-brand-pink' },
//   General:         { badge: 'badge-violet', dot: 'bg-text-muted' },
// };

// const getCategoryStyle = (cat) => CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.General;

// export default function Resources() {
//   const { isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [toast, setToast] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('General');
//   const [url, setUrl] = useState('');
//   const [description, setDescription] = useState('');

//   useEffect(() => { fetchResources(); }, []);

//   const fetchResources = async () => {
//     try {
//       const data = await api.resources.getAll();
//       setResources(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => { setTitle(''); setCategory('General'); setUrl(''); setDescription(''); };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await api.resources.create({ title, category, url, description: description || null });
//       setToast('Resource added!');
//       setShowModal(false);
//       resetForm();
//       fetchResources();
//       setTimeout(() => setToast(''), 3000);
//     } catch (err) {
//       alert(err.message || 'Failed to add resource.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this resource?')) return;
//     try {
//       await api.resources.delete(id);
//       setToast('Resource removed.');
//       fetchResources();
//       setTimeout(() => setToast(''), 3000);
//     } catch (err) {
//       alert(err.message || 'Failed to delete.');
//     }
//   };

//   const categories = [...new Set(resources.map((r) => r.category))];

//   if (loading) {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center">
//         <div className="w-10 h-10 spinner" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 sm:px-8 py-6">

//       {toast && (
//         <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-emerald text-bg-primary px-4 py-3 rounded-xl font-semibold text-sm shadow-2xl animate-slide-up">
//           <CheckCircle size={16} />{toast}
//         </div>
//       )}

//       {/* Back + Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)}
//             className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors group shrink-0">
//             <span className="w-8 h-8 rounded-xl bg-bg-card border border-bg-border flex items-center justify-center group-hover:border-brand-violet/40 transition-all">
//               <ArrowLeft size={15} />
//             </span>
            
//           </button>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 border border-brand-emerald/30 flex items-center justify-center">
//               <BookOpen size={20} className="text-brand-emerald" />
//             </div>
//             <div>
//               <h1 className="font-display font-black text-2xl text-text-primary">Study Resources</h1>
//               <p className="text-text-muted text-sm">Curated docs, tutorials, and references.</p>
//             </div>
//           </div>
//         </div>
//         {isAdmin && (
//           <button onClick={() => setShowModal(true)} className="btn-primary">
//             <Plus size={15} /> Add Resource
//           </button>
//         )}
//       </div>

//       {/* Content */}
//       {resources.length === 0 ? (
//         <div className="card p-16 text-center">
//           <BookOpen size={40} className="mx-auto text-text-muted/30 mb-4" />
//           <h3 className="font-semibold text-text-secondary mb-1">No resources yet</h3>
//           <p className="text-text-muted text-sm">Check back soon — admins will add resources here.</p>
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {categories.map((cat) => {
//             const catResources = resources.filter((r) => r.category === cat);
//             const style = getCategoryStyle(cat);
//             return (
//               <div key={cat}>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className={`w-2 h-2 rounded-full ${style.dot}`} />
//                   <span className={`badge ${style.badge}`}>{cat}</span>
//                   <span className="text-xs text-text-muted">{catResources.length} item{catResources.length !== 1 ? 's' : ''}</span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {catResources.map((res) => (
//                     <div key={res.id} className="card card-hover p-5 flex flex-col justify-between group">
//                       <div className="space-y-2">
//                         <div className="flex items-start justify-between gap-3">
//                           <h4 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-text-accent transition-colors line-clamp-2">
//                             {res.title}
//                           </h4>
//                           {isAdmin && (
//                             <button
//                               onClick={() => handleDelete(res.id)}
//                               className="text-text-muted hover:text-brand-red transition-colors p-1 rounded-lg hover:bg-brand-red/10 shrink-0"
//                             >
//                               <Trash2 size={13} />
//                             </button>
//                           )}
//                         </div>
//                         {res.description && (
//                           <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
//                             {res.description}
//                           </p>
//                         )}
//                       </div>
//                       <a
//                         href={res.url}
//                         target="_blank"
//                         rel="noreferrer"
//                         className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-4 pt-3 border-t border-bg-border hover:underline transition-colors badge ${style.badge}`}
//                       >
//                         Open Resource <ExternalLink size={10} />
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm p-4">
//           <div className="w-full max-w-md card p-7 animate-slide-up">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="font-display font-bold text-xl text-text-primary">Add Resource</h2>
//               <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all">
//                 <X size={18} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Title</label>
//                 <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Category</label>
//                   <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
//                     {Object.keys(CATEGORY_COLORS).map((c) => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">URL</label>
//                   <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="input-field" />
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Description <span className="font-normal normal-case">(optional)</span></label>
//                 <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none" />
//               </div>
//               <div className="flex gap-3 justify-end pt-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
//                 <button type="submit" disabled={submitting} className="btn-primary">
//                   {submitting ? <div className="w-4 h-4 spinner" /> : 'Add Resource'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { CardSkeleton } from "../components/Skeleton";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Filter,
  Layers3,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "General",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Machine Learning",
];

const CATEGORY_META = {
  Frontend: {
    short: "FE",
    className: "frontend",
  },
  Backend: {
    short: "BE",
    className: "backend",
  },
  Database: {
    short: "DB",
    className: "database",
  },
  DevOps: {
    short: "DO",
    className: "devops",
  },
  "Machine Learning": {
    short: "ML",
    className: "machine-learning",
  },
  General: {
    short: "GE",
    className: "general",
  },
};

const getCategoryMeta = (category) => {
  if (CATEGORY_META[category]) {
    return CATEGORY_META[category];
  }

  const words = (category || "General")
    .trim()
    .split(/\s+/);

  const short =
    words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : words
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase();

  return {
    short,
    className: "general",
  };
};

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "External resource";
  }
};

function ResourceCard({ resource, isAdmin, onDelete }) {
  const meta = getCategoryMeta(resource.category);

  return (
    <article className="rl-card">
      <div className="rl-card-top">
        <div className={`rl-resource-mark ${meta.className}`}>
          {meta.short}
        </div>

        <div className="rl-card-actions">
          <span className={`rl-category-badge ${meta.className}`}>
            {resource.category || "General"}
          </span>

          {isAdmin && (
            <button
              type="button"
              className="rl-delete-button"
              onClick={() => onDelete(resource.id)}
              title="Delete resource"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="rl-card-content">
        <h3>{resource.title}</h3>

        <p>
          {resource.description ||
            "Open this resource to explore the shared learning material."}
        </p>
      </div>

      <div className="rl-card-footer">
        <span className="rl-domain">
          <Link2 size={12} />
          {getDomain(resource.url)}
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="rl-open-link"
        >
          Open
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}

function EmptyState({ search, activeCategory, onReset }) {
  const filtering = search || activeCategory !== "All";

  return (
    <div className="rl-empty">
      <div className="rl-empty-icon">
        {filtering ? <Search size={23} /> : <BookOpen size={23} />}
      </div>

      <h3>
        {filtering ? "No resources found" : "No resources yet"}
      </h3>

      <p>
        {filtering
          ? "No resource matches the current search and category filters."
          : "Resources added by the club will appear here."}
      </p>

      {filtering && (
        <button type="button" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export default function Resources() {
  const { isAdmin } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3500);
  };

  const fetchResources = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await api.resources.getAll();

      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setLoadError(
        err?.message || "The resource library could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("General");
    setUrl("");
    setDescription("");
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await api.resources.create({
        title: title.trim(),
        category,
        url: url.trim(),
        description: description.trim() || null,
      });

      setShowModal(false);
      resetForm();

      await fetchResources();

      showToast("Resource added successfully.");
    } catch (err) {
      showToast(
        err?.message || "Failed to add the resource.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await api.resources.delete(confirmDeleteId);

      setResources((current) =>
        current.filter((resource) => resource.id !== confirmDeleteId)
      );

      showToast("Resource removed.");
    } catch (err) {
      showToast(
        err?.message || "Failed to delete the resource.",
        "error"
      );
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const categoryCounts = useMemo(() => {
    return resources.reduce((counts, resource) => {
      const key = resource.category || "General";

      counts[key] = (counts[key] || 0) + 1;

      return counts;
    }, {});
  }, [resources]);

 const availableCategories = useMemo(() => {
  return [
    ...new Set([
      ...DEFAULT_CATEGORIES,
      ...resources
        .map((resource) => resource.category)
        .filter(Boolean),
    ]),
  ].filter(
    (item) => item === "General" || categoryCounts[item] > 0
  );
}, [resources, categoryCounts]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" ||
        resource.category === activeCategory;

      const matchesSearch =
        !query ||
        [
          resource.title,
          resource.description,
          resource.category,
          getDomain(resource.url),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [resources, search, activeCategory]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };



  return (
    <div className="rl-page">
      {toast.message && (
        <div className={`rl-toast ${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <div>
            <strong>
              {toast.type === "success" ? "Success" : "Error"}
            </strong>

            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              setToast({
                message: "",
                type: "success",
              })
            }
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="rl-container">
        <header className="rl-header">
          <div>
            <div className="rl-kicker">
              <BookOpen size={13} />
              LEARNING LIBRARY
            </div>

            <h1>Study Resources</h1>

            <p>
              Curated documentation, tutorials and references shared
              with the CODEXA community.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="rl-add-button"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Add resource
            </button>
          )}
        </header>

        <section className="rl-summary">
          <div className="rl-summary-item">
            <div className="rl-summary-icon violet">
              <BookOpen size={18} />
            </div>

            <div>
              <strong>{resources.length}</strong>
              <span>Total resources</span>
            </div>
          </div>

          <div className="rl-summary-divider" />

          <div className="rl-summary-item">
            <div className="rl-summary-icon blue">
              <Layers3 size={18} />
            </div>

            <div>
              <strong>
                {
                  new Set(
                    resources.map(
                      (resource) => resource.category || "General"
                    )
                  ).size
                }
              </strong>

              <span>Categories</span>
            </div>
          </div>

          <div className="rl-summary-divider" />

          <div className="rl-summary-item">
            <div className="rl-summary-icon green">
              <ExternalLink size={18} />
            </div>

            <div>
              <strong>{filteredResources.length}</strong>
              <span>Currently shown</span>
            </div>
          </div>
        </section>

        <section className="rl-toolbar">
          <div className="rl-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources, categories or websites"
            />

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="rl-filter-label">
            <Filter size={14} />
            Filter
          </div>
        </section>

        <div className="rl-categories">
          <button
            type="button"
            className={activeCategory === "All" ? "active" : ""}
            onClick={() => setActiveCategory("All")}
          >
            All
            <span>{resources.length}</span>
          </button>

          {availableCategories.map((item) => (
            <button
              type="button"
              key={item}
              className={activeCategory === item ? "active" : ""}
              onClick={() => setActiveCategory(item)}
            >
              {item}
              <span>{categoryCounts[item] || 0}</span>
            </button>
          ))}
        </div>

        {loadError && (
          <div className="rl-error">
            <AlertCircle size={18} />

            <div>
              <strong>Could not load resources</strong>
              <span>{loadError}</span>
            </div>

            <button type="button" onClick={fetchResources}>
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="rl-content-header">
          <div>
            <span className="rl-section-label">
              {activeCategory === "All"
                ? "RESOURCE LIBRARY"
                : activeCategory.toUpperCase()}
            </span>

            <h2>
              {activeCategory === "All"
                ? "Browse resources"
                : `${activeCategory} resources`}
            </h2>
          </div>

          <span className="rl-result-count">
            {filteredResources.length}{" "}
            {filteredResources.length === 1 ? "resource" : "resources"}
          </span>
        </div>

        {loading ? (
          <div className="rl-grid">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredResources.length === 0 ? (
          <EmptyState
            search={search}
            activeCategory={activeCategory}
            onReset={clearFilters}
          />
        ) : (
          <div className="rl-grid">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="rl-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="rl-modal">
            <div className="rl-modal-header">
              <div>
                <span>ADMIN ACTION</span>
                <h2>Add resource</h2>
                <p>
                  Share a useful learning link with the community.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rl-field">
                <label>Resource title</label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: React documentation"
                />
              </div>

              <div className="rl-form-row">
                <div className="rl-field">
                  <label>Category</label>

                <input
                 type="text"
                 required
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 placeholder="Example: DSA, Cybersecurity, Cloud"
/>
                </div>

                <div className="rl-field">
                  <label>Resource URL</label>

                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="rl-field">
                <label>
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain what this resource is useful for."
                />
              </div>

              <div className="rl-modal-footer">
                <button
                  type="button"
                  className="rl-cancel-button"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rl-submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="rl-small-spinner" />
                      Adding
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Add resource
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{resourceStyles}</style>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete resource?"
        message="Are you sure you want to delete this resource permanently?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

const resourceStyles = `
  .rl-page {
    min-height: 100vh;
    color: var(--text-primary);
    background:
      radial-gradient(
        circle at 8% 0%,
        rgba(99, 91, 255, 0.05),
        transparent 25%
      ),
      var(--bg-root);
  }

  .rl-container {
    width: min(100%, 1450px);
    margin: 0 auto;
    padding: 32px 42px 70px;
  }

  .rl-header {
    padding-bottom: 25px;
    border-bottom: 1px solid var(--bg-border);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 25px;
  }

  .rl-kicker {
    margin-bottom: 8px;
    color: var(--brand-violet);
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.11em;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .rl-header h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 900;
  }

  .rl-header p {
    max-width: 650px;
    margin: 9px 0 0;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.6;
  }

  .rl-add-button {
    min-height: 40px;
    padding: 0 15px;
    border: 0;
    border-radius: 10px;
    color: white;
    background: var(--gradient-brand);
    box-shadow: 0 8px 20px rgba(99, 91, 255, 0.18);
    font: inherit;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .rl-summary {
    margin: 18px 0;
    padding: 14px 18px;
    border: 1px solid var(--bg-border);
    border-radius: 14px;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .rl-summary-item {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .rl-summary-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 10px;
    display: grid;
    place-items: center;
  }

  .rl-summary-icon.violet {
    color: var(--brand-violet);
    background: rgba(99, 91, 255, 0.08);
  }

  .rl-summary-icon.blue {
    color: var(--brand-blue);
    background: rgba(59, 130, 246, 0.08);
  }

  .rl-summary-icon.green {
    color: var(--brand-emerald);
    background: rgba(16, 185, 129, 0.08);
  }

  .rl-summary-item strong,
  .rl-summary-item span {
    display: block;
  }

  .rl-summary-item strong {
    font-size: 0.92rem;
  }

  .rl-summary-item span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.62rem;
  }

  .rl-summary-divider {
    width: 1px;
    height: 32px;
    background: var(--bg-border);
  }

  .rl-toolbar {
    padding: 7px;
    border: 1px solid var(--bg-border);
    border-radius: 13px;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rl-search {
    min-height: 39px;
    flex: 1;
    padding: 0 11px;
    border: 1px solid var(--bg-border);
    border-radius: 9px;
    color: var(--text-muted);
    background: var(--bg-root);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rl-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: var(--text-primary);
    background: transparent;
    font: inherit;
    font-size: 0.72rem;
  }

  .rl-search button {
    border: 0;
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;
  }

  .rl-filter-label {
    padding: 0 10px;
    color: var(--text-muted);
    font-size: 0.66rem;
    font-weight: 750;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rl-categories {
    margin: 10px 0 30px;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .rl-categories::-webkit-scrollbar {
    display: none;
  }

  .rl-categories button {
    min-height: 34px;
    flex-shrink: 0;
    padding: 0 10px;
    border: 1px solid var(--bg-border);
    border-radius: 9px;
    color: var(--text-muted);
    background: var(--bg-card);
    font: inherit;
    font-size: 0.65rem;
    font-weight: 750;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .rl-categories button span {
    min-width: 19px;
    height: 19px;
    padding: 0 5px;
    border-radius: 6px;
    background: var(--bg-elevated);
    font-size: 0.57rem;
    display: grid;
    place-items: center;
  }

  .rl-categories button.active {
    color: white;
    border-color: transparent;
    background: var(--gradient-brand);
  }

  .rl-categories button.active span {
    background: rgba(255, 255, 255, 0.16);
  }

  .rl-content-header {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
  }

  .rl-section-label {
    color: var(--brand-violet);
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .rl-content-header h2 {
    margin: 4px 0 0;
    font-size: 1.15rem;
    letter-spacing: -0.035em;
  }

  .rl-result-count {
    color: var(--text-muted);
    font-size: 0.65rem;
  }

  .rl-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .rl-card {
    min-width: 0;
    min-height: 220px;
    padding: 17px;
    border: 1px solid var(--bg-border);
    border-radius: 15px;
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .rl-card:hover {
    transform: translateY(-3px);
    border-color: rgba(99, 91, 255, 0.25);
    box-shadow: 0 14px 35px rgba(25, 30, 60, 0.07);
  }

  .rl-card-top,
  .rl-card-actions,
  .rl-card-footer {
    display: flex;
    align-items: center;
  }

  .rl-card-top {
    justify-content: space-between;
    gap: 12px;
  }

  .rl-card-actions {
    gap: 6px;
  }

  .rl-resource-mark {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    display: grid;
    place-items: center;
  }

  .rl-resource-mark.frontend,
  .rl-category-badge.frontend {
    color: #2878d0;
    background: rgba(59, 130, 246, 0.09);
  }

  .rl-resource-mark.backend,
  .rl-category-badge.backend {
    color: var(--brand-violet);
    background: rgba(99, 91, 255, 0.09);
  }

  .rl-resource-mark.database,
  .rl-category-badge.database {
    color: #b97909;
    background: rgba(245, 158, 11, 0.09);
  }

  .rl-resource-mark.devops,
  .rl-category-badge.devops {
    color: #07865f;
    background: rgba(16, 185, 129, 0.09);
  }

  .rl-resource-mark.machine-learning,
  .rl-category-badge.machine-learning {
    color: #c23e83;
    background: rgba(236, 72, 153, 0.09);
  }

  .rl-resource-mark.general,
  .rl-category-badge.general {
    color: var(--text-muted);
    background: var(--bg-elevated);
  }

  .rl-category-badge {
    min-height: 25px;
    padding: 0 8px;
    border-radius: 7px;
    font-size: 0.57rem;
    font-weight: 800;
    display: flex;
    align-items: center;
  }

  .rl-delete-button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 7px;
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .rl-delete-button:hover {
    color: var(--brand-red);
    background: rgba(239, 68, 68, 0.08);
  }

  .rl-card-content {
    flex: 1;
    padding: 18px 0;
  }

  .rl-card-content h3 {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.4;
    letter-spacing: -0.02em;
  }

  .rl-card-content p {
    margin: 7px 0 0;
    color: var(--text-muted);
    font-size: 0.68rem;
    line-height: 1.65;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .rl-card-footer {
    padding-top: 12px;
    border-top: 1px solid var(--bg-border);
    justify-content: space-between;
    gap: 10px;
  }

  .rl-domain {
    min-width: 0;
    overflow: hidden;
    color: var(--text-muted);
    font-size: 0.6rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .rl-open-link {
    flex-shrink: 0;
    color: var(--brand-violet);
    font-size: 0.64rem;
    font-weight: 800;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .rl-empty {
    padding: 65px 25px;
    border: 1px dashed var(--bg-border);
    border-radius: 16px;
    text-align: center;
    background: var(--bg-card);
  }

  .rl-empty-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 13px;
    border-radius: 13px;
    color: var(--text-muted);
    background: var(--bg-elevated);
    display: grid;
    place-items: center;
  }

  .rl-empty h3 {
    margin: 0;
    font-size: 0.85rem;
  }

  .rl-empty p {
    margin: 6px auto 0;
    max-width: 420px;
    color: var(--text-muted);
    font-size: 0.68rem;
  }

  .rl-empty button {
    margin-top: 15px;
    border: 0;
    color: var(--brand-violet);
    background: transparent;
    font: inherit;
    font-size: 0.66rem;
    font-weight: 800;
    cursor: pointer;
  }

  .rl-error {
    margin-bottom: 20px;
    padding: 14px;
    border: 1px solid rgba(239, 68, 68, 0.18);
    border-radius: 13px;
    color: var(--brand-red);
    background: rgba(239, 68, 68, 0.055);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rl-error > div {
    flex: 1;
  }

  .rl-error strong,
  .rl-error span {
    display: block;
  }

  .rl-error strong {
    font-size: 0.7rem;
  }

  .rl-error span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.62rem;
  }

  .rl-error button {
    border: 0;
    color: var(--brand-red);
    background: transparent;
    font: inherit;
    font-size: 0.64rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .rl-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    padding: 20px;
    background: rgba(10, 12, 25, 0.72);
    backdrop-filter: blur(8px);
    display: grid;
    place-items: center;
  }

  .rl-modal {
    width: min(100%, 560px);
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    border: 1px solid var(--bg-border);
    border-radius: 18px;
    background: var(--bg-card);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
  }

  .rl-modal-header {
    padding: 22px 23px 18px;
    border-bottom: 1px solid var(--bg-border);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .rl-modal-header span {
    color: var(--brand-violet);
    font-size: 0.57rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .rl-modal-header h2 {
    margin: 4px 0 0;
    font-size: 1.2rem;
  }

  .rl-modal-header p {
    margin: 5px 0 0;
    color: var(--text-muted);
    font-size: 0.66rem;
  }

  .rl-modal-header > button {
    width: 32px;
    height: 32px;
    border: 1px solid var(--bg-border);
    border-radius: 8px;
    color: var(--text-muted);
    background: var(--bg-elevated);
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .rl-modal form {
    padding: 22px 23px;
  }

  .rl-field {
    margin-bottom: 16px;
  }

  .rl-field label {
    margin-bottom: 7px;
    color: var(--text-muted);
    font-size: 0.62rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rl-field label span {
    font-size: 0.57rem;
    font-weight: 500;
  }

  .rl-field input,
  .rl-field select,
  .rl-field textarea {
    width: 100%;
    border: 1px solid var(--bg-border);
    border-radius: 10px;
    outline: 0;
    color: var(--text-primary);
    background: var(--bg-root);
    font: inherit;
    font-size: 0.72rem;
  }

  .rl-field input,
  .rl-field select {
    min-height: 42px;
    padding: 0 12px;
  }

  .rl-field textarea {
    padding: 11px 12px;
    resize: vertical;
  }

  .rl-field input:focus,
  .rl-field select:focus,
  .rl-field textarea:focus {
    border-color: rgba(99, 91, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.07);
  }

  .rl-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 13px;
  }

  .rl-modal-footer {
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .rl-cancel-button,
  .rl-submit-button {
    min-height: 39px;
    padding: 0 14px;
    border-radius: 9px;
    font: inherit;
    font-size: 0.67rem;
    font-weight: 800;
    cursor: pointer;
  }

  .rl-cancel-button {
    border: 1px solid var(--bg-border);
    color: var(--text-secondary);
    background: var(--bg-elevated);
  }

  .rl-submit-button {
    border: 0;
    color: white;
    background: var(--gradient-brand);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rl-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 150;
    width: min(360px, calc(100vw - 36px));
    padding: 13px;
    border: 1px solid var(--bg-border);
    border-radius: 13px;
    background: var(--bg-card);
    box-shadow: 0 20px 60px rgba(20, 25, 55, 0.18);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rl-toast.success > svg {
    color: var(--brand-emerald);
  }

  .rl-toast.error > svg {
    color: var(--brand-red);
  }

  .rl-toast > div {
    min-width: 0;
    flex: 1;
  }

  .rl-toast strong,
  .rl-toast span {
    display: block;
  }

  .rl-toast strong {
    font-size: 0.69rem;
  }

  .rl-toast span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.61rem;
  }

  .rl-toast button {
    border: 0;
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;
  }

  .rl-loading {
    min-height: 80vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .rl-spinner,
  .rl-small-spinner {
    border-radius: 999px;
    animation: rl-spin 0.8s linear infinite;
  }

  .rl-spinner {
    width: 30px;
    height: 30px;
    margin-bottom: 15px;
    border: 3px solid rgba(99, 91, 255, 0.15);
    border-top-color: var(--brand-violet);
  }

  .rl-small-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
  }

  .rl-loading h2 {
    margin: 0;
    font-size: 0.95rem;
  }

  .rl-loading p {
    margin: 5px 0 0;
    color: var(--text-muted);
    font-size: 0.67rem;
  }

  @keyframes rl-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1050px) {
    .rl-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .rl-container {
      padding: 24px 20px 55px;
    }

    .rl-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .rl-summary {
      gap: 14px;
      overflow-x: auto;
    }

    .rl-summary-item {
      min-width: 130px;
    }

    .rl-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .rl-filter-label {
      display: none;
    }
  }

  @media (max-width: 580px) {
    .rl-grid {
      grid-template-columns: 1fr;
    }

    .rl-form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .rl-summary-divider {
      display: none;
    }

    .rl-content-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 7px;
    }
  }
`;