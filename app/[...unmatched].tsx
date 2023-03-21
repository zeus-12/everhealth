import { Unmatched as ExpoUnmatched, useRouter } from "expo-router";
import { Text } from "react-native";
import { usePathname } from "expo-router";

const Unmatched = () => {
	const pathname = usePathname();
	return (
		<>
			<Text>{JSON.stringify(pathname)}</Text>
			<ExpoUnmatched />
		</>
	);
};

export default Unmatched;
