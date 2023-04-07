export interface Storage {
	hasOnboarded: boolean;
	isAuthenticatedAsGuest: false;

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
}

export interface Reminder {
	date: Date;
	isCompleted: boolean;
	task: string;
	type: ReminderType;
}

export enum ReminderType {
	PERSONAL_GROWTH = "PERSONAL_GROWTH",
	MEDICATION = "MEDICATION",
	DOCTOR_VISIT = "DOCTOR_VISIT",
}
