// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { api } from '../services/api';

// const AuthContext = createContext(null);

// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch (e) {
//     return null;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [email, setEmail] = useState(localStorage.getItem('email'));
//   const [profile, setProfile] = useState(() => {
//     const cached = localStorage.getItem('profile');
//     return cached ? JSON.parse(cached) : null;
//   });
//   const [loading, setLoading] = useState(true);

//   // Auto-verify and load profile on startup/reload
//   useEffect(() => {
//     const verifySession = async () => {
//       if (token) {
//         const decoded = parseJwt(token);
//         if (!decoded || decoded.exp * 1000 < Date.now()) {
//           // Token expired
//           logout();
//         } else {
//           try {
//             // Re-fetch member profile to sync state
//             const members = await api.members.getAll();
//             const myProfile = members.find((m) => m.user_id === decoded.sub);
//             if (myProfile) {
//               setProfile(myProfile);
//               localStorage.setItem('profile', JSON.stringify(myProfile));
//             }
//           } catch (err) {
//             console.error('Failed to restore session profile:', err);
//             // Don't log out immediately on temporary connection failures
//           }
//         }
//       }
//       setLoading(false);
//     };

//     verifySession();
//   }, [token]);

//   const login = async (loginEmail, password) => {
//     setLoading(true);
//     try {
//       const data = await api.auth.login(loginEmail, password);
//       const jwtToken = data.access_token;
//       const decoded = parseJwt(jwtToken);
      
//       if (!decoded) throw new Error('Invalid token payload received.');

//       localStorage.setItem('token', jwtToken);
//       localStorage.setItem('email', loginEmail);
//       setToken(jwtToken);
//       setEmail(loginEmail);

//       // Fetch member profiles and find the one linked to user ID
//       const members = await api.members.getAll();
//       const myProfile = members.find((m) => m.user_id === decoded.sub) || members.find((m) => m.user_id === decoded.sub?.toString());

//       if (myProfile) {
//         setProfile(myProfile);
//         localStorage.setItem('profile', JSON.stringify(myProfile));
//       } else {
//         // If a profile doesn't exist yet (e.g. database sync latency), create temporary fallback
//         const fallbackProfile = {
//           user_id: decoded.sub,
//           name: loginEmail.split('@')[0],
//           role: 'Member',
//           year: '1st Year',
//           skills: [],
//           socials: { github: '', linkedin: '', twitter: '', portfolio: '' },
//           points: 0
//         };
//         setProfile(fallbackProfile);
//         localStorage.setItem('profile', JSON.stringify(fallbackProfile));
//       }
      
//       return true;
//     } catch (err) {
//       logout();
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('email');
//     localStorage.removeItem('profile');
//     setToken(null);
//     setEmail(null);
//     setProfile(null);
//   };

//   const updateProfileState = (updatedProfile) => {
//     setProfile(updatedProfile);
//     localStorage.setItem('profile', JSON.stringify(updatedProfile));
//   };

//   const value = {
//     token,
//     email,
//     profile,
//     loading,
//     isAuthenticated: !!token,
//     isAdmin: profile?.role?.toLowerCase() === 'admin',
//     login,
//     logout,
//     updateProfileState
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [email, setEmail] = useState(
    localStorage.getItem("email")
  );

  const [uniqueId, setUniqueId] = useState(
    localStorage.getItem("uniqueId") || null
  );

  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("profile");

    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("uniqueId");
    localStorage.removeItem("profile");

    setToken(null);
    setEmail(null);
    setUniqueId(null);
    setProfile(null);
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = parseJwt(token);

      if (!decoded || decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const members = await api.members.getAll();

        const myProfile = members.find(
          (member) =>
            String(member.user_id) === String(decoded.sub)
        );

        if (myProfile) {
          setProfile(myProfile);

          localStorage.setItem(
            "profile",
            JSON.stringify(myProfile)
          );
        }

        // Refresh the real email + unique_id from /me
        try {
          const meData = await api.auth.getMe();
          const actualEmail = meData.email;
          const actualUniqueId = meData.unique_id || null;
          if (actualEmail) {
            localStorage.setItem("email", actualEmail);
            setEmail(actualEmail);
          }
          if (actualUniqueId) {
            localStorage.setItem("uniqueId", actualUniqueId);
            setUniqueId(actualUniqueId);
          }
        } catch {
          // silent — keep existing cached values
        }
      } catch (err) {
        console.error(
          "Failed to restore session profile:",
          err
        );
      }

      setLoading(false);
    };

    verifySession();
  }, [token]);

  /*
    portalType:
    "student" -> only members can login
    "admin"   -> only admins can login
  */

  const login = async (
    loginEmail,
    password,
    portalType = "student"
  ) => {
    setLoading(true);

    try {
      const data = await api.auth.login(
        loginEmail,
        password
      );

      const jwtToken = data.access_token;
      const decoded = parseJwt(jwtToken);

      if (!decoded) {
        throw new Error(
          "Invalid token payload received."
        );
      }

      /*
        Temporarily store token because protected API
        requests may need it to fetch the profile.
      */

      localStorage.setItem("token", jwtToken);

      const members = await api.members.getAll();

      const myProfile = members.find(
        (member) =>
          String(member.user_id) === String(decoded.sub)
      );

      /*
        Get role from profile first.
        Fall back to JWT role if available.
      */

      const userRole = (
        myProfile?.role ||
        decoded.role ||
        ""
      ).toLowerCase();

      const userIsAdmin = userRole === "admin";

      /*
        BLOCK ADMIN FROM STUDENT PORTAL
      */

      if (
        portalType === "student" &&
        userIsAdmin
      ) {
        localStorage.removeItem("token");

        throw new Error(
          "Admin accounts must use the Admin Portal."
        );
      }

      /*
        BLOCK STUDENT FROM ADMIN PORTAL
      */

      if (
        portalType === "admin" &&
        !userIsAdmin
      ) {
        localStorage.removeItem("token");

        throw new Error(
          "This account does not have admin access."
        );
      }

      /*
        LOGIN IS VALID FOR THE CORRECT PORTAL
      */

      const finalProfile =
        myProfile || {
          user_id: decoded.sub,
          name: loginEmail.split("@")[0],
          role: userIsAdmin ? "Admin" : "Member",
          year: "1st Year",
          skills: [],
          socials: {
            github: "",
            linkedin: "",
            twitter: "",
            portfolio: "",
          },
          points: 0,
        };

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("email", loginEmail);

      // Fetch the actual user email and unique_id (in case they logged in with Member ID)
      try {
        const meData = await api.auth.getMe();
        const actualEmail = meData.email || loginEmail;
        const actualUniqueId = meData.unique_id || null;
        localStorage.setItem("email", actualEmail);
        if (actualUniqueId) localStorage.setItem("uniqueId", actualUniqueId);
        setEmail(actualEmail);
        setUniqueId(actualUniqueId);
      } catch {
        // Fallback: use whatever they typed
        setEmail(loginEmail);
      }

      localStorage.setItem(
        "profile",
        JSON.stringify(finalProfile)
      );

      setToken(jwtToken);
      setProfile(finalProfile);

      return {
        success: true,
        isAdmin: userIsAdmin,
      };
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("profile");

      setToken(null);
      setEmail(null);
      setProfile(null);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const data = await api.auth.refresh();
      const jwtToken = data.access_token;
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
      return true;
    } catch (err) {
      console.error("Failed to refresh session token:", err);
      return false;
    }
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);

    localStorage.setItem(
      "profile",
      JSON.stringify(updatedProfile)
    );
  };

  const value = {
    token,
    email,
    uniqueId,
    profile,
    loading,

    isAuthenticated: !!token,

    isAdmin:
      profile?.role?.toLowerCase() === "admin",

    login,
    logout,
    updateProfileState,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};