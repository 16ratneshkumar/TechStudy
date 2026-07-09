import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="main-content">
            <div className="container">
                <section className="hero-section">
                    <h1 className="hero-title">
                        Welcome to <span className="gradient-text">TechStudy</span>
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate computer science study hub for professional-grade notes and practicals.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/notes" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            Browse Notes
                        </Link>
                        <Link href="/practicals" className="btn" style={{ textDecoration: 'none' }}>
                            View Practicals
                        </Link>
                    </div>
                </section>
                
                <section style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why TechStudy?</h2>
                    <div className="about-grid">
                        <div className="about-feature-card">
                            <h3>Smart Organization</h3>
                            <p>Categorized by subjects and practicals, ensuring you find exactly what you need in seconds.</p>
                        </div>
                        <div className="about-feature-card">
                            <h3>Instant Access</h3>
                            <p>Pre-rendered content for fast loading and great SEO.</p>
                        </div>
                        <div className="about-feature-card">
                            <h3>Dark Mode</h3>
                            <p>A premium dark aesthetic for late-night study sessions, reducing eye strain.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
