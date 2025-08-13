import { NextApiRequest, NextApiResponse } from "next";
import TwitterAPI from "../../../lib/twitterApi";
import { fetchCardanoMetrics } from "../../../lib/cardanoMetrics";
import { createTweetContent } from "../../../lib/metricsFormatter";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Allow both GET (Vercel cron jobs) and POST (manual testing) requests
	if (req.method !== "GET" && req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	/*console.log("Running daily Cardano metrics tweet...");

	// Set a longer timeout for this endpoint
	res.setTimeout(300000); // 5 minutes timeout

	try {
		// Verify required environment variables
		if (!process.env.X_API_KEY || !process.env.BLOCKFROST_PROJECT_ID) {
			console.error("Missing required environment variables");
			return res
				.status(500)
				.json({ error: "Missing required environment variables" });
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

		const metrics = await fetchCardanoMetrics();
		const tweetContent = createTweetContent(metrics);

		await twitterApi.postTweet(tweetContent);
		console.log("Daily tweet posted successfully!");

		return res.status(200).json({
			success: true,
			message: "Daily tweet posted successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error posting daily tweet:", error);
		return res.status(500).json({
			error: "Failed to post daily tweet",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}*/
}
