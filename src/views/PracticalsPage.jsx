import SubjectCard from '@/components/SubjectCard';
import repositoriesConfig from '@/data/repositories.json';
import Link from 'next/link';

const normalizeRepositoryProgress = (repoList) => {
    return repoList.map((repo) => ({
        ...repo,
        progress: repo.progress || 'complete'
    }));
};

export default function PracticalsPage() {
    const practicals = normalizeRepositoryProgress(repositoriesConfig.practicals || []);
    const completePracticals = practicals.filter(p => p.progress !== 'progress');

    return (
        <main className="main-content">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>🔬 Browse Practicals</h1>

                <div className="subjects-grid">
                    {completePracticals.map(practical => {
                        const owner = practical.owner;
                        const repo = practical.repo;
                        return (
                            <SubjectCard
                                key={`${owner}-${repo}`}
                                href={`/practicals/${repo}`}
                                subject={{
                                    ...practical,
                                    badgeLabel: 'Practical',
                                    ctaLabel: 'View Practicals',
                                    description: practical.description || 'Explore lab assignments, practical implementations, and hands-on experiments.',
                                    tags: practical.tags || []
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
