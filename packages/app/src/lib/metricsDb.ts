import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Gracefully close Prisma client on process exit
process.on("beforeExit", async () => {
	await prisma.$disconnect();
});

process.on("SIGINT", async () => {
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await prisma.$disconnect();
	process.exit(0);
});

export async function storeCardanoMetrics(metrics: any) {
	try {
		console.log("Attempting to save metrics to database...");
		const totalTvlAda = Math.round(
			metrics.stakedAda / 1000000 + metrics.tvl / metrics.adaPrice
		);
		const result = await prisma.cardanoMetrics.create({
			data: {
				uptime: metrics.uptime,
				tvl: totalTvlAda,
				stakedAda: metrics.stakedAda / 1000000, // Convert to ADA
				totalSupply: metrics.totalSupply / 1000000, // Convert to ADA
				treasuryAda: metrics.treasuryAda / 1000000, // Convert to ADA
				activeStakePools: metrics.activeStakePools,
				transactions24h: metrics.transactions24h,
				activeWallets24h: metrics.activeWallets24h,
				epoch: metrics.epoch,
				adaPrice: Math.round(metrics.adaPrice * 1000) / 1000,
			},
		});
		console.log("Successfully saved metrics with ID:", result.id);
		return result;
	} catch (error) {
		console.error("Error saving metrics to database:", error);
		throw error;
	}
}

export async function getMetricsFromLast7Days() {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	return await prisma.cardanoMetrics.findMany({
		where: {
			createdAt: {
				gte: sevenDaysAgo,
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});
}
