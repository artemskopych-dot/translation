# Novicore Translation UI (Next.js 14, App Router, TS)

Matches your screenshot layout: Translation form (project name, upload, languages, description, file mapping) + Review tab.

## Local Run
```
npm i
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com
npm run dev
```

## Build & Export
```
npm run export
# output in ./out (static)
```

## Amplify Hosting
Use the included `amplify.yml` (build -> `npm run export`, artifacts -> `out/`). Set env var `NEXT_PUBLIC_API_BASE_URL` in Amplify.
