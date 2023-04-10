import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import DUMMY_TASKS from "@/assets/dummy-tasks";
import { ReminderType, Reminder } from "@/types/storage";
import { Checkbox } from "native-base";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const Home = () => {
	// this state should be controlled to the date picker
	const [date, setDate] = useState(new Date());
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
			fetchReminders(tx);
		});
	}, []);

	const fetchReminders = (tx) => {
		tx.executeSql(
			"SELECT * FROM reminders",
			[],
			(_, { rows }) => {
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
					fetchReminders(tx);
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
					fetchReminders(tx);
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
					tx.executeSql("SELECT * FROM reminders", [], (_, { rows }) => {
						console.log(JSON.stringify(rows));
					});
				},
				(tx, error) => {
					console.log(`Error inserting row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

	return (
		<Layout pageHeading="Home">
			<Text className="text-gray-700 dark:text-gray-400 text-xl -mt-2 font-medium tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="mt-4 dark">
				<Text className="text-center text-3xl tracking-tighter font-semibold dark:text-slate-200">
					{dayjs(date).format("D MMMM")}
				</Text>
				<View className="">
					<TasksCard
						fetchReminders={fetchReminders}
						bgColor="bg-blue-400"
						title="Personal Growth"
						tasks={filterTasksByType(ReminderType.PERSONAL_GROWTH)}
						emptyTasksMessage={"No Personal Growth tasks for the day!"}
					/>
					<TasksCard
						fetchReminders={fetchReminders}
						bgColor="bg-orange-400"
						title="Medication"
						tasks={filterTasksByType(ReminderType.MEDICATION)}
						emptyTasksMessage={"No Medication Reminders for the day!"}
					/>
					<TasksCard
						fetchReminders={fetchReminders}
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
	fetchReminders,
}) => {
	const updateTaskStatus = (id: string, isCompleted: boolean) => {
		db.transaction((tx) => {
			tx.executeSql(
				"UPDATE reminders SET isCompleted = ? WHERE id = ?",
				[isCompleted ? 1 : 0, id],
				(_, result) => {
					console.log(`Rows updated: ${result.rowsAffected}`);
					fetchReminders(tx);
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
					<View key={task.task} className="flex">
						<Checkbox
							isChecked={task.isCompleted === 1}
							onChange={(newVal) => updateTaskStatus(task.id, newVal)}
							value={task.task}
						>
							<Text
								className={` text-white text-2xl font-semibold tracking-tight ${
									// make this change when value is toggled
									task.isCompleted === 1 ? "line-through" : ""
								}`}
							>
								{task.task}
							</Text>
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
