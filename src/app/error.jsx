'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  const isRateLimit = error?.message?.includes('GITHUB_RATE_LIMIT_EXCEEDED');

  return (
    <main className="main-content">
      <div className="status-page-wrapper">
        <div className="status-page-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div className="status-page-glow" style={isRateLimit ? { background: 'radial-gradient(circle at 50% -20%, rgba(245, 158, 11, 0.2), transparent 70%)' } : {}}></div>
          <div className="status-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
             {isRateLimit ? '⏳' : '⚠️'}
          </div>
          <h1 className="status-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            {isRateLimit ? 'Take a breather.' : 'Something went wrong.'}
          </h1>
          <p className="status-desc" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            {isRateLimit 
                ? 'TechStudy relies on the GitHub API to fetch notes directly from repositories. It looks like you or the server has hit the hourly request limit. Please wait a little while and try again.'
                : "An unexpected error occurred while loading this page."
            }
          </p>
          <div className="status-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => reset()} className="btn btn-primary">
              Try again
            </button>
            <Link href="/" className="btn" style={{ background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
