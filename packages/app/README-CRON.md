# Vercel Cron Jobs Setup

This project uses Vercel Cron Jobs to automatically post daily Cardano metrics tweets at 16:30 CET.

## Configuration

### 1. Vercel Configuration (`vercel.json`)
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-tweet",
      "schedule": "30 15 * * *"
    }
  ]
}
```

- **Schedule**: `30 15 * * *` runs at 15:30 UTC (16:30 CET)
- **Path**: `/api/cron/daily-tweet` - the API endpoint that will be called

### 2. API Endpoints

#### `/api/cron/daily-tweet`
- **Method**: POST only
- **Purpose**: Main cron job endpoint triggered by Vercel
- **Function**: Fetches fresh Cardano metrics and posts to Twitter

#### `/api/test/daily-tweet`
- **Method**: POST only
- **Purpose**: Manual testing endpoint
- **Function**: Allows manual triggering of the daily tweet for testing

## Environment Variables Required

Make sure these environment variables are set in your Vercel project:

- `X_API_KEY` - Twitter API Key
- `X_API_SECRET` - Twitter API Secret
- `X_ACCESS_TOKEN` - Twitter Access Token
- `X_ACCESS_TOKEN_SECRET` - Twitter Access Token Secret
- `BLOCKFROST_PROJECT_ID` - Blockfrost Project ID

## Testing

### Manual Test
You can manually trigger the daily tweet by making a POST request to:
```
POST /api/test/daily-tweet
```

### Check Status
The scheduler status is available through the existing status endpoint:
```
GET /api/status
```

## Migration from node-cron

The previous implementation used `node-cron` which doesn't work on Vercel's serverless functions. The new implementation:

1. ✅ Removes `node-cron` dependency
2. ✅ Uses Vercel's native cron job system
3. ✅ Maintains the same functionality
4. ✅ Provides manual testing capabilities
5. ✅ Keeps cache initialization on startup

## Deployment

After deploying to Vercel:

1. The cron job will be automatically registered
2. Daily tweets will be posted at 16:30 CET
3. You can monitor execution in Vercel's dashboard
4. Logs will be available in Vercel's function logs

## Troubleshooting

- Check Vercel function logs for execution details
- Verify environment variables are set correctly
- Use the test endpoint to verify functionality
- Monitor the status endpoint for system health 