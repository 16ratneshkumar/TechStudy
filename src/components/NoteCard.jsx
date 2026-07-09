export default function NoteCard({ note }) {
    const isFolder = note.type === 'dir';
    const name = note.name.toLowerCase();
    const isPdf = name.endsWith('.pdf');
    const isCode = name.endsWith('.py') || name.endsWith('.cpp') || name.endsWith('.c');
    const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls');

    const size = !isFolder && note.size ? `${(note.size / 1024).toFixed(1)} KB` : '';

    let typeLabel = 'Document';
    let typeClass = 'type-text';

    if (isFolder) {
        typeLabel = 'Folder';
        typeClass = 'type-folder';
    } else if (isPdf) {
        typeLabel = 'PDF';
        typeClass = 'type-pdf';
    } else if (isExcel) {
        typeLabel = 'Spreadsheet';
        typeClass = 'type-code';
    } else if (isCode) {
        typeLabel = 'Source Code';
        typeClass = 'type-code';
    }

    return (
        <div className={`note-item-card ${isFolder ? 'is-folder' : ''}`}>
            <div className="note-card-icon-wrapper">
                {isFolder ? (
                    /* Folder Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
                    </svg>
                ) : isPdf ? (
                    /* PDF Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M9 15h6" />
                        <path d="M9 19h6" />
                        <path d="M9 11h1" />
                    </svg>
                ) : isExcel ? (
                    /* Spreadsheet Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="16" y2="17" />
                        <line x1="12" y1="9" x2="12" y2="21" />
                    </svg>
                ) : isCode ? (
                    /* Code Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </svg>
                ) : (
                    /* Text/Markdown Icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                )}
            </div>

            <div className="note-card-details">
                <div className="note-card-title-row">
                    <span className="note-card-name" title={note.name}>
                        {note.name.replace(/\.(md|txt|markdown|py|cpp|c|pdf|xlsx|xls)$/i, '')}
                    </span>
                    {size && <span className="note-card-size">{size}</span>}
                </div>
                <div className="note-card-meta">
                    <span className={`note-type-badge ${typeClass}`}>{typeLabel}</span>
                    <span className="note-path">{isFolder ? 'Open Directory' : 'View Content'}</span>
                </div>
            </div>

            <div className="note-card-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </div>
    );
}
