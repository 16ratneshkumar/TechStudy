'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter({ slug }) {
    const [views, setViews] = useState(null);

    useEffect(() => {
        // Track whether this specific note has been viewed in this session.
        // Both sessionStorage accesses are guarded: SecurityError (thrown in
        // restricted browsing contexts such as sandboxed iframes or strict
        // incognito modes) is caught so it never escapes the effect.
        const sessionKey = `viewed_${slug}`;

        let alreadyViewed = false;
        try {
            alreadyViewed = !!sessionStorage.getItem(sessionKey);
        } catch {
            // Storage unavailable — treat as not-yet-viewed and proceed.
        }
        if (alreadyViewed) return;

        const registerView = async () => {
            try {
                const res = await fetch('/api/views', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setViews(data.views);
                    try {
                        sessionStorage.setItem(sessionKey, 'true');
                    } catch {
                        // Storage unavailable — view count is still displayed;
                        // the session dedup guard simply won't persist.
                    }
                }
            } catch (error) {
                console.error('Failed to register view:', error);
            }
        };

        registerView();
    }, [slug]);

    if (views === null) return null;

    return (
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {views.toLocaleString()} views
        </span>
    );
}
