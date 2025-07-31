import type { AppProps } from "next/app";
import Head from "next/head";
import { Providers } from "../components/shell";

import "../styles/full.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
				<title>Cardano Dashboard</title>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
				<meta charSet="utf-8" />
			</Head>
			<Providers>
				<Component {...pageProps} />
			</Providers>
		</>
	);
}
