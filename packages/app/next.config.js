/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	webpack: function (config, options) {
		config.experiments = {
			asyncWebAssembly: true,
			layers: true,
		};
		return config;
	},
	swcMinify: true,
	/**
	 * Note that this can change/break without warning.
	 * @see https://github.com/vercel/next.js/pull/22867
	 */
	experimental: {
		externalDir: true,
	},
	env: {
		DATABASE_URL: process.env.DATABASE_URL,
		X_API_KEY: process.env.X_API_KEY,
		X_ACCESS_TOKEN: process.env.X_ACCESS_TOKEN,
		X_ACCESS_TOKEN_SECRET: process.env.X_ACCESS_TOKEN_SECRET,
		BLOCKFROST_PROJECT_ID: process.env.BLOCKFROST_PROJECT_ID,
		MAESTRO_API_KEY: process.env.MAESTRO_API_KEY,
		CARDANOSCAN_API_KEY: process.env.CARDANOSCAN_API_KEY,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
