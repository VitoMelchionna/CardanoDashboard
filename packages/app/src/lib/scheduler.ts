import cron from "node-cron";
import TwitterAPI from "./twitterApi";
import { fetchCardanoMetrics } from "./cardanoMetrics";
import { createTweetContent } from "./metricsFormatter";
import { invalidateCache } from "./metricsCache";

let scheduledJob = null;
let isInitialized = false;

export function initializeScheduler() {
	if (isInitialized) {
		console.log("Scheduler already initialized");
		return;
	}

	if (scheduledJob) {
		scheduledJob.destroy();
	}

	// Schedule for 16:30 CET (15:30 UTC in winter, 14:30 UTC in summer)
	// Using 15:30 UTC as default
	scheduledJob = cron.schedule(
		"30 15 * * *",
		async () => {
			console.log("Running daily Cardano metrics tweet...");

			try {
				if (
					!process.env.X_API_KEY ||
					!process.env.BLOCKFROST_PROJECT_ID
				) {
					console.error("Missing required environment variables");
					return;
				}

				// Invalidate cache before fetching fresh data for the daily tweet
				console.log("Invalidating cache for fresh daily metrics...");
				invalidateCache();

				const twitterApi = new TwitterAPI({
					apiKey: process.env.X_API_KEY,
					apiSecret: process.env.X_API_SECRET,
					accessToken: process.env.X_ACCESS_TOKEN,
					accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
				});

				const metrics = await fetchCardanoMetrics(true);
				const tweetContent = createTweetContent(metrics);

				await twitterApi.postTweet(tweetContent);
				console.log("Daily tweet posted successfully!");
			} catch (error) {
				console.error("Error posting daily tweet:", error);
			}
		},
		{
			timezone: "Europe/Berlin", // CET timezone
		}
	);

	isInitialized = true;
	console.log(
		"Cardano Bot Scheduler initialized - Daily tweets at 16:30 CET"
	);

	// Pre-populate cache on startup if empty
	initializeCache();
}

async function initializeCache() {
	try {
		console.log("Initializing metrics cache on startup...");
		await fetchCardanoMetrics(); // This will cache the results
	} catch (error) {
		console.error("Error initializing cache:", error);
	}
}

export function getSchedulerStatus() {
	return {
		isRunning: isInitialized && scheduledJob !== null,
		nextRun: getNextRunTime(),
	};
}

export function getNextRunTime() {
	const now = new Date();
	const today = new Date(now);
	today.setHours(16, 30, 0, 0); // 16:30 CET

	// If it's past 16:30 today, schedule for tomorrow
	if (now > today) {
		today.setDate(today.getDate() + 1);
	}

	return today.toISOString();
}

// Auto-start scheduler when module is imported
if (typeof window === "undefined") {
	// Only run on server side
	initializeScheduler();
}
