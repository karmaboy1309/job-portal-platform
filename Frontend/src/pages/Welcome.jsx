import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PREVIEW_JOBS = [
  { title: 'Software Engineer Intern', company: 'Google', location: 'San Francisco', salary: '$4k/mo', dot: '#22c55e' },
  { title: 'Lead UI/UX Design Intern', company: 'Stripe', location: 'Remote', salary: '$5k/mo', dot: '#4f7dff' },
  { title: 'Product Manager Intern', company: 'Meta', location: 'New York', salary: '$4.5k/mo', dot: '#f59e0b' },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Matches',
    desc: 'Our smart algorithm analyzes your skills and suggests roles with the highest fit score just for you.',
  },
  {
    icon: '📚',
    title: 'Guided Skill Tracks',
    desc: 'Follow curated learning paths to fill skill gaps and level up your career faster than ever.',
  },
  {
    icon: '🏢',
    title: 'Top Companies',
    desc: 'Access internships and full-time roles from hundreds of leading companies and fast-growing startups.',
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-eyebrow">
          <span>✨</span> AI-Powered Job Portal
        </div>
        <h1 className="hero-title">
          Find Your Dream<br />Career Path
        </h1>
        <p className="hero-subtitle">
          Discover personalized internships, learning tracks and AI-powered matches tailored for your next big step.
        </p>
        <div className="hero-ctas">
          {user ? (
            <>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/jobs')}>
                🔍 Browse Jobs
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
                📊 Dashboard
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                🚀 Get Started Free
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </>
          )}
        </div>
        <div className="hero-badges">
          <span className="hero-badge">🤖 AI Matches</span>
          <span className="hero-badge">📚 Skill Tracks</span>
          <span className="hero-badge">🌍 Remote Friendly</span>
          <span className="hero-badge">⚡ Instant Apply</span>
        </div>

        {/* Preview panel */}
        <div className="preview-panel">
          <div className="preview-panel-header">
            <span className="preview-panel-title">Recommended for you</span>
            <span className="badge badge-green">Live</span>
          </div>
          {PREVIEW_JOBS.map((j, i) => (
            <div className="preview-job-row" key={i}>
              <div className="preview-job-title">{j.title}</div>
              <div className="preview-job-meta">
                <span
                  className="preview-company-dot"
                  style={{ background: j.dot }}
                />
                <span>{j.company}</span>
                <span>·</span>
                <span>{j.location}</span>
                <span>·</span>
                <span style={{ fontWeight: 700, color: 'var(--clr-primary-light)' }}>{j.salary}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 6 }}
            onClick={() => navigate('/jobs')}>
            View All Jobs →
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-value">12,400+</div>
          <div className="stat-label">Active Job Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">2,800+</div>
          <div className="stat-label">Partner Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-value">95%</div>
          <div className="stat-label">Placement Rate</div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="features-section">
        <h2 className="features-heading">Why SkillBridge?</h2>
        <p className="features-sub">Everything you need to launch and grow your career in one place.</p>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Welcome;
