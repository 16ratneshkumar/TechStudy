'use client';
import { useEffect, useState } from 'react';
import SponsorPopup from '@/components/SponsorPopup';
import sponsorConfig from '@/data/sponsorConfig';

const STORAGE_KEY = 'qn_sponsor_dismissed';

/**
 * Wraps SponsorPopup with auto-show logic driven by sponsorConfig.
 * - Reads sponsorConfig.enabled to decide whether to show at all
 * - Waits sponsorConfig.delayMs before revealing the popup
 * - Remembers dismissal in localStorage if sponsorConfig.rememberDismissal is true
 */
export default function SponsorPopupController() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!sponsorConfig.enabled) return;

        if (
            sponsorConfig.rememberDismissal &&
            localStorage.getItem(STORAGE_KEY) === 'true'
        ) {
            return;
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, sponsorConfig.delayMs ?? 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (sponsorConfig.rememberDismissal) {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    };

    return <SponsorPopup isOpen={isOpen} onClose={handleClose} />;
}
