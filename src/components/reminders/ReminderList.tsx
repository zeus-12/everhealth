import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import useStorage from "@hooks/useStorage";
import { getParsedData } from "@lib/utils";

const ReminderList = () => {
	const { getData, setData } = useStorage("reminders");
	const [reminders, setReminders] = useState([]);

	useEffect(() => {
		const getParsedReminders = async () => {
			const reminders = await getData();
			const parsedReminders = getParsedData(reminders);
			setReminders(parsedReminders);
		};

		getParsedReminders();
	}, []);

	return (
		<View>
			{reminders.map((reminder) => (
				<Text key={reminder.task}>{JSON.stringify(reminder)}</Text>
			))}
		</View>
	);
};

export default ReminderList;
