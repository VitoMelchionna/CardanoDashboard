import TwitterAPI from "./twitterApi";
import { fetchCardanoMetrics } from "./cardanoMetrics";
import { createTweetContent } from "./metricsFormatter";
import { invalidateCache } from "./metricsCache";

let isInitialized = false;

export function initializeScheduler() {
	if (isInitialized) {
		console.log("Scheduler already initialized");
		return;
	}

	isInitialized = true;
	console.log(
		"Cardano Bot Scheduler initialized - Daily tweets handled by Vercel Cron Jobs"
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
		isRunning: isInitialized,
		nextRun: getNextRunTime(),
		platform: "vercel-cron"
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

// Manual trigger function for testing
export async function triggerDailyTweet() {
	console.log("Manually triggering daily Cardano metrics tweet...");

	try {
		if (!process.env.X_API_KEY || !process.env.BLOCKFROST_PROJECT_ID) {
			console.error("Missing required environment variables");
			throw new Error("Missing required environment variables");
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
		return { success: true, message: "Daily tweet posted successfully" };
	} catch (error) {
		console.error("Error posting daily tweet:", error);
		throw error;
	}
}

// Auto-start scheduler when module is imported (only for cache initialization)
if (typeof window === "undefined") {
	// Only run on server side
	initializeScheduler();
}
