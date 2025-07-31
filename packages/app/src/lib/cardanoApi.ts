import axios from "axios";

const BLOCKFROST_BASE_URL = "https://cardano-mainnet.blockfrost.io/api/v0";

class CardanoAPI {
	projectId;
	axiosClient;

	constructor(projectId) {
		this.projectId = projectId;
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

	async getLatestBlock() {
		try {
			const response = await this.axiosClient.get("/blocks/latest");
			return response.data;
		} catch (error) {
			console.error("Error fetching latest block:", error);
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
