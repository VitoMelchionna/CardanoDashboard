import TwitterAPI from "../../lib/twitterApi.ts";
import { fetchCardanoMetrics } from "../../lib/cardanoMetrics.ts";
import { createTweetContent } from "../../lib/metricsFormatter.ts";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const twitterApi = new TwitterAPI({
			apiKey: process.env.X_API_KEY,
			apiSecret: process.env.X_API_SECRET,
			accessToken: process.env.X_ACCESS_TOKEN,
			accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
		});

		const metrics = await fetchCardanoMetrics();
		const tweetContent = createTweetContent(metrics);

		const tweet = await twitterApi.postTweet(tweetContent);

		res.status(200).json({
			success: true,
			tweetId: tweet.data.id,
			content: tweetContent,
		});
	} catch (error) {
		console.log(error);
		console.error("Error posting tweet:", error);
		res.status(500).json({ error: "Failed to post tweet" });
	}
}
