import CardanoAPI from "./cardanoApi.ts";
import { calculateUptime } from "./metricsFormatter.ts";
import { getMetricsFromLast7Days } from "./metricsDb.ts";

const CARDANO_GENESIS_DATE = "2017-09-23"; // Cardano mainnet launch

export async function fetchCardanoMetrics() {
	const cardanoApi = new CardanoAPI(
		process.env.BLOCKFROST_PROJECT_ID,
		process.env.MAESTRO_API_KEY,
		process.env.CARDANOSCAN_API_KEY
	);

	try {
		const [networkInfo, currentEpoch, adaPrice, activePools, tvl] =
			await Promise.all([
				cardanoApi.getNetworkInfo(),
				cardanoApi.getCurrentEpoch(),
				cardanoApi.getADAPrice(),
				cardanoApi.getActivePools(),
				cardanoApi.getTVL(),
			]);

		// Fetch separately as it requires more time and more API calls
		const cardanoActivityMetrics =
			await cardanoApi.getCardanoActivityMetrics();

		// Calculate uptime
		const uptime = calculateUptime(CARDANO_GENESIS_DATE);

		if (
			!networkInfo ||
			!currentEpoch ||
			!adaPrice ||
			!activePools ||
			!tvl
		) {
			throw new Error("Failed to fetch essential Cardano metrics");
		}

		// Extract metrics from Blockfrost API responses
		const metrics = {
			uptime,
			tvl: tvl || 0, // DeFi TVL in USD
			stakedAda: Number(networkInfo?.stake.active) || 0,
			totalSupply: Number(networkInfo?.supply.total) || 0, // Total supply
			treasuryAda: Number(networkInfo?.supply.treasury) || 0,
			activeStakePools: activePools?.totalActivePools || 0,
			transactions24h: cardanoActivityMetrics?.transactionCount || 0,
			activeWallets24h: cardanoActivityMetrics?.activeWalletCount || 0,
			epoch: currentEpoch?.epoch_no || 0,
			adaPrice: adaPrice?.cardano.usd || 0.87,
		};

		return metrics;
	} catch (error) {
		console.error("Error fetching Cardano metrics:", error);

		// Return empty object if any error occurs
		return {};
	}
}

export function calculateMinMaxPercentageChange(values) {
	if (!values || values.length === 0) return 0;

	const min = Math.min(...values);
	const max = Math.max(...values);

	if (min === 0) return 0;

	// Calculate percentage change from min to max
	return ((max - min) / min) * 100;
}

export async function getWeeklyMetricsChanges() {
	const metricsData = await getMetricsFromLast7Days();

	if (!metricsData || metricsData.length < 2) {
		return null; // Insufficient data
	}

	// Extract all values for each metric
	const uptimeValues = metricsData.map((m) => m.uptime);
	const tvlValues = metricsData.map((m) => m.tvl);
	const stakedAdaValues = metricsData.map((m) => m.stakedAda);
	const treasuryAdaValues = metricsData.map((m) => m.treasuryAda);
	const activeStakePoolsValues = metricsData.map((m) => m.activeStakePools);
	const transactionsValues = metricsData.map((m) => m.transactions24h);
	const activeWalletsValues = metricsData.map((m) => m.activeWallets24h);
	const adaPriceValues = metricsData.map((m) => m.adaPrice);

	// Calculate min/max changes for each metric
	const changes = {
		uptime: calculateMinMaxPercentageChange(uptimeValues),
		tvl: calculateMinMaxPercentageChange(tvlValues),
		stakedAda: calculateMinMaxPercentageChange(stakedAdaValues),
		treasuryAda: calculateMinMaxPercentageChange(treasuryAdaValues),
		activeStakePools: calculateMinMaxPercentageChange(
			activeStakePoolsValues
		),
		transactions: calculateMinMaxPercentageChange(transactionsValues),
		activeWallets: calculateMinMaxPercentageChange(activeWalletsValues),
		adaPrice: calculateMinMaxPercentageChange(adaPriceValues),
	};

	return changes;
}
