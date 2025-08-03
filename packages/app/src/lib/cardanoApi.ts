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

		const DELAY_MS_PER_REQUEST = 150; // A safer delay (150ms > 1000ms/10 req/s)

		const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

		let transactionCount = 0;
		const activeAddresses = new Set<string>();

		let latestBlock;
		try {
			latestBlock = await this.blockfrostClient.blocksLatest();
		} catch (error) {
			if (
				error instanceof BlockfrostServerError &&
				error.status_code === 429
			) {
				console.error(
					"Rate limit hit while fetching latest block. Please wait and try again."
				);
			} else {
				console.error(
					"Failed to fetch latest block from Blockfrost:",
					error
				);
			}
			throw new Error("Could not retrieve latest blockchain data.");
		}
		await wait(DELAY_MS_PER_REQUEST); // Wait after a successful call

		if (!latestBlock || !latestBlock.height) {
			throw new Error("No latest block information available.");
		}

		let currentBlockNumber: number = latestBlock.height;
		const maxBlocksToCheck = 4320; // ~2 days of blocks as a buffer
		let blocksChecked = 0;
		const MAX_RETRIES = 3;

		while (currentBlockNumber >= 0 && blocksChecked < maxBlocksToCheck) {
			let block;
			let retries = 0;
			while (retries < MAX_RETRIES) {
				try {
					block = await this.blockfrostClient.blocks(
						currentBlockNumber
					);
					await wait(DELAY_MS_PER_REQUEST);
					break; // Success, exit retry loop
				} catch (error) {
					if (
						error instanceof BlockfrostServerError &&
						error.status_code === 429
					) {
						retries++;
						console.warn(
							`Rate limit hit fetching block ${currentBlockNumber}. Retrying in ${
								retries * 2
							} seconds...`
						);
						await wait(retries * 2000); // Back off and wait longer
					} else {
						console.error(
							`Failed to fetch block ${currentBlockNumber}:`,
							error
						);
						block = null; // Mark as failed
						break; // Don't retry other types of errors
					}
				}
			}

			if (!block || block.time < twentyFourHoursAgo) {
				// If block fetching failed, or it's too old, stop.
				break;
			}

			let txHashesInBlock: string[];
			try {
				txHashesInBlock = await this.blockfrostClient.blocksTxs(
					block.hash
				);
				await wait(DELAY_MS_PER_REQUEST);
				transactionCount += txHashesInBlock.length;
			} catch (error) {
				console.warn(
					`Could not fetch transaction hashes for block ${block.hash}, skipping. Error:`,
					error
				);
				currentBlockNumber--;
				blocksChecked++;
				continue;
			}

			// Process transactions to get addresses
			for (const txHash of txHashesInBlock) {
				try {
					const txUtxos = await this.blockfrostClient.txsUtxos(
						txHash
					);
					await wait(DELAY_MS_PER_REQUEST);

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

		return {
			transactionCount: transactionCount,
			activeWalletCount: activeAddresses.size,
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
