import { Text } from "react-native-paper";

const Heading = ({ children }) => {
	return (
		<Text className="text-3xl font-semibold tracking-tighter">{children}</Text>
	);
};
export default Heading;
