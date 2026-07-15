import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getFullUploadUrl } from '../utils/url';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Search, FileText, Megaphone, Calendar, BookOpen,Clock,
  Check, X, CheckCircle, AlertCircle, ArrowLeft, Link2, ExternalLink, Users, Trophy, Trash2,
} from 'lucide-react';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Machine Learning', 'General'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, updateProfileState } = useAuth();

  // Read active tab from URL query param — sidebar sets ?tab=xxx
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab') || 'requests';
    setActiveTab(tab);
  }, [location.search]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [onboardedInfo, setOnboardedInfo] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [bulkApproving, setBulkApproving] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle]   = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annAuthor, setAnnAuthor]  = useState('Admin');
  const [annImage, setAnnImage] = useState('');
  const [annVideo, setAnnVideo] = useState('');
  const [annExpiresAt, setAnnExpiresAt] = useState('');
  const [uploadingAnnMedia, setUploadingAnnMedia] = useState(false);

  // Announcements list
  const [announcements, setAnnouncements] = useState([]);
  const [fetchingAnn, setFetchingAnn] = useState(false);

  // Event form
  const [evTitle, setEvTitle]       = useState('');
  const [evDesc, setEvDesc]         = useState('');
  const [evDate, setEvDate]         = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evMaxSeats, setEvMaxSeats] = useState('');
  const [evFormUrl, setEvFormUrl]   = useState('');
  const [evImage, setEvImage]       = useState('');
  const [evVideo, setEvVideo]       = useState('');
  const [uploadingEvMedia, setUploadingEvMedia] = useState(false);

  // Event list & registrations tracking
  const [events, setEvents] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [selectedEventRegs, setSelectedEventRegs] = useState({});
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [loadingRegs, setLoadingRegs] = useState({});

  // Members + award points
  const [members, setMembers] = useState([]);
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [awardTarget, setAwardTarget] = useState(null);
  const [awardPoints, setAwardPoints] = useState(10);
  const [awardReason, setAwardReason] = useState('');
  const [awardType, setAwardType]     = useState('workshop');
  const [awarding, setAwarding] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  // Bulk award
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [bulkPoints, setBulkPoints] = useState(10);
  const [bulkReason, setBulkReason] = useState('');
  const [bulkType, setBulkType]     = useState('workshop');
  const [bulkAwarding, setBulkAwarding] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  // Point revocation
  const [revokeTarget, setRevokeTarget] = useState(null); // { member, entryIdx }
  // Announcement search
  const [annSearch, setAnnSearch] = useState('');

  // ── Admin Profile state ───────────────────────────────────────
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // {type:'success'|'error', text}
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');

  // Weekly Challenges Tab States
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [fetchingChallenges, setFetchingChallenges] = useState(false);
  const [chalTitle, setChalTitle] = useState('');
  const [chalDesc, setChalDesc] = useState('');
  const [chalDiff, setChalDiff] = useState('Easy');
  const [chalLink, setChalLink] = useState('');
  const [chalPoints, setChalPoints] = useState(10);
  const [challengesSubTab, setChallengesSubTab] = useState('prompts'); // prompts | submissions
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  // Resource form
  const [resTitle, setResTitle]     = useState('');
  const [resCategory, setResCategory] = useState('');
  const [resUrl, setResUrl]         = useState('');
  const [resDesc, setResDesc]       = useState('');
  const [resources, setResources] = useState([]);
  const [fetchingResources, setFetchingResources] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);

  useEffect(() => {
    // Always load overview stats
    api.members.getAll().then(data => setMembers(data.sort((a,b) => b.points - a.points))).catch(() => {});
    api.events.getAllAdmin().then(data => setEvents(data.sort((a,b) => new Date(b.date) - new Date(a.date)))).catch(() => {});
    api.announcements.getAllAdmin().then(data => setAnnouncements(data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)))).catch(() => {});
    api.joinRequests.getAll().then(data => {
      setRequests(data.sort((a,b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'announcements') fetchAnnouncements();
    if (activeTab === 'members') fetchMembers();
    if (activeTab === 'resources') fetchResources();
    if (activeTab === 'profile') fetchAdminProfile();
    if (activeTab === 'challenges') {
      fetchChallenges();
      fetchAllSubmissions();
    }
  }, [activeTab]);

  const fetchAdminProfile = async () => {
    // Pre-fill instantly from AuthContext cache
    if (profile?.name) setProfileName(profile.name);
    try {
      const data = await api.auth.getMe();
      setAdminProfile(data);
      setProfileName(data.display_name || profile?.name || '');
    } catch (err) { console.error(err); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await api.auth.updateMe(profileName.trim());
      setAdminProfile(prev => ({ ...prev, display_name: res.display_name }));
      // Update AuthContext profile so sidebar re-renders immediately
      const cached = JSON.parse(localStorage.getItem('profile') || '{}');
      const updated = { ...cached, name: res.display_name };
      updateProfileState(updated);
      setProfileMsg({ type: 'success', text: 'Display name updated successfully!' });
      showToast('Profile saved!');
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to save.' });
    } finally { setProfileSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pwNew.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      await api.auth.changePassword(pwCurrent, pwNew);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      showToast('Password updated!');
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally { setPwSaving(false); }
  };

  const fetchMembers = async () => {
    setFetchingMembers(true);
    try {
      const data = await api.members.getAll();
      setMembers(data.sort((a, b) => b.points - a.points));
    } catch (err) { console.error(err); }
    finally { setFetchingMembers(false); }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    if (!awardTarget) return;
    setAwarding(true);
    try {
      await api.members.awardPoints(awardTarget.id, {
        points: parseInt(awardPoints),
        reason: awardReason,
        activity_type: awardType,
        awarded_by: 'Admin',
      });
      showToast(`+${awardPoints} pts awarded to ${awardTarget.name}!`);
      setAwardTarget(null);
      setAwardReason('');
      setAwardPoints(10);
      setAwardType('workshop');
      fetchMembers();
    } catch (err) {
      alert(err.message || 'Failed to award points.');
    } finally { setAwarding(false); }
  };

  const handleBulkAward = async (e) => {
    e.preventDefault();
    if (bulkSelected.size === 0) return;
    setBulkAwarding(true);
    let succeeded = 0;
    for (const memberId of bulkSelected) {
      try {
        await api.members.awardPoints(memberId, {
          points: parseInt(bulkPoints),
          reason: bulkReason,
          activity_type: bulkType,
          awarded_by: 'Admin',
        });
        succeeded++;
      } catch (err) { console.error(err); }
    }
    showToast(`+${bulkPoints} pts awarded to ${succeeded} members!`);
    setBulkSelected(new Set());
    setBulkReason('');
    setBulkPoints(10);
    setBulkType('workshop');
    setShowBulkModal(false);
    setBulkAwarding(false);
    fetchMembers();
  };

  const handleRevokePoints = async () => {
    if (!revokeTarget) return;
    try {
      await api.members.revokePoints(revokeTarget.member.id, revokeTarget.entryIdx);
      showToast('Points entry revoked.');
      setRevokeTarget(null);
      fetchMembers();
    } catch (err) {
      alert(err.message || 'Failed to revoke.');
    }
  };

  const fetchAnnouncements = async () => {
    setFetchingAnn(true);
    try {
      const data = await api.announcements.getAllAdmin();
      setAnnouncements(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingAnn(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.joinRequests.getAll();
      setRequests(
        data.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setFetchingEvents(true);
    try {
      const data = await api.events.getAllAdmin();
      setEvents(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingEvents(false);
    }
  };

  const handleFileUpload = async (file, fileType, form) => {
    const isAnn = form === 'ann';
    if (isAnn) setUploadingAnnMedia(true);
    else setUploadingEvMedia(true);

    try {
      const res = await api.upload.file(file);
      if (res.type === 'video') {
        if (isAnn) {
          setAnnVideo(res.url);
          setAnnImage('');
        } else {
          setEvVideo(res.url);
          setEvImage('');
        }
      } else {
        if (isAnn) {
          setAnnImage(res.url);
          setAnnVideo('');
        } else {
          setEvImage(res.url);
          setEvVideo('');
        }
      }
      showToast('File uploaded successfully!');
    } catch (err) {
      alert(err.message || 'File upload failed.');
    } finally {
      if (isAnn) setUploadingAnnMedia(false);
      else setUploadingEvMedia(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleProcessRequest = async (id, status, email) => {
    setOnboardedInfo(null);
    try {
      await api.joinRequests.updateStatus(id, status);
      showToast(`Application ${status}!`);
      if (status === 'approved') {
        setOnboardedInfo({ email });
      }
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleApproveAll = async () => {
    const pendingCount = requests.filter((r) => r.status === 'pending').length;
    if (pendingCount === 0) return;
    if (!window.confirm(`Approve all ${pendingCount} pending application(s)? Accounts will be created immediately.`)) return;
    setBulkApproving(true);
    try {
      const res = await api.joinRequests.approveAll();
      showToast(res.message || `${res.approved_count} application(s) approved!`);
      setOnboardedInfo(null);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Bulk approval failed.');
    } finally {
      setBulkApproving(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await api.announcements.create({
        title: annTitle,
        content: annContent,
        author: annAuthor,
        image_url: annImage || null,
        video_url: annVideo || null,
        expires_at: annExpiresAt ? new Date(annExpiresAt).toISOString() : null,
      });
      showToast('Announcement posted!');
      setAnnTitle(''); setAnnContent('');
      setAnnImage(''); setAnnVideo(''); setAnnExpiresAt('');
      fetchAnnouncements();
    } catch (err) {
      alert(err.message || 'Failed.');
    } finally { setFormSubmitting(false); }
  };

  const handleDeleteAnnouncement = (id) => {
    setConfirmConfig({
      title: 'Delete this announcement?',
      message: 'This action will permanently delete the announcement.',
      onConfirm: async () => {
        try {
          await api.announcements.delete(id);
          showToast('Announcement deleted.');
          fetchAnnouncements();
        } catch (err) {
          alert(err.message || 'Failed to delete.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleDeleteExpired = () => {
    setConfirmConfig({
      title: 'Permanently delete all expired announcements?',
      message: 'This action will remove all old announcements and cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await api.announcements.deleteExpired();
          showToast(res.message || 'Expired announcements removed.');
          fetchAnnouncements();
        } catch (err) {
          alert(err.message || 'Failed.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await api.events.create({
        title: evTitle,
        description: evDesc,
        date: new Date(evDate).toISOString(),
        location: evLocation,
        max_seats: evMaxSeats ? parseInt(evMaxSeats) : null,
        google_form_url: evFormUrl || null,
        image_url: evImage || null,
        video_url: evVideo || null
      });
      showToast('Event created!');
      setEvTitle(''); setEvDesc(''); setEvDate(''); setEvLocation(''); setEvMaxSeats('');
      setEvFormUrl('');
      setEvImage(''); setEvVideo('');
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Failed.');
    } finally { setFormSubmitting(false); }
  };

  const handleDeleteEvent = (id) => {
    setConfirmConfig({
      title: 'Are you sure you want to delete this event?',
      message: 'This will delete the event and its associated registrations.',
      onConfirm: async () => {
        try {
          await api.events.delete(id);
          showToast('Event deleted!');
          fetchEvents();
        } catch (err) {
          alert(err.message || 'Failed to delete event.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleDeleteExpiredEvents = () => {
    setConfirmConfig({
      title: 'Permanently delete all expired events?',
      message: 'This action will remove all past events and cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await api.events.deleteExpired();
          showToast(res.message || 'Expired events removed.');
          fetchEvents();
        } catch (err) {
          alert(err.message || 'Failed.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleToggleRegistrations = async (eventId) => {
    if (selectedEventRegs[eventId]) {
      const copy = { ...selectedEventRegs };
      delete copy[eventId];
      setSelectedEventRegs(copy);
    } else {
      setSelectedEventRegs({
        ...selectedEventRegs,
        [eventId]: []
      });
      setLoadingRegs(prev => ({
        ...prev,
        [eventId]: true
      }));
      try {
        const regs = await api.events.getRegistrations(eventId);
        setSelectedEventRegs(prev => ({
          ...prev,
          [eventId]: regs
        }));
      } catch (err) {
        alert(err.message || 'Failed to fetch registrations.');
        setSelectedEventRegs(prev => {
          const copy = { ...prev };
          delete copy[eventId];
          return copy;
        });
      } finally {
        setLoadingRegs(prev => {
          const copy = { ...prev };
          delete copy[eventId];
          return copy;
        });
      }
    }
  };

  const handleToggleAttendance = async (eventId, userId, attended) => {
    try {
      await api.events.updateAttendance(eventId, userId, attended);
      showToast(attended ? 'Attendance marked (+10 points)' : 'Attendance unmarked (-10 points)');
      
      const updatedRegs = (selectedEventRegs[eventId] || []).map((r) => {
        if (r.user_id === userId) {
          return {
            ...r,
            attended,
            points: attended ? r.points + 10 : Math.max(0, r.points - 10),
          };
        }
        return r;
      });
      setSelectedEventRegs({
        ...selectedEventRegs,
        [eventId]: updatedRegs,
      });
    } catch (err) {
      alert(err.message || 'Failed to update attendance.');
    }
  };

  const handleExportEventRoster = (eventId, eventTitle) => {
    const regs = selectedEventRegs[eventId] || [];
    if (regs.length === 0) {
      alert("No registered students to export.");
      return;
    }

    const headers = ["Name", "Email", "Academic Year", "Leaderboard Points", "Attendance Status"];
    const rows = regs.map((r) => [
      r.name || "Unknown",
      r.email || "",
      r.year || "—",
      r.points || 0,
      r.attended ? "Present" : "Absent"
    ]);

    const csvString = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const cleanTitle = String(eventTitle).toLowerCase().replace(/[^a-z0-9]+/g, "_");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${cleanTitle}_attendance_roster.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Roster CSV downloaded!");
  };


  const fetchChallenges = async () => {
    setFetchingChallenges(true);
    try {
      const data = await api.challenges.getAll();
      setChallenges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setChallenges([]);
    } finally {
      setFetchingChallenges(false);
    }
  };

  const fetchAllSubmissions = async () => {
    try {
      const data = await api.challenges.getAllSubmissions();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setSubmissions([]);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await api.challenges.create({
        title: chalTitle,
        description: chalDesc,
        difficulty: chalDiff,
        link: chalLink || null,
        points: parseInt(chalPoints, 10) || 10
      });
      showToast('Challenge published successfully!');
      setChalTitle('');
      setChalDesc('');
      setChalDiff('Easy');
      setChalLink('');
      setChalPoints(10);
      await fetchChallenges();
    } catch (err) {
      alert(err.message || 'Failed to create challenge.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteChallenge = async (id) => {
    setConfirmConfig({
      title: 'Delete Challenge',
      message: 'Are you sure you want to delete this challenge and all student solutions?',
      onConfirm: async () => {
        try {
          await api.challenges.delete(id);
          showToast('Challenge deleted.');
          await fetchChallenges();
          await fetchAllSubmissions();
        } catch (err) {
          alert(err.message || 'Failed to delete challenge.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleUpdateSubmissionStatus = async (submissionId, status) => {
    const feedback = window.prompt(`Enter optional review feedback for the student (leave empty if none):`);
    if (feedback === null) return; // User cancelled
    
    try {
      await api.challenges.updateSubmissionStatus(submissionId, status, feedback.trim());
      showToast(`Submission marked as ${status}!`);
      await fetchAllSubmissions();
      await fetchMembers(); // sync points in other views
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const fetchResources = async () => {
  setFetchingResources(true);

  try {
    const data = await api.resources.getAll();
    setResources(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to fetch resources:', err);
    setResources([]);
  } finally {
    setFetchingResources(false);
  }
};
  const handleCreateResource = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await api.resources.create({ title: resTitle, category: resCategory, url: resUrl, description: resDesc || null });
      showToast('Resource added!');
      await fetchResources();
      setResTitle(''); setResCategory(''); setResUrl(''); setResDesc('');
    } catch (err) {
      alert(err.message || 'Failed.');
    } finally { setFormSubmitting(false); }
  };

  const handleDeleteResource = (id) => {
    setConfirmConfig({
      title: 'Are you sure you want to delete this resource?',
      message: 'This will permanently delete the shared resource.',
      onConfirm: async () => {
        try {
          await api.resources.delete(id);
          showToast('Resource deleted!');
          fetchResources();
        } catch (err) {
          alert(err.message || 'Failed to delete resource.');
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const exportMembersToCSV = () => {
    const headers = ['Name', 'Academic Year', 'Role', 'Points', 'Streak Days', 'Problems Solved', 'Skills'];
    const rows = members.map(m => [
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.year || '').replace(/"/g, '""')}"`,
      `"${(m.role || '').replace(/"/g, '""')}"`,
      m.points || 0,
      m.streak_days || 0,
      m.problems_solved || 0,
      `"${(m.skills || []).join(', ').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `codexa_members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV downloaded successfully!');
  };

  const filteredRequests = requests.filter((req) => {
  const matchesStatus =
    requestStatusFilter === 'all' ||
    req.status === requestStatusFilter;

  const query = searchQuery.toLowerCase().trim();

  const matchesSearch =
    !query ||
    req.name?.toLowerCase().includes(query) ||
    req.email?.toLowerCase().includes(query) ||
    req.year?.toLowerCase().includes(query) ||
    req.status?.toLowerCase().includes(query) ||
    req.skills?.some((skill) =>
      skill.toLowerCase().includes(query)
    );

  return matchesStatus && matchesSearch;
});

  const inputCls = 'input-field';

  return (
    <div className="w-full px-4 sm:px-8 py-6">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-emerald text-bg-primary px-4 py-3 rounded-xl font-semibold text-sm shadow-2xl animate-slide-up">
          <CheckCircle size={16} />{toast}
        </div>
      )}

      {/* Back + Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-bg-border text-text-muted hover:text-text-primary hover:border-brand-violet/30 transition-all">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="page-title">
              {{
                requests:      'Registration Requests',
                members:       'Members & Points',
                announcements: 'Announcements',
                events:        'Events',
                resources:     'Resources',
                profile:       'Admin Profile',
              }[activeTab] || 'Admin Panel'}
            </h1>
            <p className="page-subtitle">CODEXA Admin Portal</p>
          </div>
        </div>
      </div>

      {/* ── Analytics Overview — only on Registrations tab ── */}
      {activeTab === 'requests' && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Members',   value: members.length || 0,
            icon: <Users size={18} style={{ color: '#5b6cf9' }} />, iconBg: 'rgba(91,108,249,0.12)' },
          { label: 'Pending',         value: requests.filter(r => r.status === 'pending').length,
            icon: <FileText size={18} style={{ color: '#f59e0b' }} />, iconBg: 'rgba(245,158,11,0.12)' },
          { label: 'Upcoming Events', value: events.filter(ev => new Date(ev.date) >= new Date()).length,
            icon: <Calendar size={18} style={{ color: '#f472b6' }} />, iconBg: 'rgba(244,114,182,0.12)' },
          { label: 'Announcements',   value: announcements.length || 0,
            icon: <Megaphone size={18} style={{ color: '#3b82f6' }} />, iconBg: 'rgba(59,130,246,0.12)' },
        ].map(({ label, value, icon, iconBg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2rem', lineHeight: 1, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                  {value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Onboarding confirmation */}
      {onboardedInfo && (
        <div className="card bg-brand-emerald/5 border border-brand-emerald/20 p-5 mb-6 flex items-start gap-4">
          <CheckCircle className="text-brand-emerald shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-brand-emerald text-sm mb-1">Account Created Successfully!</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">
              An account has been provisioned for <strong className="text-text-primary">{onboardedInfo.email}</strong>.
            </p>
            <p className="text-text-muted text-xs">
              The student can now log in at <strong className="text-text-accent">/login</strong> using the email and password they chose when they applied.
            </p>
          </div>
        </div>
      )}

{/* ── Tab: Join Requests ── */}
{activeTab === 'requests' && (
  <div className="space-y-5">

    {/* Main workspace */}
    <div className="card overflow-hidden border border-bg-border">

      {/* Header */}
      <div className="px-6 py-5 border-b border-bg-border bg-bg-card">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

          <div>
            <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.14em] mb-1">
              Application Management
            </p>

            <h2 className="font-display font-black text-xl text-text-primary">
              Registration Requests
            </h2>

            <p className="text-xs text-text-muted mt-1">
              Review applications and control access to the CODEXA community.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full xl:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 pr-10 w-full"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {[
            {
              key: 'all',
              label: 'All',
              count: requests.length,
            },
            {
              key: 'pending',
              label: 'Pending',
              count: requests.filter(
                (r) => r.status === 'pending'
              ).length,
            },
            {
              key: 'approved',
              label: 'Approved',
              count: requests.filter(
                (r) => r.status === 'approved'
              ).length,
            },
            {
              key: 'rejected',
              label: 'Rejected',
              count: requests.filter(
                (r) => r.status === 'rejected'
              ).length,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() =>
                setRequestStatusFilter(filter.key)
              }
              className={`h-9 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                requestStatusFilter === filter.key
                  ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                  : 'bg-bg-card text-text-secondary border-bg-border hover:border-brand-blue/30 hover:text-brand-blue'
              }`}
            >
              {filter.label}

              <span
                className={`min-w-5 h-5 px-1.5 rounded-md flex items-center justify-center text-[9px] font-black ${
                  requestStatusFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-bg-elevated text-text-muted'
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}

          {/* Bulk approve button — only visible when there are pending requests */}
          {requests.filter((r) => r.status === 'pending').length > 0 && (
            <button
              type="button"
              id="btn-approve-all-pending"
              onClick={handleApproveAll}
              disabled={bulkApproving}
              className="ml-auto h-9 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-brand-emerald to-teal-500 hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkApproving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve All Pending ({requests.filter((r) => r.status === 'pending').length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Small information bar */}
      <div className="px-6 py-3 bg-brand-blue/[0.035] border-b border-bg-border">
        <div className="flex items-center gap-2">
          <AlertCircle
            size={14}
            className="text-brand-blue shrink-0"
          />

          <p className="text-[11px] text-text-muted">
            Approving an application automatically creates the student's account.
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 spinner" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/[0.06] flex items-center justify-center mx-auto mb-3">
            <Search
              size={20}
              className="text-brand-blue"
            />
          </div>

          <p className="text-sm font-bold text-text-primary">
            No applications found
          </p>

          <p className="text-xs text-text-muted mt-1">
            Try another search or status filter.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3 bg-bg-secondary rounded-2xl">

          {filteredRequests.map((req) => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';

            return (
              <div
                key={req.id}
                className="bg-bg-card border border-bg-border rounded-2xl p-5 hover:border-brand-blue/20 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-5">

                  {/* Student */}
                  <div className="flex items-center gap-3 xl:w-[245px] shrink-0">

                    <div className="w-11 h-11 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-sm shrink-0">
                      {req.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-text-primary truncate">
                          {req.name}
                        </p>
                      </div>

                      <p className="text-[10px] text-text-muted mt-1">
                        {req.year}
                      </p>

                      <p className="text-[10px] text-text-muted mt-0.5 truncate">
                        {req.email}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.12em] mb-1.5">
                      Reason for joining
                    </p>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {req.reason_to_join || 'No reason provided.'}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="xl:w-[230px]">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.12em] mb-1.5">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {req.skills?.length > 0 ? (
                        <>
                          {req.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 rounded-lg bg-brand-blue/[0.07] text-brand-blue text-[9px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}

                          {req.skills.length > 3 && (
                            <span className="px-2 py-1 text-[9px] font-bold text-text-muted">
                              +{req.skills.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-text-muted">
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status and actions */}
                  <div className="xl:w-[200px] shrink-0">
                    <div className="flex xl:flex-col items-center xl:items-end justify-between gap-3">

                      <div className="text-left xl:text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-brand-amber/10 text-brand-amber'
                              : req.status === 'approved'
                              ? 'bg-brand-emerald/10 text-brand-emerald'
                              : 'bg-brand-red/10 text-brand-red'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              req.status === 'pending'
                                ? 'bg-brand-amber'
                                : req.status === 'approved'
                                ? 'bg-brand-emerald'
                                : 'bg-brand-red'
                            }`}
                          />

                          {req.status}
                        </span>

                        <p className="text-[9px] text-text-muted mt-2">
                          Applied{' '}
                          {new Date(
                            req.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {isPending ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleProcessRequest(
                                req.id,
                                'rejected',
                                req.email
                              )
                            }
                            className="h-9 px-3 rounded-xl border border-brand-red/20 text-brand-red text-xs font-bold hover:bg-brand-red/[0.06] transition-all flex items-center gap-1.5"
                          >
                            <X size={13} />
                            Reject
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleProcessRequest(
                                req.id,
                                'approved',
                                req.email
                              )
                            }
                            className="h-9 px-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5"
                          >
                            <Check size={13} />
                            Approve
                          </button>
                        </div>
                      ) : (
                        <p
                          className={`text-[10px] font-semibold ${
                            isApproved
                              ? 'text-brand-emerald'
                              : 'text-brand-red'
                          }`}
                        >
                          {isApproved
                            ? 'Account created'
                            : 'Application closed'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
)}

     {/* ── Tab: Announcements ── */}
{activeTab === 'announcements' && (
  <div className="space-y-6">

    {/* Overview */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          label: 'Total Announcements',
          value: announcements.length,
          sub: 'All published updates',
          icon: <Megaphone size={18} />,
        },
        {
          label: 'Active',
          value: announcements.filter(
            (ann) =>
              !ann.expires_at ||
              new Date(ann.expires_at) > new Date()
          ).length,
          sub: 'Currently visible',
          icon: <CheckCircle size={18} />,
        },
        {
          label: 'Expired',
          value: announcements.filter(
            (ann) =>
              ann.expires_at &&
              new Date(ann.expires_at) <= new Date()
          ).length,
          sub: 'Ready for cleanup',
          icon: <Calendar size={18} />,
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="card p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2">
                {stat.label}
              </p>

              <p className="text-3xl font-black text-text-primary leading-none">
                {stat.value}
              </p>

              <p className="text-[10px] text-text-muted mt-2">
                {stat.sub}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-brand-blue/[0.08] text-brand-blue flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Main workspace */}
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

      {/* Create panel */}
      <div className="xl:col-span-4">
        <form
          onSubmit={handleCreateAnnouncement}
          className="card overflow-hidden"
        >
          {/* Form header */}
          <div className="px-5 py-5 border-b border-bg-border bg-brand-blue/[0.025]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/[0.08] text-brand-blue flex items-center justify-center">
                <Megaphone size={17} />
              </div>

              <div>
                <h2 className="font-display font-black text-base text-text-primary">
                  Create Announcement
                </h2>

                <p className="text-[10px] text-text-muted mt-0.5">
                  Publish an update to the student portal
                </p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="p-5 space-y-4">

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Title
              </label>

              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) =>
                  setAnnTitle(e.target.value)
                }
                placeholder="Enter announcement title"
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Message
                </label>

                <span className="text-[9px] text-text-muted">
                  {annContent.length} characters
                </span>
              </div>

              <textarea
                required
                rows={5}
                value={annContent}
                onChange={(e) =>
                  setAnnContent(e.target.value)
                }
                placeholder="Write your announcement..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Expiry */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Expiry Date
              </label>

              <input
                type="datetime-local"
                value={annExpiresAt}
                onChange={(e) =>
                  setAnnExpiresAt(e.target.value)
                }
                className={inputCls}
              />

              <p className="text-[9px] text-text-muted">
                Optional. Leave empty to keep it active.
              </p>
            </div>

            {/* Attachment */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Attachment
              </label>

              <label className="min-h-20 border border-dashed border-bg-border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-brand-blue/30 hover:bg-brand-blue/[0.02] transition-all">
                <Link2
                  size={16}
                  className="text-brand-blue"
                />

                <span className="text-[10px] font-semibold text-text-secondary">
                  {uploadingAnnMedia
                    ? 'Uploading...'
                    : annImage || annVideo
                    ? 'Attachment uploaded'
                    : 'Choose image or video'}
                </span>

                <span className="text-[9px] text-text-muted">
                  Optional media attachment
                </span>

                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={uploadingAnnMedia}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(
                        file,
                        file.type.startsWith("image/") ? "image" : "video",
                        "ann"
                      );
                    }
                  }}
                />
              </label>

              {(annImage || annVideo) && (
                <button
                  type="button"
                  onClick={() => {
                    setAnnImage('');
                    setAnnVideo('');
                  }}
                  className="text-[10px] font-semibold text-brand-red hover:underline"
                >
                  Remove attachment
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                formSubmitting ||
                uploadingAnnMedia
              }
              className="w-full h-11 rounded-xl bg-brand-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {formSubmitting ? (
                <div className="w-4 h-4 spinner" />
              ) : (
                <>
                  <Megaphone size={15} />
                  Publish Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Announcements list */}
      <div className="xl:col-span-8">
        <div className="card overflow-hidden">

          {/* List header */}
          <div className="px-5 py-5 border-b border-bg-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div>
                <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.14em] mb-1">
                  Published Updates
                </p>

                <h2 className="font-display font-black text-lg text-text-primary">
                  All Announcements
                </h2>

                <p className="text-[10px] text-text-muted mt-1">
                  Manage updates visible to club members.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full lg:w-56">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />

                  <input
                    type="text"
                    value={annSearch}
                    onChange={(e) =>
                      setAnnSearch(e.target.value)
                    }
                    placeholder="Search announcements..."
                    className="input-field pl-9 w-full"
                  />
                </div>

                {announcements.some(
                  (ann) =>
                    ann.expires_at &&
                    new Date(ann.expires_at) <=
                      new Date()
                ) && (
                  <button
                    type="button"
                    onClick={handleDeleteExpired}
                    className="h-10 px-3 rounded-xl border border-brand-red/20 text-brand-red text-[10px] font-bold hover:bg-brand-red/[0.05] transition-all whitespace-nowrap"
                  >
                    Clear expired
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List body */}
          {fetchingAnn ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 spinner" />
            </div>
          ) : announcements.filter((ann) => {
              const query =
                annSearch.toLowerCase().trim();

              if (!query) return true;

              return (
                ann.title
                  ?.toLowerCase()
                  .includes(query) ||
                ann.content
                  ?.toLowerCase()
                  .includes(query) ||
                ann.author
                  ?.toLowerCase()
                  .includes(query)
              );
            }).length === 0 ? (
            <div className="py-20 px-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue/[0.06] text-brand-blue flex items-center justify-center mb-4">
                <Megaphone size={22} />
              </div>

              <h3 className="font-bold text-sm text-text-primary">
                {annSearch
                  ? 'No matching announcements'
                  : 'No announcements yet'}
              </h3>

              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                {annSearch
                  ? 'Try another search term.'
                  : 'Create your first announcement using the panel on the left.'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3 bg-bg-secondary rounded-2xl">
              {announcements
                .filter((ann) => {
                  const query =
                    annSearch
                      .toLowerCase()
                      .trim();

                  if (!query) return true;

                  return (
                    ann.title
                      ?.toLowerCase()
                      .includes(query) ||
                    ann.content
                      ?.toLowerCase()
                      .includes(query) ||
                    ann.author
                      ?.toLowerCase()
                      .includes(query)
                  );
                })
                .map((ann) => {
                  const isExpired =
                    ann.expires_at &&
                    new Date(ann.expires_at) <=
                      new Date();

                  return (
                    <div
                      key={ann.id}
                      className="bg-bg-card border border-bg-border rounded-2xl p-5 hover:border-brand-blue/20 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-4">

                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/[0.07] text-brand-blue flex items-center justify-center shrink-0">
                          <Megaphone size={16} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-sm text-text-primary">
                              {ann.title}
                            </h3>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                isExpired
                                  ? 'bg-brand-red/[0.07] text-brand-red'
                                  : 'bg-brand-emerald/[0.07] text-brand-emerald'
                              }`}
                            >
                              {isExpired
                                ? 'Expired'
                                : 'Active'}
                            </span>
                          </div>

                          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                            {ann.content}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[9px] text-text-muted">
                            <span>
                              Published{' '}
                              {new Date(
                                ann.created_at
                              ).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>

                            {ann.expires_at && (
                              <span>
                                Expires{' '}
                                {new Date(
                                  ann.expires_at
                                ).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                              </span>
                            )}

                            {(ann.image_url ||
                              ann.video_url) && (
                              <span className="inline-flex items-center gap-1 text-brand-blue font-semibold">
                                <Link2 size={10} />
                                Attachment
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAnnouncement(
                              ann.id
                            )
                          }
                          className="w-9 h-9 rounded-xl border border-bg-border text-text-muted hover:text-brand-red hover:border-brand-red/20 hover:bg-brand-red/[0.04] flex items-center justify-center transition-all shrink-0"
                          title="Delete announcement"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
{/* ── Tab: Events ── */}
{activeTab === 'events' && (
  <div className="space-y-6">

    {/* ── Event Overview ── */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[
        {
          label: 'Total Events',
          value: events.length,
          sub: 'All scheduled events',
          icon: <Calendar size={18} />,
        },
        {
          label: 'Upcoming',
          value: events.filter(
            (ev) => new Date(ev.date) >= new Date()
          ).length,
          sub: 'Scheduled ahead',
          icon: <Clock size={18} />,
        },
        {
          label: 'Completed',
          value: events.filter(
            (ev) => new Date(ev.date) < new Date()
          ).length,
          sub: 'Past events',
          icon: <CheckCircle size={18} />,
        },
        {
          label: 'Registrations',
          value: events.reduce(
            (total, ev) =>
              total + (ev.registered_users?.length || 0),
            0
          ),
          sub: 'Across all events',
          icon: <Users size={18} />,
        },
      ].map((stat) => (
        <div key={stat.label} className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2">
                {stat.label}
              </p>

              <p className="text-3xl font-black text-text-primary leading-none">
                {stat.value}
              </p>

              <p className="text-[10px] text-text-muted mt-2">
                {stat.sub}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-brand-blue/[0.08] text-brand-blue flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ── Main Event Workspace ── */}
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

      {/* ── Schedule Event Panel ── */}
      <div className="xl:col-span-4">
        <form
          onSubmit={handleCreateEvent}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-5 border-b border-bg-border bg-brand-blue/[0.025]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/[0.08] text-brand-blue flex items-center justify-center">
                <Calendar size={17} />
              </div>

              <div>
                <h2 className="font-display font-black text-base text-text-primary">
                  Schedule Event
                </h2>

                <p className="text-[10px] text-text-muted mt-0.5">
                  Create workshops, hackathons and club sessions
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-4">

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Event Title
              </label>

              <input
                type="text"
                required
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                placeholder="Enter event title"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Description
              </label>

              <textarea
                required
                rows={4}
                value={evDesc}
                onChange={(e) => setEvDesc(e.target.value)}
                placeholder="Describe the event..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Date & Time
              </label>

              <input
                type="datetime-local"
                required
                value={evDate}
                onChange={(e) => setEvDate(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Location + Seats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Location
                </label>

                <input
                  type="text"
                  required
                  value={evLocation}
                  onChange={(e) =>
                    setEvLocation(e.target.value)
                  }
                  placeholder="Lab 3 / Online"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Max Seats
                </label>

                <input
                  type="number"
                  min="1"
                  value={evMaxSeats}
                  onChange={(e) =>
                    setEvMaxSeats(e.target.value)
                  }
                  placeholder="Unlimited"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Google Form */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Link2 size={11} className="text-brand-blue" />
                Registration Form
              </label>

              <input
                type="url"
                value={evFormUrl}
                onChange={(e) =>
                  setEvFormUrl(e.target.value)
                }
                placeholder="https://forms.gle/..."
                className={inputCls}
              />

              <p className="text-[9px] text-text-muted leading-relaxed">
                Optional. Students will open this form after registering.
              </p>
            </div>

            {/* Event Cover */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Event Cover
              </label>

              {!evImage && !evVideo && (
                <label className="min-h-20 border border-dashed border-bg-border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-brand-blue/30 hover:bg-brand-blue/[0.02] transition-all">
                  <Link2
                    size={16}
                    className="text-brand-blue"
                  />

                  <span className="text-[10px] font-semibold text-text-secondary">
                    {uploadingEvMedia
                      ? 'Uploading cover...'
                      : 'Choose image or video'}
                  </span>

                  <span className="text-[9px] text-text-muted">
                    Optional event media
                  </span>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    disabled={uploadingEvMedia}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        handleFileUpload(
                          file,
                          file.type,
                          'ev'
                        );
                      }
                    }}
                  />
                </label>
              )}

              {uploadingEvMedia && (
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <div className="w-3.5 h-3.5 spinner" />
                  Uploading event cover...
                </div>
              )}

              {evImage && (
                <div className="relative overflow-hidden rounded-xl border border-bg-border">
                  <img
                    src={getFullUploadUrl(evImage)}
                    alt="Event preview"
                    className="w-full h-32 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => setEvImage('')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-brand-red transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {evVideo && (
                <div className="relative overflow-hidden rounded-xl border border-bg-border">
                  <video
                    src={getFullUploadUrl(evVideo)}
                    className="w-full h-32 object-cover"
                    controls
                  />

                  <button
                    type="button"
                    onClick={() => setEvVideo('')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-brand-red transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formSubmitting || uploadingEvMedia}
              className="w-full h-11 rounded-xl bg-brand-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {formSubmitting ? (
                <div className="w-4 h-4 spinner" />
              ) : (
                <>
                  <Calendar size={15} />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Events Workspace ── */}
      <div className="xl:col-span-8">
        <div className="card overflow-hidden">

          {/* List Header */}
          <div className="px-5 py-5 border-b border-bg-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.14em] mb-1">
                  Event Management
                </p>

                <h2 className="font-display font-black text-lg text-text-primary">
                  Scheduled Events
                </h2>

                <p className="text-[10px] text-text-muted mt-1">
                  Manage schedules, registrations and attendance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-9 px-3 rounded-xl bg-brand-blue/[0.06] text-brand-blue text-[10px] font-bold flex items-center">
                  {events.length} events
                </span>

                {events.some(
                  (ev) =>
                    new Date(ev.date) <
                    new Date(
                      Date.now() - 24 * 60 * 60 * 1000
                    )
                ) && (
                  <button
                    type="button"
                    onClick={handleDeleteExpiredEvents}
                    className="h-9 px-3 rounded-xl border border-brand-red/20 text-brand-red text-[10px] font-bold hover:bg-brand-red/[0.05] transition-all"
                  >
                    Clear expired
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {fetchingEvents ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 spinner" />
            </div>

          ) : events.length === 0 ? (

            /* Empty State */
            <div className="py-20 px-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue/[0.06] text-brand-blue flex items-center justify-center mb-4">
                <Calendar size={22} />
              </div>

              <h3 className="font-bold text-sm text-text-primary">
                No events scheduled
              </h3>

              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                Create your first workshop, hackathon or club session using the panel on the left.
              </p>
            </div>

          ) : (

            /* Events List */
            <div className="p-4 space-y-3 bg-bg-secondary rounded-2xl">
              {events.map((ev) => {
                const regCount =
                  ev.registered_users?.length || 0;

                const isPast =
                  new Date(ev.date) < new Date();

                const isExpired =
                  new Date(ev.date) <
                  new Date(
                    Date.now() - 24 * 60 * 60 * 1000
                  );

                const isRegOpen =
                  !!selectedEventRegs[ev.id];

                const regs =
                  selectedEventRegs[ev.id] || [];

                const seatPercentage =
                  ev.max_seats
                    ? Math.min(
                        (regCount / ev.max_seats) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={ev.id}
                    className={`bg-bg-card border rounded-2xl overflow-hidden transition-all ${
                      isExpired
                        ? 'border-brand-red/15 opacity-70'
                        : 'border-bg-border hover:border-brand-blue/20 hover:shadow-sm'
                    }`}
                  >
                    {/* Main Event Content */}
                    <div className="p-5">

                      {/* Top Row */}
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-blue/[0.07] text-brand-blue flex items-center justify-center shrink-0">
                          <Calendar size={17} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="font-bold text-sm text-text-primary">
                              {ev.title}
                            </h3>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                isExpired
                                  ? 'bg-brand-red/[0.07] text-brand-red'
                                  : isPast
                                  ? 'bg-brand-amber/[0.08] text-brand-amber'
                                  : 'bg-brand-emerald/[0.07] text-brand-emerald'
                              }`}
                            >
                              {isExpired
                                ? 'Expired'
                                : isPast
                                ? 'Completed'
                                : 'Upcoming'}
                            </span>
                          </div>

                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {ev.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEvent(ev.id)
                          }
                          className="w-9 h-9 rounded-xl border border-bg-border text-text-muted hover:text-brand-red hover:border-brand-red/20 hover:bg-brand-red/[0.04] flex items-center justify-center transition-all shrink-0"
                          title="Delete event"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                        <div className="rounded-xl bg-bg-elevated border border-bg-border px-3 py-2.5">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted mb-1">
                            Date & Time
                          </p>

                          <p className="text-[10px] font-semibold text-text-primary">
                            {new Date(
                              ev.date
                            ).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                          </p>
                        </div>

                        <div className="rounded-xl bg-bg-elevated border border-bg-border px-3 py-2.5">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted mb-1">
                            Location
                          </p>

                          <p className="text-[10px] font-semibold text-text-primary truncate">
                            {ev.location}
                          </p>
                        </div>

                        <div className="rounded-xl bg-bg-elevated border border-bg-border px-3 py-2.5">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted mb-1">
                            Registrations
                          </p>

                          <p className="text-[10px] font-semibold text-text-primary">
                            {regCount} /{' '}
                            {ev.max_seats || 'Unlimited'}
                          </p>
                        </div>
                      </div>

                      {/* Seat Progress */}
                      {ev.max_seats && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] text-text-muted">
                              Seat occupancy
                            </span>

                            <span className="text-[9px] font-bold text-brand-blue">
                              {Math.round(seatPercentage)}%
                            </span>
                          </div>

                          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-blue rounded-full transition-all"
                              style={{
                                width: `${seatPercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Form Link */}
                      {ev.google_form_url && (
                        <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-brand-blue/[0.035] border border-brand-blue/10">
                          <Link2
                            size={12}
                            className="text-brand-blue shrink-0"
                          />

                          <span className="text-[9px] text-text-muted">
                            Registration form connected
                          </span>

                          <a
                            href={ev.google_form_url}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto text-[9px] font-bold text-brand-blue hover:underline flex items-center gap-1"
                          >
                            Open Form
                            <ExternalLink size={9} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Registration Action */}
                    <div className="px-5 py-3 border-t border-bg-border bg-bg-elevated flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-text-primary">
                          {regCount} registered member
                          {regCount !== 1 ? 's' : ''}
                        </p>

                        <p className="text-[8px] text-text-muted mt-0.5">
                          View student registration details
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleRegistrations(ev.id)
                        }
                        className="h-8 px-3 rounded-lg border border-brand-blue/15 text-brand-blue text-[9px] font-bold hover:bg-brand-blue/[0.05] transition-all"
                      >
                        {isRegOpen
                          ? 'Hide Registrations'
                          : 'View Registrations'}
                      </button>
                    </div>

                    {/* Registration Accordion */}
                    {isRegOpen && (
                      <div className="border-t border-bg-border bg-bg-secondary p-4">
                        {loadingRegs[ev.id] ? (
                          <div className="py-8 flex flex-col justify-center items-center gap-2 text-[10px] font-bold text-text-muted">
                            <div className="w-5 h-5 spinner" />
                            Loading registrations...
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-[10px] font-black text-text-primary uppercase tracking-wider">
                                  Registered Members
                                </h4>

                                <p className="text-[8px] text-text-muted mt-0.5">
                                  {regs.length} member
                                  {regs.length !== 1 ? 's' : ''} found
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                {regs.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleExportEventRoster(ev.id, ev.title)}
                                    className="text-[9px] text-brand-violet font-bold hover:underline flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                                  >
                                    Export Roster (CSV)
                                  </button>
                                )}

                                {ev.google_form_url && (
                                  <a
                                    href={ev.google_form_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[9px] text-brand-blue font-bold hover:underline flex items-center gap-1"
                                  >
                                    View Form
                                    <ExternalLink size={9} />
                                  </a>
                                )}
                              </div>
                            </div>

                            {regs.length === 0 ? (
                          <div className="py-6 text-center rounded-xl border border-dashed border-bg-border">
                            <Users
                              size={18}
                              className="mx-auto text-text-muted opacity-40 mb-2"
                            />

                            <p className="text-[10px] text-text-muted">
                              No students registered yet.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto">
                            {regs.map((r) => {
                              const isExpanded =
                                expandedStudentId === r.user_id;

                              return (
                                <div
                                  key={r.user_id}
                                  className="bg-bg-card border border-bg-border rounded-xl overflow-hidden"
                                >
                                  {/* Student Row */}
                                  <div className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-brand-blue/[0.01] transition-all">
                                    <div className="flex items-center" title={r.attended ? "Unmark attendance" : "Mark attendance"}>
                                      <input
                                        type="checkbox"
                                        checked={!!r.attended}
                                        onChange={(e) => handleToggleAttendance(ev.id, r.user_id, e.target.checked)}
                                        className="w-4 h-4 rounded border-bg-border text-brand-violet focus:ring-brand-violet cursor-pointer"
                                        style={{ accentColor: 'var(--brand-violet)' }}
                                      />
                                    </div>

                                    <div
                                      onClick={() =>
                                        setExpandedStudentId(
                                          isExpanded
                                            ? null
                                            : r.user_id
                                        )
                                      }
                                      className="flex-1 flex items-center gap-3 cursor-pointer min-w-0 py-1"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-brand-blue/[0.08] text-brand-blue flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                                        {r.name?.charAt(0)}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-text-primary truncate">
                                          {r.name}
                                        </p>

                                        <p className="text-[9px] text-text-muted truncate">
                                          {r.email}
                                        </p>
                                      </div>

                                      <span className="text-[9px] text-text-muted">
                                        {r.year}
                                      </span>

                                      <span className="text-[9px] text-brand-blue">
                                        {isExpanded ? '▲' : '▼'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Expanded Student Details */}
                                  {isExpanded && (
                                    <div className="px-3 pb-3 border-t border-bg-border">
                                      <div className="grid grid-cols-3 gap-2 mt-3">
                                        <div className="rounded-lg bg-bg-elevated p-2 text-center">
                                          <p className="text-[8px] text-text-muted uppercase">
                                            Points
                                          </p>

                                          <p className="text-xs font-black text-text-primary mt-1">
                                            {r.points}
                                          </p>
                                        </div>

                                        <div className="rounded-lg bg-bg-elevated p-2 text-center">
                                          <p className="text-[8px] text-text-muted uppercase">
                                            Solved
                                          </p>

                                          <p className="text-xs font-black text-text-primary mt-1">
                                            {r.problems_solved}
                                          </p>
                                        </div>

                                        <div className="rounded-lg bg-bg-elevated p-2 text-center">
                                          <p className="text-[8px] text-text-muted uppercase">
                                            Streak
                                          </p>

                                          <p className="text-xs font-black text-text-primary mt-1">
                                            {r.streak_days}
                                          </p>
                                        </div>
                                      </div>

                                      {r.skills?.length > 0 && (
                                        <div className="mt-3">
                                          <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider mb-2">
                                            Skills
                                          </p>

                                          <div className="flex flex-wrap gap-1.5">
                                            {r.skills.map((skill) => (
                                              <span
                                                key={skill}
                                                className="px-2 py-1 rounded-md bg-brand-blue/[0.06] text-brand-blue text-[8px] font-semibold"
                                              >
                                                {skill}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
{/* ── Tab: Members ── */}
{activeTab === 'members' && (
  <div className="space-y-5">

    {/* ── Community overview ── */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card p-5 border-blue-100/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
              Total Members
            </p>

            <div className="flex items-end gap-2 mt-2">
              <p className="text-3xl font-black text-text-primary leading-none">
                {members.length}
              </p>

              <span className="text-[10px] font-semibold text-brand-blue mb-0.5">
                Club members
              </span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 border border-brand-blue/10 flex items-center justify-center">
            <Users size={20} className="text-brand-blue" />
          </div>
        </div>
      </div>

      <div className="card p-5 border-blue-100/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
              Total Points
            </p>

            <div className="flex items-end gap-2 mt-2">
              <p className="text-3xl font-black text-text-primary leading-none">
                {members.reduce(
                  (total, member) =>
                    total + (member.points || 0),
                  0
                )}
              </p>

              <span className="text-[10px] font-semibold text-brand-amber mb-0.5">
                Awarded
              </span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-brand-amber/10 border border-brand-amber/10 flex items-center justify-center">
            <Trophy size={20} className="text-brand-amber" />
          </div>
        </div>
      </div>

      <div className="card p-5 border-blue-100/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.12em]">
              Badges Earned
            </p>

            <div className="flex items-end gap-2 mt-2">
              <p className="text-3xl font-black text-text-primary leading-none">
                {members.reduce(
                  (total, member) =>
                    total + (member.badges?.length || 0),
                  0
                )}
              </p>

              <span className="text-[10px] font-semibold text-brand-emerald mb-0.5">
                Achievements
              </span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/10 flex items-center justify-center">
            <CheckCircle
              size={20}
              className="text-brand-emerald"
            />
          </div>
        </div>
      </div>
    </div>

    {/* ── Member workspace ── */}
    <div className="card overflow-hidden border border-brand-blue/10">

      {/* Workspace header */}
      <div
        className="px-5 py-5 border-b border-bg-border"
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(255,255,255,0.02))',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-blue" />

              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.13em]">
                Member Management
              </span>
            </div>

            <h2 className="font-display font-black text-xl text-text-primary tracking-tight">
              Club Members
            </h2>

            <p className="text-xs text-text-muted mt-1">
              Review progress, manage points and inspect member activity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="text"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) =>
                  setMemberSearch(e.target.value)
                }
                className="input-field pl-9 sm:w-64 bg-bg-card"
              />
            </div>

            <button
              onClick={exportMembersToCSV}
              className="btn-secondary text-xs whitespace-nowrap"
              title="Download members list as CSV"
            >
              <FileText size={14} />
              Export CSV
            </button>

            {bulkSelected.size > 0 && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="btn-primary text-xs whitespace-nowrap"
              >
                <Trophy size={14} />
                Award {bulkSelected.size}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selection toolbar */}
      <div className="px-5 py-3 border-b border-brand-blue/10 bg-brand-blue/[0.035]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={
                members.filter((m) =>
                  m.name
                    .toLowerCase()
                    .includes(memberSearch.toLowerCase())
                ).length > 0 &&
                bulkSelected.size ===
                  members.filter((m) =>
                    m.name
                      .toLowerCase()
                      .includes(memberSearch.toLowerCase())
                  ).length
              }
              onChange={(e) => {
                const filtered = members.filter((m) =>
                  m.name
                    .toLowerCase()
                    .includes(memberSearch.toLowerCase())
                );

                setBulkSelected(
                  e.target.checked
                    ? new Set(filtered.map((m) => m.id))
                    : new Set()
                );
              }}
              className="rounded accent-blue-600"
            />

            <div>
              <p className="text-xs font-bold text-text-primary">
                Select visible members
              </p>

              <p className="text-[10px] text-text-muted mt-0.5">
                Use selection for bulk point awards
              </p>
            </div>
          </label>

          <div className="flex items-center gap-2">
            {bulkSelected.size > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-brand-blue/10 text-brand-blue text-[10px] font-bold">
                {bulkSelected.size} selected
              </span>
            )}

            <span className="px-2.5 py-1 rounded-lg bg-bg-card border border-bg-border text-[10px] font-semibold text-text-muted">
              {
                members.filter((m) =>
                  m.name
                    .toLowerCase()
                    .includes(memberSearch.toLowerCase())
                ).length
              }{' '}
              members
            </span>
          </div>
        </div>
      </div>

      {/* Members */}
      {fetchingMembers ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 spinner" />
        </div>
      ) : (
        <div className="divide-y divide-bg-border">
          {members
            .filter((m) =>
              m.name
                .toLowerCase()
                .includes(memberSearch.toLowerCase())
            )
            .map((m, i) => {
              const isExpanded =
                expandedStudentId === m.id;

              const rankStyle =
                i === 0
                  ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20'
                  : i === 1
                  ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                  : i === 2
                  ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20'
                  : 'bg-bg-elevated text-text-muted border-bg-border';

              return (
                <div key={m.id}>
                  {/* Main member row */}
                  <div
                    className={`group px-5 py-4 transition-all ${
                      isExpanded
                        ? 'bg-brand-blue/[0.035]'
                        : 'hover:bg-brand-blue/[0.025]'
                    }`}
                  >
                    <div className="flex items-center gap-4">

                      <input
                        type="checkbox"
                        checked={bulkSelected.has(m.id)}
                        onChange={(e) => {
                          const next = new Set(bulkSelected);

                          e.target.checked
                            ? next.add(m.id)
                            : next.delete(m.id);

                          setBulkSelected(next);
                        }}
                        className="rounded shrink-0 accent-blue-600"
                      />

                      {/* Rank */}
                      <div
                        className={`hidden sm:flex w-8 h-8 rounded-xl border items-center justify-center text-xs font-black shrink-0 ${rankStyle}`}
                      >
                        {i + 1}
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-sm"
                          style={{
                            background:
                              'linear-gradient(135deg, #2563eb, #60a5fa)',
                          }}
                        >
                          {m.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        {i < 3 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-bg-card border border-bg-border flex items-center justify-center text-[9px]">
                            {i === 0
                              ? '★'
                              : i === 1
                              ? '◆'
                              : '●'}
                          </span>
                        )}
                      </div>

                      {/* Identity */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedStudentId(
                            isExpanded ? null : m.id
                          )
                        }
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-text-primary truncate">
                            {m.name}
                          </h3>

                          {m.role?.toLowerCase() ===
                            'admin' && (
                            <span className="px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase tracking-wider">
                              Admin
                            </span>
                          )}

                          {i === 0 && (
                            <span className="hidden lg:inline-flex px-2 py-0.5 rounded-md bg-brand-amber/10 text-brand-amber text-[9px] font-bold">
                              Top contributor
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
                          <span>
                            {m.year || 'Year not set'}
                          </span>

                          <span>•</span>

                          <span>
                            {m.badges?.length || 0}{' '}
                            badges
                          </span>
                        </div>

                        {/* Skills preview */}
                        {m.skills?.length > 0 && (
                          <div className="hidden lg:flex items-center gap-1.5 mt-2 overflow-hidden">
                            {m.skills
                              .slice(0, 3)
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-md bg-brand-blue/[0.06] text-brand-blue text-[9px] font-semibold whitespace-nowrap"
                                >
                                  {skill}
                                </span>
                              ))}

                            {m.skills.length > 3 && (
                              <span className="text-[9px] text-text-muted font-semibold">
                                +{m.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </button>

                      {/* Points */}
                      <div className="hidden md:block text-right min-w-[90px]">
                        <div className="flex items-center justify-end gap-1.5">
                          <Trophy
                            size={13}
                            className="text-brand-amber"
                          />

                          <p className="font-black text-lg text-brand-blue">
                            {m.points || 0}
                          </p>
                        </div>

                        <p className="text-[9px] text-text-muted uppercase tracking-[0.12em]">
                          Points
                        </p>
                      </div>

                      {/* Award */}
                      <button
                        onClick={() => setAwardTarget(m)}
                        className="h-9 px-3 rounded-xl border border-brand-blue/20 bg-brand-blue/[0.045] text-brand-blue text-xs font-bold flex items-center gap-1.5 hover:bg-brand-blue/10 transition-all shrink-0"
                      >
                        <Trophy size={13} />

                        <span className="hidden sm:inline">
                          Award
                        </span>
                      </button>

                      {/* Expand */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedStudentId(
                            isExpanded ? null : m.id
                          )
                        }
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                          isExpanded
                            ? 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue'
                            : 'border-bg-border text-text-muted hover:text-brand-blue hover:border-brand-blue/30'
                        }`}
                      >
                        <span
                          className={`text-[10px] transition-transform duration-200 ${
                            isExpanded
                              ? 'rotate-180'
                              : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded member workspace */}
                  {isExpanded && (
                    <div className="px-5 pb-5 bg-brand-blue/[0.035] animate-slide-down">
                      <div className="sm:ml-[108px] pt-5 border-t border-brand-blue/10">

                        <div className="flex flex-col xl:flex-row gap-5">

                          {/* Member snapshot */}
                          <div className="xl:w-[260px] shrink-0">
                            <div className="rounded-2xl border border-brand-blue/10 bg-bg-card p-4">
                              <div className="mb-4">
                                <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.14em]">
                                  Member Snapshot
                                </span>

                                <h4 className="text-sm font-bold text-text-primary mt-1">
                                  Progress overview
                                </h4>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-brand-blue/[0.05] p-3">
                                  <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                                    Points
                                  </p>

                                  <p className="font-black text-lg text-brand-blue mt-1">
                                    {m.points || 0}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-brand-emerald/[0.05] p-3">
                                  <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                                    Badges
                                  </p>

                                  <p className="font-black text-lg text-text-primary mt-1">
                                    {m.badges?.length || 0}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-bg-elevated p-3">
                                  <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                                    Problems
                                  </p>

                                  <p className="font-black text-lg text-text-primary mt-1">
                                    {m.problems_solved || 0}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-bg-elevated p-3">
                                  <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                                    Streak
                                  </p>

                                  <p className="font-black text-lg text-text-primary mt-1">
                                    {m.streak_days || 0}

                                    <span className="text-[9px] font-medium text-text-muted ml-1">
                                      days
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {m.skills?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-bg-border">
                                  <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold mb-2">
                                    Skills
                                  </p>

                                  <div className="flex flex-wrap gap-1.5">
                                    {m.skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="px-2 py-1 rounded-lg bg-brand-blue/[0.06] text-brand-blue text-[9px] font-semibold"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Points history */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.14em]">
                                  Activity
                                </span>

                                <h4 className="text-sm font-bold text-text-primary mt-1">
                                  Points History
                                </h4>
                              </div>

                              <span className="px-2.5 py-1 rounded-lg bg-bg-card border border-bg-border text-[10px] text-text-muted font-semibold">
                                {m.points_history?.length || 0}{' '}
                                entries
                              </span>
                            </div>

                            {m.points_history?.length >
                            0 ? (
                              <div className="space-y-2">
                                {[...m.points_history]
                                  .reverse()
                                  .map(
                                    (
                                      entry,
                                      entryIdx
                                    ) => {
                                      const originalIndex =
                                        m.points_history
                                          .length -
                                        1 -
                                        entryIdx;

                                      return (
                                        <div
                                          key={
                                            entryIdx
                                          }
                                          className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-bg-border hover:border-brand-blue/20 transition-all"
                                        >
                                          <div className="w-9 h-9 rounded-xl bg-brand-blue/[0.07] flex items-center justify-center shrink-0">
                                            <Trophy
                                              size={14}
                                              className="text-brand-blue"
                                            />
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-text-primary truncate">
                                              {
                                                entry.reason
                                              }
                                            </p>

                                            <p className="text-[10px] text-text-muted mt-0.5">
                                              {entry.activity_type ||
                                                'general'}

                                              {entry.date &&
                                                ` • ${new Date(
                                                  entry.date
                                                ).toLocaleDateString()}`}
                                            </p>
                                          </div>

                                          <span className="px-2 py-1 rounded-lg bg-brand-emerald/10 text-brand-emerald font-black text-xs shrink-0">
                                            +{entry.points}
                                          </span>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              setRevokeTarget(
                                                {
                                                  member:
                                                    m,
                                                  entryIdx:
                                                    originalIndex,
                                                }
                                              )
                                            }
                                            className="text-[10px] font-bold text-brand-red hover:bg-brand-red/10 px-2 py-1.5 rounded-lg transition-all shrink-0"
                                          >
                                            Revoke
                                          </button>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            ) : (
                              <div className="py-10 text-center rounded-2xl border border-dashed border-brand-blue/15 bg-bg-card">
                                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-blue/[0.06] flex items-center justify-center mb-3">
                                  <Trophy
                                    size={17}
                                    className="text-brand-blue"
                                  />
                                </div>

                                <p className="text-xs font-semibold text-text-primary">
                                  No points history
                                </p>

                                <p className="text-[10px] text-text-muted mt-1">
                                  Awards given to this member
                                  will appear here.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {members.filter((m) =>
            m.name
              .toLowerCase()
              .includes(memberSearch.toLowerCase())
          ).length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-blue/[0.06] flex items-center justify-center mb-3">
                <Search
                  size={20}
                  className="text-brand-blue"
                />
              </div>

              <p className="text-sm font-bold text-text-primary">
                No members found
              </p>

              <p className="text-xs text-text-muted mt-1">
                Try another search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}
      {/* Bulk Award Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4" style={{background:'rgba(12,14,26,0.82)'}}>
          <div className="w-full max-w-sm card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-brand-violet" />
                <h2 className="font-bold text-text-primary text-base">Bulk Award Points</h2>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="p-1.5 rounded-lg text-text-muted hover:bg-bg-elevated">
                <X size={18} />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-brand-violet/10 border border-brand-violet/20 mb-4 text-xs text-text-secondary">
              Awarding to <strong className="text-text-primary">{bulkSelected.size} member{bulkSelected.size > 1 ? 's' : ''}</strong>:
              {' '}{members.filter(m => bulkSelected.has(m.id)).map(m => m.name).join(', ')}
            </div>
            <form onSubmit={handleBulkAward} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Activity Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'workshop',  label: '🎖️ Workshop',  color: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue' },
                    { value: 'hackathon', label: '⚡ Hackathon', color: 'border-brand-violet/40 bg-brand-violet/10 text-brand-violet' },
                    { value: 'project',   label: '⚙️ Project',   color: 'border-brand-emerald/40 bg-brand-emerald/10 text-brand-emerald' },
                    { value: 'event',     label: '🎪 Event',     color: 'border-brand-pink/40 bg-brand-pink/10 text-brand-pink' },
                    { value: 'general',   label: '📋 General',   color: 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber' },
                  ].map(({ value, label, color }) => (
                    <button key={value} type="button" onClick={() => setBulkType(value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${bulkType === value ? color : 'border-bg-border text-text-muted hover:bg-bg-elevated'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Points</label>
                <input type="number" min={1} max={500} value={bulkPoints} onChange={(e) => setBulkPoints(e.target.value)} className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Reason</label>
                <input type="text" required value={bulkReason} onChange={(e) => setBulkReason(e.target.value)} placeholder="e.g. Completed React Workshop…" className="input-field" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowBulkModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button type="submit" disabled={bulkAwarding} className="btn-primary flex-1 text-sm">
                  {bulkAwarding ? <div className="w-4 h-4 spinner" /> : `Award to ${bulkSelected.size}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm card p-6 animate-slide-up">
            <h2 className="font-bold text-text-primary text-base mb-2">Revoke Points?</h2>
            <p className="text-text-muted text-xs mb-4">
              This will remove <strong className="text-brand-red">+{revokeTarget.member.points_history?.[revokeTarget.entryIdx]?.points} pts</strong> from {revokeTarget.member.name}'s total for:
              <br /><strong className="text-text-primary">"{revokeTarget.member.points_history?.[revokeTarget.entryIdx]?.reason}"</strong>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRevokeTarget(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleRevokePoints} className="flex-1 py-3 rounded-xl bg-brand-red/15 border border-brand-red/30 text-brand-red hover:bg-brand-red/25 text-sm font-semibold transition-all">
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Points Modal */}
      {awardTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-brand-violet" />
                <h2 className="font-bold text-text-primary text-base">Award Points</h2>
              </div>
              <button onClick={() => setAwardTarget(null)} className="p-1.5 rounded-lg text-text-muted hover:bg-bg-elevated transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-violet/10 border border-brand-violet/20 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-sm font-black text-white shrink-0">
                {awardTarget.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-text-primary text-sm">{awardTarget.name}</div>
                <div className="text-[10px] text-text-muted">{awardTarget.year} · {awardTarget.points} pts current</div>
              </div>
            </div>
            <form onSubmit={handleAwardPoints} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Activity Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'workshop',  label: '🎖️ Workshop',   color: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue' },
                    { value: 'hackathon', label: '⚡ Hackathon',  color: 'border-brand-violet/40 bg-brand-violet/10 text-brand-violet' },
                    { value: 'project',   label: '⚙️ Project',    color: 'border-brand-emerald/40 bg-brand-emerald/10 text-brand-emerald' },
                    { value: 'event',     label: '🎪 Event',      color: 'border-brand-pink/40 bg-brand-pink/10 text-brand-pink' },
                    { value: 'general',   label: '📋 General',    color: 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber' },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAwardType(value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        awardType === value ? color : 'border-bg-border text-text-muted hover:bg-bg-elevated'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Points to Award</label>
                <input
                  type="number" min={1} max={500}
                  value={awardPoints}
                  onChange={(e) => setAwardPoints(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Reason</label>
                <input
                  type="text" required
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="e.g. Attended React Workshop, Won Hackathon…"
                  className="input-field"
                />
              </div>
              <div className="bg-bg-elevated border border-bg-border rounded-xl p-3 text-xs text-text-muted">
                This will add <strong className="text-brand-violet">+{awardPoints} pts</strong> to {awardTarget.name}'s profile with the reason recorded in their history.
                {['workshop', 'hackathon', 'project'].includes(awardType) && (
                  <span className="block mt-1 text-brand-emerald font-semibold">✓ Badges will be auto-assigned for completing this {awardType}.</span>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setAwardTarget(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button type="submit" disabled={awarding} className="btn-primary flex-1 text-sm">
                  {awarding ? <div className="w-4 h-4 spinner" /> : 'Award Points'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* ── Tab: Resources ── */}
{activeTab === 'resources' && (
  <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">

    {/* ── Left: Add Resource Form ── */}
    <form
      onSubmit={handleCreateResource}
      className="card p-6 space-y-5 xl:sticky xl:top-6"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-bg-border">
        <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
          <BookOpen size={18} className="text-brand-emerald" />
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">
            Add Study Resource
          </h2>
          <p className="text-text-muted text-xs mt-0.5">
            Share useful learning material with club members.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
          Resource Title
        </label>
        <input
          type="text"
          required
          value={resTitle}
          onChange={(e) => setResTitle(e.target.value)}
          placeholder="Example: Complete DSA Roadmap"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
          Category
        </label>
        <input
          type="text"
          required
          value={resCategory}
          onChange={(e) => setResCategory(e.target.value)}
          placeholder="Example: DSA, Cybersecurity, Cloud"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
          Resource URL
        </label>
        <input
          type="url"
          required
          value={resUrl}
          onChange={(e) => setResUrl(e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
          Description
          <span className="font-normal normal-case ml-1">(optional)</span>
        </label>
        <textarea
          rows={4}
          value={resDesc}
          onChange={(e) => setResDesc(e.target.value)}
          placeholder="Briefly explain what students will learn..."
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={formSubmitting}
        className="btn-primary w-full py-3 justify-center"
      >
        {formSubmitting ? (
          <div className="w-4 h-4 spinner" />
        ) : (
          'Add Resource'
        )}
      </button>
    </form>

    {/* ── Right: Resource Library ── */}
    <div className="card overflow-hidden">

      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-bg-border flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={17} className="text-brand-blue" />
            <h2 className="font-display font-bold text-lg text-text-primary">
              Resource Library
            </h2>
          </div>

          <p className="text-xs text-text-muted mt-1">
            Resources currently available to club members.
          </p>
        </div>

        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-bold">
          {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
        </div>
      </div>

      {/* Loading */}
      {fetchingResources ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 spinner" />
        </div>

      ) : resources.length === 0 ? (

        /* Empty State */
        <div className="py-20 px-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-brand-blue" />
          </div>

          <h3 className="font-bold text-text-primary text-sm">
            No resources added yet
          </h3>

          <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
            Add your first learning resource using the form on the left.
          </p>
        </div>

      ) : (

        /* Resource List */
        <div className="divide-y divide-bg-border">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="p-5 hover:bg-bg-elevated transition-colors"
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <BookOpen size={17} className="text-brand-blue" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-text-primary">
                        {resource.title}
                      </h3>

                      <span className="badge badge-blue text-[10px]">
                        {resource.category || 'General'}
                      </span>
                    </div>

                    {resource.description && (
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs gap-1.5 shrink-0"
                  >
                    <ExternalLink size={13} />
                    Open
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-2 rounded-lg border border-brand-red/20 text-brand-red hover:bg-brand-red/10 hover:border-brand-red/45 transition-all shrink-0"
                    title="Delete Resource"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      {/* ── Tab: Coding Challenges ── */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          {/* Sub Tab Switcher */}
          <div className="flex border-b border-bg-border gap-6">
            <button
              onClick={() => setChallengesSubTab('prompts')}
              className={`pb-3 font-bold text-xs uppercase tracking-wider transition-all relative ${
                challengesSubTab === 'prompts' ? 'text-brand-violet' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Challenge Prompts
              {challengesSubTab === 'prompts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-violet" />
              )}
            </button>

            <button
              onClick={() => setChallengesSubTab('submissions')}
              className={`pb-3 font-bold text-xs uppercase tracking-wider relative transition-all ${
                challengesSubTab === 'submissions' ? 'text-brand-violet' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Student Submissions
              {submissions.filter(s => s.status === 'Pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-brand-red text-white text-[8px] font-bold animate-pulse">
                  {submissions.filter(s => s.status === 'Pending').length}
                </span>
              )}
              {challengesSubTab === 'submissions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-violet" />
              )}
            </button>
          </div>

          {challengesSubTab === 'prompts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Challenge Creation Form */}
              <div className="lg:col-span-1">
                <form onSubmit={handleCreateChallenge} className="card p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-xs uppercase text-text-primary">Create Challenge</h3>
                    <p className="text-[10px] text-text-muted mt-1">Publish a weekly problem prompt.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary">Title</label>
                    <input
                      type="text"
                      required
                      value={chalTitle}
                      onChange={(e) => setChalTitle(e.target.value)}
                      placeholder="e.g. Invert a Binary Tree"
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={chalDesc}
                      onChange={(e) => setChalDesc(e.target.value)}
                      placeholder="Enter problem requirements..."
                      className="input-field w-full text-xs py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary">Difficulty</label>
                      <select
                        value={chalDiff}
                        onChange={(e) => setChalDiff(e.target.value)}
                        className="input-field w-full text-xs"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary">Points</label>
                      <input
                        type="number"
                        required
                        min={5}
                        max={100}
                        value={chalPoints}
                        onChange={(e) => setChalPoints(e.target.value)}
                        className="input-field w-full text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary">LeetCode / Resource Link</label>
                    <input
                      type="url"
                      value={chalLink}
                      onChange={(e) => setChalLink(e.target.value)}
                      placeholder="https://leetcode.com/..."
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="btn-primary w-full justify-center text-xs py-2.5"
                  >
                    {formSubmitting ? 'Publishing...' : 'Publish Challenge'}
                  </button>
                </form>
              </div>

              {/* Challenge List */}
              <div className="lg:col-span-2 space-y-4">
                {fetchingChallenges ? (
                  <div className="py-12 text-center text-xs text-text-muted">Loading challenges...</div>
                ) : challenges.length === 0 ? (
                  <div className="card py-12 text-center text-xs text-text-muted border-dashed border-2 flex flex-col items-center justify-center gap-2">
                    <Trophy size={24} className="opacity-45 text-text-muted" />
                    <span>No active challenges found. Use the editor to create one.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {challenges.map((chal) => (
                      <div key={chal.id} className="card p-5 flex flex-col justify-between border border-bg-border">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              chal.difficulty === 'Easy' ? 'bg-brand-emerald/10 text-brand-emerald' :
                              chal.difficulty === 'Medium' ? 'bg-brand-amber/10 text-brand-amber' :
                              'bg-brand-red/10 text-brand-red'
                            }`}>
                              {chal.difficulty}
                            </span>
                            <span className="text-[10px] font-bold text-brand-violet">
                              +{chal.points} pts
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-text-primary mb-1">{chal.title}</h4>
                          <p className="text-xs text-text-secondary line-clamp-3 mb-4">{chal.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-bg-border">
                          {chal.link ? (
                            <a
                              href={chal.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-brand-blue font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              Prompt link <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-[10px] text-text-muted">No prompt link</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteChallenge(chal.id)}
                            className="text-[10px] text-brand-red font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {challengesSubTab === 'submissions' && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-bg-border">
                <h3 className="font-bold text-xs uppercase text-text-primary">Solution Submissions</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Review solutions submitted by members.</p>
              </div>

              {submissions.length === 0 ? (
                <div className="py-12 text-center text-xs text-text-muted">No solutions submitted yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-elevated border-b border-bg-border text-[9px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="px-5 py-3.5">Student</th>
                        <th className="px-5 py-3.5">Challenge</th>
                        <th className="px-5 py-3.5">GitHub Link</th>
                        <th className="px-5 py-3.5">Notes</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Feedback</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bg-border text-xs">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-bg-elevated">
                          <td className="px-5 py-4 font-semibold text-text-primary">{sub.student_name}</td>
                          <td className="px-5 py-4 text-text-secondary">{sub.challenge_title}</td>
                          <td className="px-5 py-4">
                            <a
                               href={sub.github_url}
                               target="_blank"
                               rel="noreferrer"
                               className="text-brand-blue font-medium hover:underline inline-flex items-center gap-1"
                            >
                              View Code <ExternalLink size={10} />
                            </a>
                          </td>
                          <td className="px-5 py-4 text-text-muted truncate max-w-[150px]" title={sub.comments}>
                            {sub.comments || '—'}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                              sub.status === 'Approved' ? 'bg-brand-emerald/10 text-brand-emerald' :
                              sub.status === 'Rejected' ? 'bg-brand-red/10 text-brand-red' :
                              'bg-brand-blue/10 text-brand-blue'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-text-muted truncate max-w-[150px]" title={sub.feedback}>
                            {sub.feedback || '—'}
                          </td>
                          <td className="px-5 py-4 text-right font-medium">
                            {sub.status === 'Pending' ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSubmissionStatus(sub.id, 'Approved')}
                                  className="px-2.5 py-1 rounded bg-brand-emerald text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSubmissionStatus(sub.id, 'Rejected')}
                                  className="px-2.5 py-1 rounded bg-brand-red text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-text-muted font-normal">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Admin Profile ── */}
      {activeTab === 'profile' && (
  <div className="space-y-6 max-w-2xl">

    {/* Account Info Card */}
    <div className="card p-6">
      <div className="flex items-center gap-4 pb-5 mb-5 border-b border-bg-border">
        <div
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b6cf9 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
          }}
        >
          {(adminProfile?.display_name || adminProfile?.email || 'A')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-primary text-base leading-tight">
            {adminProfile?.display_name || 'Administrator'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{adminProfile?.email || '—'}</p>
          <span
            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}
          >
            ● System Administrator
          </span>
        </div>
      </div>

      {/* Display name form */}
      <p className="text-[10px] font-bold text-brand-violet uppercase tracking-[0.14em] mb-3">Display Name</p>
      <form onSubmit={handleSaveProfile} className="flex flex-col sm:flex-row gap-3">
        <input
          id="admin-display-name"
          type="text"
          className="input-field flex-1"
          placeholder="e.g. Club Admin, CODEXA HQ"
          value={profileName}
          onChange={e => setProfileName(e.target.value)}
          maxLength={60}
          required
        />
        <button
          type="submit"
          disabled={profileSaving || !profileName.trim()}
          className="btn-primary shrink-0"
          style={{ minWidth: 120 }}
        >
          {profileSaving ? 'Saving…' : 'Save Name'}
        </button>
      </form>
      {profileMsg && (
        <div
          className={`mt-3 flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 ${
            profileMsg.type === 'success'
              ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20'
              : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
          }`}
        >
          {profileMsg.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
          {profileMsg.text}
        </div>
      )}
      <p className="text-xs text-text-muted mt-3">
        This name appears in announcements and the sidebar. It does not affect your login credentials.
      </p>
    </div>

    {/* Change Password Card */}
    <div className="card p-6">
      <p className="text-[10px] font-bold text-brand-violet uppercase tracking-[0.14em] mb-4">Change Password</p>
      <form onSubmit={handleChangePassword} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="admin-pw-current">Current Password</label>
          <input
            id="admin-pw-current"
            type="password"
            className="input-field w-full"
            placeholder="Enter current password"
            value={pwCurrent}
            onChange={e => setPwCurrent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="admin-pw-new">New Password</label>
          <input
            id="admin-pw-new"
            type="password"
            className="input-field w-full"
            placeholder="At least 6 characters"
            value={pwNew}
            onChange={e => setPwNew(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="admin-pw-confirm">Confirm New Password</label>
          <input
            id="admin-pw-confirm"
            type="password"
            className="input-field w-full"
            placeholder="Repeat new password"
            value={pwConfirm}
            onChange={e => setPwConfirm(e.target.value)}
            required
          />
        </div>
        {pwMsg && (
          <div
            className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 ${
              pwMsg.type === 'success'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20'
                : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
            }`}
          >
            {pwMsg.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
            {pwMsg.text}
          </div>
        )}
        <button
          type="submit"
          disabled={pwSaving || !pwCurrent || !pwNew || !pwConfirm}
          className="btn-primary w-full mt-1"
        >
          {pwSaving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>

    {/* Account Details (read-only) */}
    <div className="card p-6">
      <p className="text-[10px] font-bold text-brand-violet uppercase tracking-[0.14em] mb-4">Account Details</p>
      <div className="space-y-3">
        {[
          { label: 'Email Address', value: adminProfile?.email || '—' },
          { label: 'Account Role',  value: 'Administrator' },
          { label: 'Account Status', value: 'Active' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-bg-border last:border-0">
            <span className="text-xs text-text-muted">{label}</span>
            <span className="text-sm font-semibold text-text-primary">{value}</span>
          </div>
        ))}
      </div>
    </div>

  </div>
)}

      <ConfirmDialog
        open={confirmConfig !== null}
        title={confirmConfig?.title}
        message={confirmConfig?.message}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmConfig?.onConfirm}
        onCancel={() => setConfirmConfig(null)}
      />
</div>
  );
}