# Copilot Instructions for QuickNotes

## Build, run, and verification commands

Use npm scripts from `package.json`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

There are currently no repository lint or test scripts, and no single-test command is configured yet.

## High-level architecture

QuickNotes is a React + Vite SPA that reads note content from GitHub repositories defined in `src/repositories.json`.

1. `src/App.jsx` is the application orchestrator:
   - Loads subject/practical repositories via `fetchRepositories`.
   - Navigates between list view, folder view, and note viewer.
   - Persists navigation state in URL query params (`v`, `owner`, `repo`, `path`, `note`) and restores from URL on reload/back-forward.
2. `src/utils/githubApi.js` is the data access layer:
   - In development, calls GitHub API directly and requires `GITHUB_TOKEN`.
   - In production, calls `/api/github-proxy` instead of GitHub directly.
   - Uses `CacheManager` keys for repo metadata, note listings, and file content.
3. `api/github-proxy.js` is the production serverless proxy:
   - Validates `path` query and forwards requests to GitHub.
   - Caches responses in Upstash Redis for 5 hours.
4. Rendering pipeline for note content:
   - `fetchFileContent` loads raw file text.
   - `renderMarkdown` in `src/utils/markdownRenderer.js` converts markdown-like text (including math and tables) to HTML.
   - `App.jsx` renders it via `dangerouslySetInnerHTML`.
   - Prism and KaTeX are loaded globally in `index.html`, and code highlighting is triggered from `App.jsx`.

## Key repository-specific conventions

- Repository onboarding is config-driven: add entries to `src/repositories.json` under `subjects` or `practicals`. App logic expects `owner`, `repo`, `name`, `type` (and optional `icon`).
- Keep file filtering/sorting behavior in `fetchNotes` consistent:
  - Hidden entries (`.` prefix) are excluded.
  - Folders come first.
  - Names are sorted with `localeCompare(..., { numeric: true, sensitivity: 'base' })`.
- Cache strategy is intentionally dual-layered:
  - Browser cache in `localStorage` via `CacheManager` (`noteshub_` prefix, 5h default TTL).
  - Production Redis cache in `api/github-proxy.js` (also 5h TTL).
  - API helpers fall back to expired local cache on fetch errors; preserve that behavior when changing data fetching.
- Theme handling is centralized in `src/context/ThemeContext.jsx`:
  - Persisted key is `studynotes_theme`.
  - Effective theme is applied through `document.documentElement` `data-theme` attribute.
- Vite is configured with `envPrefix: ['VITE_', 'GITHUB_']` in `vite.config.js`; `GITHUB_*` values are intentionally exposed to client code in development.
