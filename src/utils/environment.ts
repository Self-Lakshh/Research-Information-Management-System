/**
 * Returns true when the Netlify Functions runtime is available.
 * Netlify Dev (local) runs on port 8888 and proxies functions correctly.
 * Vite alone (dev or preview) runs on other ports and returns HTML for
 * the functions endpoints, which would cause parsing errors.
 */
export const isFunctionsAvailable = (): boolean => {
    // 1. Explicit override via env var
    if (import.meta.env.VITE_USE_NETLIFY_FUNCTIONS === 'true') return true;
    if (import.meta.env.VITE_USE_NETLIFY_FUNCTIONS === 'false') return false;

    // Server-side safety (if running in SSR context)
    if (typeof window === 'undefined') return true;

    const { hostname, port } = window.location;

    // 2. Netlify Dev (local proxy)
    // Always returns true on port 8888 because that's the specific port Netlify Dev uses.
    if (port === '8888') return true;

    // 3. Detect local environments (localhost / 127.0.0.1 / IP-based / .local)
    // On these hosts, if we aren't on port 8888 (checked above), the functions
    // don't exist because the native dev/preview servers don't serve them.
    const isLocal =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.endsWith('.local') ||
        hostname === '0.0.0.0' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.');

    if (isLocal) {
        // If it's localhost but NOT port 8888, the functions are definitely not handled.
        // This covers pnpm run dev (5173, 5174...) and npm run preview (4173...).
        return false;
    }

    // 4. Production build: assume we're on Netlify production infrastructure
    // where these routes (/.netlify/functions/*) are natively available.
    return true;
};
