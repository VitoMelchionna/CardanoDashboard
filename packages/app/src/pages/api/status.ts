import { fetchCardanoMetrics } from "../../lib/cardanoMetrics";
import { createTweetContent } from "../../lib/metricsFormatter";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Always use cached metrics for the dashboard to avoid API calls
		const metrics = await fetchCardanoMetrics(); // Never force refresh from dashboard

		if (!metrics) {
			return res.status(200).json({});
		}

		const tweetContent = createTweetContent(metrics);

		return res.status(200).json({
			metrics,
			tweetPreview: tweetContent,
			scheduler: undefined,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error fetching status:", error);
		res.status(500).json({
			error: "Failed to fetch status",
			details: error.message,
		});
	}
}
