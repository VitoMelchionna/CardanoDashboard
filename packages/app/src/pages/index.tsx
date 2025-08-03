import { useState, useEffect } from "react";

export default function Home() {
	const [status, setStatus] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState(null);

	useEffect(() => {
		fetchStatus();
		// Refresh data every 5 minutes
		const interval = setInterval(fetchStatus, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const fetchStatus = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/status");
			const data = await response.json();
			setStatus(data);
			setLastUpdated(new Date());
		} catch (error) {
			console.error("Error fetching status:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatNextRunTime = (isoString) => {
		if (!isoString) return "Unknown";
		const date = new Date(isoString);
		return date.toLocaleString("en-US", {
			timeZone: "Europe/Berlin",
			dateStyle: "medium",
			timeStyle: "short",
		});
	};

	const formatMetricValue = (value, type = "number") => {
		if (!value) return "0";

		if (type === "ada") {
			const ada = value / 1000000;
			if (ada >= 1000000000) return `₳${(ada / 1000000000).toFixed(1)}B`;
			if (ada >= 1000000) return `₳${(ada / 1000000).toFixed(1)}M`;
			return `₳${ada.toLocaleString()}`;
		}

		if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toLocaleString();
	};

	if (loading && !status) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontFamily: "system-ui, -apple-system, sans-serif",
				}}
			>
				<div style={{ textAlign: "center" }}>
					<div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
						🚀
					</div>
					<div>Loading Cardano metrics...</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				maxWidth: "1200px",
				margin: "0 auto",
				padding: "20px",
				fontFamily: "system-ui, -apple-system, sans-serif",
				lineHeight: "1.6",
			}}
		>
			{/* Header */}
			<div style={{ textAlign: "center", marginBottom: "3rem" }}>
				<h1
					style={{
						fontSize: "3rem",
						margin: "0 0 1rem 0",
						background: "linear-gradient(135deg, #0033AD, #00D4FF)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}
				>
					🚀 CardanoDash Bot
				</h1>
				<p
					style={{
						fontSize: "1.2rem",
						color: "#666",
						margin: "0 0 2rem 0",
					}}
				>
					Daily Cardano metrics automatically posted to X
				</p>

				{/* Follow Button */}
				<a
					href="https://x.com/CardanoDash"
					target="_blank"
					rel="noopener noreferrer"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.5rem",
						padding: "12px 24px",
						backgroundColor: "#1DA1F2",
						color: "white",
						textDecoration: "none",
						borderRadius: "25px",
						fontWeight: "bold",
						fontSize: "1.1rem",
						transition: "transform 0.2s",
						border: "none",
						cursor: "pointer",
					}}
				>
					Follow @CardanoDash on X
				</a>
			</div>

			{/* Cache Information */}
			{status?.cache && (
				<div
					style={{
						background: status?.cache?.isExpired
							? "#fff3cd"
							: "#d1ecf1",
						border: `1px solid ${
							status?.cache?.isExpired ? "#ffeaa7" : "#bee5eb"
						}`,
						borderRadius: "8px",
						padding: "1rem",
						marginBottom: "2rem",
						textAlign: "center",
					}}
				>
					<div style={{ fontSize: "0.9rem", color: "#333" }}>
						{status.cache.hasCache ? (
							<>
								📊 Showing cached data from{" "}
								{new Date(
									status.cache.cachedAt
								).toLocaleString()}
								{status.cache.isExpired ? (
									<div
										style={{
											color: "#856404",
											marginTop: "0.5rem",
										}}
									>
										⚠️ Cache expired - will refresh at next
										scheduled tweet
									</div>
								) : (
									<div
										style={{
											color: "#0c5460",
											marginTop: "0.5rem",
										}}
									>
										✅ Fresh cache expires at{" "}
										{new Date(
											status.cache.expiresAt
										).toLocaleString()}
									</div>
								)}
							</>
						) : (
							"🔄 Loading fresh data..."
						)}
					</div>
				</div>
			)}

			{/* Status Cards */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
					gap: "1.5rem",
					marginBottom: "3rem",
				}}
			>
				{/* Bot Status */}
				<div
					style={{
						background: "white",
						padding: "1.5rem",
						borderRadius: "12px",
						border: "1px solid #e0e0e0",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					}}
				>
					<h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
						🤖 Bot Status
					</h3>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							marginBottom: "0.5rem",
						}}
					>
						<span
							style={{
								width: "12px",
								height: "12px",
								borderRadius: "50%",
								backgroundColor: status?.scheduler?.isRunning
									? "#22c55e"
									: "#ef4444",
								display: "inline-block",
							}}
						></span>
						<strong>
							{status?.scheduler?.isRunning
								? "Active"
								: "Inactive"}
						</strong>
					</div>
					<div style={{ fontSize: "0.9rem", color: "#666" }}>
						Auto-posting daily at 16:30 CET
					</div>
				</div>

				{/* Next Tweet */}
				<div
					style={{
						background: "white",
						padding: "1.5rem",
						borderRadius: "12px",
						border: "1px solid #e0e0e0",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					}}
				>
					<h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
						⏰ Next Tweet
					</h3>
					<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
						{formatNextRunTime(status?.scheduler?.nextRun)}
					</div>
					<div style={{ fontSize: "0.9rem", color: "#666" }}>
						Central European Time (CET)
					</div>
				</div>

				{/* Cache Status */}
				<div
					style={{
						background: "white",
						padding: "1.5rem",
						borderRadius: "12px",
						border: "1px solid #e0e0e0",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					}}
				>
					<h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
						💾 Data Cache
					</h3>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							marginBottom: "0.5rem",
						}}
					>
						<span
							style={{
								width: "12px",
								height: "12px",
								borderRadius: "50%",
								backgroundColor:
									status?.cache?.hasCache &&
									!status?.cache?.isExpired
										? "#22c55e"
										: "#f59e0b",
								display: "inline-block",
							}}
						></span>
						<strong>
							{status?.cache?.hasCache
								? status?.cache?.isExpired
									? "Expired"
									: "Fresh"
								: "No Cache"}
						</strong>
					</div>
					<div style={{ fontSize: "0.9rem", color: "#666" }}>
						{status?.cache?.cachedAt
							? `Cached: ${new Date(
									status.cache.cachedAt
							  ).toLocaleString()}`
							: "No cached data"}
					</div>
				</div>

				{/* Last Updated */}
				<div
					style={{
						background: "white",
						padding: "1.5rem",
						borderRadius: "12px",
						border: "1px solid #e0e0e0",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					}}
				>
					<h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
						🔄 Last Updated
					</h3>
					<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
						{lastUpdated
							? lastUpdated.toLocaleTimeString()
							: "Never"}
					</div>
					<button
						onClick={fetchStatus}
						disabled={loading}
						style={{
							background: "none",
							border: "1px solid #0033AD",
							color: "#0033AD",
							padding: "4px 8px",
							borderRadius: "4px",
							fontSize: "0.8rem",
							cursor: "pointer",
						}}
					>
						{loading ? "..." : "Refresh"}
					</button>
				</div>
			</div>

			{/* Current Metrics */}
			{status?.metrics && (
				<div style={{ marginBottom: "3rem" }}>
					<h2
						style={{
							textAlign: "center",
							marginBottom: "2rem",
							color: "#333",
						}}
					>
						📊 Current Cardano Metrics
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fit, minmax(200px, 1fr))",
							gap: "1rem",
						}}
					>
						{[
							{
								label: "⏰ Uptime",
								value: status.metrics.uptime,
								suffix: " days",
							},
							{
								label: "👛 Active Addresses",
								value: formatMetricValue(
									status.metrics.totalWallets
								),
							},
							{
								label: "🪙 Circulating",
								value: formatMetricValue(
									status.metrics.tvl,
									"ada"
								),
							},
							{
								label: "🥩 Staked ADA",
								value: formatMetricValue(
									status.metrics.stakedAda,
									"ada"
								),
							},
							{
								label: "🏛️ Treasury",
								value: formatMetricValue(
									status.metrics.treasuryAda,
									"ada"
								),
							},
							{
								label: "🏊‍♂️ Active Pools",
								value: formatMetricValue(
									status.metrics.activeStakePools
								),
							},
							{
								label: "📊 Recent Transactions",
								value: formatMetricValue(
									status.metrics.transactions24h
								),
							},
							{
								label: "🧱 Block Height",
								value: formatMetricValue(
									status.metrics.blockHeight
								),
							},
							{
								label: "🌊 Current Epoch",
								value: formatMetricValue(status.metrics.epoch),
							},
						].map((metric, index) => (
							<div
								key={index}
								style={{
									background: "white",
									padding: "1rem",
									borderRadius: "8px",
									border: "1px solid #e0e0e0",
									textAlign: "center",
								}}
							>
								<div
									style={{
										fontSize: "0.9rem",
										color: "#666",
										marginBottom: "0.5rem",
									}}
								>
									{metric.label}
								</div>
								<div
									style={{
										fontSize: "1.2rem",
										fontWeight: "bold",
										color: "#0033AD",
									}}
								>
									{metric.value}
									{metric.suffix || ""}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Tweet Preview */}
			{status?.tweetPreview && (
				<div style={{ marginBottom: "3rem" }}>
					<h2
						style={{
							textAlign: "center",
							marginBottom: "2rem",
							color: "#333",
						}}
					>
						Next Tweet Preview
					</h2>
					<div
						style={{
							maxWidth: "600px",
							margin: "0 auto",
							background: "white",
							border: "1px solid #e1e8ed",
							borderRadius: "16px",
							padding: "1.5rem",
							boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						}}
					>
						<div
							style={{
								whiteSpace: "pre-line",
								fontFamily:
									"system-ui, -apple-system, sans-serif",
								fontSize: "1rem",
								lineHeight: "1.4",
								color: "#14171a",
							}}
						>
							{status.tweetPreview}
						</div>
					</div>
				</div>
			)}

			{/* Footer */}
			<div
				style={{
					textAlign: "center",
					padding: "2rem 0",
					borderTop: "1px solid #e0e0e0",
					color: "#666",
					fontSize: "0.9rem",
				}}
			>
				<p>
					Powered by Blockfrost API • Built for the Cardano community
				</p>
				<p>
					<a
						href="https://cardano.org"
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: "#0033AD" }}
					>
						Learn more about Cardano
					</a>
				</p>
			</div>
		</div>
	);
}
