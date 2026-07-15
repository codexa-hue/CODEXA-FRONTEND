import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CardSkeleton } from "../components/Skeleton";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Filter,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Tag,
  Users,
  X,
  Code2,
  Rocket,
  FolderKanban,
  GitBranch
} from "lucide-react";

export default function Projects() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const data = await api.projects.getAll();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContributors("");
    setGithubUrl("");
    setLiveUrl("");
    setTagsStr("");
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    const contributorsList = contributors
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!contributorsList.length && profile?.name) {
      contributorsList.push(profile.name);
    }

    const tags = tagsStr
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await api.projects.create({
        title: title.trim(),
        description: description.trim(),
        contributors: contributorsList,
        github_url: githubUrl.trim() || null,
        live_url: liveUrl.trim() || null,
        tags,
        thumbnail_url: null,
      });

      setToast("Project published successfully");
      setShowModal(false);
      resetForm();

      await fetchProjects();

      setTimeout(() => {
        setToast("");
      }, 3000);
    } catch (err) {
      alert(err?.message || "Failed to add project.");
    } finally {
      setSubmitting(false);
    }
  };

  const availableTags = useMemo(() => {
    const tags = projects.flatMap((project) =>
      Array.isArray(project.tags) ? project.tags : []
    );

    return [
      "All",
      ...Array.from(new Set(tags))
        .filter(Boolean)
        .slice(0, 5),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const projectTags = Array.isArray(project.tags)
        ? project.tags
        : [];

      const projectContributors = Array.isArray(
        project.contributors
      )
        ? project.contributors
        : [];

      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        projectTags.some((tag) =>
          tag.toLowerCase().includes(query)
        ) ||
        projectContributors.some((person) =>
          person.toLowerCase().includes(query)
        );

      const matchesFilter =
        activeFilter === "All" ||
        projectTags.some(
          (tag) =>
            tag.toLowerCase() === activeFilter.toLowerCase()
        );

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, activeFilter]);

  const totalContributors = useMemo(() => {
    const contributorsSet = new Set();

    projects.forEach((project) => {
      if (Array.isArray(project.contributors)) {
        project.contributors.forEach((person) => {
          if (person) {
            contributorsSet.add(person.trim().toLowerCase());
          }
        });
      }
    });

    return contributorsSet.size;
  }, [projects]);

  const liveProjects = useMemo(() => {
    return projects.filter((project) => project.live_url).length;
  }, [projects]);

  const openProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleExternalLink = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="projects-saas-page">
      {toast && (
        <div className="projects-toast">
          <div className="projects-toast-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <strong>Project published</strong>
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="projects-page-container">

        {/* TOP NAVIGATION */}

        <div className="projects-topbar">
          <button
            type="button"
            className="projects-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            <span>Back</span>
          </button>

          <div className="projects-breadcrumb">
            <span>Workspace</span>
            <span className="projects-breadcrumb-dot">/</span>
            <strong>Projects</strong>
          </div>
        </div>

        {/* COMPACT WORKSPACE HEADER */}

        <section className="projects-workspace-header">
          <div className="projects-workspace-copy">
            <div className="projects-eyebrow">
              <Sparkles size={14} />
              COMMUNITY PROJECTS
            </div>

            <h1>Projects</h1>

            <p>
              Explore work built by CODEXA members, discover the
              technology behind it, and share what you are building.
            </p>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              className="projects-primary-button"
              onClick={() => setShowModal(true)}
            >
              <Plus size={17} />
              Share project
            </button>
          )}
        </section>

        <section className="projects-overview-grid">
          <div className="projects-overview-card">
            <div className="projects-overview-icon">
              <FolderKanban size={18} />
            </div>
            <div>
              <strong>{projects.length}</strong>
              <span>Total projects</span>
            </div>
          </div>

          <div className="projects-overview-card">
            <div className="projects-overview-icon">
              <Users size={18} />
            </div>
            <div>
              <strong>{totalContributors}</strong>
              <span>Builders</span>
            </div>
          </div>

          <div className="projects-overview-card">
            <div className="projects-overview-icon">
              <Rocket size={18} />
            </div>
            <div>
              <strong>{liveProjects}</strong>
              <span>Live demos</span>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}

        <section className="projects-toolbar-section">
          <div className="projects-section-heading">
            <div>
              <span className="projects-section-kicker">
                EXPLORE THE WORK
              </span>

              <h2>Community projects</h2>

              <p>
                Browse real work created and shared by
                CODEXA members.
              </p>
            </div>

            <div className="projects-count-pill">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1
                ? "project"
                : "projects"}
            </div>
          </div>

          <div className="projects-toolbar">
            <div className="projects-search">
              <Search size={18} />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search projects, tags or builders..."
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="projects-filter-label">
              <Filter size={15} />
              Filter
            </div>
          </div>

          {availableTags.length > 1 && (
            <div className="projects-filter-row">
              {availableTags.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={
                    activeFilter === filter
                      ? "projects-filter active"
                      : "projects-filter"
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* PROJECT GRID */}

        <section
          id="project-grid"
          className="projects-grid-section"
        >
          {loading ? (
            <div className="projects-grid">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty-state">
              <div className="projects-empty-icon">
                <Layers3 size={29} />
              </div>

              <span>NOTHING HERE YET</span>

              <h3>
                {projects.length === 0
                  ? "The showcase is ready for its first project."
                  : "No projects match your search."}
              </h3>

              <p>
                {projects.length === 0
                  ? "Share something you've built and give the community something worth exploring."
                  : "Try another search term or remove the active filter."}
              </p>

              {projects.length === 0 && isAuthenticated ? (
                <button
                  type="button"
                  className="projects-primary-button"
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={17} />
                  Share the first project
                </button>
              ) : (
                projects.length > 0 && (
                  <button
                    type="button"
                    className="projects-secondary-button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("All");
                    }}
                  >
                    Clear filters
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project, index) => {
                const projectContributors = Array.isArray(
                  project.contributors
                )
                  ? project.contributors
                  : [];

                const projectTags = Array.isArray(project.tags)
                  ? project.tags
                  : [];

                return (
                  <article
                    key={project.id}
                    className="project-saas-card"
                    onClick={() => openProject(project.id)}
                  >
                    <div className="project-card-top">
                      <div className="project-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="project-card-links">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleExternalLink}
                            aria-label="Open GitHub repository"
                          >
                            <GitBranch size={17} />
                          </a>
                        )}

                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleExternalLink}
                            aria-label="Open live demo"
                          >
                            <ExternalLink size={17} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="project-card-icon">
                      <Layers3 size={22} />
                    </div>

                    <div className="project-card-content">
                      <h3>{project.title}</h3>

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>
                    </div>

                    {projectTags.length > 0 && (
                      <div className="project-tags">
                        {projectTags
                          .slice(0, 4)
                          .map((tag) => (
                            <span key={tag}>
                              {tag}
                            </span>
                          ))}

                        {projectTags.length > 4 && (
                          <span>
                            +{projectTags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="project-card-footer">
                      <div className="project-contributors">
                        <div className="project-avatar-stack">
                          {projectContributors
                            .slice(0, 3)
                            .map((person, personIndex) => (
                              <span
                                key={`${person}-${personIndex}`}
                              >
                                {person
                                  ?.charAt(0)
                                  ?.toUpperCase() || "C"}
                              </span>
                            ))}
                        </div>

                        <div>
                          <small>BUILT BY</small>
                          <strong>
                            {projectContributors.length > 0
                              ? projectContributors
                                  .slice(0, 2)
                                  .join(", ")
                              : "CODEXA member"}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="project-open-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProject(project.id);
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM CTA */}

        {isAuthenticated && projects.length > 0 && (
          <section className="projects-bottom-cta">
            <div>
              <span>BUILT SOMETHING WORTH SHARING?</span>

              <h2>Put your work in front of the community.</h2>

              <p>
                Share the project, credit your collaborators,
                and give other members something to learn from.
              </p>
            </div>

            <button
              type="button"
              className="projects-primary-button"
              onClick={() => setShowModal(true)}
            >
              <Plus size={17} />
              Share project
              <ArrowRight size={16} />
            </button>
          </section>
        )}
      </div>

      {/* CREATE PROJECT MODAL */}

      {showModal && (
        <div
          className="project-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="project-modal">
            <div className="project-modal-header">
              <div>
                <div className="project-modal-kicker">
                  <Sparkles size={13} />
                  PUBLISH TO CODEXA
                </div>

                <h2>Share your project</h2>

                <p>
                  Add the essentials. Members can explore the
                  full project after publishing.
                </p>
              </div>

              <button
                type="button"
                className="project-modal-close"
                onClick={closeModal}
                disabled={submitting}
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="project-modal-form"
            >
              <div className="project-form-group">
                <label>
                  Project title
                  <span>Required</span>
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: AI Academic Scheduler"
                />
              </div>

              <div className="project-form-group">
                <label>
                  Description
                  <span>Required</span>
                </label>

                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="What does the project solve? What makes it useful?"
                />

                <small>
                  Write a clear summary instead of a feature list.
                </small>
              </div>

              <div className="project-form-grid">
                <div className="project-form-group">
                  <label>Contributors</label>

                  <input
                    type="text"
                    value={contributors}
                    onChange={(e) =>
                      setContributors(e.target.value)
                    }
                    placeholder="Alice, Bob"
                  />

                  <small>Separate names with commas.</small>
                </div>

                <div className="project-form-group">
                  <label>Technology tags</label>

                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) =>
                      setTagsStr(e.target.value)
                    }
                    placeholder="React, FastAPI, AI"
                  />

                  <small>Separate tags with commas.</small>
                </div>
              </div>

              <div className="project-form-grid">
                <div className="project-form-group">
                  <label>
                    <GitBranch size={14} />
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) =>
                      setGithubUrl(e.target.value)
                    }
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="project-form-group">
                  <label>
                    <ExternalLink size={14} />
                    Live demo URL
                  </label>

                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) =>
                      setLiveUrl(e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="project-modal-footer">
                <button
                  type="button"
                  className="project-modal-cancel"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="projects-primary-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="project-button-spinner" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Publish project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{projectsStyles}</style>
    </div>
  );
}

const projectsStyles = `
  .projects-saas-page,
  .projects-loading-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 4%, rgba(99, 91, 255, 0.08), transparent 28%),
      radial-gradient(circle at 88% 16%, rgba(124, 92, 255, 0.06), transparent 24%),
      var(--bg-primary, #f8f9ff);
    color: var(--text-primary, #0f1229);
  }

  .projects-page-container {
    width: min(100%, 1500px);
    margin: 0 auto;
    padding: 28px 44px 70px;
  }

  .projects-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 42px;
  }

  .projects-back-button {
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: var(--text-muted, #747b9c);
    font: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .projects-back-button:hover {
    color: var(--text-primary, #0f1229);
  }

  .projects-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--text-muted, #7c82a3);
  }

  .projects-breadcrumb strong {
    color: var(--text-primary, #0f1229);
  }

  .projects-breadcrumb-dot {
    opacity: 0.45;
  }

  .projects-workspace-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    padding: 8px 0 26px;
  }

  .projects-workspace-copy {
    max-width: 720px;
  }

  .projects-eyebrow,
  .project-modal-kicker {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #635bff;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .projects-workspace-header h1 {
    margin: 10px 0 8px;
    font-size: clamp(2.1rem, 3.2vw, 3.4rem);
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 850;
  }

  .projects-workspace-header p {
    max-width: 650px;
    margin: 0;
    color: var(--text-secondary, #515977);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .projects-overview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin: 4px 0 30px;
  }

  .projects-overview-card {
    min-height: 86px;
    border: 1px solid var(--bg-border, #e1e4ef);
    border-radius: 16px;
    background: var(--bg-card, white);
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 8px 24px rgba(31, 38, 77, 0.04);
  }

  .projects-overview-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
  }

  .projects-overview-card strong,
  .projects-overview-card span {
    display: block;
  }

  .projects-overview-card strong {
    font-size: 1.35rem;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .projects-overview-card span {
    margin-top: 5px;
    color: var(--text-muted, #747b9c);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .projects-primary-button,
  .projects-secondary-button {
    min-height: 48px;
    border-radius: 12px;
    padding: 0 20px;
    font: inherit;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease;
  }

  .projects-primary-button {
    border: 1px solid transparent;
    color: white;
    background: linear-gradient(135deg, #635bff, #7658f7);
    box-shadow: 0 13px 30px rgba(99, 91, 255, 0.2);
  }

  .projects-primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(99, 91, 255, 0.27);
  }

  .projects-primary-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  .projects-secondary-button {
    border: 1px solid var(--bg-border, #dde1f0);
    background: var(--bg-card, white);
    color: var(--text-primary, #0f1229);
  }

  .projects-secondary-button:hover {
    border-color: rgba(99, 91, 255, 0.38);
    transform: translateY(-2px);
  }

  .projects-hero-panel {
    border: 1px solid var(--bg-border, #e1e4f0);
    background: var(--bg-card, white);
    border-radius: 24px;
    padding: 26px;
    box-shadow: 0 30px 80px rgba(31, 38, 77, 0.1);
  }

  .projects-hero-panel-top,
  .projects-panel-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .projects-hero-panel-top span {
    color: #747b9c;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .projects-hero-panel-top h3 {
    margin: 6px 0 0;
    font-size: 1.25rem;
  }

  .projects-panel-icon {
    width: 45px;
    height: 45px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: #635bff;
    background: rgba(99, 91, 255, 0.1);
  }

  .projects-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 28px 0;
  }

  .projects-stat {
    min-width: 0;
    border: 1px solid var(--bg-border, #e2e5f0);
    border-radius: 16px;
    padding: 18px;
    background: var(--bg-elevated, #fafaff);
  }

  .projects-stat-icon {
    color: #635bff;
    margin-bottom: 22px;
  }

  .projects-stat strong {
    display: block;
    font-size: 1.65rem;
    letter-spacing: -0.05em;
  }

  .projects-stat span {
    display: block;
    margin-top: 5px;
    color: var(--text-muted, #7b82a2);
    font-size: 0.72rem;
  }

  .projects-panel-footer {
    border-top: 1px solid var(--bg-border, #e2e5f0);
    padding-top: 19px;
    color: var(--text-muted, #7b82a2);
  }

  .projects-live-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .projects-live-indicator span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #14b88a;
    box-shadow: 0 0 0 5px rgba(20, 184, 138, 0.1);
  }

  .projects-toolbar-section {
    border-top: 1px solid var(--bg-border, #e1e4ef);
    padding: 68px 0 26px;
  }

  .projects-section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 28px;
  }

  .projects-section-kicker {
    color: #635bff;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .projects-section-heading h2 {
    margin: 8px 0 7px;
    font-size: clamp(2rem, 3vw, 3.15rem);
    letter-spacing: -0.055em;
  }

  .projects-section-heading p {
    margin: 0;
    color: var(--text-muted, #747b9c);
  }

  .projects-count-pill {
    flex-shrink: 0;
    border: 1px solid var(--bg-border, #e1e4ef);
    border-radius: 999px;
    padding: 9px 14px;
    background: var(--bg-card, white);
    color: var(--text-muted, #747b9c);
    font-size: 0.76rem;
    font-weight: 800;
  }

  .projects-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .projects-search {
    flex: 1;
    min-height: 52px;
    border: 1px solid var(--bg-border, #dfe3ef);
    border-radius: 14px;
    background: var(--bg-card, white);
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 16px;
    color: var(--text-muted, #7c82a3);
  }

  .projects-search:focus-within {
    border-color: rgba(99, 91, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(99, 91, 255, 0.08);
  }

  .projects-search input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text-primary, #0f1229);
    font: inherit;
    font-size: 0.9rem;
  }

  .projects-search button {
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 4px;
  }

  .projects-filter-label {
    min-height: 52px;
    padding: 0 18px;
    border: 1px solid var(--bg-border, #dfe3ef);
    border-radius: 14px;
    background: var(--bg-card, white);
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #747b9c);
    font-size: 0.82rem;
    font-weight: 800;
  }

  .projects-filter-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 14px;
  }

  .projects-filter {
    border: 1px solid var(--bg-border, #dfe3ef);
    border-radius: 999px;
    padding: 8px 14px;
    background: var(--bg-card, white);
    color: var(--text-muted, #747b9c);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
  }

  .projects-filter.active {
    color: #635bff;
    border-color: rgba(99, 91, 255, 0.25);
    background: rgba(99, 91, 255, 0.08);
  }

  .projects-grid-section {
    padding: 22px 0 70px;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .project-saas-card {
    min-height: 400px;
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 20px;
    background: var(--bg-card, white);
    padding: 23px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition:
      transform 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .project-saas-card:hover {
    transform: translateY(-6px);
    border-color: rgba(99, 91, 255, 0.3);
    box-shadow: 0 24px 60px rgba(31, 38, 77, 0.1);
  }

  .project-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .project-number {
    color: var(--text-muted, #8b91ac);
    font-size: 0.67rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .project-card-links {
    display: flex;
    gap: 7px;
  }

  .project-card-links a,
  .project-open-button {
    width: 36px;
    height: 36px;
    border: 1px solid var(--bg-border, #e1e4ef);
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--text-muted, #747b9c);
    background: var(--bg-elevated, #fafaff);
    transition: 180ms ease;
  }

  .project-card-links a:hover,
  .project-open-button:hover {
    color: #635bff;
    border-color: rgba(99, 91, 255, 0.3);
    background: rgba(99, 91, 255, 0.08);
  }

  .project-card-icon {
    width: 50px;
    height: 50px;
    margin: 26px 0 22px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #635bff;
    background: linear-gradient(
      135deg,
      rgba(99, 91, 255, 0.12),
      rgba(124, 92, 255, 0.05)
    );
  }

  .project-card-content {
    flex: 1;
  }

  .project-card-content h3 {
    margin: 0 0 10px;
    font-size: 1.25rem;
    letter-spacing: -0.035em;
  }

  .project-card-content p {
    margin: 0;
    color: var(--text-secondary, #5c6380);
    font-size: 0.87rem;
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 22px;
  }

  .project-tags span {
    padding: 6px 9px;
    border-radius: 7px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.08);
    font-size: 0.66rem;
    font-weight: 800;
  }

  .project-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 24px;
    padding-top: 19px;
    border-top: 1px solid var(--bg-border, #e2e5ef);
  }

  .project-contributors {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .project-avatar-stack {
    display: flex;
  }

  .project-avatar-stack span {
    width: 29px;
    height: 29px;
    margin-left: -7px;
    border: 2px solid var(--bg-card, white);
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: #635bff;
    color: white;
    font-size: 0.65rem;
    font-weight: 900;
  }

  .project-avatar-stack span:first-child {
    margin-left: 0;
  }

  .project-contributors small,
  .project-contributors strong {
    display: block;
  }

  .project-contributors small {
    color: var(--text-muted, #8a90aa);
    font-size: 0.55rem;
    font-weight: 900;
    letter-spacing: 0.09em;
  }

  .project-contributors strong {
    max-width: 170px;
    margin-top: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.74rem;
  }

  .project-open-button {
    flex-shrink: 0;
    cursor: pointer;
  }

  .projects-empty-state {
    min-height: 400px;
    border: 1px dashed var(--bg-border, #d9deeb);
    border-radius: 22px;
    background: var(--bg-card, white);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 50px 25px;
  }

  .projects-empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
    margin-bottom: 22px;
  }

  .projects-empty-state > span {
    color: #635bff;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .projects-empty-state h3 {
    max-width: 580px;
    margin: 11px 0;
    font-size: 1.65rem;
    letter-spacing: -0.04em;
  }

  .projects-empty-state p {
    max-width: 570px;
    margin: 0 0 23px;
    color: var(--text-muted, #747b9c);
    line-height: 1.7;
  }

  .projects-bottom-cta {
    border-radius: 24px;
    padding: 42px;
    color: white;
    background:
      radial-gradient(circle at 90% 20%, rgba(124, 92, 255, 0.38), transparent 35%),
      #11152a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }

  .projects-bottom-cta span {
    color: #a9a4ff;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.11em;
  }

  .projects-bottom-cta h2 {
    max-width: 650px;
    margin: 10px 0;
    font-size: clamp(1.8rem, 3vw, 3rem);
    letter-spacing: -0.055em;
  }

  .projects-bottom-cta p {
    max-width: 650px;
    margin: 0;
    color: #aeb5cc;
    line-height: 1.7;
  }

  .projects-toast {
    position: fixed;
    right: 26px;
    bottom: 26px;
    z-index: 100;
    min-width: 290px;
    padding: 14px;
    border: 1px solid rgba(20, 184, 138, 0.22);
    border-radius: 15px;
    background: var(--bg-card, white);
    box-shadow: 0 20px 60px rgba(31, 38, 77, 0.16);
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .projects-toast-icon {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: #0b9d76;
    background: rgba(20, 184, 138, 0.1);
  }

  .projects-toast strong,
  .projects-toast span {
    display: block;
  }

  .projects-toast strong {
    font-size: 0.82rem;
  }

  .projects-toast span {
    margin-top: 2px;
    color: var(--text-muted, #747b9c);
    font-size: 0.7rem;
  }

  .project-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    padding: 24px;
    background: rgba(11, 14, 30, 0.62);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
  }

  .project-modal {
    width: min(100%, 760px);
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    border: 1px solid var(--bg-border, #e1e4ef);
    border-radius: 24px;
    background: var(--bg-card, white);
    box-shadow: 0 35px 100px rgba(8, 12, 30, 0.28);
  }

  .project-modal-header {
    padding: 28px 30px 24px;
    border-bottom: 1px solid var(--bg-border, #e1e4ef);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 30px;
  }

  .project-modal-header h2 {
    margin: 9px 0 6px;
    font-size: 1.75rem;
    letter-spacing: -0.045em;
  }

  .project-modal-header p {
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.86rem;
  }

  .project-modal-close {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: 1px solid var(--bg-border, #e1e4ef);
    border-radius: 11px;
    background: var(--bg-elevated, #fafaff);
    color: var(--text-muted, #747b9c);
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .project-modal-form {
    padding: 27px 30px 30px;
  }

  .project-form-group {
    margin-bottom: 19px;
  }

  .project-form-group label {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-primary, #0f1229);
    font-size: 0.76rem;
    font-weight: 800;
  }

  .project-form-group label span {
    margin-left: auto;
    color: var(--text-muted, #8a90aa);
    font-size: 0.62rem;
    font-weight: 700;
  }

  .project-form-group input,
  .project-form-group textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--bg-border, #dfe3ef);
    border-radius: 12px;
    outline: none;
    background: var(--bg-elevated, #fafaff);
    color: var(--text-primary, #0f1229);
    font: inherit;
    font-size: 0.88rem;
    padding: 13px 14px;
    transition: 180ms ease;
  }

  .project-form-group textarea {
    resize: vertical;
    min-height: 110px;
    line-height: 1.6;
  }

  .project-form-group input:focus,
  .project-form-group textarea:focus {
    border-color: rgba(99, 91, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(99, 91, 255, 0.08);
    background: var(--bg-card, white);
  }

  .project-form-group small {
    display: block;
    margin-top: 7px;
    color: var(--text-muted, #8a90aa);
    font-size: 0.66rem;
  }

  .project-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .project-modal-footer {
    margin-top: 8px;
    padding-top: 22px;
    border-top: 1px solid var(--bg-border, #e1e4ef);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .project-modal-cancel {
    min-height: 48px;
    padding: 0 19px;
    border: 1px solid var(--bg-border, #dfe3ef);
    border-radius: 12px;
    background: transparent;
    color: var(--text-secondary, #515977);
    font: inherit;
    font-size: 0.84rem;
    font-weight: 800;
    cursor: pointer;
  }

  .project-button-spinner,
  .projects-loading-spinner {
    border-radius: 999px;
    border-style: solid;
    animation: projects-spin 0.8s linear infinite;
  }

  .project-button-spinner {
    width: 16px;
    height: 16px;
    border-width: 2px;
    border-color: rgba(255,255,255,0.4);
    border-top-color: white;
  }

  .projects-loading-page {
    display: grid;
    place-items: center;
    padding: 30px;
  }

  .projects-loading-box {
    text-align: center;
  }

  .projects-loading-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 22px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    color: #635bff;
    background: rgba(99, 91, 255, 0.1);
  }

  .projects-loading-spinner {
    width: 28px;
    height: 28px;
    margin: 0 auto 20px;
    border-width: 3px;
    border-color: rgba(99, 91, 255, 0.15);
    border-top-color: #635bff;
  }

  .projects-loading-box h2 {
    margin: 0 0 7px;
    font-size: 1.2rem;
  }

  .projects-loading-box p {
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.84rem;
  }

  @keyframes projects-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1180px) {
    .projects-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .projects-page-container {
      padding: 22px 18px 50px;
    }

    .projects-topbar {
      margin-bottom: 24px;
    }

    .projects-breadcrumb {
      display: none;
    }

    .projects-workspace-header {
      align-items: flex-start;
      flex-direction: column;
      padding-bottom: 22px;
    }

    .projects-workspace-header .projects-primary-button {
      width: 100%;
    }

    .projects-overview-grid {
      grid-template-columns: 1fr;
    }

    .projects-section-heading,
    .projects-bottom-cta {
      align-items: flex-start;
      flex-direction: column;
    }

    .projects-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .projects-filter-label {
      display: none;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .project-form-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .project-modal-overlay {
      padding: 12px;
    }

    .project-modal {
      max-height: calc(100vh - 24px);
    }

    .project-modal-header,
    .project-modal-form {
      padding-left: 20px;
      padding-right: 20px;
    }

    .project-modal-footer {
      flex-direction: column-reverse;
    }

    .project-modal-footer button {
      width: 100%;
    }

    .projects-bottom-cta {
      padding: 30px 24px;
    }

    .projects-toast {
      left: 18px;
      right: 18px;
      bottom: 18px;
      min-width: 0;
    }
  }
`;