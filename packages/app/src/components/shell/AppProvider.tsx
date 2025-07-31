import { useEffect, useState } from "react";
import {
	useBreakpointValue,
	useToast,
	UseToastOptions,
} from "@chakra-ui/react";
import { AppContext, IAppContext } from "../../context/AppContext";

const defaultToastOptions: UseToastOptions = {
	variant: "top-accent",
	duration: 6000,
	isClosable: true,
};

const toastIdError = "app-error";

export default function AppProvider({ children }) {
	const toast = useToast();

	const [ctx, setCtx] = useState<IAppContext>({
		isDesktop: false,
		isTablet: false,
		isConnected: false,
		async error(err: Error | string, title?: string): Promise<string> {
			console.error(err instanceof Error ? err : new Error(err));
			if (!toast.isActive(toastIdError)) {
				toast({
					id: toastIdError,
					...defaultToastOptions,
					status: "error",
					title: title || "A wild 🐞 appeared!",
					description: `Go report this on our discord!`,
				});
			}
			return "";
		},
		toast: (options?: UseToastOptions) => {
			toast({
				...defaultToastOptions,
				...options,
			});
		},
	});

	const isDesktop = useBreakpointValue({ base: false, lg: true });

	const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

	useEffect(() => {
		if (isDesktop != ctx.isDesktop) {
			setCtx({
				...ctx,
				isDesktop: isDesktop,
			});
		}
		if (isTablet != ctx.isTablet) {
			setCtx({
				...ctx,
				isTablet: isTablet,
			});
		}
	}, [isDesktop, isTablet]);

	// TODO: Add error boundary

	return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}
