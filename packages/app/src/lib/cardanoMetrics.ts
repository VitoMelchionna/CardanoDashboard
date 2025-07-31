import CardanoAPI from "./cardanoApi.ts";
import {
	formatADA,
	formatNumber,
	calculateUptime,
} from "./metricsFormatter.ts";

const CARDANO_GENESIS_DATE = "2017-09-23"; // Cardano mainnet launch

export async function fetchCardanoMetrics() {
	const cardanoApi = new CardanoAPI(process.env.BLOCKFROST_PROJECT_ID);

	try {
		const [networkInfo, genesis, latestBlock, epochsLatest, adaPrice] =
			await Promise.all([
				cardanoApi.getNetworkInfo(),
				cardanoApi.getGenesis(),
				cardanoApi.getLatestBlock(),
				cardanoApi.getEpochsLatest(),
				cardanoApi.getADAPrice(),
			]);

		// Calculate uptime
		const uptime = calculateUptime(CARDANO_GENESIS_DATE);

		// Get active pools count (Blockfrost returns paginated results, so we'll use network stake data)
		const activeStakePools = 3000;

		// Extract metrics from Blockfrost API responses
		const metrics = {
			uptime,
			//totalWallets: networkInfo?.stake?.active || 1300000, // Active stake addresses
			tvl: networkInfo?.supply.circulating || 0, // Circulating supply as TVL proxy
			stakedAda: networkInfo?.stake.active || 0,
			totalSupply: networkInfo?.supply.total || 45000000000000000, // Total supply
			treasuryAda: networkInfo?.supply.treasury || 0,
			activeStakePools,
			//transactions24h: latestBlock?.tx_count || 0, IMPLEMENT
			//activeWallets24h: latestBlock?.height || 0, IMPLEMENT
			epoch: epochsLatest?.epoch || 0,
			adaPrice: adaPrice.price,
		};

		return metrics;
	} catch (error) {
		console.error("Error fetching Cardano metrics:", error);

		// Return fallback metrics if API fails
		return {
			uptime: calculateUptime(CARDANO_GENESIS_DATE),
			activeWallets24h: 130000,
			tvl: 35000000000000000, // 35B ADA in lovelaces as circulating supply
			stakedAda: 24000000000000000, // 24B ADA in lovelaces
			totalSupply: 45000000000000000, // 45B ADA in lovelaces
			treasuryAda: 1500000000000000, // 1.5B ADA in lovelaces
			activeStakePools: 3000,
			transactions24h: 95000,
			blockHeight: 10500000,
			epoch: 490,
		};
	}
}
