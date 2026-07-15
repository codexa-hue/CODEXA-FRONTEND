import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

import {
  Trophy,
  Search,
  Sparkles,
  Medal,
  Crown,
  ArrowLeft,
  Info,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  TrendingUp,
  Award,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  Target,
} from 'lucide-react';

import {
  Github,
  Linkedin,
} from '../components/SocialIcons';

import {
  useNavigate,
  Link,
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Skeleton } from '../components/Skeleton';
import { getFullUploadUrl } from '../utils/url';


/* =========================================================
   SCORING RULES
========================================================= */

const SCORING_RULES = [
  {
    icon: Zap,
    accent: 'blue',
    label: 'Workshop Completion',
    points: 'Admin awarded',
    desc: 'Complete club workshops and earn points for active participation.',
  },
  {
    icon: Star,
    accent: 'violet',
    label: 'Hackathon Participation',
    points: 'Admin awarded',
    desc: 'Compete in hackathons and represent the CODEXA community.',
  },
  {
    icon: CheckCircle,
    accent: 'emerald',
    label: 'Project Contribution',
    points: 'Admin awarded',
    desc: 'Contribute to club projects and help the community build.',
  },
  {
    icon: Trophy,
    accent: 'amber',
    label: 'Club Events & Activities',
    points: 'Admin awarded',
    desc: 'Participate consistently in CODEXA events and activities.',
  },
];


/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
};


const getMemberId = (member) => {
  return member?.id ?? member?._id;
};


const getPoints = (member) => {
  return Number(member?.points || 0);
};


/* =========================================================
   LOADING STATE
========================================================= */

function LeaderboardLoading() {
  return (
    <div className="leaderboard-loading-page">
      <div className="leaderboard-loading-content">
        <div className="leaderboard-spinner" />
        <strong>Loading rankings</strong>
        <span>Preparing the CODEXA leaderboard...</span>
      </div>

      <style>{`
        .leaderboard-loading-page {
          width: 100%;
          min-height: 80vh;
          display: grid;
          place-items: center;
          background: var(--bg-primary);
        }

        .leaderboard-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          color: var(--text-muted);
        }

        .leaderboard-loading-content strong {
          margin-top: 8px;
          color: var(--text-primary);
          font-size: 14px;
        }

        .leaderboard-loading-content span {
          font-size: 11px;
        }

        .leaderboard-spinner {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 3px solid rgba(99, 102, 241, 0.14);
          border-top-color: #6366f1;
          animation: leaderboardSpin 0.75s linear infinite;
        }

        @keyframes leaderboardSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  accent = 'violet',
}) {
  return (
    <div className={`leaderboard-stat-card accent-${accent}`}>
      <div className="leaderboard-stat-icon">
        <Icon size={19} />
      </div>

      <div className="leaderboard-stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}


/* =========================================================
   PODIUM CARD
========================================================= */

function PodiumCard({
  member,
  rank,
  loading = false,
}) {
  if (loading) {
    const classes = { 1: 'first', 2: 'second', 3: 'third' };
    const labels = { 1: 'Champion', 2: 'Second place', 3: 'Third place' };
    const icons = { 1: Crown, 2: Medal, 3: Medal };
    const RankIcon = icons[rank];

    return (
      <article className={`leaderboard-podium-card ${classes[rank]}`}>
        <div className="podium-card-glow" />
        <div className="podium-rank-badge">
          <RankIcon size={14} />
          <span>{labels[rank]}</span>
        </div>
        <div className="podium-avatar-wrap">
          <div className="podium-avatar" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Skeleton width="100%" height="100%" borderRadius="999px" />
          </div>
          <div className="podium-position">{rank}</div>
        </div>
        <div className="podium-member-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Skeleton width="80px" height="14px" />
          <Skeleton width="60px" height="10px" />
        </div>
        <div className="podium-points" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
          <Skeleton width="48px" height="18px" />
          <Skeleton width="56px" height="10px" />
        </div>
      </article>
    );
  }

  if (!member) return null;

  const memberId = getMemberId(member);

  const podiumMeta = {
    1: {
      label: 'Champion',
      icon: Crown,
      className: 'first',
    },
    2: {
      label: 'Second place',
      icon: Medal,
      className: 'second',
    },
    3: {
      label: 'Third place',
      icon: Medal,
      className: 'third',
    },
  };

  const meta = podiumMeta[rank];
  const RankIcon = meta.icon;

  return (
    <article
      className={`leaderboard-podium-card ${meta.className}`}
    >
      <div className="podium-card-glow" />

      <div className="podium-rank-badge">
        <RankIcon size={14} />
        <span>{meta.label}</span>
      </div>

      <div className="podium-avatar-wrap">
        <div className="podium-avatar" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {member.avatar_url ? (
            <img src={getFullUploadUrl(member.avatar_url)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            getInitials(member.name)
          )}
        </div>

        <div className="podium-position">
          {rank}
        </div>
      </div>

      <div className="podium-member-copy">
        <Link
          to={`/members/${memberId}`}
          className="podium-member-name"
        >
          {member.name}
        </Link>

        <span>
          {member.year || 'Year not set'}
          {' · '}
          {member.role || 'Member'}
        </span>
      </div>

      <div className="podium-points">
        <strong>
          {getPoints(member).toLocaleString()}
        </strong>

        <span>club points</span>
      </div>

      {member.skills?.length > 0 && (
        <div className="podium-skills">
          {member.skills
            .slice(0, 2)
            .map((skill) => (
              <span key={skill}>
                {skill}
              </span>
            ))}

          {member.skills.length > 2 && (
            <span>
              +{member.skills.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="podium-footer">
        <div className="podium-socials">
          {member.socials?.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} GitHub`}
            >
              <Github size={15} />
            </a>
          )}

          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin size={15} />
            </a>
          )}
        </div>

        <Link
          to={`/members/${memberId}`}
          className="podium-profile-link"
        >
          View profile
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function Leaderboard() {
  const { uniqueId, isAdmin, isAuthenticated } = useAuth();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [showScoring, setShowScoring] = useState(false);

  const navigate = useNavigate();

  // Extract cohort prefix (e.g. "23CDX" from "23CDX01")
  const userBatchPrefix = useMemo(() => {
    if (!isAuthenticated || isAdmin || !uniqueId) return null;
    const match = uniqueId.match(/^(\d+[A-Za-z]+)/);
    return match ? match[1] : null;
  }, [uniqueId, isAdmin, isAuthenticated]);


  /* =========================================================
     LOAD MEMBERS
  ========================================================= */

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await api.members.getAll();

        const sorted = [...data].sort(
          (a, b) => getPoints(b) - getPoints(a)
        );

        setMembers(sorted);
      } catch (err) {
        console.error(
          'Error loading leaderboard:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);


  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const cohortFilteredMembers = useMemo(() => {
    if (!userBatchPrefix) return members;
    return members.filter((member) => {
      const mUniqueId = member.unique_id;
      if (!mUniqueId) return false;
      return mUniqueId.toLowerCase().startsWith(userBatchPrefix.toLowerCase());
    });
  }, [members, userBatchPrefix]);


  const allSkills = useMemo(() => {
    return [
      ...new Set(
        cohortFilteredMembers.flatMap(
          (member) => member.skills || []
        )
      ),
    ].sort();
  }, [cohortFilteredMembers]);


  const filteredMembers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return cohortFilteredMembers.filter((member) => {
      const matchSearch =
        !normalizedSearch ||
        member.name
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchSkill = selectedSkill
        ? member.skills?.includes(selectedSkill)
        : true;

      const matchYear = selectedYear
        ? member.year === selectedYear
        : true;

      return (
        matchSearch &&
        matchSkill &&
        matchYear
      );
    });
  }, [
    cohortFilteredMembers,
    search,
    selectedSkill,
    selectedYear,
  ]);


  const isFiltered =
    search.trim() !== '' ||
    selectedSkill !== '' ||
    selectedYear !== '';


  const topThree = cohortFilteredMembers.slice(0, 3);


  const tableMembers = isFiltered
    ? filteredMembers
    : cohortFilteredMembers.slice(3);


  const totalPoints = cohortFilteredMembers.reduce(
    (sum, member) =>
      sum + getPoints(member),
    0
  );


  const averagePoints = cohortFilteredMembers.length
    ? Math.round(totalPoints / cohortFilteredMembers.length)
    : 0;


  const highestScore = cohortFilteredMembers.length
    ? getPoints(cohortFilteredMembers[0])
    : 0;


  const clearFilters = () => {
    setSearch('');
    setSelectedSkill('');
    setSelectedYear('');
  };





  return (
    <div className="leaderboard-page">

      <div className="leaderboard-container">


        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <header className="leaderboard-page-header">

          <div className="leaderboard-heading-area">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="leaderboard-back-button"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>


            <div className="leaderboard-heading-icon">
              <Trophy size={24} />
            </div>


            <div className="leaderboard-heading-copy">

              <div className="leaderboard-eyebrow">
                <Sparkles size={13} />
                COMMUNITY RANKINGS
              </div>

              <h1>
                Leaderboard
                {userBatchPrefix && (
                  <span className="leaderboard-cohort-badge">
                    {userBatchPrefix} Batch
                  </span>
                )}
              </h1>

              <p>
                {userBatchPrefix
                  ? `Showing rankings, stats, and skills representing the ${userBatchPrefix} cohort.`
                  : "Track CODEXA's most active members and see who is leading the community."}
              </p>

            </div>

          </div>


          <div className="leaderboard-season-status">
            <span className="season-live-dot" />

            <div>
              <strong>Rankings live</strong>
              <span>
                Based on current club points
              </span>
            </div>
          </div>

        </header>


        {/* ===================================================
            STATS
        =================================================== */}

        <section className="leaderboard-stats">

          <StatCard
            icon={Users}
            label="Active members"
            value={loading ? <Skeleton width="60px" height="24px" /> : members.length}
            detail="Ranked in the community"
            accent="violet"
          />

          <StatCard
            icon={Trophy}
            label="Highest score"
            value={loading ? <Skeleton width="80px" height="24px" /> : highestScore.toLocaleString()}
            detail="Points held by the leader"
            accent="amber"
          />

          <StatCard
            icon={TrendingUp}
            label="Average points"
            value={loading ? <Skeleton width="80px" height="24px" /> : averagePoints.toLocaleString()}
            detail="Across all members"
            accent="blue"
          />

          <StatCard
            icon={Award}
            label="Skills represented"
            value={loading ? <Skeleton width="60px" height="24px" /> : allSkills.length}
            detail="Across the CODEXA community"
            accent="emerald"
          />

        </section>


        {/* ===================================================
            SCORING SYSTEM
        =================================================== */}

        <section
          className={`leaderboard-scoring-card ${
            showScoring ? 'open' : ''
          }`}
        >

          <button
            type="button"
            onClick={() =>
              setShowScoring((value) => !value)
            }
            className="scoring-card-trigger"
          >

            <div className="scoring-trigger-left">

              <div className="scoring-trigger-icon">
                <Info size={18} />
              </div>

              <div>
                <strong>
                  How are leaderboard points earned?
                </strong>

                <span>
                  Understand the activities that
                  contribute to your ranking.
                </span>
              </div>

            </div>


            <div className="scoring-trigger-action">

              <span>
                {showScoring
                  ? 'Hide details'
                  : 'View scoring'}
              </span>

              {showScoring ? (
                <ChevronUp size={17} />
              ) : (
                <ChevronDown size={17} />
              )}

            </div>

          </button>


          {showScoring && (

            <div className="scoring-card-content">

              <div className="scoring-introduction">

                <Target size={18} />

                <p>
                  Your rank is determined by your
                  total club points. Points are
                  awarded for meaningful participation,
                  contribution, and involvement in
                  CODEXA activities.
                </p>

              </div>


              <div className="scoring-rules-grid">

                {SCORING_RULES.map(
                  ({
                    icon: Icon,
                    accent,
                    label,
                    points,
                    desc,
                  }) => (

                    <article
                      key={label}
                      className={`scoring-rule-card accent-${accent}`}
                    >

                      <div className="scoring-rule-icon">
                        <Icon size={18} />
                      </div>

                      <div className="scoring-rule-copy">

                        <div className="scoring-rule-heading">
                          <strong>{label}</strong>
                          <span>{points}</span>
                        </div>

                        <p>{desc}</p>

                      </div>

                    </article>

                  )
                )}

              </div>


              <div className="scoring-note">

                <Sparkles size={16} />

                <p>
                  <strong>
                    Consistency matters.
                  </strong>{' '}
                  Rankings should reward genuine club
                  participation, not meaningless point
                  farming.
                </p>

              </div>

            </div>

          )}

        </section>


        {/* ===================================================
            TOP THREE
        =================================================== */}

        {!isFiltered && (loading || topThree.length > 0) && (

          <section className="leaderboard-podium-section">

            <div className="leaderboard-section-heading">

              <div>
                <span className="section-kicker">
                  TOP PERFORMERS
                </span>

                <h2>Community podium</h2>

                <p>
                  The three highest-ranked CODEXA
                  members right now.
                </p>
              </div>


              <div className="podium-live-label">
                <span />
                Live standings
              </div>

            </div>


            <div className="leaderboard-podium-grid">

              <div className="podium-order-second">
                <PodiumCard
                  member={topThree[1]}
                  rank={2}
                  loading={loading}
                />
              </div>

              <div className="podium-order-first">
                <PodiumCard
                  member={topThree[0]}
                  rank={1}
                  loading={loading}
                />
              </div>

              <div className="podium-order-third">
                <PodiumCard
                  member={topThree[2]}
                  rank={3}
                  loading={loading}
                />
              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            RANKINGS
        =================================================== */}

        <section className="leaderboard-ranking-section">

          <div className="leaderboard-section-heading ranking-heading">

            <div>
              <span className="section-kicker">
                {isFiltered
                  ? 'FILTERED RESULTS'
                  : 'FULL STANDINGS'}
              </span>

              <h2>
                {isFiltered
                  ? 'Member results'
                  : 'Community rankings'}
              </h2>

              <p>
                {isFiltered
                  ? `${filteredMembers.length} ${
                      filteredMembers.length === 1
                        ? 'member matches'
                        : 'members match'
                    } your current filters.`
                  : 'Explore the complete CODEXA ranking table.'}
              </p>
            </div>

          </div>


          {/* FILTER BAR */}

          <div className="leaderboard-filter-card">

            <div className="leaderboard-search-box">

              <Search
                size={17}
                className="leaderboard-search-icon"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by member name..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

            </div>


            <div className="leaderboard-filter-divider" />


            <div className="leaderboard-filter-selects">

              <div className="leaderboard-select-wrap">

                <SlidersHorizontal size={15} />

                <select
                  value={selectedSkill}
                  onChange={(e) =>
                    setSelectedSkill(e.target.value)
                  }
                >
                  <option value="">
                    All skills
                  </option>

                  {allSkills.map((skill) => (
                    <option
                      key={skill}
                      value={skill}
                    >
                      {skill}
                    </option>
                  ))}

                </select>

              </div>


              <div className="leaderboard-select-wrap">

                <Users size={15} />

                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(e.target.value)
                  }
                >
                  <option value="">
                    All years
                  </option>

                  {[
                    '1st Year',
                    '2nd Year',
                    '3rd Year',
                    '4th Year',
                  ].map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}

                </select>

              </div>

            </div>


            {isFiltered && (

              <button
                type="button"
                onClick={clearFilters}
                className="leaderboard-clear-filters"
              >
                <X size={14} />
                Clear filters
              </button>

            )}

          </div>


          {/* TABLE */}

          <div className="leaderboard-table-card">

            <div className="leaderboard-table-header">

              <div>
                <strong>
                  {isFiltered
                    ? 'Search results'
                    : 'Ranking table'}
                </strong>

                <span>
                  {isFiltered
                    ? 'Ranks shown are global community positions.'
                    : 'Top three members are highlighted above.'}
                </span>
              </div>


              <span className="leaderboard-result-count">
                {isFiltered
                  ? filteredMembers.length
                  : members.length}{' '}
                members
              </span>

            </div>


            <div className="leaderboard-table-scroll">

              <table className="leaderboard-table">

                <thead>

                  <tr>
                    <th className="rank-column">
                      Rank
                    </th>

                    <th>Member</th>

                    <th className="year-column">
                      Academic year
                    </th>

                    <th className="skills-column">
                      Skills
                    </th>

                    <th className="points-column">
                      Points
                    </th>

                    <th className="links-column">
                      Links
                    </th>
                  </tr>

                </thead>


                <tbody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map((index) => (
                      <tr key={index}>
                        <td className="rank-column">
                          <Skeleton width="28px" height="20px" borderRadius="6px" />
                        </td>
                        <td>
                          <div className="table-member">
                            <div className="table-member-avatar" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <Skeleton width="100%" height="100%" borderRadius="999px" />
                            </div>
                            <div className="table-member-copy" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <Skeleton width="96px" height="14px" />
                              <Skeleton width="48px" height="10px" />
                            </div>
                          </div>
                        </td>
                        <td className="year-column">
                          <Skeleton width="56px" height="14px" />
                        </td>
                        <td className="skills-column">
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <Skeleton width="48px" height="16px" borderRadius="4px" />
                            <Skeleton width="36px" height="16px" borderRadius="4px" />
                          </div>
                        </td>
                        <td className="points-column">
                          <Skeleton width="52px" height="14px" />
                        </td>
                        <td className="links-column">
                          <Skeleton width="36px" height="14px" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      {tableMembers.map((member) => {

                    const globalRank =
                      members.findIndex(
                        (item) =>
                          getMemberId(item) ===
                          getMemberId(member)
                      ) + 1;

                    const memberId =
                      getMemberId(member);

                    return (

                      <tr key={memberId}>

                        <td className="rank-column">

                          <div
                            className={`table-rank-badge rank-${globalRank}`}
                          >
                            {globalRank <= 3 && (
                              <Trophy size={12} />
                            )}

                            <span>
                              #{globalRank}
                            </span>
                          </div>

                        </td>


                        <td>

                          <div className="table-member">

                            <div className="table-member-avatar" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {member.avatar_url ? (
                                <img src={getFullUploadUrl(member.avatar_url)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                getInitials(member.name)
                              )}
                            </div>


                            <div className="table-member-copy">

                              <Link
                                to={`/members/${memberId}`}
                              >
                                {member.name}
                              </Link>

                              <span>
                                {member.role ||
                                  'Member'}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td className="year-column">

                          <span className="table-year">
                            {member.year || '—'}
                          </span>

                        </td>


                        <td className="skills-column">

                          <div className="table-skills">

                            {member.skills
                              ?.slice(0, 3)
                              .map((skill) => (

                                <span key={skill}>
                                  {skill}
                                </span>

                              ))}


                            {member.skills?.length >
                              3 && (

                              <small>
                                +
                                {member.skills.length -
                                  3}
                              </small>

                            )}


                            {!member.skills?.length && (
                              <span className="no-skills">
                                No skills added
                              </span>
                            )}

                          </div>

                        </td>


                        <td className="points-column">

                          <div className="table-points">

                            <strong>
                              {getPoints(
                                member
                              ).toLocaleString()}
                            </strong>

                            <span>pts</span>

                          </div>

                        </td>


                        <td className="links-column">

                          <div className="table-socials">

                            {member.socials?.github ? (

                              <a
                                href={
                                  member.socials
                                    .github
                                }
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                              >
                                <Github size={15} />
                              </a>

                            ) : (

                              <span className="social-placeholder" />

                            )}


                            {member.socials?.linkedin ? (

                              <a
                                href={
                                  member.socials
                                    .linkedin
                                }
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                              >
                                <Linkedin size={15} />
                              </a>

                            ) : (

                              <span className="social-placeholder" />

                            )}

                          </div>

                        </td>

                      </tr>

                    );

                      })}

                      {tableMembers.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="leaderboard-empty-cell"
                          >
                            <div className="leaderboard-empty-state">
                              <div>
                                <Search size={22} />
                              </div>
                              <strong>
                                No members found
                              </strong>
                              <p>
                                Try changing your search,
                                skill, or year filter.
                              </p>
                              <button
                                type="button"
                                onClick={clearFilters}
                              >
                                Clear all filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .leaderboard-page {
          width: 100%;
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(245, 158, 11, 0.07),
              transparent 24%
            ),
            radial-gradient(
              circle at 0% 28%,
              rgba(99, 102, 241, 0.05),
              transparent 22%
            ),
            var(--bg-primary);
        }

        .leaderboard-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 48px 80px;
        }


        /* ===================================================
           HEADER
        =================================================== */

        .leaderboard-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .leaderboard-heading-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .leaderboard-back-button {
          width: 42px;
          height: 42px;
          padding: 0;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border:
            1px solid var(--bg-border);
          border-radius: 13px;
          color: var(--text-muted);
          background: var(--bg-secondary);
          cursor: pointer;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .leaderboard-back-button:hover {
          color: #6366f1;
          border-color:
            rgba(99, 102, 241, 0.3);
          transform: translateX(-2px);
        }

        .leaderboard-heading-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border:
            1px solid
            rgba(245, 158, 11, 0.2);
          border-radius: 18px;
          color: #f59e0b;
          background:
            linear-gradient(
              135deg,
              rgba(245, 158, 11, 0.17),
              rgba(245, 158, 11, 0.05)
            );
          box-shadow:
            0 12px 30px
            rgba(245, 158, 11, 0.08);
        }

        .leaderboard-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
          color: #6366f1;
          font-size: 10px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .leaderboard-heading-copy h1 {
          margin: 0;
          color: var(--text-primary);
          font-size:
            clamp(30px, 3vw, 40px);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .leaderboard-heading-copy p {
          margin: 8px 0 0;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .leaderboard-season-status {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          border:
            1px solid var(--bg-border);
          border-radius: 14px;
          background: var(--bg-secondary);
        }

        .season-live-dot {
          width: 9px;
          height: 9px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 5px
            rgba(16, 185, 129, 0.12);
        }

        .leaderboard-season-status div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .leaderboard-season-status strong {
          color: var(--text-primary);
          font-size: 12px;
        }

        .leaderboard-season-status span {
          color: var(--text-muted);
          font-size: 10px;
        }


        /* ===================================================
           STATS
        =================================================== */

        .leaderboard-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .leaderboard-stat-card {
          min-width: 0;
          padding: 19px;
          display: flex;
          align-items: center;
          gap: 14px;
          border:
            1px solid var(--bg-border);
          border-radius: 18px;
          background: var(--bg-secondary);
          box-shadow:
            0 12px 35px
            rgba(15, 23, 42, 0.025);
        }

        .leaderboard-stat-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 14px;
        }

        .leaderboard-stat-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .leaderboard-stat-copy > span {
          color: var(--text-muted);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .leaderboard-stat-copy strong {
          margin-top: 3px;
          color: var(--text-primary);
          font-size: 22px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .leaderboard-stat-copy small {
          margin-top: 3px;
          overflow: hidden;
          color: var(--text-muted);
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .leaderboard-stat-card.accent-violet
        .leaderboard-stat-icon {
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.1);
        }

        .leaderboard-stat-card.accent-amber
        .leaderboard-stat-icon {
          color: #f59e0b;
          background:
            rgba(245, 158, 11, 0.1);
        }

        .leaderboard-stat-card.accent-blue
        .leaderboard-stat-icon {
          color: #3b82f6;
          background:
            rgba(59, 130, 246, 0.1);
        }

        .leaderboard-stat-card.accent-emerald
        .leaderboard-stat-icon {
          color: #10b981;
          background:
            rgba(16, 185, 129, 0.1);
        }


        /* ===================================================
           SCORING
        =================================================== */

        .leaderboard-scoring-card {
          margin-bottom: 38px;
          overflow: hidden;
          border:
            1px solid var(--bg-border);
          border-radius: 20px;
          background: var(--bg-secondary);
          transition:
            border-color 0.2s ease;
        }

        .leaderboard-scoring-card.open {
          border-color:
            rgba(99, 102, 241, 0.2);
        }

        .scoring-card-trigger {
          width: 100%;
          min-height: 76px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 0;
          color: inherit;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .scoring-card-trigger:hover {
          background:
            rgba(99, 102, 241, 0.025);
        }

        .scoring-trigger-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .scoring-trigger-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.1);
        }

        .scoring-trigger-left > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .scoring-trigger-left strong {
          color: var(--text-primary);
          font-size: 13px;
        }

        .scoring-trigger-left span {
          color: var(--text-muted);
          font-size: 10px;
        }

        .scoring-trigger-action {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          color: #6366f1;
          font-size: 10px;
          font-weight: 750;
        }

        .scoring-card-content {
          padding: 22px;
          border-top:
            1px solid var(--bg-border);
          animation:
            scoringOpen 0.25s ease;
        }

        @keyframes scoringOpen {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scoring-introduction {
          margin-bottom: 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #6366f1;
        }

        .scoring-introduction svg {
          margin-top: 1px;
          flex-shrink: 0;
        }

        .scoring-introduction p {
          max-width: 800px;
          margin: 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .scoring-rules-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .scoring-rule-card {
          min-width: 0;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          border:
            1px solid var(--bg-border);
          border-radius: 15px;
          background: var(--bg-primary);
        }

        .scoring-rule-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .scoring-rule-copy {
          min-width: 0;
        }

        .scoring-rule-heading {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .scoring-rule-heading strong {
          color: var(--text-primary);
          font-size: 10px;
        }

        .scoring-rule-heading span {
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .scoring-rule-copy p {
          margin: 7px 0 0;
          color: var(--text-muted);
          font-size: 9px;
          line-height: 1.55;
        }

        .scoring-rule-card.accent-blue
        .scoring-rule-icon,
        .scoring-rule-card.accent-blue
        .scoring-rule-heading span {
          color: #3b82f6;
        }

        .scoring-rule-card.accent-blue
        .scoring-rule-icon {
          background:
            rgba(59, 130, 246, 0.1);
        }

        .scoring-rule-card.accent-violet
        .scoring-rule-icon,
        .scoring-rule-card.accent-violet
        .scoring-rule-heading span {
          color: #8b5cf6;
        }

        .scoring-rule-card.accent-violet
        .scoring-rule-icon {
          background:
            rgba(139, 92, 246, 0.1);
        }

        .scoring-rule-card.accent-emerald
        .scoring-rule-icon,
        .scoring-rule-card.accent-emerald
        .scoring-rule-heading span {
          color: #10b981;
        }

        .scoring-rule-card.accent-emerald
        .scoring-rule-icon {
          background:
            rgba(16, 185, 129, 0.1);
        }

        .scoring-rule-card.accent-amber
        .scoring-rule-icon,
        .scoring-rule-card.accent-amber
        .scoring-rule-heading span {
          color: #f59e0b;
        }

        .scoring-rule-card.accent-amber
        .scoring-rule-icon {
          background:
            rgba(245, 158, 11, 0.1);
        }

        .scoring-note {
          margin-top: 16px;
          padding: 12px 14px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border:
            1px solid
            rgba(99, 102, 241, 0.12);
          border-radius: 12px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.05);
        }

        .scoring-note svg {
          margin-top: 1px;
          flex-shrink: 0;
        }

        .scoring-note p {
          margin: 0;
          color: var(--text-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .scoring-note strong {
          color: var(--text-primary);
        }


        /* ===================================================
           SECTION HEADINGS
        =================================================== */

        .leaderboard-podium-section {
          margin-bottom: 48px;
        }

        .leaderboard-section-heading {
          margin-bottom: 22px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .section-kicker {
          display: block;
          margin-bottom: 5px;
          color: #6366f1;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .leaderboard-section-heading h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 23px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .leaderboard-section-heading p {
          margin: 6px 0 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .podium-live-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--text-muted);
          font-size: 9px;
          font-weight: 700;
        }

        .podium-live-label > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 4px
            rgba(16, 185, 129, 0.1);
        }


        /* ===================================================
           PODIUM
        =================================================== */

        .leaderboard-podium-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: end;
        }

        .leaderboard-podium-card {
          position: relative;
          min-height: 315px;
          padding: 28px 24px 20px;
          overflow: hidden;
          border: 1px solid;
          border-radius: 22px;
          background: var(--bg-secondary);
          box-shadow:
            0 18px 50px
            rgba(15, 23, 42, 0.04);
        }

        .leaderboard-podium-card.first {
          min-height: 345px;
          padding-top: 34px;
          border-color:
            rgba(245, 158, 11, 0.28);
          background:
            linear-gradient(
              160deg,
              rgba(245, 158, 11, 0.1),
              var(--bg-secondary) 45%
            );
          transform: translateY(-12px);
        }

        .leaderboard-podium-card.second {
          border-color:
            rgba(148, 163, 184, 0.25);
          background:
            linear-gradient(
              160deg,
              rgba(148, 163, 184, 0.09),
              var(--bg-secondary) 45%
            );
        }

        .leaderboard-podium-card.third {
          border-color:
            rgba(180, 83, 9, 0.2);
          background:
            linear-gradient(
              160deg,
              rgba(180, 83, 9, 0.07),
              var(--bg-secondary) 45%
            );
        }

        .podium-card-glow {
          position: absolute;
          top: -75px;
          right: -75px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          filter: blur(25px);
          pointer-events: none;
        }

        .first .podium-card-glow {
          background:
            rgba(245, 158, 11, 0.16);
        }

        .second .podium-card-glow {
          background:
            rgba(148, 163, 184, 0.13);
        }

        .third .podium-card-glow {
          background:
            rgba(180, 83, 9, 0.1);
        }

        .podium-rank-badge {
          position: relative;
          width: fit-content;
          margin: 0 auto 18px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .first .podium-rank-badge {
          color: #b77900;
          background:
            rgba(245, 158, 11, 0.12);
        }

        .second .podium-rank-badge {
          color: #64748b;
          background:
            rgba(148, 163, 184, 0.12);
        }

        .third .podium-rank-badge {
          color: #b45309;
          background:
            rgba(180, 83, 9, 0.09);
        }

        .podium-avatar-wrap {
          position: relative;
          width: fit-content;
          margin: 0 auto 16px;
        }

        .podium-avatar {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          border: 3px solid;
          border-radius: 22px;
          color: var(--text-primary);
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.04em;
        }

        .first .podium-avatar {
          width: 78px;
          height: 78px;
          border-color:
            rgba(245, 158, 11, 0.35);
          background:
            rgba(245, 158, 11, 0.1);
        }

        .second .podium-avatar {
          border-color:
            rgba(148, 163, 184, 0.35);
          background:
            rgba(148, 163, 184, 0.1);
        }

        .third .podium-avatar {
          border-color:
            rgba(180, 83, 9, 0.28);
          background:
            rgba(180, 83, 9, 0.08);
        }

        .podium-position {
          position: absolute;
          right: -7px;
          bottom: -7px;
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border:
            3px solid var(--bg-secondary);
          border-radius: 9px;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .first .podium-position {
          background: #f59e0b;
        }

        .second .podium-position {
          background: #94a3b8;
        }

        .third .podium-position {
          background: #b45309;
        }

        .podium-member-copy {
          position: relative;
          text-align: center;
        }

        .podium-member-name {
          display: block;
          overflow: hidden;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .podium-member-name:hover {
          color: #6366f1;
        }

        .podium-member-copy > span {
          display: block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 9px;
        }

        .podium-points {
          position: relative;
          margin: 17px 0 14px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 5px;
        }

        .podium-points strong {
          color: var(--text-primary);
          font-size: 23px;
          font-weight: 850;
          letter-spacing: -0.04em;
        }

        .podium-points span {
          color: var(--text-muted);
          font-size: 9px;
        }

        .podium-skills {
          position: relative;
          min-height: 23px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .podium-skills span {
          padding: 4px 7px;
          border-radius: 7px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.07);
          font-size: 8px;
          font-weight: 700;
        }

        .podium-footer {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 18px;
          padding-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top:
            1px solid var(--bg-border);
        }

        .podium-socials {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .podium-socials a,
        .table-socials a {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border:
            1px solid var(--bg-border);
          border-radius: 9px;
          color: var(--text-muted);
          background: var(--bg-primary);
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .podium-socials a:hover,
        .table-socials a:hover {
          color: #6366f1;
          border-color:
            rgba(99, 102, 241, 0.3);
          transform: translateY(-1px);
        }

        .podium-profile-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6366f1;
          font-size: 9px;
          font-weight: 750;
          text-decoration: none;
        }


        /* ===================================================
           FILTERS
        =================================================== */

        .leaderboard-ranking-section {
          padding-bottom: 20px;
        }

        .ranking-heading {
          margin-bottom: 18px;
        }

        .leaderboard-filter-card {
          margin-bottom: 16px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border:
            1px solid var(--bg-border);
          border-radius: 17px;
          background: var(--bg-secondary);
        }

        .leaderboard-search-box {
          position: relative;
          min-width: 240px;
          flex: 1;
        }

        .leaderboard-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          color: var(--text-muted);
          transform: translateY(-50%);
          pointer-events: none;
        }

        .leaderboard-search-box input {
          width: 100%;
          min-height: 44px;
          padding: 0 42px 0 42px;
          border:
            1px solid var(--bg-border);
          border-radius: 11px;
          outline: none;
          color: var(--text-primary);
          background: var(--bg-primary);
          font-family: inherit;
          font-size: 11px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .leaderboard-search-box input:focus {
          border-color:
            rgba(99, 102, 241, 0.5);
          box-shadow:
            0 0 0 4px
            rgba(99, 102, 241, 0.07);
        }

        .leaderboard-search-box input::placeholder {
          color: var(--text-muted);
        }

        .leaderboard-search-box button {
          position: absolute;
          right: 8px;
          top: 50%;
          width: 28px;
          height: 28px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 8px;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .leaderboard-filter-divider {
          width: 1px;
          height: 30px;
          background: var(--bg-border);
        }

        .leaderboard-filter-selects {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .leaderboard-select-wrap {
          position: relative;
        }

        .leaderboard-select-wrap > svg {
          position: absolute;
          left: 12px;
          top: 50%;
          z-index: 1;
          color: var(--text-muted);
          transform: translateY(-50%);
          pointer-events: none;
        }

        .leaderboard-select-wrap select {
          min-width: 150px;
          min-height: 44px;
          padding: 0 32px 0 35px;
          border:
            1px solid var(--bg-border);
          border-radius: 11px;
          outline: none;
          color: var(--text-secondary);
          background: var(--bg-primary);
          font-family: inherit;
          font-size: 10px;
          cursor: pointer;
        }

        .leaderboard-select-wrap select:focus {
          border-color:
            rgba(99, 102, 241, 0.5);
        }

        .leaderboard-clear-filters {
          min-height: 42px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          border: 0;
          border-radius: 10px;
          color: #ef4444;
          background:
            rgba(239, 68, 68, 0.07);
          font-family: inherit;
          font-size: 9px;
          font-weight: 750;
          cursor: pointer;
        }


        /* ===================================================
           TABLE
        =================================================== */

        .leaderboard-table-card {
          overflow: hidden;
          border:
            1px solid var(--bg-border);
          border-radius: 20px;
          background: var(--bg-secondary);
          box-shadow:
            0 15px 45px
            rgba(15, 23, 42, 0.03);
        }

        .leaderboard-table-header {
          min-height: 66px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom:
            1px solid var(--bg-border);
        }

        .leaderboard-table-header > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .leaderboard-table-header strong {
          color: var(--text-primary);
          font-size: 12px;
        }

        .leaderboard-table-header span {
          color: var(--text-muted);
          font-size: 9px;
        }

        .leaderboard-result-count {
          padding: 6px 9px;
          border-radius: 8px;
          color: #6366f1 !important;
          background:
            rgba(99, 102, 241, 0.08);
          font-weight: 750;
          white-space: nowrap;
        }

        .leaderboard-table-scroll {
          overflow-x: auto;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .leaderboard-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
          text-align: left;
        }

        .leaderboard-table th {
          padding: 12px 16px;
          color: var(--text-muted);
          background:
            rgba(99, 102, 241, 0.025);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .leaderboard-table td {
          padding: 14px 16px;
          border-top:
            1px solid var(--bg-border);
          vertical-align: middle;
        }

        .leaderboard-table tbody tr {
          transition:
            background 0.2s ease;
        }

        .leaderboard-table tbody tr:hover {
          background:
            rgba(99, 102, 241, 0.025);
        }

        .rank-column {
          width: 82px;
          text-align: center !important;
        }

        .points-column {
          width: 110px;
          text-align: right !important;
        }

        .links-column {
          width: 100px;
          text-align: center !important;
        }

        .year-column {
          width: 150px;
        }

        .table-rank-badge {
          width: fit-content;
          min-width: 42px;
          height: 30px;
          margin: 0 auto;
          padding: 0 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border-radius: 9px;
          color: var(--text-muted);
          background: var(--bg-primary);
          font-size: 9px;
          font-weight: 800;
        }

        .table-rank-badge.rank-1 {
          color: #f59e0b;
          background:
            rgba(245, 158, 11, 0.1);
        }

        .table-rank-badge.rank-2 {
          color: #64748b;
          background:
            rgba(148, 163, 184, 0.12);
        }

        .table-rank-badge.rank-3 {
          color: #b45309;
          background:
            rgba(180, 83, 9, 0.08);
        }

        .table-member {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .table-member-avatar {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border:
            1px solid
            rgba(99, 102, 241, 0.14);
          border-radius: 11px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.08);
          font-size: 10px;
          font-weight: 850;
        }

        .table-member-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .table-member-copy a {
          overflow: hidden;
          color: var(--text-primary);
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .table-member-copy a:hover {
          color: #6366f1;
        }

        .table-member-copy span {
          color: var(--text-muted);
          font-size: 8px;
        }

        .table-year {
          color: var(--text-secondary);
          font-size: 10px;
        }

        .table-skills {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .table-skills > span:not(.no-skills) {
          padding: 4px 7px;
          border-radius: 7px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.07);
          font-size: 8px;
          font-weight: 650;
        }

        .table-skills small {
          color: var(--text-muted);
          font-size: 8px;
        }

        .table-skills .no-skills {
          color: var(--text-muted);
          background: transparent;
          font-size: 9px;
        }

        .table-points {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          gap: 4px;
        }

        .table-points strong {
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 850;
        }

        .table-points span {
          color: var(--text-muted);
          font-size: 8px;
        }

        .table-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .social-placeholder {
          width: 30px;
          height: 30px;
        }


        /* ===================================================
           EMPTY STATE
        =================================================== */

        .leaderboard-empty-cell {
          padding: 0 !important;
        }

        .leaderboard-empty-state {
          padding: 58px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .leaderboard-empty-state > div {
          width: 50px;
          height: 50px;
          margin-bottom: 14px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.08);
        }

        .leaderboard-empty-state strong {
          color: var(--text-primary);
          font-size: 13px;
        }

        .leaderboard-empty-state p {
          margin: 6px 0 15px;
          color: var(--text-muted);
          font-size: 10px;
        }

        .leaderboard-empty-state button {
          min-height: 36px;
          padding: 0 13px;
          border: 0;
          border-radius: 9px;
          color: #6366f1;
          background:
            rgba(99, 102, 241, 0.08);
          font-family: inherit;
          font-size: 9px;
          font-weight: 750;
          cursor: pointer;
        }


        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 1150px) {

          .leaderboard-container {
            padding:
              38px 28px 70px;
          }

          .leaderboard-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .scoring-rules-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .leaderboard-filter-card {
            flex-wrap: wrap;
          }

          .leaderboard-filter-divider {
            display: none;
          }

          .leaderboard-search-box {
            flex-basis: 100%;
          }

          .leaderboard-filter-selects {
            flex: 1;
          }

          .leaderboard-select-wrap {
            flex: 1;
          }

          .leaderboard-select-wrap select {
            width: 100%;
          }

        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 767px) {

          .leaderboard-container {
            padding:
              26px 16px 60px;
          }

          .leaderboard-page-header {
            align-items: flex-start;
          }

          .leaderboard-season-status {
            display: none;
          }

          .leaderboard-heading-area {
            align-items: flex-start;
          }

          .leaderboard-back-button {
            width: 38px;
            height: 38px;
          }

          .leaderboard-heading-icon {
            display: none;
          }

          .leaderboard-heading-copy h1 {
            font-size: 28px;
          }

          .leaderboard-heading-copy p {
            font-size: 12px;
          }

          .leaderboard-stats {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .leaderboard-stat-card {
            padding: 14px;
            align-items: flex-start;
            flex-direction: column;
          }

          .leaderboard-stat-icon {
            width: 38px;
            height: 38px;
          }

          .leaderboard-stat-copy strong {
            font-size: 19px;
          }

          .scoring-card-trigger {
            align-items: flex-start;
          }

          .scoring-trigger-left span,
          .scoring-trigger-action span {
            display: none;
          }

          .scoring-rules-grid {
            grid-template-columns: 1fr;
          }

          .leaderboard-section-heading {
            align-items: flex-start;
          }

          .podium-live-label {
            display: none;
          }

          .leaderboard-podium-grid {
            grid-template-columns: 1fr;
          }

          .podium-order-first {
            order: 1;
          }

          .podium-order-second {
            order: 2;
          }

          .podium-order-third {
            order: 3;
          }

          .leaderboard-podium-card.first {
            min-height: 325px;
            transform: none;
          }

          .leaderboard-podium-card {
            min-height: 305px;
          }

          .leaderboard-filter-card {
            align-items: stretch;
            flex-direction: column;
          }

          .leaderboard-search-box {
            min-width: 0;
          }

          .leaderboard-filter-selects {
            align-items: stretch;
            flex-direction: column;
          }

          .leaderboard-clear-filters {
            justify-content: center;
          }

          .leaderboard-table-header {
            align-items: flex-start;
          }

          .leaderboard-result-count {
            flex-shrink: 0;
          }

        }

        .leaderboard-cohort-badge {
          display: inline-block;
          margin-left: 12px;
          padding: 4px 10px;
          border-radius: 9px;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.09);
          border: 1px solid rgba(99, 102, 241, 0.18);
          font-size: 11px;
          font-weight: 750;
          vertical-align: middle;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

      `}</style>

    </div>
  );
}