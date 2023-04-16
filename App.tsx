import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); //Ignore all log notifications

import Home from "@/screens/Home";
import Search from "@/screens/Search";
import Feed from "@/screens/Feed";
import User from "@/screens/User";
import UserData from "@/screens/onboarding/UserData";
import OnboardingWelcome from "@/screens/onboarding/Welcome";

import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { useColorScheme } from "nativewind";
import Leaderboard from "./src/screens/Leaderboard";
import NewReminder from "./src/screens/NewReminder";
import { db } from "@/lib/db";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	// use loaded for loading fonts,etc
	const [loaded, setLoaded] = useState<boolean>(true);

	const hasOnboarded = useUserStore((s) => s.hasOnboarded);
	const { isDarktheme, streak, setStreak } = useAppSettings((s) => s);

	const { setColorScheme } = useColorScheme();

	useEffect(() => {
		const calculateStreak = () => {
			return new Promise((resolve, reject) => {
				db.transaction((tx) => {
					tx.executeSql(
						"SELECT * FROM reminders WHERE isCompleted = 0",
						[],
						(_, result) => {
							const currentDate = new Date();
							let streak = 0;
							let lastDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // yesterday's date

							for (let i = 0; i < result.rows.length; i++) {
								const row = result.rows.item(i);
								const date = new Date(row.date);

								if (date.getTime() === lastDate.getTime()) {
									streak++;
								} else if (date.getTime() < lastDate.getTime()) {
									break;
								} else {
									// reset streak
									streak = 0;
								}

								lastDate = date;
							}

							resolve(streak);
						},
						(_, error) => {
							reject(error);
						}
					);
				}, null);
			});
		};

		calculateStreak().then((streak) => {
			setStreak(streak);
		});
	}, []);

	useEffect(() => {
		setColorScheme(isDarktheme ? "dark" : "light");
	}, [isDarktheme]);

	const HomeStack = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="HomeStack"
					component={Home}
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="Add Reminder"
					component={NewReminder}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	};
	const SearchStack = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="SearchStack"
					component={Search}
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="Add Reminder"
					component={NewReminder}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	};

	const FeedStack = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="FeedStack"
					component={Feed}
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="Add Reminder"
					component={NewReminder}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	};

	const TabNavigation = () => (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,

				tabBarStyle: {
					backgroundColor: isDarktheme ? "#030712" : "white",
				},
			})}
		>
			<Tab.Screen
				name="Home"
				component={HomeStack}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Entypo name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Search"
				component={SearchStack}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Feather name="search" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Feed"
				component={FeedStack}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons name="newspaper" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="User"
				component={UserStack}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Feather name="user" size={size} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);

	const UserStack = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="UserStack"
					component={User}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="Leaderboard"
					component={Leaderboard}
					options={{ headerShown: false }}
				/>

				<Stack.Screen
					name="Add Reminder"
					component={NewReminder}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	};
	return (
		<NavigationContainer>
			<NativeBaseProvider>
				{!loaded ? (
					<SafeAreaView>
						<Text>splash screen</Text>
					</SafeAreaView>
				) : hasOnboarded ? (
					<TabNavigation />
				) : (
					<Stack.Navigator
						// ADD BACKBUTTON
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name="Welcome" component={OnboardingWelcome} />
						<Stack.Screen name="user-data" component={UserData} />
					</Stack.Navigator>
				)}
			</NativeBaseProvider>
		</NavigationContainer>
	);
}
