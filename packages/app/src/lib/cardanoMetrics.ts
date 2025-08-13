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
			tvl,
		] = await Promise.all([
			cardanoApi.getNetworkInfo(),
			cardanoApi.getCardanoActivityMetrics(),
			cardanoApi.getCurrentEpoch(),
			cardanoApi.getADAPrice(),
			cardanoApi.getActivePools(),
			cardanoApi.getTVL(),
		]);

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
			stakedAda: networkInfo?.stake.active || 0,
			totalSupply: networkInfo?.supply.total || 0, // Total supply
			treasuryAda: networkInfo?.supply.treasury || 0,
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
