'use client';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import repositoriesConfig from '@/data/repositories.json';

export default function Navbar() {
    const { isDarkMode, toggleTheme, mounted } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname() || '';

    const onToggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#brandGradient)" />
                            <path d="M10 12h12M10 16h12M10 20h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="brandGradient" x1="4" y1="4" x2="28" y2="28">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#1D4ED8" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>TechStudy</span>
                    </Link>

                    <div className="nav-menu-wrapper">
                        <ul className="nav-menu">
                            <li>
                                <Link
                                    href="/"
                                    className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/notes"
                                    className={`nav-link ${pathname.startsWith('/notes') ? 'active' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                    Notes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/practicals"
                                    className={`nav-link ${pathname.startsWith('/practicals') ? 'active' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 2v7.51L4.53 17.13A2 2 0 0 0 6.2 20h11.6a2 2 0 0 0 1.67-2.87L14 9.51V2h-4z" /><path d="M8.5 2h7" /><path d="M10.5 11l.5.5" /><path d="M14 11l-.5.5" />
                                    </svg>
                                    Practicals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                    About
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="nav-actions">
                        <SearchBar subjects={repositoriesConfig.subjects} practicals={repositoriesConfig.practicals} />

                        <button className="theme-toggle" onClick={toggleTheme} title={mounted ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : 'Toggle Theme'}>
                            {!mounted ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : isDarkMode ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

                        <button
                            className={`nav-toggle ${sidebarOpen ? 'active' : ''}`}
                            onClick={onToggleSidebar}
                            aria-label="Toggle navigation"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
                <ul className="sidebar-menu">
                    <li>
                        <Link href="/" className="sidebar-link" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/notes" className="sidebar-link" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                            Notes
                        </Link>
                    </li>
                    <li>
                        <Link href="/practicals" className="sidebar-link" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.51L4.53 17.13A2 2 0 0 0 6.2 20h11.6a2 2 0 0 0 1.67-2.87L14 9.51V2h-4z" /><path d="M8.5 2h7" /></svg>
                            Practicals
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="sidebar-link" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            About
                        </Link>
                    </li>

                    <li>
                        <Link href="/contact" className="sidebar-link" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            Contact
                        </Link>
                    </li>
                    <li>
                        <button className="sidebar-btn" onClick={() => { toggleTheme(); closeSidebar(); }}>
                            {!mounted ? (
                                <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Toggle Theme</>
                            ) : isDarkMode ? (
                                <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Light Mode</>
                            ) : (
                                <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg> Dark Mode</>
                            )}
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}
