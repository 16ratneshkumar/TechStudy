import { CacheManager } from '@/lib/github/cache';

const PROXY_URL = '/api/github-proxy';
const RAW_ACCEPT_HEADER = 'application/vnd.github.raw';

// Issue #7 fix: CacheManager uses localStorage which doesn't exist on the server.
// Guard every CacheManager call with this flag so server-side renders rely solely
// on Next.js's built-in fetch cache (next: { revalidate }) instead.
const isClient = typeof window !== 'undefined';

// Safely read env vars - this only runs on the server in Next.js App Router
function getGithubToken() {
    return process.env.GITHUB_TOKEN || null;
}

/**
 * Detect GitHub rate limiting from a response and throw a consistent error.
 * Includes x-ratelimit-reset so callers can surface a retry time if needed.
 */
function checkRateLimit(response) {
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        const reset = response.headers.get('x-ratelimit-reset');
        const err = new Error('GITHUB_RATE_LIMIT_EXCEEDED');
        err.rateLimitReset = reset ? new Date(Number(reset) * 1000).toISOString() : null;
        throw err;
    }
}

/**
 * Fetch helper for JSON responses (directory listings, repo metadata, etc.)
 */
async function apiFetch(path) {
    const isServer = typeof window === 'undefined';

    // On client side, always go through the proxy
    if (!isServer) {
        const response = await fetch(`${PROXY_URL}?path=${encodeURIComponent(path)}`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Proxy Error: ${response.status}`);
        }
        return response.json();
    }

    // Server-side: call GitHub directly
    const GITHUB_TOKEN = getGithubToken();
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set. Please add it to your .env file.');
    }

    const response = await fetch(`https://api.github.com${path}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'TechStudy-App/1.0',
        },
        // Use Next.js cache but allow revalidation
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        // Issue #6 fix: check rate limit BEFORE consuming body so the structured
        // GITHUB_RATE_LIMIT_EXCEEDED error (with rateLimitReset) is thrown first.
        checkRateLimit(response);
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `GitHub API Error: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch raw file content as text or binary data.
 * @param {string} path - The GitHub API path for the file.
 * @param {'text'|'arrayBuffer'} [responseType='text'] - The format of the returned content.
 * @returns {Promise<string|ArrayBuffer>} The file content as text or an array buffer.
 */
async function apiFetchRaw(path, responseType = 'text') {
    const isServer = typeof window === 'undefined';

    // On client side, always go through the proxy
    if (!isServer) {
        const response = await fetch(`${PROXY_URL}?path=${encodeURIComponent(path)}&raw=1`, {
            headers: { 'Accept': RAW_ACCEPT_HEADER },
        });
        if (!response.ok) {
            throw new Error(`Proxy Error: ${response.status}`);
        }
        return responseType === 'arrayBuffer' ? response.arrayBuffer() : response.text();
    }

    // Server-side: call GitHub directly
    const GITHUB_TOKEN = getGithubToken();
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set. Please add it to your .env file.');
    }

    // Append query param to prevent Next.js fetch cache collision with JSON requests
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`https://api.github.com${path}${separator}_raw=1`, {
        headers: {
            'Accept': RAW_ACCEPT_HEADER,
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'TechStudy-App/1.0',
        },
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        // Issue #6 fix: same ordering fix for raw fetch path
        checkRateLimit(response);
        throw new Error(`GitHub API Error: ${response.status}`);
    }

    return responseType === 'arrayBuffer' ? response.arrayBuffer() : response.text();
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function arrayBufferToBase64(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
}

/**
 * Build an encoded GitHub API path from owner/repo/filePath
 */
function buildContentsPath(owner, repo, path) {
    const encodedPath = path
        ? path.split('/').map(encodeURIComponent).join('/')
        : '';
    return `/repos/${owner}/${repo}/contents/${encodedPath}`;
}

/**
 * Fetch repository metadata
 */
export async function fetchRepository(owner, repo) {
    const cacheKey = `repo_${owner}/${repo}`;

    const cached = isClient ? CacheManager.get(cacheKey) : null;
    if (cached) return cached;

    try {
        const data = await apiFetch(`/repos/${owner}/${repo}`);
        if (isClient) CacheManager.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Fetch repository error:', error);
        const expiredCache = isClient ? CacheManager.get(cacheKey, true) : null;
        if (expiredCache) return expiredCache;
        throw error;
    }
}

/**
 * Fetch the entire file tree recursively
 */
export async function fetchRepositoryTree(owner, repo, branch = 'main') {
    const cacheKey = `repo_tree_${owner}/${repo}/${branch}`;

    const cached = isClient ? CacheManager.get(cacheKey) : null;
    if (cached) return cached;

    try {
        // GitHub Git Data API: GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1
        const data = await apiFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
        if (data?.truncated) {
            console.warn(`Repository tree truncated for ${owner}/${repo}@${branch}; sitemap may be incomplete.`);
        }
        
        // Filter out non-files and files we don't care about
        if (data && data.tree) {
            const files = data.tree
                .filter(item => item.type === 'blob') // only files
                .filter(item => isAllowedFile(item.path))
                .filter(item => !item.path.split('/').some(part => part.startsWith('.'))); // ignore hidden folders/files

            if (isClient) CacheManager.set(cacheKey, files);
            return files;
        }
        return [];
    } catch (error) {
        console.error('Fetch repository tree error:', error);
        const expiredCache = isClient ? CacheManager.get(cacheKey, true) : null;
        if (expiredCache) return expiredCache;
        return []; // fail gracefully for sitemap
    }
}

const NOTE_EXTENSIONS = new Set([
    '.md', '.markdown', '.txt',
    '.py', '.cpp', '.c', '.sh', '.js', '.ts',
    '.csv', '.wxmx', '.tex',
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.pdf', '.xlsx', '.xls',
]);

function isAllowedFile(name) {
    const lower = name.toLowerCase();
    return NOTE_EXTENSIONS.has(lower.slice(lower.lastIndexOf('.')));
}

function filterAndSortNotes(items) {
    const filtered = items.filter(item => {
        if (item.name.startsWith('.')) return false;
        if (item.type === 'dir') return true;
        return isAllowedFile(item.name);
    });

    filtered.sort((a, b) => {
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    return filtered;
}

/**
 * Fetch repository notes (markdown files and folders)
 */
export async function fetchNotes(owner, repo, path = '') {
    const cacheKey = `notes_v2_${owner}/${repo}/${path}`;

    const cached = isClient ? CacheManager.get(cacheKey) : null;
    if (cached) return filterAndSortNotes(cached);

    try {
        const apiPath = buildContentsPath(owner, repo, path);
        const data = await apiFetch(apiPath);
        const notes = Array.isArray(data) ? data : [];
        if (isClient) CacheManager.set(cacheKey, notes);
        return filterAndSortNotes(notes);
    } catch (error) {
        if (error.message && (error.message.includes('404') || error.message.includes('Not Found'))) {
            return [];
        }
        console.error('Fetch notes error:', error);
        const expiredCache = isClient ? CacheManager.get(cacheKey, true) : null;
        if (expiredCache) return filterAndSortNotes(expiredCache);
        throw error;
    }
}

/**
 * Fetch file content as text
 */
export async function fetchFileContent(owner, repo, path) {
    const cacheKey = `file_${owner}/${repo}/${path}`;

    const cached = isClient ? CacheManager.get(cacheKey) : null;
    if (cached) return cached;

    const apiPath = buildContentsPath(owner, repo, path);

    try {
        const content = await apiFetchRaw(apiPath, 'text');
        if (!content) throw new Error('Empty response from GitHub');
        if (isClient) CacheManager.set(cacheKey, content);
        return content;
    } catch (error) {
        console.error('Fetch file content error:', error);
        const expiredCache = isClient ? CacheManager.get(cacheKey, true) : null;
        if (expiredCache) return expiredCache;
        throw error;
    }
}

/**
 * Fetch binary file content as ArrayBuffer (for spreadsheets, etc.)
 */
export async function fetchFileArrayBuffer(owner, repo, path) {
    const cacheKey = `file_bin_${owner}/${repo}/${path}`;

    const cached = isClient ? CacheManager.get(cacheKey) : null;
    if (cached) return base64ToArrayBuffer(cached);

    const apiPath = buildContentsPath(owner, repo, path);

    try {
        const arrayBuffer = await apiFetchRaw(apiPath, 'arrayBuffer');
        if (isClient) CacheManager.set(cacheKey, arrayBufferToBase64(arrayBuffer));
        return arrayBuffer;
    } catch (error) {
        console.error('Fetch file array buffer error:', error);
        const expiredCache = isClient ? CacheManager.get(cacheKey, true) : null;
        if (expiredCache) return base64ToArrayBuffer(expiredCache);
        throw error;
    }
}

/**
 * Fetch multiple repositories metadata in parallel
 */
export async function fetchRepositories(repos) {
    const promises = repos.map((config) =>
        fetchRepository(config.owner, config.repo)
            .then(data => ({
                ...data,
                ...config,
                configOwner: config.owner,
                configRepo: config.repo,
            }))
            .catch(error => {
                console.error(`Failed to fetch ${config.owner}/${config.repo}:`, error);
                return {
                    ...config,
                    configOwner: config.owner,
                    configRepo: config.repo,
                    fetchError: true,
                };
            })
    );

    return Promise.all(promises);
}
