/**
 * Markdown Renderer Utility with KaTeX support
 */

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function sanitizeProtocolUrl(url, allowedProtocols) {
    const trimmed = url.trim().replace(/&amp;/g, '&');
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) return null;

    try {
        const parsed = new URL(trimmed);
        return allowedProtocols.includes(parsed.protocol.toLowerCase()) ? parsed.href : null;
    } catch {
        return null;
    }
}

function sanitizeLanguage(language) {
    const safe = String(language || 'text').toLowerCase().replace(/[^a-z0-9+-]/g, '');
    return safe || 'text';
}

/**
 * Renders LaTeX content using KaTeX
 */
function renderLatex(formula, displayMode = false) {
    // window is undefined on the server (Next.js Server Components run in Node.js)
    const katex = typeof window !== 'undefined' ? window.katex : null;
    if (!katex) return escapeHtml(formula);
    try {
        return katex.renderToString(formula, {
            displayMode,
            throwOnError: false,
            trust: false
        });
    } catch (e) {
        console.error('KaTeX error:', e);
        return `<span class="math-error">${escapeHtml(formula)}</span>`;
    }
}

function parseInline(text, mathStore) {
    // 1. Protect escaped characters (especially \$)
    text = text.replace(/\\(\$)/g, '@@@ESC_DOLLAR@@@');

    // 2. Protect math
    // Block math: $$ ... $$ or \[ ... \]
    const blockRegex = /(\$\$|\\\[)([\s\S]+?)(\$\$|\\\])/g;
    text = text.replace(blockRegex, (match, open, formula, close) => {
        if ((open === '$$' && close === '$$') || (open === '\\[' && close === '\\]')) {
            const id = `MATHREF${mathStore.length}`;
            mathStore.push({ id, formula, isBlock: true });
            return `@@@${id}@@@`;
        }
        return match;
    });

    // Inline math: $ ... $ or \( ... \)
    const inlineRegex = /(\$|\\\()([\s\S]+?)(\$|\\\))/g;
    text = text.replace(inlineRegex, (match, open, formula, close) => {
        if ((open === '$' && close === '$') || (open === '\\(' && close === '\\)')) {
            const id = `MATHREF${mathStore.length}`;
            mathStore.push({ id, formula, isBlock: false });
            return `@@@${id}@@@`;
        }
        return match;
    });

    // Escape the remaining raw text before injecting any HTML tags.
    text = escapeHtml(text);

    // 3. Standard Markdown Inline
    // Code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Images
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
        const safeUrl = sanitizeProtocolUrl(url, ['http:', 'https:']);
        if (!safeUrl) {
            return `<span class="disabled-link" title="Image URL disabled">${alt}</span>`;
        }
        return `<img src="${escapeHtml(safeUrl)}" alt="${alt}" />`;
    });
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
        const safeUrl = sanitizeProtocolUrl(url, ['http:', 'https:', 'mailto:', 'tel:']);
        if (!safeUrl) {
            return `<span class="disabled-link" title="Relative link disabled">${label}</span>`;
        }
        return `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    return text;
}

function renderTable(lines, mathStore) {
    if (lines.length < 2) return '';

    let html = '<table>\n';
    const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
    html += '<thead>\n<tr>\n';
    headers.forEach(header => {
        html += `<th>${parseInline(header, mathStore)}</th>\n`;
    });
    html += '</tr>\n</thead>\n';

    if (lines.length > 2) {
        html += '<tbody>\n';
        for (let i = 2; i < lines.length; i++) {
            const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
            html += '<tr>\n';
            cells.forEach(cell => {
                html += `<td>${parseInline(cell, mathStore)}</td>\n`;
            });
            html += '</tr>\n';
        }
        html += '</tbody>\n';
    }
    html += '</table>\n';
    return html;
}

export function renderMarkdown(markdown) {
    if (!markdown) return '';

    const mathStore = [];
    const lines = markdown.split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';
    let inList = false;
    let listType = '';
    let inBlockquote = false;
    let blockquoteContent = '';
    let inTable = false;
    let tableContent = [];
    let inMathBlock = false;
    let mathBlockContent = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Filter out navigation patterns
        if (line.match(/Previous:.*\|.*Next:/i) || line.match(/^\[(Previous|Next)\]/i)) {
            continue;
        }

        // Math Blocks (Dedicated block-level check)
        if (line.trim() === '$$') {
            if (inMathBlock) {
                const id = `MATHREF${mathStore.length}`;
                mathStore.push({ id, formula: mathBlockContent.trim(), isBlock: true });
                html += `<div class="math-block">@@@${id}@@@</div>\n`;
                inMathBlock = false;
                mathBlockContent = '';
            } else {
                inMathBlock = true;
            }
            continue;
        }
        if (inMathBlock) {
            mathBlockContent += line + '\n';
            continue;
        }

        // Code blocks
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                html += `<pre><code class="language-${sanitizeLanguage(codeBlockLang)}">${escapeHtml(codeBlockContent)}</code></pre>\n`;
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLang = '';
            } else {
                inCodeBlock = true;
                codeBlockLang = line.substring(3).trim() || 'text';
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        // Headers
        if (line.startsWith('#')) {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                html += `<h${level}>${parseInline(match[2], mathStore)}</h${level}>\n`;
                continue;
            }
        }

        // Horizontal rule
        if (line.match(/^(\*\*\*|---|___)$/)) {
            html += '<hr>\n';
            continue;
        }

        // Blockquote
        if (line.startsWith('>')) {
            const content = line.substring(1).trim();
            if (!inBlockquote) {
                inBlockquote = true;
                blockquoteContent = content;
            } else {
                blockquoteContent += ' ' + content;
            }
            continue;
        } else if (inBlockquote) {
            html += `<blockquote>${parseInline(blockquoteContent, mathStore)}</blockquote>\n`;
            inBlockquote = false;
            blockquoteContent = '';
        }

        // Unordered list
        if (line.match(/^[\*\-\+]\s+/)) {
            const content = line.replace(/^[\*\-\+]\s+/, '');
            if (!inList || listType !== 'ul') {
                if (inList) html += `</${listType}>\n`;
                html += '<ul>\n';
                inList = true;
                listType = 'ul';
            }
            html += `<li>${parseInline(content, mathStore)}</li>\n`;
            continue;
        }

        // Ordered list
        if (line.match(/^\d+\.\s+/)) {
            const content = line.replace(/^\d+\.\s+/, '');
            if (!inList || listType !== 'ol') {
                if (inList) html += `</${listType}>\n`;
                html += '<ol>\n';
                inList = true;
                listType = 'ol';
            }
            html += `<li>${parseInline(content, mathStore)}</li>\n`;
            continue;
        }

        if (inList && !line.match(/^[\*\-\+\d]/)) {
            html += `</${listType}>\n`;
            inList = false;
            listType = '';
        }

        // Table
        if (line.includes('|')) {
            if (!inTable) {
                inTable = true;
                tableContent = [];
            }
            tableContent.push(line);
            continue;
        } else if (inTable) {
            html += renderTable(tableContent, mathStore);
            inTable = false;
            tableContent = [];
        }

        // Empty line
        if (line.trim() === '') {
            if (inList) {
                html += `</${listType}>\n`;
                inList = false;
                listType = '';
            }
            continue;
        }

        // Paragraph
        if (line.trim()) {
            html += `<p>${parseInline(line, mathStore)}</p>\n`;
        }
    }

    // Final cleanups and math restoration
    if (inCodeBlock) html += `<pre><code>${escapeHtml(codeBlockContent)}</code></pre>\n`;
    if (inList) html += `</${listType}>\n`;
    if (inBlockquote) html += `<blockquote>${parseInline(blockquoteContent, mathStore)}</blockquote>\n`;
    if (inTable) html += renderTable(tableContent, mathStore);
    if (inMathBlock) {
        const id = `MATHREF${mathStore.length}`;
        mathStore.push({ id, formula: mathBlockContent.trim(), isBlock: true });
        html += `<div class="math-block">@@@${id}@@@</div>\n`;
    }

    // Restore and render math (using function replacement to safely handle $ characters in KaTeX output)
    mathStore.forEach(({ id, formula, isBlock }) => {
        const rendered = isBlock
            ? renderLatex(formula, true)
            : `<span class="math-inline">${renderLatex(formula, false)}</span>`;

        // Use a function as the replacement to treat 'rendered' as a literal string
        html = html.replace(`@@@${id}@@@`, () => rendered);
    });

    // Restore escaped characters
    html = html.replace(/@@@ESC_DOLLAR@@@/g, '$');

    return html;
}
