'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ html }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    // Parse headings from HTML string using Regex (highly reliable and browser-independent)
    useEffect(() => {
        if (!html) {
            setHeadings([]);
            return;
        }

        // Simpler regex that supports newlines and does not use backreferences
        const headingRegex = /<h([1-4])\b[^>]*>([\s\S]*?)<\/h[1-4]>/gi;
        const parsed = [];
        let match;
        let index = 0;

        try {
            while ((match = headingRegex.exec(html)) !== null) {
                const level = parseInt(match[1], 10);
                const rawText = match[2].replace(/<[^>]*>/g, '');
                const text = rawText
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'");

                parsed.push({
                    id: `toc-heading-${index}`,
                    text: text.trim(),
                    level
                });
                index++;
            }
        } catch (e) {
            console.error('Regex parse error:', e);
        }

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

    if (headings.length === 0) {
        return (
            <aside className="toc-sidebar" style={{ opacity: 0.5 }}>
                <div className="toc-header">
                    <span>Course Outline</span>
                </div>
                <div style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>No headings found</div>
            </aside>
        );
    }

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
