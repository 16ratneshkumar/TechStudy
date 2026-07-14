'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter({ slug }) {
    const [views, setViews] = useState(null);

    useEffect(() => {
        const sessionKey = `viewed_${slug}`;

        let alreadyViewed = false;
        try {
            alreadyViewed = !!sessionStorage.getItem(sessionKey);
        } catch (err) {
            // ignore
        }

        const fetchViews = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 3000);

            try {
                let res;
                if (alreadyViewed) {
                    res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`, { signal: controller.signal });
                } else {
                    res = await fetch('/api/views', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slug }),
                        signal: controller.signal
                    });
                }
                
                if (res.ok) {
                    const data = await res.json();
                    setViews(data.views);
                    if (!alreadyViewed) {
                        try {
                            sessionStorage.setItem(sessionKey, 'true');
                        } catch (err) {
                            // ignore
                        }
                    }
                } else {
                    setViews('error');
                }
                clearTimeout(timeoutId);
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('Failed to fetch/register view:', error);
                setViews('error');
            }
        };

        fetchViews();
    }, [slug]);

    if (views === null) {
        return (
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="spinner" style={{ width: '12px', height: '12px', border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                Loading views...
            </span>
        );
    }

    if (views === 'error') {
        return (
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Views N/A
            </span>
        );
    }

    return (
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {views.toLocaleString()} views
        </span>
    );
}
