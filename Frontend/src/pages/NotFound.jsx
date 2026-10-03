import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '32px 24px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 72 }}>🔍</div>
    <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0 }}>404</h1>
    <p style={{ fontSize: 18, color: 'var(--clr-text-secondary)', maxWidth: 400 }}>
      Oops! The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
      ← Back to Home
    </Link>
  </div>
);

export default NotFound;
