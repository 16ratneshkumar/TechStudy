import { fetchNotes, fetchFileContent } from '@/lib/github/api';
import NoteCard from '@/components/NoteCard';
import FolderCard from '@/components/FolderCard';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import ExcelViewer from '@/components/ExcelViewer';
import NoteNavigation from '@/components/NoteNavigation';
import SwipeNavigator from '@/components/SwipeNavigator';
import ViewCounter from '@/components/ViewCounter';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/markdown/renderer';

export default async function NoteContentPage({ params, searchParams }) {
    const { subject: subjectParam, path: encodedPathArray } = await params;
    const path = encodedPathArray.map(decodeURIComponent);
    const itemPath = path.join('/');
    const backPath = typeof searchParams?.back === 'string' && searchParams.back ? searchParams.back : `/notes/${subjectParam}`;

    const courses = repositoriesConfig.courses || [];
    const subjects = repositoriesConfig.subjects || [];
    const subject = subjects.find(s => s.repo.toLowerCase() === subjectParam.toLowerCase()) || courses.find(c => c.repo.toLowerCase() === subjectParam.toLowerCase());

    if (!subject) {
        notFound();
    }
    
    const { owner, repo } = subject;

    const siblingItems = await fetchNotes(owner, repo, path.length > 1 ? path.slice(0, -1).join('/') : '');
    const currentIndex = siblingItems.findIndex(note => note.path === itemPath || note.name === path[path.length - 1]);
    const previousItem = currentIndex > 0 ? siblingItems[currentIndex - 1] : null;
    const nextItem = currentIndex >= 0 && currentIndex < siblingItems.length - 1 ? siblingItems[currentIndex + 1] : null;
    const previousHref = previousItem ? `/notes/${subjectParam}/${path.slice(0, -1).join('/')}${path.length > 1 ? '/' : ''}${previousItem.name}?back=${encodeURIComponent(backPath)}` : null;
    const nextHref = nextItem ? `/notes/${subjectParam}/${path.slice(0, -1).join('/')}${path.length > 1 ? '/' : ''}${nextItem.name}?back=${encodeURIComponent(backPath)}` : null;

    if (subject.progress === 'progress') {
        return (
             <main className="main-content">
                <div className="status-page-wrapper">
                    <div className="status-page-card">
                        <div className="status-page-glow"></div>
                        <div className="status-icon">🚧</div>
                        <h1 className="status-title">Under Development</h1>
                        <p className="status-desc">
                            The content for <strong>{path[path.length - 1]}</strong> is currently being written. Check back later!
                        </p>
                        <div className="status-actions">
                            <Link href={backPath} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    let isFolder = false;
    let isExcel = false;
    let items = [];
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
        } else if (name.endsWith('.pdf')) {
            const encodedItemPath = itemPath.split('/').map(encodeURIComponent).join('/');
            const rawFileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${encodedItemPath}`;
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(rawFileUrl)}&embedded=true`;

            htmlContent = `
            <div style="display:flex; justify-content:flex-end; margin-bottom:1rem;">
                <a href="${rawFileUrl}" download target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Download PDF
                </a>
            </div>
            <div class="pdf-container" style="height:80vh;">
                <iframe src="${viewerUrl}"
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
    } catch (e) {
        console.error('NoteContentPage error:', e);
        if (e.message && (e.message.includes('404') || e.message.includes('Not Found'))) {
            notFound();
        }
        throw new Error(`Failed to load content: ${e.message}`);
    }

    if (!isFolder && !isExcel && !htmlContent && !name.endsWith('.pdf') && !name.endsWith('.png') && !name.endsWith('.jpg') && !name.endsWith('.jpeg') && !name.endsWith('.gif') && !name.endsWith('.webp')) {
        notFound();
    }

    // TOC only makes sense for text/markdown content (not PDFs, images, or Excel)
    const isPdf = name.endsWith('.pdf');
    const isImage = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp');
    const hasTextContent = !isFolder && !isExcel && !isPdf && !isImage;

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <Link href={backPath} className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Link>
                        <h1 style={{ wordBreak: 'break-word', margin: 0 }}>{path[path.length - 1].replace(/\.(md|txt|py|cpp|c|sh|js|ts)$/i, '')}</h1>
                    </div>
                    {!isFolder && <ViewCounter slug={itemPath} />}
                </div>

                {isFolder ? (
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
                                            href={`/notes/${subjectParam}/${itemPath}/${folder.name}`}
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
                                            href={`/notes/${subjectParam}/${itemPath}/${file.name}`}
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
                    <SwipeNavigator previousHref={previousHref} nextHref={nextHref}>
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="top" />
                        <ExcelViewer owner={owner} repo={repo} filePath={itemPath} />
                        <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="bottom" />
                    </SwipeNavigator>
                ) : (
                    <SwipeNavigator previousHref={previousHref} nextHref={nextHref}>
                        <div className="note-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="top" />
                                <MarkdownContent html={htmlContent} />
                                <NoteNavigation previousHref={previousHref} nextHref={nextHref} position="bottom" />
                            </div>
                            {hasTextContent && (
                                <div className="toc-container">
                                    <TableOfContents html={htmlContent} />
                                </div>
                            )}
                        </div>
                    </SwipeNavigator>
                )}
            </div>
        </main>
    );
}
