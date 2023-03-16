import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewReminder = () => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [time, setTime] = useState("");
	const [task, setTask] = useState("");

	const saveReminder = async () => {
		const reminder = {
			startDate,
			endDate,
			time,
			task,
		};
		try {
			const reminders = await AsyncStorage.getItem("reminders");

			const parsedReminders = JSON.parse(reminders) || [];

			parsedReminders.push(reminder);
			await AsyncStorage.setItem("reminders", JSON.stringify(parsedReminders));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View>
			<TextInput
				placeholder="Start Date"
				value={startDate}
				onChangeText={setStartDate}
			/>
			<TextInput
				placeholder="End Date"
				value={endDate}
				onChangeText={setEndDate}
			/>
			<TextInput placeholder="Time" value={time} onChangeText={setTime} />
			<TextInput placeholder="Task" value={task} onChangeText={setTask} />
			<Button title="Save" onPress={saveReminder} />
		</View>
	);
};

export default NewReminder;
