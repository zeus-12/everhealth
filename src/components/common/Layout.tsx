import { Stack } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Heading from "./Heading";
import { useState } from "react";

const Layout = ({
	pageHeading,
	children,
	showHeader = false,
	routeTitle,
	showAddTasksButton = true,
}) => {
	const [isAddTasksButtonActive, setIsAddTasksButtonActive] = useState(false);

	const handleAddTasksButtonPress = () => {
		setIsAddTasksButtonActive((prev) => !prev);
	};

	return (
		<SafeAreaView className="mx-4 min-h-screen">
			<Stack.Screen
				options={{
					title: routeTitle,
					headerShown: showHeader,
				}}
			/>
			<Heading>{pageHeading}</Heading>
			{children}

			{showAddTasksButton && (
				<>
					<TouchableOpacity
						onPress={handleAddTasksButtonPress}
						className="w-14 justify-center items-center h-14 rounded-full absolute bottom-24 right-0 bg-gray-400"
					>
						<Text className={`text-3xl ${isAddTasksButtonActive ? "rotate-45" : ""}`}>
							+
						</Text>
					</TouchableOpacity>

					{isAddTasksButtonActive &&
						[
							{
								icon: "📚",
							},
							{
								icon: "📝",
							},
							{
								icon: "🏥",
							},
						].map((item, i) => (
							<View
								className="w-14 justify-center items-center h-14 rounded-full absolute right-0 bg-gray-400"
								style={{ bottom: 96 + 70 * (i + 1) }}
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
	);
};
export default Layout;
