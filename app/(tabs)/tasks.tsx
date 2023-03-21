import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text } from "react-native";

const Home = () => {
	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					title: "Tasks",
				}}
			/>

			<Text>tasls page</Text>
		</SafeAreaView>
	);
};
export default Home;
