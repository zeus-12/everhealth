import { Link, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text } from "react-native";

const Home = () => {
	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					title: "Test",
				}}
			/>

			<Text>test page</Text>
		</SafeAreaView>
	);
};
export default Home;
