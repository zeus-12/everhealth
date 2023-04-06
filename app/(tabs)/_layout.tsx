import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";

export default function AppLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				options={{
					href: "/home",
					title: "Home",
					tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
				}}
				name="home"
			/>
			<Tabs.Screen
				options={{
					href: "/search",
					title: "Search",
					tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
				}}
				name="search"
			/>
			<Tabs.Screen
				options={{
					href: "/feed",
					title: "Feed",
					tabBarIcon: ({ color }) => (
						<Ionicons name="newspaper" size={24} color={color} />
					),
				}}
				name="feed"
			/>
			<Tabs.Screen
				options={{
					href: "/user",
					title: "User",
					tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
				}}
				name="user"
			/>
		</Tabs>
	);
}
