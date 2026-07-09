import PracticalContentPage from '@/views/PracticalContentPage';

export const dynamicParams = true;

export async function generateMetadata({ params }) {
    const { practical, path } = await params;
    const fileName = path[path.length - 1];
    const repo_display = practical.replace(/-/g, ' ');
    return {
        description: `View ${fileName} practical in ${repo_display} on TechStudy.`,
    };
}

export default PracticalContentPage;
