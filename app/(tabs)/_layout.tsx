import React from "react";
import { Tabs } from "expo-router";

export default function AppLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				options={{
					href: "/home",
					title: "Home",
					// tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
				}}
				name="home"
			/>
			<Tabs.Screen
				options={{
					href: "/search",
					title: "Search",
				}}
				name="search"
			/>
			<Tabs.Screen
				options={{
					href: "/feed",
					title: "Feed",
				}}
				name="feed"
			/>
			<Tabs.Screen
				options={{
					href: "/user",
					title: "User",
				}}
				name="user"
			/>
		</Tabs>
	);
}
