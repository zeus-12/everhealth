import { Stack } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

const OnboardingWelcome = () => {
	return (
		<SafeAreaView className="min-h-screen justify-center items-center flex">
			<Stack.Screen
				options={{
					title: "Welcome",
					headerShown: false,
				}}
			/>

			<Text className="text-4xl mb-2 font-semibold tracking-tighter">
				Welcome! 🙏
			</Text>
			<View>
				{["Sign in with Google", "Continue as Guest"].map((text) => (
					<SignInContainer key={text} text={text} />
				))}
			</View>
		</SafeAreaView>
	);
};

const SignInContainer = ({ text }) => {
	return (
		<View className="bg-blue-300 px-4 py-2 mt-2 rounded-md">
			<Text className="text-xl font-medium">{text}</Text>
		</View>
	);
};

export default OnboardingWelcome;
