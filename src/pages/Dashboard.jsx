
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  Hash,
  Mail,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Github,
  Linkedin,
  Twitter,
} from "../components/SocialIcons";


/* =========================================================
   ACTIVITY HEATMAP
========================================================= */

function ActivityHeatmap({ activityLog }) {
  const WEEKS = 26;

  const activityMap = useMemo(() => {
    const map = {};

    (activityLog || []).forEach(({ date, count }) => {
      map[date] = (map[date] || 0) + count;
    });

    return map;
  }, [activityLog]);

  const cells = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let weekIndex = WEEKS - 1; weekIndex >= 0; weekIndex--) {
      const week = [];

      for (let dayIndex = 6; dayIndex >= 0; dayIndex--) {
        const date = new Date(today);

        date.setDate(
          date.getDate() -
            (weekIndex * 7 + dayIndex)
        );

        const key = date
          .toISOString()
          .split("T")[0];

        week.push({
          key,
          count: activityMap[key] || 0,
        });
      }

      result.push(week);
    }

    return result;
  }, [activityMap]);

  const activeDays = Object.values(
    activityMap
  ).filter((count) => count > 0).length;

  const totalActivity = Object.values(
    activityMap
  ).reduce(
    (total, count) => total + count,
    0
  );

  const getCellClass = (count) => {
    if (count === 0) return "level-0";
    if (count === 1) return "level-1";
    if (count <= 3) return "level-2";
    return "level-3";
  };

  return (
    <div className="dashboard-heatmap">
      <div className="section-heading-row">
        <div>
          <span className="section-eyebrow">
            CODING CONSISTENCY
          </span>

          <h3>Activity overview</h3>

          <p>
            Your contribution pattern across the
            last 26 weeks.
          </p>
        </div>

        <div className="heatmap-summary">
          <strong>{activeDays}</strong>
          <span>active days</span>
        </div>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          {cells.map((week, weekIndex) => (
            <div
              className="heatmap-week"
              key={weekIndex}
            >
              {week.map(({ key, count }) => (
                <div
                  key={key}
                  title={`${key}: ${count} activities`}
                  className={`heatmap-cell ${getCellClass(
                    count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-footer">
        <span>
          {totalActivity} total activities recorded
        </span>

        <div className="heatmap-legend">
          <span>Less</span>

          <i className="level-0" />
          <i className="level-1" />
          <i className="level-2" />
          <i className="level-3" />

          <span>More</span>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   POINT TYPES
========================================================= */

const TYPE_META = {
  workshop: {
    label: "Workshop",
    icon: "🎖️",
    className: "blue",
  },

  hackathon: {
    label: "Hackathon",
    icon: "⚡",
    className: "violet",
  },

  project: {
    label: "Project",
    icon: "⚙️",
    className: "green",
  },

  event: {
    label: "Event",
    icon: "🎪",
    className: "pink",
  },

  general: {
    label: "General",
    icon: "📋",
    className: "amber",
  },
};


/* =========================================================
   POINTS TIMELINE
========================================================= */

function PointsTimeline({ history }) {
  if (!history?.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Target size={24} />
        </div>

        <h4>Your journey starts here</h4>

        <p>
          Attend workshops, events and projects to
          start earning club points.
        </p>
      </div>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="points-list">
      {sortedHistory.map((entry, index) => {
        const meta =
          TYPE_META[entry.activity_type] ||
          TYPE_META.general;

        return (
          <div
            className="points-item"
            key={`${entry.date}-${index}`}
          >
            <div
              className={`points-icon ${meta.className}`}
            >
              {meta.icon}
            </div>

            <div className="points-content">
              <div className="points-title-row">
                <h4>{entry.reason}</h4>

                <span className="points-earned">
                  +{entry.points}
                </span>
              </div>

              <div className="points-meta">
                <span
                  className={`activity-type ${meta.className}`}
                >
                  {meta.label}
                </span>

                <span>
                  <Clock size={12} />

                  {new Date(
                    entry.date
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}) {
  return (
    <article className="dashboard-stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}


/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const {
    email,
    uniqueId,
    profile: contextProfile,
    updateProfileState,
  } = useAuth();

  const [profile, setProfile] = useState(
    contextProfile
  );

  const [
    leaderboardRank,
    setLeaderboardRank,
  ] = useState(null);

  const [refreshing, setRefreshing] =
    useState(false);


  /* ===============================
     LOAD FRESH PROFILE
  =============================== */

 useEffect(() => {
  if (!contextProfile?.id) return;

  let cancelled = false;

  const loadFreshProfile = async () => {
    try {
      const freshProfile = await api.members.getById(
        contextProfile.id
      );

      if (!cancelled) {
        setProfile(freshProfile);
      }
    } catch (error) {
      console.error(
        "Failed to load dashboard profile:",
        error
      );
    }
  };

  loadFreshProfile();

  return () => {
    cancelled = true;
  };
}, [contextProfile?.id]);


  /* ===============================
     CALCULATE RANK
  =============================== */

  useEffect(() => {
    if (!profile?.id) return;

    api.members
      .getAll()
      .then((members) => {
        const sortedMembers = [
          ...members,
        ].sort(
          (a, b) =>
            (b.points || 0) -
            (a.points || 0)
        );

        const index =
          sortedMembers.findIndex(
            (member) =>
              member.id === profile.id
          );

        setLeaderboardRank(
          index >= 0 ? index + 1 : null
        );
      })
      .catch(() => {});
  }, [
    profile?.id,
    profile?.points,
  ]);


  /* ===============================
     MANUAL REFRESH
  =============================== */

  const handleRefresh = async () => {
    if (!profile?.id || refreshing) return;

    setRefreshing(true);

    try {
      const freshProfile =
        await api.members.getById(
          profile.id
        );

      setProfile(freshProfile);
      updateProfileState(freshProfile);

      const members =
        await api.members.getAll();

      const sortedMembers = [
        ...members,
      ].sort(
        (a, b) =>
          (b.points || 0) -
          (a.points || 0)
      );

      const index =
        sortedMembers.findIndex(
          (member) =>
            member.id === freshProfile.id
        );

      setLeaderboardRank(
        index >= 0 ? index + 1 : null
      );
    } catch (error) {
      console.error(
        "Failed to refresh dashboard:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };


  /* ===============================
     EMPTY PROFILE
  =============================== */

  if (!profile) {
    return (
      <div className="dashboard-no-profile">
        <div>
          <Target size={28} />

          <h2>No profile linked</h2>

          <p>
            Your account does not have a member
            profile yet. Contact the administrator.
          </p>
        </div>
      </div>
    );
  }


  /* ===============================
     DERIVED DATA
  =============================== */

  const activityDays = new Set(
    (profile.activity_log || [])
      .filter((entry) => entry.count > 0)
      .map((entry) => entry.date)
  ).size;

  const firstName =
    profile.name?.split(" ")[0] ||
    "Developer";

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "D";

  const memberId =
    uniqueId ||
    (typeof profile.id === "string"
      ? profile.id.slice(-8)
      : profile.id || "—");

  const joinedDate = profile.created_at
    ? new Date(
        profile.created_at
      ).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "—";

  const socials = [
    {
      key: "github",
      Icon: Github,
      label: "GitHub",
      url: profile.socials?.github,
    },
    {
      key: "linkedin",
      Icon: Linkedin,
      label: "LinkedIn",
      url: profile.socials?.linkedin,
    },
    {
      key: "twitter",
      Icon: Twitter,
      label: "Twitter",
      url: profile.socials?.twitter,
    },
    {
      key: "portfolio",
      Icon: Globe,
      label: "Portfolio",
      url: profile.socials?.portfolio,
    },
    {
      key: "leetcode",
      Icon: ExternalLink,
      label: "LeetCode",
      url: profile.socials?.leetcode,
    },
  ];


  return (
    <main className="student-dashboard">
      <div className="dashboard-container">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <header className="dashboard-header">
          <div>
            <div className="dashboard-kicker">
              <Sparkles size={14} />
              MEMBER WORKSPACE
            </div>

            <h1>
              Welcome back,{" "}
              <span>{firstName}.</span>
            </h1>

            <p>
              Track your growth, club activity and
              developer momentum.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="dashboard-secondary-button"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "spin"
                    : ""
                }
              />

              {refreshing
                ? "Syncing"
                : "Sync data"}
            </button>

            <Link
              to="/settings"
              className="dashboard-primary-button"
            >
              <Settings size={16} />
              Edit profile
            </Link>
          </div>
        </header>


        {/* =====================================
            PROFILE HERO
        ====================================== */}

        <section className="dashboard-hero">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="hero-profile">
            <div className="hero-avatar">
              {initials}

              <span className="online-dot" />
            </div>

            <div>
              <div className="hero-status">
                ACTIVE MEMBER
              </div>

              <h2>{profile.name}</h2>

              <p>
                {profile.year || "Student"} ·{" "}
                {profile.role || "Member"}
              </p>
            </div>
          </div>

          <div className="hero-message">
            <span>YOUR CURRENT MOMENTUM</span>

            <h3>
              Keep building.
              <br />
              <strong>
                Your progress is visible.
              </strong>
            </h3>
          </div>

          <div className="hero-rank">
            <div>
              <Trophy size={20} />
              CLUB RANK
            </div>

            <strong>
              {leaderboardRank
                ? `#${leaderboardRank}`
                : "—"}
            </strong>

            <Link to="/leaderboard">
              View leaderboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>


        {/* =====================================
            STATS
        ====================================== */}

        <section className="dashboard-stats-grid">
          <StatCard
            label="Leaderboard rank"
            value={
              leaderboardRank
                ? `#${leaderboardRank}`
                : "—"
            }
            description="Position in the club"
            icon={Trophy}
            tone="amber"
          />

          <StatCard
            label="Club points"
            value={profile.points || 0}
            description="Total points earned"
            icon={Star}
            tone="violet"
          />

          <StatCard
            label="Active days"
            value={activityDays}
            description="Days with activity"
            icon={Flame}
            tone="green"
          />

          <StatCard
            label="Badges earned"
            value={
              profile.badges?.length || 0
            }
            description="Milestones unlocked"
            icon={Award}
            tone="pink"
          />
        </section>


        {/* =====================================
            MAIN CONTENT
        ====================================== */}

        <section className="dashboard-layout">

          {/* LEFT COLUMN */}

          <div className="dashboard-main-column">

            <article className="dashboard-card heatmap-card">
              <ActivityHeatmap
                activityLog={
                  profile.activity_log
                }
              />
            </article>


            <article className="dashboard-card">
              <div className="section-heading-row">
                <div>
                  <span className="section-eyebrow">
                    RECENT PROGRESS
                  </span>

                  <h3>Points history</h3>

                  <p>
                    Every contribution to your club
                    journey.
                  </p>
                </div>

                <div className="total-points-pill">
                  <Zap size={14} />
                  {profile.points || 0} pts
                </div>
              </div>

              <PointsTimeline
                history={
                  profile.points_history
                }
              />
            </article>


            <div className="dashboard-bottom-grid">

              {/* SKILLS */}

              <article className="dashboard-card compact-card">
                <div className="compact-card-header">
                  <div className="compact-icon violet">
                    <Zap size={17} />
                  </div>

                  <div>
                    <h3>Developer skills</h3>
                    <p>Your technical toolkit</p>
                  </div>

                  <Link to="/settings">
                    Edit
                  </Link>
                </div>

                {profile.skills?.length >
                0 ? (
                  <div className="skills-list">
                    {profile.skills.map(
                      (skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <div className="small-empty-state">
                    <p>
                      No skills added yet.
                    </p>

                    <Link to="/settings">
                      Add your skills
                    </Link>
                  </div>
                )}
              </article>


              {/* SOCIALS */}

              <article className="dashboard-card compact-card">
                <div className="compact-card-header">
                  <div className="compact-icon blue">
                    <Globe size={17} />
                  </div>

                  <div>
                    <h3>Developer links</h3>
                    <p>Your online presence</p>
                  </div>

                  <Link to="/settings">
                    Edit
                  </Link>
                </div>

                <div className="social-grid">
                  {socials.map(
                    ({
                      key,
                      Icon,
                      label,
                      url,
                    }) => (
                      <div
                        key={key}
                        className="social-item"
                      >
                        <div className="social-icon">
                          <Icon size={15} />
                        </div>

                        <div>
                          <span>{label}</span>

                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open profile
                              <ExternalLink
                                size={11}
                              />
                            </a>
                          ) : (
                            <small>
                              Not connected
                            </small>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </article>
            </div>
          </div>


          {/* RIGHT COLUMN */}

          <aside className="dashboard-side-column">

            {/* PROFILE CARD */}

            <article className="dashboard-card profile-card">
              <div className="profile-card-top">
                <div className="profile-card-avatar">
                  {initials}
                </div>

                <h3>{profile.name}</h3>

                <p>
                  {profile.year || "Student"}
                </p>

                <span>
                  {profile.role || "Member"}
                </span>
              </div>

              <div className="profile-info-list">
                <div>
                  <span className="profile-info-icon">
                    <Mail size={15} />
                  </span>

                  <div>
                    <small>Email</small>
                    <strong>{email}</strong>
                  </div>
                </div>

                <div>
                  <span className="profile-info-icon">
                    <Hash size={15} />
                  </span>

                  <div>
                    <small>Member ID</small>
                    <strong>{memberId}</strong>
                  </div>
                </div>

                <div>
                  <span className="profile-info-icon">
                    <Calendar size={15} />
                  </span>

                  <div>
                    <small>Joined</small>
                    <strong>{joinedDate}</strong>
                  </div>
                </div>
              </div>

              <Link
                to="/settings"
                className="full-profile-button"
              >
                Complete profile
                <ArrowRight size={14} />
              </Link>
            </article>


            {/* BADGES */}

            <article className="dashboard-card">
              <div className="side-card-heading">
                <div>
                  <span className="section-eyebrow">
                    ACHIEVEMENTS
                  </span>

                  <h3>Club badges</h3>
                </div>

                <span className="badge-count">
                  {profile.badges?.length || 0}
                </span>
              </div>

              {profile.badges?.length >
              0 ? (
                <div className="badges-list">
                  {profile.badges.map(
                    (badge) => (
                      <div
                        className="badge-item"
                        key={
                          badge.id ||
                          badge.name
                        }
                      >
                        <div className="badge-emoji">
                          {badge.icon ||
                            "🏆"}
                        </div>

                        <div>
                          <strong>
                            {badge.name}
                          </strong>

                          <p>
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="badge-empty-state">
                  <div>
                    <Award size={24} />
                  </div>

                  <h4>
                    Your first badge awaits
                  </h4>

                  <p>
                    Complete workshops, projects and
                    events to unlock achievements.
                  </p>
                </div>
              )}
            </article>


            {/* QUICK ACTIONS */}

            <article className="dashboard-card quick-actions-card">
              <div className="side-card-heading">
                <div>
                  <span className="section-eyebrow">
                    EXPLORE
                  </span>

                  <h3>Quick actions</h3>
                </div>
              </div>

              <Link to="/leaderboard">
                <span className="quick-action-icon amber">
                  <Trophy size={16} />
                </span>

                <div>
                  <strong>
                    Leaderboard
                  </strong>

                  <small>
                    See your club ranking
                  </small>
                </div>

                <ArrowRight size={15} />
              </Link>

              <Link to="/home">
                <span className="quick-action-icon violet">
                  <Calendar size={16} />
                </span>

                <div>
                  <strong>
                    Club events
                  </strong>

                  <small>
                    Discover what is next
                  </small>
                </div>

                <ArrowRight size={15} />
              </Link>

              <Link to="/settings">
                <span className="quick-action-icon green">
                  <Settings size={16} />
                </span>

                <div>
                  <strong>
                    Profile settings
                  </strong>

                  <small>
                    Update your information
                  </small>
                </div>

                <ArrowRight size={15} />
              </Link>
            </article>
          </aside>
        </section>
      </div>


      {/* =====================================================
          PAGE STYLES
      ====================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .student-dashboard {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(99, 91, 255, 0.08),
              transparent 26%
            ),
            #f7f8fc;
          color: #171a2d;
        }

        .dashboard-container {
          width: min(1440px, 100%);
          margin: 0 auto;
          padding: 38px 36px 70px;
        }


        /* ============================
           HEADER
        ============================ */

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .dashboard-kicker {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          color: #6259e8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #111426;
          font-family:
            "Plus Jakarta Sans",
            sans-serif;
          font-size:
            clamp(2rem, 3vw, 3.2rem);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 900;
        }

        .dashboard-header h1 span {
          background:
            linear-gradient(
              135deg,
              #635bff,
              #8b5cf6
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color:
            transparent;
        }

        .dashboard-header > div > p {
          margin: 10px 0 0;
          color: #7c829d;
          font-size: 14px;
        }

        .dashboard-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .dashboard-primary-button,
        .dashboard-secondary-button {
          min-height: 42px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dashboard-primary-button {
          border: 0;
          color: white;
          background:
            linear-gradient(
              135deg,
              #635bff,
              #7968ef
            );
          box-shadow:
            0 10px 24px
            rgba(99, 91, 255, 0.22);
        }

        .dashboard-secondary-button {
          border: 1px solid #dfe2ec;
          color: #555b75;
          background: white;
        }

        .dashboard-primary-button:hover,
        .dashboard-secondary-button:hover {
          transform: translateY(-1px);
        }

        .spin {
          animation:
            dashboardSpin 0.8s linear
            infinite;
        }

        @keyframes dashboardSpin {
          to {
            transform: rotate(360deg);
          }
        }


        /* ============================
           HERO
        ============================ */

        .dashboard-hero {
          position: relative;
          min-height: 245px;
          padding: 38px 40px;
          display: grid;
          grid-template-columns:
            1.2fr 1fr 0.65fr;
          align-items: center;
          gap: 35px;
          overflow: hidden;
          border-radius: 24px;
          color: white;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(115, 101, 255, 0.4),
              transparent 35%
            ),
            linear-gradient(
              140deg,
              #14192f,
              #0e1224
            );
          box-shadow:
            0 24px 60px
            rgba(18, 22, 48, 0.18);
        }

        .hero-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-decoration-one {
          width: 360px;
          height: 360px;
          right: -220px;
          top: -240px;
          background:
            rgba(112, 93, 255, 0.24);
        }

        .hero-decoration-two {
          width: 240px;
          height: 240px;
          left: 38%;
          bottom: -210px;
          background:
            rgba(139, 92, 246, 0.18);
          filter: blur(20px);
        }

        .hero-profile,
        .hero-message,
        .hero-rank {
          position: relative;
          z-index: 2;
        }

        .hero-profile {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .hero-avatar {
          position: relative;
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border:
            1px solid
            rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #6259e8,
              #8b5cf6
            );
          font-size: 24px;
          font-weight: 900;
          box-shadow:
            0 15px 35px
            rgba(99,91,255,0.3);
        }

        .online-dot {
          position: absolute;
          right: -3px;
          bottom: -3px;
          width: 17px;
          height: 17px;
          border: 4px solid #12172d;
          border-radius: 50%;
          background: #22c55e;
        }

        .hero-status {
          margin-bottom: 7px;
          color: #aaa7ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .hero-profile h2 {
          margin: 0 0 5px;
          font-size: 21px;
          font-weight: 800;
        }

        .hero-profile p {
          margin: 0;
          color: #969eb8;
          font-size: 12px;
        }

        .hero-message {
          padding-left: 35px;
          border-left:
            1px solid
            rgba(255,255,255,0.1);
        }

        .hero-message > span {
          color: #7f88a8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .hero-message h3 {
          margin: 12px 0 0;
          color: white;
          font-size:
            clamp(1.4rem, 2vw, 2rem);
          line-height: 1.15;
          letter-spacing: -0.04em;
        }

        .hero-message strong {
          color: #9187ff;
        }

        .hero-rank {
          padding: 22px;
          border:
            1px solid
            rgba(255,255,255,0.1);
          border-radius: 18px;
          background:
            rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }

        .hero-rank > div {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a7aec5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .hero-rank > div svg {
          color: #f59e0b;
        }

        .hero-rank > strong {
          display: block;
          margin: 12px 0;
          font-size: 40px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .hero-rank a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #a9a5ff;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        }


        /* ============================
           STATS
        ============================ */

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin: 18px 0;
        }

        .dashboard-stat-card {
          min-height: 140px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          border: 1px solid #e5e7f0;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 8px 25px
            rgba(32, 37, 75, 0.04);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 35px
            rgba(32, 37, 75, 0.08);
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
        }

        .stat-icon.amber {
          color: #d98b00;
          background: #fff5dd;
        }

        .stat-icon.violet {
          color: #635bff;
          background: #efeeff;
        }

        .stat-icon.green {
          color: #0f9f72;
          background: #e7f9f2;
        }

        .stat-icon.pink {
          color: #db4f91;
          background: #ffedf6;
        }

        .stat-content > span {
          color: #858ba3;
          font-size: 11px;
          font-weight: 700;
        }

        .stat-content strong {
          display: block;
          margin: 5px 0;
          color: #171a2d;
          font-size: 27px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .stat-content p {
          margin: 0;
          color: #a0a5b7;
          font-size: 10px;
        }


        /* ============================
           MAIN GRID
        ============================ */

        .dashboard-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 330px;
          gap: 18px;
          align-items: start;
        }

        .dashboard-main-column,
        .dashboard-side-column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .dashboard-card {
          padding: 24px;
          border: 1px solid #e5e7f0;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 8px 25px
            rgba(32, 37, 75, 0.035);
        }

        .section-heading-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .section-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #7068e9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .section-heading-row h3,
        .side-card-heading h3 {
          margin: 0;
          color: #171a2d;
          font-size: 17px;
          letter-spacing: -0.025em;
        }

        .section-heading-row p {
          margin: 5px 0 0;
          color: #9297ac;
          font-size: 11px;
        }


        /* ============================
           HEATMAP
        ============================ */

        .heatmap-summary {
          min-width: 85px;
          padding: 10px 13px;
          text-align: center;
          border-radius: 11px;
          background: #f5f4ff;
        }

        .heatmap-summary strong {
          display: block;
          color: #635bff;
          font-size: 17px;
        }

        .heatmap-summary span {
          color: #8a90a7;
          font-size: 9px;
        }

        .heatmap-scroll {
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .heatmap-grid {
          min-width: 600px;
          display: flex;
          gap: 5px;
        }

        .heatmap-week {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
        }

        .heatmap-cell {
          width: 100%;
          aspect-ratio: 1;
          min-width: 10px;
          border-radius: 3px;
        }

        .heatmap-cell.level-0,
        .heatmap-legend i.level-0 {
          border: 1px solid #e7e9f1;
          background: #f4f5f9;
        }

        .heatmap-cell.level-1,
        .heatmap-legend i.level-1 {
          background: #dcd9ff;
        }

        .heatmap-cell.level-2,
        .heatmap-legend i.level-2 {
          background: #9b93ff;
        }

        .heatmap-cell.level-3,
        .heatmap-legend i.level-3 {
          background: #635bff;
        }

        .heatmap-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 10px;
          color: #9ca1b3;
          font-size: 10px;
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .heatmap-legend i {
          width: 10px;
          height: 10px;
          display: block;
          border-radius: 2px;
        }


        /* ============================
           POINTS
        ============================ */

        .total-points-pill {
          padding: 8px 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          color: #635bff;
          background: #f0efff;
          font-size: 11px;
          font-weight: 800;
        }

        .points-list {
          max-height: 390px;
          overflow-y: auto;
          padding-right: 4px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .points-item {
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1px solid #eaebf2;
          border-radius: 13px;
          background: #fafbfe;
        }

        .points-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .points-icon.blue,
        .activity-type.blue {
          background: #eaf3ff;
          color: #3b82f6;
        }

        .points-icon.violet,
        .activity-type.violet {
          background: #efeeff;
          color: #635bff;
        }

        .points-icon.green,
        .activity-type.green {
          background: #e8f9f2;
          color: #0f9f72;
        }

        .points-icon.pink,
        .activity-type.pink {
          background: #ffedf6;
          color: #db4f91;
        }

        .points-icon.amber,
        .activity-type.amber {
          background: #fff5dd;
          color: #c47d00;
        }

        .points-content {
          min-width: 0;
          flex: 1;
        }

        .points-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .points-title-row h4 {
          margin: 0;
          overflow: hidden;
          color: #272a3e;
          font-size: 12px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .points-earned {
          flex-shrink: 0;
          color: #0f9f72;
          font-size: 13px;
          font-weight: 900;
        }

        .points-meta {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ba0b3;
          font-size: 9px;
        }

        .points-meta > span:last-child {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .activity-type {
          padding: 3px 7px;
          border-radius: 999px;
          font-weight: 700;
        }


        /* ============================
           BOTTOM CARDS
        ============================ */

        .dashboard-bottom-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .compact-card-header {
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 11px;
          margin-bottom: 18px;
        }

        .compact-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
        }

        .compact-icon.violet {
          color: #635bff;
          background: #efeeff;
        }

        .compact-icon.blue {
          color: #3b82f6;
          background: #eaf3ff;
        }

        .compact-card-header h3 {
          margin: 0;
          color: #202337;
          font-size: 13px;
        }

        .compact-card-header p {
          margin: 3px 0 0;
          color: #999eb0;
          font-size: 9px;
        }

        .compact-card-header > a {
          color: #635bff;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .skills-list span {
          padding: 7px 10px;
          border: 1px solid #dfdcff;
          border-radius: 8px;
          color: #5d55dc;
          background: #f5f4ff;
          font-size: 10px;
          font-weight: 700;
        }

        .social-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .social-item {
          min-width: 0;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #eaebf2;
          border-radius: 11px;
          background: #fafbfe;
        }

        .social-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 8px;
          color: #6d738c;
          background: white;
          border: 1px solid #e8e9f0;
        }

        .social-item > div:last-child {
          min-width: 0;
        }

        .social-item span {
          display: block;
          color: #555b73;
          font-size: 9px;
          font-weight: 800;
        }

        .social-item a {
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #635bff;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
        }

        .social-item small {
          display: block;
          margin-top: 2px;
          color: #a0a5b6;
          font-size: 8px;
        }

        .small-empty-state p {
          margin: 0 0 5px;
          color: #8e94aa;
          font-size: 11px;
        }

        .small-empty-state a {
          color: #635bff;
          font-size: 10px;
          font-weight: 700;
        }


        /* ============================
           PROFILE CARD
        ============================ */

        .profile-card {
          padding: 0;
          overflow: hidden;
        }

        .profile-card-top {
          padding: 28px 22px 22px;
          text-align: center;
          background:
            linear-gradient(
              180deg,
              #f5f4ff,
              white
            );
        }

        .profile-card-avatar {
          width: 68px;
          height: 68px;
          margin: 0 auto 13px;
          display: grid;
          place-items: center;
          border: 4px solid white;
          border-radius: 19px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #635bff,
              #8b5cf6
            );
          font-size: 20px;
          font-weight: 900;
          box-shadow:
            0 10px 25px
            rgba(99,91,255,0.25);
        }

        .profile-card-top h3 {
          margin: 0;
          color: #171a2d;
          font-size: 16px;
        }

        .profile-card-top p {
          margin: 5px 0 8px;
          color: #8b90a5;
          font-size: 10px;
        }

        .profile-card-top > span {
          padding: 5px 9px;
          border-radius: 999px;
          color: #0f9f72;
          background: #e8f9f2;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .profile-info-list {
          padding: 5px 20px 20px;
        }

        .profile-info-list > div {
          padding: 11px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #eef0f5;
        }

        .profile-info-list > div:last-child {
          border-bottom: 0;
        }

        .profile-info-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 9px;
          color: #635bff;
          background: #f0efff;
        }

        .profile-info-list small {
          display: block;
          color: #9ca1b2;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .profile-info-list strong {
          max-width: 200px;
          margin-top: 3px;
          display: block;
          overflow: hidden;
          color: #4a4f67;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .full-profile-button {
          min-height: 42px;
          margin: 0 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          color: #5e56df;
          background: #f2f1ff;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }


        /* ============================
           SIDE CARDS
        ============================ */

        .side-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .badge-count {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #c47d00;
          background: #fff5dd;
          font-size: 10px;
          font-weight: 900;
        }

        .badges-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge-item {
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #eaebf2;
          border-radius: 12px;
          background: #fafbfe;
        }

        .badge-emoji {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: white;
          font-size: 18px;
        }

        .badge-item strong {
          display: block;
          color: #363a50;
          font-size: 11px;
        }

        .badge-item p {
          margin: 3px 0 0;
          color: #999eb0;
          font-size: 9px;
          line-height: 1.4;
        }

        .badge-empty-state,
        .empty-state {
          padding: 30px 15px;
          text-align: center;
        }

        .badge-empty-state > div,
        .empty-state-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 12px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #635bff;
          background: #f0efff;
        }

        .badge-empty-state h4,
        .empty-state h4 {
          margin: 0 0 7px;
          color: #33374c;
          font-size: 12px;
        }

        .badge-empty-state p,
        .empty-state p {
          max-width: 270px;
          margin: 0 auto;
          color: #969bae;
          font-size: 10px;
          line-height: 1.6;
        }


        /* ============================
           QUICK ACTIONS
        ============================ */

        .quick-actions-card > a {
          padding: 10px 0;
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #eef0f5;
          color: inherit;
          text-decoration: none;
        }

        .quick-actions-card > a:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .quick-action-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }

        .quick-action-icon.amber {
          color: #c47d00;
          background: #fff5dd;
        }

        .quick-action-icon.violet {
          color: #635bff;
          background: #efeeff;
        }

        .quick-action-icon.green {
          color: #0f9f72;
          background: #e8f9f2;
        }

        .quick-actions-card strong {
          display: block;
          color: #454960;
          font-size: 10px;
        }

        .quick-actions-card small {
          display: block;
          margin-top: 3px;
          color: #9ca1b2;
          font-size: 8px;
        }

        .quick-actions-card > a > svg {
          color: #a2a7b8;
        }


        /* ============================
           NO PROFILE
        ============================ */

        .dashboard-no-profile {
          min-height: 70vh;
          display: grid;
          place-items: center;
          padding: 30px;
          text-align: center;
        }

        .dashboard-no-profile > div {
          max-width: 400px;
          padding: 35px;
          border: 1px solid #e5e7f0;
          border-radius: 20px;
          background: white;
        }

        .dashboard-no-profile svg {
          color: #635bff;
        }

        .dashboard-no-profile h2 {
          margin: 15px 0 8px;
        }

        .dashboard-no-profile p {
          margin: 0;
          color: #8c92a8;
          font-size: 13px;
          line-height: 1.6;
        }


        /* ============================
           RESPONSIVE
        ============================ */

        @media (max-width: 1150px) {
          .dashboard-hero {
            grid-template-columns:
              1fr 0.7fr;
          }

          .hero-message {
            display: none;
          }

          .dashboard-layout {
            grid-template-columns:
              minmax(0, 1fr) 290px;
          }
        }

        @media (max-width: 900px) {
          .dashboard-container {
            padding: 28px 20px 60px;
          }

          .dashboard-stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-side-column {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .profile-card {
            grid-row: span 2;
          }
        }

        @media (max-width: 767px) {
          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-header-actions {
            width: 100%;
          }

          .dashboard-header-actions > * {
            flex: 1;
          }

          .dashboard-hero {
            padding: 28px;
            grid-template-columns: 1fr;
          }

          .hero-rank {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .hero-rank > strong {
            margin: 0;
          }

          .hero-rank > a {
            display: none;
          }

          .dashboard-bottom-grid,
          .dashboard-side-column {
            grid-template-columns: 1fr;
          }

          .profile-card {
            grid-row: auto;
          }
        }

        @media (max-width: 520px) {
          .dashboard-container {
            padding:
              22px 14px 50px;
          }

          .dashboard-header h1 {
            font-size: 2rem;
          }

          .dashboard-header-actions {
            flex-direction: column;
          }

          .dashboard-header-actions > * {
            width: 100%;
          }

          .dashboard-stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-stat-card {
            min-height: auto;
          }

          .dashboard-hero {
            border-radius: 18px;
          }

          .hero-profile {
            align-items: flex-start;
          }

          .hero-avatar {
            width: 60px;
            height: 60px;
          }

          .dashboard-card {
            padding: 18px;
          }

          .section-heading-row {
            flex-direction: column;
          }

          .heatmap-summary {
            display: none;
          }

          .social-grid {
            grid-template-columns: 1fr;
          }

          .heatmap-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

      `}</style>
    </main>
  );
}