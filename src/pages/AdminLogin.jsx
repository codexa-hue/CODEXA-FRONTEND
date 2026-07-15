// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import logo from '../assets/logo.png';
// import { KeyRound, Mail, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

// export default function AdminLogin() {
//   const { login, logout, isAuthenticated, isAdmin, profile, loading } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   // After auth state settles, redirect correctly based on role
//   useEffect(() => {
//     if (loading) return;
//     if (isAuthenticated && isAdmin) {
//       navigate('/admin', { replace: true });
//     } else if (isAuthenticated && !isAdmin) {
//       // A student tried to use the admin login — send them away
//       setError('This account does not have admin privileges.');
//       logout();
//     }
//   }, [isAuthenticated, isAdmin, loading, navigate, logout]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSubmitting(true);
//     try {
//       await login(email, password);
//       // useEffect handles redirect
//     } catch (err) {
//       setError(err.message || 'Login failed. Check your credentials.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="auth-saas-page auth-saas-admin">
//       <div className="auth-saas-admin-shell">

//         <div className="auth-saas-side admin-side"><div className="auth-saas-side-inner">
//           <span className="auth-saas-kicker">ADMIN CONTROL</span><h2>Run the club from one command center.</h2>
//           <p>Review members, publish events, manage resources and keep the community moving.</p>
//           <div className="admin-security-note"><ShieldCheck size={18}/><span>Role-protected access with authenticated sessions</span></div>
//         </div></div>
//         <div className="auth-saas-form-side admin-form">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <img src={logo} alt="CODEXA" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-glow-violet" />
//           <h1 className="font-display font-black text-2xl text-text-primary mb-1">Admin Portal</h1>
//           <p className="text-text-muted text-sm">Restricted access — authorised personnel only.</p>
//         </div>

//         <div className="card p-7 border border-brand-pink/20">
//           {error && (
//             <div className="flex items-start gap-2.5 bg-brand-red/10 border border-brand-red/25 text-brand-red p-3.5 rounded-xl text-sm mb-5">
//               <AlertCircle size={16} className="shrink-0 mt-0.5" />
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//                 Admin Email
//               </label>
//               <div className="relative">
//                 <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
//                 <input
//                   type="email" required value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="admin@codexa.club"
//                   className="input-field pl-10"
//                   autoComplete="username"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
//                 Password
//               </label>
//               <div className="relative">
//                 <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
//                 <input
//                   type="password" required minLength={6} value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="input-field pl-10"
//                   autoComplete="current-password"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50"
//               style={{ background: 'linear-gradient(135deg,#db2777,#9d174d)' }}
//             >
//               {submitting
//                 ? <div className="w-5 h-5 spinner" />
//                 : <><ShieldCheck size={16} /> Sign In as Admin</>
//               }
//             </button>
//           </form>
//         </div>

//         <div className="text-center mt-5 space-y-2">
//           <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors">
//             <ArrowLeft size={13} /> Back to home
//           </Link>
//           <p className="text-xs text-text-muted">
//             Student?{' '}
//             <Link to="/login" className="text-text-accent hover:underline">Sign in here →</Link>
//           </p>
//           <p className="text-xs text-text-muted">
//             <Link to="/forgot-password" className="text-brand-pink hover:underline">
//               Forgot password?
//             </Link>
//           </p>
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

import {
  KeyRound,
  Mail,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLogin() {
  const {
    login,
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  /*
    If an already authenticated user opens
    the Admin Login page, redirect correctly.
  */

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && isAdmin) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    isAdmin,
    loading,
    navigate,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      /*
        IMPORTANT:

        "admin" tells AuthContext that this login
        request comes from the Admin Portal.

        Without "admin", AuthContext defaults
        to the student portal.
      */

      const result = await login(
        email.trim(),
        password,
        "admin"
      );

      if (result.success && result.isAdmin) {
        navigate("/admin", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(
        "Admin login failed:",
        err
      );

      setError(
        err?.message ||
          "Login failed. Check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-saas-page auth-saas-admin">
      <div className="auth-saas-admin-shell">

        {/* LEFT SIDE */}

        <div className="auth-saas-side admin-side">
          <div className="auth-saas-side-inner">

            <span className="auth-saas-kicker">
              ADMIN CONTROL
            </span>

            <h2>
              Run the club from one command center.
            </h2>

            <p>
              Review members, publish events,
              manage resources and keep the
              community moving.
            </p>

            <div className="admin-security-note">
              <ShieldCheck size={18} />

              <span>
                Role-protected access with
                authenticated sessions
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="auth-saas-form-side admin-form">

          {/* HEADER */}

          <div className="text-center mb-8">

            <img
              src={logo}
              alt="CODEXA"
              className="
                w-16
                h-16
                rounded-2xl
                object-cover
                mx-auto
                mb-4
                shadow-glow-violet
              "
            />

            <h1 className="
              font-display
              font-black
              text-2xl
              text-text-primary
              mb-1
            ">
              Admin Portal
            </h1>

            <p className="
              text-text-muted
              text-sm
            ">
              Restricted access — authorised
              personnel only.
            </p>

          </div>

          {/* LOGIN CARD */}

          <div className="
            card
            p-7
            border
            border-brand-pink/20
          ">

            {/* ERROR MESSAGE */}

            {error && (
              <div className="
                flex
                items-start
                gap-2.5
                bg-brand-red/10
                border
                border-brand-red/25
                text-brand-red
                p-3.5
                rounded-xl
                text-sm
                mb-5
              ">

                <AlertCircle
                  size={16}
                  className="
                    shrink-0
                    mt-0.5
                  "
                />

                <span>{error}</span>

              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* EMAIL */}

              <div className="space-y-1.5">

                <label className="
                  text-xs
                  font-semibold
                  text-text-muted
                  uppercase
                  tracking-wider
                  block
                ">
                  Admin Email
                </label>

                <div className="relative">

                  <Mail
                    size={15}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-text-muted
                    "
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@codexa.club"
                    className="
                      input-field
                      pl-10
                    "
                    autoComplete="username"
                    disabled={submitting}
                  />

                </div>
              </div>

              {/* PASSWORD */}

              <div className="space-y-1.5">

                <label className="
                  text-xs
                  font-semibold
                  text-text-muted
                  uppercase
                  tracking-wider
                  block
                ">
                  Password
                </label>

                <div className="relative">

                  <KeyRound
                    size={15}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-text-muted
                    "
                  />

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="
                      input-field
                      pl-10
                    "
                    autoComplete="current-password"
                    disabled={submitting}
                  />

                </div>

                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <Link
                    to="/forgot-password"
                    state={{ from: '/admin/login' }}
                    style={{ fontSize: '13px', color: '#db2777', fontWeight: '500', textDecoration: 'none' }}
                  >
                    Forgot password?
                  </Link>
                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className="
                  w-full
                  py-3
                  rounded-xl
                  font-bold
                  text-sm
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-2
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                style={{
                  background:
                    "linear-gradient(135deg, #db2777, #9d174d)",
                }}
              >

                {submitting ? (
                  <>
                    <div className="
                      w-5
                      h-5
                      spinner
                    " />

                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />

                    Sign In as Admin
                  </>
                )}

              </button>

            </form>
          </div>

          {/* FOOTER LINKS */}

          <div className="
            text-center
            mt-5
            space-y-2
          ">

            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-text-muted
                hover:text-text-secondary
                transition-colors
              "
            >
              <ArrowLeft size={20} />

              Back to home
            </Link>

            {/* <p className="
              text-xs
              text-text-muted
            ">
              Student?{" "}

              <Link
                to="/login"
                className="
                  text-text-accent
                  hover:underline
                "
              >
                Sign in here →
              </Link>
            </p> */}

          </div>

        </div>
      </div>
    </div>
  );
}