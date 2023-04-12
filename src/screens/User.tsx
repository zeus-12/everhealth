import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import { Image } from "expo-image";
import { blurHash } from "@/lib/constants";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { Button, FormControl, Input, Modal, Switch } from "native-base";
import { deleteDatabase } from "@/lib/db";

const User = ({ navigation }) => {
	const {
		resetAll,
		height,
		age,
		weight,
		name,
		setAge,
		setWeight,
		setHeight,
		gender,
	} = useUserStore((s) => s);
	const { resetAll: resetAllAppSettings } = useAppSettings((s) => s);

	const {
		setIsDarktheme,
		isDarktheme,
		allowNotifications,
		setAllowNotifications,
	} = useAppSettings((s) => s);

	const handleLogout = () => {
		resetAll();
		deleteDatabase();
		resetAllAppSettings();
	};

	enum ElementType {
		SWITCH = "SWITCH",
		STRING = "STRING",
	}

	const modalTitleValueMapping = {
		Age: { state: age, setState: setAge },
		Height: { state: height, setState: setHeight },
		Weight: { state: weight, setState: setWeight },
	};

	const updateEditModalTitleAndShow = (title: string) => {
		setEditModalTitle(title);
		setShowEditModal(true);
	};

	const [showLogoutWarningModal, setShowLogoutWarningModal] = useState(false);
	const closeLogoutWarningModal = () => setShowLogoutWarningModal(false);

	const [showEditModal, setShowEditModal] = useState(false);
	const closeEditModal = () => setShowEditModal(false);

	const [editModalTitle, setEditModalTitle] = useState("");

	const settings = [
		{
			type: ElementType.STRING,
			title: "Age",
			value: age,
			onClick: () => {
				updateEditModalTitleAndShow("Age");
			},
		},
		{
			type: ElementType.STRING,
			title: "Gender",
			value: gender,
			onClick: () => {},
		},
		{
			type: ElementType.STRING,
			title: "Height",
			value: height,
			onClick: () => {
				updateEditModalTitleAndShow("Height");
			},
		},
		{
			type: ElementType.STRING,
			title: "Weight",
			value: weight,
			onClick: () => {
				updateEditModalTitleAndShow("Weight");
			},
		},
		{
			type: ElementType.SWITCH,
			title: "Dark Mode",
			value: isDarktheme,
			onClick: (newVal: boolean) => {
				setIsDarktheme(newVal);
			},
		},
		{
			type: ElementType.SWITCH,
			title: "Allow Notifications",
			value: allowNotifications,
			onClick: (newVal: boolean) => {
				setAllowNotifications(newVal);
			},
		},
		{
			type: ElementType.STRING,
			title: "Logout",
			onClick: () => {
				setShowLogoutWarningModal(true);
			},
			tw: "text-red-400",
		},
	];

	return (
		<Layout pageHeading="User">
			<ScrollView showsVerticalScrollIndicator={false} className="grow">
				<Image
					source={require("../assets/user.png")}
					contentFit="cover"
					transition={1000}
					placeholder={blurHash}
					className="h-32 w-32 mx-auto rounded-lg"
				/>

				<Text className="text-2xl font-semibold text-center dark:text-slate-200">
					{name}
				</Text>
				<TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
					<Text className="text-center dark:text-slate-400">See leaderboard</Text>
				</TouchableOpacity>

				<View className="mt-4 rouned-md rounded-xl bg-white dark:bg-gray-800 divide-y-[0.175px] divide-gray-500">
					{settings.map((setting) =>
						setting.type === ElementType.STRING ? (
							<TouchableOpacity
								key={setting.title}
								className="py-3 flex-row px-4 justify-between text-start"
								// @ts-ignore
								onPress={setting.onClick}
							>
								<Text
									className={`text-lg dark:text-slate-100 ${
										setting.tw ? setting.tw : ""
									}`}
								>
									{setting.title}
								</Text>
								{setting.value && (
									<Text className="text-lg dark:text-slate-100">{setting.value}</Text>
								)}
							</TouchableOpacity>
						) : (
							<View
								className="py-3 flex-row px-4 justify-between text-start"
								key={setting.title}
							>
								<Text className="text-lg dark:text-slate-100">{setting.title}</Text>
								<Switch size="md" value={setting.value} onToggle={setting.onClick} />
							</View>
						)
					)}
				</View>
			</ScrollView>
			<LogoutWarningModal
				handleLogout={handleLogout}
				closeLogoutWarningModal={closeLogoutWarningModal}
				showLogoutWarningModal={showLogoutWarningModal}
			/>

			{showEditModal && (
				<EditModal
					title={editModalTitle}
					updateValue={modalTitleValueMapping[editModalTitle]?.setState}
					intialValue={modalTitleValueMapping[editModalTitle]?.state}
					closeEditModal={closeEditModal}
					showEditModal={showEditModal}
				/>
			)}
		</Layout>
	);
};
export default User;

const EditModal = ({
	title,
	intialValue,
	closeEditModal,
	updateValue,
	showEditModal,
}) => {
	const [newValue, setNewValue] = useState(
		typeof intialValue === "number" ? intialValue.toString() : intialValue
	);

	const handleSave = () => {
		// todo do validation
		updateValue(newValue);
		resetInputAndClose();
	};

	const resetInputAndClose = () => {
		setNewValue("");
		closeEditModal();
	};

	return (
		<Modal isOpen={showEditModal} onClose={resetInputAndClose}>
			<Modal.Content>
				<Modal.Header className="flex flex-row">Edit {title}</Modal.Header>
				<Modal.Body>
					<FormControl>
						<Input
							placeholder={`Enter new ${title}`}
							value={newValue}
							onChangeText={(value) => setNewValue(value)}
						/>
					</FormControl>
				</Modal.Body>
				<Modal.Footer>
					<Button.Group variant="ghost" space={2}>
						<Button onPress={resetInputAndClose}>Cancel</Button>
						<Button onPress={handleSave}>Save</Button>
					</Button.Group>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

const LogoutWarningModal = ({
	closeLogoutWarningModal,
	showLogoutWarningModal,
	handleLogout,
}) => {
	return (
		<Modal isOpen={showLogoutWarningModal} onClose={closeLogoutWarningModal}>
			<Modal.CloseButton />
			<View className="p-4 bg-white dark:bg-black rounded-xl">
				<Text className="font-semibold dark:text-slate-100 text-xl">
					Confirm logout?
				</Text>
				<Text className="dark:text-slate-100">
					You'll lose all data and this is not reversible.
				</Text>
				<Button className="bg-white mt-2 dark:bg-black" onPress={handleLogout}>
					<Text className="text-lg text-red-600  font-semibold">Logout</Text>
				</Button>
				<Button
					className="bg-white dark:bg-black "
					onPress={closeLogoutWarningModal}
				>
					<Text className="text-lg text-black dark:text-slate-100 font-semibold">
						Cancel
					</Text>
				</Button>
			</View>
		</Modal>
	);
};
