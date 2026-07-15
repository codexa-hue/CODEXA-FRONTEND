// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { api } from '../services/api';
// import { ArrowLeft, Tag, Users, ExternalLink, AlertCircle, Calendar } from 'lucide-react';
// import { Github } from '../components/SocialIcons';

// export default function ProjectDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.projects.getAll()
//       .then((all) => setProject(all.find((p) => p.id === id) || null))
//       .catch(() => setProject(null))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return (
//     <div className="min-h-[80vh] flex items-center justify-center">
//       <div className="w-10 h-10 spinner" />
//     </div>
//   );

//   if (!project) return (
//     <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-text-muted">
//       <AlertCircle size={40} className="opacity-30" />
//       <p className="text-sm">Project not found.</p>
//       <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Go Back</button>
//     </div>
//   );

//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

//       <button onClick={() => navigate(-1)}
//         className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 group transition-colors">
//         <span className="w-8 h-8 rounded-xl bg-bg-card border border-bg-border flex items-center justify-center group-hover:border-brand-violet/40 transition-all">
//           <ArrowLeft size={15} />
//         </span>
//         Back to Projects
//       </button>

//       {/* Thumbnail */}
//       {project.thumbnail_url && (
//         <div className="rounded-2xl overflow-hidden border border-bg-border mb-6">
//           <img src={project.thumbnail_url} alt={project.title} className="w-full max-h-72 object-cover" />
//         </div>
//       )}

//       <div className="card p-6 sm:p-8">
//         {/* Accent strip */}
//         <div className="h-1 w-16 rounded-full bg-gradient-brand mb-6" />

//         <h1 className="font-display font-black text-2xl text-text-primary mb-2">{project.title}</h1>

//         {/* Meta row */}
//         <div className="flex flex-wrap items-center gap-3 mb-6 pb-5 border-b border-bg-border">
//           <div className="flex items-center gap-1.5 text-xs text-text-muted">
//             <Users size={13} />
//             <span>{project.contributors.join(', ')}</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-xs text-text-muted">
//             <Calendar size={13} />
//             <span>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line mb-6">
//           {project.description}
//         </p>

//         {/* Tags */}
//         {project.tags?.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-6">
//             {project.tags.map((tag) => (
//               <span key={tag} className="badge badge-violet">
//                 <Tag size={10} /> {tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Links */}
//         <div className="flex flex-wrap gap-3 pt-5 border-t border-bg-border">
//           {project.github_url && (
//             <a href={project.github_url} target="_blank" rel="noreferrer"
//               className="btn-secondary text-sm gap-2">
//               <Github size={15} /> View Repository
//             </a>
//           )}
//           {project.live_url && (
//             <a href={project.live_url} target="_blank" rel="noreferrer"
//               className="btn-primary text-sm gap-2">
//               <ExternalLink size={15} /> Live Demo
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

import {
  ArrowLeft,
  ArrowRight,
  Tag,
  Users,
  ExternalLink,
  AlertCircle,
  Calendar,
  Layers3,
  Code2,
  CheckCircle2,
} from "lucide-react";

import { Github } from "../components/SocialIcons";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);

      try {
        const all = await api.projects.getAll();

        const foundProject =
          all.find(
            (item) => String(item.id) === String(id)
          ) || null;

        setProject(foundProject);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="project-detail-loading">
          <div className="project-detail-loading-box">
            <div className="project-detail-loading-icon">
              <Layers3 size={24} />
            </div>

            <div className="project-detail-spinner" />

            <h2>Loading project</h2>

            <p>
              Getting the project details ready.
            </p>
          </div>
        </div>

        <style>{projectDetailStyles}</style>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="project-detail-not-found">
          <div className="project-not-found-icon">
            <AlertCircle size={28} />
          </div>

          <span>PROJECT NOT FOUND</span>

          <h2>
            This project is no longer available.
          </h2>

          <p>
            It may have been removed or the project
            link may be incorrect.
          </p>

          <button
            type="button"
            className="project-detail-secondary-button"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft size={16} />
            Back to projects
          </button>
        </div>

        <style>{projectDetailStyles}</style>
      </>
    );
  }

  const contributors = Array.isArray(
    project.contributors
  )
    ? project.contributors
    : [];

  const tags = Array.isArray(project.tags)
    ? project.tags
    : [];

  const createdDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Date unavailable";

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">

        {/* TOP BAR */}

        <div className="project-detail-topbar">
          <button
            type="button"
            className="project-detail-back"
            onClick={() => navigate("/projects")}
          >
            <span>
              <ArrowLeft size={16} />
            </span>

            Back to projects
          </button>

          <div className="project-detail-breadcrumb">
            <button
              type="button"
              onClick={() => navigate("/projects")}
            >
              Projects
            </button>

            <span>/</span>

            <strong>{project.title}</strong>
          </div>
        </div>

        {/* COMPACT HEADER */}

        <section className="project-detail-header">
          <div className="project-detail-header-main">

            <div className="project-detail-project-icon">
              <Code2 size={24} />
            </div>

            <div className="project-detail-title-area">
              <div className="project-detail-kicker">
                <CheckCircle2 size={13} />
                COMMUNITY PROJECT
              </div>

              <h1>{project.title}</h1>

              <p>
                Explore the project, the people behind it,
                and the technology used to build it.
              </p>
            </div>
          </div>

          <div className="project-detail-header-actions">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="project-detail-secondary-button"
              >
                <Github size={16} />
                Repository
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="project-detail-primary-button"
              >
                <ExternalLink size={16} />
                Live demo
              </a>
            )}
          </div>
        </section>

        {/* CONTENT */}

        <div className="project-detail-layout">

          {/* MAIN CONTENT */}

          <main className="project-detail-main">

            {/* THUMBNAIL */}

            {project.thumbnail_url && (
              <div className="project-detail-thumbnail">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                />
              </div>
            )}

            {/* ABOUT */}

            <section className="project-detail-card">
              <div className="project-detail-card-heading">
                <div>
                  <span>OVERVIEW</span>
                  <h2>About this project</h2>
                </div>

                <Layers3 size={20} />
              </div>

              <div className="project-detail-description">
                {project.description ? (
                  <p>{project.description}</p>
                ) : (
                  <p className="project-detail-muted">
                    No project description has been added.
                  </p>
                )}
              </div>
            </section>

            {/* TECHNOLOGY */}

            {tags.length > 0 && (
              <section className="project-detail-card">
                <div className="project-detail-card-heading">
                  <div>
                    <span>TECHNOLOGY</span>
                    <h2>Tools and technologies</h2>
                  </div>

                  <Tag size={19} />
                </div>

                <div className="project-detail-tags">
                  {tags.map((tag) => (
                    <span key={tag}>
                      <Code2 size={13} />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* SIDEBAR */}

          <aside className="project-detail-sidebar">

            {/* PROJECT INFO */}

            <section className="project-detail-side-card">
              <div className="project-detail-side-heading">
                <span>PROJECT DETAILS</span>
                <h3>Information</h3>
              </div>

              <div className="project-detail-info-list">
                <div className="project-detail-info-item">
                  <div className="project-detail-info-icon">
                    <Calendar size={16} />
                  </div>

                  <div>
                    <span>Published</span>
                    <strong>{createdDate}</strong>
                  </div>
                </div>

                <div className="project-detail-info-item">
                  <div className="project-detail-info-icon">
                    <Users size={16} />
                  </div>

                  <div>
                    <span>Contributors</span>
                    <strong>
                      {contributors.length || 1}
                    </strong>
                  </div>
                </div>

                <div className="project-detail-info-item">
                  <div className="project-detail-info-icon">
                    <Tag size={16} />
                  </div>

                  <div>
                    <span>Technologies</span>
                    <strong>{tags.length}</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTRIBUTORS */}

            <section className="project-detail-side-card">
              <div className="project-detail-side-heading">
                <span>BUILT BY</span>
                <h3>Contributors</h3>
              </div>

              <div className="project-detail-contributors">
                {contributors.length > 0 ? (
                  contributors.map(
                    (contributor, index) => (
                      <div
                        className="project-detail-contributor"
                        key={`${contributor}-${index}`}
                      >
                        <div className="project-detail-avatar">
                          {contributor
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <strong>{contributor}</strong>
                          <span>Project contributor</span>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="project-detail-contributor">
                    <div className="project-detail-avatar">
                      C
                    </div>

                    <div>
                      <strong>CODEXA Member</strong>
                      <span>Project contributor</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* LINKS */}

            {(project.github_url ||
              project.live_url) && (
              <section className="project-detail-side-card">
                <div className="project-detail-side-heading">
                  <span>PROJECT LINKS</span>
                  <h3>Explore the work</h3>
                </div>

                <div className="project-detail-links">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div>
                        <span className="project-detail-link-icon">
                          <Github size={16} />
                        </span>

                        <div>
                          <strong>
                            Source repository
                          </strong>

                          <small>
                            View the project code
                          </small>
                        </div>
                      </div>

                      <ArrowRight size={16} />
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div>
                        <span className="project-detail-link-icon">
                          <ExternalLink size={16} />
                        </span>

                        <div>
                          <strong>Live project</strong>

                          <small>
                            Open the deployed version
                          </small>
                        </div>
                      </div>

                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      <style>{projectDetailStyles}</style>
    </div>
  );
}

const projectDetailStyles = `
  .project-detail-page,
  .project-detail-loading,
  .project-detail-not-found {
    min-height: 100vh;
    background:
      radial-gradient(
        circle at 10% 0%,
        rgba(99, 91, 255, 0.055),
        transparent 26%
      ),
      var(--bg-primary, #f8f9ff);
    color: var(--text-primary, #10132b);
  }

  .project-detail-container {
    width: min(100%, 1450px);
    margin: 0 auto;
    padding: 28px 42px 70px;
  }

  /* TOP BAR */

  .project-detail-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    margin-bottom: 32px;
  }

  .project-detail-back {
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--text-muted, #747b9c);
    font: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .project-detail-back > span {
    width: 34px;
    height: 34px;
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 10px;
    background: var(--bg-card, #ffffff);
    display: grid;
    place-items: center;
    transition: 180ms ease;
  }

  .project-detail-back:hover {
    color: var(--text-primary, #10132b);
  }

  .project-detail-back:hover > span {
    color: #635bff;
    border-color: rgba(99, 91, 255, 0.3);
  }

  .project-detail-breadcrumb {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #8187a4);
    font-size: 0.75rem;
  }

  .project-detail-breadcrumb button {
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .project-detail-breadcrumb button:hover {
    color: #635bff;
  }

  .project-detail-breadcrumb strong {
    max-width: 250px;
    color: var(--text-primary, #10132b);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* HEADER */

  .project-detail-header {
    padding-bottom: 30px;
    border-bottom: 1px solid var(--bg-border, #e1e4ef);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
  }

  .project-detail-header-main {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 18px;
  }

  .project-detail-project-icon {
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    border-radius: 16px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
    display: grid;
    place-items: center;
  }

  .project-detail-title-area {
    min-width: 0;
  }

  .project-detail-kicker {
    color: #635bff;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .project-detail-title-area h1 {
    margin: 8px 0 7px;
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1.05;
    letter-spacing: -0.055em;
    font-weight: 900;
  }

  .project-detail-title-area p {
    max-width: 660px;
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .project-detail-header-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .project-detail-primary-button,
  .project-detail-secondary-button {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 11px;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .project-detail-primary-button {
    border: 1px solid transparent;
    color: #ffffff;
    background: linear-gradient(
      135deg,
      #635bff,
      #7658f7
    );
    box-shadow: 0 10px 24px rgba(99, 91, 255, 0.18);
  }

  .project-detail-primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(99, 91, 255, 0.25);
  }

  .project-detail-secondary-button {
    border: 1px solid var(--bg-border, #dfe3ef);
    color: var(--text-primary, #10132b);
    background: var(--bg-card, #ffffff);
  }

  .project-detail-secondary-button:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 91, 255, 0.35);
  }

  /* LAYOUT */

  .project-detail-layout {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(280px, 340px);
    gap: 20px;
    align-items: start;
    padding-top: 28px;
  }

  .project-detail-main,
  .project-detail-sidebar {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* THUMBNAIL */

  .project-detail-thumbnail {
    width: 100%;
    max-height: 430px;
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 18px;
    overflow: hidden;
    background: var(--bg-card, #ffffff);
  }

  .project-detail-thumbnail img {
    width: 100%;
    max-height: 430px;
    display: block;
    object-fit: cover;
  }

  /* MAIN CARDS */

  .project-detail-card,
  .project-detail-side-card {
    border: 1px solid var(--bg-border, #e0e4ef);
    background: var(--bg-card, #ffffff);
  }

  .project-detail-card {
    border-radius: 18px;
    padding: 27px;
  }

  .project-detail-card-heading {
    padding-bottom: 19px;
    margin-bottom: 21px;
    border-bottom: 1px solid var(--bg-border, #e4e6ef);
    color: var(--text-muted, #8187a4);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .project-detail-card-heading span,
  .project-detail-side-heading span {
    color: #635bff;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .project-detail-card-heading h2 {
    margin: 6px 0 0;
    color: var(--text-primary, #10132b);
    font-size: 1.25rem;
    letter-spacing: -0.035em;
  }

  .project-detail-description p {
    margin: 0;
    color: var(--text-secondary, #555d7a);
    font-size: 0.9rem;
    line-height: 1.85;
    white-space: pre-line;
  }

  .project-detail-description .project-detail-muted {
    color: var(--text-muted, #858ba6);
  }

  .project-detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .project-detail-tags span {
    min-height: 34px;
    padding: 0 12px;
    border: 1px solid rgba(99, 91, 255, 0.12);
    border-radius: 9px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.07);
    font-size: 0.72rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  /* SIDEBAR */

  .project-detail-side-card {
    border-radius: 16px;
    padding: 21px;
  }

  .project-detail-side-heading {
    margin-bottom: 18px;
  }

  .project-detail-side-heading h3 {
    margin: 5px 0 0;
    font-size: 1rem;
    letter-spacing: -0.025em;
  }

  .project-detail-info-list {
    display: flex;
    flex-direction: column;
  }

  .project-detail-info-item {
    padding: 14px 0;
    border-top: 1px solid var(--bg-border, #e4e6ef);
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .project-detail-info-icon,
  .project-detail-link-icon {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border-radius: 10px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.08);
    display: grid;
    place-items: center;
  }

  .project-detail-info-item span,
  .project-detail-info-item strong {
    display: block;
  }

  .project-detail-info-item span {
    color: var(--text-muted, #858ba6);
    font-size: 0.65rem;
  }

  .project-detail-info-item strong {
    margin-top: 3px;
    font-size: 0.76rem;
  }

  /* CONTRIBUTORS */

  .project-detail-contributors {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .project-detail-contributor {
    min-width: 0;
    padding: 10px;
    border-radius: 11px;
    background: var(--bg-elevated, #fafaff);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .project-detail-avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    color: #ffffff;
    background: linear-gradient(
      135deg,
      #635bff,
      #7c5cff
    );
    font-size: 0.72rem;
    font-weight: 900;
    display: grid;
    place-items: center;
  }

  .project-detail-contributor > div:last-child {
    min-width: 0;
  }

  .project-detail-contributor strong,
  .project-detail-contributor span {
    display: block;
  }

  .project-detail-contributor strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.76rem;
  }

  .project-detail-contributor span {
    margin-top: 3px;
    color: var(--text-muted, #858ba6);
    font-size: 0.62rem;
  }

  /* LINKS */

  .project-detail-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .project-detail-links a {
    padding: 11px;
    border: 1px solid var(--bg-border, #e3e6ef);
    border-radius: 11px;
    color: var(--text-primary, #10132b);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    transition: 180ms ease;
  }

  .project-detail-links a:hover {
    border-color: rgba(99, 91, 255, 0.3);
    transform: translateX(2px);
  }

  .project-detail-links a > div {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .project-detail-links strong,
  .project-detail-links small {
    display: block;
  }

  .project-detail-links strong {
    font-size: 0.73rem;
  }

  .project-detail-links small {
    margin-top: 3px;
    color: var(--text-muted, #858ba6);
    font-size: 0.6rem;
  }

  /* LOADING */

  .project-detail-loading,
  .project-detail-not-found {
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-detail-loading-box,
  .project-detail-not-found {
    text-align: center;
  }

  .project-detail-loading-icon,
  .project-not-found-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border-radius: 18px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
    display: grid;
    place-items: center;
  }

  .project-detail-spinner {
    width: 27px;
    height: 27px;
    margin: 0 auto 18px;
    border: 3px solid rgba(99, 91, 255, 0.15);
    border-top-color: #635bff;
    border-radius: 999px;
    animation: project-detail-spin 0.8s linear infinite;
  }

  .project-detail-loading-box h2,
  .project-detail-not-found h2 {
    margin: 0 0 7px;
    font-size: 1.2rem;
  }

  .project-detail-loading-box p,
  .project-detail-not-found p {
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.82rem;
  }

  .project-detail-not-found {
    flex-direction: column;
  }

  .project-detail-not-found > span {
    color: #635bff;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .project-detail-not-found h2 {
    margin-top: 9px;
  }

  .project-detail-not-found p {
    max-width: 430px;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  @keyframes project-detail-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* RESPONSIVE */

  @media (max-width: 1050px) {
    .project-detail-layout {
      grid-template-columns: 1fr;
    }

    .project-detail-sidebar {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .project-detail-container {
      padding: 20px 18px 50px;
    }

    .project-detail-breadcrumb {
      display: none;
    }

    .project-detail-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .project-detail-header-main {
      flex-direction: column;
    }

    .project-detail-header-actions {
      width: 100%;
    }

    .project-detail-header-actions a {
      flex: 1;
    }

    .project-detail-sidebar {
      display: flex;
    }

    .project-detail-card {
      padding: 21px;
    }
  }

  @media (max-width: 520px) {
    .project-detail-header-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .project-detail-title-area h1 {
      font-size: 2rem;
    }
  }
`;