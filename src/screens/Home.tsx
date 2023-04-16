import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Layout from "@components/common/Layout";
import { ReminderType } from "@/types/storage";
import { db } from "@/lib/db";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useAppSettings } from "@/hooks/useStore";
import { filterRemindersByType } from "@/lib/utils";
import TasksCard from "../components/reminders/TasksCard";

const Home = () => {
	const [date, setDate] = useState(new Date());
	const isDarktheme = useAppSettings((s) => s.isDarktheme);
	const [reminders, setReminders] = useState([]);

	useEffect(() => {
		db.transaction((tx) => {
			fetchRemindersByDate(tx);
		}, null);
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

	return (
		<Layout pageHeading="Home">
			<Text className="text-gray-700 dark:text-gray-400 text-xl font-medium tracking-tight">
				Hows your day been? 💪
			</Text>

			<ScrollView className="mt-4 mb-16 dark" showsVerticalScrollIndicator={false}>
				<View className="flex-row items-center justify-center gap-4">
					{/* <Text className="text-center text-3xl tracking-tighter font-semibold dark:text-slate-200">
						{dayjs(date)?.format("D MMMM")}
					</Text> */}
					<DateTimePicker
						value={date}
						onChange={(event, selectedDate) => {
							if (event.type === "set") {
								setDate(selectedDate);
							}
						}}
						themeVariant={isDarktheme ? "dark" : "light"}
						maximumDate={new Date(2024, 10, 20)}
						minimumDate={new Date(2023, 0, 1)}
						mode="date"
					/>
				</View>
				<View>
					{[
						{
							bgColor: "bg-blue-400",
							textBgColor: "bg-blue-500",
							title: "Personal Growth",
							reminderType: ReminderType.PERSONAL_GROWTH,
						},
						{
							bgColor: "bg-orange-400",
							textBgColor: "bg-orange-500",
							title: "Medication",
							reminderType: ReminderType.MEDICATION,
						},
						{
							bgColor: "bg-pink-400",
							textBgColor: "bg-pink-500",
							title: "Doctor Visits",
							reminderType: ReminderType.DOCTOR_VISIT,
						},
					].map((item) => (
						<TasksCard
							key={item.reminderType}
							deleteReminderById={deleteReminderById}
							fetchRemindersByDate={fetchRemindersByDate}
							bgColor={item.bgColor}
							textBgColor={item.textBgColor}
							title={item.title}
							tasks={filterRemindersByType(reminders, item.reminderType)}
						/>
					))}
				</View>
			</ScrollView>
		</Layout>
	);
};

export default Home;
