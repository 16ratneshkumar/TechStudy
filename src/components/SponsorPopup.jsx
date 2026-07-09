'use client';
import { useState, useEffect } from 'react';
import sponsorConfig from '@/data/sponsorConfig';

export default function SponsorPopup({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'auto';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const { sponsor } = sponsorConfig;

  const handleCta = () => {
    window.open(sponsor.ctaHref, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className={`sponsor-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className={`sponsor-modal-content ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Animated Glows */}
        <div className="sponsor-modal-glow sponsor-glow-1"></div>
        <div className="sponsor-modal-glow sponsor-glow-2"></div>

        <button className="sponsor-modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="sponsor-modal-header">
          <div className="sponsor-modal-badge">{sponsor.tagline}</div>
          <h2 className="sponsor-title">Support {sponsor.name}</h2>
          <p className="sponsor-description" style={{ marginTop: '0.75rem', marginBottom: '0' }}>
            {sponsor.message}
          </p>
        </div>
        
        <div className="sponsor-modal-body">
          <div className="sponsor-card">
            <div className="sponsor-qr-section">
              <div className="sponsor-qr-container">
                <img 
                  src="/sponsor-qr.jpeg" 
                  alt="Sponsor QR Code" 
                  className="sponsor-qr-image"
                />
              </div>
              <p className="qr-hint">Scan to pay with any UPI app</p>
            </div>
            
            <div className="sponsor-divider">
              <span>OR</span>
            </div>
            
            <div className="sponsor-details">
              <div className="upi-field">
                <span className="upi-label">UPI Number</span>
                <div className="upi-value-container">
                  <span className="upi-value">20041623</span>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText('20041623')} title="Copy Mobile Number">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sponsor-modal-footer">
          <button className="sponsor-cta-btn" onClick={handleCta}>
            {sponsor.ctaLabel}
          </button>
          <button className="sponsor-secondary-btn" onClick={onClose}>
            {sponsor.secondaryLabel}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .sponsor-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sponsor-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .sponsor-modal-content {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          width: 90%;
          max-width: 380px;
          padding: 1.5rem 1.5rem;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(59, 130, 246, 0.1);
          transform: scale(0.9) translateY(20px);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sponsor-modal-content.active {
          transform: scale(1) translateY(0);
        }

        .sponsor-modal-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.15;
          z-index: 0;
          pointer-events: none;
        }

        .sponsor-glow-1 {
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          background: var(--color-primary);
        }

        .sponsor-glow-2 {
          bottom: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background: #8b5cf6;
        }

        .sponsor-modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .sponsor-modal-close:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
          transform: rotate(90deg) scale(1.1);
        }

        .sponsor-modal-header {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sponsor-avatar-container {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1));
          border: 1px solid rgba(59,130,246,0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(59,130,246,0.1);
          transform: rotate(-5deg);
          transition: all 0.3s ease;
        }

        .sponsor-modal-content:hover .sponsor-avatar-container {
          transform: rotate(0deg) scale(1.05);
        }

        .sponsor-avatar {
          font-size: 2.5rem;
          line-height: 1;
        }

        .sponsor-modal-badge {
          display: inline-block;
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sponsor-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
        }

        .sponsor-modal-body {
          margin: 1rem 0 1rem;
          position: relative;
          z-index: 1;
        }

        .sponsor-description {
          color: var(--color-text-secondary);
          line-height: 1.5;
          font-size: 0.9rem;
          margin: 0;
        }

        .sponsor-card {
          background: var(--color-surface-hover);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .sponsor-qr-section {
          text-align: center;
        }

        .sponsor-qr-container {
          width: 160px;
          height: 160px;
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin: 0 auto 0.5rem;
        }

        .sponsor-qr-image {
          width: 100%;
          height: 100%;
          display: block;
        }

        .qr-hint {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin: 0;
          font-weight: 500;
        }

        .sponsor-divider {
          display: flex;
          align-items: center;
          width: 80%;
          color: var(--color-text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          gap: 1rem;
        }

        .sponsor-divider::before,
        .sponsor-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .sponsor-details {
          width: 100%;
        }

        .upi-field {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .upi-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 700;
          text-align: left;
        }

        .upi-value-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .upi-value {
          font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-primary);
        }

        .copy-btn {
          background: var(--color-bg-tertiary);
          border: none;
          color: var(--color-text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .sponsor-modal-footer {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .sponsor-cta-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          background: linear-gradient(135deg, var(--color-primary) 0%, #2563eb 100%);
          border: none;
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sponsor-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5);
        }

        .sponsor-secondary-btn {
          flex: 1;
          padding: 0.6rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sponsor-secondary-btn:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        @media (max-width: 480px) {
          .sponsor-modal-content {
            padding: 2rem 1.5rem;
          }
          .sponsor-title {
            font-size: 1.5rem;
          }
          .sponsor-description {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
