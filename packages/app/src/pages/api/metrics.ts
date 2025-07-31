import { fetchCardanoMetrics } from "../../lib/cardanoMetrics.ts";
import { createTweetContent } from "../../lib/metricsFormatter.ts";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const metrics = await fetchCardanoMetrics();
		const tweetContent = createTweetContent(metrics);

		res.status(200).json({
			metrics,
			tweetPreview: tweetContent,
		});
	} catch (error) {
		console.error("Error fetching metrics:", error);
		res.status(500).json({ error: "Failed to fetch metrics" });
	}
}
