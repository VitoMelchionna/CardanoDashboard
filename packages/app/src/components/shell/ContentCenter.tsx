import { Box, Container, useBreakpointValue } from "@chakra-ui/react";

export default function ContentCenter({ children, ...props }) {
	return (
		<Container
			display="flex"
			alignItems="center"
			justifyContent="center"
			minH="70vh"
			{...props}
		>
			<Box w={useBreakpointValue({ base: "100%", md: "80%" })}>
				{children}
			</Box>
		</Container>
	);
}
