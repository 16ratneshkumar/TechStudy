export default function AboutPage() {
    return (
        <main className="main-content">
            <div className="container">
                <section className="about-container">
                    <div className="about-hero" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 className="about-title">
                            Built for <span className="gradient-text">Focused</span> & <span className="gradient-text">Efficient</span> Learning
                        </h1>
                        <p className="about-subtitle" style={{ maxWidth: '750px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6' }}>
                            TechStudy is an advanced presentation platform engineered to transform your academic materials into a seamless, distraction-free reading experience — so you can focus on what truly matters: learning.
                        </p>
                    </div>

                    <div className="content-box" style={{ marginBottom: '3rem' }}>
                        <h2>What We Offer</h2>
                        <p style={{ lineHeight: '1.7' }}>
                            TechStudy is designed from the ground up to make every studying session feel effortless and productive. We provide a curated, beautiful environment where every feature serves one singular goal — helping you understand material faster and retain it longer.
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
                            <li><strong>Instant Navigation:</strong> Browse entire subject repositories with a clean, structured hierarchy that keeps you in flow.</li>
                            <li><strong>Beautiful Typography:</strong> Every markdown document is rendered with thoughtfully designed fonts and spacing, making long reading sessions comfortable.</li>
                            <li><strong>Mathematics Support:</strong> Complex formulas and LaTeX expressions render perfectly, so your notes look exactly as your professors intended.</li>
                        </ul>
                    </div>

                    <div className="content-box" style={{ marginBottom: '3rem' }}>
                        <h2>Platform Architecture</h2>
                        <p style={{ lineHeight: '1.7' }}>
                            Under the hood, TechStudy is powered by a modern, high-performance web stack designed to deliver content at lightning speed with maximum reliability.
                        </p>
                        <div className="about-grid" style={{ marginTop: '2rem' }}>
                            <div className="about-feature-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Advanced Rendering</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>Full GitHub Flavored Markdown support with syntax-highlighted code blocks and precise mathematical typography powered by KaTeX.</p>
                            </div>
                            <div className="about-feature-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Native Data Viewing</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>Integrated client-side spreadsheet parsing via SheetJS lets you view <code>.xlsx</code> and <code>.xls</code> files directly in your browser — no downloads needed.</p>
                            </div>
                            <div className="about-feature-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>High-Performance Caching</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>A multi-layered caching strategy using Next.js 16 Server Components and Upstash Redis ensures every page loads instantly, every time.</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-box">
                        <h2>Open Source Initiative</h2>
                        <p style={{ lineHeight: '1.7' }}>
                            TechStudy is an open-source project created by Ratnesh Kumar using vibe-coding, built on the principle that quality education tools should be freely available to everyone. We welcome contributions from developers, educators, and students who share our vision of making academic resources more accessible, organized, and beautiful.
                        </p>
                        <div style={{ marginTop: '1.5rem' }}>
                            <a
                                href="https://github.com/16ratneshkumar/TechStudy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                View Repository
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
