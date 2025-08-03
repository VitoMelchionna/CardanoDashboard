let metricsCache = {
	data: null,
	timestamp: null,
	expiresAt: null,
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function getCachedMetrics() {
	const now = Date.now();

	// Check if cache exists and is still valid
	if (
		metricsCache.data &&
		metricsCache.expiresAt &&
		now < metricsCache.expiresAt
	) {
		console.log(
			"Returning cached metrics, expires at:",
			new Date(metricsCache.expiresAt).toISOString()
		);
		return {
			metrics: metricsCache.data,
			isFromCache: true,
			cachedAt: metricsCache.timestamp,
			expiresAt: metricsCache.expiresAt,
		};
	}

	console.log("Cache miss or expired");
	return null;
}

export function setCachedMetrics(metrics) {
	const now = Date.now();
	const expiresAt = now + CACHE_DURATION;

	metricsCache = {
		data: metrics,
		timestamp: now,
		expiresAt: expiresAt,
	};

	console.log("Metrics cached until:", new Date(expiresAt).toISOString());
	return metricsCache;
}

export function invalidateCache() {
	console.log("Cache invalidated");
	metricsCache = {
		data: null,
		timestamp: null,
		expiresAt: null,
	};
}

export function getCacheInfo() {
	return {
		hasCache: !!metricsCache.data,
		cachedAt: metricsCache.timestamp,
		expiresAt: metricsCache.expiresAt,
		isExpired: metricsCache.expiresAt
			? Date.now() > metricsCache.expiresAt
			: true,
	};
}
