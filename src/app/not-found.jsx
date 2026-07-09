import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="main-content">
      <div className="status-page-wrapper">
        <div className="status-page-card">
          <div className="status-page-glow"></div>
          <div className="status-icon">🔍</div>
          <h1 className="status-title">Page Not Found</h1>
          <p className="status-desc">
            We couldn't find the page or notes you're looking for. It may have been moved or doesn't exist.
          </p>
          <div className="status-actions">
            <Link href="/" className="btn">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
