'use client';
import { useEffect, useState } from 'react';

export default function ExcelViewer({ owner, repo, filePath }) {
    const [rows, setRows] = useState(null);
    const [headers, setHeaders] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSheet, setActiveSheet] = useState(0);
    const [sheets, setSheets] = useState([]);

    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
    const githubUrl = `https://github.com/${owner}/${repo}/blob/main/${filePath}`;

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                // Dynamically import SheetJS — browser only
                const XLSX = await import('xlsx');

                const response = await fetch(rawUrl);
                if (!response.ok) throw new Error(`Failed to fetch file (${response.status})`);

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                const sheetNames = workbook.SheetNames;
                setSheets(sheetNames);

                // Parse all sheets, default to first
                const allSheets = sheetNames.map(name => {
                    const ws = workbook.Sheets[name];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
                    return data;
                });

                setRows(allSheets);
                setActiveSheet(0);
            } catch (err) {
                console.error('ExcelViewer error:', err);
                setError(err.message || 'Failed to load spreadsheet');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [rawUrl]);

    const fileName = filePath.split('/').pop();

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem' }}>
                <div className="spinner" />
                <p style={{ color: 'var(--color-text-muted)' }}>Loading spreadsheet…</p>
            </div>
        );
    }

    const ActionButtons = () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href={rawUrl} download className="btn"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
            </a>
        </div>
    );

    if (error) {
        return (
            <div>
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
                </div>
                <ActionButtons />
            </div>
        );
    }

    const currentData = rows?.[activeSheet] || [];
    const headerRow = currentData[0] || [];
    const dataRows = currentData.slice(1);

    if (!currentData.length || !headerRow.length) {
        return (
            <div>
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>This sheet appears to be empty.</p>
                </div>
                <ActionButtons />
            </div>
        );
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            {/* Sheet tabs (if multiple sheets) */}
            {sheets.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {sheets.map((name, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSheet(idx)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid var(--color-border)',
                                background: activeSheet === idx ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: activeSheet === idx ? '#fff' : 'var(--color-text)',
                                cursor: 'pointer',
                                fontWeight: activeSheet === idx ? 600 : 400,
                                fontSize: '0.875rem',
                                transition: 'all 0.15s',
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '400px' }}>
                    <thead>
                        <tr>
                            {headerRow.map((cell, idx) => (
                                <th key={idx} style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--color-primary)',
                                    color: '#fff',
                                    textAlign: 'left',
                                    whiteSpace: 'nowrap',
                                    borderRight: '1px solid rgba(255,255,255,0.15)',
                                    fontWeight: 600,
                                    fontSize: '0.8125rem',
                                    letterSpacing: '0.02em',
                                }}>
                                    {cell !== null && cell !== undefined ? String(cell) : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, rIdx) => (
                            <tr key={rIdx} style={{
                                background: rIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-secondary)',
                                transition: 'background 0.1s',
                            }}>
                                {headerRow.map((_, cIdx) => (
                                    <td key={cIdx} style={{
                                        padding: '0.6rem 1rem',
                                        borderTop: '1px solid var(--color-border)',
                                        borderRight: '1px solid var(--color-border)',
                                        whiteSpace: 'nowrap',
                                        color: 'var(--color-text)',
                                    }}>
                                        {row[cIdx] !== null && row[cIdx] !== undefined ? String(row[cIdx]) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {dataRows.length} row{dataRows.length !== 1 ? 's' : ''} · {headerRow.length} column{headerRow.length !== 1 ? 's' : ''}
                {sheets.length > 1 ? ` · Sheet ${activeSheet + 1} of ${sheets.length}` : ''}
            </p>

            <ActionButtons />
        </div>
    );
}
