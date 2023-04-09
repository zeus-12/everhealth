import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_HEIGHT } from "../../lib/constants";

const OnboardingWelcome = ({ navigation }) => {
	return (
		<SafeAreaView
			className="justify-center items-center flex "
			style={{ minHeight: SCREEN_HEIGHT }}
		>
			<Text className="text-4xl mb-2 font-semibold tracking-tighter">
				Welcome! 🙏
			</Text>
			<View>
				{["Sign in with Google", "Continue as Guest"].map((text) => (
					<SignInContainer
						onPress={() => {
							navigation.navigate("user-data");
						}}
						key={text}
						text={text}
					/>
				))}
			</View>
		</SafeAreaView>
	);
};

const SignInContainer = ({ text, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			className="bg-blue-300 px-4 py-2 mt-2 rounded-md"
		>
			<Text className="text-xl font-medium">{text}</Text>
		</TouchableOpacity>
	);
};

export default OnboardingWelcome;
