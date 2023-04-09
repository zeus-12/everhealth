import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Heading from "./Heading";
import { useState } from "react";
import { getScreenHeightWithoutTabs } from "../../lib/constants";

const degreeToRadian = (degree: number): number => (degree * Math.PI) / 180;
const OFFSET_ANGLE = 10;
const INCREMENT_ANGLE = (100 - 2 * OFFSET_ANGLE) / 2;

const Layout = ({
	pageHeading,
	children,
	showHeader = false,
	showAddTasksButton = true,
}) => {
	const [isAddTasksButtonActive, setIsAddTasksButtonActive] = useState(false);

	const handleAddTasksButtonPress = () => {
		setIsAddTasksButtonActive((prev) => !prev);
	};

	return (
		<View
			className="dark:bg-black"
			style={{ minHeight: getScreenHeightWithoutTabs() }}
		>
			<SafeAreaView className="mx-4 flex-1">
				<Heading>{pageHeading}</Heading>
				<View className="mt-2 grow">{children}</View>
			</SafeAreaView>
		</View>
	);
};
export default Layout;
