'use client';
import { useRouter } from 'next/navigation';

export default function FolderCard({ folder, href, backHref }) {
    const router = useRouter();

    const handleCardClick = () => {
        if (!href) return;
        const target = backHref ? `${href}${href.includes('?') ? '&' : '?'}back=${encodeURIComponent(backHref)}` : href;
        router.push(target);
    };

    return (
        <div
            className="folder-card"
            onClick={handleCardClick}
        >
            {/* Animated Glare Effect */}
            <div className="folder-card-glare"></div>
            
            {/* Glowing Ambient Orbs */}
            <div className="folder-card-orb folder-card-orb-1"></div>
            <div className="folder-card-orb folder-card-orb-2"></div>

            {/* Decorative Dotted Pattern */}
            <div className="folder-card-pattern"></div>

            {/* Giant decorative background folder shape */}
            <div className="folder-card-bg-icon" aria-hidden="true">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
                </svg>
            </div>

            {/* Header row */}
            <div className="folder-card-top">
                <div className="folder-card-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
                    </svg>
                </div>
                <span className="folder-card-badge">Collection</span>
            </div>

            {/* Name */}
            <div className="folder-card-body">
                <h3 className="folder-card-name">
                    {folder.name.replace(/[-_]/g, ' ')}
                </h3>
            </div>

            {/* Footer */}
            <div className="folder-card-footer">
                <span className="folder-card-cta">Explore Folder</span>
                <div className="folder-card-arrow-container">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
