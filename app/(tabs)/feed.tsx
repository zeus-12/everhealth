import { Stack } from "expo-router";
import React from "react";
import { Text, View, SafeAreaView } from "react-native";

const feed = () => {
	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					title: "Feed",
				}}
			/>
			<Text>hllo</Text>
		</SafeAreaView>
	);
};
export default feed;
