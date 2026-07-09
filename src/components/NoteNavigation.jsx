import Link from 'next/link';

export default function NoteNavigation({ previousHref, nextHref, position = 'top' }) {
    if (!previousHref && !nextHref) {
        return null;
    }

    return (
        <div className={`note-nav ${position === 'bottom' ? 'note-nav-bottom' : ''}`}>
            {previousHref ? (
                <Link href={previousHref} className="btn note-nav-btn" style={{ textDecoration: 'none' }}>
                    ← Previous
                </Link>
            ) : (
                <span />
            )}
            {nextHref ? (
                <Link href={nextHref} className="btn note-nav-btn" style={{ textDecoration: 'none' }}>
                    Next →
                </Link>
            ) : (
                <span />
            )}
        </div>
    );
}
