import { startScheduler, stopScheduler } from "../../lib/scheduler.ts";

let isSchedulerRunning = false;

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { action } = req.body;

		if (action === "start") {
			if (!isSchedulerRunning) {
				startScheduler();
				isSchedulerRunning = true;
				res.status(200).json({
					success: true,
					message: "Scheduler started",
				});
			} else {
				res.status(200).json({
					success: true,
					message: "Scheduler already running",
				});
			}
		} else if (action === "stop") {
			stopScheduler();
			isSchedulerRunning = false;
			res.status(200).json({
				success: true,
				message: "Scheduler stopped",
			});
		} else {
			res.status(400).json({ error: "Invalid action" });
		}
	} else if (req.method === "GET") {
		res.status(200).json({ isRunning: isSchedulerRunning });
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
