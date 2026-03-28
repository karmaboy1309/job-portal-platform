import React from 'react';

const EmptyState = ({ title = 'Nothing here', description = '', action }) => (
  <div className="empty-state">
    <span className="empty-state-icon">🗂️</span>
    <div className="empty-state-title">{title}</div>
    {description && <p className="empty-state-desc">{description}</p>}
    {action && <div style={{ marginTop: 24 }}>{action}</div>}
  </div>
);

export default EmptyState;
