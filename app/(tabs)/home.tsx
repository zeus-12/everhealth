import { Link, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Heading from "@components/common/Heading";

const Home = () => {
	return (
		<SafeAreaView className="mx-4 min-h-screen">
			<Stack.Screen
				options={{
					title: "Home",
					headerShown: false,
				}}
			/>

			<Heading>Diary</Heading>
			<Text className="text-gray-700 text-2xl font-mediunm tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView></ScrollView>
		</SafeAreaView>
	);
};
export default Home;

{
	/* <Link href="/onboarding/personal-data">
<Text className="text-4xl font-semibold tracking-tight">
	Open test page
</Text>
</Link> */
}
