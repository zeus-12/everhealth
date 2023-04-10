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
				{showAddTasksButton && (
					<>
						<TouchableOpacity
							onPress={handleAddTasksButtonPress}
							className={`w-14 justify-center items-center h-14 rounded-full absolute right-0 ${
								isAddTasksButtonActive ? "bg-transparent" : "bg-gray-400"
							}`}
							style={{ bottom: 15 }}
						>
							<Text
								className={`text-4xl ${
									isAddTasksButtonActive ? "rotate-45" : ""
								} dark:text-gray-200`}
							>
								+
							</Text>
						</TouchableOpacity>

						{isAddTasksButtonActive &&
							[
								{
									icon: "💪",
								},
								{
									icon: "💊",
								},
								{
									icon: "🩺",
								},
							].map((item, i) => (
								<View
									key={i}
									className="w-14 justify-center items-center h-14 rounded-full absolute bg-gray-400"
									style={{
										bottom:
											15 +
											120 * Math.sin(degreeToRadian(OFFSET_ANGLE + i * INCREMENT_ANGLE)),
										right:
											120 * Math.cos(degreeToRadian(OFFSET_ANGLE + i * INCREMENT_ANGLE)),
									}}
								>
									<TouchableOpacity
										onPress={() => console.log("add personal growth task")}
										className="w-14 justify-center items-center h-14 rounded-full bg-gray-400"
									>
										<Text className="text-3xl">{item.icon}</Text>
									</TouchableOpacity>
								</View>
							))}
					</>
				)}
			</SafeAreaView>
		</View>
	);
};
export default Layout;
