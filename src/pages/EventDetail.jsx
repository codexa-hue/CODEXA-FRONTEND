
import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { getFullUploadUrl } from "../utils/url";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  TicketCheck,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Play,
} from "lucide-react";



const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "Time unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Time unavailable";
  }

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getMediaUrl = (url) => {
  return getFullUploadUrl(url);
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, profile } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    msg: "",
    type: "success",
  });

  const [registering, setRegistering] =
    useState(false);
  const [confirmingForm, setConfirmingForm] =
    useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);

      try {
        const allEvents = await api.events.getAll();

        const foundEvent =
          allEvents.find(
            (item) =>
              String(item.id) === String(id)
          ) || null;

        setEvent(foundEvent);
      } catch (error) {
        console.error(
          "Failed to load event:",
          error
        );

        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      msg: message,
      type,
    });

    setTimeout(() => {
      setToast({
        msg: "",
        type: "success",
      });
    }, 4000);
  };

  const refreshEvent = async () => {
    const allEvents = await api.events.getAll();

    const updatedEvent = allEvents.find(
      (item) =>
        String(item.id) === String(id)
    );

    if (updatedEvent) {
      setEvent(updatedEvent);
    }
  };

  const handleRegister = async () => {
    if (!event || registering) return;

    setRegistering(true);

    try {
      await api.events.register(event.id);

      await refreshEvent();

      if (event.google_form_url) {
        window.open(
          event.google_form_url,
          "_blank",
          "noopener,noreferrer"
        );

        showToast(
          "Registered successfully. Complete the form to confirm your place."
        );
      } else {
        showToast(
          "You are registered for this event."
        );
      }
    } catch (error) {
      showToast(
        error?.message ||
          "Failed to register for the event.",
        "error"
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleConfirmForm = async () => {
    if (!event || confirmingForm) return;

    setConfirmingForm(true);

    try {
      await api.events.confirmForm(event.id);
      await refreshEvent();
      showToast("Form submission confirmed! Registration successful.");
    } catch (error) {
      showToast(
        error?.message || "Failed to confirm form submission.",
        "error"
      );
    } finally {
      setConfirmingForm(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="event-detail-loading">
          <div className="event-loading-content">
            <div className="event-loading-icon">
              <CalendarDays size={25} />
            </div>

            <div className="event-loading-spinner" />

            <h2>Loading event</h2>

            <p>
              Getting the event information ready.
            </p>
          </div>
        </div>

        <style>{eventDetailStyles}</style>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <div className="event-detail-not-found">
          <div className="event-not-found-icon">
            <AlertCircle size={29} />
          </div>

          <span>EVENT NOT FOUND</span>

          <h2>
            This event is no longer available.
          </h2>

          <p>
            The event may have expired, been removed,
            or the link may be incorrect.
          </p>

          <button
            type="button"
            className="event-secondary-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>

        <style>{eventDetailStyles}</style>
      </>
    );
  }

  const registeredUsers = Array.isArray(
    event.registered_users
  )
    ? event.registered_users
    : [];

  const registered = profile
    ? registeredUsers.some(
        (userId) =>
          String(userId) ===
          String(profile.user_id)
      )
    : false;

  const formSubmittedUsers = Array.isArray(
    event.form_submitted_users
  )
    ? event.form_submitted_users
    : [];

  const formSubmitted = profile
    ? formSubmittedUsers.some(
        (userId) =>
          String(userId) ===
          String(profile.user_id)
      )
    : false;

  const registeredCount =
    registeredUsers.length;

  const seatsLeft = event.max_seats
    ? Math.max(
        event.max_seats - registeredCount,
        0
      )
    : null;

  const isFull =
    seatsLeft !== null && seatsLeft <= 0;

  const eventDate = event.date
    ? new Date(event.date)
    : null;

  const isPast =
    eventDate &&
    !Number.isNaN(eventDate.getTime())
      ? eventDate < new Date()
      : false;

  const status = isPast
    ? "Ended"
    : isFull
    ? "Full"
    : "Open";

  const statusClass = isPast
    ? "ended"
    : isFull
    ? "full"
    : "open";

  const imageUrl = getMediaUrl(
    event.image_url
  );

  const videoUrl = getMediaUrl(
    event.video_url
  );

  return (
    <div className="event-detail-page">

      {/* TOAST */}

      {toast.msg && (
        <div
          className={`event-detail-toast ${toast.type}`}
        >
          <div className="event-toast-icon">
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>

          <div>
            <strong>
              {toast.type === "success"
                ? "Success"
                : "Registration failed"}
            </strong>

            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="event-detail-container">

        {/* TOP BAR */}

        <div className="event-detail-topbar">
          <button
            type="button"
            className="event-detail-back"
            onClick={() => navigate(-1)}
          >
            <span>
              <ArrowLeft size={16} />
            </span>

            Back to events
          </button>

          <div className="event-detail-breadcrumb">
            <span>Events</span>
            <span>/</span>
            <strong>{event.title}</strong>
          </div>
        </div>

        {/* COMPACT EVENT HEADER */}

        <section className="event-detail-header">
          <div className="event-header-main">
            <div className="event-header-icon">
              <CalendarDays size={25} />
            </div>

            <div className="event-header-content">
              <div className="event-header-topline">
                <span className="event-header-kicker">
                  CODEXA EVENT
                </span>

                <span
                  className={`event-status ${statusClass}`}
                >
                  <span />
                  {status}
                </span>
              </div>

              <h1>{event.title}</h1>

              <p>
                Everything you need to know before
                joining this event.
              </p>
            </div>
          </div>

          {!isPast && (
            <div className="event-header-action">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="event-primary-button"
                >
                  Sign in to register
                  <ArrowRight size={16} />
                </Link>
              ) : registered ? (
                <div className="event-registered-pill">
                  <CheckCircle2 size={16} />
                  Registered
                </div>
              ) : (
                <button
                  type="button"
                  className="event-primary-button"
                  onClick={handleRegister}
                  disabled={
                    isFull || registering
                  }
                >
                  {registering ? (
                    <>
                      <span className="event-button-spinner" />
                      Registering...
                    </>
                  ) : isFull ? (
                    "Event is full"
                  ) : (
                    <>
                      Register now
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </section>

        {/* EVENT METRICS */}

        <section className="event-metrics">
          <div className="event-metric">
            <div className="event-metric-icon date">
              <Calendar size={18} />
            </div>

            <div>
              <span>Date</span>
              <strong>
                {formatDate(event.date)}
              </strong>
            </div>
          </div>

          <div className="event-metric">
            <div className="event-metric-icon time">
              <Clock size={18} />
            </div>

            <div>
              <span>Time</span>
              <strong>
                {formatTime(event.date)}
              </strong>
            </div>
          </div>

          <div className="event-metric">
            <div className="event-metric-icon location">
              <MapPin size={18} />
            </div>

            <div>
              <span>Location</span>
              <strong>
                {event.location ||
                  "Location not announced"}
              </strong>
            </div>
          </div>

          <div className="event-metric">
            <div className="event-metric-icon members">
              <Users size={18} />
            </div>

            <div>
              <span>Registered</span>
              <strong>
                {registeredCount}{" "}
                {registeredCount === 1
                  ? "member"
                  : "members"}
              </strong>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT */}

        <div className="event-detail-layout">

          {/* MAIN CONTENT */}

          <main className="event-detail-main">

            {/* EVENT MEDIA */}

            {(imageUrl || videoUrl) && (
              <section className="event-media-card">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={event.title}
                  />
                ) : (
                  <div className="event-video-wrapper">
                    <video
                      src={videoUrl}
                      controls
                      preload="metadata"
                    />

                    <div className="event-video-label">
                      <Play size={14} />
                      Event video
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ABOUT */}

            <section className="event-content-card">
              <div className="event-card-heading">
                <div>
                  <span>EVENT OVERVIEW</span>
                  <h2>About this event</h2>
                </div>

                <CalendarDays size={20} />
              </div>

              <div className="event-description">
                {event.description ? (
                  <p>{event.description}</p>
                ) : (
                  <p className="event-muted">
                    No event description has been
                    provided.
                  </p>
                )}
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR */}

          <aside className="event-detail-sidebar">

            {/* REGISTRATION PANEL */}

            <section className="event-registration-card">
              <div className="event-registration-heading">
                <div className="event-registration-icon">
                  <TicketCheck size={20} />
                </div>

                <div>
                  <span>REGISTRATION</span>
                  <h3>
                    {isPast
                      ? "Event has ended"
                      : registered
                      ? "You're attending"
                      : isFull
                      ? "Event is full"
                      : "Reserve your place"}
                  </h3>
                </div>
              </div>

              {event.max_seats && (
                <div className="event-seat-section">
                  <div className="event-seat-row">
                    <span>Availability</span>

                    <strong>
                      {isFull
                        ? "Fully booked"
                        : `${seatsLeft} seats left`}
                    </strong>
                  </div>

                  <div className="event-seat-progress">
                    <span
                      style={{
                        width: `${Math.min(
                          (registeredCount /
                            event.max_seats) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <small>
                    {registeredCount} of{" "}
                    {event.max_seats} seats reserved
                  </small>
                </div>
              )}

              <div className="event-registration-content">
                {isPast ? (
                  <div className="event-registration-message neutral">
                    <Calendar size={17} />

                    <div>
                      <strong>
                        Registration closed
                      </strong>

                      <span>
                        This event has already ended.
                      </span>
                    </div>
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <p>
                      Sign in with your CODEXA account
                      to register for this event.
                    </p>

                    <Link
                      to="/login"
                      className="event-primary-button full"
                    >
                      Sign in to register
                      <ArrowRight size={16} />
                    </Link>
                  </>
                ) : registered ? (
                  <>
                    {event.google_form_url && !formSubmitted ? (
                      <>
                        <div className="event-registration-message warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.22)', color: 'var(--brand-amber)' }}>
                          <ExternalLink size={18} />

                          <div>
                            <strong>
                              Form Pending
                            </strong>

                            <span style={{ color: 'var(--brand-amber)' }}>
                              Complete the form to confirm.
                            </span>
                          </div>
                        </div>

                        <a
                          href={event.google_form_url}
                          target="_blank"
                          rel="noreferrer"
                          className="event-secondary-button full"
                          style={{ marginTop: '12px' }}
                        >
                          <ExternalLink size={15} />
                          Open registration form
                        </a>

                        <button
                          type="button"
                          onClick={handleConfirmForm}
                          disabled={confirmingForm}
                          className="event-primary-button full"
                          style={{ marginTop: '10px' }}
                        >
                          {confirmingForm ? (
                            <>
                              <span className="event-button-spinner" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              I have filled the form
                              <CheckCircle2 size={15} />
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="event-registration-message success">
                          <CheckCircle2 size={18} />

                          <div>
                            <strong>
                              Registration confirmed
                            </strong>

                            <span>
                              Your place has been reserved.
                            </span>
                          </div>
                        </div>

                        {event.google_form_url && (
                          <a
                            href={event.google_form_url}
                            target="_blank"
                            rel="noreferrer"
                            className="event-secondary-button full"
                          >
                            <ExternalLink size={15} />
                            Open registration form
                          </a>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {event.google_form_url && (
                      <div className="event-form-notice">
                        <ExternalLink size={16} />

                        <p>
                          A confirmation form will open
                          after registration.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleRegister}
                      disabled={
                        isFull || registering
                      }
                      className="event-primary-button full"
                    >
                      {registering ? (
                        <>
                          <span className="event-button-spinner" />
                          Registering...
                        </>
                      ) : isFull ? (
                        "Event is full"
                      ) : event.google_form_url ? (
                        <>
                          Register and continue
                          <ExternalLink size={15} />
                        </>
                      ) : (
                        <>
                          Register now
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* EVENT INFO */}

            <section className="event-side-card">
              <div className="event-side-heading">
                <span>EVENT DETAILS</span>
                <h3>Quick information</h3>
              </div>

              <div className="event-info-list">
                <div className="event-info-item">
                  <div className="event-info-icon">
                    <Calendar size={16} />
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(event.date)}
                    </strong>
                  </div>
                </div>

                <div className="event-info-item">
                  <div className="event-info-icon">
                    <Clock size={16} />
                  </div>

                  <div>
                    <span>Time</span>
                    <strong>
                      {formatTime(event.date)}
                    </strong>
                  </div>
                </div>

                <div className="event-info-item">
                  <div className="event-info-icon">
                    <MapPin size={16} />
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {event.location ||
                        "Not announced"}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* SECURITY NOTE */}

            {!isPast && (
              <section className="event-security-note">
                <ShieldCheck size={18} />

                <div>
                  <strong>
                    Member registration
                  </strong>

                  <span>
                    Registration is linked to your
                    authenticated CODEXA account.
                  </span>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      <style>{eventDetailStyles}</style>
    </div>
  );
}

const eventDetailStyles = `
  .event-detail-page,
  .event-detail-loading,
  .event-detail-not-found {
    min-height: 100vh;
    color: var(--text-primary, #10132b);
    background:
      radial-gradient(
        circle at 8% 0%,
        rgba(99, 91, 255, 0.055),
        transparent 25%
      ),
      var(--bg-primary, #f8f9ff);
  }

  .event-detail-container {
    width: min(100%, 1450px);
    margin: 0 auto;
    padding: 28px 42px 70px;
  }

  .event-detail-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 30px;
  }

  .event-detail-back {
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

  .event-detail-back > span {
    width: 34px;
    height: 34px;
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 10px;
    background: var(--bg-card, #ffffff);
    display: grid;
    place-items: center;
    transition: 180ms ease;
  }

  .event-detail-back:hover {
    color: var(--text-primary, #10132b);
  }

  .event-detail-back:hover > span {
    color: #635bff;
    border-color: rgba(99, 91, 255, 0.3);
  }

  .event-detail-breadcrumb {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #8187a4);
    font-size: 0.75rem;
  }

  .event-detail-breadcrumb strong {
    max-width: 260px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text-primary, #10132b);
  }

  .event-detail-header {
    padding-bottom: 28px;
    border-bottom: 1px solid var(--bg-border, #e1e4ef);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
  }

  .event-header-main {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 17px;
  }

  .event-header-icon {
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    border-radius: 16px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
    display: grid;
    place-items: center;
  }

  .event-header-content {
    min-width: 0;
  }

  .event-header-topline {
    display: flex;
    align-items: center;
    gap: 11px;
    flex-wrap: wrap;
  }

  .event-header-kicker {
    color: #635bff;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .event-status {
    min-height: 25px;
    padding: 0 9px;
    border-radius: 999px;
    font-size: 0.64rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .event-status > span {
    width: 6px;
    height: 6px;
    border-radius: 999px;
  }

  .event-status.open {
    color: #07865f;
    background: rgba(16, 185, 129, 0.1);
  }

  .event-status.open > span {
    background: #10b981;
  }

  .event-status.full {
    color: #b06c00;
    background: rgba(245, 158, 11, 0.11);
  }

  .event-status.full > span {
    background: #f59e0b;
  }

  .event-status.ended {
    color: #c5485a;
    background: rgba(239, 68, 68, 0.09);
  }

  .event-status.ended > span {
    background: #ef4444;
  }

  .event-header-content h1 {
    margin: 8px 0 7px;
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1.05;
    letter-spacing: -0.055em;
    font-weight: 900;
  }

  .event-header-content p {
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.88rem;
  }

  .event-header-action {
    flex-shrink: 0;
  }

  .event-primary-button,
  .event-secondary-button {
    min-height: 44px;
    padding: 0 17px;
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
    transition: 180ms ease;
  }

  .event-primary-button {
    border: 1px solid transparent;
    color: #ffffff;
    background: linear-gradient(
      135deg,
      #635bff,
      #7658f7
    );
    box-shadow: 0 10px 24px rgba(99, 91, 255, 0.18);
  }

  .event-primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(99, 91, 255, 0.25);
  }

  .event-primary-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }

  .event-secondary-button {
    border: 1px solid var(--bg-border, #dfe3ef);
    color: var(--text-primary, #10132b);
    background: var(--bg-card, #ffffff);
  }

  .event-secondary-button:hover {
    border-color: rgba(99, 91, 255, 0.35);
  }

  .event-primary-button.full,
  .event-secondary-button.full {
    width: 100%;
  }

  .event-registered-pill {
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 11px;
    color: #07865f;
    background: rgba(16, 185, 129, 0.08);
    font-size: 0.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .event-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    padding: 22px 0;
  }

  .event-metric {
    min-width: 0;
    padding: 15px;
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 14px;
    background: var(--bg-card, #ffffff);
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .event-metric-icon {
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 11px;
    display: grid;
    place-items: center;
  }

  .event-metric-icon.date {
    color: #635bff;
    background: rgba(99, 91, 255, 0.08);
  }

  .event-metric-icon.time {
    color: #d64a84;
    background: rgba(214, 74, 132, 0.08);
  }

  .event-metric-icon.location {
    color: #d48a0b;
    background: rgba(245, 158, 11, 0.09);
  }

  .event-metric-icon.members {
    color: #1686c7;
    background: rgba(22, 134, 199, 0.08);
  }

  .event-metric > div:last-child {
    min-width: 0;
  }

  .event-metric span,
  .event-metric strong {
    display: block;
  }

  .event-metric span {
    color: var(--text-muted, #858ba6);
    font-size: 0.63rem;
  }

  .event-metric strong {
    margin-top: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.73rem;
  }

  .event-detail-layout {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(300px, 360px);
    gap: 20px;
    align-items: start;
  }

  .event-detail-main,
  .event-detail-sidebar {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .event-media-card {
    border: 1px solid var(--bg-border, #e0e4ef);
    border-radius: 18px;
    overflow: hidden;
    background: var(--bg-card, #ffffff);
  }

  .event-media-card img,
  .event-media-card video {
    width: 100%;
    max-height: 460px;
    display: block;
    object-fit: cover;
  }

  .event-video-wrapper {
    position: relative;
  }

  .event-video-label {
    position: absolute;
    left: 14px;
    bottom: 14px;
    min-height: 30px;
    padding: 0 10px;
    border-radius: 8px;
    color: #ffffff;
    background: rgba(10, 13, 28, 0.75);
    backdrop-filter: blur(8px);
    font-size: 0.68rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .event-content-card,
  .event-registration-card,
  .event-side-card {
    border: 1px solid var(--bg-border, #e0e4ef);
    background: var(--bg-card, #ffffff);
  }

  .event-content-card {
    padding: 27px;
    border-radius: 18px;
  }

  .event-card-heading {
    padding-bottom: 19px;
    margin-bottom: 21px;
    border-bottom: 1px solid var(--bg-border, #e4e6ef);
    color: var(--text-muted, #8187a4);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .event-card-heading span,
  .event-registration-heading span,
  .event-side-heading span {
    color: #635bff;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .event-card-heading h2 {
    margin: 6px 0 0;
    color: var(--text-primary, #10132b);
    font-size: 1.25rem;
    letter-spacing: -0.035em;
  }

  .event-description p {
    margin: 0;
    color: var(--text-secondary, #555d7a);
    font-size: 0.9rem;
    line-height: 1.85;
    white-space: pre-line;
  }

  .event-muted {
    color: var(--text-muted, #858ba6) !important;
  }

  .event-registration-card,
  .event-side-card {
    padding: 21px;
    border-radius: 16px;
  }

  .event-registration-heading {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 19px;
  }

  .event-registration-icon {
    width: 41px;
    height: 41px;
    flex-shrink: 0;
    border-radius: 12px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.08);
    display: grid;
    place-items: center;
  }

  .event-registration-heading h3,
  .event-side-heading h3 {
    margin: 5px 0 0;
    font-size: 1rem;
    letter-spacing: -0.025em;
  }

  .event-seat-section {
    padding: 15px 0;
    border-top: 1px solid var(--bg-border, #e4e6ef);
    border-bottom: 1px solid var(--bg-border, #e4e6ef);
  }

  .event-seat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    font-size: 0.7rem;
  }

  .event-seat-row span {
    color: var(--text-muted, #858ba6);
  }

  .event-seat-row strong {
    font-size: 0.7rem;
  }

  .event-seat-progress {
    height: 6px;
    margin: 10px 0 7px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--bg-elevated, #f1f2f8);
  }

  .event-seat-progress span {
    height: 100%;
    display: block;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      #635bff,
      #7c5cff
    );
  }

  .event-seat-section small {
    color: var(--text-muted, #858ba6);
    font-size: 0.6rem;
  }

  .event-registration-content {
    padding-top: 17px;
  }

  .event-registration-content > p {
    margin: 0 0 14px;
    color: var(--text-muted, #747b9c);
    font-size: 0.76rem;
    line-height: 1.6;
  }

  .event-registration-message {
    padding: 12px;
    border-radius: 11px;
    display: flex;
    align-items: flex-start;
    gap: 9px;
  }

  .event-registration-message.success {
    color: #07865f;
    background: rgba(16, 185, 129, 0.08);
  }

  .event-registration-message.neutral {
    color: var(--text-muted, #747b9c);
    background: var(--bg-elevated, #fafaff);
  }

  .event-registration-message strong,
  .event-registration-message span {
    display: block;
  }

  .event-registration-message strong {
    font-size: 0.73rem;
  }

  .event-registration-message span {
    margin-top: 3px;
    font-size: 0.64rem;
  }

  .event-registration-message + a {
    margin-top: 10px;
  }

  .event-form-notice {
    padding: 11px;
    margin-bottom: 11px;
    border: 1px solid rgba(99, 91, 255, 0.13);
    border-radius: 10px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.055);
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .event-form-notice p {
    margin: 0;
    color: var(--text-secondary, #555d7a);
    font-size: 0.66rem;
    line-height: 1.5;
  }

  .event-side-heading {
    margin-bottom: 17px;
  }

  .event-info-list {
    display: flex;
    flex-direction: column;
  }

  .event-info-item {
    padding: 13px 0;
    border-top: 1px solid var(--bg-border, #e4e6ef);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .event-info-icon {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border-radius: 10px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.08);
    display: grid;
    place-items: center;
  }

  .event-info-item > div:last-child {
    min-width: 0;
  }

  .event-info-item span,
  .event-info-item strong {
    display: block;
  }

  .event-info-item span {
    color: var(--text-muted, #858ba6);
    font-size: 0.62rem;
  }

  .event-info-item strong {
    margin-top: 3px;
    font-size: 0.72rem;
    line-height: 1.4;
  }

  .event-security-note {
    padding: 15px;
    border: 1px solid rgba(99, 91, 255, 0.13);
    border-radius: 14px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.05);
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .event-security-note strong,
  .event-security-note span {
    display: block;
  }

  .event-security-note strong {
    font-size: 0.72rem;
  }

  .event-security-note span {
    margin-top: 4px;
    color: var(--text-muted, #747b9c);
    font-size: 0.63rem;
    line-height: 1.5;
  }

  .event-detail-toast {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 100;
    width: min(360px, calc(100vw - 36px));
    padding: 14px;
    border-radius: 14px;
    background: var(--bg-card, #ffffff);
    box-shadow: 0 20px 60px rgba(20, 25, 55, 0.18);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .event-detail-toast.success {
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .event-detail-toast.error {
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .event-toast-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    display: grid;
    place-items: center;
  }

  .event-detail-toast.success .event-toast-icon {
    color: #07865f;
    background: rgba(16, 185, 129, 0.09);
  }

  .event-detail-toast.error .event-toast-icon {
    color: #d34b5e;
    background: rgba(239, 68, 68, 0.08);
  }

  .event-detail-toast strong,
  .event-detail-toast span {
    display: block;
  }

  .event-detail-toast strong {
    font-size: 0.76rem;
  }

  .event-detail-toast span {
    margin-top: 3px;
    color: var(--text-muted, #747b9c);
    font-size: 0.66rem;
    line-height: 1.4;
  }

  .event-button-spinner,
  .event-loading-spinner {
    border-radius: 999px;
    animation: event-spin 0.8s linear infinite;
  }

  .event-button-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
  }

  .event-detail-loading,
  .event-detail-not-found {
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-loading-content,
  .event-detail-not-found {
    text-align: center;
  }

  .event-loading-icon,
  .event-not-found-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border-radius: 18px;
    color: #635bff;
    background: rgba(99, 91, 255, 0.09);
    display: grid;
    place-items: center;
  }

  .event-loading-spinner {
    width: 27px;
    height: 27px;
    margin: 0 auto 18px;
    border: 3px solid rgba(99, 91, 255, 0.15);
    border-top-color: #635bff;
  }

  .event-loading-content h2,
  .event-detail-not-found h2 {
    margin: 0 0 7px;
    font-size: 1.2rem;
  }

  .event-loading-content p,
  .event-detail-not-found p {
    margin: 0;
    color: var(--text-muted, #747b9c);
    font-size: 0.82rem;
  }

  .event-detail-not-found {
    flex-direction: column;
  }

  .event-detail-not-found > span {
    color: #635bff;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .event-detail-not-found h2 {
    margin-top: 9px;
  }

  .event-detail-not-found p {
    max-width: 430px;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  @keyframes event-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1100px) {
    .event-metrics {
      grid-template-columns: repeat(
        2,
        minmax(0, 1fr)
      );
    }

    .event-detail-layout {
      grid-template-columns: 1fr;
    }

    .event-detail-sidebar {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .event-registration-card {
      grid-row: span 2;
    }
  }

  @media (max-width: 767px) {
    .event-detail-container {
      padding: 20px 18px 50px;
    }

    .event-detail-breadcrumb {
      display: none;
    }

    .event-detail-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .event-header-main {
      flex-direction: column;
    }

    .event-header-action,
    .event-header-action > * {
      width: 100%;
    }

    .event-metrics {
      grid-template-columns: 1fr;
    }

    .event-detail-sidebar {
      display: flex;
    }

    .event-content-card {
      padding: 21px;
    }
  }

  @media (max-width: 520px) {
    .event-header-content h1 {
      font-size: 2rem;
    }

    .event-detail-toast {
      left: 18px;
      right: 18px;
      bottom: 18px;
      width: auto;
    }
  }
`;