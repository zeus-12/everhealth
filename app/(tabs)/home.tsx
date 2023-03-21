import { Link, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const Home = () => {
	return (
		<SafeAreaView>
			<Stack.Screen
				options={{
					title: "Home",
				}}
			/>
			<View>
				<Link href="/test">
					<Text className="text-4xl font-semibold tracking-tight">
						Open test modal
					</Text>
				</Link>
				<Text>hey</Text>
			</View>
		</SafeAreaView>
	);
};
export default Home;
