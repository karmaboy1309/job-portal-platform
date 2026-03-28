import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../utils/formatApiError';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'seeker', location: '', bio: '', skills: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (r) => setForm({ ...form, role: r });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* Logo */}
        <div className="auth-logo-row">
          <div className="auth-logo">S</div>
          <span className="auth-brand">SkillBridge</span>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Join thousands finding their dream roles</p>

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="auth-form">
          {/* Role selector */}
          <div className="form-group">
            <label>I am a…</label>
            <div className="role-selector">
              <div
                className={`role-option${form.role === 'seeker' ? ' selected' : ''}`}
                onClick={() => setRole('seeker')}
              >
                <input type="radio" name="role" value="seeker" checked={form.role === 'seeker'} onChange={() => setRole('seeker')} />
                <span className="role-icon">🎓</span>
                <span className="role-label">Job Seeker</span>
              </div>
              <div
                className={`role-option${form.role === 'employer' ? ' selected' : ''}`}
                onClick={() => setRole('employer')}
              >
                <input type="radio" name="role" value="employer" checked={form.role === 'employer'} onChange={() => setRole('employer')} />
                <span className="role-icon">🏢</span>
                <span className="role-label">Employer</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-name">Full name</label>
            <input id="reg-name" name="name" placeholder="Jane Doe" value={form.name} onChange={handle} required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input id="reg-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handle}
                required
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: 16,
                  color: 'var(--clr-text-muted)', padding: '4px',
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-location">Location</label>
            <input id="reg-location" name="location" placeholder="New York, Remote, etc." value={form.location} onChange={handle} />
          </div>

          <div className="form-group">
            <label htmlFor="reg-bio">Short bio</label>
            <textarea id="reg-bio" name="bio" placeholder="Tell us a bit about yourself…" value={form.bio} onChange={handle} style={{ minHeight: 80 }} />
          </div>

          <div className="form-group">
            <label htmlFor="reg-skills">Skills</label>
            <input id="reg-skills" name="skills" placeholder="React, Node.js, Python (comma separated)" value={form.skills} onChange={handle} />
            <span className="form-hint">Separate multiple skills with commas</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', fontSize: 15 }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Creating account…
              </>
            ) : (
              '🚀 Create Account'
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
