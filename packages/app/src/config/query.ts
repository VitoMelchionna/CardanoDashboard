import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Refetch only after 20 seconds
			staleTime: 1000 * 20,
		},
	},
});
