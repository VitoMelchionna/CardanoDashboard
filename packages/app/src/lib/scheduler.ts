import cron from "node-cron";
import TwitterAPI from "./twitterApi.ts";
import { fetchCardanoMetrics } from "./cardanoMetrics.ts";
import { createTweetContent } from "./metricsFormatter.ts";

let scheduledJob = null;

export function startScheduler() {
	if (scheduledJob) {
		scheduledJob.destroy();
	}

	// Schedule for 16:30 CET (15:30 UTC in winter, 14:30 UTC in summer)
	// Using 15:30 UTC as default - adjust based on your needs
	scheduledJob = cron.schedule(
		"30 15 * * *",
		async () => {
			console.log("Running daily Cardano metrics tweet...");

			try {
				const twitterApi = new TwitterAPI({
					apiKey: process.env.X_API_KEY,
					apiSecret: process.env.X_API_SECRET,
					accessToken: process.env.X_ACCESS_TOKEN,
					accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
				});

				const metrics = await fetchCardanoMetrics();
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

	console.log("Scheduler started - Daily tweets at 16:30 CET");
}

export function stopScheduler() {
	if (scheduledJob) {
		scheduledJob.destroy();
		scheduledJob = null;
		console.log("Scheduler stopped");
	}
}
