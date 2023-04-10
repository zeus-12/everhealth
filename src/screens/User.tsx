import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import { Image } from "expo-image";
import { blurHash } from "@/lib/constants";
import { useAppSettings, useUserStore } from "@/hooks/useStore";
import { Button, FormControl, Input, Modal, Switch } from "native-base";
import { deleteDatabase } from "@/lib/db";

const User = ({ navigation }) => {
	const { resetAll, height, age, weight, name, setAge, setWeight, setHeight } =
		useUserStore((s) => s);
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
			<Modal.Content>
				<Modal.CloseButton />
				<Modal.Header>Logout Confirmation</Modal.Header>
				<Modal.Body>
					<View>
						<Text>Are you sure you want to logout?</Text>
					</View>
				</Modal.Body>
				<Modal.Footer>
					<Button onPress={closeLogoutWarningModal}>Cancel</Button>
					<Button colorScheme="danger" onPress={handleLogout}>
						Logout
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};
