import repositoriesConfig from '@/data/repositories.json';
import { fetchRepositoryTree } from '@/lib/github/api';

export const revalidate = 86400; // Rebuild sitemap at most once per day

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstudy.local';
    
    // Static routes
    const routes = [
        '',
        '/notes',
        '/practicals',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    const subjects = repositoriesConfig.subjects || [];
    const completeSubjects = subjects.filter(s => s.progress !== 'progress');
    
    // Subject Root pages
    const subjectRoutes = completeSubjects.map((subject) => ({
        url: `${baseUrl}/notes/${subject.repo}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Tag pages
    const all = [...(repositoriesConfig.subjects || []), ...(repositoriesConfig.practicals || [])];
    const tagSet = new Set();
    all.forEach(item => (item.tags || []).forEach(tag => tagSet.add(tag)));
    const tagRoutes = [...tagSet].map(tag => ({
        url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // Fetch individual file notes, 5 subjects at a time to avoid GitHub rate limits
    const noteRoutes = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < completeSubjects.length; i += BATCH_SIZE) {
        const batch = completeSubjects.slice(i, i + BATCH_SIZE);
        await Promise.all(
            batch.map(async (subject) => {
                const files = await fetchRepositoryTree(subject.owner, subject.repo);
                files.forEach(file => {
                    const pathParts = file.path.split('/');
                    const encodedPath = pathParts.map(encodeURIComponent).join('/');
                    noteRoutes.push({
                        url: `${baseUrl}/notes/${subject.repo}/${encodedPath}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.5,
                    });
                });
            })
        );
    }

    return [...routes, ...subjectRoutes, ...tagRoutes, ...noteRoutes];
}
