/**
 * Cache Manager Utility
 * Handles localStorage-based caching with expiration
 */

const CACHE_PREFIX = 'noteshub_';
const DEFAULT_EXPIRATION = 18000000; // 5 hours (5 * 60 * 60 * 1000)

// Statistics
let stats = {
    hits: 0,
    misses: 0,
    sets: 0,
};

export const CacheManager = {
    /**
     * Set item in cache with expiration
     */
    set(key, data, expirationMs = DEFAULT_EXPIRATION) {
        if (typeof window === 'undefined') return false;
        try {
            const cacheKey = CACHE_PREFIX + key;
            const timestamp = Date.now();
            const cacheData = {
                data,
                timestamp,
                expiresAt: timestamp + expirationMs,
            };

            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            stats.sets++;
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            if (error.name === 'QuotaExceededError') {
                this.clearOldest();
            }
            return false;
        }
    },

    /**
     * Get item from cache if not expired
     */
    get(key, allowExpired = false) {
        if (typeof window === 'undefined') return null;
        try {
            const cacheKey = CACHE_PREFIX + key;
            const cached = localStorage.getItem(cacheKey);

            if (!cached) {
                stats.misses++;
                return null;
            }

            const cacheData = JSON.parse(cached);
            const now = Date.now();

            if (!allowExpired && cacheData.expiresAt < now) {
                stats.misses++;
                localStorage.removeItem(cacheKey);
                return null;
            }

            stats.hits++;
            return cacheData.data;
        } catch (error) {
            console.error('Cache get error:', error);
            stats.misses++;
            return null;
        }
    },


    /**
     * Clear oldest cache items
     */
    clearOldest(count = 5) {
        if (typeof window === 'undefined') return false;
        try {
            const keys = Object.keys(localStorage);
            const cacheItems = [];

            keys.forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        cacheItems.push({ key, timestamp: data.timestamp || 0 });
                    } catch (e) {
                        localStorage.removeItem(key);
                    }
                }
            });

            cacheItems.sort((a, b) => a.timestamp - b.timestamp);

            for (let i = 0; i < Math.min(count, cacheItems.length); i++) {
                localStorage.removeItem(cacheItems[i].key);
            }

            return true;
        } catch (error) {
            console.error('Clear oldest error:', error);
            return false;
        }
    },


    /**
     * Cleanup expired items
     */
    cleanup() {
        if (typeof window === 'undefined') return 0;
        try {
            const keys = Object.keys(localStorage);
            const now = Date.now();
            let cleaned = 0;

            keys.forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.expiresAt && data.expiresAt < now) {
                            localStorage.removeItem(key);
                            cleaned++;
                        }
                    } catch (e) {
                        localStorage.removeItem(key);
                        cleaned++;
                    }
                }
            });

            return cleaned;
        } catch (error) {
            console.error('Cleanup error:', error);
            return 0;
        }
    },
};

// Run cleanup on load if in browser
if (typeof window !== 'undefined') {
    CacheManager.cleanup();
}
