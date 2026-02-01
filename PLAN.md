# MoodMinute — implementation plan

Refinement source: `idea-refinements/17-moodminute.md`

## Checklist (10–25 steps)
1. Read refinement doc and extract PM/marketing/design/dev requirements.
2. Create new repo skeleton with `/frontend` Angular app and root README.
3. Implement local-first data model (mood entries with emoji, tags, note?, timestamp) stored in `localStorage`.
4. Build core check-in flow: big emoji picker + quick tags + save.
5. Compute streak + “check-ins this week” KPI.
6. Build dashboard: today status, streak, quick check-in CTA, weekly arc mini-chart.
7. Build history timeline with filters (date range + tag) and edit/delete.
8. Build insights page: weekly summary, trend, top tags, gentle copy (no diagnostic claims).
9. Implement opt-in share: generate a “week arc” permalink (encoded payload) + share/copy UX.
10. Add settings: privacy notes, reduce motion toggle, high-contrast toggle.
11. Add export/import JSON (download + paste/upload) with validation.
12. Make app responsive + app-like navigation (bottom nav).
13. Add subtle animations, respect `prefers-reduced-motion` and the reduce motion toggle.
14. Add PWA-ish touches (manifest meta + app icons placeholders) without heavy deps.
15. Configure GitHub Pages base href and build output.
16. Add GitHub Actions workflow for Pages deployment.
17. Create GitHub repo, push code, enable Pages via Actions.
18. Wait for Pages workflow success and verify live URL.
19. Update run-state file to mark idea shipped.
