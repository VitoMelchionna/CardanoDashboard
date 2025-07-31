export function formatADA(lovelaces) {
	if (!lovelaces) return "0";
	const ada = lovelaces / 1000000;
	if (ada >= 1000000000) {
		return `${(ada / 1000000000).toFixed(1)}B`;
	} else if (ada >= 1000000) {
		return `${(ada / 1000000).toFixed(1)}M`;
	} else if (ada >= 1000) {
		return `${(ada / 1000).toFixed(1)}K`;
	}
	return ada.toFixed(2);
}

export function formatNumber(num) {
	if (!num) return "0";
	if (num >= 1000000000) {
		return `${(num / 1000000000).toFixed(1)}B`;
	} else if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	} else if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toLocaleString();
}

export function calculateUptime(startDate) {
	const start = new Date(startDate);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - start.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function createTweetContent(metrics) {
	const {
		uptime,
		totalWallets,
		tvl,
		stakedAda,
		totalSupply,
		treasuryAda,
		activeStakePools,
		transactions24h,
		blockHeight,
		adaPrice,
	} = metrics;

	return `🚀 Daily Cardano Metrics Update

⏰ Uptime: ${formatNumber(uptime)} days uninterrupted
💰 TVL: ₳${formatADA(tvl)} ($${formatNumber((tvl / 1000000) * adaPrice)})
🔒 Staked $ADA: ₳${formatADA(stakedAda)} (${(
		(stakedAda / totalSupply) *
		100
	).toFixed(1)}%)
🪙 Total Supply: ₳${formatADA(totalSupply)} ($${formatNumber(
		(totalSupply / 1000000) * adaPrice
	)})
🏛️ Treasury: ₳${formatADA(treasuryAda)} ($${formatNumber(
		(treasuryAda / 1000000) * adaPrice
	)})
🖥️ Active Pools: ${formatNumber(activeStakePools)}
📊 24h Transactions: ${formatNumber(transactions24h)}
🧱 Block Height: ${formatNumber(blockHeight)}`;
}
