import SubjectPracticalsPage from '@/views/SubjectPracticalsPage';
import repositoriesConfig from '@/data/repositories.json';

export async function generateStaticParams() {
    const practicals = repositoriesConfig.practicals || [];
    const completePracticals = practicals.filter(s => s.progress !== 'progress');
    
    return completePracticals.map((practical) => ({
        practical: practical.repo,
    }));
}

export async function generateMetadata({ params }) {
    const { practical } = await params;
    const practicals = repositoriesConfig.practicals || [];
    const matchedPractical = practicals.find(s => s.repo.toLowerCase() === practical.toLowerCase());
    
    return {
        description: matchedPractical?.description || `Explore practicals for ${practical}.`,
    };
}

export default SubjectPracticalsPage;
