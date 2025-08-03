import { fetchCardanoMetrics } from "../../lib/cardanoMetrics";
import { createTweetContent } from "../../lib/metricsFormatter";
import { getSchedulerStatus } from "../../lib/scheduler";
import { getCacheInfo } from "../../lib/metricsCache";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Always use cached metrics for the dashboard to avoid API calls
		const metrics = await fetchCardanoMetrics(false); // Never force refresh from dashboard
		const tweetContent = createTweetContent(metrics);
		const schedulerStatus = getSchedulerStatus();
		const cacheInfo = getCacheInfo();

		res.status(200).json({
			metrics,
			tweetPreview: tweetContent,
			scheduler: schedulerStatus,
			cache: {
				isFromCache: true,
				cachedAt: cacheInfo.cachedAt
					? new Date(cacheInfo.cachedAt).toISOString()
					: null,
				expiresAt: cacheInfo.expiresAt
					? new Date(cacheInfo.expiresAt).toISOString()
					: null,
				isExpired: cacheInfo.isExpired,
				hasCache: cacheInfo.hasCache,
			},
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
