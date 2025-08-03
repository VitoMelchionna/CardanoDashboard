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
