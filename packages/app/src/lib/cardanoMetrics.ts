import CardanoAPI from "./cardanoApi.ts";
import { calculateUptime } from "./metricsFormatter.ts";

const CARDANO_GENESIS_DATE = "2017-09-23"; // Cardano mainnet launch

export async function fetchCardanoMetrics() {
	const cardanoApi = new CardanoAPI(
		process.env.BLOCKFROST_PROJECT_ID,
		process.env.MAESTRO_API_KEY,
		process.env.CARDANOSCAN_API_KEY
	);

	try {
		const [
			networkInfo,
			cardanoActivityMetrics,
			currentEpoch,
			adaPrice,
			activePools,
		] = await Promise.all([
			cardanoApi.getNetworkInfo(),
			cardanoApi.getCardanoActivityMetrics(),
			cardanoApi.getCurrentEpoch(),
			cardanoApi.getADAPrice(),
			cardanoApi.getActivePools(),
		]);

		// Calculate uptime
		const uptime = calculateUptime(CARDANO_GENESIS_DATE);

		// Get active pools count (Blockfrost returns paginated results, so we'll use network stake data)
		const activeStakePools = 2991;

		// Extract metrics from Blockfrost API responses
		const metrics = {
			uptime,
			tvl: networkInfo?.stake.active + 500000000000000 || 0, // staked ADA plus approx 1B as TVL proxy. TODO improve this
			stakedAda: networkInfo?.stake.active || 0,
			totalSupply: networkInfo?.supply.total || 45000000000000000, // Total supply
			treasuryAda: networkInfo?.supply.treasury || 0,
			activeStakePools: activePools.totalActivePools || activeStakePools,
			transactions24h: cardanoActivityMetrics?.transactionCount || 0,
			activeWallets24h: cardanoActivityMetrics?.activeWalletCount || 0,
			epoch: currentEpoch?.epoch_no || 0,
			adaPrice: adaPrice.cardano.usd || 0.87,
		};

		return metrics;
	} catch (error) {
		console.error("Error fetching Cardano metrics:", error);

		// Return fallback metrics if API fails
		return {
			uptime: calculateUptime(CARDANO_GENESIS_DATE),
			activeWallets24h: 130000,
			tvl: 35000000000000000, // 35B ADA in lovelaces as circulating supply
			stakedAda: 22000000000000000, // 24B ADA in lovelaces
			totalSupply: 38000000000000000, // 45B ADA in lovelaces
			treasuryAda: 1700000000000000, // 1.5B ADA in lovelaces
			activeStakePools: 3000,
			transactions24h: 95000,
			epoch: 490,
		};
	}
}
