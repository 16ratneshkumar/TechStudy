'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const allItems = [];

export default function SearchBar({ subjects, practicals }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const router = useRouter();

    const allData = [...(subjects || []), ...(practicals || [])];

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const filtered = allData.filter(item =>
            item.name.toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.tags || []).some(t => t.toLowerCase().includes(q))
        ).slice(0, 8);
        setResults(filtered);
        setOpen(true);
    }, [query]);

    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleSelect(item) {
        const href = item.type === 'practical'
            ? `/practicals/${item.repo}`
            : `/notes/${item.repo}`;
        setQuery('');
        setOpen(false);
        router.push(href);
    }

    return (
        <div ref={containerRef} className="search-wrapper" style={{ position: 'relative' }}>
            <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--input-bg, rgba(255,255,255,0.08))', borderRadius: '8px', padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5, flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    ref={inputRef}
                    type="search"
                    placeholder="Search notes..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query && setOpen(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-color)',
                        fontSize: '0.875rem',
                        width: '180px',
                    }}
                />
                {query && (
                    <button onClick={() => { setQuery(''); setOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', opacity: 0.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {open && results.length > 0 && (
                <div className="search-dropdown" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    overflow: 'hidden',
                }}>
                    {results.map(item => (
                        <button
                            key={`${item.owner}-${item.repo}`}
                            onClick={() => handleSelect(item)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'var(--text-color)',
                            }}
                        >
                            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon || '📄'}</span>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                {item.semester && item.semester !== 'NA' && (
                                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{item.semester}</div>
                                )}
                            </div>
                            <span style={{
                                marginLeft: 'auto',
                                fontSize: '0.7rem',
                                background: 'var(--primary-color)',
                                color: '#fff',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                flexShrink: 0,
                            }}>
                                {item.type === 'practical' ? 'Lab' : 'Notes'}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {open && query && results.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '280px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                    opacity: 0.7,
                    fontSize: '0.875rem',
                    zIndex: 9999,
                }}>
                    No results for "{query}"
                </div>
            )}
        </div>
    );
}
