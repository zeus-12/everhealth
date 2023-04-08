import React from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Layout from "@components/common/Layout";
import { Image } from "expo-image";
import { blurHash } from "@/lib/constants";
import { useUserStore } from "@/hooks/useStore";

interface UserSettingsButtonsType {
	title: string;
	onClick: () => void;
	value?: string;
}

const User = () => {
	const { resetAll, height, age, weight, name } = useUserStore((s) => {
		return s;
	});

	const userSettingsButtons: UserSettingsButtonsType[] = [
		{
			title: "Age",
			onClick: () => {},
			value: age,
		},
		{
			title: "Height",
			onClick: () => {},
			value: height,
		},
		{
			title: "Weight",
			onClick: () => {},
			value: weight,
		},
		{
			title: "Logout",
			onClick: () => {
				resetAll();
			},
		},
	];

	// dark mode
	// update height, weight, name,

	return (
		<Layout pageHeading="User">
			<ScrollView>
				{/* usericon */}
				<Image
					source={"https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
					contentFit="cover"
					transition={1000}
					placeholder={blurHash}
					className="h-32 w-32 mx-auto rounded-lg"
				/>
				<Text className="text-2xl font-semibold text-center">{name}</Text>
				<Text className="text-center">See leaderboard</Text>
				{/* usersettings */}
				<View className="mt-4">
					{userSettingsButtons.map((setting) => (
						<TouchableOpacity
							className="bg-gray-200 my-2 py-3 rounded-lg flex-row px-4 justify-between text-start"
							onPress={setting.onClick}
						>
							<Text className="text-lg">{setting.title}</Text>
							{setting.value && <Text className="text-lg">{setting.value}</Text>}
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</Layout>
	);
};
export default User;
