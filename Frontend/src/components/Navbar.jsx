import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('dark') !== '0');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('dark', dark ? '1' : '0');
  }, [dark]);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo">S</div>
          <span className="navbar-brand-name">SkillBridge</span>
        </NavLink>

        {/* Center Nav */}
        <div className="navbar-center">
          <NavLink
            to="/jobs"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            🔍 Jobs
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                📊 Dashboard
              </NavLink>
              {(user.role === 'employer' || user.role === 'admin') && (
                <NavLink
                  to="/create"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  ✨ Post Job
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right */}
        <div className="navbar-right">
          {/* Dark mode toggle */}
          <div className="theme-toggle-wrap">
            <span className="toggle-label">{dark ? '🌙' : '☀️'}</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={dark}
                onChange={e => setDark(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>

          {!user ? (
            <>
              <NavLink to="/login" className={({ isActive }) => `btn btn-ghost btn-sm${isActive ? ' active' : ''}`}>
                Sign In
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className="user-pill-btn">
                <div className="user-avatar">{initials}</div>
                <span className="user-name-text">{user.name}</span>
              </NavLink>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { logout(); navigate('/login'); }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
