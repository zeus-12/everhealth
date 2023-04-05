import { Link, Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Layout from "@components/common/Layout";

const Home = () => {
	return (
		<Layout pageHeading="Diary" routeTitle="Home">
			<Text className="text-gray-700 text-2xl font-mediunm tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="mt-4">
				<Text className="text-center text-3xl tracking-tighter font-semibold">
					{/* replace with state */}
					June 13
				</Text>
				<View className="">
					<TasksCard
						bgColor="bg-blue-400"
						title="Personal Growth"
						tasks={[]}
						emptyTasksMessage={"No Personal Growth tasks for the day!"}
					/>
					<TasksCard
						bgColor="bg-orange-400"
						title="Medication"
						tasks={[]}
						emptyTasksMessage={"No Medication Reminders for the day!"}
					/>
					<TasksCard
						bgColor="bg-pink-400"
						title="Doctor Visits"
						tasks={[]}
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
		<View className={`${bgColor} p-4 mt-4 rounded-lg`}>
			<Text className="text-white text-2xl font-semibold tracking-tight">
				{title}
			</Text>
			{tasks.length > 0 ? (
				tasks.map((task) => (
					<Text className="text-white text-2xl font-semibold tracking-tight">
						{task}
					</Text>
				))
			) : (
				<Text className="text-white text-xl font-semibold tracking-tight">
					{emptyTasksMessage}
				</Text>
			)}
		</View>
	);
};

{
	/* <Link href="/onboarding/personal-data">
<Text className="text-4xl font-semibold tracking-tight">
	Open test page
</Text>
</Link> */
}
