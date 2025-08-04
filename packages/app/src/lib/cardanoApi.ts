import axios from "axios";
import {
	BlockFrostAPI,
	BlockfrostServerError,
} from "@blockfrost/blockfrost-js";

const BLOCKFROST_BASE_URL = "https://cardano-mainnet.blockfrost.io/api/v0";

class CardanoAPI {
	projectId;
	axiosClient;
	blockfrostClient;

	constructor(projectId) {
		this.projectId = projectId;
		this.blockfrostClient = new BlockFrostAPI({
			projectId: projectId,
			requestTimeout: 10000,
		});
		this.axiosClient = axios.create({
			baseURL: BLOCKFROST_BASE_URL,
			headers: {
				project_id: projectId,
				"Content-Type": "application/json",
			},
		});
	}

	async getNetworkInfo() {
		try {
			const response = await this.axiosClient.get("/network");
			return response.data;
		} catch (error) {
			console.error("Error fetching network info:", error);
			throw error;
		}
	}

	async getGenesis() {
		try {
			const response = await this.axiosClient.get("/genesis");
			return response.data;
		} catch (error) {
			console.error("Error fetching genesis:", error);
			throw error;
		}
	}

	async getAccountsStats() {
		try {
			const response = await this.axiosClient.get("/accounts");
			return response.data;
		} catch (error) {
			console.error("Error fetching accounts stats:", error);
			throw error;
		}
	}

	async getPoolsStats() {
		try {
			const response = await this.axiosClient.get("/pools");
			return response.data;
		} catch (error) {
			console.error("Error fetching pools stats:", error);
			throw error;
		}
	}

	async getEpochsLatest() {
		try {
			const response = await this.axiosClient.get("/epochs/latest");
			return response.data;
		} catch (error) {
			console.error("Error fetching latest epoch:", error);
			throw error;
		}
	}

	async getActivePools() {
		try {
			const response = await this.axiosClient.get("/pools");
			return response.data;
		} catch (error) {
			console.error("Error fetching total supply:", error);
			throw error;
		}
	}

	async getCardanoActivityMetrics(): Promise<{
		transactionCount: number;
		activeWalletCount: number;
	}> {
		const wait = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		const DELAY_MS_PER_REQUEST = 100; // Reduced delay for faster processing
		const MAX_BLOCKS_TO_CHECK = 1440; // ~1 day of blocks (1440 blocks per day)
		const MAX_RETRIES = 2; // Reduced retries for faster failure

		const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

		let transactionCount = 0;
		const activeAddresses = new Set<string>();

		// Get latest block
		let latestBlock;
		try {
			latestBlock = await this.blockfrostClient.blocksLatest();
			await wait(DELAY_MS_PER_REQUEST);
		} catch (error) {
			console.error(
				"Failed to fetch latest block from Blockfrost:",
				error
			);
			throw new Error("Could not retrieve latest blockchain data.");
		}

		if (!latestBlock || !latestBlock.height) {
			throw new Error("No latest block information available.");
		}

		let currentBlockNumber: number = latestBlock.height;
		let blocksChecked = 0;

		// Process blocks in batches for better performance
		while (currentBlockNumber >= 0 && blocksChecked < MAX_BLOCKS_TO_CHECK) {
			let block;
			let retries = 0;

			// Try to fetch block with retries
			while (retries < MAX_RETRIES) {
				try {
					block = await this.blockfrostClient.blocks(
						currentBlockNumber
					);
					await wait(DELAY_MS_PER_REQUEST);
					break;
				} catch (error) {
					if (
						error instanceof BlockfrostServerError &&
						error.status_code === 429
					) {
						retries++;
						console.warn(
							`Rate limit hit fetching block ${currentBlockNumber}. Retrying...`
						);
						await wait(retries * 1000); // Shorter backoff
					} else {
						console.warn(
							`Failed to fetch block ${currentBlockNumber}:`,
							error
						);
						block = null;
						break;
					}
				}
			}

			if (!block || block.time < twentyFourHoursAgo) {
				break; // Stop if block is too old or failed to fetch
			}

			// Get transaction hashes for this block
			let txHashesInBlock: string[];
			try {
				txHashesInBlock = await this.blockfrostClient.blocksTxs(
					block.hash
				);
				await wait(DELAY_MS_PER_REQUEST);
				transactionCount += txHashesInBlock.length;
			} catch (error) {
				console.warn(
					`Could not fetch transaction hashes for block ${block.hash}, skipping.`
				);
				currentBlockNumber--;
				blocksChecked++;
				continue;
			}

			// Process only first 10 transactions per block for performance
			// This gives us a good sample without overwhelming the API
			const transactionsToProcess = txHashesInBlock.slice(0, 10);

			for (const txHash of transactionsToProcess) {
				try {
					const txUtxos = await this.blockfrostClient.txsUtxos(
						txHash
					);
					await wait(DELAY_MS_PER_REQUEST);

					// Add addresses from inputs and outputs
					for (const input of txUtxos.inputs) {
						if (input.address) activeAddresses.add(input.address);
					}
					for (const output of txUtxos.outputs) {
						if (output.address) activeAddresses.add(output.address);
					}
				} catch (txError) {
					console.warn(
						`Could not fetch UTXOs for transaction ${txHash}:`,
						txError
					);
				}
			}

			currentBlockNumber--;
			blocksChecked++;
		}

		// Estimate total active wallets based on sample
		// If we processed 10 transactions per block, scale up the count
		const estimatedActiveWallets = Math.round(
			activeAddresses.size * (transactionCount / (blocksChecked * 10))
		);

		return {
			transactionCount: transactionCount,
			activeWalletCount: estimatedActiveWallets,
		};
	}

	async getADAPrice() {
		try {
			const response = await fetch(
				"https://api.price2sheet.com/json/ada/usd"
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching total supply:", error);
			throw error;
		}
	}
}

export default CardanoAPI;
