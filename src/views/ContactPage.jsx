import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <main className="main-content">
            <div className="contact-page-container">
                
                {/* Hero Section */}
                <div className="contact-hero">
                    <h1>Let's Start a Conversation</h1>
                    <p>Have a question about the notes? Found a bug? Or just want to collaborate? I'm always open to discussing new projects, creative ideas, or opportunities.</p>
                </div>

                <div className="contact-grid">
                    
                    {/* Left Column: Form */}
                    <div className="contact-form-wrapper">
                        <ContactForm />
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="contact-info-wrapper">
                        <h2>Contact Information</h2>
                        <p>Fill out the form and I will get back to you within 24 hours.</p>

                        <div className="contact-methods">
                            <a href="mailto:16ratneshkumar@zohomail.in" className="contact-method-card">
                                <div className="method-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div className="method-details">
                                    <h4>Email Me</h4>
                                    <p>16ratneshkumar@zohomail.in</p>
                                </div>
                            </a>

                            <a href="https://github.com/16ratneshkumar" target="_blank" rel="noopener noreferrer" className="contact-method-card">
                                <div className="method-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                    </svg>
                                </div>
                                <div className="method-details">
                                    <h4>GitHub</h4>
                                    <p>@16ratneshkumar</p>
                                </div>
                            </a>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
