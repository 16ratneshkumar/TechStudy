/**
 * ┌─────────────────────────────────────────┐
 * │  SPONSOR POPUP CONTROL                  │
 * │  true  → popup will appear              │
 * │  false → popup will never show          │
 * └─────────────────────────────────────────┘
 */
export const SHOW_SPONSOR_POPUP = false;

// ── Advanced settings (optional) ──────────────────────────────────────────────
const sponsorConfig = {
    /** Controlled by SHOW_SPONSOR_POPUP above — do not edit this line */
    enabled: SHOW_SPONSOR_POPUP,

    /** Milliseconds before the popup appears after page load */
    delayMs: 2000,

    /** Once dismissed, don't show again until localStorage is cleared */
    rememberDismissal: true,

    /** Sponsor details shown in the popup */
    sponsor: {
        name: 'TechStudy',
        tagline: 'Support free education 💙',
        message: 'TechStudy is a free, open-source platform. If it helped you, consider supporting its development so we can keep it alive and free for everyone!',
        ctaLabel: 'Support on GitHub ⭐',
        ctaHref: 'https://github.com/16ratneshkumar',
        secondaryLabel: 'Maybe later',
        avatar: '🎓',
    },
};

export default sponsorConfig;
