import { Avatar as AvatarElm } from "@chakra-ui/react";

export function Avatar({ address, ...props }) {
	return <AvatarElm boxSize="10" name={address} src={"https://robohash.org/" + address} {...props} />;
}
