import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import { ReminderType, Reminder } from "@/types/storage";
import { Checkbox } from "native-base";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";
import { useAppSettings } from "../hooks/useStore";

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
			"SELECT * FROM reminders WHERE date = ?",
			[dayjs(date).format("YYYY-MM-DD")],
			(_, { rows }) => {
				console.log(
					`fetched tasks for the date ${dayjs(date).format("YYYY-MM-DD")}`
				);
				setReminders(rows._array);
			},
			(tx, error) => {
				console.log(`Error fetching reminders: ${error.message}`);
				return true; // Rollback the transaction
			}
		);
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
		// do all validation at component level

		// const DATES = ["2021-06-13", "2021-06-14", "2021-06-15"];
		// const TIMES = ["12:30", "5:30", "20:30"];
		// const TASK = "do workout";
		// const TYPE = ReminderType.PERSONAL_GROWTH;

		const group_id = uuidv4();

		dates.forEach((date) => {
			times.forEach((time) => {
				const reminderPayload = {
					task,
					type,
					date,
					time,
					isCompleted: false,
					id: uuidv4(),
					group_id,
				};

				addIndividualTask(reminderPayload);
			});
		});
	};

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

	// addIndividualTask({
	// 	task: "do abcd",
	// 	isCompleted: false,
	// 	type: ReminderType.PERSONAL_GROWTH,
	// 	time: "12:30",
	// 	date: "2023-04-11",
	// 	id: "efeadasdfad1212",
	// 	group_id: "asdASDa",
	// });

	const [showDatePicker, setShowDatePicker] = useState(false);
	console.log(showDatePicker);

	return (
		<Layout pageHeading="Home">
			<Text className="text-gray-700 dark:text-gray-400 text-xl -mt-2 font-medium tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="mt-4 dark" showsVerticalScrollIndicator={false}>
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

				<View className="">
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
				</View>
			</ScrollView>
		</Layout>
	);
};
export default Home;

const TasksCard = ({
	bgColor,
	title,
	tasks,
	emptyTasksMessage,
	fetchRemindersByDate,
}) => {
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

	return (
		<TouchableOpacity className={`${bgColor} p-4 mt-4 rounded-lg`}>
			<Text className="text-white text-2xl font-semibold tracking-tight">
				{title}
			</Text>
			{tasks?.length > 0 ? (
				tasks.map((task) => (
					//todo replace key with id
					<View key={task.id} className="flex-rowgap-3 mt-2">
						<Checkbox
							className="rounded-full w-6 h-6"
							isChecked={task.isCompleted === 1}
							onChange={(newVal) => updateTaskStatus(task.id, newVal)}
							value={task.task}
						>
							<View>
								<Text
									className={` text-white text-3xl font-semibold tracking-tight ${
										// make this change when value is toggled
										task.isCompleted === 1 ? "line-through" : ""
									}`}
								>
									{task.task}
								</Text>
								<Text className="text-slate-800">{task.time}</Text>
							</View>
						</Checkbox>
					</View>
				))
			) : (
				<Text className="text-white text-xl font-semibold tracking-tight">
					{emptyTasksMessage}
				</Text>
			)}
		</TouchableOpacity>
	);
};
