import TagPage from '@/views/TagPage';
import repositoriesConfig from '@/data/repositories.json';

export async function generateStaticParams() {
    const all = [...(repositoriesConfig.subjects || []), ...(repositoriesConfig.practicals || [])];
    const tagSet = new Set();
    all.forEach(item => (item.tags || []).forEach(tag => tagSet.add(tag)));
    return [...tagSet].map(tag => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }) {
    const { tag } = await params;
    const decoded = decodeURIComponent(tag);
    return {
        description: `Browse all TechStudy subjects and practicals tagged with "${decoded}".`,
    };
}

export default TagPage;
