import { useState, useEffect } from "react";

export default function Home() {
	const [metrics, setMetrics] = useState(null);
	const [tweetPreview, setTweetPreview] = useState("");
	const [isSchedulerRunning, setIsSchedulerRunning] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchMetrics();
		checkSchedulerStatus();
	}, []);

	const fetchMetrics = async () => {
		try {
			const response = await fetch("/api/metrics");
			const data = await response.json();
			setMetrics(data.metrics);
			setTweetPreview(data.tweetPreview);
		} catch (error) {
			console.error("Error fetching metrics:", error);
		}
	};

	const checkSchedulerStatus = async () => {
		try {
			const response = await fetch("/api/scheduler");
			const data = await response.json();
			setIsSchedulerRunning(data.isRunning);
		} catch (error) {
			console.error("Error checking scheduler status:", error);
		}
	};

	const toggleScheduler = async () => {
		try {
			setLoading(true);
			const action = isSchedulerRunning ? "stop" : "start";
			const response = await fetch("/api/scheduler", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action }),
			});

			if (response.ok) {
				setIsSchedulerRunning(!isSchedulerRunning);
			}
		} catch (error) {
			console.error("Error toggling scheduler:", error);
		} finally {
			setLoading(false);
		}
	};

	const postTweetNow = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/post-now", {
				method: "POST",
			});

			if (response.ok) {
				alert("Tweet posted successfully!");
			} else {
				alert("Failed to post tweet");
			}
		} catch (error) {
			console.error("Error posting tweet:", error);
			alert("Error posting tweet");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>🚀 Cardano Daily Metrics Bot</h1>

			<div style={{ marginBottom: "20px" }}>
				<h2>Scheduler Status</h2>
				<p>
					Status: {isSchedulerRunning ? "🟢 Running" : "🔴 Stopped"}
				</p>
				<p>Next tweet: Daily at 16:30 CET</p>
				<button
					onClick={toggleScheduler}
					disabled={loading}
					style={{
						padding: "10px 20px",
						marginRight: "10px",
						backgroundColor: isSchedulerRunning
							? "#dc3545"
							: "#28a745",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					{loading
						? "Loading..."
						: isSchedulerRunning
						? "Stop Scheduler"
						: "Start Scheduler"}
				</button>

				<button
					onClick={postTweetNow}
					disabled={loading}
					style={{
						padding: "10px 20px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					{loading ? "Posting..." : "Post Tweet Now"}
				</button>
			</div>

			{tweetPreview && (
				<div style={{ marginBottom: "20px" }}>
					<h2>Tweet Preview</h2>
					<div
						style={{
							border: "1px solid #ccc",
							padding: "15px",
							borderRadius: "5px",
							backgroundColor: "#f8f9fa",
							whiteSpace: "pre-line",
							fontFamily: "monospace",
						}}
					>
						{tweetPreview}
					</div>
				</div>
			)}

			<div>
				<h2>Current Metrics</h2>
				<button onClick={fetchMetrics} style={{ marginBottom: "10px" }}>
					🔄 Refresh Metrics
				</button>

				{metrics && (
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fit, minmax(200px, 1fr))",
							gap: "10px",
						}}
					>
						<div
							style={{
								border: "1px solid #ddd",
								padding: "10px",
								borderRadius: "5px",
							}}
						>
							<strong>⏰ Uptime:</strong>
							<br />
							{metrics.uptime.toLocaleString()} days
						</div>
						{/* <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <strong>👛 Wallets:</strong><br />
              {metrics.totalWallets.toLocaleString()}
            </div>*/}
						<div
							style={{
								border: "1px solid #ddd",
								padding: "10px",
								borderRadius: "5px",
							}}
						>
							<strong>🥩 Staked ADA:</strong>
							<br />₳
							{(metrics.stakedAda / 1000000).toLocaleString()}
						</div>
						<div
							style={{
								border: "1px solid #ddd",
								padding: "10px",
								borderRadius: "5px",
							}}
						>
							<strong>🧱 Block Height:</strong>
							<br />
							{metrics.blockHeight.toLocaleString()}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
