import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import DUMMY_TASKS from "@/assets/dummy-tasks";
import { ReminderType, Reminder } from "../types/storage";
import { Checkbox } from "native-base";
import { db } from "../lib/utils";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const Home = () => {
	// this state should be controlled to the date picker
	const [date, setDate] = useState(new Date());
	console.log(date);

	const tasks = DUMMY_TASKS;

	const filterTasksByType = (type: ReminderType) => {
		if (!tasks || tasks.length === 0) return [];

		// @ts-ignore
		const filteredTasks = tasks?.filter((task: Reminder) => task.type === type);

		return filteredTasks;
	};

	useEffect(() => {
		db.transaction((tx) => {
			tx.executeSql(
				"create table if not exists reminders (id text primary key not null, date Date, isCompleted boolean, task text, type text );",
				[],
				() => {
					console.log("Table created successfully!");
				},
				(tx, error) => {
					console.log(`Error creating table: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		});
	}, []);

	const addGroupedTask = () => {
		// do all validation at component level

		// FROM USER
		const DATES = ["2021-06-13", "2021-06-14", "2021-06-15"];
		const TIMES = ["12:30", "5:30", "20:30"];
		const TASK = "do workout";
		const TYPE = ReminderType.PERSONAL_GROWTH;

		const group_id = uuidv4();

		DATES.forEach(() => {
			TIMES.forEach((time) => {
				const reminderPayload: Reminder = {
					task: TASK,
					type: TYPE,
					date,
					time,
					id: uuidv4(),
					group_id,
				};

				addIndividualTask(reminderPayload);
			});
		});
	};

	const addIndividualTask = (taskPayload: Reminder) => {
		const { task, type, date, time, id, group_id } = taskPayload;

		db.transaction(
			(tx) => {
				tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
				tx.executeSql("select * from items", [], (_, { rows }) =>
					console.log(JSON.stringify(rows))
				);
			},
			null
			//   forceUpdate
		);
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
						bgColor="bg-blue-400"
						title="Personal Growth"
						tasks={filterTasksByType(ReminderType.PERSONAL_GROWTH)}
						emptyTasksMessage={"No Personal Growth tasks for the day!"}
					/>
					<TasksCard
						bgColor="bg-orange-400"
						title="Medication"
						tasks={filterTasksByType(ReminderType.MEDICATION)}
						emptyTasksMessage={"No Medication Reminders for the day!"}
					/>
					<TasksCard
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

const TasksCard = ({ bgColor, title, tasks, emptyTasksMessage }) => {
	return (
		<TouchableOpacity className={`${bgColor} p-4 mt-4 rounded-lg`}>
			<Text className="text-white text-2xl font-semibold tracking-tight">
				{title}
			</Text>
			{tasks?.length > 0 ? (
				tasks.map((task) => (
					//todo replace key with id
					<View key={task.task} className="flex">
						<Checkbox defaultIsChecked={task.isCompleted} value="info">
							<Text
								className={` text-white text-2xl font-semibold tracking-tight ${
									// make this change when value is toggled
									task.isCompleted ? "line-through" : ""
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
