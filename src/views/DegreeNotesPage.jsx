import SubjectCard from '@/components/SubjectCard';
import BackButton from '@/components/BackButton';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';

export default async function DegreeNotesPage({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const subjects = repositoriesConfig.subjects || [];

    // Find the matching degree name (case-insensitive slug match)
    const allDegrees = [...new Set(subjects.filter(s => s.type === 'subject').map(s => s.degree))];
    const degree = allDegrees.find(d =>
        d.toLowerCase().replace(/\s+/g, '-') === decodedSlug
    );

    if (!degree) {
        return (
            <main className="main-content">
                <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                    <h1>Degree not found</h1>
                    <Link href="/notes" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>← Back to Notes</Link>
                </div>
            </main>
        );
    }

    const degreeSubjects = subjects.filter(s => s.type === 'subject' && s.degree === degree);

    // Group by semester
    const grouped = degreeSubjects.reduce((acc, subject) => {
        const sem = subject.semester || 'Other';
        if (!acc[sem]) acc[sem] = [];
        acc[sem].push(subject);
        return acc;
    }, {});

    const sortedSemesters = Object.keys(grouped).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>

                {/* Breadcrumb */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <BackButton
                        fallbackHref="/notes"
                        className="btn"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}
                    >
                        ← Back to Courses
                    </BackButton>
                </div>

                {/* Degree Hero */}
                <div className="degree-hero">
                    <div className="degree-hero-icon">🎓</div>
                    <div>
                        <h1 className="degree-hero-title">{degree}</h1>
                        <p className="degree-hero-meta">
                            {degreeSubjects.length} subjects &nbsp;·&nbsp; {sortedSemesters.length} semesters
                        </p>
                    </div>
                </div>

                {/* Semester sections */}
                {sortedSemesters.map(semester => (
                    <div key={semester} className="semester-section">
                        <div className="semester-header">
                            <span className="semester-badge">📅 {semester}</span>
                            <span className="semester-count">{grouped[semester].length} subjects</span>
                        </div>
                        <div className="subjects-grid">
                            {grouped[semester].map(subject => (
                                <SubjectCard
                                    key={`${subject.owner}-${subject.repo}`}
                                    href={`/notes/${encodeURIComponent(subject.repo)}`}
                                    backHref={`/notes/degree/${slug}`}
                                    subject={{
                                        ...subject,
                                        badgeLabel: subject.progress === 'progress' ? '🚧 In Progress' : '✅ Complete',
                                        ctaLabel: 'View Notes',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
