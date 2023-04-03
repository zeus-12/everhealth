import { Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const PersonalData = () => {
	const [name, setName] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");

	const handlePersonalData = () => {
		// do validation.
	};
	const formEntries = [
		{
			label: "Name",
			state: name,
			setState: setName,
			text: "What should we call you?",
		},
		{
			label: "Gender",
			state: gender,
			setState: setGender,
			text: "What do you identify as?",
		},
		{
			label: "Age",
			state: age,
			setState: setAge,
			text: "How old are you?",
		},
		{
			label: "Height (in cm)",
			state: height,
			setState: setHeight,
			text: "How tall are you?",
		},
		{
			label: "Weight (in kg)",
			state: weight,
			setState: setWeight,
			text: "How heavy are you?",
		},
	];

	return (
		<SafeAreaView className="mx-4 min-h-screen">
			<Stack.Screen
				options={{
					title: "Personal Data",
					headerShown: false,
				}}
			/>

			<Text className="text-3xl font-semibold tracking-tighter">
				Hello there, 🙌
			</Text>
			<Text className="text-gray-600 text-xl font-medium tracking-tighter">
				Help us to get to know you better.
			</Text>

			<View className="mt-4 ">
				{formEntries.map((item) => (
					<View key={item.label} className="mb-3">
						<Text className="font-semibold text-xl">{item.text}</Text>
						<TextInput
							label={item.label}
							value={item.state}
							mode="outlined"
							onChangeText={(text) => item.setState(text)}
						/>
					</View>
				))}
			</View>

			<Button
				className="absolute bottom-10 right-5"
				mode="contained"
				onPress={handlePersonalData}
			>
				Next
			</Button>
		</SafeAreaView>
	);
};
export default PersonalData;
