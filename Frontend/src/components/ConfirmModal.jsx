import React, { useEffect } from 'react';

/**
 * Reusable modal for destructive or important confirmation actions
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Descriptive question or message
 * @param {string} [props.confirmText="Confirm"] - Text for confirm button
 * @param {string} [props.cancelText="Cancel"] - Text for cancel button
 * @param {boolean} [props.isDanger=false] - Whether action is destructive (red button)
 * @param {function} props.onConfirm - Confirm callback
 * @param {function} props.onClose - Dismiss/cancel callback
 */
const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 16
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 24,
          borderRadius: 'var(--radius-lg, 12px)',
          background: 'var(--clr-surface, #1e293b)',
          border: '1px solid var(--clr-border, #334155)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
          animation: 'modalFadeIn 0.2s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          {isDanger && (
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700
            }}>
              !
            </div>
          )}
          <h2 id="confirm-modal-title" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {title}
          </h2>
        </div>

        <p style={{ color: 'var(--clr-text-secondary, #94a3b8)', fontSize: 14, lineHeight: 1.5, margin: '0 0 20px 0' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} btn-sm`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
