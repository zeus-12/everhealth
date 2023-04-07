import { SafeAreaView, Text } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import Search from "@/screens/Search";
import Feed from "@/screens/Feed";
import User from "@/screens/User";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingWelcome from "@/screens/onboarding/Welcome";
import UserData from "./src/screens/onboarding/UserData";
import { useEffect, useState } from "react";
import { getData } from "./src/lib/utils";

export default function App() {
	const Tab = createBottomTabNavigator();
	const Stack = createNativeStackNavigator();

	const [loaded, isLoaded] = useState<boolean>(false);
	const [hasOnboarded, setOnboarded] = useState<boolean>(false);

	useEffect(() => {
		const verifyOnboarding = async () => {
			const hasOnboarded = await getData("hasOnboarded");
			console.log(hasOnboarded, "a");
			if (hasOnboarded === true) {
				console.log("ho");
				setOnboarded(true);
			} else {
				// todo change
				setOnboarded(true);
			}
		};
		verifyOnboarding();
	}, []);

	useEffect(() => {
		if (hasOnboarded) return isLoaded(true);
	}, [hasOnboarded]);

	return (
		<NavigationContainer>
			<NativeBaseProvider>
				{!loaded ? (
					<SafeAreaView>
						<Text>splash screen</Text>
					</SafeAreaView>
				) : true ? (
					<Tab.Navigator
						screenOptions={({ route }) => ({
							// remove headertitle
							headerShown: false,
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
							component={User}
							options={{
								tabBarIcon: ({ focused, color, size }) => (
									<Feather name="user" size={size} color={color} />
								),
							}}
						/>
					</Tab.Navigator>
				) : (
					<Stack.Navigator
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
