import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = ({ isActive }) => ({
    padding: '8px 12px',
    borderRadius: 6,
    textDecoration: 'none',
    color: isActive ? '#fff' : '#333',
    background: isActive ? '#4a90e2' : 'transparent',
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
      <NavLink to="/" style={linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/create" style={linkStyle}>
        Create Job
      </NavLink>
    </nav>
  );
};

export default Navbar;
