import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-copyright">
                        <span>© 2026</span>
                        <span className="dot">•</span>
                        <span className="developed-by">
                            Designed &amp; Developed by <a href="https://github.com/16ratneshkumar" target="_blank" rel="noopener noreferrer" className="author-link">Ratnesh Kumar</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
