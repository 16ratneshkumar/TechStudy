import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';
import SubjectCard from '@/components/SubjectCard';

export default async function TagPage({ params }) {
    const { tag } = await params;
    const decoded = decodeURIComponent(tag);

    const subjects = repositoriesConfig.subjects || [];
    const practicals = repositoriesConfig.practicals || [];
    const all = [...subjects, ...practicals];

    const matched = all.filter(item =>
        (item.tags || []).map(t => t.toLowerCase()).includes(decoded.toLowerCase())
    );

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/notes" className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        All Notes
                    </Link>
                    <h1>
                        <span style={{ color: 'var(--primary-color)' }}>#</span>{decoded}
                        <span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: '1rem', opacity: 0.6 }}>{matched.length} result{matched.length !== 1 ? 's' : ''}</span>
                    </h1>
                    <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>All subjects and practicals tagged with "{decoded}"</p>
                </div>

                {matched.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🏷️</span>
                        <p>No content found for this tag.</p>
                    </div>
                ) : (
                    <div className="subjects-grid">
                        {matched.map(item => {
                            const href = item.type === 'practical'
                                ? `/practicals/${item.repo}`
                                : `/notes/${item.repo}`;
                            return (
                                <SubjectCard
                                    key={`${item.owner}-${item.repo}`}
                                    href={href}
                                    subject={item}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
