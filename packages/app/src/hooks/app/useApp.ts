import { AppContext } from "../../context";
import { useContext } from "react";

export function useApp() {
	return useContext(AppContext);
}
