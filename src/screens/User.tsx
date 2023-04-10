import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import { Image } from "expo-image";
import { blurHash } from "@/lib/constants";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { Switch } from "native-base";
import { deleteDatabase } from "@/lib/db";

interface UserSettingsButtonsType {
	title: string;
	onClick: () => void;
	value?: string;
}

const User = () => {
	const { resetAll, height, age, weight, name } = useUserStore((s) => s);
	const { resetAll: resetAllAppSettings } = useAppSettings((s) => s);

	const {
		setIsDarktheme,
		isDarktheme,
		allowNotifications,
		setAllowNotifications,
	} = useAppSettings((s) => s);

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
				// add confirmation modal
				// delete db
				resetAll();
				deleteDatabase();
				resetAllAppSettings();
			},
		},
	];

	const userSettingsToggles = [
		{
			title: "Dark Mode",
			onClick: (newVal: boolean) => {
				setIsDarktheme(newVal);
			},
			value: isDarktheme,
		},
		{
			title: "Enable Notifications",
			onClick: (newVal: boolean) => {
				setAllowNotifications(newVal);
			},
			value: allowNotifications,
		},
	];

	return (
		<Layout pageHeading="User">
			<ScrollView className="grow">
				{/* todo use image from assets instead */}
				<Image
					source={"https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"}
					contentFit="cover"
					transition={1000}
					placeholder={blurHash}
					className="h-32 w-32 mx-auto rounded-lg"
				/>
				<Text className="text-2xl font-semibold text-center dark:text-slate-200">
					{name}
				</Text>
				<Text className="text-center dark:text-slate-400">See leaderboard</Text>
				{/* usersettings */}
				<View className="mt-4 rouned-md rounded-xl bg-white dark:bg-gray-800 divide-y-[0.175px] divide-gray-500">
					{userSettingsToggles.map((setting) => (
						<View
							className="py-3 flex-row px-4 justify-between text-start"
							key={setting.title}
						>
							<Text className="text-lg dark:text-slate-100">{setting.title}</Text>
							<Switch size="md" value={setting.value} onToggle={setting.onClick} />
						</View>
					))}
					{userSettingsButtons.map((setting) => (
						<TouchableOpacity
							key={setting.title}
							className="py-3 flex-row px-4 justify-between text-start"
							onPress={setting.onClick}
						>
							<Text className="text-lg dark:text-slate-100">{setting.title}</Text>
							{setting.value && (
								<Text className="text-lg dark:text-slate-100">{setting.value}</Text>
							)}
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</Layout>
	);
};
export default User;
