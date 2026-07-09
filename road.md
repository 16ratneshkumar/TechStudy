🔍 Content & SEO
Add a Search page — global full-text search across all subjects/notes
Tags/Categories page — filter notes by tags like algorithms, networking, etc.
Sitemap improvements — auto-generate sitemap entries for every note file
Open Graph images — dynamic OG preview images for each subject page (using Next.js ImageResponse)
🎨 UI/UX
Reading progress bar — thin bar at top of page while reading a note file
Table of Contents — auto-generate from markdown headings (##, ###) on the side
Dark/Light theme toggle animation — smooth morph instead of instant switch
Breadcrumb navigation — Notes → BCS → Sem 3 → Computer Graphics trail
Copy code button — on every code block in markdown notes
⚡ Performance
ISR (Incremental Static Regeneration) — refresh notes every 24h automatically without redeploying
Image optimization — use next/image for all images in notes
Font preloading — avoid FOUT (flash of unstyled text)
📊 Features
Note view counter — show how many times a note was viewed (using Vercel KV or Supabase)
"Last updated" badge — pull commit date from GitHub API and show on each note
PDF download button — one-click download for PDF notes
Related subjects — show related subjects at the bottom of each note page
Announcement banner — "New notes added!" ribbon on recently updated subjects
🛡️ Reliability
Offline fallback — PWA support so previously visited notes work without internet
Rate limit handling — show friendly message when GitHub API rate limit is hit
Error retry logic — auto-retry failed GitHub API calls once before showing error page
📱 Mobile
Bottom navigation bar — for mobile users instead of top navbar
Swipe gestures — swipe left/right between notes in a subject