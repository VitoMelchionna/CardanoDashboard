import TwitterAPI from "./twitterApi";
import { fetchCardanoMetrics } from "./cardanoMetrics";
import { createTweetContent } from "./metricsFormatter";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });

// Manual trigger function for testing
export async function triggerDailyTweet() {
	console.log("Triggering daily Cardano metrics tweet...");

	try {
		if (!process.env.X_API_KEY || !process.env.BLOCKFROST_PROJECT_ID) {
			console.error("Missing required environment variables");
			throw new Error("Missing required environment variables");
		}

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
		return { success: true, message: "Daily tweet posted successfully" };
	} catch (error) {
		console.error("Error posting daily tweet:", error);
		throw error;
	}
}

cron.schedule(
	"0 15 * * *",
	() => {
		triggerDailyTweet();
	},
	{
		timezone: "Europe/Paris",
	}
);

console.log(
	"Scheduler started. Daily tweet will be triggered at 15:30 CET (Europe/Paris timezone)."
);

// Allow manual run for testing
if (require.main === module) {
	const arg = process.argv[2];
	if (arg === "test") {
		triggerDailyTweet();
	}
}
