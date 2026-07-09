'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ fallbackHref = '/notes', className = '', style, children }) {
    const router = useRouter();

    const handleClick = () => {
        if (typeof window !== 'undefined' && document.referrer.startsWith(window.location.origin)) {
            router.back();
            return;
        }

        if (fallbackHref == null) {
            router.back();
            return;
        }

        router.push(fallbackHref);
    };

    return (
        <button type="button" className={className} style={style} onClick={handleClick}>
            {children}
        </button>
    );
}
