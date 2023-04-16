import { Reminder, ReminderType } from "@/types/storage";

export const getParsedData = (data: string) => {
	try {
		const parsedData = JSON.parse(data) || [];
		return parsedData;
	} catch (err) {
		console.log("Error parsing data:", err.message);
		return null;
	}
};

export const filterRemindersByType = (reminders, type: ReminderType) => {
	if (!reminders || reminders.length === 0) return [];

	// @ts-ignore
	const filteredTasks = reminders?.filter(
		(task: Reminder) => task.type === type
	);

	return filteredTasks?.map((ele, i) => ({ key: `${i}`, ...ele }));
};

export const convertTimeTo12Hour = (time: string) => {
	const splitTime = time.split(":");
	const hour = splitTime[0];
	const minutes = splitTime[1];

	const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
	const hour12 = parseInt(hour) % 12 || 12;

	return `${hour12}:${minutes} ${ampm}`;
};
