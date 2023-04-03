import { Stack } from "expo-router";
import React from "react";
import { Text, View, SafeAreaView, ScrollView } from "react-native";
import Heading from "@components/common/Heading";
import * as Dummydata from "../../assets/feed-data.json";
import FeedCard from "@components/feed/FeedCard";

const feed = () => {
	return (
		<SafeAreaView className="mx-4">
			<Stack.Screen
				options={{
					title: "Feed",
					headerShown: false,
				}}
			/>

			<Heading>Feeds</Heading>

			<ScrollView>
				{Dummydata.items.map((item) => (
					<FeedCard
						articleUrl={item.url}
						key={item.id}
						image={item.image}
						publishedDate={item.date_published}
						title={item.title}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};
export default feed;
