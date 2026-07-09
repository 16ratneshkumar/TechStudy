# TechStudy - Computer Science Notes Hub

A clean and modern study application for browsing and reading Computer Science notes from GitHub repositories.

## 🚀 Quick Start

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/16ratneshkumar/TechStudy

cd TechStudy

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Adding Repositories

Edit `src/data/repositories.json` to add your GitHub repositories:

```json
{
  "subjects": [
    {
      "owner": "username",
      "repo": "repo-name",
      "name": "Display Name",
      "type": "subject",
      "degree": "Bachelor of Computer Science",
      "semester": "Semester 1",
      "progress": "complete"
    }
  ],
  "practicals": [
    { "owner": "username", "repo": "repo-name", "name": "Display Name", "type": "practical" }
  ]
}
```

### GitHub API Rate Limits

**Important**: GitHub limits unauthenticated requests to **60 per hour**.

#### 🔑 Add a GitHub Token (Recommended)
This increases your limit to **5,000 requests per hour**.

**Steps:**

1. **Create a token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "NotesHub"
   - Select scope: `public_repo` only
   - Click "Generate token" and copy it

2. **Add environment variables to your app:**
   - Create a `.env` file in the project root (if it doesn't exist)
   - Replace `your_token_here` with your actual token:
   ```env
   GITHUB_TOKEN=ghp_your_actual_token_here
   
   # Optional: For production Redis proxy caching
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```
   - Save the file

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

**Security Note**:
- The `.env` file is already in `.gitignore` - it won't be committed to Git.
- Never share your token publicly.

## ✨ Features

- 📚 Browse subjects and practicals
- 📝 Read beautifully formatted markdown notes (with math equation support via KaTeX)
- 📊 Native Excel spreadsheet viewing (via SheetJS)
- 📄 Inline PDF rendering and image support
- 🔍 Search notes by name
- ⏭️ Navigate between notes with Previous/Next buttons
- 🌓 Light/Dark theme toggle
- 🚀 Next.js App Router with Server Components
- 💾 Intelligent multi-layer caching (Next.js server cache + LocalStorage + Redis for production proxy)
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Vanilla CSS** with CSS Variables
- **GitHub REST API** (Data Source)
- **SheetJS** (Excel rendering)
- **Upstash Redis** (Production API Proxy Cache)

## 📁 Project Structure

```
TechStudy/
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   ├── components/          # Reusable React components
│   ├── data/                # Configuration (repositories.json)
│   ├── lib/                 # Utilities (GitHub API, caching, markdown renderer)
│   └── views/               # Page layout components
├── public/                  # Static assets
└── next.config.js           # Next.js & Turbopack configuration
```

## 🐛 Troubleshooting

### "Failed to load content" or "API Error"
- Ensure repositories are public.
- Check if your `GITHUB_TOKEN` is valid and configured properly in `.env`.
- Next.js development server caches fetches aggressively. If you encounter stale API errors, try stopping the server, clearing `.next/`, or doing a hard refresh.

### Spreadsheets not loading
- Make sure the file is a valid `.xlsx` or `.xls` file. We use SheetJS which runs entirely in the browser to parse spreadsheets without server overhead.

## 📄 License 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
