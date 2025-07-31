import React from "react";

import { UseToastOptions } from "@chakra-ui/react";

export interface IUserMetadata {
	avatar: string
	address: string
}

export interface IAppContext {
	isDesktop: boolean;
	isTablet: boolean;
	isConnected: boolean;
	user?: IUserMetadata,
	error: (err: Error | string | unknown, title?: string) => void;
	toast: (options?: UseToastOptions) => void;
}

export const AppContext = React.createContext<IAppContext>({
	isDesktop: false,
	isTablet: false,
	isConnected: false,
	user: null,
	error: null,
	toast: null,
});
