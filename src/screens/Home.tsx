import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Layout from "@components/common/Layout";
import DUMMY_TASKS from "../../assets/dummy-tasks";
import { ReminderType, Reminder } from "../types/storage";
import { Checkbox } from "native-base";

const Home = () => {
	const tasks = DUMMY_TASKS;

	const filterTasksByType = (type: ReminderType) => {
		if (!tasks || tasks.length === 0) return [];

		const filteredTasks = tasks?.filter((task: Reminder) => task.type === type);

		return filteredTasks;
	};

	return (
		<Layout pageHeading="Home">
			{/* <Link href={"/onboarding/welcome"}>
				<Text className="text-4xl font-semibold tracking-tight">hi</Text>
			</Link> */}
			<Text className="text-gray-700 text-2xl font-mediunm tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="">
				<Text className="text-center text-3xl tracking-tighter font-semibold">
					{/* replace with state */}
					June 13
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
