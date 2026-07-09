import { fetchNotes, fetchFileContent } from '@/lib/github/api';
import NoteCard from '@/components/NoteCard';
import FolderCard from '@/components/FolderCard';
import MarkdownContent from '@/components/MarkdownContent';
import ExcelViewer from '@/components/ExcelViewer';
import NoteNavigation from '@/components/NoteNavigation';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';
import { renderMarkdown } from '@/lib/markdown/renderer';
import { notFound } from 'next/navigation';

export default async function PracticalContentPage({ params }) {
    const { practical: practicalParam, path: encodedPathArray } = await params;
    const path = encodedPathArray.map(decodeURIComponent);
    const itemPath = path.join('/');

    const practicals = repositoriesConfig.practicals || [];
    const practical = practicals.find(s => s.repo.toLowerCase() === practicalParam.toLowerCase());

    if (!practical) {
        notFound();
    }

    const { owner, repo } = practical;

    let isFolder = false;
    let isExcel = false;
    let items = [];
    let error = null;
    let htmlContent = '';

    const name = path[path.length - 1].toLowerCase();

    try {
        if (!name.includes('.')) {
            try {
                items = await fetchNotes(owner, repo, itemPath);
                if (items.length > 0) isFolder = true;
            } catch (e) {
                // fallback
            }
        }

        if (!isFolder) {
            if (name.endsWith('.pdf')) {
                htmlContent = `<div class="pdf-container" style="height:80vh;">
                    <iframe src="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/${owner}/${repo}/main/${itemPath}&embedded=true"
                        style="width:100%;height:100%;border:none;"></iframe>
                </div>`;
            } else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp')) {
                htmlContent = `<div style="display:flex;justify-content:center;padding:2rem;">
                    <img src="https://raw.githubusercontent.com/${owner}/${repo}/main/${itemPath}"
                        alt="${name}" style="max-width:100%;height:auto;border-radius:8px;" />
                </div>`;
            } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
                isExcel = true;
            } else {
                const fileContent = await fetchFileContent(owner, repo, itemPath);
                if (name.endsWith('.py')) htmlContent = renderMarkdown(`\`\`\`python\n${fileContent}\n\`\`\``);
                else if (name.endsWith('.cpp')) htmlContent = renderMarkdown(`\`\`\`cpp\n${fileContent}\n\`\`\``);
                else if (name.endsWith('.c')) htmlContent = renderMarkdown(`\`\`\`c\n${fileContent}\n\`\`\``);
                else if (name.endsWith('.sh')) htmlContent = renderMarkdown(`\`\`\`bash\n${fileContent}\n\`\`\``);
                else if (name.endsWith('.js') || name.endsWith('.ts')) htmlContent = renderMarkdown(`\`\`\`javascript\n${fileContent}\n\`\`\``);
                else htmlContent = renderMarkdown(fileContent);
            }
        }
    } catch (e) {
        error = 'Failed to load content. The file may be unavailable or private.';
    }

    const parentPath = path.length > 1
        ? `/practicals/${practicalParam}/${path.slice(0, -1).join('/')}`
        : `/practicals/${practicalParam}`;
    const siblingItems = await fetchNotes(owner, repo, path.length > 1 ? path.slice(0, -1).join('/') : '');
    const currentIndex = siblingItems.findIndex(note => note.path === itemPath || note.name === path[path.length - 1]);
    const previousItem = currentIndex > 0 ? siblingItems[currentIndex - 1] : null;
    const nextItem = currentIndex >= 0 && currentIndex < siblingItems.length - 1 ? siblingItems[currentIndex + 1] : null;
    const previousHref = previousItem ? `/practicals/${practicalParam}/${path.slice(0, -1).join('/')}${path.length > 1 ? '/' : ''}${previousItem.name}` : null;
    const nextHref = nextItem ? `/practicals/${practicalParam}/${path.slice(0, -1).join('/')}${path.length > 1 ? '/' : ''}${nextItem.name}` : null;

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                    <Link href={parentPath} className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                    <h1 style={{ wordBreak: 'break-word' }}>{path[path.length - 1].replace(/\.(md|txt|py|cpp|c|sh|js|ts)$/i, '')}</h1>
                </div>

                {error ? (
                    <div className="error-message">{error}</div>
                ) : isFolder ? (
                    <>
                        {items.filter(n => n.type === 'dir').length > 0 && (
                            <>
                                <div className="semester-header" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                                    <span className="semester-badge">📁 Folders</span>
                                </div>
                                <div className="folders-grid" style={{ marginBottom: '2rem' }}>
                                    {items.filter(n => n.type === 'dir').map(folder => (
                                        <FolderCard
                                            key={folder.sha}
                                            folder={folder}
                                            href={`/practicals/${practicalParam}/${itemPath}/${folder.name}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        {items.filter(n => n.type !== 'dir').length > 0 && (
                            <>
                                <div className="semester-header" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                                    <span className="semester-badge">📄 Files</span>
                                </div>
                                <div className="notes-list">
                                    {items.filter(n => n.type !== 'dir').map(file => (
                                        <Link
                                            key={file.sha}
                                            href={`/practicals/${practicalParam}/${itemPath}/${file.name}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <NoteCard note={file} />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : isExcel ? (
                    <>
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="top" />
                        <ExcelViewer owner={owner} repo={repo} filePath={itemPath} />
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="bottom" />
                    </>
                ) : (
                    <>
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="top" />
                        <MarkdownContent html={htmlContent} />
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="bottom" />
                    </>
                )}
            </div>
        </main>
    );
}

