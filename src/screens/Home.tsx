import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	ScrollView,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import Layout from "@components/common/Layout";
import { ReminderType, Reminder } from "@/types/storage";
import { Checkbox } from "native-base";
import { db } from "@/lib/db";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import { useAppSettings } from "../hooks/useStore";
import { randomUUID } from "expo-crypto";
import { SwipeListView } from "react-native-swipe-list-view";
import { SCREEN_WIDTH } from "../lib/constants";

const Home = ({ navigation }) => {
	// this state should be controlled to the date picker
	const [date, setDate] = useState(new Date());
	const isDarktheme = useAppSettings((s) => s.isDarktheme);

	const [reminders, setReminders] = useState([]);

	const filterTasksByType = (type: ReminderType) => {
		if (!reminders || reminders.length === 0) return [];

		// @ts-ignore
		const filteredTasks = reminders?.filter(
			(task: Reminder) => task.type === type
		);

		return filteredTasks?.map((ele, i) => ({ key: `${i}`, ...ele }));
		return filteredTasks;
	};

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY NOT NULL, group_id TEXT NOT NULL, date TEXT NOT NULL, isCompleted BOOLEAN NOT NULL, task TEXT NOT NULL, type TEXT NOT NULL, time TEXT NOT NULL);"
			);
			fetchRemindersByDate(tx);
		});
	}, [date]);

	const fetchRemindersByDate = (tx) => {
		tx.executeSql(
			"SELECT * FROM reminders WHERE date = ? ORDER BY time ASC",
			[dayjs(date).format("YYYY-MM-DD")],
			(_, { rows }) => {
				console.log(
					`fetched tasks for the date ${dayjs(date).format("YYYY-MM-DD")}`
				);
				// Sort by time
				const sortedRows = rows._array.sort((a, b) => a.time.localeCompare(b.time));
				setReminders(sortedRows);
			},
			(tx, error) => {
				console.log(`Error fetching reminders: ${error.message}`);
				return true; // Rollback the transaction
			}
		);
	};

	const addIndividualTask = (taskPayload) => {
		const { task, isCompleted, type, date, time, id, group_id } = taskPayload;

		db.transaction((tx) => {
			tx.executeSql(
				"INSERT INTO reminders (task, isCompleted, type, date, time, id, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[task, isCompleted ? 1 : 0, type, date, time, id, group_id],
				(_, result) => {
					console.log(`Rows inserted: ${result.rowsAffected}`);
					fetchRemindersByDate(tx);
				},
				(tx, error) => {
					console.log(`Error inserting row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

	const addGroupedReminder = ({
		dates,
		task,
		type,
		times,
	}: {
		dates: string[];
		task: string;
		type: ReminderType;
		times: string[];
	}) => {
		const group_id = randomUUID();

		dates.forEach((date) => {
			times.forEach((time) => {
				const reminderPayload = {
					task,
					type,
					date,
					time,
					isCompleted: false,
					id: randomUUID(),
					group_id,
				};

				addIndividualTask(reminderPayload);
			});
		});
	};
	// deleteTable("reminders");

	// useEffect(() => {
	// 	addGroupedReminder({
	// 		dates: ["2023-04-11", "2023-04-12", "2023-04-13"],
	// 		task: "medicine",
	// 		type: ReminderType.PERSONAL_GROWTH,
	// 		times: ["12:30", "05:30", "20:30"],
	// 	});
	// }, []);

	const deleteReminderById = (id: string) => {
		db.transaction((tx) => {
			tx.executeSql(
				"DELETE FROM reminders WHERE id = ?",
				[id],
				(_, result) => {
					console.log(`Rows deleted: ${result.rowsAffected}`);
					fetchRemindersByDate(tx);
				},
				(tx, error) => {
					console.log(`Error deleting row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

	const deleteRemindersByGroupId = (groupId: string) => {
		db.transaction((tx) => {
			tx.executeSql(
				"DELETE FROM reminders WHERE group_id = ?",
				[groupId],
				(_, result) => {
					console.log(`Rows deleted: ${result.rowsAffected}`);
					fetchRemindersByDate(tx);
				},
				(tx, error) => {
					console.log(`Error deleting rows: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

	// addIndividualTask({
	// 	task: "do LASTE",
	// 	isCompleted: false,
	// 	type: ReminderType.PERSONAL_GROWTH,
	// 	time: "06:30",
	// 	date: "2023-04-11",
	// 	id: "efeadASDFS2asdfad1212",
	// 	group_id: "LAST",
	// });

	const [showDatePicker, setShowDatePicker] = useState(false);

	return (
		<Layout pageHeading="Home">
			<Text className="text-gray-700 dark:text-gray-400 text-xl font-medium tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="mt-4 mb-16 dark" showsVerticalScrollIndicator={false}>
				<View className="flex-row items-center justify-center gap-4">
					<Text className="text-center text-3xl tracking-tighter font-semibold dark:text-slate-200">
						{dayjs(date)?.format("D MMMM")}
					</Text>
					<TouchableOpacity onPress={() => setShowDatePicker(true)}>
						<DateTimePicker
							value={date}
							onChange={(event, selectedDate) => {
								// Handle date change here
								if (event.type === "set") {
									setShowDatePicker(false);
									setDate(selectedDate);
								} else {
									setShowDatePicker(false);
								}
							}}
							// todo fix type here
							themeVariant={isDarktheme ? "dark" : "light"}
							maximumDate={new Date(2024, 10, 20)}
							minimumDate={new Date(2023, 0, 1)}
							mode="date"
						/>
						{/* <AntDesign
							name="calendar"
							size={24}
							className="text-black dark:text-slate-100"
						/> */}
					</TouchableOpacity>
				</View>
				<TasksCard
					fetchRemindersByDate={fetchRemindersByDate}
					bgColor="bg-blue-400"
					title="Personal Growth"
					tasks={filterTasksByType(ReminderType.PERSONAL_GROWTH)}
					emptyTasksMessage={"No Personal Growth tasks for the day!"}
				/>
				<TasksCard
					fetchRemindersByDate={fetchRemindersByDate}
					bgColor="bg-orange-400"
					title="Medication"
					tasks={filterTasksByType(ReminderType.MEDICATION)}
					emptyTasksMessage={"No Medication Reminders for the day!"}
				/>
				<TasksCard
					fetchRemindersByDate={fetchRemindersByDate}
					bgColor="bg-pink-400"
					title="Doctor Visits"
					tasks={filterTasksByType(ReminderType.DOCTOR_VISIT)}
					emptyTasksMessage={"No Doctor Visits scheduled for the day!"}
				/>
			</ScrollView>
		</Layout>
	);
};
export default Home;

const rowTranslateAnimatedValues = {};
Array(10)
	.fill("")
	.forEach((_, i) => {
		rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
	});

const TasksCard = ({
	bgColor,
	title,
	tasks,
	emptyTasksMessage,
	fetchRemindersByDate,
}) => {
	// const [listData, setListData] = useState(
	// 	tasks?.map((ele, i) => ({ key: `${i}`, ...ele }))
	// );

	const updateTaskStatus = (id: string, isCompleted: boolean) => {
		db.transaction((tx) => {
			// todo make sure the date is date.now() format it accodingly
			tx.executeSql(
				"UPDATE reminders SET isCompleted = ? WHERE id = ?",
				[isCompleted ? 1 : 0, id],
				(_, result) => {
					console.log(`Rows updated: ${result.rowsAffected}`);
					fetchRemindersByDate(tx);
				},
				(tx, error) => {
					console.log(`Error updating row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};
	const animationIsRunning = useRef(false);

	const onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		if (value < -SCREEN_WIDTH && !animationIsRunning.current) {
			animationIsRunning.current = true;
			Animated.timing(rowTranslateAnimatedValues[key], {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start(() => {
				const newData = [...tasks];
				const prevIndex = tasks.findIndex((item) => item.key === key);
				newData.splice(prevIndex, 1);
				// setListData(newData);
				animationIsRunning.current = false;
			});
		}
	};

	const renderItem = (data) => {
		const task = data.item;
		return (
			<Animated.View
				style={[
					{
						height: rowTranslateAnimatedValues[data.item.key].interpolate({
							inputRange: [0, 1],
							outputRange: [0, 60],
						}),
					},
				]}
			>
				<TouchableHighlight
					onPress={() => console.log("You touched me")}
					style={styles.rowFront}
					// underlayColor={"#AAA"}
				>
					<View
						key={task.id}
						className={`w-full h-full justify-center pl-4 ${bgColor}`}
					>
						<Checkbox
							className="rounded-full w-6 h-6"
							isChecked={task.isCompleted === 1}
							onChange={(newVal) => {
								console.log(newVal);
								updateTaskStatus(task.id, newVal);
							}}
							value={task.task}
						>
							<View>
								<Text
									className={` text-white text-3xl font-semibold tracking-tight ${
										task.isCompleted === 1 ? "line-through" : ""
									}`}
								>
									{task.task}
								</Text>
								<Text className="text-slate-800">{task.time}</Text>
							</View>
						</Checkbox>
					</View>
				</TouchableHighlight>
			</Animated.View>
		);
	};

	const renderHiddenItem = () => (
		<View style={styles.rowBack}>
			<View style={[styles.backRightBtn, styles.backRightBtnRight]}>
				<Text className="text-white">Delete</Text>
			</View>
		</View>
	);

	return (
		<>
			<View className={`${bgColor} p-4 mt-4 rounded-lg mb-2`}>
				<Text className="text-white text-2xl font-semibold tracking-tight">
					{title}
				</Text>
			</View>
			<SwipeListView
				disableRightSwipe
				data={tasks}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
				rightOpenValue={-SCREEN_WIDTH}
				onSwipeValueChange={onSwipeValueChange}
				useNativeDriver={false}
				className={`${bgColor} dark:bg-black rounded-xl`}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	rowFront: {
		alignItems: "center",
		borderBottomColor: "black",
		borderBottomWidth: 1,
		justifyContent: "center",
		height: 60,
	},
	rowBack: {
		alignItems: "center",
		backgroundColor: "red",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: 75,
	},
	backRightBtnRight: {
		backgroundColor: "red",
		right: 0,
	},
});
