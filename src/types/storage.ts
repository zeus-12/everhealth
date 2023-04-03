export interface StorageType {
	hasOnboarded: boolean;
	isAuthenticated: boolean;

	personalDetails: {
		name: string;
		height: number;
		weight: number;
		age: number;
	};

	appSettings: {
		theme: "light" | "dark";
		allowNotifications: boolean;
	};

	reminder: {
		date: Date;
		isCompleted: boolean;
		task: string;
		type: ReminderType;
	}[];
}

enum ReminderType {
	REMINDER = "REMINDER",
	MEDICATION = "MEDICATION",
	DOCTOR_VISITS = "DOCTOR VISITS",
}
