import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import { Image } from "expo-image";
import { blurHash } from "@/lib/constants";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { Switch } from "native-base";
import ModalBox from "@components/Modal/ModalBox";

interface UserSettingsButtonsType {
	title: string;
	onClick: () => void;
	value?: string;
}

const User = () => {
	const { resetAll, height, age, weight, name, setAge, setHeight, setWeight } =
		useUserStore((s) => s);
	const { resetAll: resetAllAppSettings } = useAppSettings((s) => s);

	const {
		setIsDarktheme,
		isDarktheme,
		allowNotifications,
		setAllowNotifications,
	} = useAppSettings((s) => s);

	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalValue, setModalValue] = useState("");
	const [showLogoutConfirmationModal, setShowLogoutConfirmationModal] = useState(false);

	const userSettingsButtons: UserSettingsButtonsType[] = [
		{
			title: "Age",
			onClick: () => {
				setModalTitle("Age");
				setModalValue(age);
				setShowModal(true);
			},
			value: age,
		},
		{
			title: "Height",
			onClick: () => {
				setModalTitle("Height");
				setModalValue(height);
				setShowModal(true);
			},
			value: height,
		},
		{
			title: "Weight",
			onClick: () => {
				setModalTitle("Weight");
				setModalValue(weight);
				setShowModal(true);
			},
			value: weight,
		},
		{
			title: "Logout",
			onClick: () => {
				// add confirmation modal
				setShowLogoutConfirmationModal(true);
				// delete db
				resetAll();
				resetAllAppSettings();
			},
		},
	];

	const handleModalSave = (newValue: string) => {
		setShowModal(false);
		if (modalTitle === "Age") {
			setAge(newValue);
		} else if (modalTitle === "Height") {
			setHeight(newValue);
		} else if (modalTitle === "Weight") {
			setWeight(newValue);
		}
	};

	const handleModalCancel = () => {
		setShowModal(false);
	};

	const handleLogout = () => {
		setShowLogoutConfirmationModal(false);
		// delete db
		resetAll();
		resetAllAppSettings();
	};


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

			<ModalBox
				title={modalTitle}
				value={modalValue}
				onSave={handleModalSave}
				onCancel={handleModalCancel}
				onLogout={handleLogout}
				showModal={showModal}
				showLogoutConfirmationModal={showLogoutConfirmationModal}
			/>
		</Layout>
	);
};
export default User;
