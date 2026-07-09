'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        const form = e.target;
        const data = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                setStatus('success');
                form.reset();
                setTimeout(() => setStatus(''), 5000); // Clear success message after 5s
            } else {
                setStatus('error');
                setTimeout(() => setStatus(''), 5000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus(''), 5000);
        }
    };

    return (
        <form action="https://formspree.io/f/xnjqjwgj" method="POST" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" className="form-input" placeholder="First Name" required disabled={status === 'submitting'} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" className="form-input" placeholder="Last Name" required disabled={status === 'submitting'} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" className="form-input" placeholder="Email Address" required disabled={status === 'submitting'} />
            </div>

            <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" className="form-input" placeholder="How can I help you?" required disabled={status === 'submitting'} />
            </div>

            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" className="form-input" placeholder="Write your message..." required disabled={status === 'submitting'}></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                {status !== 'submitting' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                )}
            </button>

            {status === 'success' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', border: '1px solid #10b981', textAlign: 'center', fontWeight: '500' }}>
                    Message sent successfully! We'll get back to you soon.
                </div>
            )}
            {status === 'error' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: '1px solid #ef4444', textAlign: 'center', fontWeight: '500' }}>
                    Oops! There was a problem submitting your form. Please try again.
                </div>
            )}
        </form>
    );
}
