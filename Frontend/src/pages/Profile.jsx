import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, fetchMe } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', location: '', bio: '', skills: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    if (!user) fetchMe();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills?.join ? user.skills.join(', ') : (user.skills || ''),
      });
    }
  }, [user]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      const payload = { name: form.name, location: form.location, bio: form.bio, skills: form.skills };
      await axios.put('http://localhost:5000/api/auth/me', payload);
      setMsg('Profile updated successfully! ✅');
      setMsgType('success');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Failed to save profile');
      setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const skillsArr = form.skills
    ? form.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="page-wrapper-md">
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        My <span>Profile</span>
      </h1>

      {/* Profile header card */}
      <div className="profile-header-card">
        <div className="profile-avatar-lg">{initials}</div>
        <div className="profile-info">
          <div className="profile-name">{user?.name || 'Your Name'}</div>
          <div className="profile-email">{user?.email}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <span className={`badge ${user?.role === 'employer' ? 'badge-purple' : 'badge-blue'}`}>
              {user?.role === 'employer' ? '🏢 Employer' : '🎓 Job Seeker'}
            </span>
            {user?.location && (
              <span className="badge badge-amber">📍 {user.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="profile-form-card">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Edit Profile</h2>
          <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
            Update your personal information and skills.
          </p>
        </div>

        {msg && (
          <div className={msgType === 'success' ? 'success-box' : 'error-box'} style={{ marginBottom: 20 }}>
            <span>{msgType === 'success' ? '✅' : '⚠️'}</span>
            <span>{msg}</span>
          </div>
        )}

        <form className="profile-form" onSubmit={save}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pf-name">Full Name</label>
              <input id="pf-name" name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="pf-email">Email Address</label>
              <input
                id="pf-email"
                name="email"
                value={form.email}
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              />
              <span className="form-hint">Email cannot be changed</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pf-location">Location</label>
            <input id="pf-location" name="location" value={form.location} onChange={handle} placeholder="City, Country, or Remote" />
          </div>

          <div className="form-group">
            <label htmlFor="pf-bio">Bio</label>
            <textarea
              id="pf-bio"
              name="bio"
              value={form.bio}
              onChange={handle}
              placeholder="Tell employers about yourself, your experience and goals…"
              style={{ minHeight: 100 }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pf-skills">Skills</label>
            <input
              id="pf-skills"
              name="skills"
              value={form.skills}
              onChange={handle}
              placeholder="React, TypeScript, Node.js, Python…"
            />
            <span className="form-hint">Separate skills with commas</span>
            {/* Live skill preview */}
            {skillsArr.length > 0 && (
              <div className="skills-wrap">
                {skillsArr.map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ minWidth: 140 }}
            >
              {saving ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Saving…
                </>
              ) : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
