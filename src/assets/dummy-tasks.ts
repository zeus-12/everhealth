import { ReminderType } from "@/types/storage";

const data = [
	{
		date: Date.now(),
		isCompleted: false,
		task: "Go for a walk",
		type: ReminderType.PERSONAL_GROWTH,
	},
	{
		date: Date.now() - 100,
		isCompleted: false,
		task: "workout",
		type: ReminderType.PERSONAL_GROWTH,
	},
	{
		date: Date.now() - 2000,
		isCompleted: false,
		task: "Eat paracetamol",
		type: ReminderType.MEDICATION,
	},
	{
		date: Date.now() - 40,
		isCompleted: true,
		task: "Go to the doctor",
		type: ReminderType.DOCTOR_VISIT,
	},
	{
		date: Date.now() - 800,
		isCompleted: false,
		task: "visit radiologist",
		type: ReminderType.DOCTOR_VISIT,
	},
];

export default data;
