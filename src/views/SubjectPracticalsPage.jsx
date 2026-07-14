import { fetchNotes } from '@/lib/github/api';
import NoteCard from '@/components/NoteCard';
import FolderCard from '@/components/FolderCard';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * Renders a practical detail page with its folders and files.
 * @param {Object} params - Dynamic route parameters containing the practical repository identifier.
 * @return {JSX.Element} The practical detail page.
 */
export default async function SubjectPracticalsPage({ params }) {
    const { practical: practicalParam } = await params;
    const encodePathForUrl = (value = '') => value.split('/').map(encodeURIComponent).join('/');
    const practicals = repositoriesConfig.practicals || [];
    const practical = practicals.find(s => s.repo.toLowerCase() === practicalParam.toLowerCase());

    if (!practical) {
        notFound();
    }

    const { owner, repo } = practical;

    let notes = [];
    let error = null;

    try {
        notes = await fetchNotes(owner, repo, '');
    } catch (e) {
        error = "Failed to load practicals.";
    }

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/practicals" className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Practicals
                    </Link>
                </div>

                <div className="degree-hero">
                    <div className="degree-hero-icon">{practical?.icon || '💻'}</div>
                    <div>
                        <h1 className="degree-hero-title">{practical ? practical.name.replace(/-/g, ' ') : repo}</h1>
                        {practical && practical.description && (
                            <p className="degree-hero-meta">{practical.description}</p>
                        )}
                    </div>
                </div>

                {error ? (
                    <div className="error-message">{error}</div>
                ) : notes.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🔬</span>
                        <p>No practicals found</p>
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
                                            href={`/practicals/${encodeURIComponent(practicalParam)}/${encodePathForUrl(folder.path)}`}
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
                                            href={`/practicals/${encodeURIComponent(practicalParam)}/${encodePathForUrl(file.path)}`}
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
