# CardanoDashboard

A data aggregator service integrated with the X API and different node and data feed providers to fetch daily on-chain metrics from the Cardano mainnet and ADA prices to post them.

## Quick Start (after cloning)

1. Install dependencies (from repository root):

```bash
pnpm install
```

2. Create `.env` in the repository root.

3. Add required environment variables (see below).

4. Run the app on the CLI (see commands below).

## Required .env variables

Create `.env` in the repository root with at least:

```env
# DB (MongoBD)
DATABASE_URL=your_mongo_db_connection_string

# Data feeds and node providers 
BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
MAESTRO_API_KEY=your_maestro_api_key
CARDANOSCAN_API_KEY=your_cardanoscan_api_key

# Twitter / X credentials for cron daily tweet
X_API_KEY=your_x_api_key
X_API_SECRET=your_x_api_secret
X_ACCESS_TOKEN=your_x_access_token
X_ACCESS_TOKEN_SECRET=your_x_access_token_secret
```

> Note: `X_*` variables are required for the tweet scheduler/cron endpoints.

## Useful commands

From CLI (Windows):
cd C:\[your_source_folder]\CardanoDashboard\packages\app\src\lib
ts-node ./scheduler.ts # runs service with cron job for automated daily posts
ts-node ./scheduler.ts daily # fallback parameter that triggers the daily metrics without the cron job in case of an error

From repo root:

```bash
pnpm --filter=@cardano-dashboard/app dev       # start dev server
pnpm --filter=@cardano-dashboard/app build     # production build
pnpm --filter=@cardano-dashboard/app start     # start built app
pnpm --filter=@cardano-dashboard/app lint      # run lint
pnpm --filter=@cardano-dashboard/app db:generate  # generate prisma client
pnpm --filter=@cardano-dashboard/app db:push      # push prisma schema to DB
pnpm --filter=@cardano-dashboard/app db:studio    # open Prisma Studio
```

## Project structure

- `packages/app`: Next.js application and APIs
- `packages/app/src/lib`: backend helpers and scheduler
- `packages/app/src/pages/api/cron/daily-tweet.ts`: daily tweet cron endpoint

## Troubleshooting

- If you see missing env vars, verify `.env` is in root and contains all required keys.
- Run `pnpm --filter=@cardano-dashboard/app dev` and check logs for startup errors.
- Use the daily parameter to bypass the cron job and run the daily metrics.

