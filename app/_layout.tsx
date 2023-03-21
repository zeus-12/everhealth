import React from "react";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text } from "react-native";
// import { useColorScheme } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

export default function RootLayout() {
	// const [loaded, error] = useFonts({
	// 	...FontAwesome.font,
	// 	SourceCodePro_400Regular,
	// });

	// useEffect(() => {
	// 	if (error) throw error;
	// }, [error]);

	const loaded = true;
	return (
		<>
			{/* {!loaded && <SplashScreen />} */}
			{loaded && <RootLayoutNav />}
		</>
	);
}

function RootLayoutNav() {
	// const colorScheme = useColorScheme();

	return (
		<>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="test" options={{ presentation: "modal" }} />
			</Stack>
			<StatusBar />
		</>
	);
}
