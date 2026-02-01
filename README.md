# MoodMinute

10-second mood check-ins with streaks + weekly insights. **Local-first** by default: data stays in your browser unless you export or share a week arc.

Live demo (GitHub Pages): after first workflow run, visit:
`https://manulus1-ai.github.io/<repo-name>/`

## What it is
- Quick emoji-based check-in (optionally add tags + a short note)
- Streak counter
- History view with edit/delete
- Weekly insights (average, trend, top tags)
- Opt-in share link for a 7-day “week arc”
- Reduce motion + high contrast accessibility toggles
- Export/import JSON

## Tech
- Frontend: Angular (standalone components)
- Backend: none (frontend-only)

## Run locally

### Frontend
```bash
cd frontend
npm install
npm start
```
Then open the printed localhost URL.

### Build
```bash
cd frontend
npm run build
```

## Notes
- Client-side routing uses **hash URLs** (e.g. `#/insights`) so GitHub Pages works without custom 404 handling.
- Sharing creates a link that embeds the shared data in the URL.
