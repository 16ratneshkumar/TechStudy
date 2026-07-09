'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ html }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    // Parse headings from HTML string
    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const els = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));
        const parsed = els.map((el, i) => {
            const id = el.id || `toc-heading-${i}`;
            return { id, text: el.textContent.trim(), level: parseInt(el.tagName[1]) };
        });
        setHeadings(parsed);
    }, [html]);

    // Inject IDs into real DOM headings after mount
    useEffect(() => {
        const noteContent = document.querySelector('.note-content');
        if (!noteContent) return;
        const domHeadings = noteContent.querySelectorAll('h1, h2, h3, h4');
        domHeadings.forEach((el, i) => {
            if (!el.id) el.id = `toc-heading-${i}`;
        });
    }, [html]);

    // Highlight active heading on scroll
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    const handleClick = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <aside className="toc-sidebar">
            <div className="toc-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M4 6h16M4 12h10M4 18h6" />
                </svg>
                <span>On this page</span>
            </div>
            <nav className="toc-nav">
                {headings.map(({ id, text, level }) => (
                    <button
                        key={id}
                        className={`toc-item toc-level-${level} ${activeId === id ? 'active' : ''}`}
                        onClick={() => handleClick(id)}
                        title={text}
                    >
                        {text}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
