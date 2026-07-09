import NoteContentPage from '@/views/NoteContentPage';

export const dynamicParams = true;
export const revalidate = 86400; // 24 hours ISR

export async function generateMetadata({ params }) {
    const { subject, path } = await params;
    const fileName = path[path.length - 1];
    const repo_display = subject.replace(/-/g, ' ');
    const cleanFileName = fileName.replace(/\.(md|txt|py|cpp|c|sh|js|ts)$/i, '');
    const title = `${cleanFileName} - ${repo_display}`;
    const desc = `Study ${cleanFileName} notes from ${repo_display} on TechStudy.`;
    
    return {
        title,
        description: desc,
        openGraph: {
            title,
            description: desc,
            type: 'article',
            images: [
                {
                    url: `/api/og?title=${encodeURIComponent(cleanFileName)}&desc=${encodeURIComponent(desc)}`,
                    width: 1200,
                    height: 630,
                    alt: `${cleanFileName} Preview`,
                },
            ],
        },
    };
}

export default NoteContentPage;
