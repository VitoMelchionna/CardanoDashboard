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
		tvl,
		stakedAda,
		totalSupply,
		treasuryAda,
		activeStakePools,
		transactions24h,
		activeWallets24h,
		adaPrice,
		epoch,
	} = metrics;

	const totalTvlAda = Math.round(stakedAda + (tvl / adaPrice) * 1000000);
	const totalTvlUsd = tvl + (stakedAda / 1000000) * adaPrice;

	return `Daily Cardano Metrics:

⏰ Uptime: ${uptime.toLocaleString("en-US")} days (100%)
💰 TVL: ₳${formatADA(totalTvlAda)} ($${formatNumber(totalTvlUsd)})
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
🖥️ Active Stake Pools: ${formatNumber(activeStakePools)}
📊 Transactions: ${formatNumber(transactions24h)}
👛 Active Wallets: ${formatNumber(activeWallets24h)}
⏳ Epoch: ${epoch}`;
}

export function calculatePercentageChange(current, previous) {
	if (!previous || previous === 0) return 0;
	return ((current - previous) / previous) * 100;
}

export function getChangeEmoji(percentage) {
	if (percentage > 0) return "↗";
	if (percentage < 0) return "↘";
	return "";
}

export function createWeeklyComparisonTweet(changes) {
	if (!changes) {
		return "Weekly Cardano Metrics:\n\n❌ Insufficient data for weekly comparison";
	}

	const formatChange = (change) => {
		const emoji = getChangeEmoji(change);
		const sign = change > 0 ? "+" : "";
		// Don't show decimals for 0% change
		const formattedChange = change === 0 ? "0" : change.toFixed(1);
		return `${sign}${formattedChange}% ${emoji}`;
	};

	return `Weekly Cardano Metrics Changes:

⏰ Uptime: ${formatChange(changes.uptime)}
💰 TVL: ${formatChange(changes.tvl)}
🔒 Staked $ADA: ${formatChange(changes.stakedAda)}
🏛️ Treasury: ${formatChange(changes.treasuryAda)}
🖥️ Active Stake Pools: ${formatChange(changes.activeStakePools)}
📊 Transactions: ${formatChange(changes.transactions)}
👛 Active Wallets: ${formatChange(changes.activeWallets)}
🪙 $ADA Price: ${formatChange(changes.adaPrice)}
`;
}
