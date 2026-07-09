import Link from 'next/link';
import SubjectCard from '@/components/SubjectCard';
import repositoriesConfig from '@/data/repositories.json';

export default function NotesPage() {
    const subjects = repositoriesConfig.subjects || [];

    // Separate by type
    const degreeSubjects = subjects.filter(s => s.type === 'subject');
    const courses = subjects.filter(s => s.type === 'course');

    // Build one card per unique degree
    const degrees = degreeSubjects.reduce((acc, subject) => {
        const deg = subject.degree || 'Other';
        if (!acc[deg]) {
            acc[deg] = { name: deg, subjects: [], semesters: new Set() };
        }
        acc[deg].subjects.push(subject);
        acc[deg].semesters.add(subject.semester);
        return acc;
    }, {});

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>📚 Browse Notes</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                        Choose a degree to explore semester-wise subjects, or jump directly into a course.
                    </p>
                </div>

                {/* ── DEGREE CARDS ── */}
                {Object.keys(degrees).length > 0 && (
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🎓 Degrees
                        </h2>
                        <div className="degree-cards-grid">
                            {Object.values(degrees).map(deg => {
                                const slug = encodeURIComponent(deg.name.toLowerCase().replace(/\s+/g, '-'));
                                const completeCount = deg.subjects.filter(s => s.progress === 'complete').length;
                                const totalCount = deg.subjects.length;

                                return (
                                    <Link key={deg.name} href={`/notes/degree/${slug}`} className="degree-card" style={{ textDecoration: 'none' }}>
                                        <div className="degree-card-glow"></div>
                                        
                                        {/* Animated Glare Effect */}
                                        <div className="degree-card-glare"></div>
                                        
                                        {/* Glowing Ambient Orbs */}
                                        <div className="degree-card-orb degree-card-orb-1"></div>
                                        <div className="degree-card-orb degree-card-orb-2"></div>

                                        {/* Decorative Dotted Pattern */}
                                        <div className="degree-card-pattern"></div>

                                        <div className="degree-card-top">
                                            <div className="degree-card-icon-wrapper" aria-hidden="true">
                                                <span className="degree-card-icon">🎓</span>
                                            </div>
                                            <span className="degree-card-badge">Degree</span>
                                        </div>
                                        <div className="degree-card-body">
                                            <h3 className="degree-card-title">{deg.name}</h3>
                                            <div className="degree-card-stats">
                                                <span>📅 {deg.semesters.size} Semesters</span>
                                                <span>📖 {totalCount} Subjects</span>
                                            </div>
                                        </div>
                                        <div className="degree-card-footer">
                                            <span className="degree-card-action">Browse Subjects</span>
                                            <div className="degree-card-arrow-container">
                                                <svg className="degree-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── STANDALONE COURSES ── */}
                {courses.length > 0 && (
                    <section>
                        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🧑‍💻 Courses
                        </h2>
                        <div className="subjects-grid">
                            {courses.map(course => (
                                <SubjectCard
                                    key={`${course.owner}-${course.repo}`}
                                    href={`/notes/${course.repo}`}
                                    backHref="/notes"
                                    subject={{
                                        ...course,
                                        badgeLabel: course.progress === 'progress' ? '🚧 In Progress' : '✅ Complete',
                                        ctaLabel: 'View Notes',
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
