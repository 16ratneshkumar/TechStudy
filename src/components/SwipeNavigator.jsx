'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SwipeNavigator({ children, previousHref, nextHref }) {
    // Use refs instead of state so touch tracking never triggers a re-render
    // of the wrapped content subtree (MarkdownContent, TOC, NoteNavigation).
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const router = useRouter();

    // Minimum distance required for a swipe to be recognized (in pixels)
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        // Record position without causing a re-render
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEndHandler = () => {
        // Explicit null check: a valid clientX of 0 should not be treated as missing
        if (touchStartX.current === null || touchEndX.current === null) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && nextHref) {
            // Swiped left -> Go to Next note
            router.push(nextHref);
        } else if (isRightSwipe && previousHref) {
            // Swiped right -> Go to Previous note
            router.push(previousHref);
        }
    };

    return (
        <div 
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove} 
            onTouchEnd={onTouchEndHandler}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </div>
    );
}
