import { extendTheme } from "@chakra-ui/react";
import { theme as proTheme } from "@chakra-ui/pro-theme";

import * as foundations from "./foundations";

import "@fontsource/libre-franklin";

const overrides = {
	config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
	colors: {
		...proTheme.colors,
		brand: {
			highlight: "#4CEEFD",
			light: "#7928CA",
			dark: "#FF0080",
			"50": "#50D9FA",
			"100": "#54BCE4",
			"200": "#0A87E3",
			"300": "#272F91",
			"400": "#2C59A5",
			"500": "#292EC0",
			"600": "#182AA7",
			"700": "#13154E",
			"800": "#0B0F53",
			"900": "#000000",
		},
	},
	...foundations,
};

export const theme: any = extendTheme(overrides, proTheme);
