import { fetchNotes } from '@/lib/github/api';
import NoteCard from '@/components/NoteCard';
import FolderCard from '@/components/FolderCard';
import BackButton from '@/components/BackButton';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * Renders the notes page for a subject or course.
 * @param {{ params: Promise<{ subject: string }>, searchParams: Promise<{ back?: string }> }} props - Route and query parameters.
 * @returns {Promise<JSX.Element>} The subject notes page.
 * @throws {Error} If notes cannot be loaded from the repository.
 */
export default async function SubjectNotesPage({ params, searchParams }) {
    const { subject: subjectParam } = await params;
    const resolvedSearchParams = await searchParams;
    const subjects = repositoriesConfig.subjects || [];
    const courses = repositoriesConfig.courses || [];

    const subject = subjects.find(s => s.repo.toLowerCase() === subjectParam.toLowerCase())
        || courses.find(c => c.repo.toLowerCase() === subjectParam.toLowerCase());

    if (!subject) {
        notFound();
    }

    const { owner, repo } = subject;

    const degreeBackPath = subject?.type === 'subject' && subject.degree
        ? `/notes/degree/${encodeURIComponent(subject.degree.toLowerCase().replace(/\s+/g, '-'))}`
        : null;
    const backPath = degreeBackPath || (typeof resolvedSearchParams?.back === 'string' && resolvedSearchParams.back ? resolvedSearchParams.back : '/notes');
    const noteBackPath = `/notes/${subjectParam}`;
    const encodePathForUrl = (value = '') => value.split('/').map(encodeURIComponent).join('/');

    if (subject.progress === 'progress') {
        return (
            <main className="main-content">
                <div className="status-page-wrapper">
                    <div className="status-page-card">
                        <div className="status-page-glow"></div>
                        <div className="status-icon">🚧</div>
                        <h1 className="status-title">Under Development</h1>
                        <p className="status-desc">
                            Notes for <strong>{subject.name || repo}</strong> are currently being written. Check back later!
                        </p>
                        <div className="status-actions">
                            <BackButton fallbackHref={null} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                ← Back
                            </BackButton>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    let notes = [];

    try {
        notes = await fetchNotes(owner, repo, '');
    } catch (e) {
        if (e.message && e.message.includes('404')) {
            notFound();
        }
        throw new Error(`Failed to load notes for ${subject.name}. The repository might be unavailable or private.`);
    }

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={backPath} className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>

                <div className="degree-hero">
                    <div className="degree-hero-icon">{subject?.icon || '📄'}</div>
                    <div>
                        <h1 className="degree-hero-title">{subject ? subject.name.replace(/-/g, ' ') : repo}</h1>
                        {subject && subject.description && (
                            <p className="degree-hero-meta">{subject.description}</p>
                        )}
                    </div>
                </div>

                {notes.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📂</span>
                        <p>No notes found</p>
                    </div>
                ) : (
                    <>
                        {notes.filter(n => n.type === 'dir').length > 0 && (
                            <>
                                <div className="semester-header" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                                    <span className="semester-badge">📁 Folders</span>
                                </div>
                                <div className="folders-grid" style={{ marginBottom: '2rem' }}>
                                    {notes.filter(n => n.type === 'dir').map(folder => (
                                        <FolderCard
                                            key={folder.sha}
                                            folder={folder}
                                            href={`/notes/${encodeURIComponent(subjectParam)}/${encodePathForUrl(folder.path)}?back=${encodeURIComponent(noteBackPath)}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        
                        {notes.filter(n => n.type !== 'dir').length > 0 && (
                            <>
                                <div className="semester-header" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                                    <span className="semester-badge">📄 Files</span>
                                </div>
                                <div className="notes-list">
                                    {notes.filter(n => n.type !== 'dir').map(file => (
                                        <Link
                                            key={file.sha}
                                            href={`/notes/${encodeURIComponent(subjectParam)}/${encodePathForUrl(file.path)}?back=${encodeURIComponent(noteBackPath)}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <NoteCard note={file} />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
