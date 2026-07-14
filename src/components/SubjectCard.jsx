'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubjectCard({ subject, href, backHref }) {
    const router = useRouter();
    const tags = subject.tags || [];

    const target = (href && backHref) ? `${href}${href.includes('?') ? '&' : '?'}back=${encodeURIComponent(backHref)}` : href;

    const handleTagClick = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/tags/${encodeURIComponent(tag)}`);
    };

    const cardContent = (
        <>
            <div className="subject-card-glow"></div>

            {subject.isNew && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '-32px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '4px 32px',
                    transform: 'rotate(45deg)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 10
                }}>
                    NEW NOTES
                </div>
            )}

            {/* Animated Glare Effect */}
            <div className="subject-card-glare"></div>

            {/* Glowing Ambient Orbs */}
            <div className="subject-card-orb subject-card-orb-1"></div>
            <div className="subject-card-orb subject-card-orb-2"></div>

            {/* Decorative Dotted Pattern */}
            <div className="subject-card-pattern"></div>

            <div className="subject-header">
                <div className="subject-icon-container">
                    {subject.icon || '📚'}
                </div>
                <div className="subject-badge">
                    {subject.badgeLabel || (subject.type === 'practical' ? 'Practical' : 'Subject')}
                </div>
            </div>

            <div className="subject-body">
                <h3 className="subject-name">{subject.name?.replace(/-/g, ' ')}</h3>
                <p className="subject-description">
                    {subject.description || 'Explore curated notes, code examples, and study materials for this topic.'}
                </p>
            </div>

            <div className="subject-footer">
                <span className="study-action">{subject.ctaLabel || 'Start Learning'}</span>
                <div className="subject-card-arrow-container">
                    <svg className="subject-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </div>
            </div>
        </>
    );

    const tagButtons = tags.length > 0 && (
        <div className="subject-tags" style={{ position: 'absolute', bottom: '60px', left: '1rem', right: '1rem', zIndex: 20 }}>
            {tags.slice(0, 3).map(tag => (
                <button
                    key={tag}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="tag-badge"
                    style={{ border: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.08)', position: 'relative', zIndex: 20 }}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );

    if (!href) {
        return (
            <div className="subject-card" style={{ position: 'relative', overflow: 'hidden' }}>
                {cardContent}
                {tagButtons}
            </div>
        );
    }

    return (
        <div className="subject-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <Link href={target} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                {cardContent}
            </Link>
            {tagButtons}
        </div>
    );
}
