import { Box, Container, useBreakpointValue } from "@chakra-ui/react";

export function ConatinerCenter({ children, ...props }) {
	return (
		<Container
			display="flex"
			alignItems="center"
			justifyContent="center"
			minH="70vh"
			{...props}
		>
			<Box w={useBreakpointValue({ base: "100%", md: "50%" })}>
				{children}
			</Box>
		</Container>
	);
}
