import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "@/screens/Home";
import Search from "@/screens/Search";
import Feed from "@/screens/Feed";
import User from "@/screens/User";
import UserData from "@/screens/onboarding/UserData";
import OnboardingWelcome from "@/screens/onboarding/Welcome";

import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { useColorScheme } from "nativewind";
import MedicalData from "./src/screens/MedicalData";
import Leaderboard from "./src/screens/Leaderboard";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	// use loaded for loading fonts,etc
	const [loaded, setLoaded] = useState<boolean>(true);

	const hasOnboarded = useUserStore((s) => s.hasOnboarded);
	const isDarktheme = useAppSettings((s) => s.isDarktheme);

	const { setColorScheme } = useColorScheme();

	useEffect(() => {
		setColorScheme(isDarktheme ? "dark" : "light");
	}, [isDarktheme]);

	const TabNavigation = () => (
		<Tab.Navigator
			// ADD BACKBUTTON
			screenOptions={({ route }) => ({
				// remove headertitle
				headerShown: false,

				tabBarStyle: {
					backgroundColor: isDarktheme ? "#030712" : "white",
				},
			})}
		>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Entypo name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Medical"
				component={MedicalData}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<AntDesign name="heart" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Feather name="search" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Feed"
				component={Feed}
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
