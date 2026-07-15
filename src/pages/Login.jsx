import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  KeyRound,
  Mail,
  Send,
  User,
  UserCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import logo from "../assets/logo.png";
import PasswordStrength from "../components/PasswordStrength";

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

function RegisterForm({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("1st Year");
  const [joiningYear, setJoiningYear] = useState(new Date().getFullYear());
  const [skillsStr, setSkillsStr] = useState("");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    const skills = skillsStr
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      await api.joinRequests.submit({
        name,
        email,
        year,
        joining_year: parseInt(joiningYear),
        skills,
        reason_to_join: reason,
        password,
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Failed to submit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">
          <CheckCircle size={30} />
        </div>

        <h3>Application submitted</h3>

        <p>
          Your request has been sent to the admin.
          You can sign in after your application is
          approved.
        </p>

        <div className="pending-card">
          <Clock size={18} />

          <div>
            <strong>Pending admin approval</strong>
            <span>
              Your account becomes active after approval.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitch}
          className="secondary-action"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-form"
    >
      {error && (
        <div className="error-message">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        <Field
          label="Full Name"
          icon={<User size={17} />}
        >
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </Field>

        <Field
          label="Email"
          icon={<Mail size={17} />}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="form-grid">
        <Field
          label="Academic Year"
          icon={<UserCircle2 size={17} />}
        >
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {YEAR_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Joining Year"
          icon={<Calendar size={17} />}
        >
          <input
            type="number"
            required
            min={2000}
            max={2100}
            value={joiningYear}
            onChange={(e) => setJoiningYear(e.target.value)}
            placeholder="e.g. 2023"
          />
        </Field>
      </div>

      <Field
        label="Skills"
        icon={<BookOpen size={17} />}
      >
        <input
          type="text"
          value={skillsStr}
          onChange={(e) =>
            setSkillsStr(e.target.value)
          }
          placeholder="Python, React, Node.js..."
        />
      </Field>

      <div className="field-block">
        <label>Why do you want to join?</label>

        <textarea
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tell us about your interests and what you want to build..."
        />
      </div>

      <div className="form-grid">
        <div>
          <Field
            label="Password"
            icon={<KeyRound size={17} />}
          >
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimum 6 characters"
            />
          </Field>
          <PasswordStrength password={password} />
        </div>

        <Field
          label="Confirm Password"
          icon={<KeyRound size={17} />}
        >
          <input
            type="password"
            required
            value={confirmPw}
            onChange={(e) =>
              setConfirmPw(e.target.value)
            }
            placeholder="Repeat password"
          />
        </Field>
      </div>

      <div className="info-message">
        <Clock size={17} />

        <span>
          Your application must be approved before
          you can sign in.
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="primary-action"
      >
        {loading ? (
          "Submitting..."
        ) : (
          <>
            <Send size={17} />
            Submit Application
          </>
        )}
      </button>
    </form>
  );
}

function SignInForm() {
  const {
    login,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      navigate("/home", { replace: true });
    }
  }, [
    isAuthenticated,
    isAdmin,
    navigate,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        email,
        password,
        "student"
      );

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Incorrect email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-form"
    >
      {error && (
        <div className="error-message">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <Field
        label="Email or Member ID"
        icon={<Mail size={17} />}
      >
        <input
          type="text"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="you@example.com or 23CDXF5W8"
          autoComplete="username"
        />
      </Field>

      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>

        <div className="input-shell">
          <KeyRound size={17} />

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        <div style={{ textAlign: 'right', marginTop: '6px' }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '500', textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="primary-action"
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            Sign In
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1.5px solid rgba(59,130,246,0.25)',
          background: 'rgba(59,130,246,0.06)',
          color: '#3b82f6',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.2s',
          marginTop: '2px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
      >
         Back to home
      </Link>
    </form>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="field-block">
      <label>{label}</label>

      <div className="input-shell">
        {icon}
        {children}
      </div>
    </div>
  );
}

export default function Login() {
  const location = useLocation();

  const [tab, setTab] = useState(
    location.pathname === "/register"
      ? "register"
      : "login"
  );

  useEffect(() => {
    setTab(
      location.pathname === "/register"
        ? "register"
        : "login"
    );
  }, [location.pathname]);

  return (
    <main className="student-auth-page">
      <div className="student-auth-shell">
        <section className="auth-visual-panel">
          <div className="visual-top">
            <Link
              to="/"
              className="light-brand"
            >
              <img src={logo} alt="CODEXA" />
              <span>CODEXA</span>
            </Link>

            <span className="visual-badge">
              STUDENT DEVELOPER PLATFORM
            </span>
          </div>

          <div className="visual-main">
            <h1>
              Build your
              <br />
            Technical 
              <br />
              <span>Skills.</span>
            </h1>

            <p>
              One focused workspace for projects,
              events, resources, rankings and
              measurable progress.
            </p>
          </div>

          <div className="visual-stats">
            <div>
              <strong>142</strong>
              <span>Total points</span>
            </div>

            <div>
              <strong>#3</strong>
              <span>Club rank</span>
            </div>

            <div>
              <strong>7</strong>
              <span>Events</span>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div
            className={`form-container ${
              tab === "register"
                ? "register-mode"
                : ""
            }`}
          >
            <Link
              to="/"
              className="mobile-brand"
            >
              <img src={logo} alt="CODEXA" />
              <span>CODEXA</span>
            </Link>

            <div className="portal-badge">
              <UserCircle2 size={14} />
              Student Portal
            </div>

            <div className="form-heading">
              <h2>
                {tab === "login"
                  ? "Welcome back"
                  : "Join CODEXA"}
              </h2>

              <p>
                {tab === "login"
                  ? "Sign in to continue your developer journey."
                  : "Apply to join the student developer community."}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={
                  tab === "login"
                    ? "active"
                    : ""
                }
                onClick={() => setTab("login")}
              >
                Sign In
              </button>

              <button
                type="button"
                className={
                  tab === "register"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTab("register")
                }
              >
                Apply to Join
              </button>
            </div>

            {tab === "login" ? (
              <SignInForm />
            ) : (
              <RegisterForm
                onSwitch={() =>
                  setTab("login")
                }
              />
            )}

            <div className="auth-bottom">
              <div className="admin-divider">
                <span />
                {/* <p>Administrator access</p> */}
                <span />
              </div>

              {/* <Link
                to="/admin/login"
                className="admin-portal-link"
              >
                Open Admin Portal
                <ArrowRight size={15} />
              </Link> */}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

       .student-auth-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 12% 18%,
      rgba(59, 130, 246, 0.28),
      transparent 32%
    ),
    radial-gradient(
      circle at 88% 78%,
      rgba(99, 102, 241, 0.22),
      transparent 30%
    ),
    radial-gradient(
      circle at 55% 10%,
      rgba(14, 165, 233, 0.12),
      transparent 26%
    ),
    linear-gradient(
      135deg,
      #eef5ff 0%,
      #f8fbff 45%,
      #edf3ff 100%
    );
}

       .student-auth-shell {
  position: relative;
  width: min(1180px, 100%);
  height: min(
    760px,
    calc(100vh - 48px)
  );
  min-height: 620px;

  display: grid;
  grid-template-columns:
    minmax(0, 0.95fr)
    minmax(0, 1.05fr);

  overflow: hidden;

  border:
    1px solid
    rgba(255, 255, 255, 0.72);

  border-radius: 28px;

  background:
    rgba(255, 255, 255, 0.58);

  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);

  box-shadow:
    0 30px 80px
      rgba(30, 64, 175, 0.14),
    inset 0 1px 0
      rgba(255, 255, 255, 0.85);
}
.auth-visual-panel {
  position: relative;
  padding: 48px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #ffffff;

  background:
    linear-gradient(
      145deg,
      rgba(15, 23, 42, 0.94),
      rgba(15, 23, 42, 0.82)
    );

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  border-right:
    1px solid
    rgba(255, 255, 255, 0.12);
}
        .auth-visual-panel::after {
  content: "";
  position: absolute;
  width: 430px;
  height: 430px;
  right: -220px;
  bottom: -240px;
  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(59, 130, 246, 0.38),
      rgba(99, 102, 241, 0.16) 45%,
      transparent 72%
    );

  filter: blur(12px);
}

        .visual-top,
        .visual-main,
        .visual-stats {
          position: relative;
          z-index: 2;
        }

        .visual-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .light-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 900;
        }

        .light-brand img,
        .mobile-brand img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
        }

        .visual-badge {
          padding: 7px 10px;
          border:
            1px solid
            rgba(255,255,255,0.12);
          border-radius: 999px;
          background:
            rgba(255,255,255,0.06);
          color: #b9baff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .visual-main {
          margin-top: auto;
          margin-bottom: 32px;
        }

        .visual-main h1 {
          margin: 0 0 20px;
          font-size:
            clamp(3rem, 4vw, 4.7rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .visual-main h1 span {
          background:
            linear-gradient(
              90deg,
              #7775ff,
              #a78bfa
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color:
            transparent;
        }

        .visual-main p {
          max-width: 450px;
          margin: 0;
          color: #aeb4ca;
          font-size: 15px;
          line-height: 1.7;
        }

        .visual-stats {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 10px;
        }

        .visual-stats div {
          padding: 16px;
          border:
            1px solid
            rgba(255,255,255,0.1);
          border-radius: 15px;
          background:
            rgba(255,255,255,0.06);
        }

        .visual-stats strong {
          display: block;
          margin-bottom: 4px;
          font-size: 22px;
        }

        .visual-stats span {
          color: #8e96b2;
          font-size: 10px;
        }

       .auth-form-panel {
  position: relative;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.64),
      rgba(255, 255, 255, 0.42)
    );

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

        .form-container {
          width: min(430px, 100%);
          margin: auto;
        }

        .form-container.register-mode {
          width: min(520px, 100%);
        }

        .mobile-brand {
          display: none;
        }

       .portal-badge {
  width: fit-content;
  margin-bottom: 16px;
  padding: 7px 12px;
  display: flex;
  align-items: center;
  gap: 7px;

  border:
    1px solid
    rgba(99, 102, 241, 0.18);

  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.48);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;

  box-shadow:
    inset 0 1px 0
    rgba(255, 255, 255, 0.72);
}

        .form-heading {
          margin-bottom: 20px;
        }

        .form-heading h2 {
          margin: 0 0 7px;
          color: #101328;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .form-heading p {
          margin: 0;
          color: #747b98;
          font-size: 14px;
          line-height: 1.6;
        }

       .auth-tabs {
  margin-bottom: 22px;
  padding: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;

  border:
    1px solid
    rgba(148, 163, 184, 0.18);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.34);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

        .auth-tabs button {
          padding: 10px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #7b8098;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

       .auth-tabs button.active {
  background:
    rgba(255, 255, 255, 0.82);

  color: #2563eb;

  box-shadow:
    0 6px 18px
      rgba(37, 99, 235, 0.10),
    inset 0 1px 0
      rgba(255, 255, 255, 0.95);
}

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .field-block > label,
        .password-label-row label {
          display: block;
          margin-bottom: 7px;
          color: #686f8b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .password-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .password-label-row a {
          margin-bottom: 7px;
          color: #6259e8;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        }

       .input-shell {
  min-height: 48px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;

  border:
    1px solid
    rgba(148, 163, 184, 0.28);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.48);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow:
    inset 0 1px 0
    rgba(255, 255, 255, 0.72);

  transition: 0.2s ease;
}

       .input-shell:focus-within {
  border-color:
    rgba(59, 130, 246, 0.58);

  background:
    rgba(255, 255, 255, 0.76);

  box-shadow:
    0 0 0 4px
      rgba(59, 130, 246, 0.10),
    inset 0 1px 0
      rgba(255, 255, 255, 0.9);
}

        .input-shell svg {
          flex-shrink: 0;
          color: #9298ad;
        }

        .input-shell input,
        .input-shell select {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #171a2d;
          font: inherit;
          font-size: 13px;
        }

      .field-block textarea {
  width: 100%;
  padding: 13px 14px;

  border:
    1px solid
    rgba(148, 163, 184, 0.28);

  border-radius: 12px;
  outline: 0;
  resize: vertical;

  background:
    rgba(255, 255, 255, 0.48);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  color: #171a2d;
  font: inherit;
  font-size: 13px;

  box-shadow:
    inset 0 1px 0
    rgba(255, 255, 255, 0.72);

  transition: 0.2s ease;
}

        .field-block textarea:focus {
          border-color: #7168ff;
          background: #ffffff;
          box-shadow:
            0 0 0 4px
            rgba(113,104,255,0.1);
        }

        .primary-action,
        .secondary-action {
          min-height: 48px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-action {
          border: 0;
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #635bff,
              #7c6df2
            );
          box-shadow:
            0 12px 28px
            rgba(99,91,255,0.25);
        }

        .secondary-action {
          width: 100%;
          border: 1px solid #dfe2ed;
          background: #ffffff;
          color: #31364f;
        }

        .primary-action:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .error-message,
        .info-message {
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border-radius: 11px;
          font-size: 12px;
          line-height: 1.5;
        }

        .error-message {
          border:
            1px solid
            rgba(239,68,68,0.2);
          background:
            rgba(239,68,68,0.07);
          color: #dc2626;
        }

        .info-message {
          border:
            1px solid
            rgba(245,158,11,0.2);
          background:
            rgba(245,158,11,0.07);
          color: #8a6214;
        }

        .auth-bottom {
          margin-top: 20px;
          text-align: center;
        }

        .admin-divider {
          margin-bottom: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-divider span {
          flex: 1;
          height: 1px;
          background: #eceef5;
        }

        .admin-divider p {
          margin: 0;
          color: #a0a5b7;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .admin-portal-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6b63e8;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .success-state {
          text-align: center;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e9fbf4;
          color: #0f9f72;
        }

        .success-state h3 {
          margin: 0 0 8px;
          color: #101328;
          font-size: 22px;
        }

        .success-state > p {
          margin: 0 0 18px;
          color: #747b98;
          font-size: 13px;
          line-height: 1.6;
        }

        .pending-card {
          margin-bottom: 16px;
          padding: 13px;
          display: flex;
          gap: 10px;
          text-align: left;
          border: 1px solid #eceef5;
          border-radius: 12px;
          background: #fafbfe;
        }

        .pending-card strong,
        .pending-card span {
          display: block;
        }

        .pending-card strong {
          color: #20243a;
          font-size: 12px;
        }

        .pending-card span {
          margin-top: 3px;
          color: #8389a1;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .student-auth-page {
            padding: 0;
          }

          .student-auth-shell {
            min-height: 100vh;
            height: auto;
            grid-template-columns: 1fr;
            border: 0;
            border-radius: 0;
          }

          .auth-visual-panel {
            display: none;
          }

          .auth-form-panel {
            padding: 40px 24px;
          }

          .mobile-brand {
            margin-bottom: 32px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #171a2d;
            font-weight: 900;
            text-decoration: none;
          }
        }

        @media (max-width: 560px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .auth-form-panel {
            padding: 28px 20px;
          }

          .form-heading h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}