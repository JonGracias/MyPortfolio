# Azure Portfolio (Next.js + Azure App Service + GitHub Actions)

- `/src/app/page.tsx` → homepage UI
- `/src/components/*` → presentational components
- `/src/app/api/repos/route.ts` → server route calling GitHub
- `/src/lib/github.ts` → GitHub client (reads env vars)
- `/.github/workflows/deploy.yml` → CI/CD to Azure App Service

## Env vars (set locally in `.env.local` and in Azure App Settings)
- GITHUB_USERNAME
- GITHUB_TOKEN (optional but recommended)
- NEXT_PUBLIC_BASE_URL (http://localhost:3000 for dev, your site URL in prod)
- GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

Run locally:
```bash
npm run dev
