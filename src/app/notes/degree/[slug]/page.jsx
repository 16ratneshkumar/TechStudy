import DegreeNotesPage from '@/views/DegreeNotesPage';
import repositoriesConfig from '@/data/repositories.json';

export async function generateStaticParams() {
    const subjects = repositoriesConfig.subjects || [];
    const degrees = [...new Set(subjects.filter(s => s.type === 'subject').map(s => s.degree))];
    return degrees.map(degree => ({
        slug: encodeURIComponent(degree.toLowerCase().replace(/\s+/g, '-'))
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const degreeName = decodeURIComponent(slug).replace(/-/g, ' ');
    return {
        description: `Browse all semesters and subjects for ${degreeName}.`,
    };
}

export default DegreeNotesPage;
