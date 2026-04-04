/**
 * Universal Cache Service
 * Provides simple localStorage caching with TTL (Time To Live) support.
 */

const DEFAULT_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const cacheService = {
    /**
     * Set data to cache
     * @param {string} key 
     * @param {any} data 
     */
    set: (key, data) => {
        try {
            const cacheObj = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(`mrija_cache_${key}`, JSON.stringify(cacheObj));
        } catch (error) {
            console.warn("Cache set error:", error);
        }
    },

    /**
     * Get data from cache
     * @param {string} key 
     * @returns {any|null}
     */
    get: (key) => {
        try {
            const cached = localStorage.getItem(`mrija_cache_${key}`);
            if (!cached) return null;

            const { data } = JSON.parse(cached);
            return data;
        } catch (error) {
            console.warn("Cache get error:", error);
            return null;
        }
    },

    /**
     * Check if cache is expired
     * @param {string} key 
     * @param {number} ttl - Time in milliseconds
     * @returns {boolean}
     */
    isExpired: (key, ttl = DEFAULT_TTL) => {
        try {
            const cached = localStorage.getItem(`mrija_cache_${key}`);
            if (!cached) return true;

            const { timestamp } = JSON.parse(cached);
            return Date.now() - timestamp > ttl;
        } catch (error) {
            return true;
        }
    },

    /**
     * Clear specific cache key
     * @param {string} key 
     */
    remove: (key) => {
        localStorage.removeItem(`mrija_cache_${key}`);
    }
};
