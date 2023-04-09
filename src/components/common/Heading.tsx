import { Text } from "react-native";

const Heading = ({ children }) => {
	return (
		<Text className="text-3xl font-semibold tracking-tighter dark:text-slate-100">
			{children}
		</Text>
	);
};
export default Heading;
