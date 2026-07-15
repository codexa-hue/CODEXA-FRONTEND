import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { getFullUploadUrl } from "../utils/url";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Megaphone,
  RefreshCw,
  Rss,
  Search,
  Trophy,
  Users,
  X,
} from "lucide-react";



const TABS = [
  { id: "all", label: "Overview", icon: Rss },
  { id: "events", label: "Events", icon: Calendar },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    id: "resources",
    label: "Resources",
    icon: BookOpen,
  },
  {
    id: "challenges",
    label: "Challenges",
    icon: Trophy,
  },
];

const getMediaUrl = (url) => {
  return getFullUploadUrl(url);
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Date unavailable";
  }

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "Time unavailable";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Time unavailable";
  }

  return value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortDate = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function EventCard({
  event,
  profile,
  isAuthenticated,
  onRegister,
  registeringId,
}) {
  const navigate = useNavigate();

  const registeredUsers = Array.isArray(
    event.registered_users
  )
    ? event.registered_users
    : [];

  const registered = profile
    ? registeredUsers.some(
        (userId) =>
          String(userId) === String(profile.user_id)
      )
    : false;

  const seatsLeft = event.max_seats
    ? Math.max(
        Number(event.max_seats) -
          registeredUsers.length,
        0
      )
    : null;

  const isFull =
    seatsLeft !== null && seatsLeft <= 0;

  const isPast =
    event.date &&
    new Date(event.date) < new Date();

  const hasForm = Boolean(
    event.google_form_url
  );

  const mediaUrl = getMediaUrl(
    event.image_url || event.video_url
  );

  const handleOpen = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <article
      className="mh-event-card"
      onClick={handleOpen}
    >
      <div className="mh-event-media">
        {event.image_url ? (
          <img
            src={mediaUrl}
            alt={event.title}
          />
        ) : event.video_url ? (
          <video
            src={mediaUrl}
            muted
            preload="metadata"
          />
        ) : (
          <div className="mh-event-placeholder">
            <CalendarDays size={28} />
          </div>
        )}

        <span
          className={`mh-status ${
            isPast
              ? "ended"
              : isFull
              ? "full"
              : "open"
          }`}
        >
          <span />

          {isPast
            ? "Ended"
            : isFull
            ? "Full"
            : "Open"}
        </span>
      </div>

      <div className="mh-event-body">
        <div className="mh-card-eyebrow">
          <Calendar size={12} />
          Event
        </div>

        <h3>{event.title}</h3>

        <p className="mh-card-description">
          {event.description ||
            "No event description available."}
        </p>

        <div className="mh-event-meta">
          <div>
            <Clock size={14} />

            <span>
              {formatDate(event.date)}
              <small>
                {formatTime(event.date)}
              </small>
            </span>
          </div>

          <div>
            <MapPin size={14} />

            <span>
              {event.location ||
                "Location not announced"}
            </span>
          </div>
        </div>

        {event.max_seats && !isPast && (
          <div className="mh-seat-row">
            <div>
              <Users size={13} />

              <span>
                {isFull
                  ? "Fully booked"
                  : `${seatsLeft} seats available`}
              </span>
            </div>

            <small>
              {registeredUsers.length}/
              {event.max_seats}
            </small>
          </div>
        )}

        <div
          className="mh-event-footer"
          onClick={(e) => e.stopPropagation()}
        >
          {!isPast && isAuthenticated ? (
            registered ? (
              <div className="mh-registered-actions">
                <div className="mh-registered">
                  <CheckCircle2 size={14} />
                  Registered
                </div>

                {hasForm && (
                  <a
                    href={event.google_form_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mh-form-link"
                  >
                    Form
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="mh-register-button"
                disabled={
                  isFull ||
                  registeringId === event.id
                }
                onClick={() =>
                  onRegister(
                    event.id,
                    event.google_form_url
                  )
                }
              >
                {registeringId === event.id ? (
                  <>
                    <span className="mh-button-spinner" />
                    Registering
                  </>
                ) : isFull ? (
                  "Event full"
                ) : (
                  <>
                    Register
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            )
          ) : !isPast ? (
            <Link
              to="/login"
              className="mh-signin-button"
            >
              Sign in to register
            </Link>
          ) : (
            <span className="mh-ended-label">
              Event completed
            </span>
          )}

          <button
            type="button"
            className="mh-details-button"
            onClick={handleOpen}
          >
            Details
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

function AnnouncementCard({ announcement }) {
  const navigate = useNavigate();

  const mediaUrl = getMediaUrl(
    announcement.image_url ||
      announcement.video_url
  );

  return (
    <article
      className="mh-announcement-card"
      onClick={() =>
        navigate(
          `/announcements/${announcement.id}`
        )
      }
    >
      <div className="mh-announcement-media">
        {announcement.image_url ? (
          <img
            src={mediaUrl}
            alt={announcement.title}
          />
        ) : announcement.video_url ? (
          <video
            src={mediaUrl}
            muted
            preload="metadata"
          />
        ) : (
          <div className="mh-announcement-placeholder">
            <Megaphone size={26} />
          </div>
        )}
      </div>

      <div className="mh-announcement-body">
        <div className="mh-announcement-top">
          <span>
            <Megaphone size={11} />
            Announcement
          </span>

          <time>
            {formatShortDate(
              announcement.created_at
            )}
          </time>
        </div>

        <h3>{announcement.title}</h3>

        <p>
          {announcement.content ||
            "No announcement content available."}
        </p>

        <div className="mh-announcement-footer">
          <span>
            By{" "}
            <strong>
              {announcement.author || "CODEXA"}
            </strong>
          </span>

          <span className="mh-read-more">
            Read
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}

function ResourceCard({ resource }) {
  return (
    <article className="mh-resource-card">
      <div className="mh-resource-icon">
        <BookOpen size={20} />
      </div>

      <div className="mh-resource-content">
        <div className="mh-resource-top">
          <span>
            {resource.category || "Resource"}
          </span>
        </div>

        <h3>{resource.title}</h3>

        <p>
          {resource.description ||
            "Open this learning resource to explore more."}
        </p>

        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
        >
          Open resource
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  count,
  description,
  action,
}) {
  return (
    <div className="mh-section-header">
      <div>
        {eyebrow && (
          <span className="mh-section-eyebrow">
            {eyebrow}
          </span>
        )}

        <div className="mh-section-title-row">
          <h2>{title}</h2>

          {count > 0 && (
            <span className="mh-count">
              {count}
            </span>
          )}
        </div>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mh-empty">
      <div>
        <Icon size={22} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

export default function MemberHome() {
  const { isAuthenticated, profile } =
    useAuth();

  const [events, setEvents] = useState([]);
  const [
    announcements,
    setAnnouncements,
  ] = useState([]);
  const [resources, setResources] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [activeTab, setActiveTab] =
    useState("all");

  const [search, setSearch] = useState("");

  const [registeringId, setRegisteringId] =
    useState(null);

  // Weekly Coding Challenges States
  const [challenges, setChallenges] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [submissionComments, setSubmissionComments] = useState('');
  const [submittingChallenge, setSubmittingChallenge] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const loadFeed = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        eventData,
        announcementData,
        resourceData,
        challengeData,
        subData,
      ] = await Promise.all([
        api.events.getAll(),
        api.announcements.getAll(),
        api.resources.getAll(),
        api.challenges.getAll(),
        api.challenges.getMySubmissions(),
      ]);

      setEvents(
        Array.isArray(eventData)
          ? eventData
          : []
      );

      setAnnouncements(
        Array.isArray(announcementData)
          ? announcementData
          : []
      );

      setResources(
        Array.isArray(resourceData)
          ? resourceData
          : []
      );

      setChallenges(
        Array.isArray(challengeData)
          ? challengeData
          : []
      );

      setMySubmissions(
        Array.isArray(subData)
          ? subData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load member feed:",
        err
      );

      setError(
        "The club feed could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChallengeSolution = async (e) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    setSubmittingChallenge(true);
    try {
      await api.challenges.submit(selectedChallenge.id, githubUrl, submissionComments);
      showToast('Solution submitted! Pending review.', 'success');
      setGithubUrl('');
      setSubmissionComments('');
      setShowChallengeModal(false);
      setSelectedChallenge(null);
      // Reload submissions list
      const subData = await api.challenges.getMySubmissions();
      setMySubmissions(Array.isArray(subData) ? subData : []);
    } catch (err) {
      showToast(err.message || 'Failed to submit solution.', 'error');
    } finally {
      setSubmittingChallenge(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 4000);
  };

  const handleRegister = async (
    eventId,
    googleFormUrl
  ) => {
    if (registeringId) return;

    setRegisteringId(eventId);

    try {
      await api.events.register(eventId);

      const updatedEvents =
        await api.events.getAll();

      setEvents(
        Array.isArray(updatedEvents)
          ? updatedEvents
          : []
      );

      if (googleFormUrl) {
        window.open(
          googleFormUrl,
          "_blank",
          "noopener,noreferrer"
        );

        showToast(
          "Registered. Complete the form to confirm your place."
        );
      } else {
        showToast(
          "Registration completed successfully."
        );
      }
    } catch (err) {
      showToast(
        err?.message ||
          "Failed to register for the event.",
        "error"
      );
    } finally {
      setRegisteringId(null);
    }
  };

  const upcoming = useMemo(() => {
    return events
      .filter(
        (event) =>
          new Date(event.date) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      );
  }, [events]);

  const past = useMemo(() => {
    return events
      .filter(
        (event) =>
          new Date(event.date) < new Date()
      )
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
  }, [events]);

  const soonEvents = useMemo(() => {
    return upcoming.filter((event) => {
      const difference =
        new Date(event.date) - new Date();

      return (
        difference > 0 &&
        difference <
          3 * 24 * 60 * 60 * 1000
      );
    });
  }, [upcoming]);

  const query = search
    .trim()
    .toLowerCase();

  const filteredEvents = useMemo(() => {
    if (!query) return events;

    return events.filter((event) =>
      [
        event.title,
        event.description,
        event.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, query]);

  const filteredAnnouncements =
    useMemo(() => {
      if (!query) return announcements;

      return announcements.filter(
        (announcement) =>
          [
            announcement.title,
            announcement.content,
            announcement.author,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [announcements, query]);

  const filteredResources = useMemo(() => {
    if (!query) return resources;

    return resources.filter((resource) =>
      [
        resource.title,
        resource.description,
        resource.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [resources, query]);

  if (loading) {
    return (
      <>
        <div className="mh-loading">
          <div className="mh-loading-spinner" />

          <h2>Loading club feed</h2>

          <p>
            Getting the latest CODEXA activity.
          </p>
        </div>

        <style>{memberHomeStyles}</style>
      </>
    );
  }

  return (
    <div className="mh-page">
      {toast.message && (
        <div
          className={`mh-toast ${toast.type}`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <div>
            <strong>
              {toast.type === "success"
                ? "Success"
                : "Something went wrong"}
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

      <div className="mh-container">
        <header className="mh-header">
          <div>
            <div className="mh-kicker">
              <Rss size={13} />
              CLUB FEED
            </div>

            <h1>What's happening</h1>

            <p>
              Events, announcements and resources
              from the CODEXA community.
            </p>
          </div>

          <div className="mh-header-stats">
            <div>
              <strong>{upcoming.length}</strong>
              <span>Upcoming</span>
            </div>

            <div>
              <strong>
                {announcements.length}
              </strong>
              <span>Updates</span>
            </div>

            <div>
              <strong>{resources.length}</strong>
              <span>Resources</span>
            </div>
          </div>
        </header>

        <div className="mh-workspace-bar">
          <div className="mh-tabs">
            {TABS.map(
              ({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  className={
                    activeTab === id
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            )}
          </div>

          <div className="mh-search">
            <Search size={15} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search club feed"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mh-error">
            <AlertCircle size={18} />

            <div>
              <strong>
                Could not load the feed
              </strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadFeed}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {soonEvents.length > 0 &&
          activeTab === "all" && (
            <section className="mh-soon">
              <div className="mh-soon-icon">
                <AlertTriangle size={18} />
              </div>

              <div className="mh-soon-content">
                <span>COMING UP SOON</span>

                <strong>
                  {soonEvents[0].title}
                </strong>

                <p>
                  {formatDate(
                    soonEvents[0].date
                  )}{" "}
                  at{" "}
                  {formatTime(
                    soonEvents[0].date
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("events")
                }
              >
                View event
                <ArrowRight size={14} />
              </button>
            </section>
          )}

        {activeTab === "all" && (
          <div className="mh-overview">
            <section>
              <SectionHeader
                eyebrow="LATEST"
                title="Announcements"
                count={announcements.length}
                description="Important updates from the club."
                action={
                  announcements.length > 3 ? (
                    <button
                      className="mh-view-all"
                      onClick={() =>
                        setActiveTab(
                          "announcements"
                        )
                      }
                    >
                      View all
                      <ArrowRight size={13} />
                    </button>
                  ) : null
                }
              />

              {filteredAnnouncements.length ===
              0 ? (
                <EmptyState
                  icon={Megaphone}
                  title="No announcements"
                  description="New club updates will appear here."
                />
              ) : (
                <div className="mh-announcement-grid">
                  {filteredAnnouncements
                    .slice(0, 3)
                    .map((announcement) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={
                          announcement
                        }
                      />
                    ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader
                eyebrow="UPCOMING"
                title="Events"
                count={upcoming.length}
                description="Join the next CODEXA activities."
                action={
                  upcoming.length > 3 ? (
                    <button
                      className="mh-view-all"
                      onClick={() =>
                        setActiveTab("events")
                      }
                    >
                      View all
                      <ArrowRight size={13} />
                    </button>
                  ) : null
                }
              />

              {upcoming.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No upcoming events"
                  description="New events will appear here when they are published."
                />
              ) : (
                <div className="mh-event-grid">
                  {upcoming
                    .slice(0, 3)
                    .map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        profile={profile}
                        isAuthenticated={
                          isAuthenticated
                        }
                        onRegister={
                          handleRegister
                        }
                        registeringId={
                          registeringId
                        }
                      />
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "events" && (
          <div className="mh-tab-content">
            <section>
              <SectionHeader
                eyebrow="EVENTS"
                title="Upcoming events"
                count={
                  filteredEvents.filter(
                    (event) =>
                      new Date(event.date) >=
                      new Date()
                  ).length
                }
                description="Register, participate and build with the community."
              />

              {filteredEvents.filter(
                (event) =>
                  new Date(event.date) >=
                  new Date()
              ).length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No upcoming events"
                  description={
                    query
                      ? "No events match your search."
                      : "New events will appear here."
                  }
                />
              ) : (
                <div className="mh-event-grid">
                  {filteredEvents
                    .filter(
                      (event) =>
                        new Date(event.date) >=
                        new Date()
                    )
                    .map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        profile={profile}
                        isAuthenticated={
                          isAuthenticated
                        }
                        onRegister={
                          handleRegister
                        }
                        registeringId={
                          registeringId
                        }
                      />
                    ))}
                </div>
              )}
            </section>

            {past.length > 0 && !query && (
              <section>
                <SectionHeader
                  eyebrow="ARCHIVE"
                  title="Past events"
                  count={past.length}
                  description="Previous activities from the CODEXA community."
                />

                <div className="mh-event-grid">
                  {past.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      profile={profile}
                      isAuthenticated={
                        isAuthenticated
                      }
                      onRegister={handleRegister}
                      registeringId={
                        registeringId
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <section className="mh-tab-content">
            <SectionHeader
              eyebrow="CLUB UPDATES"
              title="Announcements"
              count={
                filteredAnnouncements.length
              }
              description="Official updates and important information."
            />

            {filteredAnnouncements.length ===
            0 ? (
              <EmptyState
                icon={Bell}
                title="No announcements found"
                description={
                  query
                    ? "Try a different search."
                    : "New announcements will appear here."
                }
              />
            ) : (
              <div className="mh-announcement-grid">
                {filteredAnnouncements.map(
                  (announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "resources" && (
          <section className="mh-tab-content">
            <SectionHeader
              eyebrow="LEARNING"
              title="Resources"
              count={filteredResources.length}
              description="Useful material shared with the community."
            />

            {filteredResources.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No resources found"
                description={
                  query
                    ? "Try a different search."
                    : "Learning resources will appear here."
                }
              />
            ) : (
              <div className="mh-resource-grid">
                {filteredResources.map(
                  (resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "challenges" && (
          <section className="mh-tab-content">
            <SectionHeader
              eyebrow="CODING QUESTS"
              title="Weekly Challenges"
              count={challenges.length}
              description="Solve weekly algorithms and programming prompts to climb the leaderboard."
            />

            {challenges.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No active challenges"
                description="Check back later for new coding challenges!"
              />
            ) : (
              <div className="mh-resource-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {challenges.map((chal) => {
                  const submission = mySubmissions.find((s) => s.challenge_id === chal.id);
                  return (
                    <div
                      key={chal.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--bg-border)',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: 'var(--card-shadow)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background:
                                chal.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' :
                                chal.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' :
                                'rgba(239,68,68,0.1)',
                              color:
                                chal.difficulty === 'Easy' ? 'var(--brand-emerald)' :
                                chal.difficulty === 'Medium' ? 'var(--brand-amber)' :
                                'var(--brand-red)',
                            }}
                          >
                            {chal.difficulty}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--brand-violet)' }}>
                            +{chal.points} points
                          </span>
                        </div>

                        <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '4px 0', color: 'var(--text-primary)' }}>
                          {chal.title}
                        </h3>

                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '8px 0 16px' }}>
                          {chal.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', borderTop: '1px solid var(--bg-border)', paddingTop: '14px' }}>
                        {chal.link && (
                          <a
                            href={chal.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: 'var(--brand-blue)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            View Prompt Link <ExternalLink size={10} />
                          </a>
                        )}

                        {submission ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                              <strong
                                style={{
                                  color:
                                    submission.status === 'Approved' ? 'var(--brand-emerald)' :
                                    submission.status === 'Rejected' ? 'var(--brand-red)' :
                                    'var(--brand-blue)',
                                }}
                              >
                                {submission.status}
                              </strong>
                            </div>
                            {submission.status === 'Approved' && (
                              <span style={{ fontSize: '10px', color: 'var(--brand-emerald)', fontWeight: 'bold' }}>
                                ✓ Completed (+{chal.points} pts awarded)
                              </span>
                            )}
                            {submission.status === 'Rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedChallenge(chal);
                                  setGithubUrl(submission.github_url);
                                  setSubmissionComments(submission.comments || '');
                                  setShowChallengeModal(true);
                                }}
                                style={{
                                  marginTop: '6px',
                                  padding: '8px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  color: 'var(--brand-red)',
                                  background: 'rgba(239,68,68,0.06)',
                                  border: '1px solid rgba(239,68,68,0.2)',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                }}
                              >
                                Resubmit Solution
                              </button>
                            )}
                            {submission.feedback && (
                              <div style={{ marginTop: '6px', padding: '8px', fontSize: '11px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }}>
                                <strong style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', color: 'var(--brand-violet)', marginBottom: '3px' }}>Admin Feedback</strong>
                                {submission.feedback}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChallenge(chal);
                              setGithubUrl('');
                              setSubmissionComments('');
                              setShowChallengeModal(true);
                            }}
                            style={{
                              padding: '8px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: '#fff',
                              background: 'var(--brand-violet)',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            Submit Solution
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {showChallengeModal && selectedChallenge && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => {
            if (!submittingChallenge) {
              setShowChallengeModal(false);
              setSelectedChallenge(null);
            }
          }}
        >
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: '20px',
              padding: '28px',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--brand-violet)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Weekly Quest Submission
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  {selectedChallenge.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowChallengeModal(false);
                  setSelectedChallenge(null);
                }}
                disabled={submittingChallenge}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitChallengeSolution} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  GitHub Repository Link
                  <span style={{ color: 'var(--brand-red)', marginLeft: '2px' }}>*</span>
                </label>
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username/repo-name"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  Notes / Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionComments}
                  onChange={(e) => setSubmissionComments(e.target.value)}
                  placeholder="Describe your solution approach or notes for the reviewer..."
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowChallengeModal(false);
                    setSelectedChallenge(null);
                  }}
                  disabled={submittingChallenge}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: '1px solid var(--bg-border)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingChallenge}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#fff',
                    background: 'var(--brand-violet)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    opacity: submittingChallenge ? 0.7 : 1,
                  }}
                >
                  {submittingChallenge ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{memberHomeStyles}</style>
    </div>
  );
}

const memberHomeStyles = `
  .mh-page {
    min-height: 100vh;
    color: var(--text-primary);
    background:
      radial-gradient(
        circle at 5% 0%,
        rgba(99, 91, 255, 0.05),
        transparent 24%
      ),
      var(--bg-root);
  }

  .mh-container {
    width: min(100%, 1450px);
    margin: 0 auto;
    padding: 32px 42px 70px;
  }

  .mh-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    padding-bottom: 26px;
    border-bottom: 1px solid var(--bg-border);
  }

  .mh-kicker {
    margin-bottom: 8px;
    color: var(--brand-violet);
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.11em;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .mh-header h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 900;
  }

  .mh-header p {
    margin: 9px 0 0;
    color: var(--text-muted);
    font-size: 0.86rem;
  }

  .mh-header-stats {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mh-header-stats > div {
    min-width: 92px;
    padding: 11px 14px;
    border: 1px solid var(--bg-border);
    border-radius: 12px;
    background: var(--bg-card);
  }

  .mh-header-stats strong,
  .mh-header-stats span {
    display: block;
  }

  .mh-header-stats strong {
    font-size: 1rem;
  }

  .mh-header-stats span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.62rem;
  }

  .mh-workspace-bar {
    position: sticky;
    top: 0;
    z-index: 20;
    margin: 18px 0 24px;
    padding: 7px;
    border: 1px solid var(--bg-border);
    border-radius: 14px;
    background: color-mix(
      in srgb,
      var(--bg-card) 92%,
      transparent
    );
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .mh-tabs {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .mh-tabs button {
    min-height: 38px;
    padding: 0 13px;
    border: 0;
    border-radius: 9px;
    color: var(--text-muted);
    background: transparent;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 750;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: 160ms ease;
  }

  .mh-tabs button:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
  }

  .mh-tabs button.active {
    color: #ffffff;
    background: var(--gradient-brand);
    box-shadow: 0 7px 18px rgba(99, 91, 255, 0.18);
  }

  .mh-search {
    width: min(280px, 100%);
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--bg-border);
    border-radius: 9px;
    color: var(--text-muted);
    background: var(--bg-root);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mh-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: var(--text-primary);
    background: transparent;
    font: inherit;
    font-size: 0.72rem;
  }

  .mh-search button {
    border: 0;
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;
  }

  .mh-soon {
    margin-bottom: 28px;
    padding: 14px 16px;
    border: 1px solid rgba(245, 158, 11, 0.18);
    border-radius: 14px;
    background: rgba(245, 158, 11, 0.055);
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .mh-soon-icon {
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 11px;
    color: #c98208;
    background: rgba(245, 158, 11, 0.11);
    display: grid;
    place-items: center;
  }

  .mh-soon-content {
    min-width: 0;
    flex: 1;
  }

  .mh-soon-content span,
  .mh-soon-content strong,
  .mh-soon-content p {
    display: block;
  }

  .mh-soon-content span {
    color: #c98208;
    font-size: 0.58rem;
    font-weight: 900;
    letter-spacing: 0.09em;
  }

  .mh-soon-content strong {
    margin-top: 3px;
    font-size: 0.78rem;
  }

  .mh-soon-content p {
    margin: 2px 0 0;
    color: var(--text-muted);
    font-size: 0.64rem;
  }

  .mh-soon > button,
  .mh-view-all {
    border: 0;
    padding: 0;
    color: var(--brand-violet);
    background: transparent;
    font: inherit;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mh-overview,
  .mh-tab-content {
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .mh-section-header {
    margin-bottom: 16px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  .mh-section-eyebrow {
    color: var(--brand-violet);
    font-size: 0.59rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .mh-section-title-row {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mh-section-title-row h2 {
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: -0.035em;
  }

  .mh-count {
    min-width: 24px;
    height: 22px;
    padding: 0 7px;
    border-radius: 7px;
    color: var(--text-muted);
    background: var(--bg-elevated);
    font-size: 0.65rem;
    font-weight: 800;
    display: grid;
    place-items: center;
  }

  .mh-section-header p {
    margin: 5px 0 0;
    color: var(--text-muted);
    font-size: 0.72rem;
  }

  .mh-event-grid,
  .mh-announcement-grid {
    display: grid;
    grid-template-columns: repeat(
      3,
      minmax(0, 1fr)
    );
    gap: 15px;
  }

  .mh-event-card,
  .mh-announcement-card {
    min-width: 0;
    border: 1px solid var(--bg-border);
    border-radius: 16px;
    overflow: hidden;
    background: var(--bg-card);
    cursor: pointer;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .mh-event-card:hover,
  .mh-announcement-card:hover {
    transform: translateY(-3px);
    border-color: rgba(99, 91, 255, 0.25);
    box-shadow: 0 14px 35px rgba(25, 30, 60, 0.07);
  }

  .mh-event-media,
  .mh-announcement-media {
    position: relative;
    height: 150px;
    overflow: hidden;
    border-bottom: 1px solid var(--bg-border);
    background: var(--bg-elevated);
  }

  .mh-event-media img,
  .mh-event-media video,
  .mh-announcement-media img,
  .mh-announcement-media video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 250ms ease;
  }

  .mh-event-card:hover img,
  .mh-announcement-card:hover img {
    transform: scale(1.035);
  }

  .mh-event-placeholder,
  .mh-announcement-placeholder {
    width: 100%;
    height: 100%;
    color: rgba(99, 91, 255, 0.25);
    background:
      radial-gradient(
        circle at 25% 20%,
        rgba(99, 91, 255, 0.1),
        transparent 35%
      ),
      var(--bg-elevated);
    display: grid;
    place-items: center;
  }

  .mh-status {
    position: absolute;
    top: 11px;
    right: 11px;
    min-height: 25px;
    padding: 0 9px;
    border-radius: 999px;
    backdrop-filter: blur(10px);
    font-size: 0.61rem;
    font-weight: 850;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mh-status > span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
  }

  .mh-status.open {
    color: #087e5b;
    background: rgba(235, 255, 248, 0.92);
  }

  .mh-status.open > span {
    background: #10b981;
  }

  .mh-status.full {
    color: #a96b08;
    background: rgba(255, 248, 230, 0.94);
  }

  .mh-status.full > span {
    background: #f59e0b;
  }

  .mh-status.ended {
    color: #bd4658;
    background: rgba(255, 240, 242, 0.94);
  }

  .mh-status.ended > span {
    background: #ef4444;
  }

  .mh-event-body,
  .mh-announcement-body {
    padding: 17px;
  }

  .mh-card-eyebrow,
  .mh-announcement-top > span {
    color: var(--brand-violet);
    font-size: 0.59rem;
    font-weight: 850;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mh-event-body h3,
  .mh-announcement-body h3,
  .mh-resource-card h3 {
    margin: 7px 0 6px;
    font-size: 0.92rem;
    line-height: 1.35;
    letter-spacing: -0.025em;
  }

  .mh-card-description,
  .mh-announcement-body > p,
  .mh-resource-card p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.7rem;
    line-height: 1.65;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .mh-card-description {
    min-height: 45px;
    -webkit-line-clamp: 2;
  }

  .mh-event-meta {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mh-event-meta > div {
    min-width: 0;
    color: var(--text-muted);
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .mh-event-meta svg {
    margin-top: 1px;
    flex-shrink: 0;
    color: var(--brand-violet);
  }

  .mh-event-meta span {
    min-width: 0;
    font-size: 0.66rem;
    line-height: 1.4;
  }

  .mh-event-meta small {
    margin-left: 5px;
    color: var(--text-muted);
  }

  .mh-seat-row {
    margin-top: 13px;
    padding-top: 11px;
    border-top: 1px solid var(--bg-border);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .mh-seat-row > div {
    font-size: 0.63rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mh-seat-row small {
    font-size: 0.6rem;
  }

  .mh-event-footer {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 9px;
  }

  .mh-register-button,
  .mh-signin-button {
    min-height: 35px;
    padding: 0 12px;
    border: 1px solid rgba(99, 91, 255, 0.18);
    border-radius: 9px;
    color: var(--brand-violet);
    background: rgba(99, 91, 255, 0.07);
    font: inherit;
    font-size: 0.66rem;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .mh-register-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mh-details-button {
    border: 0;
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    font: inherit;
    font-size: 0.64rem;
    font-weight: 750;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mh-registered-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mh-registered,
  .mh-form-link {
    min-height: 34px;
    padding: 0 9px;
    border-radius: 8px;
    font-size: 0.63rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mh-registered {
    color: #07865f;
    background: rgba(16, 185, 129, 0.08);
  }

  .mh-form-link {
    color: var(--brand-blue);
    background: rgba(59, 130, 246, 0.07);
    text-decoration: none;
  }

  .mh-ended-label {
    color: var(--text-muted);
    font-size: 0.64rem;
  }

  .mh-announcement-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .mh-announcement-top time {
    color: var(--text-muted);
    font-size: 0.59rem;
  }

  .mh-announcement-body > p {
    min-height: 52px;
    -webkit-line-clamp: 3;
  }

  .mh-announcement-footer {
    margin-top: 14px;
    padding-top: 11px;
    border-top: 1px solid var(--bg-border);
    color: var(--text-muted);
    font-size: 0.61rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mh-read-more {
    color: var(--brand-violet);
    font-weight: 750;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mh-resource-grid {
    display: grid;
    grid-template-columns: repeat(
      3,
      minmax(0, 1fr)
    );
    gap: 14px;
  }

  .mh-resource-card {
    padding: 18px;
    border: 1px solid var(--bg-border);
    border-radius: 15px;
    background: var(--bg-card);
    display: flex;
    align-items: flex-start;
    gap: 13px;
  }

  .mh-resource-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    color: var(--brand-violet);
    background: rgba(99, 91, 255, 0.08);
    display: grid;
    place-items: center;
  }

  .mh-resource-content {
    min-width: 0;
  }

  .mh-resource-top span {
    color: var(--brand-violet);
    font-size: 0.58rem;
    font-weight: 850;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .mh-resource-card p {
    min-height: 34px;
    -webkit-line-clamp: 2;
  }

  .mh-resource-card a {
    margin-top: 12px;
    color: var(--brand-blue);
    font-size: 0.65rem;
    font-weight: 800;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .mh-empty {
    padding: 48px 25px;
    border: 1px dashed var(--bg-border);
    border-radius: 16px;
    text-align: center;
    background: var(--bg-card);
  }

  .mh-empty > div {
    width: 46px;
    height: 46px;
    margin: 0 auto 12px;
    border-radius: 13px;
    color: var(--text-muted);
    background: var(--bg-elevated);
    display: grid;
    place-items: center;
  }

  .mh-empty h3 {
    margin: 0;
    font-size: 0.84rem;
  }

  .mh-empty p {
    margin: 5px 0 0;
    color: var(--text-muted);
    font-size: 0.68rem;
  }

  .mh-error {
    margin-bottom: 20px;
    padding: 14px;
    border: 1px solid rgba(239, 68, 68, 0.18);
    border-radius: 13px;
    color: #d04b5d;
    background: rgba(239, 68, 68, 0.055);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mh-error > div {
    flex: 1;
  }

  .mh-error strong,
  .mh-error span {
    display: block;
  }

  .mh-error strong {
    font-size: 0.72rem;
  }

  .mh-error span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.63rem;
  }

  .mh-error button {
    border: 0;
    color: #d04b5d;
    background: transparent;
    font: inherit;
    font-size: 0.65rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mh-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 100;
    width: min(370px, calc(100vw - 36px));
    padding: 14px;
    border: 1px solid var(--bg-border);
    border-radius: 14px;
    background: var(--bg-card);
    box-shadow: 0 20px 60px rgba(20, 25, 55, 0.18);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mh-toast.success > svg {
    color: #10b981;
  }

  .mh-toast.error > svg {
    color: #ef4444;
  }

  .mh-toast > div {
    min-width: 0;
    flex: 1;
  }

  .mh-toast strong,
  .mh-toast span {
    display: block;
  }

  .mh-toast strong {
    font-size: 0.72rem;
  }

  .mh-toast span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 0.63rem;
  }

  .mh-toast button {
    border: 0;
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;
  }

  .mh-loading {
    min-height: 80vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .mh-loading-spinner,
  .mh-button-spinner {
    border-radius: 999px;
    animation: mh-spin 0.8s linear infinite;
  }

  .mh-loading-spinner {
    width: 30px;
    height: 30px;
    margin-bottom: 16px;
    border: 3px solid rgba(99, 91, 255, 0.15);
    border-top-color: var(--brand-violet);
  }

  .mh-button-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(99, 91, 255, 0.2);
    border-top-color: var(--brand-violet);
  }

  .mh-loading h2 {
    margin: 0;
    font-size: 1rem;
  }

  .mh-loading p {
    margin: 5px 0 0;
    color: var(--text-muted);
    font-size: 0.7rem;
  }

  @keyframes mh-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1100px) {
    .mh-event-grid,
    .mh-announcement-grid,
    .mh-resource-grid {
      grid-template-columns: repeat(
        2,
        minmax(0, 1fr)
      );
    }

    .mh-header {
      align-items: flex-start;
    }
  }

  @media (max-width: 850px) {
    .mh-container {
      padding: 24px 20px 55px;
    }

    .mh-header {
      flex-direction: column;
    }

    .mh-workspace-bar {
      position: static;
      align-items: stretch;
      flex-direction: column;
    }

    .mh-tabs {
      overflow-x: auto;
    }

    .mh-tabs button {
      flex-shrink: 0;
    }

    .mh-search {
      width: 100%;
    }
  }

  @media (max-width: 620px) {
    .mh-header-stats {
      width: 100%;
    }

    .mh-header-stats > div {
      min-width: 0;
      flex: 1;
    }

    .mh-event-grid,
    .mh-announcement-grid,
    .mh-resource-grid {
      grid-template-columns: 1fr;
    }

    .mh-soon {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .mh-soon > button {
      margin-left: 52px;
    }

    .mh-section-header {
      align-items: flex-start;
    }
  }
`;