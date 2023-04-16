import { Text, TouchableOpacity, View } from "react-native";
import Heading from "@/components/common/Heading";
import { useState } from "react";
import { getScreenHeightWithoutTabs } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { ReminderType } from "@/types/storage";
import { useAppSettings } from "@/hooks/useStore";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

const degreeToRadian = (degree: number): number => (degree * Math.PI) / 180;
const OFFSET_ANGLE = 10;
const INCREMENT_ANGLE = (100 - 2 * OFFSET_ANGLE) / 2;

const Layout = ({
	pageHeading,
	children,
	showHeader = false,
	showBackButton = false,
	onBackButtonPress = () => {},
	showAddTasksButton = true,
}) => {
	const [isAddTasksButtonActive, setIsAddTasksButtonActive] = useState(false);
	const [showStreakModal, setShowStreakModal] = useState(false);

	const streak = useAppSettings((s) => s.streak);

	const navigation = useNavigation();

	const handleAddTasksButtonPress = () => {
		setIsAddTasksButtonActive((prev) => !prev);
	};

	const handleCloseStreakModal = () => {
		setShowStreakModal(false);
	};

	const insets = useSafeAreaInsets();

	return (
		<View className="dark:bg-black flex-1">
			<SafeAreaView className="mx-4 flex-1">
				<View className="flex-row justify-between item-center">
					<View className="flex-row items-center">
						{showBackButton && (
							<Ionicons
								onPress={() => navigation.goBack()}
								name="arrow-back-outline"
								size={24}
								className="text-black dark:text-slate-100"
							/>
						)}
						<Heading>{pageHeading}</Heading>
					</View>
					<TouchableOpacity
						onPress={() => setShowStreakModal(true)}
						className="bg-gray-300 dark:bg-gray-800 p-1 rounded-full"
					>
						<Text className="dark:text-slate-100 text-lg font-bold">🔥 {streak}</Text>
					</TouchableOpacity>
				</View>
				<View className="mt-2 grow">{children}</View>
				{showAddTasksButton && (
					<>
						<TouchableOpacity
							onPress={handleAddTasksButtonPress}
							className={`w-14 justify-center items-center h-14 rounded-full absolute right-0 ${
								isAddTasksButtonActive
									? "bg-transparent"
									: "bg-gray-400 dark:bg-gray-800"
							}`}
							style={{ bottom: 15 }}
						>
							<Text
								className={`text-4xl dark:text-gray-200`}
								style={{
									transform: [
										{
											rotate: isAddTasksButtonActive ? "45deg" : "0deg",
										},
									],
								}}
							>
								+
							</Text>
						</TouchableOpacity>

						{isAddTasksButtonActive &&
							[
								{
									icon: "💪",
									type: ReminderType.PERSONAL_GROWTH,
								},
								{
									icon: "💊",
									type: ReminderType.MEDICATION,
								},
								{
									icon: "🩺",
									type: ReminderType.DOCTOR_VISIT,
								},
							].map((item, i) => (
								<View
									key={i}
									className="w-14 justify-center items-center h-14 rounded-full absolute bg-gray-400 dark:bg-gray-800"
									style={{
										bottom:
											15 +
											120 * Math.sin(degreeToRadian(OFFSET_ANGLE + i * INCREMENT_ANGLE)),
										right:
											120 * Math.cos(degreeToRadian(OFFSET_ANGLE + i * INCREMENT_ANGLE)),
									}}
								>
									<TouchableOpacity
										onPress={() => {
											setIsAddTasksButtonActive(false);
											// @ts-ignore
											navigation.navigate("Add Reminder", {
												reminderType: item.type,
											});
										}}
										className="w-14 justify-center items-center h-14 rounded-full"
									>
										<Text className="text-3xl">{item.icon}</Text>
									</TouchableOpacity>
								</View>
							))}
					</>
				)}
			</SafeAreaView>
			<StreakCardModal
				streak={streak}
				showStreakModal={showStreakModal}
				handleCloseStreakModal={handleCloseStreakModal}
			/>
		</View>
	);
};

const StreakCardModal = ({
	showStreakModal,
	handleCloseStreakModal,
	streak,
}) => {
	return (
		<Modal size="sm" isOpen={showStreakModal} onClose={handleCloseStreakModal}>
			<Modal.Content className="dark:bg-slate-950">
				<Modal.Body>
					<View className="px-4 py-2r">
						{[
							{
								icon: "🔥",
								dayCount: streak,
								subText: "Current streak",
							},
							{
								icon: "🏆",
								dayCount: 1,
								subText: "Total Progress",
							},
						].map((item) => (
							<View className="flex-row gap-3 my-3 items-center" key={item.subText}>
								<Text className="text-5xl font-bold">{item.icon}</Text>
								<View>
									<Text className="text-2xl font-bold dark:text-slate-100">
										{item.dayCount} day
									</Text>
									<Text className="text-xl text-gray-400 dark:text-gray-500">
										{item.subText}
									</Text>
								</View>
							</View>
						))}
					</View>
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
};

export default Layout;
