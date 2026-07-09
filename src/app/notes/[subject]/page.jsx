import SubjectNotesPage from '@/views/SubjectNotesPage';
import repositoriesConfig from '@/data/repositories.json';

export const revalidate = 86400; // 24 hours ISR

export async function generateStaticParams() {
    const subjects = repositoriesConfig.subjects || [];
    const completeSubjects = subjects.filter(s => s.progress !== 'progress');
    
    return completeSubjects.map((subject) => ({
        subject: subject.repo,
    }));
}

export async function generateMetadata({ params }) {
    const { subject } = await params;
    const subjects = repositoriesConfig.subjects || [];
    const matchedSubject = subjects.find(s => s.repo.toLowerCase() === subject.toLowerCase());
    
    return {
        title: matchedSubject ? `${matchedSubject.repo.replace(/-/g, ' ')} Notes - TechStudy` : 'TechStudy Notes',
        description: matchedSubject?.description || `Explore computer science notes for ${subject}.`,
        openGraph: {
            title: matchedSubject ? `${matchedSubject.repo.replace(/-/g, ' ')} Notes` : 'TechStudy Notes',
            description: matchedSubject?.description || `Explore computer science notes for ${subject}.`,
            type: 'website',
            images: [
                {
                    url: `/api/og?title=${encodeURIComponent(matchedSubject ? matchedSubject.repo.replace(/-/g, ' ') : subject)}&desc=${encodeURIComponent(matchedSubject?.description || `Explore computer science notes for ${subject}`)}`,
                    width: 1200,
                    height: 630,
                    alt: matchedSubject ? `${matchedSubject.repo.replace(/-/g, ' ')} Preview` : 'Preview',
                },
            ],
        },
    };
}

export default SubjectNotesPage;
