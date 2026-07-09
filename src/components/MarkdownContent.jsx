'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MarkdownContent({ html }) {
    const ref = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        if (!ref.current) return;

        // Syntax highlighting with Prism
        if (typeof window !== 'undefined' && window.Prism) {
            window.Prism.highlightAllUnder(ref.current);
        }

        // KaTeX math rendering
        if (typeof window !== 'undefined' && window.renderMathInElement) {
            window.renderMathInElement(ref.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                ],
                throwOnError: false,
            });
        }

        // Inject copy buttons on every <pre><code> block
        const pres = ref.current.querySelectorAll('pre');
        pres.forEach((pre) => {
            if (pre.querySelector('.copy-code-btn')) return; // avoid duplicates

            // Wrap pre in a relative container if not already
            pre.style.position = 'relative';

            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.setAttribute('aria-label', 'Copy code');
            btn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;

            btn.addEventListener('click', async () => {
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;
                try {
                    await navigator.clipboard.writeText(text);
                    btn.classList.add('copied');
                    btn.innerHTML = `
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = `
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
                    }, 2000);
                } catch {
                    // fallback: select text
                    const range = document.createRange();
                    range.selectNodeContents(pre);
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            });

            pre.appendChild(btn);
        });
    }, [html, pathname]);

    return (
        <div
            ref={ref}
            className="note-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
